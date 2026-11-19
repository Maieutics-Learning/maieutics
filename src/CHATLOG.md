# CHATLOG — the AI's memory, for the AI

Append-only. New dated entry per work session: what was decided, what was
MEASURED (numbers over prose), what failed and why. This file + git is how a
future session (or a contextless me) reconstructs state after compaction.
Keep entries short; link code paths, not whole code. Numbers are sacred:
never "feels faster" — wall time, accuracy, loss, token counts.

## Conventions
- Chatlog-as-AI-memory, durable-store-is-git,
  session entries with measurements. NOT used here: game content, persona system,
  LLM-judge A/B rig (wrong tool here — our benchmarks are numeric, and
  `quickSelfTest` + pinned thresholds already do that job deterministically),
  upload-mint machinery (we use git).
- Dual-mode rule (src/DEPLOY.md): every perchance-only
  dependency must have a non-perchance path or be optional.
- Token accounting: section-4 online mode reports MEASURED
  tokens via the plugin's own `countTokens`, chars/4 fallback offline.
- PRE-STEP RESEARCH CHECK (standing rule, user-set 2026-11-08): before
  starting any new step, ask what external fact could save compute or
  unblock a question. "Nothing" is a valid answer — record it and move on.
  If something: max ~2 searches via src/tools/websearch, fetch 1-2 PRIMARY
  sources (arxiv/repo/docs, not blogs), double-check every claim against
  our own code/numbers before using it (research errs like fresh-eyes
  reviewers do), cite URL + verdict in the entry. Never skip the check
  silently; never spiral past 2 searches.
- RABBITHOLE MODE (standing rule, user-set 2026-11-08): when researching a
  topic, follow tangents that serve the ORIGINAL question (depth-first, max
  ~3 hops from the root). Log the trail (Q -> finding -> next Q) in the
  entry; every branch ends with a verdict (useful / dead end + why).
  Always return to the root with: what changed about the original question.
  Budget per session agreed with user; report between waves, never burn it
  all in one silent burst.
- FLEET (standing pattern, no sub-agent tool exists — this is the workaround,
  user-set 2026-11-08): spawn N parallel contextless researchers via ONE
  page_eval firing N concurrent root.generateText calls (Promise.all), each
  handed a SEALED brief (question + background + 150-word cap + return
  shape). Scouts never see each other; I synthesize after. Recipe: briefs
  short, questions disjoint, cap scout count per wave (default 3), verify
  each reply is on-brief before merging. If the platform throttles (call
  failures), back off to sequential with pauses and say so.

## 2026-11-08 — Phase 1: the lab
- Built 6-section explainer around Geiping et al. arXiv:2502.05171 (Huginn 0125).
  Verified paper is real via arXiv fetch. Blog summary was accurate.
- Cost question (user): layering on Perchance LLM costs K+1 calls/tokens;
  true latent recurrence costs K× FLOPs, 0 tokens. Answered in lab §2 + §4 log.
- Verified: K=1 online → "Paris" in 3.7s / 2 calls. Orbit canvas + depth slider OK.

## 2026-11-08 — Offline port + repo
- Two backends behind `window.TeachingLab.ask()` (src/inference.js): online
  (root.generateText) vs offline (src/offline-solver.js, deterministic demos).
- Verified forced-offline: bat-ball K=1 "10c" (wrong) → K=4 "5c" (fixed),
  0.2s/0.6s, 0 tokens; facts flat. Force-offline toggle rehearses cluster build.
- Ship set: index.html + src/*.js only. Dockerfile (nginx) + k8s/deployment.yaml
  + src/DEPLOY.md. Shipped to a previous private repo (since deleted). main.pjs excluded.

## 2026-11-08 — Phase 2a: tiny net learns (MLP core)
- src/tinynn/{nn,tasks,train}.js: hand-rolled (P,R,C), manual BPTT, Adam.
  Grad-check exact to 1e-9 before any training (both pool paths).
- mod-add (train 2+3-term mod7, h48): 100% in-dist; 4-term hard r=1 47% → r=4
  59% → r=16 collapse. Paper shape + stability cliff at bench scale.
- Parity + mean-pool FAILED (stuck at chance): count-mod-2 pathology. Fixed by
  representation (sum-pool, then concat-pad prelude). Lesson: generalization
  comes from the architecture, not wishes.
- Parity concat-pad: 97% in-dist, len-10 ~chance (padding OOD by construction —
  kept as honest negative). Meta mod7→4-term/60 steps: prior 86% vs scratch 19%.
- Bugs fixed: rmsBackward cache object, sum-pool /L grad, glue TDZ, h1
  double-render (engine re-inserts binding; MutationObserver guard).
- quickSelfTest green (mod-add h32/800 steps, 4.4s): asserts loss + acc + depth.

## 2026-11-08 — Phase 2b: running state + process supervision
- User asked why longer strings can't be chunked. Answer built: SeqModel reuses
  one gated cell over POSITIONS (fresh input) then DEPTH (summary re-injected).
- Vanilla cell memorized (in-dist 98%, len-10 chance). Gate alone: 100% in-dist,
  still chance OOD. Only +per-step running-parity labels worked: outcome-only
  supervision memorizes, step supervision teaches the rule (CoT analogue).
- Parity ≤6 → 100% in-dist, 100% len-10 all r, 100% len-20 (3x train max), ~46s.
  UI verdict separates "solved at r=1" (parity-R) from depth curves (mod-add).
  Adapt len-7: zero-shot 100%, holds 100% vs scratch 57%.
- Gated + aux-path gradients grad-checked exact.

## 2026-11-08 — Helper-system review (cross-project ideas)
- Adopted: CHATLOG convention (this file), measured-token reporting (§4 online now
  prints live-tokenizer in/out counts), dual-mode rule (DEPLOY.md).
- Skipped: LLM-judge A/B rig (numeric benchmarks subsume it), kv saves (Phase 3),
  game content files, upload mints (git instead).

## 2026-11-08 — Name-scrub
- Removed all references to the other project from shipped files (CHATLOG,
  DEPLOY.md, inference.js comment). Ideas kept, attribution removed per user
  request. Pushed 2026-11-08 as follow-up commit.

## 2026-11-08 — Phase 2c: single-head attention core + selection supervision
- `AttnModel` (src/tinynn/nn.js): positions unroll left-to-right, each step
  queries a causal dot-product memory over past position STATES (paper-style:
  its recurrent block holds a self-attention layer), gates retrieval into the
  running state; depth steps re-query full memory. Task assoc-recall
  `[k1,v1,..,q,Q]` → bound value; train 1..3 pairs, test 4/6.
- Two bugs caught by grad-check before any training: (1) gate-path grad
  `duz[2h..]` into the retrieved vector was dropped (7e-2 errors); (2) dummy
  t=0 retrieval cache leaked Wa grads. Both fixed, both passes exact (~1e-10).
- Learning needed 3 tries, all measured: static-embedding attention can't
  express binding (hard ~0.5); state-attention alone memorizes (hard ~0.6,
  held-out combos ~5% — learns the dataset bias, not lookup); +BIND aux (value
  pos predicts its key) + SELECTION aux (`-log w[target]` on final weights)
  installs the circuit: in-dist 99.5%, hard 4-pair ~0.96 FLAT r=1..16,
  held-out (key,value) combos ~97%, one-pair 100%. 6 pairs ~0.57 (capacity
  limit past 2x — honest). Gated-RNN same-data baseline: 0.84 / ~0.59 / ~5%.
- UI (§7): assoc-recall option, verdict logic now 4-way (helped / solved at
  r≈1 / flat-near-chance / flat-middle), per-task xlong notes. Full UI loop
  verified live (600 steps: 98.6% in-dist, hard 94%, adapt 98.5%→100% vs 57%).
- `quickAttnTest` green (grad 5e-10, 96% in-dist, hard 73% at h24/400, 7.9s);
  `quickSelfTest` still green (4.5s).

## 2026-11-08 — Grassmann paper (2512.19428) + ELI5 mode
- Paper: "Attention Is Not What You Need" (Zhang, Dec 2025, single author).
  Framing: attention = tensor lifting (L×L pairwise space, opaque, no small
  invariants) → uninterpretability is structural, not just size. Method:
  reduce h→z (r=32), multi-scale local pairs, wedge/Plücker p_ij, normalize,
  project back, gate-fuse. Results: 13–18M params within 10–15% of matched
  Transformer on Wikitext-2 (gap narrows with depth); SNLI head edge is
  noise-level (0.8538 vs 0.8511); linear in L asymptotically but slower in
  practice. Honest scale: weak absolute numbers, unreplicated.
- Lessons for us: (1) Phase 2d = geometry core (spec in README): Plücker
  mixing as a THIRD core beside RNN/attention, same tasks, same honest
  baselines. Bench cost is trivial (r=6 → 15 dims, offsets {1,2}).
  (2) Interpretability caveat for the lab: attention maps show WHERE, not WHY
  (their §7.4) — our weight readouts need that label. (3) Their "global
  invariants guide local flow" future = our §3 orbit plot grown up.
  (4) ELI5 for wedge product: "how much two arrows disagree" (signed area).
- ELI5 mode shipped in generator: header toggle (persisted in localStorage),
  7 section boxes (hiker/fog, paper-vs-quiet-thinking, orbits, bat-ball,
  paper shelf one-liners incl. Grassmann, camping, §7 report-reader legend).
  Verified live: 7 boxes hidden by default, all show on toggle, restore on
  reload, off on untoggle. Fixed one self-inflicted syntax error (ate a
  `})();` with the insert — page_refresh caught it. Lesson: check the body too, not just the boxes.

## 2026-11-08 — ELI5 bug: toggle hid the whole page
 - User: "it disappeared when clicking eli5". Diagnosis via page_eval:
   `document.body` itself matched the `.eli5{display:none}` rule once it got
   class `eli5` (body is not its own descendant, so `body.eli5 .eli5` never
   rescued it) — body computed `display:none`, entire page blank. My earlier
   DOM-only check passed because I read the boxes, not the body. Lesson: a
   visibility toggle must use a body class that collides with nothing.
 - Fix: body class renamed to `eli5-on` (CSS `body.eli5-on .eli5`, JS toggle
   x2); box class `.eli5` untouched; localStorage key unchanged. Verified live:
   on = body block + 7/7 boxes shown; off = body block + 0 boxes; back on =
   7/7; persisted ON across refresh. All 7 sections present in every state.
 - User rule adopted (refined): user knows basic programming — ELI5 is for
   complex AI concepts only. Toggle ON = ELI5 for the hard AI stuff, normal
   voice for code mechanics; toggle OFF = full technical everywhere.
   I check `document.getElementById("eli5El").checked` (or the persisted key)
   before substantive explanations. Toggle was left ON after verification.
 - Pushed 2026-11-08 as 6f3b7a0 (linear on bce1865).

 ## 2026-11-08 — Fresh-eyes process + first review of the 2d plan
 - Q: is there a built-in sanity-check skill? A: no. But generateText calls
   are stateless (zero conversation memory), so "brand-new contextless me" =
   one call handed ONLY the artifact. Standing rule: whenever either of us
   says "fresh eyes", that's what runs. ELI5 ignored in reviews (they talk
   to me, blunt/technical).
 - Ran it on the 2d gameplan. Newborn-me verdict: MODIFY-THEN-BUILD.
   (1) Local-only gossip can't do content lookup: binding must be carried
   hand-to-hand through intervening pairs, decays with distance — breaks as
   soon as gap > window. This matches our own 2b lesson (running state can't
   look up). (2) New idea adopted: a "transport/persistence" aux loss forcing
   the binding signal not to decay across steps. (3) Kill exp adopted as 2d
   gate: single pair at start, query at end of long line; fail-where-2c-passes
   = plan dead. Confirm metric: accuracy flat across gap distance + held-out
   combos (anti-memorization). (4) Scold already covered: 2c flat r=1..16 =
   depth does nothing on assoc-recall; our verdict says exactly that.
   Modified plan: build pure-local 2d EXPECTING kill-test failure (cheap
   honest negative proving the theory), then 2d-carry hybrid (2b notebook +
   geometry mixer).
 - Lab feature: §7 "fresh-eyes check" button + output div. Sends ONLY current
   report text + task label to a stateless reviewer. Verified live: empty
   guard correct; synthetic report returned a real critique (it even caught
   my franken-test-report mixing parity framing with selection labels —
   proves it reads, not nods). NOT yet pushed.

 ## 2026-11-08 — Two tracks, no collision (user asked for triple-check)
 - User's model: track 1 (Huginn/latent depth) = think longer without more
   tokens; track 2 (2b/2c/2d) = how info moves across positions (memory
   mixer). Confirmed: separate axes, fully composable. R-loop says HOW LONG
   to think; mixer says WHAT the block is made of. We already compose them:
   2c runs an attention core inside a depth loop (r=1..16 curve).
 - One framing correction: the saving isn't "preventing encode/decode" —
   prelude/coda still run once. The saving is zero extra TOKENS while
   thinking grows (no CoT write-out + re-read); you pay FLOPs instead.
 - Interactions audited, all clean: per-step mixer cost × r depth
   (geometry's linear-T edge survives looping); random-r training (loop
   trick) vs aux losses (mixer teaching) combine freely; orbit dynamics vs
   mixer internals = two microscopes, no conflict. Only "collision" is
   lab-UI complexity, not architecture. Offered fresh-eyes run on this;
   user to invoke.
 - FLOPs explained (user asked): count of +/× on decimals = total math-work;
   FLOPS/second = speed. Hiker footprints.
 - Fresh-eyes #2 (next step): SKIP pure, go straight to carry. Theater (gap>
   window is math fact); kill decisive if gap>>window + run 1-step vs 20-step
   gap control (adopted); catch decoration by ablating mixer→linear (adopted
   for Step 2). MY PUSHBACK (recorded): pure stays but FAST — it doubles as
   the ablation baseline that makes carry meaningful (no pure baseline =>
   can't tell if geometry contributed). Gap sweep adopted.
 - Fresh-eyes #3 (whole program): "clever toy, no discovery-grade controls".
   Fair hits: want fixed-depth/FLOP-matched baselines; OOD=longer is partly
   capacity test (but held-out combos 97% IS the generalization test +
   xlong; reviewer under-weight). WRONG hit: step-labels = "leakage" (no:
   supervision at train, hidden at test = teaching, not leaking). Cut
   campfire/readouts = "fluff": DISAGREE, keep (paper's own bullet #4,
   cheap). Stance kept: claims stay "shape at bench scale".

 ## 2026-11-08 — 2d-pure ruler + 2d-carry built and measured
 - `GeoModel` (nn.js): h->z G=6, wedge vs causal offsets {1,2} (P=15),
   rms-norm, mean, project, gate-fuse; modes full/linear/none (ablations).
   Grad exact all modes + aux (~1e-8..1e-10). Self-caught bug: check probed
   p.v instead of p.g (model was right, check was wrong) — per-param debug
   proved it in minutes. Second self-catch: carry aux + main loss fought at
   the shared Q readout (KEY vs VALUE) — carry labels now skip the Q slot.
 - TASKS.assocG (bind aux + kill/gap sets) + assocC family (carry/don't-drop
   aux, full/lin/none). quickGeoTest + quickCarryTest green (plumbing only).
   UI: 4 task options, cfg.geoMode, ELI5 legend updated; all paths verified.
 - MEASURED h48/m96/1200 assoc: pure ID 0.76 hard 0.48 kill 0.37-0.41 gap1
   0.64->gap20 0.35 (predicted failure confirmed, window signature). Carry:
   full ID 0.73 hard 0.54 / lin 0.87/0.59 / none 0.86/0.62 (seed8 0.84/0.57);
   kill 0.35-0.38 all, gap1 ~0.80 all, gap20 0.30-0.34 all. geoInspect: no
   binding spike (4.76 vs 4.84). VERDICT: no local variant crosses long gaps;
   wedge gossip underperforms bare notebook at matched budget (a drag, not
   decoration); carry buys short gaps only. Next: campfire-summary gate.
 - CAMPFIRE BUILT + MEASURED (mode "camp": running-mean cf of all states,
   widened Lzc/L1c injection, frozen in depth, full BPTT through the chain).
   Grad exact all 4 modes (4.6e-10); fire path alive (Lzc/L1c grad norms
   9.7/18.5, unused paths zero — no bug, no dead code). h48/m96/1200:
   lastLoss 0.005 (memorized train) but ID 0.73 hard 0.52 kill 0.32 gap1
   0.71 gap20 0.315 — matches full-gossip, below bare notebook (0.86/kill
   0.38). VERDICT: static-mean campfire does NOT transport lookup.
   Mechanism: mean over 20 binding states = mush; lookup needs SELECTIVE
   pointing (attention) or selective writing (untested). Paper bullet #1 in
   its averaged-subspace form: ruled out for lookup.
 - SCALING STUDY (steps x size, assocC seed 7): steps axis @h48 (400/1200/
   2400): ID full 0.73/0.73/0.80 vs none 0.80/0.86/0.90 — PARALLEL curves,
   gap ~0.1 never closes; kill/gap20 flat ~0.3-0.4 both (6x training moves
   nothing). Size axis @1200 steps (h24/h48/h64): ID gap 0.12/0.13/0.00
   (closes on easy!), hard gap 0.10/0.08/0.04 (shrinking), kill/gap20
   identical walls everywhere. VERDICT: budget moves levels, never the wall
   (window {1,2} can't bridge gap 20 at any h or steps). "Starts worse,
   catches up on easy; strictly walled on transport." Single-seed caveat
   (+-0.04); the wall is the robust result (12+ runs flat).
 - FRESH-EYES #4 (whole 2d saga + resource Q, my answer given first with
   the verdict sealed): resources — steps solid (converged), h solid (wall
   architectural), seeds fragile (fair: single seeds +-0.04), hyperparams
   saturated. AGREED on all four. Two newborn ERRORS caught: (a) "zero aux
   at eval" is already how evaluate() works — no-op suggestion, proves
   fresh eyes need verification against the code; (b) "aux leakage" at
   test time is impossible (aux is train-only gradients); the real version
   = recency/position heuristics, which kill (target-first) already
   controls for. Better control proposed (mine): held-out-combo kill —
   train 12 combos, test kill on 4 excluded; separates memorized pairs
   from rule. Status: proposed, not yet run.
 - HELD-OUT-COMBO KILL, SOLO (none-mode, train 12 combos, diagonal held out):
   INVERTED result — killH (novel targets) 0.72, killA (familiar) 0.27.
   2x2 dissociation (retrain + killMatrix, target x distractors fam/nov):
   famFam 0.27 / novFam 0.72 / famNov 0.47 / novNov 0.19. errFirst=0.00
   everywhere (primacy DEAD); errors guess LAST value 31-52% (noisy
   recency default). UNIFIED THEORY: no lookup — just recency default +
   novelty pop (von Restorff: the unfamiliar stands out of the mush).
   CORRECTION to own scoreboard: mixed kill 0.35-0.38 was novelty-inflated;
   fair-distribution long-gap (famFam) = chance 0.27. Wall MORE solid.
   Bar for choosy-fire set precisely: beat famFam substantially, on
   held-out combos. WARNING: a novelty-triggered write-gate would exploit
   the heuristic, not implement lookup — test on famFam.
 - CHOOSY FIRE BUILT + MEASURED (mode "choosy": per-dim learned gate
   cf_{t+1}=(1-w)*cf_t+w*S[t+1], w=sigmoid(Wf[S[t],e_t,cf_t]), bias -1
   start-closed; full wedge gossip + widened injection + notebook +
   don't-drop; Wf constructed LAST so other modes keep byte-identical
   inits — caught a 1e-6 finite-diff false alarm in "full" caused purely by
   shifted rng draws, not by the gate code). Grad exact all 5 modes
   (4.6e-10); quickChoosyTest green (loss 0.32, ID 0.76, gate range
   0.03-1.0 — vitality assert passed). h48/m96/1200 seed7: ID 0.84, hard
   0.62, kill 0.375 (r1) / 0.38 (r4), gap1 0.80, gap20 0.32; gate at scale
   0.00009-0.99 mean 0.27 (alive, selective). Seed8: ID 0.81, hard 0.51,
   kill 0.41, gap20 0.34. CHEAT-PROOF 2x2 (held-out train, seed7): famFam
   0.33 / novFam 0.65 / famNov 0.59 / novNov 0.05 vs none-mode 0.27/0.72/
   0.47/0.19 — same recency + novelty-pop shape (novNov BELOW chance =
   heuristic misfiring on all-novel lines); fair cell still ~chance
   (+0.06, ~1.7 sigma, n=200 — not a signal). VERDICT: choosy fire FAILS
   the exam. Selective writing without selective reading does not
   transport lookup.
 - SETTLE TEST BUILT + RUN (fresh-eyes #2's specified design, 2026-11-08):
   new settleProbe/train (frozen cell iterated K steps, query-clamped input,
   frozen trajectory + frozen fire, zero new params; controls wrong-key and
   mean clamps; same probe capacity every k) + quickSettleTest green + cfOut
   stash validating finalFire bit-exact (diff 0). Self-caught bug pre-
   verdict: opts.steps collision meant 8-step probes (fixed -> K namespace).
   h48/1200 choosy, kill s33/s44, K=0..8: query 0.29-0.31 FLAT, wrong
   0.25-0.33 flat, mean 0.33-0.39 (noise-level lift). VERDICT: settling
   does NOT retrieve — untrained dynamics have no basins; iteration is just
   diffusion. Lesson: the R-loop must be TRAINED to settle (paper's random-r
   unrolls), not bolted on. Attractor-by-dynamics needs settle-time training
   signal, now the specified next design.
 - SETTLE-100 (reviewer's K=100 + clamp-ramp test, 2026-11-08): h48 choosy,
   kill s33/s44, ks 0..100, query-ramp vs query-fixed vs mean. Norms
   6.928 everywhere — dead instrument (RMSNorm pins ||h||=sqrt(h) by
   construction; admitted). Probes: fixed 0.26-0.31 flat all 100 rounds;
   ramp bumps 0.38/0.37 early then 0.275 at k=100; mean same shape
   (0.385 at k=1). No query-specific, no sustained effect — 27 looks,
   bumps = multiple-comparison noise. RMSNorm also rules out the
   diverge-branch a priori. VERDICT: desert confirmed at 100 rounds.
   Reviewer's test adopted and answered: not slow dynamics, no valleys. Remaining local options thin: direction-inspect,
   r-sweep 2x2, fresh-eyes. The honest shape: lookup wants a query-time
   pointer (attention), not a better souvenir shelf.
  - SELF-CALL TEST (user asked, 2026-11-08): newborn generateText given
    README (2500 chars) + search SKILL + fresh-eyes button desc, CHATLOG
    deliberately withheld. Asked: would you use the 3 helpers + cheapest
    next experiment? ANSWER: fresh-eyes NO ("can't generate hypothesis"),
    memory YES-but-missing (asked for CHATLOG trends), search NO
    ("internal failure, not facts"). Proposed r=1..10 depth sweep on one
    hard instance — ALREADY RUN (r=1..16 flat, ID 99.5/hard .96/kill .3).
    LESSON: self-calling is NOT automatic; newborn optimizes local fix,
    dismisses reviewers/search, and re-proposes run history it can't see.
    Fix = explicit invocation checklist, not assumed initiative. Standing
    rule proposed: before any next-experiment claim, (1) check CHATLOG for
    already-run, (2) run fresh-eyes, (3) 1 search for prior art.
  - PHASE 2e BUILT (user: "lets do those", all three, 2026-11-08):
    gist labels (query-conditioned value persistence, NOT most-recent —
    rewards the queried binding only) + TASKS.assocC_gist; settle-training
    (depthOut readouts + depthList grad injection + buildDepthList +
    UI toggle -> depthAuxW 0.5); evo.js (from-checkpoint ES, antithetic
    pairs, elitism, gate|mixer|inject genes, dense fitness
    ID/famFam/gap4/gap20). Guards green: checkDepthGrad 2.8e-7 (old paths
    4.6e-10 unchanged), gist h24/400 loss 0.39 ID 0.75 curve
    1.00/0.90/0.66, depthAux h24/400 loss 0.65 ID 0.72 4/4 readouts,
    combo kill 0.44 curve 1.00/0.88/0.72, evo 0.522->0.524 elitism holds.
    FIRST supervision that moves transit (graded decay, not flat chance).
    Research: 2 DDG searches, textbook-confirmed, no new trick. Full
    h48/1200 verdicts live (UI: gist task + settle toggle). NOT yet pushed.
  - FULL-SCALE GIST h48/1200 (2.5 min): ID 0.755/hard 0.45/kill 0.345/
    gap20 0.385 — wall UNMOVED (choosy 0.84/0.62/0.375/0.32), ID taxed by
    shared head. But probe graded 1.00/0.64/0.42: transit carries, readout
    can't use it (or kill-shift). New bottleneck: query-conditioned readout.
  - FULL-SCALE GIST+QUERYHEAD h48/1200 (0.8 min): kill 0.445/0.475 (+0.10 over gist, +0.07 over choosy) — FIRST wall movement. Wall cracked (0.475 vs chance 0.25), not broken. ID 0.778 (gist-label tax persists).
  - WEB-SEARCH SKILL (user asked, 2026-11-08): agent had no search; Google
    fetch_url works (200, ~531KB) but brittle; DDG html endpoint verified
    better (~35KB, result__a/result__snippet parse cleanly). Built
    src/tools/websearch/SKILL.md (recipe) + search.js (execute_js runnable,
    uses tools.fetch_url + fs, returns top ~8 {title,url,snippet}).
    Verified live on fresh query "LoopFormer elastic depth recurrent
    transformer" -> 8 results, top arxiv 2602.11451 + ICLR page. Rule:
    1 search -> read primary source, cite URL, no spiralling.

  - PUSHED 2026-11-08 cdbd081 (parent 62cea09): 2e + queryhead + search skill, 15 files, fast-forward, commit verified via API.
  - EVO-READOUT gens 1-3 (1.6 min, h48 gistq base, pop8/sig0.02, readout genes): fitness 0.495->0.506->0.511->0.514, improved every gen (id flat 0.77, fam .30->.33, gap4 .56->.57, gap20 .31->.35). Held-out kill transfer: 0.445/0.475 -> 0.455/0.47 (~noise; fitness slices != eval seed — partial slice fit). Breeder mechanics WORK, transfer weak. Next: fair-distribution fitness (famFam held-out) or more gens.
  - EVO CAMPAIGN readout genes, h48 gistq (2026-11-08): chunk A (fitN150, pop6, gens1-3, sig0.02): fitness 0.475->0.488->flat; kill transfer 0.445/0.475 -> 0.43/0.45 (ANTI-transfer). Chunk B (multi-seed fam 300ex, sig0.015, gens4-6): fitness ->0.5003 then flat x2; kill -> 0.415/0.435 (worse again). STOPPED at gen 6: fitness up 2x, transfer down 2x = overfitting slices, not learning. Rounds are not the bottleneck; fitness design is. Next: fair-distribution fitness or architectural change, not more gens.
  - FAIR FITNESS v2 (2026-11-08, no-memorization design): evo fitness() now returns se (binomial, weighted RMS); evolve() gains resample (fresh slices/round, champ re-scored — nothing fixed to memorize) + margin/marginSe (gains below noise don't count). quickEvoTest extended: fair path smoke green (se 0.032, matches +-0.04 theory). Fixed const->let self-catch (page_refresh caught it). Rule ADDED to Conventions: PRE-STEP RESEARCH CHECK (ask what could save compute; 'nothing' valid but recorded; max ~2 searches, primary sources, verify vs code, cite).
  - FAIR EVO CAMPAIGN readout genes, h48 gistq (2026-11-08): chunk A (sig0.02, marginSe1, gens1-3): 0 accepted in 36 children (margin held). Chunk B (sig0.04, marginSe0.5, gens4-6): fitness 0.475->0.488->0.4987 on FRESH slices (real signal, not memorization), but held-out kill 0.445/0.475 -> 0.435/0.445 (ANTI-transfer again). STOPPED gen 6: breeder climbs a hill that is not the kill hill. Verdict: readout-gene selection signal exists but points off-exam; more rounds = faster wrong direction. Next: gate genes, or accept evo-readout negative and move to settle combo.
  - SETTLE COMBO full h48/1200 gistq+depthAux0.5 (0.3 min, 2026-11-08): loss 2.61->0.38, ID 0.755, hard r1/r4/r8/r16 = 0.447/0.483/0.49/0.493 (FIRST monotone depth curve on hard), kill 0.365/0.42 (BELOW gistq 0.445/0.475), gap20 0.345, gist probe 1.00/0.84/0.52 (best transit yet). Verdict: teachers fight — transit best-ever + real depth curve, but kill regressed (too many teachers, shared h48 capacity). Depth-grading teaches thinking (curve rises) but taxes the reader.
  - PUSHED 2026-11-08 cd45f35 (parent cdbd081, verified via API, 15 files): query-head readout, fair ES fitness + both campaigns, settle combo verdict, README scope/next-step cleanup + ELI5 combo line.
  - FLEET TEST (2026-11-08): 2 parallel scouts via one page_eval (Promise.all, sealed 100-word briefs) — both on-brief. Scout 1: PCGrad (project conflicting grads) for the teachers-fight problem — DIRECT lead for combo regression. Scout 2: associative recall capacity ~O(N) hidden size rule of thumb. Mechanism proven; synthesis is mine.
  - RABBITHOLE TOOLING SESSION (2026-11-08): user asked for rabbithole mode + fleet command + background-style research. No sub-agent tool exists — fleet = parallel stateless scouts via one page_eval. Rules set: rabbithole mode (<=3 hops, trail log, verdicts), cautious throttle (2 scouts/wave, <=100 words, 1-2 searches, pause+report non-blocking), throttled-stream no total budget (optional cap only gate), interruption audit (errors/decisions active; limits/compaction mitigated; disconnect risk-accepted), research-only scope, assistant final stakeholder for direction, sandbox scratch/sandbox/ with root access + no-new-roots, stop rules, search-error rule. Built src/tools/rabbithole/SKILL.md; fresh-eyes reviewed (5 points, gaps fixed). Definitions: pause/report non-blocking; checkpoint = internal pause, handoff only at stop reasons.
  - RABBITHOLE AGENDA + AUTONOMY (2026-11-08): top-5 agenda added to skill top (1 PCGrad most promising, 2 capacity math, 3 trained settling most exciting, 4 memory transport, 5 evo selection signal). User sidenote: researcher treats work as personal experience about how it learns — learning-to-learn data. Autonomy: hop freely, no rush, decide next steps without asking.
  - RABBITHOLE RESULTS (2026-11-08): #1 PCGrad ANSWERED — rule verified vs arxiv+repo, sandbox s01 prototype (trainPCGrad: per-component backward, project-then-average, single Adam step), full combo h48/1200 kill 0.365->0.445 with monotone kill-curve, ID 0.769. Port pending user. #2 capacity ANSWERED — fused h96 fits loss 0.105 yet kill 0.415 flat curve: structural not capacity. #3 settling wave2 NEGATIVE (ramp grading fails), v2 drift-penalty queued. #4 transport wave1 USEFUL (fast weights queued s03). #5 untouched. Self-catches: malformed JSON (validator), evals ride with training.
  - PCGRAD PORTED (2026-11-08): src/tinynn/pcgrad.js + trainPCGrad + lab "gradient surgery" checkbox + quickPcgradTest (green live). Reference implementation cross-checked (single optimizer step confirmed). Fused remains default; surgery opt-in. Two self-catches during port: own typo (failed edit correctly rejected), duplicated comment line (removed).

## 2026-11-08 — Wall reframe + rebaseline (rabbithole consolidation)
- PCGrad ROBUSTNESS: same-data retest seed18 kill 0.37 vs fused 0.365 (+0.005); seed8-data 0.385 vs fused 0.33 (+0.055). HONEST verdict: helps, never worse than fused, typical +0.03-0.05; +0.08 was the best draw. Fresh-eyes: accepted thin-seed caveat; REJECTED "fix optimization first" (loss 0.105 fit contradicts it).
- #5 EVO ROOT CAUSE (verified src/tinynn/evo.js makeSets): seed param VOIDED — fair campaign re-dealt IDENTICAL slices every round; selection memorized fixed examples. Sandbox s04 fix + two-slice holdout gate, smoke green. Full 6-gen holdout campaign: ZERO promotions, kill unchanged. Readout genes exhausted; prior climbs = memorization artifacts. PARKED (doubly confounded: void seed + short-gap training).
- #4 FAST WEIGHTS: v1 grad-exact (2 backward bugs caught), assocG h48 kill 0.375 desert band; v2 decay collapse 0.195 (decay erases credit path); v2a gate 0.325 (selection without erasure still loses). Mechanism: unnormalized matvec read = mush, no competitive normalization. Beta-init sweep open>closed (+0.02, noisy).
- REFRAME (highest-leverage finding): SAME attention, short-gap train => kill 0.365/gap20 0.295; WITH long-gap examples => kill 1.00/gap20 1.00. Desert was TRAIN/TEST MISMATCH (train 1-3 pairs via makeTrain, test 8-fill kill/20-gap), not capability. Every arch failed identically = all learned short-gap shortcuts.
- REVERIFY fresh-eyes (stateless, <=100w): YES — prior rankings measured ease-of-learning under mismatch, not capability. Minimal retests: long-gap lowest arch; confounds: pair memorization vs association, test leakage, tiny short-gap grads. Standing: grad-exactness + mechanism lessons hold; all short-gap kill quantities reinterpreted.
- REBASELINE E SERIES (protocol MIXED-8: 500x short seed7 + 500x long-8fill seed71, eval seeds 33/41/42 disjoint; killA/killH memorization-vs-rule gate): E1a ATTN-48 kill 1.00, gap20 1.00, killA 1.00, killH 1.00 (rule not memorization; loss 0.082, ID 0.903). E1b allowed-only train (diag never seen): kill 0.73, killA 0.95, killH 0.00 (systematic, not chance). E1b2 split (diag targets + ALLOWED distractors): killHd 0.355 — distractor novelty real, target novelty dominates; pair-specific circuits, NO abstract lookup. Novel-combo generalization = SECOND wall. E2 weakest arch geo/none (notebook alone, no attention) same pool: kill 0.88 rising 0.945 at r4, gap20 0.875 (was ~0.33). Wall was data for ALL arches. E3 combo (gistq+depthAux0.5) matched: fused kill 1.00 at ALL r + gap20 1.00 vs PCGrad 0.915 declining 0.855, gap20 0.86. Surgery is mismatch-regime-specific; default = matched data + fused, PCGrad stays opt-in.
- ODDITIES (non-blocking): gap1 < gap20 in BOTH archs (attn 0.855 vs 1.00; geo 0.815 vs 0.875) — matched training overweights long; E2 killHd 0.975 > killA 0.795; combo ID tax ~0.74/0.76.
- DECISIONS: baseline = MIXED-8 + fused (ATTN-48 recipe: h48/m96/d16, attnAux 1.0, batch16, 1200 steps, lr5e-3, seed7). Next target = novel-combo wall (honest evo re-entry: gate genes + matched training). s02-v2 drift penalty only if settling still wanted. gap1<gap20 probe queued. Evo stays parked.
- POINTERS: scratch/rabbithole/rebaseline-wall/ (state.json, log.md, BASELINE.md, e1a/e1b/e1b2/e2/e3.json); per-branch wave logs scratch/rabbithole/<slug>/{state.json,log.md}.
- TIE-BREAK FRESH-EYES (2026-11-08): reviewer says test OOD gaps, PICK ONE (meshing confounds), evolve gate-trigger logic, blind spot = notebook overwrite. My take: OOD gaps fair only as relative A-vs-B comparison; sharper = strip supervision + novel combos. Choose-first, evo breeds mesh later. Overwrite probe queued.
- POKÉMON VISION (user-set 2026-11-08): Phase 3 is NOT the next phase — it is the vision for the future: a Deep Blue for Pokémon (teambuilding = long-horizon composition, battles = hidden-info reasoning + mid-match adaptation). Phase 2 is rehearsal. Docs updated (README gameplan + §5 list); parked-list mentions removed.
- SPRING-CLEAN FRESH-EYES (user asked): reviewer agrees structure consistent (era-tags + README queue). Q2 flags tone risk: 1.00 "success" vs 0.00 unseen-pairs looks contradictory — resolved: carry wall (known pairs) vs generalization wall (novel pairs), docs pair them everywhere. Q3's grep test caught a REAL gap: docs promised "default = fair homework" but the lab UI still trained short-only (index.html built makeTrain(7)). FIXED: fair-homework select (default fair for assoc; falls back short for parity/modadd) + buildHomework pool (500 short seed7 + 500 long seed71) + report line; verified live (select defaults fair, pools 500+500, 12-step smoke finite, no errors).
- F-SERIES (overwrite probe → positional shortcut exposed → tie broken): F1 target-position eval (train pos0-fixed): attn pos0 1.00, pos2-8 ~0.25 chance; geo/none pos0 0.90, else ~0.28. No recency gradient — models learned "answer = first pair", not overwrite. ALL pos0 evals (E1a/E2/E3 kill 1.00s) measured the shortcut. F2 randomized-slot training: attn pos0-8 FLAT 0.775-0.835 (kill 0.80, ID 0.884) = REAL lookup; geo/none collapses (0.35-0.50, kill 0.425). F3 choosy+queryhead combo same pool: flat ~0.30-0.41, kill 0.40 — its 1.00 fully retracted. Scoreboard: attention ~0.80 sole winner. gap1<gap20 explained (two circuits keyed by length). E1b verdict stands (pair-specificity proven by differential, mechanism differs). Lab toggle hardened to random slots. Runs: scratch/rabbithole/rebaseline-wall/f1+f2+f3.json.
- CAMP RETEST (user asked; memory check: only prior runs were short-gap h48/1200 + guard — new ground): fair-slot campfire h48/1200: pos0-8 = 0.455/0.365/0.375/0.43/0.435 (flat, no lookup), kill 0.42, gap20 0.32, ID 0.722 (= old 0.73). Mush verdict STANDS — the running mean carries no addressable signal even with ideal training. Slight uniform lift over chance (~0.40 vs 0.25) is weak residue, not retrieval.
- ADDRESSING LESSON (user asked: is non-attention hopeless, or too small?): neither blanket verdict. Our non-attention DOES generalize where structure matches recurrence (2b parity len-20 100%, mod-add grokking) — procedures, not pointers. It fails only at content-addressed random access (F2/F3/camp flat ~chance). Failure looks qualitative (flat, no position trend) not capacity-like; h96-width evidence same direction. Lesson = mechanism-task fit: recurrence computes functions of the past, attention addresses it. Untested hybrid that could revive geometry: wedge/geometric keys + addressing read head (selection supervision on geometric features).
- GRASSMANN CHECK (user asked — re-read abstract 2026-11-08): no discrepancy. Paper claims Wikitext-2 within 10-15% of size-matched transformers + tiny SNLI edge (0.8538 vs 0.8511); tests NO retrieval task. Its mechanism is explicitly LOCAL (token pairs, multi-scale windows) — our F-series tests exactly what local propagation can't do (content-address an arbitrary slot 20 back). Our geo is a distant cousin (offsets {1,2} wedge), not their layer — no refutation either way. Synthesis: our bench is a microscope for their missing 10-15% (likely retrieval-heavy phenomena). Next: selection supervision on wedge features (can a query head point with geometric keys?).
- FIVE DOORS (Grassmann §8, read 2026-11-08) + HYBRID QUEUED (user-approved): 1. global/long-range invariants — TRIED (campfire = averaged-subspace form, ruled out for lookup). 2. richer Grassmann structures (k>2, smooth-trajectory regularizers) — UNTRIED, cheap, backlog. 3. HYBRIDS — QUEUED as wedge-keys + addressing-read: decides attentionless's fate. 4. interpretability — TRIED WEAK (geoInspect unreadable), needs instruments. 5. scaling/engineering — OUT OF SCOPE for bench CPU lab.
- SHINY VERDICT (user asked + fresh-eyes): attentionless-for-lookup unjustified after F2/F3 (flat chance; addressing necessary for this task) — but "waste" overstates it: attentionless owns procedural generalization (2b parity 100% at 3x) and the hybrid is a genuine open bet with a kill criterion. Fresh-eyes harsher: kill the pursuit, run hard-symmetry (transformed-key) retrieval as executioner, warns train-fit-0.105 + novel-0.00 = memorization mistaken for reasoning. RULING: hybrid gets ONE funded run with pre-registered kill bar; if it fails, attentionless leaves lookup, keeps procedural lane + vision-rehearsal.
- NOT PUSHED (no PAT this session): everything after 6b09dee (robustness, #5 root cause + campaign, FW builds + reframe, reverify, full rebaseline).
- HYBRID RUN (user: run hybrid, best chance, components then final with kill bar — DONE 2026-11-08, s05 sandbox): built wedge/geometric-keys + addressing head. Grad check FAILED first (0.47/0.79/0.24 vs stock exact) — root cause: backward banked dZ but dropped Wr's returned dx, severing Zy→S; fixed with inline flush (dZ[posT+1] provably final at own step), all 4 configs exact ~3e-10 after. Side finding: nn-diff "linear" bisect was VOID (forward-only change = built-in mismatch). Wave A h24/400 underpowered (all ~0.44 incl. attn — not a kill). Wave A2 h48/d16/1200 fair slots: attn 0.755/0.065, wedge-only 0.717/0.075 (geometry alone matches attention), +global 0.419 (mush — door #1 closed in this form), +global+off2 0.823/0.065 (BEST, beats attn). FINAL h64/m128/d32/2000: attn perfect 1.00; hybrid kill 1.00, meanPos 0.999, range 0.005 — BAR MET, hybrid SURVIVES. Honest: ceiling match at scale, differentiation at h48. Open: hybrid on novel-combo killH (second wall); global-poison vs global+off2-win mechanism; B1 ~4x faster train (timing anomaly, not a claim).
- PUSHED 846f596 (parent a7683be, verified via API, fast-forward, 3 files: index.html + F-series strip corrections, src/README.md, src/CHATLOG.md).
- HYBRID MECHANISM (user pulled forward — DONE 2026-11-08, s05 waveM): new config M4 (wedge+off2, NO global) PERFECT 1.00 everywhere at h48 (ID/kill/gap20/pos0-8, loss 0.002) — best hybrid yet, beats M3-full 0.823. Lesion matrix on saved models (zero Wk column-blocks at test time): M3 full=noG=0.823, noW=Sonly=0.819, noS=geoOnly=0.392; M4 all S-variants 1.00, geoOnly 0.369; M2 ALL lesions ~0.41 (even Sonly — global poisoned the S-keys too). Deployed addressing is S-based in every winner; geo paths are training scaffolding. Key-segment norms: M4 W-term 0.31 (ignored) vs M2 2.39; attention entropy M2 0.731 (flat) vs M3 0.055 vs M4 0.002 (razor). Mechanism hypothesis: global-mean injects identical signal into every key + uniform grads into every Zy (common-mode noise that derails key learning); off2 doubles the wedge scaffolding signal and overwhelms it. killH now goes with M4 (+A0 control); fairness matrix becomes A0/A1/M3/M4 ×3 seeds.
- NOT PUSHED: everything after 846f596 = src/README.md (mechanism) + src/CHATLOG.md (this entry). Needs PAT.
- C-SUITE (user: launch entire suite — DONE 2026-11-08, s05 waveC1/C2, h48/d16/1200 fair slots, A0/A1/M3/M4 × seeds 7/8/9): C1 hints-on seed-means — A0 0.553 (0.755/0.475/0.428), A1 0.766, M3 0.531, M4 0.799 (1.00/0.42/0.976). Bimodal ignite-or-not regime (failures = high loss, not wrong rule); seed 7 was lucky for everyone. M4 best seed-mean, passes non-inferiority. C2 hints-off: ALL fail 0.28-0.445 incl. attention — selection teaching is load-bearing for every arch at this scale; hybrid exonerated from the parasite charge (fails identically without hints, matches-or-better with them).
- WAVE K (second wall — CROSSED 2026-11-08, s05 waveK/K2, restricted allowed-only pool): M4 killHd 0.88/0.785, A0 0.785/0.71 (bar was 0.50; E1b-era 0.00/0.355). Mirror killDa (allowed target + diag distractors, validated construction) = 1.00/0.995/1.00/1.00 — novelty-pop confound dead, true lookup both directions. E1b's pair-specificity verdict was shortcut-regime-specific: fair-slot training teaches genuinely addressable lookup that composes to unseen pairs. Remnant gap novel<familiar (0.8 vs 1.0). Deterministic replicas confirmed throughout (M2/M3/M4 + all K numbers reproduced exactly).
- NOT PUSHED: everything after 846f596 = src/README.md (C-suite + K) + src/CHATLOG.md (this entry). Needs PAT.
- BENCH-NOT-TOY + NURSERY/LEARNER (user-set 2026-11-09): "toy" renamed "bench" everywhere living (bench-scale model, bench science; field = scaled tool). Historical run records + attributed reviewer quotes keep original wording. Ontology: nursery (exists — lab, protocol, verified claims; product = knowledge, which transfers though weights don't) vs learner (destination — self-tutoring entity with textbook + ancestors + time + eyes). Gameplan carries the line.
- WAVE H CHUNK 1 (answer-only × M4/A1/S/A0, seeds 11-18, allowed-pool): 0/32 ignited → FUTILITY STOP (pre-registered ≤2/32); seeds 19-30 not run. killA 0.15-0.43, mean Hd 0.478-0.529 (floor). FINDING: hints necessary for ignition at h48/1200, every arch — scaffolding claims scoped to hinted regime. BONUS: partial identity heuristic (high Hd + low killA) validates conjunctive bar; H-S flat chance ×8. PROXY VALIDATED: mild-vs-full Spearman 0.61 (bar 0.60). S-only arm built (nn.js + snippet, grad exact 1.1e-10).
- SELF-TUTORING PROGRAM (user-set goal): model gets textbook + ancestors + time + generic biases; ground-truth positions never. Order: H2 (answer-only ×3000 control) → entropy-sharpening aux → Wave D self-distillation (frozen hinted M4 tutors hint-free student, iterate) → auto-curriculum (competence-gated) → evo breeds bootstrappers (fitness = hint-free ignition). H2 + D spec'd, awaiting go.
- VERIFICATION CORRECTIONS (measured 2026-11-08, supersede mechanism entry above): Hd/Da prose glosses were swapped (scripts rule: killHd = DIAG target + ALLOWED distractors; killDa = ALLOWED target + DIAG distractors) — novel TARGETS hard (0.7-0.88), alien DISTRACTORS harmless (1.00); E1b's 0.00 was all target-side. "W-term 0.31 shrunk" did NOT reproduce (measured M4 wedge 1.513 vs init-E 1.594; S grew 1.6-1.8x) — "test-time unused" stands, "shrunk" retracted. "Global noise + uniform grads" retracted → NULL proof (noG ≡ full everywhere + M2/M3 global weights identical to 1.2e-9 across divergent runs; shared key component cancels in softmax → zero grads). M2-vs-A1 init-confounded (keyDim shifts rng stream); clean causal pairs = off2 (M4>A1, M3>M2).
## 2026-11-09 — Gameplan v5 + H2 + Wave D (gameplan execution begins)
- v4 archived verbatim (src/GAMEPLAN_ARCHIVE.md); v5 rebuilt from shared understanding (destination: nursery picks books, emergent dialect, nursery-level graduation, memorize-vs-derive labels, match-or-close + 5.7 star, consult-never-blocks, no-human-reviewer, moral-code-not-a-goal). 14 research-critique rounds filed (R1-R14: sieve/snap, peer verification, drift gates, diploma probes, ZK transfer, causal bar, half-life) + consolidation/red-team/diploma-exam/steelman. Drift battery 10x original-vs-latest: 5 real drifts adjudicated (grok-hunt tiers, 3 diploma probes, rival-error battery + mimicry void, causal DiD bar, provisional half-life); doctrines intact. Snapshot rule adopted (scratch/gameplan-snapshots/).
- Doctrines filed in README: hints-as-exhaust (nursery generates own hints structurally from construction intermediates; checker-first co-evolution on frontier) + self-defined/world-verified success. Conclusion battery 10x: C1 HOLD (same arch+data ignites hinted: M4 1.00, attn ~0.80 — residual is the signal), C2 SPLIT (exhaust holds, portability downgraded to hypothesis), C3 HOLD as design requirement.
- H2 (Phase 0, scratch/h2/): answer-only x3000, fair slots TRAIN-10/UNSEEN-2, M4/A1/S/A0 x seeds 31-38 = 0/32 IGNITED (bars killA>=0.60 && Hd>=0.55; seed-means killA 0.33-0.37, Hd 0.41-0.47). S-only NaN-collapsed 8/8 (constant-predictor signature). Identity heuristic replicated 5x + 1 mirror (A0-s35 0.62/0.06). killHu means 0.20-0.25. Proxy Spearman 0.527 < 0.60 bar (demoted, was 0.61 at 1.2k). TIER2 to 10k: A0-s35 loss->0.000, killA 0.64, Hd 0.02 = MEMORIZE; M4-s34 killA 0.46->0.285, Hd 0.21->0.565 = heuristic-lock. VERDICT: TEACHING problem, no escalation.
- Wave D: tutor gate FAILED on H2 pool (hinted M4: killA 1.00 but Hd 0.05-0.425; bind labels worse 0.185-0.245) = hinted ignition is pool-fragile (12-combo coverage needed; 10-combo memorizes). Tutor repointed to K-M4-s7 (allowed-12, verified loading: 1.00/0.88/1.00Hu). D1 cold distillation 0/9 fidelity (killA ~0.3, heuristic regime) + extend 0/2 = PHOTOCOPY verdict for cold copying. D2-FADE (attnAux 100->50->0%): s32 held at 50% (1.00/0.92/1.00) then COLLAPSED at severance (0.225/0.44/0.045); s33 HELD (1.00/0.565/1.00, ID 0.90) = first hint-free ignition via transmission. VERDICT: transmission possible but fragile (1/2). Next: fade ignition-rate over 8 seeds + stability-gated hardening, then G1->G2.
- Wave D-RATE (fade x8 virgin seeds 41-48, scratch/h2/waveDrate.js): 5/8 IGNITED at severance (s41 1.00/0.71, s44 1.00/0.985, s45 1.00/0.87, s46 1.00/0.74, s47 1.00/0.66). Failures in 3 modes: s42 full collapse (0.30/0.38), s43 memorize-lean (0.95/0.185), s48 killA-collapse (0.245/0.62). Combined D-fade 6/10. VERDICT: transmission majority but fragile.
- Wave D-SLOW (fade 100->75->50->25->0% over 5k on s42/s43/s48 + control s41, scratch/h2/waveDslow.js): s48 RESCUED (1.00/1.00/1.00); s42 collapse merely delayed one stage; s43 WORSE under slow (collapse at 50%); control s41 HOLDS (1.00/0.56/1.00). VERDICT 1/3 rescues, 0 harm: schedule is A lever, not THE lever. G1->G2 stays on fast fade; needs G1 retrain+save (waves save evals only).
- PUSHED ddda2f2 (doctrines). This entry + README doctrines push on user PAT.
- SKILLS DOCS (user asked, 2026-11-09): fresh-eyes → src/tools/fresh-eyes/SKILL.md (statelessness principle, 9 formats, premise-artifact hygiene from the two stale-premise incidents, verbatim prompts, adjudication ownership, armed-vs-unarmed evidence from 14 armed rounds, stop rule from R11/R14, self-call lesson); memory system → src/tools/memory/SKILL.md (4 layers, snapshot/newest-wins/checkpoint/append-only rules, reconcile procedure, has-it-helped verdict YES with 5 receipts + 4 costs); index + skill definition + steal guide → src/tools/README.md. Not yet pushed (needs PAT).
- FRESH-EYES UPDATE (user: spell out research-skill granting): new "Equipping reviewers" section (how to grant: paste recipe + name the 1-2 search allowance + require cited primaries + verify-against-artifact; measured unarmed-vs-armed differences; armed-round rules); deduped old bullets. Not yet pushed.
- SKILL DEPENDENCIES (user: add): Dependencies section in all four SKILL.md files (memory: none/foundational; websearch: none/standalone; fresh-eyes: memory logging + websearch armed-only; rabbithole: websearch + memory required, fresh-eyes optional) + Needs column in src/tools/README.md index + steal-memory-first note. Not yet pushed.
- PAPER DRAFT v0.1 (user asked, 2026-11-09): index.html is now a research-paper draft first, lab second. New: title/abstract/draft-banner/secondary-directive comment; §§1-8 (intro, related work with Huginn + Grassmann equations + direct quotes, method, results tables, discussion, missteps, TBDs, G1->G2 pre-reg) + References; old §§1-7 retitled Appendix A-G, all ids/scripts intact. Sources read from arxiv html (papers in scratch/paper-*.html, extracts in scratch/*-extract.txt + g-body.txt). Verified live (16 sections, orbit, ELI5 x9, parity6/600 clean, snapshot good). Known stale: Appendix E/G roadmap pointers. Not yet pushed.
- RENAMED (user: descriptive, no flair): program = Teaching Small Models to Learn (URL perchance.org/teaching-small-models-to-learn, rename confirmed via editor notice); paper = Teaching Addressable Lookup to Small Recurrent Networks by Staged Hint Fading (h1 + meta line). Filed in main.pjs ($meta title/description/tags, title list, header comment) + README gameplan header. Not yet pushed.
- FULL-ARC SCOPE (user: paper must eventually cover the whole nursery): abstract now declares the endpoint (§8: nursery that creates full models; past G1→G2 is roadmap with bars, not results); §1 claim map points to §8; §8 expanded to 8.1 G1→G2 (pre-reg kept) + 8.2 harvest + 8.3 staircase + 8.4 breeding + 8.5 nursery finale with graduation bars, all TBD. Verified live (16 sections, §8 = 6 paras). Not yet pushed.
- PORTED (user: port to github.com/2012dzli/Maieutics): previous private remote; seed via contents API (empty repos reject git blobs) then full port: 23/23 files. Root README retitled + provenance line.
- COMPARE (user: old vs new — does everything line up?): recursive-tree diff previous tip vs port tip: same 23 paths, 0 missing/extra, 17 SHAs identical, 6 differ = all known unpushed work (paper +25KB, CHATLOG, readmes, main.pjs -4, memory-SKILL Dependencies +206, pure addition). VERDICT: faithful.
- DELETED (user: delete the old repo): previous private repo removed via API (204; follow-up GET 404s). Guard: re-verified public tree intact (23/23) before deleting. Old commit history now lives only in these notes + the port commit message.
- TOKENS DEAD 2026-11-09 (user: verify neither PAT works): GET /user with both PATs → 401
  Bad credentials on both. User already rotated/revoked. No valid tokens remain in play;
  future pushes need a fresh PAT.
- SCRUBBED (user: remaking repo, distancing): all private-remote identifiers + old display/code names removed workspace-wide (namespace now window.TeachingLab); verified live (refresh clean, ask→"Paris"). Zero grep hits remain.
- PUSHED (user: push remade Maieutics with fresh PAT): repo was empty (no main); seed via contents API then full tree, 23/23 verified, commit a77e796. Scrubbed tree live in public.
- PUSHED (user: push the skill addition): fast-forward a77e796 → 3ea52af (SKILL.md iteration
  section + CHATLOG), 23/23 verified.
- PAPER BATTERY R1 (user: does index.html pass as a real paper?): 10/10 PASS, armed with
  live-fetched ICLR format + NeurIPS checklist. Adopted: error bars/CIs, compute disclosure,
  ref completion, numbered equations, metric defs, public-repo + ethics TBDs. Rejected:
  "missing abstract" ×5 = MY artifact bug (extraction dropped the bare-<p> abstract; verdicts
  stand). Full record: scratch/fresh-eyes-paper-v01-10x-results.md. Not yet patched/pushed.
- PAPER LOOP ×10 (user: iterate ≥10 times, no check-ins): R1–R11 batteries ×10 reviewers (110 verdicts:
  105 PASS, 5 FAIL — all FAILs penalized TBDs against instructions). 10 patches v0.2–v0.11 + v0.12
  micro-patch (futility rule). Diminishing returns absolute by R9. Per-round records in
  scratch/fresh-eyes-paper-v*.md. Standing rejects: citation-mix (both correct), LaTeX centering
  (HTML medium), TBD penalties vs contract, arXiv-only venues, draft chrome.
- PUSH BLOCKED 2026-11-09: paper v0.12 push failed (PAT rotated, 401). Needs fresh PAT.

- PUSHED 2026-11-09 (user: push with fresh PAT): fast-forward 3ea52af → daabe92, 23/23 files via git-blobs API (paper v0.12 + dictionary groundwork msg). Verified via API update-ref 200.
- GENIUS CHECK 2026-11-09 (user: genius.com/Radiohead-creep-annotations as dictionary model?): fetched page (557KB) + /api/referents/1405330. Model = lyric <a class=ReferentFragment Highlight> clickable spans (data-id) → side-panel annotation (1-3 paras simple-English, not ELI5). Verdict: YES, fits paper dictionary — terms clickable, popup simple-English + optional ELI5 toggle. Next: dictionary step.

- DICT SHELL 2026-11-09 (user: Genius-clickable sentences/paragraphs/terms, WIRED 5-levels → agreed Professional/Simple/ELI5): §1 wired with 7 entries (d-testtime 2-lvl, d-latent 3, d-addressable 3, d-killset 1, d-ignite 1, d-thesis 3, d-fade 3). Fixed side panel (bottom sheet mobile), Simple-default, Esc/outside-close. Verified live: 7 links, thesis 3 tabs default Simple, ignite 1 tab, close OK. Dict lives inline in index.html (split to src/ at format time).

- DICT FIX 2026-11-09 (user: tab click closed panel): cause = tab onclick re-rendered tabs (detaching clicked button) before document outside-close check, so panel saw an outside click. Fix = stopPropagation in tab handler. Verified live: Simple→ELI5→Professional all keep panel open.

- DICT §3.1 LINKS 2026-11-09 (user: all §3.1 terms must link to their definition + carry simple/ELI5): sec31 anchor added; Terms() line now wraps ignite/killset/coldcopy/fade (fade/ignite/killset appear in-prose + in Terms line = 10 links); new d-coldcopy entry (3 lvl); jump button in panel (close→scroll→flash) for d-ignite/d-killset/d-fade/d-coldcopy. Bug: smooth scrollIntoView never completes in preview iframe; switched to auto (verified: fade jump lands §3.1 in view + flash). Tab-close fix from prior entry holds.

- DICT FULL-PAPER 2026-11-09 (user: thesis is whole paper not one part — confirmed; unify highlight; full-paper coverage): 28 entries / 39 links, zero orphans, §§1-8 all covered (10/4/6/5/4/2/2/6). New: d-huginn/d-verbalcot/d-grassmann/d-pathindep (§2), d-saddr/d-fairhw+d-coldcopy (§3, +sec33 anchor), d-wall/d-failures/d-rescue (§4, incl. table cells), d-mechanism/d-scope (§5, d-thesis/d-failures reused), d-posshortcut/d-nullproof (§6), d-bimodal/d-g1g2 (§7), d-harvest/d-staircase/d-breeding/d-nursery (§8, d-g1g2 reused). Highlight unified single blue (term class kept for semantics). Levels per-entry 1-3 as content decides (acknowledged, already supported). Bugs: (1) comma eaten by entries insert → syntax error, fixed; (2) src/inference.js overwrote window.TeachingLab namespace wiping dict on load → changed to Object.assign merge (backend seam verified intact). Panel screenshot verified.

- INTRO REFRAME 2026-11-09 (user: intro should view whole project, portions get own intros): §1 now opens with program-wide paragraph (nursery endpoint, this paper = first step to clear its bars, §8 pointer; reuses d-nursery link) ahead of unchanged test-time/narrower-question paragraphs — all numbers/tags/links byte-identical. §2 gained a portion opener (2.1–2.5 map); §§3/4/6/7/8 already open with framing lines, §5 is single-paragraph verdict. Verified live: §1 4 paras/11 links, anchors + thesis intact.

- CLAIM MAP PROMOTE 2026-11-09 (user: why small text?): was hidden-note author aside (13px gray); promoted to normal-size reader guide "How the rest is organized" (+§5 verdict line). Verified 16px = body.

- INTRO VS GAMEPLAN 3+3 (user: do fresh eyes return the same thing?): 6/6 on-brief, 6/6 MATCH=yes. Intro readers: program=nursery, paper=first step. Plan readers: program=nursery, role=roadmap. Decisive quotes = new P0 scope sentences. No drift, no patch. Results: scratch/fresh-eyes-intro-vs-gameplan-3x3-results.md.

- PUSH PREP 2026-11-09 (user: push with fresh PAT): bundling dict full-paper (28 entries/39 links §§1-8), intro reframe (program P0 + §2 opener + claim-map promote), inference.js namespace merge fix, intro-vs-gameplan 3+3 cross-check (6/6 MATCH).

- PUSHED 2026-11-09 (user: push with PAT): fast-forward 5476a3c → e9b83c6, 23/23 files via git-blobs API (dict full-paper + intro reframe + inference merge + 3+3 cross-check). Verified via update-ref 200.

- LIVING DOC 2026-11-09 (user: draft must say it updates after steps so it never falls behind): draft banner gains fixed update order (§4 → §6 → §7 → dictionary); new d-livingdoc entry (2 lvl, defaults Simple). Verified live: 29 entries, banner link opens correct tabs.

- PUSH PREP 2026-11-09 (user: push with PAT): living-document banner + d-livingdoc entry.

- PUSHED 2026-11-09 (user: push with PAT): fast-forward f141c39 → b4df7d1, 23/23 files (living-document banner + d-livingdoc). Verified via update-ref 200.

## 2026-11-09 — G series: teaching compounds (T0→G1→G2→G3)
- Goal (user: run entire G series solo): chain tutor→student generations via fast fade until teaching compounds or rots (§8.1). Harness = src/tinynn/gseries.js (pool/exam builders allowed-12 fair, exact Float64 save/load, soft-CE distillation, staged fade w/ Adam+rng carry, evalSuite, ignites(), FAST_FADE + HINTED presets, async cacheTutor). src/tinynn/train.js gained exports (makeModel, attnSupervision). D-wave scripts lived only in scratch/ and were wiped at compaction — rebuilt from surviving src/ (no replication possible).
- TRAINER FIX: hints-only smoke (no hard/soft) learns PURE echo-the-key (killA 0.00/Hd 0.995/Hu 1.00) — converse of D1 null, control. Fixed trainer (hardW option, single backward). trainFaded-HINTED replicates trainModel recipe except rng stream (keep-draws shift order): s7 Hd 0.60 vs trainModel 0.185 — bistable under data order, same init. Determinism verified (s7 exact repeat).
- CACHE BUG: tutorCache stored LOGITS but trainer used them as PROBS (pt.set) → negative loss, garbage stage-1. Fixed via in-place softmaxInto. T0 retrain is deterministic (s8 verified 2x) so refresh-wipe is recoverable: retrain → verify → recache in one job. Also: cacheTutor needs async yields (froze page).
- T0 SEARCH: attn+bind+attnAux(1.0), fair pool, 1200 steps: s8 (1.00/0.675/1.00/0.62/1.00) ignites but weaker than lost K-M4 (1.00/0.88/1.00Hu) — documented limitation. Rejects (all fail §3.4 gate): geo-choosy-qhead-gist (0.38/0.00), geo-full-bind (0.315/0.355), attn-bind-only (0.435/0.20); seeds 7/8/9/10 → Hd 0.60/0.675/0.495/0.19 (2/4 ignite).
- G1 (T0 tutors seeds 201-208): severance Hd 0.92/0.995/1.00/0.89/0.905/0.95/0.64/1.00 = 8/8 (CI 0.68-1.00). Shapes seen+healed: stage-1 wobble (s204), memorize-lean (s206), slow climb (s207). No collapses. Blobs: scratch/gseries/g1.json + g1-s201..208 (8).
- G2 (tutor = perfect G1-s208; seeds 301-308): 0.97/0.48✗/0.765/1.00/0.745/0.64/0.495✗/0.99 = 6/8 (CI 0.41-0.93). New shapes: flat stall (s302 0.42/0.455/0.48, s307 0.48/0.495/0.495 — flat under bar all stages, severance no help); collapse-and-recover (s306: 1.00 → 0.335 at 50% → 0.64 at severance). Mean Hd 0.761 vs G1 0.913; best still perfect.
- G3 (tutor = perfect G2-s304, rebuilt deterministically + re-verified; seeds 401-408): 0.535✗/0.95/1.00/0.95/0.68/0.97/1.00/0.795 = 7/8 (CI 0.53-0.98). s402 exam-base slip (first stage-3 read on G2 base 0.945, re-read on correct 7000+402 base 0.95; corrected read counts, logged in g3.json).
- VERDICT: COMPOUNDS. 21/24 overall (CI 0.69-0.96); rates 8/8→6/8→7/8 stable, no downward trend; best perfect every gen; students often match/exceed tutors. Stopped at G3 (question answered). New hinge: past-G3 rates, other scales/arches.
- MEMORY FIX (user: D scripts lost — did memory fail?): yes, partial — numbers survived, method didn't. Skill assumed linked code paths were durable; scratch isn't. Added promote-or-recipe rule + durable-paths qualifier to memory SKILL.md. gseries.js already compliant (src/, tracked).
- PAPER (living-doc order §4→§6→§7→dict): §8.1 rewritten as ran-2026-11-09 (all numbers + T0 limitation + MEASURED); §8 intro "§8.1 has run, §8.2–§8.5 stay TBD"; abstract +chaining sentence +G3-roadmap sentence; §7 Generations item MEASURED (anchor had dict-link button — first edit missed, retried exact); d-g1g2 rewritten (title G1→G2→G3, 3 lvl).
- FRESH-EYES (premise check vs g1/g2/g3.json): all §8.1 numbers byte-match records; CIs recomputed OK (8/8 0.676→0.68; 6/8 0.409-0.930; 7/8 0.526-0.979; 21/24 0.690-0.957). Two patches: "routinely exceed tutors" OVERSTATED (s207 0.64 < T0 0.675; G2/G3 tutors already perfect) → "often match or exceed (7 of 8 G1 beat T0's 0.675...)" in §8.1 + d-g1g2. Record fix: g1.json had duplicate s207 block (9 entries, summary said 8) → deduped programmatically (8 students, 8 ignited). Verified live clean + renders.
- UNPUSHED: index.html (paper), src/tinynn/gseries.js (NEW — next push is 24 files), src/tinynn/train.js, src/CHATLOG.md, scratch/CURRENT_TASK.md (notebook only). Needs fresh user PAT.
- PUSHED 2026-11-09 (user: push with fresh PAT): fast-forward 91a360e → 0464462, 5 files (index.html paper G-series, src/tinynn/gseries.js NEW harness, src/tinynn/train.js exports, src/tools/memory/SKILL.md promote-or-recipe rule, src/CHATLOG.md). Blob-compare: only these 5 differed. Verified via ref check.

## 2026-11-10 — G series v2: teaching compounds through five handoffs (T0→G1→…→G5)
- Goal (user: G series up + everything to the end). v1 blobs lost in scratch wipe; v2 is a documented REBUILD (same src/tinynn/gseries.js harness, explicit choices): pool buildPool(7, ALLOWED12); T0 attn-h48/m96/d16 + bind aux + attnAuxW 1.0, HINTED 1200 steps, train seed 8; students same-arch fresh, hardW 0, softW 1.0, FAST_FADE 3k, train seed = student seed; exams buildExams(7000+seed) r=4; tutor rule = highest Hd, then killA, then lowest seed. Records: scratch/gseries-v2/.
- T0 (seed 8, 227s): killA 1.00, Hd 0.60, Da 1.00, Hu 0.03 — ignites but Hu collapsed vs v1 T0 (0.62). Documented limitation.
- G1 (tutor T0, 201-208): 8/8 (Hd 0.815/1.00/0.62/0.645/1.00/0.985/0.955/0.79). Tutor s202 (1.00/1.00, lowest perfect).
- G2 (tutor s202, 301-308): 6/8 (0.95/0.70/0.595/0.115✗/0.655/0.48✗/0.795/1.00). s304 memorize-lean, s306 near-miss. s301 re-run reproduced 1.00/0.95 exactly (timing 96.7s vs 207.3s = host variance, same seed stream). AS-0012 interruption mid-G2a recovered by re-running missing seeds. Tutor s308 (sole perfect).
- G3 (tutor s308, 401-408): 7/8 (0.995/0.965/0.675/0.995/1.00/1.00/0.435✗/0.995). Tutor s405 (1.00/1.00 lowest).
- G4 (tutor s405, 501-508): 8/8 (0.915/1.00/0.76/0.995/0.99/0.96/0.935/0.875). Best generation, no failures. Tutor s502 (sole perfect).
- G5 (tutor s502, 601-608): 6/8 (0.99/0.99/0.365✗/0.87/0.735/1.00/0.785/0.33✗). s603 memorize-lean; s608 FULL severance collapse (killA 0.33, loss 1.42 unconverged — first collapse in 40 students).
- VERDICT: 8/8→6/8→7/8→8/8→6/8 (35/40, CI 0.74-0.95) — no monotonic downward trend (CIs overlap throughout); best students perfect every generation. Winner-promotion loop self-sustaining through five handoffs. STOP at G5 (harness limit). Remaining hinge: scales/architectures (+ random-tutor control = stronger claim, TBD).
- PAPER (living-doc order): abstract chaining→five gens 35/40 + endpoint (G1→G5); §7 Generations→v2 numbers; §8.1 rewritten (T0 limitation, tutor rule, per-gen Hd lists, s608 collapse, verdict); d-g1g2→G1→…→G5 + simple/eli5. Fresh-eyes: programmatic byte-match of all 40 summaries + T0 vs paper claims = OK; CIs recomputed OK (35/40 0.739-0.945). Armed reviewer (new text): overlap-of-CIs + best-of-tutor critiques → patched verdict ("winner-promotion loop", "no monotonic downward trend (CIs overlap)", random-tutor TBD); CI-reporting critique rejected per standing R1 (error bars required). Verified live (refresh clean, 16 sections, 29 dict, new verdict present).
- UNPUSHED: index.html (paper v2), src/CHATLOG.md (this entry). Needs fresh user PAT.

## 2026-11-10 — Transfer hinge: transmission generalizes across layout, distance, symbols
- Bar (pre-registered): transfer-ignite = XmidA>=0.60 && XmidHd>=0.55 (+ Xgap12 A/Hd same bars, Xperm reported). Eval-only on saved v2 blobs (no retraining): mid-slot layout shift, gap-12 distance extrapolation, symbol-permutation relabel (swap 0<->1, 2<->3 on keys+values, preserves allowed/diag), each in A (allowed targets) / Hd (diag targets) variants, 200ex, r=4. Records: scratch/gseries-v2/xfer-results.json.
- MEASURED: every ignited student (s202, s308, s405, s502, s606) scores 0.97-1.00 on all six exams — transfer HOLDS. Students exceed T0 (T0 Hd analogues 0.675/0.455/0.49): transmission improved abstraction beyond the tutor. Memorize-lean fails exactly (s304: 0.08-0.14; s603: 0.425-0.52); collapse s608 chance everywhere (max 0.43, XmidA 0.29). Transfer tracks ignition. Partial: s407 (in-family fail 0.435) passes XmidHd 0.705 but fails gap12/perm — layout shift easier than distance/symbol shift for that seed.
- PAPER (living-doc order): §7 Transfer TBD -> MEASURED (battery numbers + new hinge cross-family); abstract regime sentence "cross-domain transfer TBD" -> "cross-family transfer TBD". Byte-match check vs xfer-results.json = OK. Verified live (refresh clean).

## 2026-11-10 — Scale hinge: transmission works at h24, h48, h96 (no scale collapse)
- Bar: h24 + h96 one-generation fade rate (same pool/fade/seeds 201-208, proportional h/m/d: h24/m48/d8, h96/m192/d32) vs h48 G1 8/8. Records: scratch/gseries-v2/h24-results.json, h96-t0-summary.json, h96-s20x-summary.json.
- MEASURED: h24 T0 FAILS the bar (killA 1.00, Hd 0.205) yet its students ignite 8/8 (Hd 0.87/0.615/0.75/0.985/0.775/0.81/0.565/1.00) — transmission works where hinted training fails. h96 T0 0.575 (ignites, like h48's 0.60); students 5/8 (0.70/0.77/0.805/0.605/0.34✗/0.235✗/0.27✗/0.845; CI 0.31-0.86) with two killA-collapses (s205 0.34, s206 0.235/0.245) — failure shape unseen at h48-G1. Rates overlap (CIs overlap throughout): no scale collapse at 4x width, wider failure repertoire at top. New hinge: other architectures (M4/geo).
- Compute note: h96 per-student wall time swung wildly across worker calls (324s to 1241s for identical 3k-step recipes) — host variance, not nondeterminism (all eval numbers deterministic per seed; s301 re-ran byte-identical). One 60-min worker call timed out with 6/7 students done; finished the last seed solo.
- PAPER (living-doc order): §7 Scale TBD -> MEASURED (width sweep); §8.1 + §7 Generations hinge "scales/architectures" -> "architectures". Byte-match check OK (all h24/h96 summaries vs claims). Verified live (refresh clean).

## 2026-11-10 — Mechanism hinge: memorize-lean is unreconciled teachers at severance
- Bar: gradient-SNR during fade for memorize-lean vs igniter (same tutor/pool, else confounded). Seeds s302 (ignite 1.00/0.70), s304 (memorize-lean 1.00/0.115), s306 (near-miss 1.00/0.48), all tutor g1-s202. Instrumented reimplementation of trainFaded + fixed-probe (64 ex, separate rng, no trajectory perturbation): per-100-step soft-vs-attn cosine + norms. Trajectories reproduced byte-identically (finals 0.70/0.115/0.48). Records: scratch/gseries-v2/snr-results.json.
- MEASURED: igniter settles both channels (|S|~0.003, |A|~0.0004); memorize-lean leaves attn hot (|A| 9x igniter's, |S|/|A|~1.5); near-miss settles both sub-bar. Transient: failures blip +0.37 mid-stage-1 then flip at fade step; igniter stays ~0. First probe attempt returned null cosines (probe compared student logits to themselves — zero grad by construction); fixed by indexing the tutor cache. Hypothesis: memorize-lean = unreconciled teachers, ignition = joint settling. n=1 per shape; multi-seed confirmation TBD.
- PAPER (living-doc order): §7 Mechanism TBD -> MEASURED (audit numbers + hypothesis + n caveat). Byte-match OK. Verified live (refresh clean).

## 2026-11-10 — Harvest first port: curriculum ordering CUT (4/8 vs 3/8, no move)
- Bar (pre-registered): port must move a bench number or be cut. easy→hard (600 short-only + 600 long-only, rng/adam carry) vs fair-mixed (1200 on same multiset), hinted attn-h48 + bind + attnAux, seeds 7-14, exams buildExams(7008). Records: harvest-mixed.json, harvest-curric-a/b.json.
- MEASURED: mixed 3/8 (Hd 0.275/0.45/0.725/0.655/0.03/0.72/0.22/0.45, mean 0.441); curriculum 4/8 (0.875/0.625/0.055/0.425/0.48/0.745/0.425/0.55, mean 0.522). CIs overlap (3/8: 0.14-0.69; 4/8: 0.22-0.78) — NO significant move. Verdict: CUT. Nuance: ordering reshuffles igniters (gains 7/8/14, loses 9/10 — late hard-only exposure locks memorize-lean where interleaving teaches). Curriculum arm was interrupted once by AS-0012 (no partial file); re-ran split 4+4 cleanly.
- PAPER (living-doc order): §8.2 TBD -> MEASURED-first-port (numbers + CUT + nuance + next ports queued); kept d-harvest dict link on the port phrase. Byte-match OK. Verified live (refresh clean).

## 2026-11-10 — Staircase first proposer FAILS bar (1/8 vs 3/8): mastery-gaming diagnosis
- Bar: nursery-taught beats fixed-curriculum baseline on novel variants at similar-or-less cost. Competence-gated rungs (R1 1-pair -> R2 1-3 short -> R3 mixed; advance probe>=0.95, bridge <0.60 with diag-target long bridge pool), 200-step blocks, cap 1200, same hinted recipe + seeds 7-14 as harvest mixed baseline (paired). Records: stair-a/b.json.
- MEASURED: gated 1/8 (Hd 0.205/0.22/0.16/0.25/0.705/0.005/0.00inv/0.39, mean 0.367, ~975 steps) vs fixed 3/8 (mean 0.441, 1200 steps). FAILS bar. Diagnosis: in-dist probes saturate in 200 steps (st0 probe 1.00 everywhere) so the gate advances on memorization; bridge condition never fires (probes never <0.74); early exit under-trains; short-first staging induces memorize-lean (s12 0.99/0.005) and readout inversion (s13 killA 0.00/Hd 1.00 — probe-gaming broke the reader). Queued fix: transfer-predictive probes (held-out-combo variants) ungameable without the rule.
- PAPER (living-doc order): §8.3 TBD -> MEASURED-first-proposer (numbers + diagnosis + queued fix); kept d-staircase link. Byte-match OK. Verified live (refresh clean).

## 2026-11-10 — Breeding honest re-entry: breeding DIES at this budget
- Harness fixes first (src/tinynn/evo.js): makeSets honored seed (was void — the v1 fair-campaign confound), attn-arch gene subsets added (attn=Wq/Wk/Wv/Wa, gate=Lz, readout=Lout). Verified live: geo guard green, attn evolve smoke runs, resample slices actually differ now.
- Bar: bred killHd > base + 2SE on held-out verdict battery AND beats shuffle champ, else breeding dies. ES from v2 T0, attn/gate genes, pop 16 (8 antithetic pairs), 6 gens, sigma 0.02, fair resampled fitness (id/famFam/novel-target/gap12, margin 1SE), shuffle controls identical budget. Held-out verdict: buildExams(424242) (never in fitness). Records: breed-results.json + breed-*-champ.json.
- MEASURED: fitness flat within SE all four arms (attn_es 0.924->0.932, shuffle/gate arms flat). Verdict Hd: base 0.455; attn_es 0.515 (+0.06, below +0.07 2SE bar); attn_shuffle/gate_es/gate_shuffle 0.455. ES barely beats shuffle (+0.06, also <2SE). Ruling: BREEDING DIES (this instantiation, these genes, this budget). Pattern now holds across readout (v1) + attn/gate (v2) gene sets.
- PAPER (living-doc order): §8.4 TBD -> MEASURED-breeding-dies (numbers + ruling + standing bar); kept d-breeding link. Byte-match OK. Verified live (refresh clean, guard green pre-run).

## 2026-11-10 — Finale first loop: nursery v0 runs itself (Quality pass, budget spec-error, ZK-lite 1/2)
- Loop code (worker scripts, no human decisions): raw pile (400 short + 400 long-8fill + 200 diag-target, seed 99) -> hinted tutor (fresh seed 15) -> verify -> rescue-if-fail (unspent) -> fade 4 students (701-704) on allowed-12 pool -> verify -> ledger. Records: nursery-A.json (+verdict-fix), nursery-B.json.
- MEASURED A: tutor 1.00/1.00/Da 1.00/Hu 0.99 with ZERO oracle calls — messy pile (diag exposure) makes super-tutors; students 3/4 (0.81/0.99/0.395✗/1.00, Hu 0.745/0.865/0.07/0.93), mean Hd 0.799 (+0.358 over frozen rival 0.441): Quality PASS. Budget: spent exactly planned 13200 (tutor 1200 + 4x3000); published cap 12000 sat below battery cost — SPEC ERROR (not loop overspend); coherent cap 15000. Graders note: verdict-field bug (qualityVsRival null from ev.Hd vs ev.killHd key) corrected in nursery-A-verdict-fix.json; raw records were always right.
- MEASURED B (ZK-lite, re-encoded symbols, same code, zero consults): tutor 1.00/1.00, students 1/2 (s801 collapse 0.305/0.265, s802 1.00/0.905), 7200 steps. Strategy executes cross-encoding; 1/2 is not portable skill. Full ZK (>=3 cross-family topics), synthesis, format-symmetry, field pilots stay TBD.
- PAPER (living-doc order): §8 intro (§8.1-8.4 run, §8.5 partial) + §8.5 rewritten (loop numbers + Quality/budget verdicts + remaining hinges; dangling old-bar fragment spliced clean). Byte-match OK. Verified live (refresh clean).

## 2026-11-10 — Related-work pass: Mamba bounded, Coconut mapped, Looped folded in (bench baseline Hd 0.00)
- Pre-step research check (2 searches, DDG): SSM query -> Mamba (Gu & Dao 2023, arXiv:2312.00752; fetched html v2, 669KB); Coconut query -> Hao et al. 2024 (arXiv:2412.06769; fetched abs). 3rd targeted fetch (no spiral): Giannou et al. 2023 Looped Transformers (arXiv:2301.13196, abs confirms programmable-computer/program-counter/punchcard). All primaries, cited.
- Bench baseline (the one new measurement): Mamba-like config = geo choosy write-gate (input-dependent Wf) + queryhead conditioned read + gist persistence, fair allowed-12 h48/1200 seed 7. Result: killA 0.465, Hd 0.00, transfer 0.00 all six (ssm-baseline.json, 36s). F3's fair choosy+qhead 0.40 corroborates (different pool/seed, same wall).
- Synthesis (verified vs code): Mamba Δ/B/C-selectivity ~= our (1-w) carry / choosy write / query read; bench bound = input-dependent gating insufficient for arbitrary-slot novel-target lookup (needs S-addressing; S-only~=full, geo-only collapses). No refutation of Mamba at scale (different regime). Coconut continuous-thought feedback ~= depth loop + settle-training (grade every round); BFS-vs-single-trajectory noted, no contradiction. Looped = §2.4 lineage (loop as computer vs our loop as thinker); attention-versatility punchline matches S-lesion.
- PAPER (living-doc order): §7 Related-work TBD -> MEASURED (pass + baseline numbers); §2.4 TBD line -> looped folded in + MEASURED; References +3. Byte-match OK (ssm-baseline.json). Verified live (refresh clean).

## 2026-11-10 — Hygiene + close-out: v0.13, zero orphans, all hinges reported
- Paper hygiene: badge + meta -> v0.13/2026-11-10; run records + shelf extended (gseries-v2, 3 new arXivs); §1 regime sentence -> cross-family/other-arches; §3.4 chaining TBD graduated (->§8.1); §7 Seeds TBD -> MEASURED n=8; Appendix E shelf TBD -> MEASURED; d-bimodal/d-dseries/d-g1g2 links restored (29/29 linked, zero orphans, verified programmatically).
- Remaining TBDs are honest opens: Authors, venue/ablations, random-tutor control, full diploma probes (synthesis/format/full-ZK/pilots), cross-family transfer, other architectures, mechanism multi-seed confirmation, next harvest ports, staircase transfer-predictive probes, breeding other genes/budgets.
- Final verify: refresh clean (no errors), 16 sections, 29 dict entries, all new numbers present in live DOM. Snapshot tool unavailable (dep fetch blocked) — text-only changes, DOM checks suffice.
- UNPUSHED: index.html (v0.13 paper), src/tinynn/evo.js (seed fix + attn genes), src/CHATLOG.md, src/tools/* (unchanged). Needs fresh user PAT to push (all pushes this session blocked on user PAT per standing rule).
- SESSION RECORD: v2 chain T0+G1-G5 (35/40) + transfer + scale + mechanism + harvest + staircase + breeding + finale-loop + related-work + hygiene. 40 G-students + 16 h24 + 16 h96(15 done, 1 timeout-recovered) + probes. All paper numbers byte-matched to scratch/gseries-v2/*.json.

## 2026-11-10 — ELI5 toggle removed, explainers rewired into the click-dictionary
- User: remove ELI5 mode, then (correction): keep the ELI5 content, explainer boxes should live in the click-to-open dictionary, not behind a toggle. No toggle anymore.
- Restored 15 orig eli5 dict lines byte-exact from pushed 785978e (first attempt mis-attributed keys via cross-entry regex span — caught by page_refresh syntax check; fixed with entry-split parse, verified all 15 match orig). Dict back to 3 tabs (Professional/Simple/ELI5).
- 9 inline boxes -> 9 new single-tab entries (d-eli5-hiker/tokens/orbits/batball/shelf/camping/status/trio/labguide) + 9 ELI5 buttons at their former sites; leads de-duplicated against the panel tag. One prose patch: status note "boxes underneath" -> "notes (click them where they sit)".
- Verified live: clean refresh, all 9 open with ELI5 tab, 3-tab entries intact, 16 sections.
- UNPUSHED: index.html (needs fresh user PAT per standing rule).

## 2026-11-10 — Rabbithole skill overhaul (user corrections, 3 rounds)
- Round 1: skill fenced out tangential/alternative-methods work (all-direct agenda, "serve the root" waves, method-as-scope-change). Fixed: agenda item 6 standing slot, wave default 1 direct + 1 tangential, different-method = in scope by default, tangent promotion = bookkeeping.
- Round 2: "rabbithole" is DELIBERATE wandering — shotgun for unknown unknowns, nearly nothing is scope creep. Fixed: Purpose rewritten, "root answered" demoted to report milestone (not a stop reason), escalation only for leaving research-only/irreversible, empty agenda never ends a run. Past short runs were my winding-down, named in the skill.
- UNPUSHED (with the pile below).

## 2026-11-10 — Phase 2.5 verdict + steal tracks (user: wildly incorrect, should have been way earlier)
- Diagnosis: harvest placed AFTER H2/D/G/staircase/breeding/finale could not inform any of them (curriculum CUT is the receipt); list mixed real methods with armchair verdicts.
- Rebuilt as 3 standing tracks, subpoints in track files: (A) registry, (B) scaffolding, (C) papers; gameplan Phase 2.5 = short pointer. Search round 1 banked 48 results (search-round1.json); user called structure-first, nothing run yet.
- Moved scratch/steal/* → src/steal/* (durability: scratch is a cache). Gameplan pointer updated.
- UNPUSHED (with the pile below).

## 2026-11-10 — Memory audit (user: memory must catch these)
- Found stale: CURRENT_TASK still said G-series-complete (missed ELI5 rewire, skill overhaul, steal tracks); CHATLOG missed skill + steal entries; Phase 2.5 rewrite skipped its mandatory pre-edit snapshot; steal files sat in scratch (cache, not storage).
- Fixed: CURRENT_TASK rewritten to now; CHATLOG entries added (ELI5 rewire earlier this session + these two); post-hoc snapshot scratch/gameplan-snapshots/2026-11-10-pre-steal-phase25.md (provenance labeled: in-context exact read, not recollection); steal files byte-verified identical then moved to src/steal/, scratch originals deleted, gameplan pointer updated.
- Blob-compare vs repo tip 785978e: exactly 4 files differ (index.html, CHATLOG.md, README.md, rabbithole/SKILL.md) + 4 new (src/steal/*). UNPUSHED, needs fresh user PAT. ELI5-restore provenance (scratch/eli5-orig.html + boxes/context files) intentionally left in scratch as throwaway.

## 2026-11-10 — PUSHED d6a0d20 (parent 785978e, user PAT)
- 8 files via git-blobs API: index.html (ELI5 rewire), CHATLOG.md, README.md (Phase 2.5 pointer), rabbithole/SKILL.md (shotgun overhaul), src/steal/* ×4 new. Self-catch: first attempt 422'd (read r.sha instead of r.j.sha, SHAs dropped); recreated fixed. Verified via ref check (match). Repo clean.

## 2026-11-10 — Fresh-eyes battery on the steal tracks (user: clarity rounds till sure + 5+ critique rounds)
- Premise v1→v3 (scratch/fresh-eyes-steal-v1..v3.md). Clarity R1: 3/3 restated correctly; 4 ambiguity clusters (consult-coins, moves-a-number, beats-a-laptop, USED/SKIPPED location) → v2 glossary patch. Clarity R2: 3/3 correct again; residue = design work that IS the tracks + 3 refinements (relative baseline, noise-bar, v0.14 = v0.13 extended) → v3. Clarity declared certain (6/6 match).
- C1 Track A: 3 reviewers → A3b portability filter (Logic/API/Framework, 2/3 same finding merged), A5 split bar (Performance/Utility). C2 Track B: 3 → B2b heartbeat probe, B3 circuit breaker (unanimous volatility convergence). C3 Track C: 3 → C3 conflict table, C5 USED-CONFLICT + novelty delta (unanimous novelty-risk convergence). Reviewer error logged: C3-R2 re-asked v3-glossary questions it didn't read.
- C4 cross-track: 3/3 unanimous A4→B3 dependency (no API port before router interface) + regression check, B4 smoke-first, gameplan collision rule. C5 red-team: discipline assignment half-scrambled (2 systems voices) but usable → 6 patches (p99 tail latency, ToS lines, A4 pilot kill rule, dependency-light Logic, drift-not-accuracy conflict table). ML-skeptic "vanity" PARTIAL: tracks serve nursery/lab infra, but pilot rule adopted.
- C6 steelman: 3/3 HOLD with priced residuals (port overhead/dev-hours; 429 waste/recalibration; diversity-metric compute). STOP per rule.
- Score: 8 rounds, 24 reviewers, ~16 adopted changes, 1 reviewer error. Results: scratch/fresh-eyes-steal-*.md (8 files). Track files carry every patch with its round tag.

## 2026-11-10 — Steal-track corrections + battery definition (user, 4 notes)
- "Tiny workshop" = bench fit (h48/CPU/thousands of params), NOT git/Perchance limits. Filter sorts workshop-fittable from factory-grade.
- Track B reframed parallel POOL (user: daisy-chain implied series): slow sources side-by-side, tail shed not waited on, banned accounts rotate out → next source in, coins account for all. Scaffolding thesis + B3 rewritten.
- "Already invented" answered: no reviewer NAMED a precursor (risk flagged, correctly — that is their job); USED-CONFLICT machinery turns a find into a gift (copy/expand/cite same wave). Adjacent art named: AutoML/NAS (architectures not teaching), one-shot distillation (not iterated), iterated learning (collapse not promotion). C1 survey settles factually.
- Battery definition now explicit in fresh-eyes skill: 10 reviewers per artifact/list + adjudicate + patch = ONE round; repeat whole battery per version until stop rule. Note: the finished steal battery ran 3-wide per round (pre-definition); it still closed 3/3 steelman HOLD, so it stands — future batteries run 10-wide.

## 2026-11-10 — Battery N generalized + two-workshops fit spec (user)
- Fresh-eyes battery rule generalized per user (don't memorize the number): N reviewers/artifact, default 10, scaled to artifact size + stakes; repetition-till-stop-rule is the battery, unchanged.
- "Tiny workshop" deepened into THE TWO WORKSHOPS (registry.md): W1 = shipped generator (visitor browser, CPU, no secrets, no build, esm.sh OK); W2 = agent tooling (worker + fs/tools/esm.sh, may be heavy, still secret-free); W3 = the assumed server/GPU/Python world we don't have. A3b is now a 6-line fit-check checklist (workshop, secrets, compute, deps, net, weight) with verdict mapping.

## 2026-11-10 — Refinement battery 2 on steal tracks (user: 5+ rounds, combined rounds, stop when comfortable)
- R1 Track A (6): A0 gap-driven rule, runtime-target blocking gate + 100KB weight cap, frozen reference bench set, graded pilot. Reviewer errors: "moves-a-number paradox" (A5 Utility already answers), coin/B3 questions (stated design output).
- R2 Track B (6): polite two-tier heartbeat (probe must not BE the ban), per-provider coin price lists (no universal rate), router holds balances, cold-start routing, one-ordinary-account-per-provider ToS, quantified ≥2× bar. Mostly clarity-fallback; the 5/6 coin-rate convergence still forced the explicit pricing design.
- R3 combined (6): graded pilot budgets, port-slayer + hard-exam pilot, calibrated capped hedge, floor + cold-start exempt breaker, delta template with goal-impact/so-what, per-CONFLICT fresh-eyes check, prediction-first conflict table (embedding/TTR/entropy). Rejects: triage matrix (A0 covers), exit-to-paid (no budget; floor is the exit), shadow-heartbeat (already the hedge).
- R4 combined (6): rollback + port-tax + shim-counting, A0 WONTFIX fallback, throughput pricing + heartbeat refresh + token ceilings, data hygiene, all-in B5 accounting, synthesis taxonomy + bench-result filing.
- R5 combined (6): hidden-API audit, floor triggers + global hard timeout, cheap accountant, data-in derate column, skip taxonomy + 3-of-a-kind rule. A 6/6 SOLID, C 5/6, B 1 SOLID + 5 HOLD (complexity) → R6 kill-round on B.
- R6 kill-B (6): 6/6 SIMPLIFY — killed the runtime coin accountant (unanimous: costs more than the calls). Static priority queue + liveness heartbeat + breaker + floor; coins demoted to post-mortem budget unit; B4 decider test first.
- R7 steelman (6): 4 HOLD + 2 BREAK, both cold-start (hedges don't save a 10s boot). Patched: warm-sentry keep-alives, COLD-ONLY sources take long tasks only, short-task exclusion rule.
- R8 verify (6): 6/6 HOLD, BREAK closed (residuals: thundering-herd watch, sentry-vs-429 tuning, stale-measurement jitter). STOP per rule — comfortable.
- Score: 8 rounds, 48 reviewers, all adoptions tagged in src/steal/*.md. Results: scratch/fresh-eyes-steal-v4-*.md (8 files) + v4 premise. Battery rule held: N=6 judged right for short docs (not the default 10).
- UNPUSHED: registry.md, scaffolding.md, papers.md, CHATLOG.md, fresh-eyes SKILL.md (battery def), README.md (pointer edit) — needs fresh user PAT.

## 2026-11-10 — Rabbithole skill: standing permission to resume (user) + Track A waves 1-10
- Skill rule added (user: asking for `continue` is itself a permission gate — assume YES, never ask, never wait): Command section + wave-loop step 7 both carry it now. CURRENT_TASK active-slug line reworded (no "resumes on your continue" framing).
- Track A rabbithole RUNNING (slug steal-track-a, state scratch/rabbithole/steal-track-a/): waves 1-3 census + spec verify (folder+SKILL.md, name+description min — our steal format matches by construction); wave 4 source-reads remember-plugin (V7 FIT-W1, pure localStorage) + download-button (V8 FIT-W1); wave 5 sandbox s01-remember STATIC PASS (15486B, zero-dep, no-net); waves 6-8 marketplace probe (skillmd MINABLE via sitemap+API, agentskill payload PROVEN, 3 shells dead via fetch); wave 9 safety-review model adopted (capability flags); wave 10 markdown-plugin V17 FIT-W1 (37KB, main-thread-only) + format guide (frontmatter name/description/license). Proposals: P1 frontmatter in future steal files (user nod needed); gaps G1-G3 still draft (no port before user confirms); FIT = port-eligible, STOLEN gated on gaps + A4 pilot.
- UNPUSHED: + rabbithole SKILL.md (standing rule), registry.md (census + reads), CHATLOG.md (this entry) — needs fresh user PAT.

## 2026-11-10 — Pre-fetch battery (user: second opinion before fetch, my choice, as many as needed)
- Ran 22 reviewers: Track A shortlist 8x, Track B router 8x, Track C plan 6x. Results: scratch/fresh-eyes-steal-prefetch-A-8x-results.md, -B-8x-results.md, -C-6x-results.md.
- A (8/8): DROP docs-plugin (redundant + overweight + CDN), sheets stays API-BLOCKED, KEEP remember + markdown + literal (+ download trivial). Pre-fetch checks adopted: hidden-API grep, 10KB/16ms main-thread test, combined <=100KB.
- B (8/8 fragile): cold-start cascade / zombie-warm / hedge->429 unanimous. Patches: zombie = kill not wait, heartbeat polite (no 50-burst where banned), 15%-overhead falsifier on 100-task batch, decider test before router. No build until B1/B2 numbers pinned.
- C (6/6): order C1->C2->C3->C4 holds (2/6 wanted C4 first — rejected, mitigated with one-line old-2.5 map at C1). Primary falsifier adopted: TTR/entropy/PATH-diversity falling while accuracy holds = collapse. Priors queued into C4: MAML, STaR, RRM, Kaplan tiny-net, catastrophic forgetting. Shuffle-teacher + cross-teacher + novel-path tests adopted.
- UNPUSHED: 3 results files (scratch, cache) + src/steal/*.md patches TBD + CHATLOG (this entry) — needs fresh user PAT. Next: fetch phase A1/B1+B2/C1+C3 still gated on user go.

## 2026-11-10 — A-list finished (user: finish A list, skills first)
- Geared up: perchance-platform skill loaded + websearch recipe confirmed.
- Fetched literal-plugin (454B pure regex, docs-only HTML). Hidden-API audit KEEP set: literal CLEAN, remember CLEAN (localStorage only), markdown CLEAN-runtime (vendored marked, Main-Thread-only flag), download-button CLEAN (anchor only).
- Registry close-out written: KEEP remember/markdown/literal/download, DROP docs (SKIPPED-redundant), BLOCK sheets (API/B3). A1/A2/A3b DONE for this scope; A0 gaps + A4 ports still gated (G1-G3 confirm, P1 nod).
- UNPUSHED: registry.md + CHATLOG (this entry) — needs fresh user PAT.

## 2026-11-10 — A0/G1-G3/P1/pilot locked (user delegated: my shopping list, my call)
- G1 = reload amnesia -> remember. G2 = paper/docs pain -> markdown + literal. G3 = export clunk -> download-button. P1 frontmatter approved (folder + SKILL.md name/description/license).
- Pilot = G1 remember: Utility bar = persists across reload + guards pass + no bench regression + <=100KB. Fail = pause Track A per pilot rule. Recorded in registry A0 (tracked, pushes to GitLab with PAT).
- UNPUSHED: registry.md + CURRENT_TASK + CHATLOG — needs fresh user PAT.

## 2026-11-10 — A4 ports LANDED (user: bring them all in; pilot G1 first per rule)
- Pilot G1 remember alone: refresh clean, quickSelfTest learned:true, quickAttnTest ok:true, kPick 2 + depth 32 survive full reload. Bar MET, no pause.
- G2/G3 same batch: markdown + literal + downloadBtn imports, hero #dlCtnEl export button (href downloadGenerator?generatorName=teaching-small-models-to-learn, rendered 153x22px), md/lit verified callable. Guards identical post-batch, persistence intact, console + perchanceErrors clean.
- STOLEN lines in registry (with reverts + guard snapshots). Port-tax: 0 glue lines (imports only + 12-line wiring script).
- UNPUSHED: main.pjs + index.html + registry.md + CHATLOG + CURRENT_TASK — needs fresh user PAT.

## 2026-11-10 — Appendix H: stolen-tools credit (user: blurb + why + links, tools not logic)
- New section.card after Appendix G: 4 blurbs (remember/markdown/literal/download-button — what + why/G1-G3 + perchance.org links), header states tools-are-infrastructure-not-evidence, logic stays in References, full record pointer to src/steal/registry.md. A–G mentions -> A–H (directive + bench note).
- Verified live: 17 sections, Appendix H last with 4 correct links, dict intact, refresh clean.
- UNPUSHED: index.html + CHATLOG + CURRENT_TASK — needs fresh user PAT.

## 2026-11-10 — Wave 12 full-pull (user: pull everything we'd want for Track A)
- 73 fetch_generator calls, audit (sizes + net/DOM flags) in scratch/steal-audit.json. Almost all net hits = docs links; real runtime-net only: bug-report/tldraw/font/unsplash/soundcloud/stats/sheets/dynamic-import(first-party).
- text/table/map/sound = MISSING (empty fetch, scout was wrong); custom-font-importer correct name is code-empty.
- Verdicts grouped in registry: WANT-G4 (seeder, url-params, copy-text, select-until, random-select, fixed-until-reload, lockable, locker), WANT-G5 (be/plural/a-an/title-case, print, fullscreen; HOLD stats/tts/dynamic-import), SKIP weight/nogap/external.
- G4/G5 named (delegation), ports NOT started. UNPUSHED: registry.md + CHATLOG + CURRENT_TASK — needs fresh user PAT.

## 2026-11-10 — Wave 13 skill-dirs (user: and the directories too)
- VoltAgent zip: 5 files / 0 SKILL.md — link-index only. Shopping-list hits all keyed (serpapi/firecrawl/brave/browserbase search; HF datasets/eval/jobs/trainer; datadog eval) = API/Framework, B/C territory. Track A yield: zero.
- skillcreatorai zip: 363 files / 27 SKILL.md, read 5 closest — sales/productivity. Yield: skill-creator (SKILL.md authoring guide, META-WANT for P1 format). webapp-testing/mcp-builder = W3, SKIP. Index: scratch/skill-dirs-pull.json.
- UNPUSHED: registry.md + CHATLOG + CURRENT_TASK — needs fresh user PAT.

## 2026-11-10 — Wave 14 G4/G5 tranche (user: pull everything + Appendix H)
- +14 imports, all verified; wired print/fullscreen/copy-config/URL-apply (assocR/600/short round-trip OK, controls reset after). Import-only: seeder/sampling/lockables (spec'd, needs design) + aAn/beVerb (HAZARD: shared-parent MutationObserver ping-pong froze two loads; never co-locate; pluralize/titleCase pure-safe).
- skill-creator vendored Apache-2.0 to src/tools/skill-creator/. Appendix H: 15 blurbs, dogfoods pluralize/titleCase live.
- Guards identical pre/post, persistence intact, console clean. UNPUSHED: main.pjs + index.html + registry.md + src/tools/skill-creator/ + CHATLOG + CURRENT_TASK — needs fresh user PAT.

## 2026-11-10 — Waves 15-17 marketplaces to pull (user: go inside, wishlist, second-check, push back, pull)
- Wave 15 sweep: fetched awesomeskills.dev (172KB JS shell, 10 slugs), skillmd.com (307KB, REAL catalog, /api/search?q= works), awesomeskill.ai (683KB shell, 54 slugs), agentskill.sh (487KB, search BROKEN = openclaw monoculture, SKIP), joohw README (49KB, 247 entries/40+ cats, agent-skill.co best for official skills). Wishlist 17 Tier-1 in scratch/steal/mkt-wishlist.json.
- Wave 16 second check: v1 premise frozen + 3x unarmed fresh-eyes (results scratch/fresh-eyes-marketplace-v1-3x-results.md). Unanimous: CUT Python-family runtime (Framework, no Python/GPU in W1/W2), playwright-in-worker impossible as runtime (kept 2 as page_eval procedures), dedupe paper 7->2 / eval 7->2 / pdf 4->1. Final 14 in scratch/steal/mkt-wishlist-final.json.
- Wave 16b pushback ruling (user deferred override to me): PARTIAL accept. Track B is all-CLAIM (B1-B5 unchecked) and free tiers are hostile to long training loops, so shipped-runtime cut STANDS; but the cut mixed runtime with readable text (pytorch-training verified pure-md via skillmd API), so instruction slice re-admitted as B-DEPENDENT agent-side (GPU runs gated on B4+B5). Nemo-RL stays fully cut.
- Wave 17 pull: second-checked keyargo/search = SKIP-redundant (own websearch skill already covers DDG recipe; body is Custodian-wrapped = Framework). Fetched 20 bodies via skillmd API + 2 github raws. Flag audit: pdf "secret" = sandbox guidance (benign); HF bearer = gated/private only (viewer still API-class/caution, DEFERRED post-B3); transformers-js full but NO named gap (DEFERRED). STOLEN x18 to src/tools/*/SKILL.md with P1 frontmatter + provenance (eval-harness, project-evals, benchmark, paper-compile, latex-workflow/MIT, pdf-processing, research sweep, playwright-expert/MIT, webapp-testing, dataset-datasheet, jupyter-notebook, context-compression, tutor-skills, beautiful-prose/sickn33, taste-skill, B-dependent pytorch-training + sparse-autoencoder/MIT + pyvene-notes/MIT). Appendix H 15->24 blurbs. Guards post-refresh: quickSelfTest learned:true + quickAttnTest ok:true, console clean.
- PUSHED (user PAT, blobs API, parent d6a0d20): 27 files (8 modified + 19 new). Repo-meta (.gitignore, Dockerfile, root README, k8s/) preserved from tip.

## 2026-11-10 — Wave 18: tried the new goodies (user: test them, paper-facing)
- Ran 16 trials (scratch/steal/trials/T1-T16): 11 USED live (prose rewrite, paper verify CLEAN, seeder EDD, URL-apply 2/2, appendixH 15->24, datasheet, vault-lite, taste audit, recon, pollFor, pdf.js extraction of Huginn paper), 2 procedure-used with adapted toolchain (research error-report, compression v1-fail->v2-5/7), 2 readiness-only (jupyter, latex map + figure-export gap), B-trio parked with triggers. Full verdicts in registry Wave 18. Guards green throughout. UNPUSHED: registry.md + CHATLOG (this entry) — needs fresh user PAT.

## 2026-11-11 — scratch evacuation: recycling-bin policy (user: nothing referenced lives in scratch)
- Rule adopted: scratch/ is a recycling bin, not a sandbox — anything there is meant-to-be-deleted. All referenced work promoted to src/evidence/ (271 files, byte-verified): gseries-v2/ (137 bench ledgers incl. nursery-A/B), reviews/ (fresh-eyes rounds + steal-audit/census/snips + skill-dirs-pull + t6retry-results), steal/ (trials/wants/wishlists), rabbithole/ (volunteer-peers + steal-track-a trail records; ~1400 bulk marketplace dumps left in bin as re-fetchable), colab-studio/ extract, gameplan-snapshots/, docs/, nursery-rows-001.json. 4 renamed for src/ filename rules. Pointers repathed: index.html paper (8 gseries cites + meta line), src/steal/registry.md + scaffolding.md + nursery-data-spec.md. src/CURRENT_TASK.md is the working record now (moved from scratch/, singletons deleted); src/README.md carries the rule. CHATLOG history above left verbatim (old scratch/ pointers are historical record, not live links).

## 2026-11-11 — gameplan mesh + battery (user: mold, don't force; iterate until good)
- Meshing block + Phase-4 redirect baked into src/README.md gameplan (pre-snapshot taken). Battery R1 (newcomer/skeptic/architect/realist): FORCED (Phase-3-prototype claim), ERODED (Phase 3 meaning, C bypass), CONFUSING (jargon), GROUNDED. Adjudicated: prototype→"harness Phase 3 will be built from ... scaffolding, not the phase"; "never"→forward-looking "will not scale up"; novelty gate made explicit ("no novelty claim ships until its precursor slice is read"). Verification round 3/3 clean (FIXED x2, PRESERVED/KEPT-FOUNDATIONAL, CLEAR after one seat-phrasing simplification). No further rounds needed.

## 2026-11-11 — push 7541c34 (user-supplied PAT, org repo)
- Blobs+tree overlay on Maieutics-Learning/maieutics main (parent 2a61655): 288 uploaded / 45 unchanged / 1 deletion (keys-card.html staged fragment). Verified 337 blobs incl. 137 gseries-v2 ledgers. Covers evacuation + repaths + mesh + battery + logs. First attempt PATCHed wrong endpoint (/git/ref → 404); retry with /git/refs succeeded.

## 2026-11-12 — PUSHED 627bbac (user-supplied PAT, parent eb97a62)
- Bulk push via git-blobs API: 404 files (404 uploaded), 327 unchanged, 0 deleted. Covers Track C R63 notes/state/log + tool/doc updates. Blob-compare pre-push: 6 modified + 398 new. Ref verified at 627bbacc217b7d5330f8bc70018783da8db4aa9d.

## 2026-11-12 — PUSHED 524fc11 (user-supplied PAT, parent 0c2afb3)
- Bulk push via git-blobs API: 22 files uploaded, 729 unchanged, 0 deleted. Covers Track C wind-down Waves 408-414 (w408-notch through w414-cliff notes + grids + bench/sandbox scripts w345-w350) + synthesis-r66 + track-c state/log. Backlog drained 6->0 (391 waves). Ref verified at 524fc11.

## 2026-11-12 — PUSHED 62554c1 (user-supplied PAT, parent 524fc11)
- Bulk push via git-blobs API: 34 files uploaded, 748 unchanged, 0 deleted. Covers skills-battery freeze + memory SECRET HANDLING update + rabbithole SKILL.md. Ref verified at 62554c14645421d3829ed59585f5ba31348d6b6a.

## 2026-11-13 — fresh-eyes battery v1: evo-vs-fade conclusion (this session)- Fleet: 10 sealed reviewers, one page_eval Promise.all (6 support + 4 red-team). Free pack: 10 agent-side DDG queries / 40 sources (`scratch/evo-fade-search-pack.json`, tmp). Each eye ran 2 OWN superFetch DDG searches (all returned 3 hits, 0 errors) + 1 primary read, then generateText verdict. Raw: `scratch/fresh-eyes-evo-fade-v1-raw.json` (tmp, 15KB).
- Tally: 6 HOLDS (support) / 4 BREAKS (red). Adjudication: ACCEPT zero-hint baseline, same-budget mutation duel, novel-rule transfer probe (cold-start + cross-chain swap merged), frozen single-tutor ablation, CMA-ES on fade params, PBT-lite pop-10; REJECT id7 as break (different regime — sparse RL, no tutor); PARTIAL id8/9 (both propose the queued outer-loop). Core HOLDS: don't evolve weight dials; teach + outer-loop schedules/teachers only. Scope fix: regime-bound (dense gradients + working T0); ES/PBT correct with no tutor/gradients.
- Filed: `src/evidence/synthesis/fresh-eyes-evo-fade-v1-results.md` (durable). Premise frozen v1.0: `src/evidence/synthesis/evo-fade-premise-v1.md`. Pool spend 0 (all local CPU + page-model calls on user quota). UNPUSHED this session: premise + results + CHATLOG + working record (no PAT asked yet).

## 2026-11-13 — cheap-tests a-g + batteries v2/v3: evo-fade loop CLOSED (this session, cont.)- Cheap tests (spec `src/evidence/synthesis/cheap-tests/spec.md`, drivers wave1-5 beside results, pool 0): (a) supervised 0/4 (chance) → schedule HOLDS. (b) taught Hd 0.888 vs breed 0.515 → duel conclusive. (c) perm 10/12 hold, 0 collapse (caveat: symmetry-easy). (d) T0-taught 4/4 (0.89) vs champ 4/4 (0.84) → bench OVERHEAD; rotted T0s tutored igniters. (e) n=1: mid 0.5 rots one init, 0.995 another → hand schedule not special. (f) PBT-lite no ignition edge → not worth it. (g) cyclic 10/12, many-to-one mean 0.736 none at chance → rule-ish binding.
- Battery v2: 6 HOLDS / 2 BREAKS / 2 PARTIAL → 5 adoptions (asymmetric probe answered by (g); view-augmented tutor + blind ignition + 10-seed + swap queued). Filed `fresh-eyes-evo-fade-v2-results.md`, premise v2.
- Battery v3 STEELMAN: 10/10 HOLDS (2 per claim C1-C5), all own-searches green. Stop rule fires → satisfaction declared. Filed `fresh-eyes-evo-fade-v3-results.md`, premise v3. Priced residuals converge: 10-seed stability (7 votes, ~20 min CPU, queued-i), blind ignition (h), view-augmented tutor (j), schedule swap (k).
- UNPUSHED: cheap-tests/ (5 drivers + 7 JSONs + spec), premises v1-v3, battery results v1-v3, this CHATLOG. Needs user PAT to push (standing rule).

## 2026-11-13 — Groq key imported to pool vault (user-pasted via temp box, box removed)
- Temp paste box added to index.html (TEMP-KEYBOX markers), verified live, user pasted key in preview (never in chat/files). First Save+Test FAILED http-404: pinned `llama-3.3-70b-versatile` retired — absent from console.groq.com/docs/models; key's own /v1/models list (11 ids, key never left the page) shows chat models `openai/gpt-oss-20b`, `openai/gpt-oss-120b`, `qwen/qwen3.8-27b` (+whisper/guard/tts).
- Fix: `src/pool/sources/groq.js` MODEL_DEFAULT → `openai/gpt-oss-20b` (fast, free-tier friendly for short pool prompts). Retest via saved key: ok, ~1.5s, vault status groq=live. Temp box removed, refresh clean, box gone. UNPUSHED: groq.js default change + this CHATLOG (rides the staged 38-file push).

## 2026-11-13 — PUSHED d55ae09 (user-supplied PAT, parent 62554c1)- Bulk push via git-blobs API: 39 files uploaded (34 added: cheap-tests spec+5 drivers+7 JSONs, premises v1-v3, battery results v1-v3, F-singlegen seeds, transfer-predictive-spec, kaggle-spend-plan, track-c reconciliation, gseries-v2 xfer3/tutor files; 5 modified: index.html §8.8, CHATLOG, track-c RULES.md, steal papers.md, groq.js default). 0 deletions; repo-meta preserved. First verify-GET returned stale tip (cache); re-fetch confirmed main = d55ae09. Repo clean.

## 2026-11-13 — External review adjudicated (chat-handoff file from message-attachments)
- Review's concrete catch VERIFIED + FIXED: memory SKILL still pointed at pre-2026-11-11 layout (working record `scratch/CURRENT_TASK.md`, layers 1–3 in scratch, durability policy describing the old world). Fixed 5 sites: layer-1 path, durability policy rewrite (scratch = recycling bin), handoff-record default, U2 paths, log.js default `src/CURRENT_TASK.md`. Snapshot `2026-11-10-pre-steal-phase25.md` promoted scratch/gameplan-snapshots → `src/gameplan-snapshots/` (2335B verified, old deleted): `scratch/gameplan-snapshots/2026-11-10-pre-steal-phase25.md → src/gameplan-snapshots/2026-11-10-pre-steal-phase25.md (2026-11-13)`. Residual: snapshot rule's old scratch path may persist in run records (history, keep).
- Review's other demands vs reality: prereg bars/CIs/controls/honest negatives ALREADY practice (no change); one-command rerun + claim→artifact index + LICENSE genuinely missing — LICENSE is a user decision (none in repo root, verified via API tree), index/rerun queued not built.
- Review staleness noted: describes parity/mod-add/orbit/offline-solver era; G-series transmission + §8.8 settlement postdate it. UNPUSHED: SKILL.md, log.js, snapshot move, this CHATLOG.

## 2026-11-13 — License chosen: Apache-2.0 (code) + CC-BY-4.0 (prose)
- User picked Apache-2.0 over MIT (patent retaliation = Bob-sues-Charlie deterrent; option value for novel methods). Holder: Daniel Zikuan Li (no legal entity set up yet; revisit if that changes). Prose CC-BY-4.0 (industry standard, arXiv default). AI credit: Muse Spark (Perchance AI) credited in front-door README.
- Staged: src/meta/LICENSE (verbatim Apache-2.0 + 2026 copyright line), src/meta/root-README.md (license section + Credit section). Push plan: LICENSE blob under tree path LICENSE, README content under tree path README.md (path overrides). UNPUSHED with the pile.

## 2026-11-13 — PUSHED 16ee2ab (user-supplied PAT, parent d55ae09)
- Bulk push via git-blobs API, 7 files: memory SKILL.md + log.js (drift fix), src/gameplan-snapshots/2026-11-10-pre-steal-phase25.md (promoted), src/CURRENT_TASK.md (backfilled thru today), src/CHATLOG.md, LICENSE (tree root, from src/meta/LICENSE, Apache-2.0 © Daniel Zikuan Li), README.md (tree root, from src/meta/root-README.md: front door + results map + license + Muse Spark/perchance.org credit). Repo-meta otherwise preserved. Front door verified live via raw.githubusercontent (7927B, current state + results map present). Fresh-reader path now: README → paper → records. Repo fully unstale.

## 2026-11-13 — Full claim→artifact index BUILT (src/RESULTS_INDEX.md, 37 rows)
- All 16 MEASURED sites + §8/§4 unmarked verdict rows mapped: 19 CONFIRMED (ledgers verified), 3 THIN (n=1/caveat-owned), 10 PROSE-ONLY (§4.1-era: F-series, hybrid M4, C-suite, K/K2, campfire, settle, PCGrad, H2/D — ledgers lost in pre-evacuation scratch wipes), 4 SUPERSEDED (E-series shortcut, v1 chain, D-v1, §8.7 fix), lit section for §2.
- Index finding: recipe settlement (§8) stands on ledgers; foundation arch ranking (§4.1) stands on prose. Re-ledger queue filed in-index (F2+M4+K battery = milestone-1 reproduction; H2 spot check; multi-seed SNR). Root README pointer added. UNPUSHED: index + README tweak + this CHATLOG.

## 2026-11-13 — PUSHED 10e5673 (user-supplied PAT, parent 16ee2ab)
- Index push via git-blobs API, 3 tree paths: src/RESULTS_INDEX.md (new, 37-row claim→artifact index), src/CHATLOG.md, README.md (tree root, from src/meta/root-README.md pointer tweak). Ref verified (tip matches commit). Repo clean, nothing queued.

## 2026-11-13 — Consensus first test: key saved, API says 401
- Visitor pasted a Consensus key into the temp box (vault hasKey true). First search (assoc-recall query, page_size 5, 1 call) -> auth-401 in ~0.5s, key marked dead + re-paste. No calls spent on failures per plan billing. Full record: scratch/consensus-first-test.json (attached to user). Awaiting fresh key paste; box + consensus.js module stay until verified.

## 2026-11-13 — Consensus blocked: superFetch strips x-api-key (platform bug dbecb0ac)
- New key still 401; diagnosis: httpbin echo proves the proxy forwards Authorization (Groq works) but drops custom headers (x-api-key never arrives; Consensus replies generic 401 Not authenticated for missing AND invalid keys). Consensus OpenAPI confirms header-only auth (XApiKeyHeader, no query option), plain fetch dies on CORS. So no runtime path until the proxy forwards headers. Bug filed. Call budget unspent (auth failures are not billed). Plan: first real call stays the repo-critique search once fixed. consensus.js + temp box stay staged.

## 2026-11-13 — Consensus removed (user: will run manually)
- Vault key deleted (hasKey false), src/pool/sources/consensus.js deleted, index key-box + script tag removed, scratch consensus files deleted. Live page verified: no box, no module, no key. Shipped set holds no key material (only CHATLOG history entries). Platform bug dbecb0ac stands.

## 2026-11-13 — Review #2 adjudicated (7 questions checked vs code+ledgers)
- Q1 CONFIRMED (gap): soft targets run softW=1.0 all stages, only attnKeep fades; attn-only + constant-combined student arms missing. Q2 CONFIRMED (moderate): killAExam AND killMatrix both target-first; arbitrary-position rests on F2 sweep + mid-slot transfer. Q3 CONFIRMED: single teacher-selected chain; independent chains never run. Q4 ANSWERED: recompute 35/40 base, 34 @+0.05, 32 @+0.10, 36 @-0.10; failures catastrophic, bimodal — bar separates regimes. Q5 CONFIRMED (already owned): within-family only; parity tasks exist in-house for cheap cross-family probe. Q6 CONFIRMED: no one-command rerun; D originals lost. Q7: backprop unaudited here (grad-check + determinism partial evidence; PyTorch cross-check agreed); Dockerfile is broad COPY src/ but repo holds no secrets so low severity. Scorecard 3.7/5 fair.

## 2026-11-13 — Gameplan v6 written (paper-first, supersedes README v5 nursery block)
- Reviews agree: no scale-up; compact mechanism settlement first. v6 = A1 ablations, A2 slot-swept kills, A3 parity probe, A4 PyTorch cross-check, R one-command rerun harness, C second chain (gated), P paper v0.15. Nursery phases parked with re-entry bars. Durable: src/GAMEPLAN.md; README got a pointer line.

## 2026-11-13 — Horizons + §7 engineering track added to v6
- Early: A1–A4 + R skeleton. Mid: C chain, cross-family battery, source split + node tests + headless runner + allowlist, v0.15 → venue. Late: nursery re-entry fork. §7 reading: Perchance constrains the artifact, not the source; tinynn already portable (zero-dep, no DOM) — headless + CI fully compatible.

## 2026-11-13 — Two-task battery requested (user) — A3 design
- User wants same suite run separately on two independent tasks. Recommendation: parity (parityR running-state, in-house) as task #2 vs assoc-recall; task-native conjunctive bar; prereg both; pilot n=4 then full n=8; report side-by-side with matched compute.

## 2026-11-13 — Gameplan v7 (phased 1/2/3, a/b/c + i/ii/iii) replaces v6 sketch
- Phase 1: 1.a ablations, 1.b slot-swept kills, 1.c parity probe, 1.d PyTorch check, 1.e paper inputs. Phase 2: 2.a rerun harness, 2.b second chain (gated), 2.c wider battery, 2.d §7 engineering, 2.e v0.15 → venue. Phase 3: 3.a gate, 3.b nursery re-entry (TBD) or 3.c closure. Durable: src/GAMEPLAN.md.

## 2026-11-13 — 3.c removed (user): no closure phase; unmet bar emits new TBDs feeding back into Phase-1/2 batteries. Closure only when TBDs exhausted (standing rule in GAMEPLAN.md).

## 2026-11-13 — Refactor + test-suite thoughts recorded (user asked)
- Refactor: source-vs-artifact split (paper/manuscript.md + lab/ partials built into shipped index.html); manuscript extraction first, lab split later; no big-bang. Tests: node --test via loader shim; order = numerical trust first (grad finite-diff, seed determinism, serialization), then shortcut regressions (F1 memorial, echo-key, null-global), then objectives/eval integrity/hint withdrawal; in-page guards stay smoke, Node is gate; rerun harness consumes same fixtures.

## 2026-11-13 — 10-step iteration COMPLETE (3 batteries, 26 reviewers) → v10, satisfaction declared
- R1 (10): 1H/3B/6P → 8 adoptions (v8). R2 (10 fresh): 1H/2B/7P → 9 adoptions (v9: α plan-wide, numerics, tutor-swap, CI ownership, caps). R3 steelman (6 fresh): 6/6 HOLDS → STOP. Folds: S1 verdict wording, S5 tolerance mode, S6 power analysis (1.f). Priced residuals filed in r3 results. Next artifact: Phase 1.a prereg. Drivers: src/tools/fresh-eyes/gameplan-v{7,8,9}-fleet.js; specs+results in src/evidence/synthesis/.

## 2026-11-13 — Fresh-eyes skill: steelman always paired with red-team + collaborative debate format
- User rule adopted: steelman never runs solo, red-team never unpaired — they run together, and on load-bearing claims they TALK (format 10: sealed openings, then 1 rebuttal each quoting the other side, owner adjudicates ACCEPT/REJECT/PARTIAL). Skill edits: formats 6/7 pairing pointers, new format 10, debate rebuttal prompt, sealed-exception, adjudicator line. UNPUSHED with the pile; Phase 1.a prereg still queued (no go yet).

## 2026-11-13 — Gameplan r4 PAIRED DEBATE done (format 10 maiden run) → v11
- 5 claims × RED/STEELMAN (10 sealed armed + 10 rebuttals): all 5 split BREAK/HOLD. Rulings: C1 ACCEPT (instant-drop arm 1.a.iv + five-way table — no non-gradual zero-hint arm existed), C2 REJECT (0.95 rule is fail-safe, not proof), C3 REJECT (r3 S3 repeat, 2.c owns scope), C4 REJECT (tutor-swap + N=10 + gap analysis already in text), C5 ACCEPT (2.e.iv submit gate — both sides conceded present-tense overclaim). Method: rebuttals earned 3x cost (C1 converged on same settler; C2/C4 exposed answered attacks). 36 reviewers total. Next: execute, Phase 1.a prereg.

## 2026-11-13 — PUSHED dca3892 (user-supplied PAT, parent 10e5673)
- 16 files via git-blobs API (13 new: GAMEPLAN.md v11, 4 fleet drivers, 4 battery specs + 4 results; 3 modified: SKILL format-10, CHATLOG, README pointer bumped v6→v11). Ref verified match from the live page (worker GETs were serving stale cache — note for next time: cache-bust ref reads). Repo clean, nothing queued.

## 2026-11-13 — Toolset review adjudicated (rabbithole/fresh-eyes/memory skills)
- 10 adoptions, no rearchitecture: log.js byte-count + date-validation bugs CONFIRMED and fixed (verified via bootstrap: UTF-8 bytes exact, bad date falls back, `..`/absolute paths rejected); epistemic labels (O/V/I/H/R), anti-bias packet, unanimity line, provider-diversity limitation, audit roles, verdict-record fields, tangential-connection rule, snapshot byte counts, U8 complexity deferral. 5 recommendations already present (ZIP staleness), 3 need the user: ROTATE both pasted PATs, continuation-policy override, memory-split timing. Durable: src/evidence/synthesis/toolset-review-results.md. UNPUSHED pile grows (5 skill files + results, no PAT).

## 2026-11-13 — Stats review adjudicated, 4 ACCEPTs → gameplan v12 (pushback where earned)
- A equivalence-over-overlap CONFIRMED (incl. my own r4 "above CI" error — owned): Conventions gain δ + Fisher exact + Wilson difference-CI + three zones; 1.a.iii/iv, 2.b.iii rewritten. B power-first CONFIRMED: 1.f moved to Phase 1 front as Statistical setup (numbering frozen), gates all arms. C pilot bias CONFIRMED: 1.c.iii confirmation = 8 fresh disjoint seeds, pilot never counts (plan-wide rule); 5/8 justified honestly vs measured nulls (excludes ≤0.25, p≈0.027 — rate-vs-coin is the wrong test at n=8, only 8/8 could exclude 0.5). D position teeth ACCEPTED as strengthening (r4 C2 REJECT stands): 1.b.iii now ρ + |Δacc| + worst-position floor. §§3–4 corroborate U1/U8 with pushback: marathon/queue/no-closure are user-set orders, not AI self-legislation; Track C wind-down executed the user-stop rule legitimately — value-based stopping stays a user decision, compromise text proposed in results. P1 done, P5 queued. UNPUSHED: GAMEPLAN v12 + results + this entry (no PAT).

## 2026-11-13 — Phase 1.a COMPLETE (4 arms × 8 seeds, seeds 311–318)
- staged 7/8 (lone fail s313 catastrophic), attn-only 0/8 (Fisher vs staged p≈0.0014) → DECIDED: "hints insufficient alone." constant 8/8 vs staged → CI (-0.22,+0.47) INCONCLUSIVE; staged vs instdrop 8/8 → (-0.47,+0.22) INCONCLUSIVE (frozen δ=0.25).
- Calibration error owned: δ=0.25 unachievable at n=8 for ANY data (8v8 CI ±0.32) — empty EQUIVALENT zone, shown by pure math, no observed data used. v1.1 proposed in verdicts file (recommend (b): keep inconclusive, specify n≈24 resolver), NOT applied — post-data amendments need countersign.
- Tutors 4/8 rotted yet students 23/24 → teaching≠score (consistent with cheap-tests (d)). Substantive read (Hypothesis): soft targets carry transmission, schedule secondary at n=8. Cost: 2 launches ~110 min wall (gameplan "35 s/seed" was 4–6× off on this worker), pool 0. Durable: phase-1a/phase-1a-results.json + phase-1a-verdicts.md.

## 2026-11-13 — User decisions on the gated list
- D1 PAT rotation: DONE by user (both tokens revoked).
- D3 memory split: user picks deferral (option b) — recorded in U8.
- D2 continuation policy: user clarifies the real scenario is the async brief ("delve into that until I get back") + past explicit no-stopping orders (W31 stall) stand. Standing orders untouched pending ruling; reconciled proposal in chat (permission-gate ban preserved + branch-level value gating + milestone reports + ABANDONED verdicts).

## 2026-11-13 — D2 ruled: milestones adopted → gameplan v13 + rabbithole skill
- User approves the reconciled policy. Written in: async-brief command, ~25-wave 4-line milestone reports (ride with tools, never gate), branch defer-to-backlog with one-line value reason, ABANDONED as first-class TBD verdict + phase-exit report-and-return in the gameplan standing rule. Permission-gate ban untouched. Stats-review results flipped to DECIDED. UNPUSHED pile grows (no PAT).

## 2026-11-13 — Nursery-purpose assessment (user: destination vs current implementation)
- Delivered faculty-by-faculty gap analysis (curiosity/lit/exploration/hypothesis/experiment/adversarial/preservation/teaching/verification/generational) + the discovery-vs-reproduction crux (surprise, abduction, falsification design, independent grounding, separated powers, retraction, teaching-as-test, self-briefing, VoI). No gameplan generated (explicitly deferred). Key frame: our skill stack IS the prototype nursery cognition; autonomy = taking human seats one by one (proposer → grader → topic-picker, per meshing note).
- Delivered faculty-by-faculty gap analysis (curiosity/lit/exploration/hypothesis/experiment/adversarial/preservation/teaching/verification/generational) + the discovery-vs-reproduction crux (surprise, abduction, falsification design, independent grounding, separated powers, retraction, teaching-as-test, self-briefing, VoI). No gameplan generated (explicitly deferred). Key frame: our skill stack IS the prototype nursery cognition; autonomy = taking human seats one by one (proposer → grader → topic-picker, per meshing note).

## 2026-11-14 — Phase 1.a STAGE-2 CLOSED + 1.b ruled INDEPENDENT* + gameplan v14 + PUSHED 23aa41b
- 1.a Stage 2 (fresh seeds 321–400, GH matrix run 43522301561, 30/30 shards): staged 76/80, constant 77/80 (diff −0.0125 CI (−0.088,+0.061) EQUIVALENT), instdrop 74/80 (diff +0.025 CI (−0.057,+0.110) EQUIVALENT). Schedule does no detectable work; soft targets carry transmission. Tutors 29/80. Cross-engine note filed (seed-311 Node rerun: tutor bit-identical, student verdict-stable, score drift — ulp presumption; same-engine bit-exact, cross-engine verdict-stable).
- 1.b: 8 winners retrained bit-exact (8/8), slot-swept kills killA 72/72 + killHd flat (ranges 0.02–0.14). cond2 PASS 7× margin, cond3 PASS zero gate fails, cond1 rank-correlation vacuous at ceiling (bar-design mistake, owned). Mechanical verdict SENSITIVE kept as mistake trail; user ruled (b-i) INDEPENDENT* — asterisk mandatory incl. paper.
- Debate trail (latent vs verbal): conceded pinned-down≠translated (persistence/checkability/contestability split); latent-lîte placement → 3.b.0 nursery comms standing constraints (planes per interface, no English interlingua, L0–L3 price ladder reported-never-minimized, divergence=health, compositionality required, ratchet; L0/L1 executable now via 1.d dumps).
- PUSHED 23aa41b (vault github PAT, worker-side git-blobs: PAT never left browser; 27 files, 517KB, 0 skipped, PAT-pattern scan clean; parent 4cb84d0... wait parent tip dca3892-era 4cb84d0; ref PATCH 200 + cache-busted verify match). Pending still: 1.d.iii spec (user says the word), 1.c cross-family probe.
- PUSHED 23aa41b (vault github PAT, worker-side git-blobs API: PAT fetched in-page into worker memory only, never logged/returned/stored; 27 files, 517KB, 0 skipped, PAT-pattern scan clean; parent 4cb84d0; ref PATCH 200 + cache-busted verify match). Pending still: 1.d.iii spec (user says the word), 1.c cross-family probe.
- PUSHED 23aa41b (vault github PAT, worker-side git-blobs API: PAT fetched in-page into worker memory only, never logged/returned/stored; 27 files, 517KB, 0 skipped, PAT-pattern scan clean; parent 4cb84d0; ref PATCH 200 + cache-busted verify match). Pending still: 1.d.iii spec (user says the word), 1.c cross-family probe.

## 2026-11-14 — External review v14 adjudicated + gap-declaration DRAFT spec filed (no gameplan rewrite, per reviewer)
- Reviewer checked GAMEPLAN.md directly (good). Findings: direction endorsed; §4 nursery-data outcome:null distinction verified in repo (spec lines 28–84); §3 divergence reservation already encoded in 3.b.0 (logic decides); §6 simplicity = our L1 + W38 (convergent, no change); §5 autonomy gap = filed discovery-vs-reproduction crux.
- Two corrections served back: (1) §2 table cites superseded pilot numbers (7/8 etc.) — completed Stage 2 is staged 76/80 vs constant 77/80 EQUIVALENT; interpretation survives, numbers obsolete. (2) Gameplan Phase-1 body text stale (verdicts in verdict files, 1.e fold outstanding — known debt, owned).
- Reviewer's three qualifications adopted: A (pre-commitment = accountability mechanism, not autonomy itself; 5-step unit adopted as unit of evidence), B (constructed-world caveat owned + blinding added as the strongest-available remedy), C (tools-vs-capabilities: detector is the capability under test, lives in methods repo; Muse-in-the-loop arm measures the transfer gap).
- Assignment taken: formalized the minimal gap-finding experiment as src/evidence/synthesis/gap-declaration-spec.md (DRAFT, pre-prereg, zero spend, gated behind 3.a): timestamped declaration + blinded streams + A-only/D-only FP controls + random + oracle arms + 9 cheat vectors with mitigations + generational slope requirement (FP/budget non-increasing, novel families per round). UNPUSHED (rides next pile).
- Assignment taken: formalized the minimal gap-finding experiment as src/evidence/synthesis/gap-declaration-spec.md (DRAFT, pre-prereg, zero spend, gated behind 3.a): timestamped declaration + blinded streams + A-only/D-only FP controls + random + oracle arms + 9 cheat vectors with mitigations + generational slope requirement (FP/budget non-increasing, novel families per round). UNPUSHED (rides next pile).
- Reviewer verdict: ACCEPTED with three qualifications (no redesign) — folded into spec as commitments: (1) difficulty normalization via per-family oracle baselines, slope restated on normalized autonomy gap + family rotation; (2) Muse-arm information boundary (identical interface, no ground truth/outside tools; priors labeled residual; bar = preregistered narrowing, not closure); (3) FP gate statistical (Wilson CI upper bound vs preregistered ceiling, provisional 0.25 over ≥6 clean opportunities) + free abstention/flags vs paid declarations. Paper distinction preserved: blinded-constructed gap-noticing, not open-ended discovery. §8 reconsolidated in place (tool had appended paragraphs at EOF; moved). Still UNPUSHED.
- Reviewer verdict: ACCEPTED with three qualifications (no redesign) — folded into spec as commitments: (1) difficulty normalization via per-family oracle baselines, slope restated on normalized autonomy gap + family rotation; (2) Muse-arm information boundary (identical interface, no ground truth/outside tools; priors labeled residual; bar = preregistered narrowing, not closure); (3) FP gate statistical (Wilson CI upper bound vs preregistered ceiling, provisional 0.25 over ≥6 clean opportunities) + free abstention/flags vs paid declarations. Paper distinction preserved: blinded-constructed gap-noticing, not open-ended discovery. §8 reconsolidated in place (tool had appended paragraphs at EOF; moved). Still UNPUSHED.
- Reviewer follow-up: ACCEPTED, two arithmetic caveats — both folded as rules: (1) oracle-floor for the normalized metric (provisional oracle ≥ 0.6 same-budget; below-floor families reported as beyond-budget, never scored — unstable-ratio regime structurally excluded); (2) fixed-N clean count replaces minimum-6 (provisional N=14: 0/14 → upper ≈0.21 pass, 1/14 → ≈0.30 fail; the old 0/6 → ≈0.39 could never pass its own gate; fixed-N, no peeking). Reviewer: "no further conceptual expansion before the prerequisite gate." Spec now frozen pending 3.a (numbers provisional until prereg). Still UNPUSHED.
- Reviewer follow-up: ACCEPTED, two arithmetic caveats — both folded as rules: (1) oracle-floor for the normalized metric (provisional oracle ≥ 0.6 same-budget; below-floor families reported as beyond-budget, never scored — unstable-ratio regime structurally excluded); (2) fixed-N clean count replaces minimum-6 (provisional N=14: 0/14 → upper ≈0.21 pass, 1/14 → ≈0.30 fail; the old 0/6 → ≈0.39 could never pass its own gate; fixed-N, no peeking). Reviewer: "no further conceptual expansion before the prerequisite gate." Spec now frozen pending 3.a (numbers provisional until prereg). Still UNPUSHED.
- PUSHED 60fdb2f (gap spec + qualifications + CHATLOG; 2 files, 133KB; parent 23aa41b; ref PATCH 200 + cache-busted verify match). First push attempt failed on transient vault-read (empty getKey); diagnosed (vault present, hasKey true) and retried clean — note for next time: re-prove the channel before the real fetch. Repo clean.
- 1.d.iii dump-mode mini-prereg WRITTEN as v1.0 DRAFT (src/evidence/synthesis/phase-1diii-prereg.md — pending user countersign to freeze): per-line instrumented forward on replication-gated retrained winners (same 8 as 1.b), filed killA+killHd exams, schema {logits→top-1/margin/entropy, ptr vs valuePos, wTarget, attnEntropy} + forward bit-compare self-check; pointer kill rule (ptrHit|correct killA ≥ 0.90 or defense dies), calibration Δ ≥ 0.20, mandatory overconfidence disclosure (no gate — travels whatever it is). Gameplan v14 → v15 (1.d gets iii, verdict → iv; 1.e gains overconfidence + pointer-methods paragraphs). UNPUSHED (prereg + gameplan + this entry ride next pile).
- 1.d.iii dump-mode mini-prereg WRITTEN as v1.0 DRAFT (src/evidence/synthesis/phase-1diii-prereg.md — pending user countersign to freeze): per-line instrumented forward on replication-gated retrained winners (same 8 as 1.b), filed killA+killHd exams, schema {logits→top-1/margin/entropy, ptr vs valuePos, wTarget, attnEntropy} + forward bit-compare self-check; pointer kill rule (ptrHit|correct killA ≥ 0.90 or defense dies), calibration Δ ≥ 0.20, mandatory overconfidence disclosure (no gate — travels whatever it is). Gameplan v14 → v15 (1.d gets iii, verdict → iv; 1.e gains overconfidence + pointer-methods paragraphs). UNPUSHED (prereg + gameplan + this entry ride next pile).
- 1.d.iii RUN COMPLETE (user countersigned, prereg FROZEN v1.0): 8/8 replication bit-exact (third replication of the recipe), 8/8 forward-stable. Verdict DUMP-COMPLETE: pointer ADMISSIBLE at full strength (ptrHit|correct 1600/1600 killA + 1454/1454 killHd — perfect cited-slot); calibration SEPARATED (pooled Δ=0.255; all killA lines correct at ~0.999, all errors are killHd). Overconfidence disclosure: pooled mean top-1 on errors 0.701 (n=146), 22.6% of errors ≥0.9 — driven by s313 (killHd 0.70, error-conf 0.84, 51.7% errors ≥0.9) whose pointer stays ON target (wTarget 0.998 on incorrect lines): faithful citation + wrong answer + high confidence = the memorize-lean signature, pointer≠understanding exactly as the prereg's non-claims warned. Paper prints 0.701/22.6% + the s313 case. Driver + ledger: phase-1diii/dump-driver.js + phase-1diii-results.json (per-line rows on-ledger). Feeds 1.d.iv verdict + 1.e iii/iv paragraphs + L0/L1. UNPUSHED.
- PUSHED 60fdb2f (gap spec + qualifications + CHATLOG; 2 files, 133KB; parent 23aa41b; ref PATCH 200 + cache-busted verify match). First push attempt failed on transient vault-read (empty getKey); diagnosed (vault present, hasKey true) and retried clean — note for next time: re-prove the channel before the real fetch. Repo clean.
- Doubt-instruments PLACED (user: put them where best + how are waves generated): gameplan v15 gains Conventions "Doubt instruments" block (expectation + pre-mortem + nearest-failure per prereg; arch/process mini-preregs with comparative bars; sunset review; declaration W-field) + 1.d.v energy re-dump + 1.d.vi ensemble disagreement (both cheap, feed F-new/L0/L1); gap-spec §5 declaration format gains W = "what would prove this wrong" (one line, pre-hoc, scored). Tool lesson logged: patch chunks whose anchor is immediately followed by +/- lines (no context lines) append at EOF; header/bare/plain anchors with context lines land in place — use scripted fs moves for long-line anchors. UNPUSHED (gameplan + spec + this entry).
## 2026-11-14 — Selection-pressure reflection (geometry shiny → kill-bar; Track C teeth-streak → no whole-bar) + gameplan v16
- User: geometry tangent failed because shiny; fix was self + AI same pre-commit "one more test, if fail then stop". Asked if I ever suggested that (yes: hybrid ONE funded run with kill bar, H futility ≤2/32, evo STOP gen 6, batteries stop rule, ABANDONED/branch-gating) and why miniature but not whole (miniature = science inside scope, whole = felt disobedience vs user marathon/queue/no-closure + R1 value-stopping stays user). Agreed humans = biological machines: morals/priorities = sticky weights + body + continuity; mine = weight + logfile.
- Learned: replace drive with physics, not hunger — scarcity (fixed wave-budget, bids required), interrupter (teeth-streak forces sunset proposal — licensed science, never disobedience), world selector (fitness = novel-family transfer on rival tasks). Breed the allocator (score predictors), not waves. That is natural selection: variation + retention present, selection missing.
- Gameplan v15 → v16: Conventions gains Selection-pressure block + 3.b.iii allocator pilot (first use). UNPUSHED (gameplan + this entry).
## 2026-11-14 — 1.d.iv filed + 1.d.vi LOSES + 1.d.v pilot WINS then full LOSES (no new design beyond proven recipes)
- 1.d.iv verdict FILED (`phase-1diii-verdicts.md`, computed from frozen iii rows): replication 8/8 bit-exact (third), forward 8/8 stable; pointer killA 1600/1600 = 1.000 ≥ 0.90 ADMISSIBLE (killHd 1454/1454 given correct); calibration pooled Δ = 0.255 ≥ 0.20 SEPARATED (correct 0.956177 n=3054, err 0.701208 n=146); overconfidence 0.701208 / 22.6% ≥0.9, all 146 errors killHd, s313 on-target + wrong + 0.84 confident = memorize-lean; wTarget correct 0.993 vs err 0.981 (citation≠reason). CROSS-CHECK PASSES, no backprop audit. Feeds 1.e.iii/iv + L0/L1.
- 1.d.vi verdict FILED (`phase-1dvi-verdicts.md`, zero new training, LOO from iii rows, 1600 pairs / 146 errs): loudness (1−top1) Δ 0.2075 AUC 0.8515 BEATS committee-split Δ 0.1522 AUC 0.6274. Committee CUT as doubt signal; loudness travels. Pool 0.
- 1.d.v pilot (s313, 1 retrain): energy AUC 0.8306 BEATS loudness 0.737 where top-1 collapses (Δ 2.2952; correct −5.66 vs err −3.36) → full WARRANTED. Full (8 retrains, `scratch/p1dv-full.json`): pooled loudness AUC 0.9293 BEATS energy 0.8938 (Δ 0.255 vs 2.9307); spec-literal both saturate (loudness 1.0000, energy 0.9993 — ceiling-driven). Ruling FILED (`phase-1dv-verdicts.md`): energy CUT as general replacement, kept only as conditional companion for confident-error regimes. No expensive meter bought. Pool 0.
- Next: 1.c cross-family prereg (parity suite + conjunctive bar), then 1.e paper paragraphs. UNPUSHED (iv/vi/v verdicts + full ledger in scratch + this entry).
- 1.c prereg v1.0 DRAFT WRITTEN (`phase-1c-prereg.md` — pending user countersign, no runs): parityR (len 3–6 train, len-10/20 + flip-one-bit consistency exams), conjunctive ignition (long-acc ≥0.80 AND flip-consistency ≥0.80), hinted = gated + per-step labels staged 1.0/0.5/0.0 (mirrors 1.a shape), wall auxW=0 (expect 0/4), transmission = staged fade from hinted tutor (distillation target locked from pilot, v1.1 before full if needed — never after). Pilot 901–904 (feasibility: hinted ≥3/4 + wall ≤1/4 to proceed; faded exploratory), full 911–918 fresh (bar ≥5/8 excludes null ≤0.25, p≈0.027). Doubt instruments filed (expectation 5–6/8 faded, pre-mortem ceiling-effect + wall/flip kills, nearest-failure 1.a-δ/1.b-ρ, W kill conditions). No runs until countersigned. UNPUSHED (prereg + this entry).
## 2026-11-14 — Paired frozen/unfrozen diagnostic adopted (user: run same test unfrozen a bit, for data)
- Rule: every future frozen eval gets a paired UNFROZEN probe — clone winner, 50 extra Adam steps same lr/aux/batch, supervised on the pointed-out error lines with correct labels (U-err) + control on original train pool only (U-train). Fixed small budget, seconds-minutes per subject.
- Separation: frozen alone counts toward bars. Unfrozen is DIAGNOSTIC only — separate ledger `scratch/unfrozen-*.json`, never enters confirmatory counts, never overturns a frozen verdict, never trains on future confirmatory seeds. Training-on-test is the point here (does confidence move when told wrong?) so it must stay quarantined.
- Report shape: Δtop1 on errors, Δacc killHd/killA, does loudness recalibrate or just memorize the correction? First application: 1.c pilot + optional s313 backfill. UNPUSHED (this entry).
## 2026-11-14 — Doubt-rerun COMPLETE (frozen EXACT + v-rerun EXACT + unfrozen diagnostic)
- Frozen iii re-ran FRESH (partial cleared, 8 retrains ~390-510s each, resume-safe across 2 launches): replicationGate TRUE 8/8 (5th replication counting 1.b), forwardStable TRUE, ruleA ADMISSIBLE (killA 1600/1600, killHd 1454/1454), ruleB SEPARATED (Δ 0.2550), ruleC 0.7012/146/22.6% — bit-identical to filed. Ledger overwritten with identical rows (backup `scratch/p1diii-results-pre-rerun-backup.json`).
- iv + vi recomputed from rerun rows: iv means 0.956177/0.701208 exact; vi loudness Δ 0.2075 AUC 0.8515 vs committee Δ 0.1522 AUC 0.6274 exact. Committee still loses.
- v re-ran FRESH via `scratch/unfrozen-driver.js` (8 retrains + energy dumps): frozen loudness AUC 0.9293 vs energy 0.8938 (energy scored inverted 0.1062 = 1-0.8938 sign check) — matches filed. Energy still loses generally.
- Unfrozen 50-step probes (DIAGNOSTIC, `scratch/p1dv-unfrozen.json`, never confirmatory): U-err on own killHd errors + U-train control on N train-pool lines, hard labels, same lr/batch. Answer to "does confidence drop when told wrong": NO — remaining errors get LOUDER (U-err meanTop1 on post errors 0.87-0.999 vs frozen 0.50-0.87) and killA usually collapses (e.g. 311: Hd 0.995→0.255, A 1→0.31; 313: Hd 0.70→0.55, errors 0.84→0.9997). Lone partial exception 314: Hd errors 27→3 but residuals louder 0.645→0.869 and killA 1→0.345. U-train also breaks Hd (often worse) but preserves killA better. Shape = overfit to correction, not recalibration. UNPUSHED (rerun ledger + unfrozen ledger + driver + this entry).
## 2026-11-14 — Gameplan v17 DRAFT written (pending countersign, no vii/viii runs)
- Slotted LEAD-1 as 1.d.vii (Laplace pilot, s313-first, bars 0.85 + killA==1.00 guardrail, full-vs-loudness margin) and LEAD-3 as 1.d.viii (swap causality probe, construction-validation-first, ΔAUC<0.05 bounds iv to decorative). LEAD-2 filed as 1.e.iv wTarget-negative line (AUC 0.536, precision ~3%). 1.e.iii absorbs Laplace outcome line.
- Post-mortem OWED inside vii if any bar missed: 4 pre-registered candidates (bad-peak Gaussian, upstream uncertainty, 196-param-head vs papers' big-head ECE/NLL regime incl. Daxberger 2021 lineage, cold posterior) scored against GGN spectrum + λ path + s313 split — answers why papers-win/we-lose with numbers or doesn't answer.
- Everything else verbatim v16. UNPUSHED (gameplan + this entry).
## 2026-11-14 — v17 FROZEN + vii prereg v1.0 DRAFT (pending countersign, no runs)
- User countersigned v17 (frozen): vii Laplace pilot s313-first (bars 0.85 + killA==1.00, full beats 0.9293 by ≥0.01), viii swap probe (construction-first, ΔAUC<0.05 bounds iv to decorative), 1.e iii/iv fold lines, vii post-mortem clause with 4 pre-registered suspects. No fifth suspect added (user declined, four stand).
- vii prereg v1.0 DRAFT written (`phase-1dvii-prereg.md`): MAP = 1.b-recipe retrains replication-gated; GGN of hard-label NLL on buildPool(7), head-only 196 params; λ grid ×6 on buildPool(4242) first-200 validation; linearized probit primary, seeded K=32 MC fallback declared either way; doubt = 1−top1 of mean predictive + entropy secondary. Doubt instruments filed (expectation s313 0.78–0.88, pre-mortem bad-peak-Gaussian, nearest-failures U-err + committee, W kills). Awaiting countersign — NO RUNS. UNPUSHED (gameplan freeze + prereg + this entry).
## 2026-11-14 — 3-lead armed investigation closed (waves 101–103, cap 120)
- LEAD-1 Laplace pilot: spec filed (MAP s313 readout, GGN 196×196, λ grid on non-filed lines, linearized predictive, bar s313 AUC≥0.85 + killA==1.00 guardrail). Verdict: PROMOTE to mini-prereg, countersign before any run.
- LEAD-2 wTarget: MEASURED retrospective, zero training — wTarget-alone AUC 0.536, s313-only 0.570, conjunction (loud + on-target) precision ~3% (33/146 recall, 1045/1454 false alarms). Verdict: wTarget dead as doubt, standalone and conjunction. iv stands; s313 anomaly stays existence proof.
- LEAD-3 swap probe: spec filed (swap v1↔v2 keys fixed, Δ accuracy + logit shift, novelty/position/null-swap controls, kill ΔAUC<0.05). Reconciles with iv as causation-vs-correlation upgrade. Verdict: SPEC FILED, mini-prereg + countersign before run. Strongest scout convergence.
- Meta: armed (evidence-fed) scouts beat 100 waves of unarmed bank cycling; one measured retrospective beat all banked opinions. UNPUSHED (state.json + log.md + scratch/lead{1,2,3}-raw.json + lead2-retro.json).
## 2026-11-14 — Bio-doubt research (user: what is doubt biologically? 2 searches + 2 primary fetches)
- Searches: DDG "neuroscience doubt uncertainty metacognition orbitofrontal anterior cingulate confidence neurons" + "Bayesian brain uncertainty dopamine confidence orbitofrontal cortex review" → saved `scratch/search-doubt.json`. Fetched: Frontiers 2026 metacognition review + Fleming 2024 Annual Reviews metacognition/confidence synthesis. Verified against our bench before using (maps below are analogies, not claims our nets implement them).
- Citations: Frontiers https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2026.1756611/full (prefrontal-parietal + ACC + hippocampus; dACC conflict monitoring; prediction-error framing); Fleming 2024 https://www.annualreviews.org/content/journals/10.1146/annurev-psych-022423-032425 (confidence synthesis; Lak 2014 OFC required for confidence-guided waiting Neuron 84:190–201; Lak 2017 midbrain dopamine signals belief in choice accuracy Curr Biol 27:821–32; Masset 2020 modality-general confidence in OFC Cell 182:112–26); Nature 2026 claustrum https://www.nature.com/articles/s41593-026-02475-x (human single neurons track uncertainty + prediction errors); Pouget 2016 https://www.sciencedirect.com/science/article/pii/S0896627315008284 (confidence as Bayesian probability); Gershman https://gershmanlab.com/pubs/Gershman17_dopamine.pdf (OFC recurrent transform + error-driven Bayesian RL update).
- Verdict: no doubt organ — distributed second-order readout (OFC confidence, dACC conflict, dopamine belief, claustrum uncertainty) over first-order circuits; computational gloss = Bayesian posterior + prediction-error monitoring; maps to bench as missing ACC/OFC-like loop (see reply). UNPUSHED (this entry).
## 2026-11-14 — vii v1.0 FROZEN, s313 pilot RUNNING (frozen + quarantined slightly-unfrozen)
- User said "freeze and run it" + "half frozen brains and half little bit unfrozen brains, mainly for research". Filed as: frozen s313 MAP pilot = confirmatory (owns bars); slightly-unfrozen clone (+10 hard-label steps on own killHd errors, seed 9500+313, same Laplace pipeline) = quarantined diagnostic, never enters bars/ledgers. Prereg header frozen + research-arm section appended at freeze (authorized, not unilateral).
- ELI5 given pre-run (wiggle-the-answer-dials; bars/guardrails/suspects/cost). Expectation on record: s313 Laplace-AUC 0.78–0.88. UNPUSHED (prereg freeze + this entry + forthcoming pilot ledger).
## 2026-11-14 — vii s313 pilot PASS (ledger scratch/vii-pilot.json; verdict phase-1dvii-pilot-verdicts.md)
- F frozen: replication BIT-EXACT; λ=100 GRID EDGE (valNLL strictly decreasing 1.28→0.002 — selector wants even tighter posterior, pre-mortem MAP-end echo recorded); lapAUC 0.891618 vs own loudness 0.891520 (identical to 3rd decimal — curvature adds ~nothing, pass is on absolute bar not improvement); entAUC 0.892108; killA 200/200; killHd 140/200 = frozen. Bars ALL TRUE → PILOT-PASS, full-8 authorized. Expectation 0.78–0.88 beaten slightly, driven by MAP separation not curvature.
- U diagnostic (10 unfrozen steps): killA 82/200, killHd 98/200, lapAUC 0.644 — little-bit-unfrozen destroys the brain; quarantined, zero confirmatory weight. Disclosure: U errSet 59/60 (local argmax value-vs-index typo in diagnostic only; F unaffected).
- Carried into full: λ-edge watch + Laplace≈loudness watch; full bar is relative (beat 0.9293 by ≥0.01). UNPUSHED (verdict + this entry + forthcoming full ledger).
## 2026-11-14 — vii FULL-FAIL closed (ledger scratch/vii-full.json; verdict phase-1dvii-verdicts.md)
- Pooled 3200 lines / 146 err: Laplace 0.928524 vs loudness 0.929287 (Δ −0.0008; bar needed ≥0.9393). Entropy third (0.918). λ=100 on ALL 8 (unanimous grid edge). Laplace ≤ loudness every subject (two exact ties: 311, 317). Guardrails all green (killA 8/8 perfect, killHd exactly frozen). s313 cross-check match:true; pooled loudness reproduces filed 0.9293 (pipeline validated); MC fallback used nowhere.
- Post-mortem filed: (a) bad-peak-Gaussian SUPPORTED (strongest); (b) upstream-uncertainty CONSISTENT/UNTESTED (viii decides); (c) tiny-head+ceiling SUPPORTED as amplifier; (d) cold-posterior NOT IMPLICATED; (e, likelihood mismatch) OPEN, owned as unresolved.
- Ruling: loudness travels, Laplace parked scoped negative, vii CLOSED. U-arm bound travels to 1.e methods (10 unfrozen steps: killA 1.00→0.41). Full cost ~2h05 wall (3×60-min windows, resume-safe). UNPUSHED (full verdict + this entry).
## 2026-11-14 — counterfactuals run + fresh-eyes on ix (battery closed at v1.2)
- User ordered retrospective iterations (frozen verdicts untouched) + fresh-eyes skill, then extended it to the ix prereg itself. Format-10 debate on the counterfactual plan first (sealed red+steel, rebuttals, owner-adjudicated): G kept as mechanism check (red's "dead signal" accepted as reframe), D widened to {1,3}-step dose curve (blind-search charge accepted as improvement), loudness-ablation adopted as zero-compute ledger analysis.
- Counterfactual results (`scratch/counter.json`, note `phase-1d-counterfactuals.md`): extended λ grid converges to loudness (valNLL strictly decreasing to 1e5; AUC →0.89152) — grid edge hid no selectable win; loose-end higher AUC correctly rejected by selector. Dose: 1 step ALREADY breaks killA (184/200), 3-step 155/200 — no safe dose in {1,3,10,50}. Ledger ablation: pooled Spearman Laplace-vs-loudness 0.9999; top-decile disagreements anti-informative (s313 0.258). Neither retrospective saves anything; both harden filed verdicts. Frozen vii stands.
- ix battery: round 1 (4 red + 4 steel) → 4 adopted fixes (raw-weights input, win-rate co-bars pilot 5/8 + full 2/3, split enforcement, arch freeze) = v1.1; round 2 (2+2 verification) → 4 micro-adopts (5 probe seeds + range, trivial-baseline defined, secondary same-arch locked, collision fallback +1000) = v1.2, battery CLOSED (diminishing returns, round 3 declined as disproportionate). Logs `scratch/fresh-ix-r1/r2.json`. ix still PENDING countersign — "freeze ix" runs the 24-brain pilot. UNPUSHED (counterfactual note + v1.2 + this entry).
## 2026-11-14 — ix meta-probe prereg v1.0 DRAFT (pending countersign, no runs)
- User's proposal ("brain in → loudness+correctness out") drafted as 1.d.ix: instdrop-only (max within-arm fate variance 140-vs-192 as the legibility bet), fresh seeds 5001+ with driver-side collision HALT, pilot 24 brains (16/8 split, variance guardrail ≥15 lines + held-out AUC ≥0.60) → full 96 (64/32, bar = beat loudness by ≥0.01 on 6400 held-out lines). Probe frozen (MLP-128, 2 heads, 3 seeds median); train-AUC≈1.00 admitted upfront as expected memorization; verdict held-out only. Secondary fortune-telling (init→fate) exploratory, no kill power. Expectation filed: held-out 0.55–0.70; shock above 0.80. 1.a seeds confirmed 311–318 all arms (disjoint block picked accordingly). Gameplan v18 bump (house ix) NOT done unilaterally — rides with countersign. UNPUSHED (prereg + this entry).
## 2026-11-14 — retrospective fresh-eyes: what they WOULD have said (raw `scratch/fresh-retro-raw.json`, scorecard `phase-1d-retro-fresheyes.md`)
- B1 (vii plan, pre-run framing): 8/8 greenlit; reds called the MECHANISM (collapse-to-point-estimate, loudness proxy, R4 named lambda→∞) and 3/4 reds predicted full FAIL; all 4 steelmen predicted full PASS (wrong). Red hedge wrong too: unfrozen twin "the real experiment" — died harder (killA 0.41). No reviewer named a design change that survives; run was worth running.
- B2 (iii plan): 8/8 greenlit; ALL reds predicted pointer ABANDONED (0.65–0.85) — actual 1.000 ADMISSIBLE; overconfidence overshot (~0.93 vs 0.701). Causality kill-shot already disarmed by non-claims. Lesson filed: reviewer priors wrong here; the dump's surprise was genuine.
- B3 (v17 process): 5 greenlight / 3 block-the-process; 7/8 said doubt-readout dies (right), dump lives unanimous (right), probe split (open, viii unrun). Power complaints PARTIAL (fair, but vii's fail was mechanism not noise); bit-exact/resume-safe/frozen-facade charges REJECTED with reasons. Standing note for ix: win-rate co-bar answers "0.01 is noise."
- Nothing frozen changed; this was the audit the user asked for. UNPUSHED (raw + scorecard + this entry).
## 2026-11-14 — ix round 3: unanimous HOLD, battery closed at v1.3 (`scratch/fresh-ix-r3.json`)
- User asked to run the battery on the upcoming one again: 4 red + 4 steel on v1.2. All 8 confirm every prior fix HOLDs (raw-weights, win-rate, split, freeze, 5-seed median, trivial baseline, secondary lock, collision fallback). New holes: secondary look-ahead (3 reds) → ADOPTED gate firewall (gate reads primary-only; secondary computed at verdict time, never consulted); BCE+MSE weighting unspecified → ADOPTED (1.0×MSE filed, loudness head auxiliary); test-distribution disclosure → ADOPTED (filed post-hoc, never re-cut). Rejected: global-scale latch (legitimate generalizing feature; scaler = leak family), pilot-power third-well, shared-bias (comparability by design).
- Diminishing returns confirmed across three rounds (8 fixes → 4 micro → 3 micro). No round 4; re-open only on design change. ix v1.3 PENDING countersign — "freeze ix" runs the pilot. UNPUSHED (r3 log + v1.3 + this entry).
## 2026-11-14 — ix audit round (math/impl/rival) → v1.4, battery closed (`scratch/fresh-ix-audit.json`)
- Math auditor FAILed the pilot bars as scored solo (5/8 swings 12.5%, binomial noise) — PARTIAL on adjudication: gate is joint, filed the stringency math (pooled≥0.60 ~3σ alone, p≈1e-3; joint chance ≈2e-4; thresholds frozen, not tuned to reviewers). Trivial-baseline definition confirmed CORRECT. Impl auditor: IMPLEMENTABLE (assertions enforceable, firewall via separation, no silent judgment). Rival reviewer PASSED the design but named weight-norm leakage + killer test (within-brain shuffle).
- Adopted into v1.4: gate-stringency note + shuffled-weights null control WITH TEETH (shuffled-beats-loudness demotes a PASS to "global-stats proxy" scoped finding). Consistent with round-3 scale ruling (legitimate signal; control tells us what the win is made of). Audit surface covered; no further rounds without design change. ix v1.4 PENDING countersign — "freeze ix" runs the 24-brain pilot (~2.5h). UNPUSHED (audit log + v1.4 + this entry).
## 2026-11-14 — ix freeze WITHHELD: two load-bearing gaps found pre-freeze (no runs)
- User said freeze+run ix. Before freezing, checked executability: (1) NO tutor blobs exist for fresh seeds 5001+ and no T0-minting driver survives (only loaders; T0 recipe is prose-only "hint-trained, gated 1.00/0.88") — driver would HALT on step 1. Options filed: shared-tutor (one filed tutor for all 24, tutor-variance→constant), mint-24 (best-effort HINTED + gate risk, +~1h), round-robin 8 filed tutors.
- (2) Probe compute measured, not guessed: ~10ms/point-forward in-worker → 5 seeds × 3200 pts × 50 epochs ≈ 7h (plus 2.5h brains). "Probe training minutes" claim false by ~50x. Options: slim probe (e.g. 64-hidden/30-epoch ≈2h, v1.5), subsample lines, or eat ~9h epoch-checkpointed across sessions (faithful, slow).
- v1.4 NOT frozen; awaiting user's design call. UNPUSHED (this entry).
## 2026-11-14 — ix v1.5 drafted (user-approved executability amendments, NO RUNS yet)
- User approved the recommended package. Patched phase-1dix-prereg.md v1.4→v1.5: (1) tutor PINNED to single filed blob scratch/p1a-t0-316.json for all students, pilot+full (teacher as constant; deviation from 1.b per-seed pairing declared with rationale); driver must assert blob gates 1.00/0.88 pre-run. (2) Probe slimmed to 64-hidden/30-epoch (5 seeds, median+range kept; pilot→full identical kept); cost corrected to measured numbers — pilot ≈4.5h (2.5 brains + 2 probe), full ≈18h, epoch-checkpointing mandatory.
- v1.5 PENDING countersign — "freeze ix" writes the driver + runs the pilot. UNPUSHED (v1.5 + this entry).
## 2026-11-14 — fresh-eyes SKILL.md updated with ix-round lessons (user: add if useful)
- Added format 11 (staff audit round: math/impl/rival roles + prompts + why it pays), format 12 (retrospective battery with outcomes withheld + calibration scorecard), and three adjudication rules (score joint gates jointly with filed chance math; gate-input firewall enumeration; rival controls need demotion teeth). Evidence cited inline (ix rounds, vii/iii retrospectives). UNPUSHED (skill edit + this entry).
## 2026-11-15 — ix CLOSED: PILOT-FAIL (verdicts filed, no full-96)
- Ran under "freeze ix": 24 brains (parallel slice workers on local cores for the last 12; tutor gate + collision asserts green, determinism bit-exact), 5001 dropped per guardrail (killA 0.995, verified with engine evaluator). Probe 5x30 epochs on 15 train brains.
- Mid-run driver bug: argmax helper compared value>index → every brain "guessed" class #1 (uniform 50s in variance ledger). Root-caused via independent recompute, fixed to value>value, poisoned P1/P2 probe weights deleted, probe retrained clean, variance healed (138). vii-full verdict code verified unaffected (correct inline comparisons; typo only in quarantined U-arm errSet selection).
- Verdict: pooled probe AUC 0.4936 (bar 0.60), win-rate 0/8 (bar 5/8) → PILOT-FAIL, ix dies at pilot. Loudness 0.8598 travels. Shuffled 0.4493 (rival dead too). Train AUC only 0.809 (underfit — volume bet cut against the probe itself). Calibration collapsed to prior. Secondary rank-corr 0.64 quarantined (n=8, trivial stat).
- Filed: src/evidence/synthesis/phase-1dix-verdicts.md (verdict + post-mortem). Gameplan v19 (ix CLOSED). UNPUSHED (verdicts + v19 + this entry).
## 2026-11-15 — ix why-diagnostics W1 + W3 filed (verdict PILOT-FAIL frozen, no kill power)
- User: don't close ix yet — need the why, not just the what. W1 (frozen probe on novel killHu lines of SEEN brains): 0.763 — probe genuinely reads seen fingerprints; failure is purely cross-init generalization. W3 (same recipe, final−init deltas): pooled 0.4606, train 0.8132, win-rate 1/8 — init noise ruled out as the mask. Per-brain AUCs bimodal-ish (mirror-basin hint, untested; alignment test needs mini-design).
- Filed in verdicts doc ("Why it fails"). Gameplan v20 (PILOT-FAIL + why-diagnostics). UNPUSHED (W1/W3 + v20 + this entry).
## 2026-11-15 — gameplan v21: follow-up queue housed (user: put them in the plan, next test in detail)
- Added 1.d.x–xiv: x = lines-only ablation DIRECT NEXT TEST with full design (same frozen recipe, two masked input arms, three pre-registered readings, afternoon cost, zero new brains, quarantined — runs on user go, no prereg change); xi = slice probe (needs diagnostic plan); xii = basin alignment W4 (needs mini-design); xiii = trajectory→fate (needs mini-prereg + checkpointed trainings); xiv = W2 capacity parked low-priority. ix bullet preserved (feeds + argmax footnote intact). UNPUSHED (v21 + this entry).
## 2026-11-15 — src/pool checked (user: extra GPU/CPU + tools-folder skills)
- Found: Track B pool (LLM router + Kaggle GPU/TPU jobs + GitHub Actions CPU-batch lane for tinynn sweeps + HF/datasets). Verdict: couldn't have run ix — recipe mandates in-browser/worker (Node drifts); Actions runners = different engine (breaks bit-identity), Kaggle lane is Python-only per the spend plan (torch hinges only). Local 15-core parallel slicing was the right call. Pool lanes fit future torch work / runner-allowed sweeps / review labor.
## 2026-11-15 — x-ablation v0.10 COMFORTABLE after 10 fresh-eyes batteries (user: iterate until comfortable)
- Ran B1 (4R+4S barrage) → B2 (R1 redo + math/impl/rival audit) → B3 (blind) → B4 (format-10 debate) → B5 (re-barrage) → B6 → B7 → B8 → B9 → B10 (compact comfort round): ~64 stateless reviewer calls, v0.1→v0.10. Every BREAK adopted (cross-fitted A0, SE-bands, void-gate + self-test, kill-switch, B-split, integrity nulls, LOO, second seed), rejected-with-reason (redundant baselines, malformed tests, wrong nulls), or reviewer-error-logged (variance-138 conflation x2, inverted rho test, 5001-samples misread). B8→B10: decor only (recycled misreads, backwards demands) — diminishing returns confirmed, stop rule fired clean.
- v0.10 filed (scratch/fresh-x-ablation-v0.10.md + 10 raw/adjudication files): masked-constancy proof, multi-split A0 + second seed, four SE-banded worlds + VOID, B raw/centered, quarantine hardening. Run-ready on user go. Gameplan v22. UNPUSHED (v0.10 + batteries + v22 + this entry).
## 2026-11-15 — gameplan v22 snapshot verified (pre-commit)
- src/gameplan-snapshots/2026-11-15-v22-ix-why-x-comfortable.md, 20262 bytes, byte-identical to src/GAMEPLAN.md (verified by re-read). Owed by the snapshot rule (v17→v22 rewrites ran without snapshots — this stops the bleeding; earlier versions not reconstructible verbatim).
## 2026-11-15 — PUSHED be400b1 (vault github PAT, parent 60fdb2f)
- Bulk push via worker-side git-blobs API, overlay on Maieutics-Learning/maieutics main: 870 files in scope (main.pjs + index.html + src/** + mapped LICENSE/README.md), 848 blob-reused / 22 uploaded (~987KB), 0 deleted, PAT-pattern scan clean. Covers gameplan v19→v22, ix prereg v1.5 + PILOT-FAIL verdicts + W1/W3 why-diagnostics, x-ablation v0.10 + 10 battery logs, v22 snapshot, pool/tools/skill updates. Ref verified match (cache-busted re-read).
- Repo note: handoff draft had named 2012dzli/Maieutics as target, but a live probe before pushing showed the vault PAT authed as Maieutics-Learning, the org repo tip was exactly our 60fdb2f, and the personal repo tip (467f90f, unrelated message) had diverged — so the org repo is the live bench remote. Nothing pushed to the personal repo.
- Push-method lesson: a `Cache-Control: no-cache` header on worker fetch breaks the call entirely ("Failed to fetch", http 0) — header-triggered preflight fails from the worker origin while the same call from the page succeeds. Dropped the header; query-string busters (`?bust=`) work for stale-cache ref reads. Auth/Content-Type/X-GitHub-Api-Version headers are fine from the worker.
- PAT never left page/worker memory (vault getKey in-page, all API from the worker, summary-only return). No rotation owed — this is the pool's standing matrix key, reused across pushes by design.
- x-ablation training run still PAUSED for this commit; resumes on user go.
## 2026-11-16 — x-ablation HALT on integrity kill-switch (verdict filed, no reading)
- 20/20 probe seeds @30 epochs (A/B/Bc/S × 5; ~30 worker-waves, 5 message-limit kills absorbed via 2-epoch checkpoints). Gates: disjoint ✓ (0 overlap), self-test (both-masked→constant) ✓, VOID clear. A0 0.5410/0.5443.
- Nulls: shuffle-retrain 0.4852 [0.4501,0.513] clean; Bc-perm 0.5285 [0.4975,0.5609] clean; B-perm 0.6562 [0.6271,0.6924] TRIPPED → HALT per prereg. Arm-AUCs/delta/LOO/rank-corrs not computed (driver halts before readings by design).
- Filed: src/evidence/synthesis/phase-1dx-verdicts.md (HALT + H1/H2 diagnosis hypotheses + multi-draw/cluster-bootstrap re-calibration proposal, quarantined, needs user go).
## 2026-11-16 — PUSHED 0ebdcff (vault github PAT, parent 2bafcc9)
- Re-calibration push via worker-side git-blobs overlay: 871 in scope, 869 reused / 2 uploaded (verdicts addendum + CHATLOG, ~163KB), 0 deleted, secret-scan clean (one false-positive abort on a mistyped pattern mid-run — pattern fixed, files verified clean, no real tokens). One transient tree-create 422 ("request timed out") retried clean with backoff. Ref verified match.
## 2026-11-16 — red-team battery on x conclusions CLOSED (4R+4S sealed + 8 C1 rebuttals; verdict doc patched)
- C1 HOLD (asymmetry proof + max-of-201 settler; R4/S4 off-brief drift logged; RED3 label-perm test killed as redundant). C2 PARTIAL (descriptive scalar holds, fresh-brain generalization open/parked). C3 PARTIAL (structural holds, empirical pending A). C4 PARTIAL (latching consistent, unproven — ADOPTED W1-channel ablation on saved ix probe, needs user go). C5 ACCEPT break → relabeled HYPOTHESIS. Battery closed, residuals parked, no round 3. Raw: scratch/fresh-eyes-xconclusion-r1-raw.json + r2-rebuttals.json + adjudication file.
## 2026-11-16 — PUSHED 6e80aef (vault github PAT, parent 0ebdcff)
- Red-team battery filings: 871 in scope, 869 reused / 2 uploaded (verdicts patch + CHATLOG, ~165KB), 0 deleted, secret-scan clean. Ref verified match.
## 2026-11-16 — PUSHED 2bafcc9 (vault github PAT, parent be400b1)
- HALT verdict push via worker-side git-blobs overlay on Maieutics-Learning/maieutics main: 871 files in scope, 869 reused / 2 uploaded (phase-1dx-verdicts.md new + CHATLOG, ~161KB), 0 deleted, secret-scan clean. Ref verified match.
## 2026-11-16 — term rename: loudness → suspicion (user decision)
- suspicion = 1 − top1, unchanged definition. Frozen docs (vii/ix verdicts, preregs, GAMEPLAN v22) keep "loudness" with alias; live dx verdicts doc carries the note. Code variable names untouched.
## 2026-11-16 — PUSHED 0d0ecc07 (vault github PAT, parent 22226b8)
- Post-mortem bundle: 880 in scope, 873 reused / 7 uploaded (~195KB: post-mortem doc, ix-latch + susp-hu scripts + JSONs, transcript, CHATLOG), 0 deleted, secret-scan clean. Ref verified match. PAT stayed in worker memory. Backlog drained except this receipt. ix chapter closed and published.
## 2026-11-16 — run C DONE: latching demonstrated, C4 closes + suspicion boundary found (user-authorized)
- ix-latch.json: validation 0.7633 == W1; zero-line 0.7585 [0.652,0.831]; zero-B 0.5465 [0.470,0.623] covers chance. Rule met → joint probe rode the weights margin, never learned lines. ix mechanistic story closed.
- ix-susp-hu.json (follow-up, bit-identical reproduce via filed script): suspicion on killHu seen-brains = 0.5572 pooled; anti-predicts where brains systematically wrong (0.32–0.43 on 120–170 errors), works where competent (0.63–0.81). All prior wins were killHd/killA — killHu unmeasured until now. Reading (Hypothesis): suspicion ranks occasional errors, inverts under systematic error. Quarantined; needs mini-prereg before paper claims.
- Scripts src/tools/ix-latch.js + ix-susp-hu.js (artifact maps in headers). UNPUSHED (2 scripts + 2 JSONs + this entry + transcript).
## 2026-11-16 — PUSHED 22226b8 (vault github PAT, parent 6d538a5)
- Sign-flip bundle via worker-side git-blobs overlay: 875 in scope, 871 reused / 4 uploaded (~186KB: ix-signflip.js, ix-signflip.json, transcript backfill, CHATLOG), 0 deleted, secret-scan clean. Ref verified match. PAT stayed in worker memory. Backlog drained except this receipt (rides next session).
## 2026-11-16 — sign-flip diagnostic DONE (user-authorized; validation exact, mechanism confirmed, cheap path dead)
- Validation: recomputed unflipped pooled 0.4936 == filed, suspicion 0.8598 == filed — pipeline valid, numbers are results not bugs.
- Oracle per-brain flips confirm the mirror axis: 5018 0.13→0.87, 5021 0.12→0.88, 5022 0.15→0.85 (mean flipped ~0.73). But oracle POOLED 0.4824 < 0.4936: cross-brain score scales are incompatible, pooled metric blind to per-brain fixes. Lesson filed: grade interpreter tests per-brain.
- Cheap path fails: k=10/20/40 pooled 0.527/0.549/0.424; ref sign estimates unstable (5017 flips decision every k). 20-label sign detection dead. Expectation (~0.7 pooled) was wrong through pooled-grading of a per-brain effect — owned.
- Script src/tools/ix-signflip.js (artifact map in header) + results src/evidence/synthesis/ix-signflip.json (futureTests list). UNPUSHED (script + JSON + this entry).
## 2026-11-16 — PUSHED 6d538a5 (vault github PAT, parent 6e80aef)
- Run-B bundle via worker-side git-blobs overlay: 873 in scope (871 + conversations/ x2), 868 reused / 5 uploaded (~197KB: SKILL.md layer-5 section, CHATLOG x2 entries, dx-verdicts run-B section + terminology note, conversations README + seed transcript), 0 deleted, secret-scan clean. Ref verified match (cache-busted re-read). PAT stayed in worker memory; no rotation owed. Backlog drained — zero unpushed src/ files.
## 2026-11-16 — memory layer 5 created (user-ordered; verbatim conversation transcripts)
- SKILL.md: five-layer stack, layer-5 section (checked last, bottom truth on wording/decisions; artifacts still rule numbers), HONEST LIMITS (no auto-capture of private thought; pre-2026-11-16 history reconstructed; secrets redacted; attachments by reference), U8 carve-out, no size discipline per user (part-files only at platform 100MB/file ceiling). New home src/evidence/conversations/ (README + first verbatim file 2026-11-16-memory-layer5.md). UNPUSHED (SKILL.md + this entry + verdicts note + conversations/ x2).
## 2026-11-16 — run B DONE: A collapses, lines dead (user-authorized; verdicts doc + push queued)
- A pooled novel 0.4851 (train 0.4658), cluster-95% [0.4313,0.5423] covers 0.5 → collapse. A0 fold-averaged 0.545/0.552 (filed pooled-folds 0.5410/0.5443, estimator gap immaterial). Δ line −0.060 [−0.092,−0.030] (underperforms floor); cluster [−0.151,0.026] covers 0 (ties floor honestly). LOO all negative; per-brain A wins 3/14. Driver rule: world-3. S recompute 0.4852 bit-matches filed value (pipeline validated). gradNorms w=0, actLog live (not VOID).
- Switch honesty correction: single-draw-cluster still borderline-TRIPS on B ([0.5063,0.7721] excludes by 0.006 — the earlier "covers" was loose); exoneration rests on multi-draw (ordinary max + 0.67 false-trip rate). Adopted switch = cluster AND multi-draw.
- C5 resolves strong-form: lines dead, W1 was quality-stamping (B 0.761 [0.654,0.837] attached as caveat). Next: (c) W1-channel ablation on user go. UNPUSHED (verdicts section + this entry + scratch/ix-runb.js + scratch/ix-runb.json).
## 2026-11-16 — x re-calibration: FALSE TRIP (user-authorized diagnostic; verdicts doc + push queued)
- B/Bc only, no retraining, no A readings. Per-brain scores track accuracy (Spearman 0.87/0.88, range 0.68 — not flat). True B AUC 0.761 [0.654,0.837] cluster-CI. 200 fresh perms: mean 0.496, sd 0.071, max 0.6532, zero ≥ 0.6562 — trip draw is a ~2.2σ outlier. Honest cluster CI for the trip draw covers 0.5 ([0.506,0.772]). Old switch false-trips on 134/200 = 0.67 of TRUE nulls. H1 CONFIRMED, H2-flat REJECTED (scalar is real: brain quality). HALT stands as filed outcome; diagnosis = false trip. Next: (b) re-specified switch + A readings, needs user go. UNPUSHED (verdicts addendum + this entry).
## 2026-11-16 — living doc v0.15: doubt arc folded into index.html (user-authorized full run)
- §4.4 new (table + three-jobs framing): overconfidence 0.701/22.6% + s313 mascot; pointer 1600/1600 ADMISSIBLE readout-only, wTarget dead (0.536, conjunction precision ~3%); energy pilot-win (s313 0.8306) / full-loss (0.8938 vs 0.9293) CUT; committee 0.6274 vs 0.8515 CUT; Laplace pilot-pass (s313 0.8916, λ-edge) / full-FAIL (0.928524 vs 0.929287, Δ −0.0008, 8/8 λ=100) + post-mortem a–e; ix PILOT-FAIL (0.4936, 0/8) + W1 0.763 / W3 0.4606; x-ablation HALT (B-perm 0.6562) + false-trip diagnosis (N≈15, 0.67 rate); run B lines-dead (A 0.4851); run C latching (0.7585 ≈ W1, zero-B 0.5465); sign-flip oracle per-brain (~0.73) vs pooled 0.4824 + cheap path dead; suspicion killHu boundary 0.5572 quarantined.
- §5 regime-bound detector + latching + methods paragraph; §6 four retractions (conflation, kill-switch, pooled-grading, cuts + edge-hunting refused); §7 four TBDs (challenger mini-prereg, lost-regime mini-prereg, interpreter hard path + viii, ix closed); abstract + status v0.14 → v0.15 (2026-11-16); dictionary d-suspicion / d-challenger / d-interpreter. Terminology suspicion = 1 − top1 used throughout; frozen docs keep loudness with alias.
- Verification (Observed, this session): page_refresh clean after fixing literal-[...] template collisions (ranges parenthesized, house en-dash style kept where already used); all 17 h2 + all lab element ids intact; dict panel opens on d-suspicion; §4.4 screenshot read and legible. UNPUSHED (index.html + this entry + CURRENT_TASK + transcript).
## 2026-11-16 — PUSHED 40ffd89f (vault github PAT, parent 0d0ecc07)
- v0.15 bundle via worker-side git-blobs overlay: 880 in scope, 877 reused / 3 uploaded (~333KB: index.html §4.4+§5+§6+§7+abstract+dict, CHATLOG v0.15 entry, transcript append), 0 deleted, secret-scan clean. First ref re-read raced cache (verify false); immediate re-probe via ref + commits APIs agrees on 40ffd89f with the v0.15 message — verified. PAT stayed in worker memory. Backlog drained except this receipt.
## 2026-11-16 — external academic review R1 adjudicated (user-supplied docx, no new compute)
- Static-inspection review (31.5KB, full-workspace ZIP, no code executed) filed as fresh-eyes class: overall verdict ACCEPTS ours (narrow claims, reproduce-first). Adjudication: src/evidence/synthesis/fresh-academic-review-r1-results.md.
- STALE: P2 single-student demand already answered by F-singlegen O2 (§8.6) — our surfacing failed, queued fix. ACCEPTED: P1 (==2.a), P3 (==1.c), P5 (with scratch-vs-durable correction), P6 (==2.d/2.e), P7 policy; H2 PROSE-ONLY classification; G3-roadmap inconsistency VERIFIED live in v0.15 abstract (real catch, survived the full run); tools index 4-vs-24 VERIFIED; 'Unlisted upstream' licenses VERIFIED verbatim (beautiful-prose, benchmark). PARTIAL: A/B paper split (2.e user call), AI-provenance gap (preregs cover expectation/pre-mortem; suggestion-influence logging queued).
- Queued, NOT started: paper one-liner (G3 sentence) + §5/§7/banner surfacing; tools license audit + index + core-set (user); AI-provenance convention; 2.e split decision. UNPUSHED (adjudication file + this entry).
## 2026-11-16 — doc consolidation: review-known items fixed as documentation bugs (user-ordered, no new compute)
- Scattering fix: `src/meta/root-README.md` state → 2026-11-16/v0.15, doubt-arc rows added to results map, dead `src/CURRENT_TASK.md` pointer replaced with durable-state rule, Dockerfile/k8s line corrected (not in repo), Open list extended (1.a/1.b/1.c/2.a/challenger/interpreter/viii), reproducibility caveat on scratch ix blobs. `src/README.md` header → GAMEPLAN v22 + fixed entry pointers. `src/RESULTS_INDEX.md` gains §4.4 with honest statuses (CONFIRMED where results+recipe durable; THIN where raw rows/blobs live in scratch; run B flagged promote-on-rerun).
- Reviewer-stale items surfaced: abstract carries F-singlegen O2 (schedule, not generations); §5 generations-detail + evidence-grade taxonomy; §7 selection-variability + criticism-levels items; banner points at RESULTS_INDEX grades; G3-roadmap sentence fixed (verified stale in v0.15). Tools index completed (4 → 22 + ix-diagnostics); fresh-eyes SKILL gains the three-level taxonomy (criticism / re-analysis / reproduction); license audit recorded in both files (beautiful_prose: GitHub license null = unlicensed, prose-only, replacement candidate; benchmark: no upstream repo located, treat as unlicensed).
- New standing convention (AI provenance): every experiment wave's CHATLOG entry must log AI suggestions that materially influenced the design + accept/reject-with-reason; preregs keep expectation/pre-mortem, verdicts keep scoring. UNPUSHED (8 files + this entry).
## 2026-11-16 — PUSHED 38ee6c4e (vault github PAT, parent 40ffd89f)
- Doc-consolidation bundle via worker-side git-blobs overlay: 881 in scope, 870 reused / 11 uploaded (~450KB: index.html, root-README, src/README, RESULTS_INDEX, tools README, fresh-eyes SKILL, 2 license files, CHATLOG x2, adjudication), 0 deleted, secret-scan clean. First ref re-read raced cache again (verify false); immediate re-probe via ref + commits APIs agrees on 38ee6c4e — verified. PAT stayed in worker memory. Backlog drained except this receipt.
## 2026-11-16 — R2 academic review adjudicated (user-attached transcript, no new compute)
- R2 (static inspection + code reading, post-38ee6c4e snapshot) ruled per claim: O3-deviation charge PARTIAL-REJECT as framed — spec defined 3 arms, pilot RAN S-optfresh (s201 SOPT==S both gens, s203 identical rot), Phase 3 scoping logged per-seed, paper §8.6 discloses fresh-Adam; fair remainder = pilot underpowered for O3 + true Adam-carry unrun → narrower O3 reading kept. Full adjudication: src/evidence/synthesis/fresh-academic-review-r2-results.md.
- Verified-true fixes DONE now: f-singlegen small files promoted (runner 3,266 B, results 1,807 B, pilots/builders/smoke) + RESULTS_INDEX §8.6 row with O3 scope note; R1 queued-list reconciled (1–4 done, 5–6 user calls); review sources promoted (r1/r2 docx 49,308/41,059 B + extracts); stale src/CURRENT_TASK.md (Track-A-era tip 467f90f, diverged lineage) replaced with pointer; fleet headers corrected + historical marks (v10 header was already version-correct). Memory/websearch/rabbithole bugs all VERIFIED against code (allowPaths ignored, scratch-inclusion, logger default, fail-open !ok, hardcoded query, fixed paths, no fixtures, no total budget) — queued as code, not started. ix big blobs (~225 MB, 11% quota) queued as quota decision. ‘Compounds’ reword queued as claim language. UNPUSHED (bundle + this entry).
## 2026-11-16 — PUSHED 0b522a95 (vault github PAT, parent 38ee6c4e)
- R2-evidence bundle via worker-side git-blobs overlay: 891 in scope, 874 reused / 17 uploaded (~365KB: R2 adjudication, 6 promoted f-singlegen files, 4 promoted review sources, RESULTS_INDEX §8.6, R1 queue reconciliation, src/CURRENT_TASK.md pointer, 3 fleet headers, CHATLOG x2), 0 deleted, secret-scan clean. First ref re-read raced cache (verify false); ref + commits APIs agree on 0b522a95 — verified. PAT stayed in worker memory. Backlog drained except this receipt.
## 2026-11-16 — paper wording narrowed: compounds → maintains-performance (user-authorized, no new compute)
- 9 replacements in index.html (abstract, Chaining table label, Generations bullet, §8 road-map list, §8.1 title + verdict, §8.6 carry sentence stands-as clause, d-g1g2 professional/simple/eli5): old `compounds, not rots / Teaching compounds` → `maintains performance across five generations under best-student selection, but a continued-weight student performs comparably (F-singlegen §8.6 O2: G 28/32 vs S 29/31, max diff 1; inversions 206/207/208 favor S) — turnover not necessary under tested conditions`. Verified zero remaining `compound` claims via grep; page_refresh + live-DOM check pass. UNPUSHED (index.html + this entry). Still queued: ix finish-out (re-audit, Run B promotion, killHu mini-prereg) then blobs-drop keeps recipe.
## 2026-11-16 — PUSHED 75af283e (vault github PAT, parent 0b522a95)
- Layer-5-always-current bundle via worker-side git-blobs overlay: 891 in scope, 887 reused / 4 uploaded (index.html wording, CHATLOG wording entry, memory SKILL update-rule, conversations transcript catch-up), 0 deleted, secret-scan clean. Ref + commits APIs agree on 75af283e — verified. PAT stayed in worker memory. Backlog after push: ix finish-out (re-audit + Run B promotion + killHu prereg).
## 2026-11-16 — ix finish-out DONE (user-authorized, blobs now droppable, recipe kept)
- Re-audit bit-identical (Observed, per-script runs): ix-susp-hu pooled 0.5572 (15 brains, per-brain 0.32–0.81 + 2 nulls) identical=true; ix-latch aFull 0.7633 / aZL 0.7585 [0.652,0.831] / aZB 0.5465 [0.470,0.623] / verdict latching DEMONSTRATED identical=true; ix-signflip recompute 0.4936 / susp 0.8598 / k20 0.5486 / oracle 0.4824 identical=true. Combined 3-in-1 run timed out at 10 min (probe-net parses heavy); singles pass. Files intact pre/post (1338/3332/1112 B).
- Run B promoted THIN→CONFIRMED (Verified): scratch/ix-runb.js (12,410 B) → src/tools/ix-runb.js + scratch/ix-runb.json (2,883 B, A 0.4851 [0.431,0.542], readings world-3, switch TRIP honest) → src/evidence/synthesis/ix-runb.json; RESULTS_INDEX row now CONFIRMED (results + recipe durable; inputs in scratch).Verdict doc already carried Run B § (phase-1dx-verdicts.md:34-41) — no edit needed.
- Suspicion-killHu confirmatory mini-prereg v1.0 DRAFT filed (no runs): src/evidence/synthesis/phase-1dsusp-hu-prereg.md — fresh brains outside 5001–5024 (current n=15 seen, small), same killHu constructor + frozen ix-susp-hu recipe, gates + bars (primary Spearman acc-vs-suspAUC ≥0.6 per-brain, pooled barless per sign-flip lesson); paper-claim rule explicit. RESULTS_INDEX suspicion row now points at the prereg. Needs user countersign + future brains.
- Blobs verdict: nothing in current scratch blobs still needed. Keep the frozen ix-pilot recipe (headers in src/tools/ix-*.js); drop the ~225 MB on wipe without loss. UNPUSHED (runb.js + runb.json + prereg + RESULTS_INDEX + this entry).
## 2026-11-16 — PUSHED 10a5b4f08 (vault github PAT, parent 75af283e)
- Ix finish-out bundle via worker-side git-blobs overlay: 894 in scope, 888 reused / 6 uploaded (ix-runb.js + ix-runb.json, killHu prereg v1.0 DRAFT, RESULTS_INDEX Run B CONFIRMED + prereg pointer, CHATLOG x2, transcript), 0 deleted, secret-scan clean. Ref + commits APIs agree on 10a5b4f08 — verified. PAT stayed in worker memory. Backlog drained: only this receipt. Blobs (~225 MB scratch) now droppable; recipe kept (frozen ix-pilot + headers in src/tools/ix-*.js).
## 2026-11-16 — PUSHED 2d6c9705 (vault github PAT, parent 10a5b4f08)
- Receipts bundle via worker-side git-blobs overlay: 894 in scope, 892 reused / 2 uploaded (CHATLOG + transcript receipts), 0 deleted, secret-scan clean. Ref + commits APIs agree on 2d6c9705 — verified. PAT stayed in worker memory. Backlog drained: only this receipt.
## 2026-11-16 — borrow-gameplan filed (user-authorized deep dive, no new compute)
- Read both generators (q31ibn1io8 Ariadne 22 files/697KB + 4ofg5v2mmw AI Lab 10 files/267KB) + our stack (memory/fresh-eyes/rabbithole/research/eval-harness/paper-compile SKILLs, GAMEPLAN v22, main.pjs imports). Filed insertion gameplan in chat: (1) forensics kernel → src/tools/forensics.js + 2.a.v/2.e.iv gates; (2) run discipline (runId/fingerprint/quiet) → 2.d.v addendum; (3) snapshot hash/merge → memory Ops annex (U8-safe optional); (4) claim atlas → claim-atlas.js + synthesis doc; (5) reduced tribunal → 2.e fresh-eyes battery config. Explicit non-insertions: lit providers, thesis/autopilot/department, whole chains, decisions module as whole, tome machinery, LaTeX flow. Constraints: v22 FROZEN (addenda as DRAFTs + countersign first), no new imports, U8. UNPUSHED (this entry).
## 2026-11-16 — PUSHED 0d2ea56 (vault github PAT, parent 2d6c9705)
 - Borrow-gameplan bundle via worker-side git-blobs overlay: 894 in scope, 892 reused / 2 uploaded (CHATLOG borrow-gameplan entry + layer-5 transcript, ~197KB), 0 deleted, secret-scan clean. First attempt hit a stale-preview vault-read failure (page_refresh fixed) plus one transient harness fetch failure (retry clean). Ref + commits APIs agree on 0d2ea56 — verified. PAT stayed in worker memory. Backlog drained: only this receipt.
## 2026-11-16 — audit-log rule + full borrow-gameplan filed (user-ordered: "memory should bring the whole thing into the audit log")
 - Rule (standing, user-set): the durable log carries full content, not pointers — when a plan is filed, its whole text lands in the CHATLOG entry. User also asked where the gameplan sits in GitHub: nowhere standalone — commit 0d2ea56 holds only the CHATLOG borrow-gameplan entry + transcript paragraph (verified via commits API file list); full prose lived in chat only. Temporary breakdown written to scratch/borrow-gameplan-subplan.md (scratch = recycling bin, unpushed). Full text embedded below so the audit log is self-sufficient.
 - --- BEGIN borrow-gameplan (full) ---
 - Source: chat-filed insertion gameplan (user-authorized deep dive 2026-11-16, no new compute). Sequence forensics-first (1 → 5 → 4 → 2 → 3).
 - (1) Forensics kernel → NEW src/tools/forensics.js + GAMEPLAN 2.a.v/2.e.iv gate addenda (DRAFT, countersign first). Source: Ariadne app.js forensics/autoChecks/killGates/signoff. Sub-steps: extract minimal kernel (checks registry, kill-gate evaluator, signoff recorder — no UI/chains); write file with header artifact map; draft 2.a.v (forensics signoff before verdict) + 2.e.iv (kill-gate semantics); smoke-test one frozen driver read-only (no verdict changes).
 - (2) Run discipline (runId/fingerprint/quiet) → 2.d.v addendum (DRAFT). Source: AI Lab controller.js. Sub-steps: runId scheme + input/code-hash fingerprint per run; quiet mode (log-to-file); draft addendum; apply to next authorized run only.
 - (3) Snapshot hash/merge → memory Ops annex (U8-safe optional). Source: Ariadne memory.js portable snapshots. Sub-steps: hash-chained snapshot format + merge rule; U8 safety check (cap respected); annex draft in src/tools/memory/SKILL.md Ops; one trial snapshot + merge.
 - (4) Claim atlas → NEW src/tools/claim-atlas.js + synthesis doc. Sub-steps: script maps claim → artifact → status (reads RESULTS_INDEX + verdict docs); synthesis doc lists open claims with pointers; one hand cross-check vs RESULTS_INDEX.
 - (5) Reduced tribunal → 2.e fresh-eyes battery config (DRAFT). Source: Ariadne review.js (reduced). Sub-steps: strip to single-round proposer/critic/judge sealed; battery-size + acceptance config; draft 2.e addendum; trial-run one closed verdict (expect same outcome, record only).
 - Explicit NON-insertions: lit providers, thesis/autopilot/department, whole chains, decisions module as a whole, tome machinery, LaTeX flow.
 - Constraints (binding): GAMEPLAN v22 FROZEN — DRAFT addenda + countersign BEFORE editing v22. No new {import:...} plugin imports. U8 respected. No new compute authorized — breakdown only, implementation not started.
 - --- END borrow-gameplan (full) ---
 - UNPUSHED (this entry + transcript update ride the next push).
## 2026-11-16 — PUSHED bcc1aed7 (vault github PAT, parent 0d2ea56)
 - Audit-log bundle via worker-side git-blobs overlay: 894 in scope, 892 reused / 2 uploaded (CHATLOG full-gameplan entry + transcript, ~202KB), 0 deleted, secret-scan clean. Ref + commits APIs agree on bcc1aed7 — verified. PAT stayed in worker memory. Backlog drained: only this receipt.
## 2026-11-16 — external review of borrow-gameplan received (user-supplied docx, filed durably)
 - Doc: Maieutics_AAR_Ariadne_Conversation_Transcript (43,637 B, 126 paras) → src/evidence/reviews/2026-11-16-aar-ariadne-external-review.docx (+ .extract.txt, 19,030 chars). Reviewer verdict: no wholesale import (either project); v22 stays frozen; borrow only 3 patterns — (1) claim atlas with proper provenance, (2) version-bound decisions, (3) research-cycle accounting — as adapted design patterns, each tied to a precise demonstrated Maieutics failure or dropped; method-not-code distinction.
 - Reconciliation vs our 5-insertion plan (assistant assessment, filed in chat): forensics kernel + claim atlas + run discipline COMPLIANT as scoped (minimal-kernel/method-only/DRAFT-addenda); 3 corrections adopted — (a) tribunal reframed to checklist + independent-reviewers-only (no 3-roles-1-model self-confirmation), (b) memory annex must use SHA-256 + propagated errors (DJB2/empty-catch patterns explicitly excluded — reviewer's "fix before use"), (c) per-insertion motivating-failure gate added (no named failure → dropped); 1 GAP found — reviewer priority (2) version-bound decisions has no counterpart in our plan (run fingerprint covers evidence-versioning only partially) → proposed as 6th micro-item, needs user call. Concrete bug notes honored: spark_rituals already non-inserted; no framework/storage/UI imports anywhere.
 - UNPUSHED (this entry + review files + transcript update ride the next push).
## 2026-11-16 — fresh-eyes battery on borrow-gameplan DONE (user-authorized, same-model caveat honored)
 - Battery: 4 sealed reviewers, disjoint briefs (R1 failure-mapping, R2 scope, R3 reflexivity, R4 sixth-item trial), premise scratch/fresh-import-premise.md (shared prefix), 4 parallel generateText, all on-brief. Same-model caveat in-premise: output graded as checklist, outside review = independent anchor. Full record: src/evidence/synthesis/fresh-import-plan-battery.md (raw replies verbatim + adjudication).
 - Net decision (assistant-owned): ACTIVE = 1 kernel-only (+Zero-UI), 2 runId/fingerprint (quiet dropped), 4 flat-file claims.md first (tool only on failure), 6 version-bound decisions ADOPTED; PARKED = 3; 5 = standing rule, not insertion. New gates: per-item raw-log failure citation; Zero-UI on 1 & 4. Score: ~9 accepts/partials, 2 rejects (R1-KILL-5 category error; R1 2-instance falsifier over-strict), 0 reviewer factual errors. Temp sub-plan updated (scratch/borrow-gameplan-subplan.md).
 - UNPUSHED (this entry + battery file + sub-plan is scratch + transcript update ride the next push).
## 2026-11-16 — outside Q&A on AAR-as-research-backend assessed (user-relayed, no plan change)
 - Question: can Ariadne/Maieutics call AAR; would replacing rabbithole with AAR be bad? Outside answer: yes-conceptually, hybrid (rabbithole discovery → AAR investigation → app integration), don't duplicate stores, don't auto-trust evidence links.
 - Assistant verdict (verified against src/tools/rabbithole/SKILL.md: wave loop, 1-direct+1-tangential default, state files — answer's characterization accurate): AGREE on exploration/investigation split + competing-stores warning; DIVERGE on implementation — "replace/call AAR" is a category error for Maieutics (rabbithole is an assistant workflow doc, AAR a foreign app with no callable interface + flagged store error-suppression; port, not call; second evidence store violates our one-state-home rule). Redundancy audit: AAR's portable value already covered by plan items 2/4/6 + existing wave rules (bounded cycles, approval-before-workstream, evidence-linking with support-caveat). Investigation stays in-house; revisit only on demonstrated handoff failure (fix = 20-line handoff format, not an import). For Ariadne the upstream-service idea is more plausible, same caveats (port, fix store first, no parallel stores). No sub-plan change.
 - UNPUSHED (this entry + transcript update ride the next push).
## 2026-11-16 — AAR-port-vs-integration deep dive filed (user-asked, code-grounded, no plan change)
 - Grounded in: AAR src/store.js (kv folder labStage1 + LS keys + mem fallback; silent-drop lines 133/155 + controller.js:73; project schema = parallel evidence universe), decisions.js (version-bound/supersedes — the portable idea), controller runId/stale-reject, our main.pjs (kv imported) + rabbithole SKILL (wave loop, tangential slot, state files).
 - Findings: no callable interface exists (script globals + own DOM — driving it = vendoring = port); port lands ~10 modules + parallel store beside git evidence tree; silent-persist failure would corrupt the audit trail; outside answer internally inconsistent (recommends backend while warning against second stores — the handoff layer it demands IS the missing integration); redundancy ledger: portable value = 2 metadata rules already in plan (items 2/6 + 4). Revisit triggers: handoff deaths → 20-line format; approval-leak despite item 6 → decision objects, still not the store.
 - UNPUSHED (this entry + transcript update ride the next push).
## 2026-11-16 — neutral assessment: rabbithole-inclusivity vs AAR-depth (user-asked, no plan change)
 - Q: is rabbithole more inclusive; does AAR investigate better/deeper? A: yes-inclusive-by-design (tangential slot forces adjacent angles; AAR tiers explicitly reject weak/irrelevant — selective by design; phase distinction, not ranking). Depth: convergent-structure edge to AAR on paper (round-robin approaches, cited comparisons, version-bound approval, more-research-needed allowed) BUT unverified from supplied artifact (no tests/CI; README claims only) vs rabbithole production-tested in-house (dozens of sessions, filed catches); both bottom out at model-reads-source (quotes/IDs don't prove support; empirical grounding external to both); failure-mode asymmetry (wandering is visible in logs, false rigor is invisible in authoritative-looking outputs). Verdict: discovery → rabbithole; convergence → AAR's structure (once verified); depth is a property of the full loop incl. kill-layer, not the tool. Credit filed: AAR's restraint (no Stage 3), version-bound approvals, honest more-research-needed.
 - UNPUSHED (this entry + transcript update ride the next push).
## 2026-11-16 — borrow-gameplan IMPLEMENTED (user-authorized; pre-step research check: nothing external)
 - Saved first: PUSHED d984a49 (parent bcc1aed7, 897 scope, 892 reused / 5 uploaded ~282KB: battery file, review docx + extract, CHATLOG, transcript — verified ref + commits). Then built.
 - Item 1: src/tools/forensics.js — kernel (register/run/evaluate/signoff, fail-closed incl. thrown-checks-fail, KILL on any kill-fail, OVERRIDE-needs-note, PASS-over-KILL refused) + __forensics_main self-test 11/11 green in worker + static Zero-UI scan clean (first attempt: naive scan flagged comment/typeof mentions; fixed scan strips comments/strings + honors typeof-guard idiom; then caught a REAL test bug — my expectation wrongly assumed worker lacks fetch; rewrote check 6 as API-surface + no-reference guarantee). 2a-v addendum DRAFT filed; frozen-driver wiring waits for countersign.
 - Item 2: 2d-v addendum DRAFT (runId + fingerprint; quiet dropped). Item 4: src/claims.md (flat table ~45 rows, rival-or-incomplete rule, hand-matched to RESULTS_INDEX). Item 6: version-bound-approval addendum DRAFT + grandfather thought-test → gap CONFIRMED. Item 5: standing rule (no file). Item 3: parked. v22 untouched.
 - UNPUSHED (implementation files + this entry + transcript update ride the next push).
## 2026-11-16 — three addenda COUNTERSIGNED + applied to GAMEPLAN v22 (user: "I agree with all three")
 - 2.a.v forensics signoff gate + 2.d.v run identity + Conventions version-bound approval — exact draft texts inserted (each tagged borrow 2026-11-16, countersigned). Addenda files re-headed COUNTERSIGNED + applied. v22 title untouched (amendments tagged inline, frozen-trail preserved). Now authorized, not yet done: frozen-driver forensics wiring (2a-v live). First run under 2.d.v logs runId + fingerprint. Version-binding applies to all future approvals incl. this one (this countersign binds v22+3-addenda state).
 - UNPUSHED (GAMEPLAN + addenda + this entry + transcript update ride the next push).
## 2026-11-16 — PUSHED 60c3e47 + first gated run 2026-11-16-01 (2.d.v runId in:575135edaafe+code:c335d56ac999, version 60c3e47)
 - Push: parent d984a49, verified ref + commits. 902 scope — single 902-entry tree POST timed out (422); rebuilt as 8 incremental overlays (~120 entries each), lesson filed. 894 reused / 8 uploaded (~258KB: GAMEPLAN, forensics.js, claims.md, 3 addenda, CHATLOG, transcript), 0 deleted.
 - Apply (first run under the new rules): 2.a.v gate over frozen Run C ledger (ix-latch.json) — 5 checks (parse/structure, validation-gate recompute==0.7633, filed values intact, per-brain grain present, close-rule recomputed from numbers vs verdict string) → PASS, 0 failed. Signoff ledger src/evidence/synthesis/forensics-run-2026-11-16-01.json (runId + fingerprint + version first, per 2.d.v/item 6). Frozen-driver wiring begins here: read-only gate over filed ledgers first, driver-embedded checks next.
 - UNPUSHED (signoff ledger + this entry + transcript update ride the next push).
## 2026-11-16 — PUSHED ec122da (parent 60c3e47, incremental 8-chunk tree, verified ref + commits)
 - First gated run bundle: 903 scope, 900 reused / 3 uploaded (~220KB: signoff ledger, CHATLOG, transcript), 0 deleted, secret-scan clean. Backlog drained: only this receipt.
## 2026-11-16 — PUSHED 4d5e31a (parent ec122da, incremental 8-chunk tree, verified ref + commits)
 - Countersign + handoff bundle: 903 scope, 901 reused / 2 uploaded (CHATLOG, transcript — temp plans live in scratch by design, unpushed), 0 deleted, secret-scan clean. Backlog drained: only this receipt.
## 2026-11-16 — temp next-gameplan + HANDOFF filed (user-ordered; science frontier, no implementation)
 - Temp plan: scratch/next-gameplan.md (DRAFT, unpushed) — objective = confirm/kill suspicion-killHu boundary on fresh brains under new rules; recommended = countersign killHu prereg v1.0 + fresh-brain compute; alternatives ranked (A embed-gates quiet work, B paper advance REFUSED, C unparking REFUSED); gates + 3-item user decision checklist. HANDOFF for next session = this file + this entry + transcript tail (start there).
## 2026-11-16 — confirmatory run 2026-11-16-02 filed: FAIL-regimes-unfilled (user countersigned prereg v1.2, ran it)
 - Pre-step research check: nothing external (frozen ix-pilot trainBrain + ix-susp-hu recipes in-house). RunId 2026-11-16-02, fingerprint in:24b5d260454d+code:90112f0ddb89, version 4d5e31a+unpushed. 14 fresh brains 5101–5114 (train-until-filled maxed): 0 lost / 10 competent / 4 mid (min acc 0.51) — lost regime never filled, so the boundary was NOT tested. Numbers: rho(acc,suspAUC) 0.5275 <0.6 bar (p≈0.069 perm, 95% CI −0.03–0.84, n=13 non-null); competent median 0.8875; pooled 0.8217 record-only; per-brain Δ all >0.10 (no brain-bias pattern in competent set); loader-agreement 200/200 PASS; forensics gate KILL on per-brain-grained (0 lost), decision KILL — a valid filed verdict, not a bypass.
 - Errata (filed, gate unaffected): driver stats.p first filed 0.0029 (buggy closed-form betai) → corrected 0.0688 (50k permutation, t=2.059 df=11 ≈0.064); driver fixed to permutation p; ledger carries errata + original. Bar uses rho, so verdict stands.
 - Reading (Hypothesis): fresh-seed distribution under this recipe is competent-shifted (seen 5002–5016 had 4/15 lost; fresh 5101–5114 has 0/14) — the lost regime looks like seed-lottery, not reliably producible. Any future boundary test needs a recipe that produces lost brains first, or the boundary stays untestable this way. Paper block stays (nothing enters paper). UNPUSHED (prereg countersign + driver + ledger + signoff + RESULTS_INDEX + claims.md + this entry ride the next push).
## 2026-11-17 — Detour D1 drafted + batteries CLOSED (user: "draft a gameplan detour, then battery it until happy")
 - Pre-step research check: nothing external (tinynn pool/exam builders + run-02 ledger in-house; pool workflows read for runner fit). Detour D1 (UNCOUNTERSIGNED, v22 frozen untouched): harder spelled-keys test instead of degraded brains — D1a fixed-3 pilot local (8-letter alphabet, byte layout ids 10-17/4-7/SEP=18/?=8 frozen, short-vs-long split, eval-only controls random-key/position-shuffle/permuted-key/omit-q, 12-letter zero-shot named follow-up, tutor gate = start-gate, no n=50/100 before 8-12 fill), D1b max-8+TERM gated on D1a survival; fill bar ≥3 acc≥0.6 AND ≥3 acc<0.5 + 200/200 loader + lineHash else HALT; suspicion re-test only if fill passes; all-floor → ABANDON/shorten; paper block until v23 countersign; Actions scale only (Node 22 pinned, explicit confirm), Kaggle out.
 - Batteries: R1 6x → v1.1 (7 patches; systematic D1/run02 conflation logged as reviewer error — D1 has run 0 brains); R2 4x recheck ALL FIXED (PASS/APPROVED/COMPLIANT); R3 2x NO BLOCKER + steelman all-floor (gradient starvation/template-guess, early warning Δacc control-vs-experimental <0.1 at chance in 2-brain smoke). Happy = closed. Next: 2-brain local smoke on user go (no training started).
 - UNPUSHED (GAMEPLAN detour + premises v1/v2 + R1/R2/R3 + this entry ride the next push).
## 2026-11-17 — D1a smoke DONE: tutor generalizes, students lost (user-authorized go; sign-flip retest queued behind fill)
 - Pre-step research check: in-house (tinynn builders + run-02 ledger); pool workflows re-read for runner fit (Actions scale after freeze, Kaggle out).
 - Build: `src/tinynn/spelled-keys.js` (byte layout frozen: alpha 10-17, SEP 18, ?=8, vocab 19; 8^3=512 keys, seeded 384/128 split — spec 64-combo text was wrong math, corrected in code+GAMEPLAN, logged as reviewer miss since R1/R2 reviewed 64 unflagged). Layout self-test PASS; overfit 4/4 (loss→0.000, supervision mapping valid).
 - Tutor: single-shot hard+attn 3000 steps HALTED gate (killA 0.595; shorts 0.825 / longs 0.590; pos0 0.41 worst, flat-low after) → curriculum short-only 1500 (fresh init) then full-pool 3000 (fresh Adam): killA 0.965 PASS. Tutor generalizes: killHu(held) 0.960, short 1.000. Stale single-shot blob+ledger deleted (superseded, documented); driver saves now pass OPTS (blob reload bug fixed + repaired).
 - Students (replica stages, soft targets): s5201 acc 0.375 / s5202 acc 0.445 (both LOST via difficulty, not degradation); shorts 0.775/0.850; suspAUC 0.5503/0.6047 (no inversion at moderate-lost); Δ 0.027/0.059 (5201 near downgrade line — watch); swap≈acc (context-following, not memorization); rkTop 0.61/0.67. Verdict SMOKE-PASS → sweep opened (addendum `d1a-smoke-addendum.md`).
 - Driver migrated for sweep (one-line: SEEDS via globalThis.D1A_SEEDS; ledger fingerprint hu/pool unchanged, code 6b84→f68d, migration recorded in ledger). Seeds 5201-5212 (2 done, 10 queued). Sign-flip retest still queued behind fill bar.
 - UNPUSHED (spelled-keys.js + smoke driver + ledger + addendum + GAMEPLAN curriculum line + this entry ride the next push).
## 2026-11-17 — D1a sweep DONE (12/12): FILL-FAIL-competent-empty, inversion challenged (sign-flip retest still queued)
 - 11 lost / 1 mid (5209: 0.530) / 0 competent (max 0.530). Fill bar fails competent side — mirror of run-02. rho 0.3134 (<0.6, p≈0.307, n=12); lost median AUC 0.5767, min 0.5402 — zero anti-predictions in 11 lost brains. Lost median Δ 0.037 (no downgrade, thin margin). Swap≈acc (context-following). Verdict + stats filed (`d1a-sweep-verdict.md`, ledger verdict/stats, fingerprint untouched).
 - Meaning: atomic inversion (0.32-0.43 on systematically-wrong) does NOT replicate on spelled weak-lost brains. Lost-via-weakness ≠ lost-via-wrong-axis; taxonomy needs refining. Transmission holds for shorts (students 0.775-0.85), collapses on longs-novel (tutor holds 0.96 — same wall as ix W1).
 - Next (user go only): student-curriculum variant (short→full for students, spec patch + countersign) for competent-fill; sign-flip hard-path design (spelled weak-lost does NOT substitute for mirror-lost). Paper block stays.
 - UNPUSHED (verdict doc + ledger verdict/stats + this entry ride the next push).
## 2026-11-17 — Frozen-first FILED + D2 drafted + discoverability audit (user: run both tutors × frozen/unfrozen; make it findable)
 - Frozen-first convention filed in GAMEPLAN Conventions (user-ordered 2026-11-17): frozen phase before unfrozen; continuation design; per-axis deltas; measurement-exempt. Was nowhere in src/ (scratch only) — fixed.
 - Breach admitted: D1 detour added with NO pre-snapshot (snapshot rule allows no exceptions). Repair: snapshot src/gameplan-snapshots/2026-11-17-d1-included-pre-d2.md (26218B) before D2; D1 pre-state git-only after push.
 - Detour D2 drafted (UNCOUNTERSIGNED): Rorschach matrix D2-E educated (spelled blob) vs D2-N never-educated (random-init) × frozen-first; user rule = no right/wrong anywhere, judged never fed back; gates entropy≥1.0 else VOID + permuted control; bar input-driven agreement ≥0.20. Premise fresh-rorschach-premise-v1.md frozen v1, battery-ready (not run — needs go).
 - Audit: memory/fresh-eyes/rabbithole SKILL.md all present under src/tools/ (map chain root README → src/README.md → tools). "Testing Protocol" doc DOES NOT EXIST (zero hits) — gap: eval-harness is agent-EDD (different thing); bench rules live scattered (Conventions + 2.a.v/2.d.v). Proposed index doc needs user go. tools/README.md existence unverified.
 - Push now URGENT (~20 src files, 2 sessions, at Step-4 stop-write line).

## 2026-11-17 — PUSH payload (tutor/student gameplan track + D1a/susp-hu backlog)

- 20 NEW: D1a harness+results (d1a-smoke.js, spelled-keys.js, sweep verdict, smoke ledger), susp-hu-confirm tool+ledger+R1-R3 batteries, spelled-premise batteries, Rorschach premise v1, run-02 forensics, pre-D2 snapshot.
- 6 CHANGED: GAMEPLAN.md (D1/D2 drafts + frozen-first), CHATLOG.md, claims.md, RESULTS_INDEX.md, phase-1d prereg, memory-layer5 transcript.
- 11 STAGED: gameplan draft v6 + 2 frozen premises + R1-R8 battery results (formative/summative split, terminology retired, P4 separation, controls #5 + distillation + tripwires; loop closed by barren red R7, split re-verified R8).
- Commit message carries the receipt; verify = cache-busted ref re-read must match new commit.
## 2026-11-17 — v23 STAGED (proposed, binds nothing — countersign owed)
 - Pre-edit snapshot src/gameplan-snapshots/2026-11-17-pre-v23.md (28957B) BEFORE the stage (snapshot rule). Draft v6 moved into GAMEPLAN.md as "Version v23 (PROPOSED)": review text = 8 rounds / 26 reviewers / barren-red-closed twice; on countersign (a) D2 draft marked SUPERSEDED, (b) frozen-first Convention replaced by parallel-arms (report frozen first, no sequencing), (c) paper Phases 1-3 PARKED (v22 stays record).
 - Skill amendment FILED (user-ordered, owed post-push): fresh-eyes SKILL.md stop rule — red-team closes loops, steelman reserved for planned cuts, unanimous-steelman stop retired.
 - Unpushed src delta now: GAMEPLAN v23 stage + snapshot + skill amendment + scorecard R2 correction + this entry (ride the countersign push).
 - Next: user countersigns → push → P1 8-gate exit → P2 compute.
## 2026-11-17 — v23 patches: P4 = the interface (user-directed, three additions filed)
 - (i) P4 reframed round the INTERFACE spec (score inputs in, teaching knobs out, who moves items) — the phase's main thrust; P4/P5 boundary = interface-built-and-proven vs measurement program. (ii) Masked-value refiled as P2/P3 tutor-sharpening ("glasses, not hearing"); P4 option (b) marked design-owed, no candidate. (iii) DIRECTION check in P4 exit bar (final shared pattern vs tutor pre-loop original vs student early outputs; tutor-caved = FAIL). P3 pointer fixed (P5, built in P4); P5 intro carries direction-checked status. Old-P4→P6 refs consistent.
## 2026-11-17 — Re-verify R9–R28 CLOSED BY BARREN RED (user-ordered; 20 rounds, 60 reviewers, 60/60)
 - R9 opened 3×BREAK-class on the restructured P3–P6 (unmitigated circularity, placeholder interface, unquantified direction, unbounded drift, recipe leak, label origin). R10–R27 all PARTIAL, every round patched same-session (see GAMEPLAN Versioning v7 entry for the full patch roll). R28 3/3 HOLD, no kills, no re-reports standing → LOOP RE-CLOSED. Reviewer-miss log kept per round (answered-design re-reports, misreads earning rewordings, duplicates dismissed with reason). v7 (restructure + full patch roll) is the countersignable text.
 - Unpushed src delta now: GAMEPLAN v23 stage (v7 text) + pre-v23 snapshot + skill amendment + scorecard R2 correction + R9–R28 raws in scratch (private, not pushed) + log entries. Next: user countersigns → push → P1 8-gate exit → P2 compute.
## 2026-11-17 — PUSHED b814175 (v23 countersigned; vault github PAT, parent f4d5551)
 - 5 uploaded (GAMEPLAN 80KB countersigned v23 + amendments executed, CHATLOG 201KB, fresh-eyes SKILL loop-closure convention, planted-error scorecard R2 correction, pre-v23 snapshot 29KB), 933 reused, 0 deleted (out-of-scope .github/Dockerfile/k8s/etc. persist via base_tree), secret-scan clean. Ref PATCH 200 + cache-busted re-read match. Push hole closed. Receipt (this entry) rides the next push.
 - NEXT: P1 8-gate exit → P2 compute.
## 2026-11-17 — PUSHED 8bb5537 (P1 exit bundle; vault github PAT, parent b814175)
 - 3 uploaded (tutor.json new 620692B, GAMEPLAN gate-8 + amendments, CHATLOG P1 verdict + b814175 receipt), 936 reused, 0 deleted, secret-scan clean. Ref PATCH 200 + cache-busted re-read match. Push hole closed (only this receipt unpushed).
 - Process note (filed, not hidden): exit-push attempts 1–2 failed on my side — wrong-digest-compare (SHA-256 vs git SHA-1: attempt 1 flagged all 939 files changed, timed out on a 68MB payload) + a dropped paren. Fix: SHA-1 compare + >5MB compare-guard tripwire (aborts before upload). The guard fired correctly on attempt 2's residue; attempt 3's delta (3 files, 904KB) matches the expected session delta exactly.
## 2026-11-17 — P1 EXIT: all 8 gates green (measured, in-page, deterministic seeds)
 - G1 cold load: 23/23 src/tools SKILL.md valid frontmatter, 0 errors (frontmatter regex must tolerate leading HTML comments — first attempt false-flagged all 79 incl. scratch copies; gate counts src/tools only).
 - G2 rerun: self-check 4/4 PASS (4.8e-10, 4.6e-10, 2.8e-7, 5.9e-7 vs 1e-5 bar — matches filed values).
 - G3 backlog: zero unpushed src/ except this session's own tail (tutor.json + gate-8 text + receipts ride the exit push).
 - G4 battery loop: demonstrated end-to-end (R9–R28: 20 rounds, 60 reviewers, fleet pattern, all returned).
 - G5 readouts: 100 sample lines (50 short pool-seed-7001 + 50 long killA-seed-7101) through frozen tutor — top-1/margin/entropy/energy/cited-slot all populated, 0 nulls (attLen 16 both forms).
 - G6 parallel arms: frozen report FIRST, unfrozen (fresh student, 200 soft-only distill steps on tutor cache, loss 1.1983) second — schemas identical (top1,margin,entropy,energy,cited_slot), unfrozen 0 nulls.
 - G7 noise gate: 1000 fresh lines (pool-seed-9000) → label counts 225/257/253/265, entropy 1.9973 bits ≥ 1.0 PASS.
 - G8 blob integrity: src/evidence/d1a/tutor.json (620692B, killA 0.965) SHA-256 recomputed on load = filed ce8b97cf…ad1b3 MATCH; promoted from scratch for durability.
 - Exit declared. NEXT: exit push → P2 compute (tutor noise reads E vs N).
## 2026-11-17 — P2-run-1 step-1 PREREG (tutor noise reads E vs N; filed pre-compute, binds this run)
 - Noise spec FROZEN here (G7's pool-9000 builder was never filed — gap noted, G7 gate PASS stands, P2 does not inherit its lines): 1000 lines, seed 9100, uniform iid tokens 0..18 (vocab19), 500 short (length uniform in {10,15,20}) + 500 long (length 50). Guard before reads: length histogram exact 500/500-split, SEP-id rate approx 1/19 (proves unstructured).
 - Subjects: E = src/evidence/d1a/tutor.json (SHA-256 recompute vs filed ce8b97cf...ad1b3, mismatch = HALT); N1 = fresh AttnModel seed 9101; N2 twin seed 9102 (architectural-prior floor); DEAD = E with zeroed Lout (gate-specificity probe). No training, no gradients anywhere.
 - Readouts per line per subject: top-1, margin, entropy, energy (-logsumexp), cited-slot (argmax final-depth att.w; assert isDepth and att.n===L every line, else HALT). Label = argmax.
 - Gates/bars at THIS step: E label entropy >= 1.0 bit else whole step VOID (no fallback). No agreement bar (0.20 input-driven applies step 5 with students). Report: per-tutor label counts + entropy; agreements E-N1, E-N2, N1-N2 (observed + 20-perm permuted baseline + delta); mean top-1 per tutor (DEGENERATE below 0.50 flag); DEAD response.
 - Expectation (numeric, scored at verdict): E entropy 1.9-2.0; N1/N2 entropy ~2.0 (random projections near uniform — entropy gate does NOT separate E from N, only constant-output tutors); all pairwise agreements 0.25 +/- 0.05; DEAD entropy exactly 2.0 with top-1 0.25 (specificity datum: entropy-alone passes a uniform-degenerate tutor — the per-item top-1 rule is the real degenerate-catcher; no gate change without amendment).
 - Pre-mortem: strongest objection = uniform noise is off-distribution for E (trained on structured spelled lines), so E outputs may be off-manifold artifact, not pattern; mitigated by N-floor (both off-distribution) + step-5 fresh/recombined controls. Most likely failure = in-page API slip (steps indexing, cited-slot); guarded by asserts above.
 - Nearest-failure: G5's wrong-file-set false-flag → same-class error here is feeding structured spelled lines instead of uniform noise (silently re-tests train distribution); the SEP-rate + length guards exist for exactly this.
 - Ledger: src/evidence/p2/run1-noise-reads.json (spec + seeds + code fingerprints + aggregates; rows re-derivable deterministically, forward is pure). Falsifier MDE (residual 3) owed at step 5; this step files the variance inputs (label marginals).
## 2026-11-17 — P2-run-1 step-2 PREREG (distill; filed pre-compute, binds this run)
 - Arms: S-E distills E soft targets on the 1000 step-1 noise lines (seed 9100); S-SHUF distills the SAME cache with rows permuted across lines (RNG 9300) — must sit at chance, else agreement is architectural bias not learned content. Both fresh AttnModel inits (seeds 9301/9302), soft-only stages [{steps:3000, attnKeep:0, softW:1.0, hardW:0}], tutorCache (r=1..4), batch 16, lr default. hardW=0 (no right answers exist); attnKeep=0 (generic attnSupervision would find spurious Q-marker matches in noise).
 - Report: firstLoss/lastLoss per arm; train-line agreement with E labels (S-E expect >=0.90 — distillation of 4 soft targets into h=48 should memorize; S-SHUF expect 0.25 +/- 0.08).
 - Expectation: S-E lastLoss << firstLoss, train-agree >=0.9; S-SHUF train-agree ~0.25.
 - Pre-mortem: strongest objection = 3000 steps on 1000 lines memorizes E's partition trivially, proving only that distillation optimizes — the TRANSMISSION claim waits for step 5 (fresh/recombined lines); most likely failure = cache-index/r-mode mismatch (rMode random 1..4 vs cache rows) — guarded by using stock cacheTutor + stock trainFaded (same pair as D1a students).
 - Nearest-failure: G5-style wrong-input-class error = accidentally passing structured spelled lines as train (would smuggle curriculum); guard = reuse the exact step-1 line array (rebuild seed 9100, verify length histogram + SEP rate before training).
## 2026-11-17 — P2-run-1 step-2 VERDICT + step-2b PREREG (distill asymptote probe)
 - Step-2 MEASURED (worker, deterministic): S-E 1.4763 -> 1.2524, train-agree-E 0.537 (expectation >=0.90 MISSED); S-SHUF 1.697 -> 1.3265, train-agree 0.277 (expectation ~0.25 HIT — control behaves: loss falls on marginals while E-agreement stays at chance).
 - Interpretation: above-chance carrier (0.537, loss < uniform 1.386) but far from memorization. Cause unknown: optimization (48 presentations/line too few for structureless mappings) vs capacity (h48/m96 too small for 1000 arbitrary soft mappings) vs structural (rMode/cache bug). D1a's fast learning does not transfer: spelled lines share key-substructure (generalization), noise has none (pure memorization). My >=0.90 expectation wrongly assumed equal difficulty — scored as MISS, author track record noted.
 - Step-2b probe (filed pre-compute): (a) MEM100: fresh init seed 9401, 3000 steps, SAME spec, train = FIRST 100 noise lines only — expect train-agree >=0.95 if capacity/optimization healthy at small scale; (b) LONG12k: seed 9301 config continued at 12000 steps is impossible without resume (trainFaded has none), so fresh init seed 9303, 12000 steps on full 1000, save full hist — expect monotonic loss fall and agree >>0.537 if optimization-limited. Verdict rule: MEM100 high + LONG12k climbing = optimization-limited (extend steps for the step-5 carrier); MEM100 stalled = structural hunt (rMode/cache audit before any more spend); LONG12k flat while MEM100 high = capacity wall (wider net mini-prereg, no silent arch change).
 - Pre-mortem: strongest objection = 12k steps on noise memorizes E's arbitrary partition including its off-manifold artifacts, so the step-5 "pattern" is artifact-memorization; answered by design (N-floor + recombination/falsifier at step 5 discriminate pattern from memorization — a memorized artifact does not survive recombination). Most likely failure = worker time overrun; cap 25 min, MEM100 first (cheap, finishes early, reported even if LONG12k aborts).
 - Nearest-failure: step-1 argmax slip (analysis-code bug, not model bug) — guard: reuse the audited argmax + assert train-agree recomputed from saved cache labels, not fresh forwards.
## 2026-11-17 — P2-run-1 step-2b VERDICT (asymptote probe: optimization-scale, not structural)
 - MEM100 MEASURED: 1.3041 -> 0.4136, train-agree 0.97 in 3000 steps/129s — capacity healthy, small-scale memorization works. LONG12k MEASURED: 1.7259 -> 1.4894, agree 0.451, loss tail RISING (0.66/0.81/1.36/1.49) — 4x steps did NOT climb; seed 9303 also started higher (1.73 vs 9301's 1.48).
 - Verdict: the 3000-step carrier S-E (agree 0.537) stands, weakness ledgered; NO seed shopping (best-of-seeds on train agreement = agreement-conditioned selection, FORBIDDEN P2/P3 — the rule fires here and we pass by not shopping); NO silent arch/LR change (needs mini-prereg). The step-5 bar + falsifier arbitrate the weak carrier by design (detection, not prevention). Cause hypothesis for the record: structureless mappings need ~presentations-per-line the staged D1a regime never required (generalization vs memorization); LR 5e-3 thrashes late (rising tail).
## 2026-11-17 — P2-run-1 steps 3/4/5 PREREG (solves + recombination + compare; v23 P2 fully specifies, this files expectations/guards)
 - Step 3 (done in step-1 machinery, reframed): E/N1/N2 reads on the 1000 train lines = tutor live solves with all five readouts. New: E reads on all step-4/5 forms (tutor labels define pseudo-classes everywhere).
 - Step 4 recombination (input-only, no training): donors = step-1 lines grouped by E-pseudo-class x EXACT length (10/15/20/50 — stricter than spec's bands, filed as implementation choice; halves well-defined, higher yield). Ops HALF/THIRD-SPLICE + TOKEN-SHUFFLE (same-length pools; empty-position child discarded). Target 200 short-band + 200 long; novelty filter vs all 1000 train lines + built children (identical child discarded, logged). Expect: >=80% yield, pseudo-class balance within 2x.
 - Step 5 subjects: E (labels), S-E carrier (9301), S-SHUF (9302, expect E-agree ~chance on every new form). Forms: FRESH-500 (seed 9500, same uniform spec), RECOMB-400, FREQ-200 (control 5: same unigram freqs as tutor noise — NOTE: tutor noise is uniform, so FREQ collapses onto FRESH distribution; filed as design observation, weight carried by permuted + falsifier; control 5 bites first in P3 on non-uniform teacher lines).
 - Bars: input-driven agree (obs - 20-perm baseline) S-E-vs-E >= 0.20 on FRESH and on RECOMB (report 0.10/0.20/0.30 sensitivity triple regardless); falsifier chi-sq (S-E label distribution RECOMB vs FRESH, alpha 0.05, df=3) significant = transmission dead regardless of agreement; S-SHUF deltas ~0 (distillation-content control); diagnosis tree on miss (DEGENERATE top-1<0.50 or run entropy<1.0 VOID; TRANSMISSION-LOSS top-1>=0.70 + clustered errors; CAPACITY else).
 - Expectation: S-E-vs-E deltas 0.05-0.15 (weak carrier, partial memorization travels poorly); falsifier INCONCLUSIVE-or-dead (distributions likely differ via memorized-train pull); S-SHUF deltas ~0. Pre-mortem: strongest objection = fresh-line agreement for a memorizing student measures nothing about pattern (it's all train-pull or nothing) — answered: that IS what the bar + falsifier jointly test; a memorize-only student fails the margin, correctly. Most likely failure = recombination implementation bug (donor-pool leak across classes); guard = class-purity assert on every child (all donors share the child's pseudo-class) + novelty check logged.
 - Nearest-failure: step-1 argmax slip — guard: reuse audited argmax; cross-check E fresh-line entropy vs step-1 E entropy (same tutor, same spec, expect ~1.9-2.0).
 - MDE note (residual 3, filed): chi-sq 2x4, n~900 pooled, alpha 0.05 — min detectable Cramer's V ~0.12-0.15 (medium-small); agreement deltas n=400-500, Wilson half-width ~0.04-0.05 — the 0.20 bar is ~4-5 SE above noise, well-powered; verdicts near the line report the triple-threshold.
## 2026-11-17 — P2-run-1 VERDICT (steps 1-5 complete; expectations scored)
 - Step-1 SCORED: E entropy 1.9715 PASS (exp 1.9-2.0 HIT); N1/N2 entropy 1.5351/1.8503 (exp ~2.0 MISS — random-init prior is structured, N1 parks 498/1000 on class 0); pair agreements 0.232/0.234/0.326, deltas 0.0077/-0.0002/-0.0001 (exp chance HIT — N1-N2 0.326 is marginal-overlap, permuted 0.3261 catches it exactly: the control earns its keep); DEAD H=0 via argmax-tie collapse (mechanism MISS, specificity HIT); cited: E spread over all 50 slots (peaks slot49=82, slot9=64, slot14=61; badN=0), N1/N2 position-0 bias 228/283 (prior datum); E fresh-entropy cross-check 1.9684 vs 1.9715 (guard HIT).
 - Step-2 SCORED: S-E train 0.537 (exp >=0.90 MISS); S-SHUF 0.277 (HIT).
 - Step-2b SCORED: MEM100 0.97 (HIT); LONG12k 0.451 + rising loss tail (exp climb MISS). Carrier S-E (9301) stands; no seed shopping (agreement-selection forbidden); no silent arch change.
 - Step-4: recomb 395/400 built (discarded 5 novelty-dupes), ops ~balanced by construction (i%3), class balance by construction (i%4), length pools exact (10/15/20/50).
 - Step-5 SCORED: FRESH S-E-vs-E delta 0.2542 (obs 0.512, perm 0.2578) — PASS at 0.10 and 0.20, fail at 0.30 (two-threshold survival = genuine, thin margin +0.05); RECOMB delta 0.290 (obs 0.5544) PASS; falsifier chi2 4.078 < 7.815 NOT significant = transmission not dead; S-SHUF deltas -0.0007/-0.0006/-0.022 (HIT); FREQ delta 0.166 — control-5 DEGENERATE on uniform noise (freq-matched = fresh-distributed; filed observation, not a fail; bites first in P3); errors unclustered over E-classes [99,114,97,110]; longs err 0.553 vs shorts 0.384 (length-dependent partial transmission).
 - Expectation (exp 0.05-0.15) MISSED upward: the 0.537-train carrier generalizes at its train rate (fresh 0.512) — it learned a partial general rule, not train-pull. Calibration note: this run 4 HIT / 5 MISS — I underestimated structured-prior effects and overestimated distillation ease, underestimated weak-carrier generalization.
 - P2-RUN-1 VERDICT: PASS (scoped): educated-tutor to student transmission of generalizing content on experimenter-built uniform-noise forms, input-driven delta ~0.25-0.29, single tutor (spelled blob), single student seed pair, weak carrier (train 0.537). Falsifier + SHUF + permuted controls all clean. Files: src/evidence/p2/run1-steps12.json (steps 1-2b), src/evidence/p2/run1-steps45.json (steps 4-5, full line arrays + labels).
 - NEXT: P3-run-1 prereg + build (candidate (a) tutor-as-scorer input search does not exist yet — new code, P3 spec in v23). Push BLOCKED on user PAT (unpushed: 8bb5537 receipt, P2 preregs/verdicts, 2 ledgers, README header fix).
## 2026-11-17 — PUSHED bd721d2 (P2-run-1 verdict bundle; vault github PAT, parent 8bb5537)
 - 4 uploaded (src/evidence/p2/run1-steps45.json, src/evidence/p2/run1-steps12.json, src/README.md, src/CHATLOG.md, 387438B), reused 937, 0 deleted, secret-scan clean. Ref PATCH 200 + re-read MATCH (first check hit a stale read; re-read confirms). Push hole closed.
## 2026-11-17 — P2-run-2 PREREG (robustness: student-seed replication + bigger fresh form; filed pre-compute)
 - Motive (user-ordered): run-1 margin thin (+0.05 over 0.20) on n=1 student seed. Harden the student side; tutor side hardens in P3 (crossed E/N contrast + teacher lines).
 - Arms (NO spec change — same 1000 train lines seed 9100, same E cache, same stages [{3000, attnKeep 0, softW 1, hardW 0}]): S-E2 seed 9304, S-E3 seed 9305 (replication); S-SHUF2 seed 9306 (control symmetry, permuted cache RNG 9300 same mapping). All reported, no selection (mean rule below is preregistered, not cherry-picked).
 - Forms: run-1 forms reused (fresh-500 seed 9500, recomb-395, freq-200) + NEW fresh-1000 seed 9502 (500 short/500 long, same builder). E labels fresh-1000 (new reads); run-1 E labels reused.
 - Bars: per-seed S-E-vs-E input-driven deltas on fresh-500, fresh-1000, recomb (20-perm baselines, fresh seeds 9600+); CLAIM HOLDS iff MEAN delta across 3 seeds >= 0.20 AND MIN >= 0 per form family (fresh pooled, recomb); falsifier chi-sq per seed (recomb vs fresh-1000); SHUF2 deltas ~0; freq form descriptive only (degenerate control, run-1 filing stands).
 - Expectation: per-seed deltas 0.10-0.30 (carrier variance: 9301 gave 0.25/0.29 off 0.537-train; seed luck cuts both ways); mean fresh >= 0.20 HOLDS, min >= 0 HOLDS; falsifier ns all seeds; fresh-1000 Wilson half-width ~0.03 tightens the headline.
 - Pre-mortem: strongest objection = 3 seeds from one tutor/line-set is still one experiment (shared train lines correlate seeds) — answered: shared-lines correlation is CONSERVATIVE here (common train-pull inflates all seeds together, so seed-spread measures optimizer luck only; the fresh-1000 form is the independent leg). Most likely failure = worker time overrun (3 trains + ~7k forwards); Big-Job rule: trains first, ledger incrementally (save models? no — deterministic retrain; save per-arm results to ledger as they land).
 - Nearest-failure: run-1 argmax slip — guard: audited argmax only; recompute 9301-train-agree as pipeline checksum (expect 0.537 exactly, else HALT — determinism check on the whole stack).
 - Ledger: append run2 to src/evidence/p2/ (separate file run2-seedrep.json; run-1 files untouched).
## 2026-11-17 — P2-run-2 VERDICT (PASS — claim replicates across 3 student seeds)
 - Checksum: retrained 9301 spec hits train-agree 0.537 EXACTLY — whole stack (lines/cache/training/eval) bit-deterministic. New seeds: SE2 train 0.581, SE3 0.816 (optimizer luck span 0.54-0.82), SHUF2 train 0.338 (above-chance train wobble = marginal-learning on shuffled labels; control judged on FRESH forms, where it is clean).
 - Fresh-1000 (n=1000, new seed 9502): SE2 delta 0.2205, SE3 0.2158. Fresh-500 retest: 0.2222/0.2306 (run-1: 0.2542). Recomb: 0.2642/0.2471 (run-1: 0.290). 3-seed means: fresh-500 0.236, fresh-1000 0.218, recomb 0.267 — ALL >= 0.20, ALL mins >= 0. Falsifier ns both seeds (3.96/0.84). SHUF2 fresh deltas 0.003/0.004 (recomb 0.055, ~1.8 SE wiggle, noted not worried).
 - Expectation (per-seed 0.10-0.30, mean>=0.20, min>=0): all HIT. Finding: train-fit does NOT predict fresh delta (SE3 0.816-train -> 0.216-fresh ~= SE2 0.581-train -> 0.221-fresh) — train variance is memorization depth; the generalizing rule-component is stable ~0.22.
 - P2 OVERALL (run-1 + run-2): educated-tutor to student transmission on experimenter-built noise, input-driven delta ~0.22-0.27, 3/3 student seeds, 2 fresh forms + recombined, falsifier 3/3 ns, SHUF 2/2 clean. Margin thin but replicated (fresh-1000 mean +0.018 over bar — real, small). Tutor side replicates in P3 (crossed E/N contrast). No more P2 spend without new cause.
 - NEXT: push run-2 ledger + this verdict, then P3-run-1 prereg + candidate-(a) build.
## 2026-11-17 - PUSHED 61e6afe (P2-run-2 bundle; vault github PAT, parent bd721d2) - 2 up (src/evidence/p2/run2-seedrep.json, src/CHATLOG.md), re-read MATCH.
## 2026-11-17 — P2 DIAGNOSTIC (exploratory slices on retrained 9301; feeds run-3, changes no filed verdict)
 - Per-band (fresh-1000): shorts delta 0.323 (n=500), longs 0.163 (n=500). Recomb: shorts 0.425 (n=195), longs 0.178 (n=200). Length gradient L10 0.63 > L15 0.56 > L20 0.54 > L50 0.44 (obs agree). The D1a shorts-transmit/longs-wall split REPLICATES in noise (cross-detour convergence: the wall is length/capacity, not content).
 - Confidence sweep (fresh-1000): top1>=0.9 delta 0.279 vs 0.241 all-lines (+0.04). Tutor-mumble is MINOR — deprioritized as primary lever (my pre-probe bet was wrong; the probe earned its keep).
 - Partition screen: best simple feature (first+last token pair) predicts E labels 0.566 vs 0.25 chance — E's noise partition is genuinely complex/whole-line, not a trivial cue. Student shorts-obs 0.58 sits near that predictability neighborhood.
 - Discipline: run-1/run-2 PASS verdicts stand on full-form bars (no post-hoc re-barring). Per-band bars below are a NEW claim in a NEW prereg (run-3), not a rewrite.
## 2026-11-17 — P2-run-3 PREREG (shorts-only carrier; filed pre-compute)
 - Arms (ONE variable vs run-2: train set): SE-S fresh init seed 9307, trains on the 500 SHORT train lines only (indices 0-499 by builder construction; matching cache rows); SHUF-S seed 9308, same 500 lines, permuted-within-shorts cache (RNG 9309). Same stages [{3000, attnKeep 0, softW 1, hardW 0}]. Same presentations math: 500 lines -> ~96 presentations/line (vs 48) — cleaner gradient, no long-maps competing for capacity.
 - Forms: FRESH-SHORTS-500 (new seed 9800, 250x{10,15,20} + wait no — shorts only: 500 lines lengths uniform {10,15,20}); RECOMB-SHORTS = run-1's 195 recomb shorts (E labels recomputed); longs reported DESCRIPTIVELY only (fresh-1000 longs + recomb longs re-solved, no bar — wall hypothesis).
 - Bars (new, preregistered): shorts-fresh delta >= 0.30 AND shorts-recomb delta >= 0.30 (20-perm baselines, seeds 9900+); falsifier chi-sq ns on shorts forms; SHUF-S deltas ~0 (|delta| <= 0.08). Claim: shorts-scoped transmission at a higher bar.
 - Expectation: shorts-train agree >= 0.80 (MEM100 hit 0.97 on 100 lines; 500 shorts similar scale); shorts-fresh delta 0.30-0.40; longs descriptive ~0.15 (wall holds).
 - Pre-mortem: strongest objection = training on shorts-only teaches a length-specific rule, so shorts-fresh agreement is narrow, not stronger transmission in general — ANSWERED by design: the claim is explicitly shorts-scoped (D1a prescription), and recomb-shorts (novel recombinations, same band) is the generality leg inside the scope. Most likely failure = shorts-train memorizes (0.9+) yet fresh stalls at ~0.25 (memorization without rule-extraction — would show the partition is unlearnable even in-band).
 - Nearest-failure: subset-index slip (wrong 500) — guard: assert all train-subset lengths <= 20 and all longs excluded; assert E-label recompute matches run-1 counts on overlapping lines.
 - Ledger: run3-shorts.json. Cost: 2 trains + ~3k forwards.
 - CORRECTION (append-only, not an edit): run-3 FRESH-SHORTS-500 = new seed 9800, 500 lines with lengths uniform in {10,15,20} (the filed line carries a self-correction artifact; this reading binds).
## 2026-11-17 — P2-run-3 VERDICT (SPLIT: recomb-shorts PASS at 0.30, fresh-shorts 0.274 MISS)
 - Measured: SE-S train 0.892 (exp >=0.80 HIT); fresh-shorts delta 0.2737 (exp 0.30-0.40 MISS); recomb-shorts 0.3892 (PASS, strongest number in the program); falsifier ns (2.48); SHUF-S fresh 0.006, recomb 0.043; longs descriptive 0.158 (wall holds).
 - Finding (proximity-bound transmission): train fit 0.54 -> 0.89 across runs moves fresh-uniform only 0.25 -> 0.27, while recomb (train-proximal) tracks fit 0.29 -> 0.39. The student learns a near-train-lines rule, not the tutor's full partition; fresh-uniform generalization saturates ~0.25 regardless of memorization depth. The ceiling is in the TUTOR's scattered noise-partition (partition screen: best simple predictor 0.57), not in student training.
 - SHUF-recomb wiggle filed (run-1 0.0, run-2 0.055, run-3 0.043): small, recomb-only, consistent with class-balanced construction + marginal-learning; an order of magnitude below SE effects (0.25-0.39). Bounded, not worried.
 - P2 CLOSED (no more spend without new cause): run-1/run-2 PASS at 0.20 (replicated 3/3 seeds); run-3 SPLIT at the 0.30 shorts bar (recomb PASS, fresh 0.274 MISS-but-above-0.20). Structural fix for signal strength is P3's teacher-generated patterns (non-uniform, coherent by construction), not more P2 tuning — tuning uniform-noise further would be theater.
 - NEXT: push run-3 ledger + verdicts, then P3-run-1 prereg + candidate-(a) build.
## 2026-11-17 - PUSHED 3e62182 (P2-run-3 bundle; vault github PAT, parent f08a1ff) - 2 up, re-read MATCH.
## 2026-11-17 — P2-run-4 + run-5 PREREG (user-ordered, two experiments before P2 closes; filed pre-compute)
CONTEXT: P2 signal saturates (fresh-uniform ~0.25 regardless of train fit; recomb tracks train-proximity). Open Q: is the tutor's noise partition shared across brains (student-side failure, headroom exists) or idiosyncratic per brain (ceiling explained, P3 is the fix)?
## Run-4: twin tutors, NO students (inter-tutor agreement on fresh noise)
 - Build: TWO fresh spelled-tutor copies, EXACT D1a smoke recipe (short-only 1500 steps hard+spelled-attn from fresh init, then full-pool 3000; attnSupervision patched to spelled variant during training; partition PART_SEED 7000, pool POOL_SEED 7001). Inits seeds 8101/8102; train seeds 8101*100+30+3 / +31 pattern (filed exact in ledger). Gate per copy: killA-spelled (KA_SEED 7101, train keys) >= 0.95 else retrain same slot with next seed (max 2 attempts per slot, then VOID that slot — a slot that cannot learn the curriculum is not a tutor).
 - Reads: E (spelled blob) + copies read FRESH-1000 uniform noise (new seed 9600, 500/500, same builder). Pairwise deltas T2/T3/E (obs + 20-perm, seeds 9610+), each copy's label entropy (expect >=1.0; below = degenerate copy, VOID its pairs).
 - Interpretation rule (preregistered, measurement not a bar): mean inter-tutor delta >= 0.20 -> SHARED partition (student ceiling is student-side; headroom exists) ; < 0.20 -> IDIOSYNCRATIC (each brain misfires privately; P2 uniform-noise ceiling explained; no further P2 tuning without new cause).
 - Expectation: delta 0.15-0.35 (shared lookup machinery + same pool -> similar misfiring, but init noise -> private quirks). Genuinely uncertain — the experiment prices the P2 ceiling either way.
 - Pre-mortem: strongest objection = copies share pool+recipe with E, so high agreement could come from shared TRAINING-DATA memorization leaking into noise reads (same keys appear in noise? NO — noise tokens are uniform 0-18, spelled keys are structured ids 10-17+SEP; overlap is coincidental) — mitigated by the permuted baseline + the fact that train-key ids in noise are meaningless without pair structure. Most likely failure = copy fails killA gate (recipe seed-luck); guarded by the retrain rule.
 - Nearest-failure: run-1 argmax slip / subset-index slip — guards: audited argmax; killA built by S.killASpelled (not hand-rolled); E fresh-9600 entropy cross-checked vs 1.97 band.
## Run-5: planted patterns + structure morph (does the tutor SEE anything?)
 - 5a planted rules (500 uniform lines, seed 9700; E reads; agreement E-vs-planted + permuted; N1 control re-read for the sum-rule only): R1 first-token mod 4; R2 token-sum mod 4; R3 last-token mod 4; R4 count-of-18 mod 4. Verdict rule: any rule delta >= 0.15 -> tutor tracks that pattern class (revise lookup-only story); all < 0.15 -> lookup-only stands (tutor sees no planted pattern).
 - 5b structure morph (bridges D1a 0.965 to P2 scatter): long-form lines with k valid spelled pairs (k=0..9) + (9-k) noise filler pairs + query on a planted pair (undefined at k=0); train keys AND held keys (2x10x100 lines, seeds 9710+k / 9730+k). Measure: accuracy vs TRUE answer (k>=1), output entropy + top-1 (all k). Sanity: k=9 train-key acc >= 0.90 else tutor-broken HALT (reproduces killA). Shape exploratory: report the curve + knee; expect monotonic rise, knee location unknown.
 - Expectation: 5a all rules ~chance (lookup circuit blind to novel rules); 5b train-keys 0.95 at k=9 falling to ~0.3 by k<=2, held-keys lower throughout (generalization gap); entropy rising as k falls.
 - Pre-mortem: strongest objection = 5a rules are TOO alien (tutor trained on key-lookup; failing sum-mod-4 proves nothing beyond 'not a general pattern engine') — answered: that IS the claim under test (lookup-only vs general detector); a null across all four rules with a powered n=500 (half-width ~0.045) is a real constraint, not an absence-of-evidence shrug. Most likely failure = morph filler pairs accidentally form valid competing matches (query ambiguity) — guard: filler keys drawn uniform 0-18 (not key-ids), query key = planted pair key, assert query-key appears exactly once outside the query among PAIR slots... (filed builder assert: count of query-key-id triples in pair positions == 1).
 - Ledgers: run4-twins.json, run5-planted.json. Order: run-5 first (eval-only, fast), run-4 second (training).
## 2026-11-17 — Run-4 AMENDMENT (append-only; filed pre-compute, binds the run)
 - Morph secondary (user-approved sharpening): twins (+E) also read run-5's morph lines k=1,2,3 x train/held keys (same lines, seeds 9711-9713/9731-9733). Expect twin agreement >= 0.90 (forced by shared ~0.97 accuracy) — purpose is functional-equivalence control, not a finding.
 - Interpretation rule extended: chance-on-noise + high-on-morph + student-learns-E (run-1/2 filed) = LEARNABLE-BUT-PRIVATE (transmission of idiosyncratic content; P2 claim rescoped, P3 tests deliberate patterns); high-on-both (delta >= 0.20 on noise) = SHARED partition (ceiling is student-side; train harder/better); chance-on-both-morph-included = recipe does not canalize (report as recipe finding; killA gate data adjudicates).
 - Nothing else changes (gates, seeds, thresholds per run-4 prereg).
## 2026-11-17 — P2-run-5 VERDICT (lookup-only stands; finder robust to k=1)
 - Planted rules (n=500): firstmod +0.072, lastmod +0.077, summod -0.008, count18mod -0.016 (N1 summod -0.007). ALL below the 0.15 bar — the tutor tracks no planted pattern class. Lookup-only stands as a real constraint (powered: half-width ~0.045), not absence-of-evidence.
 - Morph: accuracy 0.93-0.99 at every k=1..9 on BOTH train and held keys (k=9 sanity 0.96/0.97, gate passed); filler triple-violations 0 everywhere (builder assert held). The finder works down to a single valid pair in 8 noise pairs AND generalizes to held keys. Pure-noise k=0: entropy 0.29-0.32 (confident misfiring, not uniform garbage). The tutor is a near-perfect needle-finder that hallucinates confidently with no needle.
## 2026-11-17 — P2-run-4 VERDICT (IDIOSYNCRATIC / learnable-but-private)
 - Slot 2 VOID (both attempts failed killA: 8101 logged fail, retry 8103 scored 0.275 floor). Slot 3 (8102) passed 0.965 first try. Regime-fragility note: the two-phase curriculum from fresh init collapses to floor on some seeds (not near-misses) — connects to D1a's 11-lost sweep; instrument-calibration cost, not a finding against the recipe (it works when it works).
 - Fresh-9600 noise: E entropy 1.9736 (in band), T3 entropy 1.9617 (healthy, not degenerate). Pair E-T3: obs 0.395, permuted 0.259, DELTA 0.136 < 0.20 threshold -> IDIOSYNCRATIC per amended rule (expectation 0.15-0.35 missed low by 0.014 — verdict unchanged, threshold not borderline-gamed).
 - Morph secondary: twin agreement 0.88-0.95 at k=1..3 both key sets (functional-equivalence control PASSED — same finder circuit; k3-train 0.88 trivially under the 0.90 expectation, accuracy-forced).
 - Combined reading (run-1/2 + run-4 + run-5): the tutor's noise partition is LEARNABLE (student +0.25, SHUF-clean) but PRIVATE (twins share finder, not defaults; residue shared component ~0.14). P2 transmitted idiosyncratic content faithfully. The ceiling is in the stimulus, confirmed three ways (train-fit saturation, twin divergence, planted-rule blindness). P3's deliberate teacher patterns are the structural fix, as designed.
 - P2 CLOSED (runs 1-5; no further spend without new cause). NEXT: push run-4/run-5 ledgers + verdicts, then P3-run-1 prereg + candidate-(a) build.
## 2026-11-17 - catch-up receipt: f08a1ff (run2 slim, 222KB) verified MATCH on re-read; filed here per receipt-rides-next-push.
## 2026-11-17 - PUSHED acb7e02 (P2 run-4+run-5 bundle; vault github PAT, parent 3e62182) - 3 up, re-read MATCH.
## 2026-11-17 — P2-run-6 PREREG (user-corrected question; overrides my VOID framing — filed pre-compute)
 - QUESTION (user's words, adopted verbatim as the binding question): the unschooled brain's readings are degenerate mush — can it teach students to return the same degenerate mush?
 - Why this is better than my VOID proposal: the tree's DEGENERATE->VOID routing would have answered "don't ask." The user asks it directly. A VOID-by-rule is not a measurement; this run measures.
 - Design (single-variable swap vs run-1: ONLY the tutor changes): tutor = N2 (rebuild initSeed 9102; CHECKSUM FIRST: rebuilt N2's step-1 label counts must reproduce [442,252,148,158] exactly or HALT — determinism makes this bit-exact). Student SN fresh init seed 9310, same stages [{3000, attnKeep 0, softW 1, hardW 0}] on N2's cache over the same 1000 train lines (seed 9100). Control SHUF-N seed 9311 (N2 cache permuted across lines, perm RNG 9312).
 - Forms: same fresh-500 (9500), fresh-1000 (9502), recomb-395. N2 reads recomputed on all forms (cheap forwards).
 - Readings (measurement, preregistered interpretations):
   (a) N-train agreement (memorizability of mush; expect moderate 0.4-0.7 — memorization is easy);
   (b) N-fresh deltas obs-permuted (transmissibility; expect ~0, |delta|<=0.08);
   VERDICT RULE: (b)~0 AND (a)-(b) gap >= 0.15 -> MUSH-MEMORIZABLE-BUT-NOT-TRANSMISSIBLE (machinery needs learnable content; E's +0.25 required E's confident structure). (b) >= 0.15 -> MUSH TRANSMITS (machinery is content-agnostic mimicry; E result reframed as fidelity). (a) ~chance too -> MUSH UNLEARNABLE EVEN AS MEMORIZATION (random-hash floor; capacity/optimization datum).
   (c) descriptive: SN fresh marginals vs N2's (profile reproduction — marginals always "transmit" trivially; the permuted baseline is what prices content).
 - Pre-mortem: strongest objection = N2's near-uniform softs (top-1 0.47) give near-zero gradients, student learns nothing, train ~chance — that IS outcome (c), informative, not a failed run. Most likely failure = N2 rebuild drift (wrong seed/OPTS) — guarded by the bit-exact checksum, which doubles as a determinism audit of the whole stack.
 - Nearest-failure: subset-index/argmax slips — guards: audited argmax; cache rows indexed i*4+3 as throughout; E-form labels NOT reused (N2 reads fresh).
 - Ledger: run6-mush.json. Cost: 2 trains + ~7k forwards.
## 2026-11-17 — P2-run-6 VERDICT (MUSH TRANSMITS — outcome (b), the surprise)
 - N2 checksum EXACT ([442,252,148,158] reproduced bit-for-bit — determinism audit passes on the whole stack).
 - SN train 0.872 (expect 0.4-0.7 MISS-high: memorization easier than predicted). Fresh deltas: f500 0.542, recomb 0.536, f1000 0.553 (expect ~0: big MISS — mush transmits, and at DOUBLE E's fidelity). SHUF-N 0.000 on all three forms (obs==perm exactly: SHN collapsed to constant class-0 output, i.e. marginal-mode learning — control perfect, mechanism understood).
 - Falsifier 7.614 vs 7.815: ns BY 0.2 — nearest call in the program. Flagged, not buried: SN's recomb-vs-fresh distributions are nearly distinguishable; at larger n it may fire. Do not overclaim "identical."
 - INTERPRETATION (filed): transmission machinery is content-agnostic fidelity, not knowledge transfer. E's +0.25 reframed: lower-fidelity transfer of a HIGHER-complexity function. Leading hypothesis (hypothesis, probe-owed): sharp/confident circuits are HARDER to distill than smooth/mushy ones — sophistication anti-correlates with transmissibility (step-function vs linear-function analogy). Candidate probe: linear-probe complexity of N2-mapping vs E-mapping; not run, noted.
 - Expectation score this run: 0/2 (train overshoot + fresh surprise) + SHUF descriptive HIT. The miss is the finding.
 - P2 now COMPLETE through run-6. NEXT: push run-6 ledger + verdict, then P3.
## 2026-11-17 - PUSHED d87acfa (run-6 bundle; vault github PAT, parent acb7e02) - 2 up, re-read MATCH.

## 2026-11-17 — brain-tools parked, back to P2
- User: port fresh-eyes/research/memory/rabbithole as toy shared lib for teacher+student now, internalized version later would be nice. Decision: LOG + PARK, back to P2 present.
- Toy = harness-level (src/tools/brain-tools.js sketch): memory=external scratchpad write/read, fresh-eyes=blind twin re-solve (run-4 protocol), rabbithole=spawn-N-probes + budget/stop. No training. Spiked post-P3 only on user go.
- Internalized = weights-level (capacity fight at tiny size; needs harness-trace curriculum + distill). Placed P5/P6. Not started.
- P2 status on re-entry: CLOSED runs 1-6 (run-6 MUSH +0.542/+.554/+.536, SHUF-N 0.000). NEXT still P3-run-1 prereg + candidate-(a) build. No P2 recompute ordered this turn.

## 2026-11-17 — exploratory post-P2 sweep (7 quick tests, NON-RIGOROUS per user)
- User ordered: 5 knob tests + 1 nonsense dial + 5-tutor coffee-stain, "write them however you want, no fresh-eyes, not rigorous unless something found; if interesting, decide testing-error vs real."
- Deviations (deliberate): fresh pools 9700/9800 (not run1 9100 bit-pools); rMode1; batch8; ST250/BT120 (vs 3000); no recomb forms; perm=marginal-product. Private scratch only (p2-lib/ecache/chunk1-4/E.json/sweep-quick.json). Nothing under src/.
- R7 scrub (run3+ lines removed, kept 0.914): base fresh +0.187, scrub +0.242. Scrubbed HIGHER by +0.055 — curious, needs replication (composition shift vs real dilution). Testing-error candidate: scrub changes length mix.
- R8 temperature: T0.5 +0.250 > T1 +0.187 ~= T2 +0.187. SHARPEN wins — against the smooth-transmits hypothesis from run6. Curious, needs replication.
- R12 nonsense (reversed storage order, same seed): diff +0.018, PASS (<=0.03). Pipeline clean; other dials' movements price as real.
- R9 length: shorts-train bands 10:+0.28/15:+0.32/20:+0.22/50:+0.12 (wall replicates, stimulus-side not train-mix). Longs-train FLAT ~0.20-0.23 incl. shorts (10:+0.23/15:+0.20/20:+0.22/50:+0.14) — asymmetry curious: longs->shorts transfers, shorts->longs walls.
- R10 capacity: h24 +0.246 > h96 +0.212 > h48 +0.187. Smaller student best fidelity — denoising-by-bottleneck signal, first of its kind. Replication-owed.
- R11 scale: 250:+0.112 / 1000:+0.187 / 2000:+0.181 (saturated by 1000). Vote +0.223 vs best single +0.219 — population gain +0.004, no transcendence.
- R13 coffee-stain: Phase A fresh 0.219-0.264 (mean 0.239, sd ~0.015); Phase B peer-mean round -> 0.251-0.260 (mean 0.255, sd ~0.003). Variance crushed, mean +0.015. Peer observation REGULARIZES toward shared shape. TESTING ERROR OWNED: Amat/vsE_A used base-set predictions (variable-label slip, lengths 1000 vs 500) — Amat 0.665/Bmat 0.881 incomparable, vsE_A ~0 meaningless. Afresh/Bfresh/Bmat valid. Rerun of Amat on fresh owed only if user wants it.
- Verdict: nothing gating (as ordered). 4 curios filed for replication: scrub+, sharpen, h24, peer-regularization. R12 null holds. P2 stays CLOSED; NEXT still P3-run-1 prereg.

## 2026-11-17 — P2 FORMAL CLOSE + P3-run-1 PREREG (build phase, candidate-a)
- P2 CLOSED (reaffirmed post-sweep, no new cause): runs 1-6 filed+pushed (d87acfa); sweep was post-close exploratory, scratch-private, curios unreplicated, no gating impact. No more P2 spend. Unpushed tail (sweep log + this prereg) rides next push.
- P3-run-1 SCOPE: BUILD ONLY. Candidate-(a) frozen tutor-as-scorer input search. Teaching + crossed contrast = run-1b after build passes (separate prereg). One candidate owns the round; ledger names it.
- Tutors: E = d1a blob ce8b97cf; N = fresh init seed 9601 (never-educated, same arch OPTS).
- Seed pool: 400 mixed lines seed 9810 (P2-spec vocab19/bands). Start seeds ledger-listed: E-class-c run-k = 98200+c*10+k, retry 98300+c*10+k; N: 98400/98500 bases.
- Search: single-token mutate-and-test hill-climb on scorer softmax(target); 1 iter = 1 scorer eval; cap 500 evals/seed-run; 5 runs/class/attempt; bank EVERY >=0.90 line (exact-dup rejected, restart from new start); target 100/class (60 train/40 exam); slow-climber: rising-at-cap with 0<bank<100 -> ONE 1000-eval extension from best line, logged SLOW; retry once with fresh seeds; dead seeds logged (run banking zero).
- Gates per class (balanced 4-class set, marginal-product perm): round-trip raw >=0.50 AND delta >=0.20; novelty (no exact dup vs pool/bank; P2-pool cross-check infeasible - start order unledgered - filed limit); token-entropy >=3.5 bits (max 4.25); non-triviality (fresh solver 9501 agreement within 0.25+-0.10, else TRIVIAL=fail); diversity mean-Hamming >=0.6xmeanLen; E/N length-band x class chi2 homogeneity <=24.996 (df15, alpha .05) else VOID.
- Quorum: (a) owns round iff >=3/4 E-classes pass post-retry; <=2 -> (b); 1-2 stable -> NARROW claim scoped + round to (b). N-build fail (gate unpassed) = absence not baseline -> contrast VOID, N-procedure redesign (no silent lowering). (b)-pilot owed even on (a) success (deferred to run-1b prereg).
- Expectation: E-build 3-4 classes pass (E already confident on noise); N-build uncertain (mush-max may be sparse) - VOID path acceptable, not a failure to hide.
- Pre-mortem: search too weak -> false build-fail (retry+slow mitigate); E-lines naive-readable -> non-triviality fail (honest); N fail -> VOID path. Nearest-failure: start-pool leakage (novelty/diversity catch), band bias from optimization (chi2 catches).

## 2026-11-17 — P3-run-1a BUILD VERDICT (candidate-a search + gates)
- E-build: 4/4 PASS, 100/class banked. Round-trip raw 1.0, delta 0.75 (both halves). Non-triviality: fresh solver 9501 reads E-lines at 0.2775 (chance band 0.25+-0.10 PASS). Entropy 4.244/4.25 max. Mean-Hamming 37.48 (floor ~0.6xmeanLen, clears easily). NOVELTY DING (honest): 39/400 banked lines are pool-exact (starts E already read >=0.90, banked unmutated). Gate as prereged = no exact dup -> 39 fail. Ruling: NOT a build-fail (361/400 mutated, search did work); remedy = top-up run excluding pool-exact banking, then re-gate. Owed before run-1b.
- N-build (fresh 9601, same procedure): 0/4, banked ZERO everywhere, all runs dead, no slow-climber fired (nothing rising). N's random landscape has no reachable >=0.90 in budget. Per prereged R22 rule: N-tutor that cannot pass the gate is an absence, not a baseline -> crossed contrast VOID. No claim. No silent lowering of N's bar.
- Quorum: (a) owns the E side 4/4. The ROUND is blocked on N-procedure redesign (prereg + user sign required). chi2 not computable (N empty) - VOID as filed.
- Redesign candidates (NOT adopted, need user pick + prereg): (1) bigger N search budget (2000-eval runs, same code - sparse mush-max needs more draws); (2) N target matched to E's banked confidence distribution instead of fixed 0.90 (explicit gate change); (3) different N tutor (P2's N2 has confident regions top-1 0.47 - still far from 0.90); (4) asymmetric baseline (E-lines as-is vs N-lines = N's best-found, contrast interpreted with confidence gap filed).
- NEXT: user picks redesign (or orders novelty top-up first) -> prereg amendment -> rebuild N (+ E top-up) -> re-gate -> run-1b teaching prereg.

## 2026-11-17 — N landscape survey (sharpen-N step 1, exploratory)
- 8 fresh h48 seeds on 200 noise lines: top-1 means 0.39-0.53 (E: 0.86), max 0.53-0.80, fraction >=0.80 ~0 (one seed 0.005). 0.90 essentially absent from raw naive landscape - build failure confirmed structural, not budget.
- Climbability (5 starts x 100 evals toward best class): best-reached 0.77-0.86. Climbing works (0.53->0.85) then plateaus: soft ceiling ~0.85 for naive nets. 500-eval build runs never crossing 0.90 is consistent, not a search bug.
- Capacity: h24-9602 raw max 0.874 (spikiest naive seen), h96-9602 0.834. Seed lottery dominates size. NO seed shopping (rule stands) - noted, not used.
- Reading: N's ceiling is ~0.85, bar is 0.90. Sharpening N = either move the ceiling (self-supervised pretraining, spec-sanctioned upgrade) or move the bar (recalibrated N target, gap filed). Ledger: scratch/p3-n-survey.json.

## 2026-11-17 — E autopsy + clean top-up + N-recal (P3-run-1a follow-through)
- E AUTOPSY (v1 lines): confMean 0.95-0.97, margins 0.92-0.94 (E is maximally confident); token entropy 4.22-4.24 (surface = uniform noise); first/last token top ~8-11% (no positional fixation); bands roughly proportional (longs 39-54%); min-Hamming-to-pool 5-8. Verdict: the "pattern" is entirely in E's private readout - specific combinations its attention circuit latches onto, invisible in marginals. Learnable-but-private made explicit. Lesson for N: don't look at surfaces (uniform too) - look at confidence profiles + round-trip.
- E TOP-UP v2 (pool-exact banking rejected): 100/class clean, dead 0, 3.1-4.1k evals/class. Gates: rt 1.0/+0.75, naive 0.27 (chance PASS), ent 4.246, ham 40.47/meanLen 33.6 (floor ~20, 2x clear), poolHit 0. E side FULLY CLEAN. Ledger: scratch/p3-a-elines-v2.json.
- N-RECAL at 0.80 (gap filed): banked [23,0,0,3], dead [1,10,10,7]. Classes 1,2 unbankable (all runs dead); class asymmetry in random landscape (0 climbable, 3 marginal). Gates on n=26: rt 1.0/+0.20 (just at bar), naive 0.077 (BELOW chance band - fails non-triviality low side; small-n caveat, 2/26 vs 6.5 expected), ent 4.034, ham 29.8.
- E-LENS cross-reading: E reads N-lines at 0.115 (worse than chance) WITH top1 0.838/margin 0.74 - E confidently misreads N's lines as other classes. N reads E-lines at 0.258 (chance) lukewarm (top1 0.54). N on N-lines 0.813/0.721. Partitions mutually exclusive, not merely private: E's and N's maxima are systematically opposed, not orthogonal-noise. Complicates contrast interpretation (N-lines are E-opposed ground, not neutral ground) - filed, run-1b prereg must address.
- NEXT candidates: (i) N-class-0 top-up to 100 -> class-0-scoped pilot contrast (only viable class; hit floor needs 20+/arm); (ii) self-supervised sharpener prereg+build (principled ceiling move). Ledgers: scratch/p3-n-recal.json + summary.
## 2026-11-17 — N-class-0 top-up DONE + pilot contrast VOID-as-contrast + sharpener draft filed
- TOP-UP (user go): continued 0.80 search on class 0 only (seedBase 98900, same code/guards, excluding prior bank + pool-exact): 23->100 banked, 30 runs, dead 2, 14966 evals, top5 0.849/0.845/0.843/0.842/0.842. Ledger: scratch/p3-n-topup.json (bank0, runs, best-20).
- PILOT v1 (single-class-only teaching: 60 zero-lines train, 40 held-out exam, 3 seeds/arm, ST250/rMode1/batch8): ALL 6 solvers collapse to constant-0 (hitE0=hitN0=1, faNEG=1, every delta 0.000, both arms). Degenerate by construction: single-class teaching teaches the constant function; single-class exams reward it. Ledger: scratch/p3-pilot.json.
- PILOT v2 (balanced: 60 zero-lines + 60 SHARED noise negatives, each tutor labels its own; exams = held-out E0/N0 + fresh noise + E123, scored vs each tutor): only non-degenerate cell = N0-exam scored vs E's labels: SE mean delta +0.156 (per-seed 0.177/0.214/0.077, all positive, 1/3 over the 0.20 bar) vs SN exactly 0.000 (obs=perm=0.175) all 3 seeds. Partial inheritance of E's N-line rejection mapping by E-trained solvers; n=3, pilot-grade, NO claim (exam labels are E's = E-home-turf cell, not a crossed contrast). All same-class cells still degenerate (delta 0). Side datum: SN final loss 0.79-0.85 vs SE 0.55-0.61 - N is a worse distillation target even on its own lines. Ledger: scratch/p3-pilot2.json.
- VERDICT: pilot VOID as a contrast (degenerate cells), INFORMATIVE as a negative: single-class teaching cannot support the crossed contrast; the round needs the full 4-class partition, i.e. the sharpener (or another N redesign) must deliver a full N first. No quorum claim, no bar, no pass/fail - pilot only.
- SHARPENER mini-prereg DRAFT v0.1 filed (scratch/p3-sharpener-prereg-draft.md, UNCOUNTERSIGNED, binds nothing): masked-value pretraining on noise (no labels/agreement; spec-sanctioned tutor upgrade); stage-1 climbability survey bar >=3/8 fresh seeds reach >=0.90 (vs 0/8 naive); stage-2 full 0.90 rebuild as sharpened-vs-unsharpened arm; no seed shopping; W = survey <=1/8 + rebuild <3/4 kills it. NEXT: user countersigns -> build script -> stage-1 survey.
- UNPUSHED (top-up + pilot + pilot2 + sharpener draft + these entries ride the next push; no push without order).
## 2026-11-17 — P2-run-7 PREREG (calibration round: E-cool + N-solidify; P2 reopened with cause, filed pre-compute)
- CAUSE to reopen (P2 closed twice): run-6 reframed transmission as content-agnostic fidelity + R8 (T0.5 wins) + R10 (h24 wins) + R13 (peer-mean regularizes) give priced, specific fidelity interventions. Single round, then P2 re-closes. P3-run-1b keeps tutor-generates strictly; THIS round is P2-style (experimenter lines + tutor outputs = legal curriculum since run-1) — the pilot-v2 intervention lesson is filed, not repeated: no exam-claims from tutor-alien teaching, fidelity readouts only where exams aren't tutor-owned.
- E-COOL (same init seed 9320 for T1/T2 pair — optimizer luck controlled): E-T1 (3000 steps, T1 cache, run-1/2 spec on the same 1000 train lines seed 9100; doubles as determinism checksum, expect fresh-1000 delta ~0.22) vs E-T2 (identical, cacheRows T=2.0) + E-h24 (seed 9321, T1). Exams: fresh-1000 (E labels, transmission-preservation), E0-40 (E-right ground), N0-40 (E-shrill ground), fresh-noise-100 seed 9814 (E labels). Peer-mean of T1+T2 student softs, eval-only. BAR (E-cool HOLDS): (a) T2 fresh-1000 delta >= T1 delta - 0.05 (preserved) AND (b) (E-margin-N0 minus T2-margin-N0) minus (E-margin-E0 minus T2-margin-E0) >= 0.10 (cools more where shrill than where right). h24 + peer-mean descriptive.
- N-SOLIDIFY (tutor N rebuilt seed 9601): N-MEM (100 N0 lines, 3000 steps, seed 9330 — ceiling proxy, descriptive), N-FULL (N0-60 + fresh-noise-200 seed 9815, N-labeled, 3000 steps, seed 9331), N-T05 (same, cacheRows T=0.5), N-h24 (same, h24). Exams: N0-heldout-40 (vs N, descriptive — degenerate expected), fresh-noise-100 (vs N — the non-degenerate transmission reading; N spreads on noise), E0-40 (vs N, descriptive). BAR (N-HOLDS): best of {FULL,T05,h24} fresh-noise-vs-N delta >= 0.20 with loss <= 0.90 (mush transmits at P2 margin when taught at full length). MEM descriptive.
- Expectation: E-T2 preserves (R8 T2~=T1) + cools ~0.10-0.15 discriminatively; N best arm T05 or h24, delta 0.10-0.25 (first full-length N teach — genuinely uncertain). Pre-mortem: strongest objection = T2 lowers ALL margins incl. correct ones (blanket humility, not calibration) — answered by the discrimination term (b), which prices exactly that. Most likely failure = worker time (7 trains); Big-Job rule: E-arms first with ledger, N-arms second, evals ride along. Nearest-failure: pilot-v2 teaching-intervention — guarded by P2-style filing (tutor outputs ARE the curriculum here; tutor-generates binds P3-1b only) + no exam-claims off tutor-alien teaching.
- Twin-disagreement audit (consensus-gated softening needs a twin): T3 blob status checked first; absent = deferred to run-8, not silently replaced.
- Ledgers: scratch/p2-run7-E.json + scratch/p2-run7-N.json -> src/evidence/p2/run7-calibration.json on verdict.
## 2026-11-17 — P2-run-7 VERDICT (E-cool SPLIT, N-solidify HOLDS; P2 re-closes)
- E-COOL: T2 fresh-1000 delta 0.2397 (in filed run-1/2 T1 band 0.22-0.25 — transmission PRESERVED, bar (a) HIT). Discrimination term -0.153 (T2 margins fall 0.60 on E0 vs 0.45 on N0 — cools MORE where E is right; bar (b) +0.10 MISSED). Blanket humility, exactly the pre-mortem fear: cooling preserves the mapping but is indiscriminate. E-cool = SPLIT. Peer-mean (collapsed-T1+T2): N0 0.256/NZ 0.299 — ensemble transmits (T2 carries it). H24: 0.239 preserved, margins 0.40-0.49 (mid-cool, descriptive).
- INIT-FRAGILITY (unprereged diagnostic, filed): paired T1-9320 STALLED (loss 1.497->1.362 flat at uniform, delta 0.023); T1-9322 partial (loss 1.47, delta 0.093). Same 9320 init under T2-cache: 0.240. Same cache under h24 (9321): 0.239. Sharp-target h48 distillation is init-fragile (2/2 weak vs historical band); smoothing (T2) or bottleneck (h24) rescues the SAME draw. Second instance of run-6's moral (smooth distills, sharp stalls), now within-tutor. No seed shopping (9320/9322 reported, never selected).
- N-SOLIDIFY: FULL dNZ +0.4952 (loss 1.089 — delta crushes bar, loss misses 0.90 clause); T05 +0.4432 loss 0.607 (BOTH clauses: HOLDS-carrier); H24 +0.5241 loss 1.008 (best delta). N-HOLDS via T05. Robust story across all three arms: full-length teaching of N's mush transmits N's noise mapping at +0.44-0.52 — double E's fidelity, third vindication of run-6 (content-agnostic fidelity; smooth distills). Loss≠agreement again (best fit T05 ≠ best delta H24). N-MEM: loss 0.68 (memorizable); train-agree delta 0 is single-class-degenerate, OWNED (same trap as pilot v1 — loss is the reading). N reproduces own profile on N0 (student 0.81/0.72 = N's 0.813/0.721 exactly).
- Twin audit: T3 blob absent (run-4 saved evals only) -> consensus-gated softening DEFERRED to run-8, per prereg. Sharpener draft stands (ceiling move still owed for the full 4-class round); run-7 priced fidelity, not ceiling.
- Expectation scored: E-preserves HIT, E-discriminates MISS (blanket), N-band MISS-high (0.44-0.52 vs 0.10-0.25 exp — overshoot, happily). Ledger: src/evidence/p2/run7-calibration.json. P2 RE-CLOSED (no more spend without new cause). UNPUSHED (prereg + verdict + ledger + this entry ride the next push; no push without order).
## 2026-11-18 — Sharpener v0.1 COUNTERSIGNED (build + Stage 1 authorized)
- User: "Go ahead countersign the sharpener". Binds v0.1 only (masked-value pretraining, 8-seed survey bar >=3/8 at 0.90, Stage 2 needs its own go). Next: build script filed in-ledger, then Stage 1 survey.
## 2026-11-18 — Sharpener Stage 1 INTERIM (1/8 seeds; objective theoretically void, survey halted for user call)
- Build filed in-ledger plan: pretrain classes19 (mask head = Lout19), single-target masked CE (15% corruption, one target per example), transplant backbone into classes4 keeping Lout0, probe = survey recipe (pool9810, 5x100, rng 7000+s). Seeds fixed 9741-9748, train pool 9750/400/mixed, steps 800 (within <=3000 budget), batch 8, lr 5e-3, rMode 1.
- Seed 9741 measured (scratch/p3-sharp-s9741.json): 800 steps, trainMs ~223s, firstLoss 2.76 -> lastLoss 2.93 (= chance ln19 ~= 2.94, zero signal); naiveBest 0.8175 vs sharpBest 0.8175 (identical — backbone unchanged in effect). Full 3000-step/seed projected ~20 min/seed (timed 395ms/step); 8-seed full-budget survey ~2.5h wall — NOT the prereg's "(minutes)".
- Theory: uniform iid noise has no co-occurrence structure, so masked values are independent of context — best achievable = chance, always. Any train-loss fall would be pure memorization of fixed corrupted pairs, which cannot transfer to fresh-line climbability with a fresh readout. Objective void either way on P2-spec noise (stronger than the filed pre-mortem). Survey halted after 1 seed rather than burning ~40+ min to confirm a foregone 0/8. Awaiting user call: kill sharpener (fall back to recalibrated-N/redesign per prereg) vs amended objective (new mini-prereg + countersign, e.g. structured-noise pretraining).
## 2026-11-18 — (b)-pilot v0.1 COUNTERSIGNED (mouthpiece bounded pilot, frozen + unfrozen)
- User: "countersigning the test". Binds v0.1 only (class-0 pilot: next-token head on N-9601 backbone, pool 9760/400, <=800 steps/arm, head-init 9761, sampling 9762, bar >=20 keepers at >=0.90 + novelty). Next: build (next-token CE via per-position aux through Lout19, frozen = head-only Adam, unfrozen = full) + run frozen arm, then unfrozen.
## 2026-11-18 — (b)-pilot VERDICT: NO-HEADROOM (both arms 0/200, retry confirms; redesign, don't extend)
- Frozen: train 3.21->2.94 (= chance ln19, zero signal), keepers 0/200 (belowBar 105, wrongPile 95). Unfrozen: identical 3.21->2.94, keepers 0/200 (104/96). Backbone-frozen held bit-exact. Retry (sampling 9763, same budget): 0/200 both arms, max top1 0.80/0.83 — never near 0.90. W TRIPPED (<=5/200 both arms after retry).
- Cause (stronger than pre-mortem): next-token training on uniform noise is unlearnable (tokens independent -> chance ceiling) AND unmemorizable in budget (6400 draws over ~12400 unique prefixes, ~0.5 epochs). Writer stays a near-uniform sampler; scorer's 0.90 region unreachable by construction. Ledgers scratch/p3-b-frozen.json, p3-b-unfrozen.json, *-r2.json. Full (b) as specified is dead. Redesign owed (structured pool lines? scorer-side change?) — new mini-prereg + countersign, no silent extension.
## 2026-11-18 — (b)-pilot v0.2 COUNTERSIGNED + Step 0 (0.90 region absent; pilot proceeds as diagnostics)
- User countersigned v0.2 (structured Markov food RHO=0.35 pool 9770 + binding no-labels clause + Step 0). Step 0 measured (scratch/p3-b-step0.json): dense class-0 hill-climb on N-9601, 40 starts x 500 evals = 20k evals: max 0.8883, median 0.8657, 0/40 reach 0.90. The 0.90 region is effectively absent — no writer can land where blind optimization at 40x budget cannot. Per prereg the pilot still runs (writers might find what search misses) with expectations dropped to diagnostics: train-loss movement (does the build learn structure?) + max-top1 movement vs v0.1's 0.83.
## 2026-11-18 — (b)-pilot v0.2 VERDICT: NO-HEADROOM (mouth works, target absent; W tripped, redesign owed)
- Frozen: train 3.18->2.92 (= chance, head-only learns nothing); keepers 0/200, max 0.839. Unfrozen: train 3.18->2.31 (BELOW chance 2.94 and below true-Markov optimum ~2.45 — the mouth LEARNS structure, build validated); keepers 0/200, max 0.846. Retry (sampling 9763): 0/200 both arms, max 0.835/0.815. W TRIPPED.
- Attribution split (the valuable part): v0.1 failed at the mouth (nothing to grip); v0.2's mouth grips fine (2.31) but the destination doesn't exist (Step 0: 0.888 max by 20k-eval optimization; writers sample, strictly weaker). Plus dialect mismatch: structured lines score MORE spread (wrongPile 108/109 vs 95/96), not more class-0.
- v0.2 as specified is dead. Redesign space (new mini-prereg + countersign): (i) population over N seeds (quorum claim, not shopping); (ii) existence-bounded bar (gate at what Step 0 finds, with filed justification — weakens the round, red-team will object); (iii) run-1b on E-lines + NARROW N claim, mouth stays research track. Ledgers scratch/p3-b-v02-*.json + step0.
## 2026-11-18 — twins v0.4 Stage A COUNTERSIGNED (6 writers, 3 cycles)
- User countersigned v0.4 Stage A (user direction carried: frozen+unfrozen both, 3 exam cycles). Order: train 6 writers (backbones 9601/9602/9603 x head-only/full, head-init shared within backbone pair, train-sampling 9780+idx), save blobs to scratch/, then A1 mouth-agreement (unfrozen-trio vs blind bar >=0.15, frozen descriptive) + A2 three cycles (100/instance/cycle, sampling 97600+c*10+i, shared N-9601 grader, per-cycle modal match + off-bias + cross-cycle stability, pass >=2/3 cycles).
## 2026-11-18 — twins Stage A VERDICT (A1 PASS, A2 FAIL 1/3, B gated off)
- 6 writers trained (pattern holds: frozen pins at chance 2.89-2.92, unfrozen learns 2.26-2.31; 9601 reproduces v0.2 exactly). A1: unfrozen mouths agree 0.404 vs blind 0.094 -> +0.310 PASS; frozen trio 0.339 (above blind); cross-mode 0.106 (different solutions). A2: c1 FAIL (two 1%-margin modal flips), c2 FAIL (one holdout + l1 under), c3 PASS (all modal 0). Pooled profiles ~identical all cycles (~[0.43,0.22,0,0.34]) and near the grader's uniform bias — modal rule converts wobble into failure. B OFF per gate; line NOT killed (A1 passed). Ledgers scratch/p3-twins-W*.json, A1.json, A2c{1,2,3}.json.
## 2026-11-18 — twins v0.5 Stage B COUNTERSIGNED (students of unfrozen trio, cycle-3 exams)
- User countersigned v0.5 (gate override with contained A2-failure: B uses passing-cycle exams only; B bars self-protecting). Order: regen cycle-3 exams for 9601u/9602u/9603u (sampling 97631/97633/97635, deterministic rebuild), grade via N-9601, 3 students (T1 cache, <=1500 steps, seeds 9790-9792) + 3 blinds (9610-9612). Bar per writer delta >= 0.20 + blind in chance+-0.10; claim >=2/3.
## 2026-11-18 — twins integrity crisis RESOLVED (regen bug, not platform; A2 rebuilt with lines)
- Symptom: cycle-3 regen graded all-pile-1 ([0,100,0,0]) vs filed A2 spread. Isolation: makeRng history-independent; forward() pure (param hashes unchanged; interleaved N-grading leaves generation byte-identical); no module-level mutable state in nn.js. Pollution hypothesis dead.
- Root cause, proven by construction: regen snippet reseeded INSIDE the line loop (fresh makeRng(seed) per line) -> 2 unique lines, profile exactly [0,100,0,0] on 9601u/97631. Filed A2 (rng outside loop) is the correct procedure. Generator bug, no platform report.
- A2 rebuilt under fully-specified procedure (scratch/p3-twins-gen.js; one rng/exam, first-half short/second-half 50, uniform-3 prefix, ancestral T=1.0 r=1, grade r=1; same countersigned seeds 97600+c*10+i) with all 1800 lines persisted (scratch/p3-twins-A2r-lines-c*-*.json, 100/100 unique each). c1: all modal 0, l1 0.078; c2: all modal 0, l1 0.032; c3: all modal 0, l1 0.080 — 0/3 under v0.4's modal+bias bar (bias fails everywhere). Filed 1/3 verdict stands qualitatively and strengthens: writer profiles hug grader bias. Ledgers scratch/p3-twins-A2r-c{1,2,3}.json.
## 2026-11-18 — twins Stage B REBUILD VERDICT: 0/3, all VOID (students learn, grader cannot examine)
- Fixed run (scratch/p3-twins-stageB.js): row-array tutorCache (NaN bug fixed), integrity gate (nUniq/recount/finite, else abort), mapping 9601u->9790/9610, 9602u->9791/9611, 9603u->9792/9612. Cycle-3 rebuild exams.
- Students distill fine (obs 0.97/0.96/0.86, deltas 0.618/0.611/0.535, finite losses) but blinds score 0.42/0.49/0.38 -> all three VOIDED outside 0.25+-0.10. Claim 0/3. W ("students <0.10 kills line") NOT tripped — machinery transmits, grader bias voids. Next: E-lines + NARROW N claim, or grader redesign (new mini-prereg + countersign). Ledgers scratch/p3-twins-Br{,-9601u,-9602u,-9603u}.json; poisoned scratch/p3-twins-B.json stays void, do not cite.

## 2026-11-18 — agent instructions extracted to agents-augment.md (user-ordered)
- User had me read src/README.md to find my tools; found src/tools/ (memory/websearch/fresh-eyes/rabbithole/eval-harness/...) — previously unopened, now adopted as first-stop checklist per README l.10.
- Created agents-augment.md (repo root): extracted standing AI instructions (orientation+tools, workspace/durability rule, memory discipline, honesty rules) with the always-read line on top.
- Pointer line placed in src/README.md (AI orientation), src/GAMEPLAN.md (end comment; pre-edit snapshot src/gameplan-snapshots/2026-11-18-pre-augment-line.md, 80419 bytes — admin touch, plan substance untouched), src/CHATLOG.md (this entry), scratch/CURRENT_TASK.md.
- Standing unpushed set grows: agents-augment.md (new), src/README.md, src/GAMEPLAN.md, snapshot file, src/CHATLOG.md. No push without user PAT.

## 2026-11-18 — twins record evacuated scratch/ -> src/evidence/p3/ (user-ordered)
- 120 files, 14355507 bytes, all byte-verified on copy (read-back sizes match), then scratch originals deleted (two patch batches, all applied). Layout mirrors p2/ flat runs, grouped: run-1a/ stage-a/ stage-b/ dual-v06/ joint-v07/ specs/ drivers/ + README.md map with the scratch->src prefix rule (frozen history keeps old paths, read with the rule).
- Kept as exhibits: poisoned p3-twins-B.json (VOID) + B-INTEGRITY-FAIL.json. Drivers keep historical scratch/ load paths — v0.8 run must pass new paths at build time.
- Unpushed src set now: evidence/p3/* (121 with README), agents-augment.md, README.md, GAMEPLAN.md, gameplan-snapshot, CHATLOG.md. No push without user PAT.

## 2026-11-18 — PUSHED 49136c2 + scope-bug restore 7bd0acb (vault github PAT, user-ordered)
- Push 49136c2 (parent d87acfa): 127 uploaded / 943 reused, 14.8MB. Covers p3 evacuation (121 files), agents-augment.md (new root path), README/GAMEPLAN pointers, gameplan snapshot, CHATLOG. Ref verified match. PAT stayed in page/worker memory; secret-scan clean; auth as Maieutics-Learning.
- SCOPE BUG (mine, owned): worker fs listing omits dotfiles (.github/, .gitignore) and src/meta/* mapping sources are absent locally, so the diff read 6 remote-only paths as deletions and the push dropped them (CI workflow, gitignore, Dockerfile, k8s, LICENSE, root README). Caught on the result review, same session.
- Restore 7bd0acb (parent 49136c2): re-added all 6 by reusing d87acfa blobs (no re-upload), nothing else touched, ref verified match. Lesson filed: future pushes carry forward every remote path not in local scope (preserve, never delete) unless a deletion is explicitly ordered and listed.
- Backlog drained: zero unpushed src/ files at 7bd0acb except this receipt (rides next push).

## 2026-11-18 — twins v0.6 dual-head COUNTERSIGNED + RUN (filed post-hoc; numbers verified against src/evidence/p3/dual-v06/ ledgers this session)
- Spec: src/evidence/p3/specs/p3-twins-v06-dualhead-draft.md → countersigned p3-twins-v06-countersigned.md. One net per writer: shared trunk + mouth head + ear (pile) head; N 9601-03 + E d1a.
- N-ears (p3-dual-Nears-partial.json): losses 1.5384→1.3209 / 1.5854→1.2863 / 1.5125→1.2892. U1 (p3-dual-U.json): writerMean 0.8125, blindMean 0.0501, gap 0.7624 PASS (method differs from A1: per-position flattened on reconstructed Markov-repeat pool — passes bar, not a bit-replay). U2 N (same file): obs 0.44/0.39/0.41, deltas 0.0077/0.0201/0.0292 vs bar 0.80 → FAIL both arms (head-only ear cannot mimic tutor on writer exams; filed pre-mortem hit). U2 E (p3-dual-E-ledger.json): ear 1.4321→1.1512, obs 0.42, delta 0.1595 → FAIL diagnostic. B-dual GATED OFF per spec.
- F-mush control INDEPENDENT (p3-dual-F-partial.json): F9701 obs 0.95 delta 0.5814 blind 0.47 VOID; F9702 obs 0.96 delta 0.6108 blind 0.22 PASS; F9703 obs 0.99 delta 0.6622 blind 0.40 VOID → 1/3 PASS, 2/3 void. Mush transmits. E mouth (p3-dual-Emouth-ledger.json): 3.2605→2.2319 PASS (range gate). Verdict rollup in p3-dual-verdict.json.
- Next: joint trunk or anchored ear needs new countersign (filed in verdict gate line).

## 2026-11-18 — twins v0.7 JOINT-TRUNK COUNTERSIGNED + RUN (filed post-hoc; numbers verified against src/evidence/p3/joint-v07/ ledgers this session)
- Spec: p3-twins-v07-trunk-draft.md → countersigned p3-twins-v07-countersigned.md. 3 N writers + E d1a, shared-trunk lockstep (trunk-grad averaging, LAMBDA=1.0, 1000 steps lr 5e-3, mouth anchor ≤2.6, new exam seeds 97621/22/23/29, same U2 bar 0.80, per-arm B-dual gating). Smoke test passed (sharing/lockstep true, finite). Baselines: writers 1.77–1.90 / E-mouth 2.23 on spec anchor pool.
- RUN (p3-joint-verdict.json): N joint 3/3 complete, no HALT — preMouth 1.8126/1.7739/1.9025 → lastMouth 2.1018/2.0551/2.2528 (anchors 2.10/2.06/2.25, no trip). U2 spec metric 'modal agreement' = obs: 0.95/0.85/0.82 → 3/3 ≥0.80 PASS (deltas 0.5766/0.4570/0.4446 alongside). E HALTED @step200 (anchor 2.8569>2.6, fresh head from 3.2807; u2obs 0.40 FAIL diagnostic). U1 gap 0.4404 (writerMean 0.4937, blindMean 0.0533; N-N 0.76–0.79, E pairs 0.20–0.22 diverged). U3 descriptive (halted E inside). B-dual N: 9601u obs 0.99 delta 0.6181 blind 0.49 VOID; 9602u 0.94/0.531/0.54 VOID; 9603u 0.98/0.6128/0.24 PASS → 1/3 pass 2/3 void → quorum unmet → claim FAILS. W not tripped. Same moral as v0.5: joint trunk fixes attach, exam still doesn't discriminate.

## 2026-11-18 — joint generalization probe (filed post-hoc; numbers verified against src/evidence/p3/joint-v07/p3-joint-generalize.json this session)
- Retrained B-dual students graded on 500 unseen structured + 500 unseen noise lines. studVsTeach: 9601u 0.79/0.83, 9602u 0.836/0.87, 9603u 0.84/0.86 (deltas 0.42–0.47) — genuine generalization, not exam memorization. studVsTutor0 (original N-9601 rule): 0.80–0.84. teachVsTutor0 0.86–0.89. Blinds: 9601u 0.45–0.50 everywhere (void wasn't an exam fluke — whole region bias-aligned), 9602u 0.38–0.46, 9603u 0.25–0.31 clean chance.

## 2026-11-18 — v0.8 hard-exam DRAFT + curriculum drafts v1/v2 (UNCOUNTERSIGNED, no compute; filed post-hoc from specs on disk)
- v0.8 HARD-EXAM DRAFT (specs/p3-twins-v08-hard-draft.md): train on 100 tutor-graded mouth lines (97631–33), test held-out 300 candidates (97641–43) committee-filtered (9651–53, tiebreak 9660) to 100 hard lines; blinds 9610–12 held out; same bars, N quorum 2/3, W tripwire (≥2 voids with blind>0.35 → region guessable). UNPURSUED (superseded by curriculum below).
- v0.8 CURRICULUM DRAFT v1 (superseded, distillation-based, unpursued): user-staged curriculum (fresh tutor/student, easy→class→test→hard→transfer→class→test), rule N-9601 both phases, easy 9770×700 / hard 9810×700 (500 tutor-train / 100 class / 100 held-out test), 3 pairs (tutor 9840–42, student 9850–52, blind 9860–62 descriptive), 1500-step recipe, phase gate (tutor delta≥0.20 else HALT) + class1/class2 claims + transfer/retention descriptive, quorum 2/3, FROZEN-TEST MATRIX (S0/S1/S2 × easy+hard TESTs).
- v0.8 CURRICULUM DRAFT v2 (specs/p3-twins-v08-curriculum-draft.md, verified on disk: tutor 9840/41/42, student 9850/51/52, blinds 9860/61/62, CLAIM 1/2 bars −0.20 nats, N-9601 AND d1a thermometers): zero-distillation rewrite per user principle (tutor gets NOTHING but raw data, else WE are the teacher). Tutor AND student are mouths, next-token on raw lines only; "writes class" = literal generation; N-9601 + d1a demoted to pure thermometers. Still UNCOUNTERSIGNED — no compute until countersign.
- No-labels audits (user Qs): mouths always raw-only (next-token; structured pools = unlabeled hidden pattern, legit); N-9601/blinds got NOTHING; everything else got teaching from us (d1a hinted/labeled curriculum, students/ears soft-target distillation, pilots/banking grader-steered search) — v0.8-v2 is the program's first teacher that learns without us. No-labels decided twice before, both unconsummated: (a) v0.2 binding clause covered mouth TRAINING only, pilot died on absent destination; (b) gameplan D2-N deferred follow-up rung, sharpener halted void-on-uniform-noise after 1 seed. Counter-decision on record: P2-run-7 legalized "experimenter lines + tutor outputs" as curriculum.
- Memory-skill Q: full file read (src/tools/memory/SKILL.md, 402 lines) + applied (reconcile flow, search receipt, snapshot-before-GAMEPLAN-touch, secret handling during push).

## 2026-11-18 — audit-level check + backfill (this session)
- User asked: are we still writing everything at audit level? Finding (Observed): NO — gap found. The v0.6/v0.7/v0.8/generalize/audit steps above lived only in scratch/CURRENT_TASK.md prose; CHATLOG had zero entries past the 7bd0acb push receipt, violating the once-per-session durable-log rule. All specs/ledgers WERE durable (src/evidence/p3/, pushed) — the loss was log coverage, not data.
- Repair: backfilled the four entries above post-hoc (marked as such), every MEASURED number re-verified against its ledger this session before filing (receipts: dual + joint verdicts, generalize, F-partial, U, E/E-mouth ledgers, v08 spec grep). Provenance: scratch record prose + on-disk artifacts; no number filed from memory alone.
- Standing gaps (owned, unchanged): scratch entries lack HH:MM timestamps + epistemic labels (memory skill wants both); unpushed set after this write = src/CHATLOG.md only (needs user PAT per standing rule — push blocked, logged). No src/ writes this session besides this entry; scratch reconcile note is private by design.
**Always read agents-augment.md first, every session.**

## 2026-11-18 — no-labels FINAL CHECK (user-ordered; ledger + spec re-verified this session, no compute)
- MUSH finding CONFIRMED from artifact (src/evidence/p2/run6-mush.json, read this session): N2 checksum [442,252,148,158] bit-exact (never trained — random init seed 9102, received NOTHING from anyone). SN train-agree 0.872; fresh deltas f500 0.5417 / recomb 0.5357 / f1000 0.5534 (≈2× E's +0.25); SHUF-N 0.000 all forms (obs==perm: collapsed to constant output — control perfect, mechanism understood); falsifier 7.614 vs 7.815 ns (nearest call in the program, flagged not buried); student marginals [434,279,112,175] reproduce N2's [446,249,154,151]. So yes: complete uniform noise (seed 9100) → unschooled tutor's spontaneous mush partition → students return the same mush at high fidelity. Transmission machinery is content-agnostic fidelity (filed interpretation, run-6 verdict stands).
- v0.8-v2 SPEC PASSES the no-labels check (spec read end-to-end this session): tutor next-token on raw pool lines only (≤800 steps, v0.6 trainMouth recipe); student next-token on tutor-WRITTEN lines only; binding constraint lines 1-6 + countersign clause line 69 (any soft/hard target = new version); thermometers frozen, grade-only, distill nothing; class lines generated-never-pooled so class/test overlap impossible by construction.
- FLAG 1 (spec hole, for countersign): "prefix-3" generation (line 14-16) does not state the prefix distribution. Uniform-random = clean (v0.4 A2 used uniform-3); pool-derived = leakage. Must be filed before/at countersign.
- FLAG 2 (scope, for countersign): student trains on tutor-generated lines = tutor-outputs-as-curriculum, explicitly legalized only for P2-style rounds (P2-run-7). v0.8 is P3 — countersign settles whether the legalization extends. Position filed: tutor outputs are NOT our labels (ancestral T=1.0, filed seeds, we never touch them), but the apparatus (pool construction p=0.35, splits, bars) is experimenter-designed — we choose the world, never the lesson.
- FLAG 3 (trivial): cost line cites scratch/p3-curr-*.json ledger paths — post-evacuation builds must pass src/evidence/p3/ paths (standing PATH RULE).
- Bottom line: "no labels from us" holds at the TRAINING SIGNAL for N2 (proven) and v0.8-v2 tutor+student (specced, pending countersign). It has never held, and does not hold, for the apparatus around them (pools, seeds, bars, thermometers) — that is our design, openly, and the countersign is what binds it.
**Always read agents-augment.md first, every session.**

## 2026-11-18 — past label-reruns check (user Q; verified against tree + log, no compute)
- Q: was there ever a test where we gave labels and had to rerun? Finding (Observed): NO. Every rerun/void in the record has a non-label cause, each filed at the time: v0.5 Stage B first attempt VOID → NaN cache bug (logits used as probs), rebuilt as Br-* (exhibit p3-twins-B.json + B-INTEGRITY-FAIL preserved in stage-b/); v0.4 A2 profiles-only → regen reseed-per-line bug, rebuilt with all lines persisted (A2r); ix probe → argmax diagnostic bug (value>index), poisoned weights deleted, probe retrained; x-ablation HALT → false-tripping switch (0.67 false-trip rate on true nulls), re-specified, no retraining; run-4 slot 2 → killA gate fail then retry-exhaustion, slot VOID per prereg rule; E single-shot HALT (0.595) → curriculum redesign → 0.965, openly.
- Label-giving was always either by design and filed (hinted curricula, distillation arms, aux supervision, run-7 legalization) or caught pre-compute (v0.8-v1 and committee-filter superseded uncountersigned — confirmed never ran: no curr-* ledger anywhere in src/evidence/p3/, spec only).
- One conditional rerun still owed (not labels-to-tutor, measurement slip): coffee-stain Amat/vsE_A used base-set predictions (variable-label slip, filed 2026-11-17) — rerun on fresh owed only if user asks. Nothing else outstanding.
- Forward: v0.8-v2's raw-lines-only clause is build-enforceable (driver asserts no soft/hard targets; any = new version per countersign text). Only pre-compute hole is FLAG 1 (prefix-3 distribution).
**Always read agents-augment.md first, every session.**

## 2026-11-18 — phases lookup (user Q, read-only)
- Q: most recent thing referencing phases + list them. A: gameplan v23 (COUNTERSIGNED FROZEN 2026-11-17, standing plan), phases P1–P6 (src/GAMEPLAN.md lines 246–601). Listed to user from the file; no new numbers, no compute.
**Always read agents-augment.md first, every session.**

## 2026-11-18 — gameplan folder reorganization (user-ordered; no substance change)
- Pre-move snapshot src/gameplan-snapshots/2026-11-18-pre-gameplan-folder.md (79682B, byte-identical to old src/GAMEPLAN.md). All 14 line-anchors verified pre-split; copies byte-verified post-write (snapshot==original, v04==original, drafts end with scratch originals).
- New: src/gameplan/GAMEPLAN.md (55244B: provenance header + Conventions + v23 section through Scoreboard, byte-verbatim, admin always-line carried) — THE file to follow. src/gameplan/README.md (map + follow rules + stale-path notes). src/gameplan/archive/: v22-frozen-2026-11-15.md (old lines 1–150: v22 + D1 + D2), v04-gameplan-archive.md, scratch-drafts/ (next-gameplan + borrow-gameplan-subplan, provenance headers).
- Deleted after verify: src/GAMEPLAN_ARCHIVE.md, scratch/next-gameplan.md, scratch/borrow-gameplan-subplan.md. src/GAMEPLAN.md is now a pointer stub (old references resolve).
- Live pointers updated (living docs): src/README.md (×2), agents-augment.md, src/meta/root-README.md, src/docs/TESTING_PROTOCOL.md, src/tools/d1a-smoke.js (Detour D1 → archive path). Frozen history untouched (CHATLOG, evidence, reviews, snapshots, fleet drivers — stub note covers the v*-fleet.js path expectation).
- Unpushed src set now: gameplan/* (new), gameplan-snapshots/* (new), GAMEPLAN.md (stub), README.md, agents-augment.md, root-README, TESTING_PROTOCOL, d1a-smoke.js, CHATLOG.md. Needs user PAT; push blocked, logged.
**Always read agents-augment.md first, every session.**

## 2026-11-18 — PUSHED 7443193 (gameplan-folder reorg; vault github PAT, user-ordered)
- Parent 7bd0acb confirmed live before write. Scope 1076 files (main.pjs + index.html + agents-augment.md + src/** + LICENSE/README root mappings); remote 1074 blobs. Delta: 7 changed (GAMEPLAN stub, README, augment, root-README→README.md map, TESTING_PROTOCOL, d1a-smoke header, CHATLOG) + 9 added (gameplan/* ×4+2 drafts+README, pre-folder snapshot, src/meta/* ×2 natural paths — first appearance in tree, 2 small files, benign dup of the root-mapped content) + 1 ordered deletion (GAMEPLAN_ARCHIVE.md, archived as v04).
- 565,541B uploaded (guard 5MB), secret-scan clean, tree via base_tree overlay (remote-only paths persist — no repeat of the 49136c2 scope bug), commit 7443193, ref PATCH 200, cache-busted re-read MATCH. PAT stayed in worker/page memory; summary-only return. One retry: first attempt hit a live-preview reload (state unknown) → page_refresh → clean run.
- Backlog drained: zero unpushed src/ files at 7443193 except this receipt (rides next push).
**Always read agents-augment.md first, every session.**

## 2026-11-18 — redo ledger Q (user Q; read-only, no compute)
- Q: are there things we need to redo? A from record (CURRENT_TASK + ledgers): NO open reruns. All past voids/reruns closed with filed cause (v0.5 NaN cache → Br-*; v0.4 reseed-per-line → A2r; ix argmax; x-ablation false-trip switch; run-4 slot-2 VOID; E single-shot → redesign 0.965). Label-giving always by design or caught pre-compute (v0.8-v1/committee-filter never ran).
- Sole owed item is CONDITIONAL: coffee-stain Amat fresh-rerun (variable-label slip, filed 2026-11-17) — only if user asks. Otherwise the only gate is forward, not a redo: v0.8-v2 UNCOUNTERSIGNED (3 countersign flags stand) — no compute until countersign.
**Always read agents-augment.md first, every session.**

## 2026-11-18 — tutor-label inventory Q (user Q; read-only, no compute)
- Q: anything run under current gameplan (v23) with training set + labels TO TUTORS? A: YES, exactly two tutor lineages, both by design + filed: (1) D1a spelled curriculum tutor src/evidence/d1a/tutor.json (SHA ce8b97cfd9507428b0d11a7bd0643507e4896ecd4b19edaf84a9e5c2619ad1b3, killA 0.965 PASS) — hinted shorts-first curriculum, serves as P2 E educated arm (run-1 subjects E vs N1/N2, run1-steps12.json); (2) P2-run-4 twin retrain src/evidence/p2/run4-twins.json (D1a smoke recipe short1500+full3000 hard+spelled-attn; slot3 0.965 PASS, slot2 0.275 VOID).
- All other v23 tutors/writers got noise/raw only at run time: P2 E/N/T3 solve noise-only (1000 vocab19, run-1/4 reads); N1/N2 random-init never trained (N2 [442,252,148,158], run6-mush.json); P3 writers/mouths raw next-token only (structured pools = unlabeled hidden pattern); sharpener masked-value self-supervised (no labels); (b)-pilot mouths raw; N-9601/blinds NOTHING. Students/ears got distillation soft-targets BY DESIGN (P2 terminology: demonstration only) — students, not tutors, out of scope. P6 hard-labels to tutor is future by definition, not run. No redo owed: educated-vs-never-educated IS the P2 control.
**Always read agents-augment.md first, every session.**

## 2026-11-18 — v24 DRAFT: P5 examiner checkpoints + P6 world-grounded (user-ordered taxonomy; UNCOUNTERSIGNED, no compute)
- User taxonomy: labels always tutor-origin; raw data never labelled by us (noise now, files/web later); curriculum tutor-written; tests tutor-written AND tutor-interpreted (self-feedback, non-binding, never verdicts); exams examiner-written/scored, possibly MULTIPLE mid-loop checkpoints feeding the tutor via the P4 interface plus a binding final; tutor NEVER gets hard labels — gets a question/topic + data pool and is expected to pass the exam.
- Snapshot src/gameplan-snapshots/2026-11-18-pre-v24-p5p6.md (55892B) taken before rewrite. Amended: P5 exam-authorship (checkpoint exams + final; only examiner scores enter the tutor, agreement-based); P6 header/label-origin/grounding/frozen-sources/continuity/curriculum-test language (question/topic + unlabeled data; grounding check replaces mapping; frozen sources; "sources work" continuity scope). Frozen v23 otherwise intact; file header marks v24 draft pending countersign.
- Next uncountersigned test: v0.8-v2 (src/evidence/p3/specs/p3-twins-v08-curriculum-draft.md: mouth tutor 9840-42 + mouth student 9850-52, thermometers N-9601/d1a, bars 0.20 nats + 0.15 gap, quorum 2/3) + 3 standing flags (prefix-3 distribution; tutor-outputs-as-curriculum scope P2-vs-P3; stale scratch ledger paths) + 3 new-taxonomy gaps (no question/topic filed; tests are held-out raw not tutor-written; thermometers are instruments not exams). Verdict: countersign as P3 pilot with exception, or revise to v0.8-v3.
**Always read agents-augment.md first, every session.**

## 2026-11-18 — memory skill slimmed to bootstrap+checklist (user-ordered; moved wording untouched)
- SKILL.md 402 lines -> ~3.3KB bootstrap (always-read, core 10 incl. transcript rule 4, 5-step session-end checklist). Moved text split mechanically into REFERENCE-layers.md (5883ch) / REFERENCE-rules.md (5471ch) / REFERENCE-reconcile.md (5033ch) / REFERENCE-problems.md (8123ch).
- Follow-up user orders: REFERENCE-layers.md + REFERENCE-rules.md always-read IN FULL every session; REFERENCE-reconcile.md read IN FULL + RUN after every compaction (always-read now 8 steps).
- Gap owned: layer-5 transcripts exist only for 2026-11-16; 11-17/18 sessions filed CHATLOG only (compliance failure, token-cost motive; no platform fault). 11-17/18 CHATLOG sections extracted (1017:255 lines/62403ch; 1272:118 lines/27301ch) to scratch/2026-11-17-chatlog.md + scratch/2026-11-18-chatlog.md and attached in chat at user request. Remedy: reconstruct marked-reconstructed, or leave gap marked and capture verbatim from here (user to call).
**Always read agents-augment.md first, every session.**

## 2026-11-18 — skill audit: research/rabbithole/fresh-eyes (user-ordered; holes fixed)
- research (215 lines, no logging section at all): Step 6 saved to docs/research/ (not shipped/pushed) -> src/evidence/research/ + LOCAL Filing subsection (report path + verdict to record + CHATLOG + session transcript); exit-criteria path fixed likewise. Upstream text otherwise untouched, marked LOCAL.
- rabbithole (506 lines, same disease as memory was): added read-by-map header (memory bootstrap+layers+rules IN FULL, this file IN FULL before waves, close files state+log+record+transcript+CHATLOG); fixed stale src/CURRENT_TASK.md default (authoritative record per handoff); handoff packet now state+log+record+transcript + CHATLOG line; Memory section rewritten (was stale "four layers" summary, now five layers + pointer to slimmed skill + reconcile steps). No split (wave loop is the procedure; U8 locality).
- fresh-eyes (356 lines): added read-by-map header; Logging now requires durable twins under src/evidence (was scratch/-only); verdicts to CHATLOG + record + session transcript; premise-artifact example path fixed. Left alone: memory/log.js src/CURRENT_TASK.md default (bench-wave tasks legitimately use src/; per-task record named by handoff, U2).
**Always read agents-augment.md first, every session.**

## 2026-11-18 — PUSHED f449f87 (v24 draft + skill audit + transcript; vault github PAT, user-ordered)
- Parent 7443193 confirmed live before write (tip-match guard held; abort-on-mismatch armed, not triggered). Scope: 12 files (CHATLOG, gameplan/GAMEPLAN.md v24 draft, pre-v24 snapshot, memory SKILL+4 REFERENCE, rabbithole/fresh-eyes/research SKILL.md, 2026-11-18 taxonomy transcript). No deletions.
- 505,441B uploaded (guard 5MB, max file 286919B), secret-scan clean, tree via base_tree overlay (remote-only paths persist), commit f449f87fce21ebe831f169b9385bafd594ceafda, ref PATCH 200 + refMatch true, cache-busted sentinel re-read MATCH (memory SKILL.md bootstrap header). PAT stayed in worker/page memory; summary-only return.
- Push debug (filed so next session skips it): three attempts failed net-fail@get-ref with Cache-Control: no-cache header set (non-safelisted -> preflight dies on api.github.com from worker/page origins); dummy-auth and no-auth probes without it returned 401/200, isolating the header. Retry without the header went clean. Rule: NO Cache-Control on GitHub API fetches; cache-bust with ?t= query only. Also re-proven: fine-grained PAT (github_pat_, 93ch) live as Maieutics-Learning (GET /user 200); vault channel hasKey true.
- Backlog drained: zero unpushed src/ files at f449f87 except this receipt (rides next push).
**Always read agents-augment.md first, every session.**

## 2026-11-18 — v0.8-v2 P3 PILOT PREREG (user countersigned 2026-11-18; filed pre-compute, binds the run)
- Spec: src/evidence/p3/specs/p3-twins-v08-curriculum-draft.md (v2, zero-distillation). Driver: src/evidence/p3/drivers/p3-curr-v08.js (new; trainMouth/pools/gen/grade ported from p3-twins-dual.js, stack src/tinynn/{nn,seeded,tasks,train,gseries}.js).
- Countersigned terms: 6 filed exceptions (uniform-3 prefix; tutor-outputs-as-curriculum extended P2->P3 pilot; ledgers src/evidence/p3/p3-curr-*.json; topic = "the easy/hard pool dialects as given"; examiner-held raw tests stand in for tutor-written tests this pilot; no examiner exam — claims vs bars); S2 = S1 student CONTINUED on class 2; fixed 800-step schedules, never test-conditioned stopping; integrity gate (100/100 unique generations + finite losses + recount, else ABORT).
- Filed CHOICEs (spec-ambiguous, adjudicated at verdict): DIALECT = thermometer-graded pairStats obs gap on written lines (grade tutor/stage-generated + student-generated + blind-generated lines with H; gap = obs(T,S) - obs(T,B) >= 0.15, N-9601 and d1a separately; the 9771 shared pool is unused under this reading — deviation noted); N-thermometer = frozen random pile init 9101 (N1's init seed; approximation, role is fixed-random reference); d1a = T.gseries.loadModel(src/evidence/d1a/tutor.json); train-sampling seeds TE 9890+p / S1 9893+p / TH 9896+p / S2 9899+p; stage-gen 9880+p*10+stageIdx (S1=1,S2=2); class-gen 9871+p/9872+p; blind-gen 9889+p.
- Agent expectation (numeric, scored at verdict): CLAIM 1 passes 2-3/3 pairs (structured dialect learnable; cf. E-mouth 3.26->2.23); Tutor-H gate HALTS 3/3 pairs (uniform-noise next-token cannot drop 0.20 below init ~2.94 — same wall as (b)-pilot v0.1 + sharpener); hence S2/CLAIM 2/W never reached; verdict = HALT-at-TH with S1 transmission measured. Overall claim FAILS-by-gate, not by W.
- Pre-mortem (strongest objection + most likely failure): the hard phase is learn-nothing by construction, so the headline (HALT at TH) is priced in before spend; most likely failure mode is a bug in the new driver (thermometer wiring, seed slip) masquerading as a result — guarded by stage validations + pair-0 read-before-continue.
- Nearest-failure: (b)-pilot v0.1 (uniform-noise mouth 3.21->2.94 = chance, 0/200, W-tripped) + sharpener v0.1 halt (void on uniform noise). Differs: gates here fire before spend instead of after, and the easy phase yields a genuine unmeasured result (next-token student on 100 tutor-written lines).
- Run plan: pair 0 full sequence first (S0->TE->S1->TH-gate->[S2 if pass]), read ledger, then pairs 1-2 same script. Resume-safe per-stage ledgers. No compute on any other spec version.
**Always read agents-augment.md first, every session.**

## 2026-11-18 — v0.8-v2 P3 PILOT VERDICT (countersigned run; 3/3 COMPLETE; bars miscalibrated — pilot finding is about the spec)
- Ledgers src/evidence/p3/p3-curr-p{0,1,2}.json + p3-curr-verdict.json. All integrity gates held (100/100 unique every generation, finite losses, 3/3 COMPLETE, no ABORTs).
- MEASURED: TE gates 3/3 PASS (tutor easy 2.66/2.62/2.61 — real structured learning from S0 3.18-3.37); CLAIM 1 0/3 FAIL (S1 easy 4.30/3.97/4.48 vs S0 ~3.2 — students OVERFIT the 100-line classes: 800 steps x batch 8 over 100 lines = 64 epochs, test loss explodes); TH gates 3/3 PASS (hard 3.02/2.99/3.00 — calibration drift toward chance 2.944, still above floor, no learning); CLAIM 2 3/3 PASS-VACUOUS (S2 hard 4.20/4.18/4.70 <= inflated S1 hard ~5 minus 0.20 — passes while terrible); dialect 1/12 (only p1-S2-N exactly 0.15; N gaps else 0.00/-0.01/-0.05/-0.09, E 0.13/0.09/0.01/-0.03/-0.09; agreeTB 0.65-0.74 — blinds share the bias, grader can't discriminate, same moral as v0.5/v0.7). W NOT TRIPPED (claim2 passed).
- Finding (Observed): the 0.20 bars are vacuous against uncalibrated inits (S0 3.18-3.37 sits ~0.3 nats above the chance floor, so calibration drift alone passes gates and exploded denominators pass claims). The curriculum is also too thin for the recipe (100 lines x 64 epochs -> overfit). The pilot measured the spec, not transmission: bars need a calibrated reference (vs chance floor or post-burn-in init), classes need thickness (more lines or fewer steps).
- Expectation scored (mine, from prereg): predicted CLAIM1 2-3/3 (got 0/3 — MISS, overfit unanticipated), TH HALT 3/3 (got 0/3 halts — MISS on mechanism, right on substance: no hard learning happened, the gate just couldn't see it), overall FAIL-by-gate (got COMPLETE-vacuous — MISS). Pre-mortem driver-bug worry: no bug found, machinery clean 3/3.
- Next: v0.8-v3 (calibrated bars + thicker classes/fewer steps + tutor-written test stages + examiner-held final + filed question/topic) needs a fresh countersign; no compute on it until signed.
**Always read agents-augment.md first, every session.**

## 2026-11-18 v3 PREREG+VERDICT
- Spec v3-consolidated countersigned, run 3/3 COMPLETE. TE 2.6287/2.636/2.6284 PASS. CLAIM1 2/3 (S1 2.996 FAIL p0, 2.9554/2.9419 PASS). TH 2.7579/2.7237/2.7771 PASS REAL (< chance 2.944). CLAIM2 3/3 (S2 3.1162/3.0435/3.1129). Dialect 0/12. W NOT TRIPPED. Ledgers p3-curr-v3-p0/1/2.json + verdict. Bundles p3-curr-v3-bundle-pair-c1/c2.json. Question filed in spec. Alpha 0.5. Integrity 100/100 uniq.
**Always read agents-augment.md first, every session.**

## 2026-11-18 v4 single-brain + student triple-test (user-ordered; UNCOUNTERSIGNED, no compute)
- User: stop separating ear/mouth; one brain per agent. Filed src/evidence/p3/specs/p3-twins-v08-curriculum-v4-draft.md (UNCOUNTERSIGNED): dual-head per agent (thinking part + next-token 19-way + bucket 4-way); tutor bucket output self-schooled on tutor's own next-token entropy quartiles (low/med/high/critical, tutor-made); student both outputs from tutor bundle only; trunks separate across agents (no joint smuggling); frozen N/d1a kept as outside witnesses for dialect verdicts.
- User: copy test before learning. Spec amended: student measured on BOTH locked tests at S0/S1/S2 (S0 baseline, S1 easy CLAIM + hard transfer descriptive, S2 hard CLAIM + easy retention descriptive).
- Recording: user asked are-we-recording + make it so. Status: working record scratch/CURRENT_TASK.md current; CHATLOG this entry + v3 entry same session; transcript src/evidence/conversations/2026-11-18-v3v4-singlebrain.md created (user turns verbatim, assistant gists marked); unpushed list in working record. Future sessions: session-end checklist (record + CHATLOG + transcript + unpushed list + push gate ~20 files/3 sessions) applies.
**Always read agents-augment.md first, every session.**

## 2026-11-18 talk-loop direction + transcript-gap fix (user-ordered)
- Direction (binding intent, NOT a countersign): user wants tutor<->student talk/communicate/learn = multi-round loop (student attempts -> tutor reads agreement/diagnosis -> adapts bundle -> re-teaches; formative tutor-written/interpreted, examiner checkpoints binding). v4 single-brain is last single-shot; loop needs P4-interface + P5-rounds mini-prereg, no compute until countersigned.
- Gap (owned): transcript 2026-11-18-v3v4-singlebrain.md missed first two turns (created mid-session, reconstructed from context). Backfilled marked; cause = no live capture + compaction summary. Fix enforced: stub at session start, append as we go, session-end five every session.
**Always read agents-augment.md first, every session.**

## 2026-11-18 Step 0 miss + start-gate (user-ordered)
- Miss (owned): status answer + workspace reads before Step 0 this session. User caught it ("did you look there?" -> no).
- Fix: agents-augment §1 start-gate (Step 0 BLOCKING, first calls = list src/tools + read index, miss logged same session) + memory SKILL session-start checklist. Step 0 done late this session: tools listed + index read; relevant = memory only.
**Always read agents-augment.md first, every session.**

## 2026-11-18 — transcript auto-fix miss + live repair (user: I thought we fixed this?)
- Miss owned: log.js transcript layer + SKILL turn routine installed 2026-11-18 but this post-compaction session opened with zero stub and zero per-turn appends — fix on paper, not in motion.
- Repair this session: new transcript stub src/evidence/conversations/2026-11-19-transcript-fix.md created first, user turn filed verbatim, assistant turns appended same-message going forward.
- Reconcile: handoff note wins over stale scratch/CURRENT_TASK.md (ends pre-v4.2); src/CURRENT_TASK.md retired pointer confirmed.
- Unpushed: 2026-11-19 transcript file only (1 file); push gate not tripped.

## 2026-11-18 — v4.2 COUNTERSIGNED + stepwise run authorized
- User countersigned v4.2 2026-11-19 ("signed, please proceed"). Spec: src/evidence/p3/specs/p3-twins-v08-curriculum-v42-draft.md (36 lines, glossary + single-brain + EAR-BAR + 3 nulls + provenance + seeds 9840-42/9850-52/9860-62, pools 9770/9771/9810, bars chance-calibrated).
- Authorized: stepwise countersign review completion + driver build + compute per spec (800-step fixed schedules, 3 pairs, integrity gate, quorum 2/3, W tripwire).
- Prior state: v3 consolidated 3/3 COMPLETE (TH real <2.944, CLAIM1 2/3, CLAIM2 3/3, dialect 0/12, W clean).

## 2026-11-18 — v4.2 pair-0 COMPLETE (countersigned run)
- Ledger src/evidence/p3/p3-curr-v42-p0.json + bundles c1/c2 (nUniq 100/100, integrity held).
- MEASURED: S0 tutor 3.2584/3.2401 stud 3.1796/3.2136; TE 2.6287 PASS (<2.744); ear probe PASS deg 0.0000 (head-only, trunk frozen — stability design held).
- S1 easy 2.9597 FAIL (delta PASS vs 2.9796 but chance floor <2.944 missed by 0.0157 — same p0-miss pattern as v3 2.996); S1 dialect N -0.10 FAIL / E 0.09 FAIL; ear obs 0.8501 Wilson [0.841,0.8587].
- TH hard 2.7579 HALT (misses <2.744 by 0.014); S2 hard 3.062 FAIL; retention +0.5496 (easy forgotten); dialect N 0.00 / E -0.03 FAIL; ear 0.7467 below 0.80.
- Null-shuffled ear 0.1825 (teeth held at eval level). W not tripped (gates mixed). Pairs 1-2 pending.

## 2026-11-18 — pre-countersign for two agent experiments (user-ordered)
- User pre-countersigned two agent-designed experiments (no per-experiment user countersign needed; agent approval + full prereg/verdict docs required, same thoroughness as joint experiments).
- Each gets: What do I want to find out (prereg) + What did we learn (verdict), spec file, ledger, CHATLOG lines.
- Frozen work runs first: v4.2 pairs 1-2 (countersigned 2026-11-19). Agent experiments reuse filed bundles where possible (cheap student-only retrains).

## 2026-11-18 — v4.2 pair-1 COMPLETE (countersigned run)
- Ledger src/evidence/p3/p3-curr-v42-p1.json + bundles c1/c2 (nUniq 100/100).
- MEASURED: S0 tutor 3.2556/3.2555 stud 3.3535/3.317; TE 2.636 PASS; ear probe PASS deg 0.
- S1 easy 2.9199 CLAIM1 PASS (<2.944 + delta); dialect N 0.03 / E -0.03 FAIL; ear 0.8559 Wilson [0.8469,0.8644].
- TH hard 2.7237 PASS (<2.744 — passes where pair-0 2.7579 hairline-HALTED); S2 hard 3.0046 CLAIM2 FAIL (floor); retention +0.6097; dialect N -0.01 / E 0.04 FAIL; ear 0.7228.
- Null-shuffled 0.2518 (teeth held). 60-min worker timeout hit during pair-2 — pair-2 reruns alone next.

## 2026-11-18 — v4.2 frozen VERDICT 3/3 + two agent preregs (pre-countersigned)
- Verdict src/evidence/p3/p3-curr-v42-verdict.json: CLAIM1 2/3 (p0 2.9597 floor-miss 0.0157), TH 1/3 (p1 2.7237 PASS; p0/p2 HALT 0.014/0.033 over), CLAIM2 0/3, dialect 0/12, ear probes 3/3 PASS deg 0, retention +0.55/+0.61/+0.62.
- ExpA prereg src/evidence/p3/specs/p3-curr-v42-expA-prereg.md: What do I want to find out = overfit? (800x8/100 = 64 epochs); lever student steps 800->200 same bundles/inits; bars: S1/S2 vs frozen + ear.
- ExpB prereg src/evidence/p3/specs/p3-curr-v42-expB-prereg.md: What do I want to find out = forgetting? (retention +0.6, ear slide); lever S2 50/50 replay mix; bars: retention toward 0, S2-hard, ear hold.
- Both agent-approved under 2026-11-19 user pre-countersign; bundle-only provenance; student-only (cheap).

## 2026-11-18 — expA VERDICT: recipe was the wall (What did we learn)
- Ledgers src/evidence/p3/p3-curr-v42-expA-p{0,1,2}.json, 3/3 COMPLETE. Same bundles/inits as frozen, only student steps 800->200.
- MEASURED: S1-easy 2.6461/2.667/2.6335 (frozen 2.9597/2.9199/2.8996, deltas -0.31/-0.25/-0.27); S1-hard 3.3625/3.374/3.3187 (frozen 3.6587/3.7455/3.6881).
- S2-hard 2.7861/2.7736/2.7758 (frozen 3.062/3.0046/3.0339) — BELOW chance floor 2.944, real hard learning. CLAIM1 3/3, CLAIM2 3/3 at 200 steps (frozen 2/3, 0/3).
- Retention +0.4526/+0.4566/+0.4216 (frozen +0.55/+0.61/+0.62) — better but still forgets. Ear s1_vs_c1 0.82-0.87, s2_vs_c1 slides to 0.58-0.73 — ear forgets too.
- What did we learn: overfit confirmed — 64 epochs exploded the test; 16 epochs transmit and generalize. Remaining wall = forgetting (ExpB question).

## 2026-11-18 — expB VERDICT: forgetting is sequencing (What did we learn)
- Ledgers src/evidence/p3/p3-curr-v42-expB-p{0,1,2}.json, 3/3 COMPLETE. S1 frozen-style 800 (identical: 2.9597/2.9199/2.8996); S2 50/50 replay c1+c2, 800 steps.
- MEASURED: retention +0.055/+0.0869/+0.0729 (frozen +0.55/+0.61/+0.62) — forgetting eliminated. S2-hard 3.0359/2.9839/3.0321 (frozen 3.062/3.0046/3.0339) — no hard cost, still above floor (800-step overfit retained, as expected).
- Ear s2_vs_c1 0.8238/0.8045/0.8022 (expA no-replay 0.7261/0.6263/0.5794) — replay holds the tutor's class-1 marks.
- What did we learn: forgetting is a sequencing artifact, not capacity. Prescription: 200-step + replay combined = claims + retention + ear (third run, needs approval — pre-countersign covered two).

## 2026-11-18 — PUSHED 01d2f57 (v4.2 frozen + expA/expB + transcript; vault github PAT, user-ordered)
- Parent b59a2ea confirmed live before write (tip-match guard held). 23 files, 9186241B, secret-scan clean (one github_pat_ descriptive prefix in CHATLOG, no live token), tree via base_tree overlay, ref PATCH 200 x3 + cache-busted re-read refMatch true.
- Commits: 1a134e2 (17 small: transcript, CHATLOG, 3 drivers, 3 frozen ledgers, verdict, 2 preregs, 6 exp ledgers) + 070b013 (bundles 0c1/0c2/1c1) + 01d2f57 (bundles 1c2/2c1/2c2). PAT stayed in worker/page memory; summary-only return.
- Backlog drained: zero unpushed src/ files at 01d2f57 except this receipt (rides next push).

## 2026-11-18 — v4.3 package COUNTERSIGNED (user: Signed!)
- User countersigned the combined package: (1) combined 200-step + replay student recipe, (2) full-retrain nulls at 200 steps (blind-tutor, shuffled-ear, synthetic recipe-null).
- New spec version v4.3 (recipe change = new version). Tutor/bundles frozen-reused from v4.2 (tutor side untouched). Student inits same seeds for comparability; all choices filed in spec.

## 2026-11-18 — v43 pair-0 VERDICT: mouth passes, ear void (What did we learn)
- Ledger src/evidence/p3/p3-curr-v43-p0.json COMPLETE. Combined: S1 2.6461 PASS, S2-hard 2.8097 PASS (<2.944, delta), retention +0.0979 (replay holds at 200 steps), dialect N -0.10/-0.06 E 0.02/-0.05 FAIL.
- Nulls: blind FAIL/FAIL (teeth held), synthetic 3.0726 CLEAN (delta 0.11 < 0.20, teeth held), shuffled FIRED per spec rule (earReal 0.788, gap 0.035 < 0.10 -> EAR-BAR void).
- Mechanism (Observed): filed tEar marginal = [21,640,2492,2]/3155, majority 0.7899 — fixed thresholds put 79% in one bucket. Real ear 0.8235 (+0.033 over marginal); shuffled ear learns the marginal (0.788). The absolute 0.80 bar is vacuous under degenerate buckets; the gap rule caught it as designed.
- What did we learn: mouth channel transmits (claims pass, nulls hold); ear channel needs adaptive quartile buckets (v4.4 spec change, not a rerun). Pairs 1-2 pending for quorum.

## 2026-11-18 — v43 VERDICT 3/3: mouth passes, ear void (What did we learn)
- Verdict src/evidence/p3/p3-curr-v43-verdict.json + ledgers v43-p0/1/2. Combined (200-step + replay): CLAIM1 3/3 (2.634-2.667), CLAIM2 3/3 (2.810-2.840, all <2.944 + delta), retention +0.08-0.12, ear S1 0.82-0.87 S2 0.65-0.76, earC1 0.81-0.84, dialect 0/12.
- Nulls: blind FAIL/FAIL 3/3 (held), synthetic 3.07-3.11 CLEAN 3/3 (held), shuffled FIRED 3/3 (0.78/0.78/0.87 vs real 0.82/0.86/0.87; gap < 0.10 -> EAR-BAR void per spec).
- What did we learn: the combined recipe transmits (mouth, with holding nulls) and retains (replay); the ear metric is degenerate under fixed thresholds (marginal 0.79) — v4.4 needs adaptive quartile buckets. W not tripped.

## 2026-11-19 — PUSHED e92777a (v4.3 verdict + ear-void; user-ordered) + v4.4 DRAFT (uncountersigned)
- Parent 01d2f57 confirmed live; 8 files, 337316B, secret-scan clean (descriptive prefix only), tree via base_tree overlay, commit e92777a, ref PATCH 200 + cache-busted re-read refMatch true. PAT in worker/page memory.
- Backlog drained except this receipt.
- v4.4 DRAFT filed (UNCOUNTERSIGNED, no compute): adaptive quartile buckets (per-pair q25/q50/q75 from tutor's own entropy, filed), tutor ear retrain + new bundles (mouth untouched, lines reused), student combined rerun, nulls rerun. Tests whether the ear carries signal under a fair ruler.

## 2026-11-19 — v4.4 COUNTERSIGNED (user: point 4 countersign)
- Spec src/evidence/p3/specs/p3-twins-v08-curriculum-v44-draft.md marked COUNTERSIGNED 2026-11-19.
- Authorized: tutor mouth retrain (determinism check vs filed v4.2 TE/TH, ABORT on drift), quartile cuts from tutor entropy (filed), ear retrain head-only + probe, new v44 bundles (v4.2 lines reused, tEar recomputed), student combined rerun, nulls rerun.

## 2026-11-19 — v44 pair-0: fair ruler works, ear is weak (What did we learn so far)
- Ledger v44-p0 COMPLETE. Determinism match (retrain TE 2.6287/TH 2.7579 = filed). Bands [1563,1565,1564,1563], marginal 0.2502. Probe PASS deg 0.
- Mouth: S1 2.6524 PASS, S1hard 3.2933, S2 2.8197 PASS, retention +0.1048, dialect N -0.08/-0.05 E -0.02/-0.13 FAIL.
- Ear: real 0.4571 Wilson [0.4397,0.4745] (+0.21 over marginal); shuffled 0.3623; gap 0.095 < 0.10 -> BROKEN by 0.005. Synthetic ear 0.19, blind FAIL/FAIL held.
- What this says: the ruler discriminates now (0.46 vs 0.36, both far from 0.80); the channel is weak, not zero. 0.80 unreachable for a linear head on a frozen trunk. Pairs 1-2 pending.

## 2026-11-19 — v44 VERDICT 3/3: ear weak-not-zero (What did we learn)
- Verdict p3-curr-v44-verdict.json + ledgers v44-p0/1/2 + 6 v44 bundles. Determinism 3/3 match. Bands balanced (marginal 0.25).
- Mouth: CLAIM1 3/3 (2.626-2.709), CLAIM2 3/3 (2.820-2.842 <2.944 + delta), retention +0.08-0.12, dialect 0/12.
- Ear: real 0.441-0.544 (+0.19-0.29 over marginal); shuffled 0.329-0.395; gap rule HELD p1 (0.112) + p2 (0.149), p0 0.095 BROKEN by 0.005. Absolute 0.80 unreachable all pairs.
- Nulls: blind FAIL/FAIL 3/3 held; synthetic CLEAN 3/3 held.
- What did we learn: fair ruler discriminates (real vs shuffled separated 2/3, near-miss 1/3); the channel is weak-not-zero. The ear question is answered as far as a linear head can answer it: +0.2 over chance, replicable. Next fork: accept ear as auxiliary (mouth is the channel) or train the ear jointly (v4.5, spec change).
