# Gameplan v22 (2026-11-15, COUNTERSIGNED FROZEN) — phased, paper-first (r1: 8; r2: 9; r3 steelman 6/6; r4 debate 2 ACCEPTs; r5 stats overhaul; r6 milestones; + 1.d.iii dump prereg; + selection-pressure; + 1.d vii/viii doubt-readout pilots; + 1.d.ix meta-probe PILOT-FAIL + why-diagnostics + x-ablation COMFORTABLE)

Replaces v6's horizon sketch with numbered phases. Standing context (unchanged): transmission
+ chaining measured but mechanism, independence, and generality open; two reviews agree —
no scale-up until compact mechanism studies land; nursery parked behind a re-entry bar.
Notation: Phase → lettered steps → roman sub-steps (e.g. Phase 2.c.ii). Far-future items
may be TBD — that is intentional.

## What stands (not re-litigated without new data)

Transmission 6/10 (D-rate), chaining 35/40 G1→G5, F-singlegen O2 (schedule, not generations),
fair-slot + S-lesion + null-global controls, failure signatures, ignition-tracking transfer
battery. Threshold bar robust (±0.10 → 35→32/36; bimodal ledger distribution).

## Conventions
- Statistics: 95% Wilson intervals everywhere; thresholds are preregistered, not tuned.
- Statistics (r5 — equivalence, not overlap): no "X within CI of Y" eyeballing. Arm contrasts use Fisher exact (difference) + 95% Wilson CI for the DIFFERENCE in rates with preregistered margin δ (default δ=0.25 absolute; tightened in the prereg where the null is near-deterministic). Zones: EQUIVALENT if the difference-CI lies inside [-δ,δ]; SUPERIOR if it excludes 0 in the predicted direction; else INCONCLUSIVE (never "no effect"). Thresholds (≥4/8, 5/8) test against MEASURED nulls by exact binomial, not a 0.5 coin: 4/8 excludes null rates ≤0.10 (p≈0.005; hint-free wall is 0/32); 5/8 excludes null rates ≤0.25 (p≈0.027). At n=8 only 8/8 could exclude 0.5, so rate-vs-coin is the wrong test — the design contrasts extremes (ignition vs wall), where 8/8 vs ≤4/8 differs at p<0.05 Fisher exact. Pilots never count: confirmation = fresh seeds + frozen protocol.
- Budgets: Phase 1 <2 h wall, 2.b.0 <1 h wall (round-2 caps against bloat).
- Doubt instruments (standing, all phases — metacognition that lives in process, not heads): every prereg carries three required sections — agent expectation (numeric, filed pre-run, scored in the verdict: the author's track record), pre-mortem (strongest objection + most likely failure reason, scored post-hoc), nearest-failure citation (which past mistake this design could repeat and why it doesn't). Architecture/process changes (new heads, losses, channels, gates, template changes) allowed only as mini-preregs with comparative bars against the best dial-fiddle (new dial beats best fiddle by preregistered margin or it's sprawl — refused); sunset review at each phase exit (gates/checks firing clean 3× running get downgraded/retired; ABANDONED verdicts for methods, same as TBDs). Declarations (gap spec + nursery-bound) carry "what would prove this wrong" (one line, pre-hoc, scored at verification).
- Selection pressure (standing, replaces drive — learned 2026-11-14 from geometry/Track C): scarcity + selector with teeth, not hunger. Fixed wave-budget per round (allocate, don't spawn unbounded — bids required); branch bids carry falsifiable promise + kill condition; teeth-streak escalator (N straight teeth rounds auto-forces a sunset proposal — proposing a whole kill is licensed science here, never disobedience); world selector (fitness = novel-family transfer on rival-generated tasks, never own exams); breed the allocator (score branch-value predictors on calibration, not waves).
- Version-bound approval (borrow 2026-11-16, countersigned): an approval (countersign, gate pass, design freeze) binds to the exact evidence/plan version reviewed (version tag + date; fingerprint where cheap). A new version re-opens approval — no inherited approvals, no grandfathering. A decision record carries `{version, fingerprint, decision}`; applying a vX approval to vY without a re-verify flag is a process violation, caught at filing time.

## Phase 1 — Mechanism settlement (cheap; ≈35 s per 3k-step seed, full Phase 1 under an hour)

- **1.f Statistical setup** (runs FIRST — before any 1.a arm; numbering frozen to preserve the adjudication trail): power + equivalence prereg for the whole phase — detectable effects at n=8 per claim, margins δ per verdict, measured-null justifications for 4/8 and 5/8, difference-based test choices (Fisher exact + Wilson difference-CI). No arm runs until this is frozen.

- **1.a Fading causality** (review #2 Q1: soft targets run constant, only hints fade)
  - i. Attn-hint-only student arm (softW=0), 8 seeds, same tutor/pool.
  - ii. Constant-combined arm (attnKeep=1.0 all 3k steps), 8 seeds.
    Five-way table (review #2 Q1 + rounds 1, 4): soft-only = D1 cold (0/9 ✗, done) / hard-only = H-wall (0/32 ✗, done) / attn-only (i) NEW / constant-combined (ii) NEW / staged ✓ (reference) / instant-drop (iv) NEW (r4).
  - iii. Verdict (difference-based, δ from 1.f): attn-only ≥4/8 igniting rewrites fading as non-essential (exact binomial vs wall-null); attn-only *failing* reads as "hints insufficient alone," not "fading essential"; constant-combined EQUIVALENT to staged (difference-CI inside ±δ) means the schedule isn't doing work; SUPERIOR staged means it is; else INCONCLUSIVE.
  - iv. Delayed-onset instant-drop arm (NEW r4): full hints steps 0–1500, zero after; 8 seeds, same tutor/pool (≈5 min). Verdict (difference-based, δ from 1.f): staged EQUIVALENT to instant-drop → graduality inert, the final hint-free state does the work; staged SUPERIOR → the gradual process itself is causal; else INCONCLUSIVE.
- **1.b Position arbitrariness** (Q2: killAExam + killMatrix both target-first)
  - i. Slot-swept kill eval, eval-only on saved G-winners (~free).
  - ii. Fresh-seed confirmation, only if i shows sensitivity.
  - iii. Verdict (three conditions, δ from 1.f): ρ ≥ 0.95 AND mean |Δacc| ≤ δ_pos AND worst-position acc within δ_worst of best (no position with a meaningful failure rate) → position-independent, kills stand; else → replace with the position-swept variant. Correlation alone never passes (r5).
- **1.c Cross-family probe** (Q5; parity in-house, preregistered)
  - i. Parity exam suite + task-native conjunctive bar (long-length acc + flip-one-bit
    consistency), prereg spec.
  - ii. Pilot n=4 (hinted regime → wall → transmission): feasibility only, exploratory.
  - iii. Full n=8 on FRESH seeds (disjoint from pilot) under frozen prereg protocol + verdict, only where the pilot shows feasibility; pilot seeds never enter confirmatory counts (r5). Bar: ≥5/8 excludes null ignition rates ≤0.25 (exact binomial p≈0.027; hint-free null 0/32) — a screening bar against measured nulls, not a coin test.
- **1.d Implementation trust** (Q7)
  - i. PyTorch re-run of one igniter trajectory.
  - ii. Same for one memorize-lean trajectory.
  - iii. Dump mode (prereg phase-1diii, countersign to freeze): per-line instrumented forward on replication-gated retrained winners — logits→confidence (top-1/margin/entropy), cited-slot pointer (argmax final depth attention) vs supervision-target hit. Pointer-validity kill rule (ptrHit|correct on killA ≥ 0.90 or the defense claim dies), calibration igniter-vs-error separation, mandatory overconfidence disclosure (mean top-1 on errors). Feeds iv + L0/L1.
  - iv. Verdict: cross-check passes, or a backprop audit opens — dump-gated: pointer defense admissible only if iii rule passes; disclosure printed regardless.
  - v. Energy-score re-dump (cheap, retrospective, no new training): re-dump filed winners with full logits filed; test whether energy (−logsumexp, same logits read as total activation) separates killHd-errors from killA-correct better than top-1. Rules out the free weirdness-meter before buying the expensive one. Feeds F-new.
  - vi. Ensemble-disagreement driver (retrains via the proven 1.b recipe, no new design): all 8 winners on killHd; disagreement-among-plausible-models as doubt — tests whether committee-split predicts errors better than single-model loudness. Feeds F-new + L0/L1.
  - vii. Last-layer Laplace pilot (LEAD-1 armed spec, eval-only, no new training): Gaussian posterior on readout head only (4×48+4=196 params, backbone frozen at filed MAPs); GGN Hessian; prior precision λ gridded on non-filed lines only; linearized predictive (seeded K=10 MC fallback, determinism preserved). Staged s313-pilot-first (bar: s313 doubt-AUC ≥ 0.85 AND killA==1.00 — beats loudness-0.737 and energy-0.8306 on s313 with margin; U-err's 1.0→0.43 collapse is the explicit guardrail), full 8 only if pilot passes (bar: pooled AUC beats loudness 0.9293 by preregistered margin or sprawl — refused). Feeds F-new + L0/L1. Post-mortem OWED if any bar missed — pre-registered candidates, scored against measured numbers never narrated: (a) memorize-lean MAP so local Gaussian re-describes a bad peak (check s313-vs-rest split); (b) uncertainty lives upstream in attention/keys, head-only posterior blind to it (check GGN eigenspectrum — flat directions where it matters); (c) 196-param head + 146-error AUC + ceiling effects vs papers' overparameterized heads + ECE/NLL on held-out sets (Daxberger et al 2021 lineage: last-layer Laplace wins there on calibration of big-head models, ours has no head left to be uncertain with); (d) cold-posterior regime — true posterior underfits, tempering unjustified here. The post-mortem answers why it works in the papers and not with us, with numbers or it doesn't answer.
  - viii. Message-swap causality probe (LEAD-3 armed spec, eval-only driver on 1.b-recipe retrains): swap values v1↔v2 keys-fixed, measure Δ accuracy + logit shift on queried key; convict (memorize-lean) = output sticks to trained value despite swap, exonerate (true lookup) = output follows swapped value. Controls: novelty pairs, position shuffle, OOD null-swap. Staged construction-validation on 1 subject first (null-swap must behave or the exam dies before the 8). Bar: preregistered Δ threshold; ΔAUC<0.05 bounds iv to decorative-readout (verdict, not failure), high Δ promotes iv to causal. Feeds 1.e.iv + L0/L1. No run until mini-prereg countersigned.
   - ix. Meta-probe legibility pilot CLOSED 2026-11-15 (prereg v1.5; verdicts in phase-1dix-verdicts.md): PILOT-FAIL — pooled held-out probe AUC 0.4936 (bar 0.60), win-rate 0/8 (bar 5/8); loudness 0.8598 travels, weights-as-data don't. Determinism bit-exact, variance 138 PASS, 5001 dropped per guardrail (killA 0.995). No full-96. W1+W3 why-diagnostics filed (frozen verdict untouched): seen-brain novel-line readout 0.76 (machinery works; wall is cross-init transfer), deltas 0.46 (init noise ruled out as mask). Per-brain AUCs bimodal-ish (mirror-basin hint, untested). Feeds 1.e methods (negative legibility result) + F-new. Driver argmax typo found/fixed mid-run (poisoned probe weights deleted, retrained clean); vii verdict code verified unaffected.
   - x. Lines-only ablation (quarantined diagnostic, zero kill power over frozen ix verdict): v0.10 COMFORTABLE after 10 fresh-eyes batteries (~64 reviewer calls; B1 barrage → B2 staff audit → B3 blind → B4 format-10 debate → B5 re-barrage → B6 → B7 → B8 → B9 → B10 comfort round; every BREAK adopted, rejected-with-reason, or reviewer-error-logged). Design: same frozen probe recipe, masked inputs — (A) lines-only + cross-fitted multi-split A0 + VOID-gate + kill-switch + integrity nulls; (B) weights-only raw+centered split. Four SE-banded worlds + VOID. Run-ready on user go; afternoon cost, zero new brains.
   - xi. Slice probe / hierarchical watchers (queued): per-layer/head micro-probes + tiny top-net over slice doubt-scores; locates WHERE transfer dies (any live slice = compass heading). Needs diagnostic plan before compute (~4h probe, zero new brains). Quarantined.
   - xii. Basin alignment / W4 (queued): Re-Basin-style align test brains into train basins, then probe; tests the mirror-basin hypothesis behind bimodal per-brain AUCs. Needs mini-design first. Quarantined.
   - xiii. Trajectory→fate / baby-photos (queued): early checkpoints predict final fate (init→fate grown up); early-only discipline (late = trivial), loss-curve-extrapolation as cheap rival. Needs mini-prereg + new brain trainings with checkpoint saves. New claim, new rules.
   - xiv. W2 capacity (parked, low priority): longer/wider same-15-brain probe to force train ~1.00. Deprioritized — W1 already split the ambiguity (machinery works; transfer is the wall). Run only if lines-ablation world 2 reopens capacity questions.
- **1.e Paper inputs**
  - i. Threshold-sensitivity paragraph (numbers ready).
  - ii. Fold 1.a–1.d verdicts as they land.
  - iii. Overconfidence paragraph (mean top-1 on errors, killA/killHd, per-subject + pooled — the honest number, whatever it is; adds Laplace line on vii outcome: pilot/full AUCs vs loudness + guardrail status, pass or fail).
  - iv. Pointer-methods paragraph (cited-slot readout definition + validity rule outcome: admitted with bounds, or abandoned on the record; adds wTarget-negative: alone AUC 0.536, conjunction precision ~3%, contributes no doubt signal + swap causality verdict from viii: causal vs decorative).
- Exit: Q1/Q2/Q4 answered in text, Q5 has its first datum. Kill rules: hints-alone
  igniting rewrites (not defends) the fading claim; slot-sensitivity replaces the kills.

## Phase 2 — Confirmation + hardening (weeks; the expensive item lives here)

- **2.a One-command rerun** (both reviews; doubles as re-ledger vehicle)
  - i. Config format (`experiments/configs/*.json`: task, seeds, schedule, exams).
  - ii. Headless runner (`node`, imports tinynn directly, machine-readable JSON, no clicks).
  - iii. Ledger byte-compare with PASS/FAIL per claim (exact on same engine; documented tolerance fallback for cross-engine ulp drift so CI cannot deadlock), owned by CI (GitHub Actions runs it; local pre-commit hook mirrors it). Overrides only via a logged ledger-or-cut verdict — the gate fails closed, the override is a verdict, not a bypass.
  - iv. Re-ledger-or-cut: old-arch claims without ledgers rerun through it or leave
    the paper (review #2's rule).
  - v. Forensics signoff gate (borrow 2026-11-16, countersigned): every ledger-producing run passes the forensics kernel (`src/tools/forensics.js`) before its verdict is filed — registered checks run on run fingerprint + ledger rows; any kill-check failure => verdict KILL, gate fails closed. Overriding KILL is a logged verdict (decision `OVERRIDE` + who/why note in the filed signoff record), never a bypass; a `PASS` signoff over a `KILL` evaluation is refused by the kernel. Zero-UI, caller-owned persistence, ships its own self-test.
- **2.b.0 Shuffle-seed pre-gate** (cheap; MANDATORY BLOCKING — zero Phase-2 spend until it passes):
  - cross-lineage G2 (different-seed G1 winner as tutor) + G1→G2 rate over N=10 seeds;
  - tutor-swap control (NEW round 2): low- vs high-performing G1 winners as tutors — tests teacher-variance prospectively.
- **2.b Second independent chain** (Q3; gated on Phase 1 AND 2.b.0 — no payment if the mechanism
  dies cheaply)
  - i. Distinct T0 (different seed/lineage), same protocol, full G1→G5.
  - ii. Chain-survival + tutor-quality analysis.
  - iii. Verdict on dependence (difference-based, δ from 1.f): G1→G5 survival rate (gens ignited / 5) reported per chain; second chain EQUIVALENT to first (difference-CI inside ±δ) = compounding; collapse = single-chain luck; else INCONCLUSIVE. Gap analysis (NEW round 2): G2-transmission vs G5-survival compared explicitly — high G2 + rotted G5 = late-chain decay, distinct from transmission failure.
- **2.c Wider cross-family battery** (review #2's list)
  - i. Sorting + finite-state-transition tasks through the same suite.
  - ii. Side-by-side comparison table, matched compute, identical ledger format.
  - iii. Verdict (numeric): ≥5/8 = generalizes; ≤2/8 = lookup-local; in between = mixed. Failure frame (NEW round 2): B-fails/A-replicates = task-specific; both fail = mechanism collapse.
- **2.d Engineering track** (§7, parallelizable with 2.a–2.c; Perchance constrains the
  artifact, never the source — tinynn is zero-dep, no DOM, already Node-portable)
  - i. Source split: `paper/manuscript.md` (+ refs/figures) and `lab/` sources; build step
    inlines them into the shipped index.html. Paper independently maintainable.
  - ii. `tests/` under `node --test` (gradients, seeds, serialization, losses, eval-set
    integrity, init, hint withdrawal, stability, shortcut regressions) + CI on GitHub.
    In-page self-tests stay as smoke; Node is the gate.
  - iii. Headless runner as the scientific path (merged with 2.a.ii); keyed pool arms stay
    browser-side where the vault lives.
  - iv. Dockerfile allowlist (runtime subset only; evidence/logs/notes stay out of the image).
  - v. Run identity (borrow 2026-11-16, countersigned): every run logs `runId` (date-tag + session counter) and a fingerprint (input-hash + code-version of the driver) in its first ledger lines and in the CHATLOG entry. Late/stale outputs from a superseded run are discarded, never merged into the live verdict. Quiet mode explicitly NOT adopted (unmotivated).
- **2.e Paper v0.15 → venue**
  - i. Fold Phase 1 + Phase 2 verdicts.
  - ii. Venue decision (TMLR / ICLR / NeurIPS shortlist per review #2).
  - iii. Submit.
  - iv. Submit gate (NEW r4): no submission with the 1.d cross-check open or any ledger under unlogged override — v0.15's reproducibility is a gated outcome verified by CI, not a date.
- Exit: generality decided by data; a stranger reproduces every headline without a browser;
  paper submitted.

## Phase 3 — The fork (late; details TBD by design)

- **3.a Decision gate**
  - i. Check the re-entry bar (numeric): Q1/Q2 answered in text AND ≥5/8 ignitions on one cross-family task with the same schedule.
  - ii. Bar met → 3.b. Bar not met → the gate emits new TBDs, which feed back into
    Phase-1/2-style batteries. There is always a next experiment while TBDs remain.
- **3.b Nursery re-entry** (only if the bar is met; design TBD pending Phase 1–2 findings)
  - i. TBD: smallest nursery pilot — one topic, fixed published bars.
  - ii. TBD: further phases drafted only after i reports.
  - iii. Allocator pilot (selection without hunger — first use of the Conventions pressure block): one round, fixed wave-budget, branches bid with kill conditions; teeth-streak forces sunset proposal; fitness is world-verified transfer. Scores the predictor, not the wave.
  - 0. Nursery communication standing constraints (design law for re-entry; no spend until the bar is met):
    - Planes per interface (cheapest sufficient channel, never one global floor): vectors tutor→student (native signals only — no prose training signal); schemas→checkers (machine-checkable trace cards in rival notation, never English essays); code+schemas→future self (methods repo accumulates; generations disposable); English→outsiders only (consults schema-caged, humans sources never graders; diploma prose once, at the end).
    - No English interlingua between lines: cross-dialect mapping is native↔native, judged by post-mapping behavioral logic (message-swap Δ accuracy), never paraphrase similarity — routing through pretrained priors would launder dialect errors into fluent agreement.
    - Translation-price ladder (price reported, never minimized): L0 same-line/near-seed (sanity, mapping ≈ identity; failures are bugs); L1 same-topic distant-line (shared grounding — topsim/RSA computable against key→value referents); L2 cross-topic (methods only, judge post-mapping logic alone — price never convicts); L3 rival family + disjoint notation, rival-generated tasks (graduation, verdict-level only — margins absorb codec drift as δ absorbed ulp drift). Record per pair: translator description length, samples-to-fit, pre/post-mapping Δ, trace compositionality.
    - Anti-Goodhart / anti-collusion: minimizing translation price selects for identical dialects (the private language through the back door) — inter-line divergence is health, convergence is suspicion, logic post-translation decides either way.
    - Compositionality required of traces (divergence locus + bridge operators, translatable rule-by-rule); holistic whole-trace mimicry penalized via contrastive gating (phrasebook codes don't scale — W23: compositional 0.329 vs holistic −0.119).
    - Ratchet: default-minimal channel per interface, escalate on suspicion, failure, or stakes — minimal by default, never by guarantee.
    - Executable now: L0/L1 on filed winners once per-line dumps exist (1.d trust track) — topsim over the hint channel, message-swap Δ, cross-seed divergence.
- Standing rule: closure is not a phase and never scheduled. It arrives only when no TBDs
remain — until then, an unmet bar produces the next battery, not an ending.
- TBDs retire as ANSWERED or ABANDONED (documented cost-vs-value reason; user can reopen — abandonment is visible, never silent). Milestones (r6): report + return control at every phase exit (4-line: where / learned / next / needs-eyes); resume on user go. The programme stays open; execution comes home.

## Detour D1 — Spelled-keys compositional binding (DRAFT 2026-11-17, UNCOUNTERSIGNED detour — v22 frozen standing untouched; version-bound approval: this detour binds nothing until countersigned as v23)

- **Status v1.1 (2026-11-17, after R1 6x — 8 accepts, systematic D1/run02 conflation logged as reviewer error): ZERO brains run under D1.** Run-02 numbers (rho 0.5275, p 0.0688, medComp 0.8875, pooled 0.8217, seeds 5101-5114) are atomic-context only, never D1 results. No bar moved on reviewer misreading.

- **Motivation (user-authorized 2026-11-17):** make the test harder instead of degrading the brains. Atomic 12-combo pool lets winners memorize frequent pairs; suspicion boundary (prereg v1.2, run 02 FAIL-regimes-unfilled) needs a lost-producer that is a harder rule test, not a weaker student. Spelling forces sequence-match over memorized IDs: `26378` as `[2,6,3,7,8]`, novel `03492378` as new combination of known pieces, no new rows.
- **D1a fixed-3 pilot (do first, local):** keys = fixed 3 chars from 8-letter alphabet (512 combos = 8^3, seeded partition 384 train / 128 held-out; killHu-spelled uses held-out keys only); values atomic 0-3 (classes stay 4, suspicion `1-top1` + AUC bars unchanged). Encoding: `[c1,c2,c3,SEP,val, ..., q1,q2,q3,SEP,?]` (SEP new token; TERM deferred to D1b). Pool: 500 short (1-3 pairs) + 500 long (9 slots, target hidden among 8 distractors, pos uniform) on spelled keys, allowed-only combos; tutor retrained hint-style on spelled task (curriculum: short-only 1500 steps from fresh init, then full-pool 3000 steps from phase-A weights with fresh Adam; hard labels + spelled attention supervision, no carry aux) must pass §3.4-style gate on spelled killA (long-form, train keys) >=0.95 or series does not start; students same-arch h48/m96/d16 attn, trainFaded replica stages/pipeline, fresh seeds outside 5001-5024 + 5101-5114. Exams: `buildExams`-analog seed-disjoint, killHu-spelled = novel spelled keys (target+distractors held-out combos), 200/brain. Length ~80-100 tokens/long line, ~3-4x pilot cost, CPU minutes/brain, 2-brain smoke then 8-12 sweep locally.
- **D1b max-8 variable (only if D1a competent regime survives):** keys 1-8 chars uniform, alphabet grows to 12 then 62 (upper/lower/digits) in steps; adds TERM token (`chars+TERM+value`, `query-chars+TERM+?`); train lengths uniform + exam stratified by length (length-confound guard). Same single-token answer + bars; multi-token spelled values explicitly out of scope (needs new loss/suspicion — refused here).
- **Bars (pre-frozen before any D1a run):** D1a PASS iff spelled-killHu shows ≥3 brains acc≥0.6 AND ≥3 brains acc<0.5 on 8-12 sweep (regime-fill bar — the thing run 02 lacked) with loader-agreement 200/200 + lineHash + seed log else HALT; suspicion boundary re-test only opens if fill bar passes (rho≥0.6 + competent-median>0.6 AND lost-median<0.5, per-brain graded, pooled record-only — v1.2 bars carried over). D1a all-floor (max acc<0.5) → ABANDON spelled-route or shorten alphabet/length, never silently degrade (documented verdict). Length-stratified report in D1b (no length-confound claims).
- **Paper claim rule:** no spelled number enters paper until detour countersigned (v23) + frozen spec + fresh-brain run. Run 02 verdict + v22 frozen claims untouched (zero kill power over them).
- **Runner rule (pool fit):** D1a pilot local (edit→refresh→1-2 brains; fast iteration, no drift debate). Scale sweep on GitHub Actions only after recipe frozen (20 concurrent, Node 22 pinned, train+eval both on Actions, new fingerprint; burns user minutes — explicit dispatch confirm). Kaggle out (Python-only, cannot run JS harness).
- **D1a byte layout frozen (R1 patch):** alphabet ids 10-17 (a-h), values 4-7 as now, SEP=18, ?=8 query marker kept, no TERM in D1a. Worked short: [10,12,14,18,5, 11,13,15,18,6, 10,12,14,18,8] (key faci queried, answer 1). Any deviation = new fingerprint + HALT. Short-vs-long split reported in pilot.
- **D1a eval-only controls frozen (R1 patch, same brains, no new training):** random-key baseline (absent query, must be chance) + position-shuffle + permuted-key probe (shortcut falls to ~0.25) + omit-q (must be chance). Fail = template-match verdict.
- **Cheapest follow-up named (R1 patch):** 12-letter zero-shot transfer after fill. Tutor spelled-killA gate is feasibility start-gate, not generality proof. Scale rule: no n=50/100 until 8-12 fill passes.
- **Cost:** pilot 2 brains (~10-15 min local); sweep 8-12 (~1h local waves or one Actions matrix). Blobs disposable/regenerable; ledger + signoff per 2.a.v.

## Scoreboard

v7 done = Phase 1 verdicts in text + Phase 2 stranger-reproducible + v0.15 submitted, with
3.a decided on data. Every phase exit is a written verdict, never momentum.
