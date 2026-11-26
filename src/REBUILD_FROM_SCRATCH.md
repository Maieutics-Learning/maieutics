# REBUILD FROM SCRATCH — stranger's manual (living doc)

v1.1 (battery 3x NEEDS-PATCH → pins P1a–P1g, this session; audit ran REBUILD-READY 30/30 — see §10). Battery: `src/evidence/decomp/fresh-eyes-rebuild-3x-results.md`.

> A stranger with this repo, no memory of any session, and a browser should be
> able to regenerate everything we currently have — functionally (same verdicts,
> same bars), not bit-identically. Bit-exactness is claimed ONLY where a wave
> prereg claims it (same-seed deterministic re-execution, e.g. U32). Everywhere
> else, "rebuilt" means: same recipe, same seeds, same bars, verdict reproduces.
>
> PREMISE (battery P1a — read first): the stranger HAS this repo. "From scratch"
> means from a cold start with no session memory — logs, ledgers, and code all
> present under `src/`, drivers shipped in `src/evidence/decomp/` (nothing is
> generated, nothing is downloaded except the repo itself). This manual is the
> map, not a code dump: training loops live in `src/tinynn/`, wave logic in the
> drivers, specs in the preregs. Anything this manual describes but the repo does
> not contain is a gap in the manual until proven otherwise (run
> `src/tools/rebuild.js` — §10 — which FAILs loudly on anything missing).

- Living doc (vocabulary upgrades allowed; run records it cites keep original
  wording). If this file and `src/agents-augment.md` conflict, the augment wins.
  If this file and `src/gameplan/GAMEPLAN.md` conflict on substance, the gameplan
  wins and this file gets amended same-session.
- Standing rules apply to the rebuild itself: CPU/in-worker only, R=3 seeds
  0/1/2, quorum 2/3, COMPLETE-gated, twin-matched seed-only streams, paired
  evals, corrections append-only, pool = sealed reviewer labor only (never
  training signal), NO PUSH without explicit user order.
- **Do NOT delete the frozen stuff.** Rebuild into NEW ledger paths (U32 pattern:
  `d-newai-self-u32-…`), never overwrite `d-newai-w-*` / `d-newai-self-*` history.
  The frozen artifacts are the answer key the rebuild is graded against.

## 1. What "everything" covers (and what it doesn't)

Rebuild targets, in dependency order:

| # | Piece | Lives in | Status |
|---|---|---|---|
| 0 | Generator shell (`main.pjs`, `index.html`, `src/*.js`) | repo root + `src/` | shippable; smoke-test only |
| 1 | Bench core (`src/tinynn/`: nn, seeded, tasks, train, pcgrad, evo, gseries, spelled-keys) | `src/tinynn/` | grad-checked; guards green |
| 2 | Frozen W6 trunk (3 seeds) + eval baselines | `src/evidence/decomp/d-newai-w-w6-s{0,1,2}.json` + `d-newai-w-verdict.json` | CANONICAL — freeze first (§4), rebuild second (U32) |
| 3 | U28 retrieval base (S/C/INH/HF per seed) | `src/evidence/decomp/` (`u28` family) | U31-stack prerequisite |
| 4 | Self head U31 → U31b → U31c → U31d → U31e → U31f | `src/evidence/decomp/` (`u31*` families) | all CLOSED verdicts (§7) |
| 5 | U32 trunk-freeze-repro | CLOSED Turn-147: LOG-INSUFFICIENT (see wave table; repair = version-pin stack / re-freeze current-code trunk) | the bit-exactness proof |
| 5b | U33 canonical repair (current rebuild target) | CLOSED Turn-152: CANONICAL-EXACT — pinned stack 258d2f06…, P0 checkpoints, canon A + confirm B BIT-exact 3/3, fresh-seed stranger version 3/3 floor | the reachable canonical (SUPERSEDES W6) |
| 6 | Paper + logs (`index.html` §§1–8, `src/CHATLOG.md`, transcripts, `src/RESULTS_INDEX.md`) | repo | re-verify pointers, don't regenerate prose |

Deliberately NOT rebuilt bit-exact (honest scope limits):

- Pre-2026-11-11 foundation rows whose ledgers were wiped (F-series, hybrid M4,
  C-suite, K/K2, campfire, E-series, D-wave/H2 originals). Status per row in
  `src/RESULTS_INDEX.md` (PROSE-ONLY / SUPERSEDED). Rebuild path where one
  exists is named there (e.g. G-series in `src/tinynn/gseries.js` supersedes
  D-series; milestone-1 reproduction = one F2 + hybrid + K battery, fair slots,
  seeds 7–9). Do not present CHATLOG prose numbers as re-measured.
- Anything under `scratch/` (recycling bin: fetch dumps, unzip temp, caches).
  If a durable doc cites `scratch/`, the durable log must carry the source URL
  or a deterministic regenerate-from-`src/` recipe instead.
- Fresh-seed robustness of W6 (sweep seeds 3–5: 0/3, combined 1/6
  `d-newai-w-verdict.json` = SWEEP-FAILS). The recipe is seed-fragile by
  measurement; a rebuild that "fixes" this with silent tweaks is a different
  recipe — file it as one.

## 2. Prerequisites

- A browser that runs Web Workers with `Float64Array` (this is where ALL compute
  runs: `execute_js` sandbox worker + the live page worker for drivers). No GPU,
  no Node, no pip, no keys, no quota. If `crossOriginIsolated` is true, threaded
  wasm also works — nothing in this repo needs it.
- The three execution tools and what each is for:
  - `read` / `write` / `edit` / `glob` / `grep` — workspace files (real paths).
  - `execute_js` — bulk/file work + heavy compute in a throwaway worker with a
    LIVE filesystem (`fs.readTextFile`, `fs.writeTextFile`, `fs.readFile`,
    `fs.writeFile`, `fs.listFiles`, `fs.stat`). This is where rebuild trains run
    if they are ported to worker-runnable form; where a driver is page-shaped,
    run it via `page_eval`/`page_refresh` instead (see §5).
  - `page_eval` / `page_refresh` — run JS inside the live generator page (real
    perchance engine). `page_refresh` applies workspace edits to the page; until
    it runs, evals carry `pendingSrcChanges: true` (page runs older code).
- Skills (under `src/tools/`, index at `src/tools/README.md`): `memory` (first —
  all logging flows through it), `fresh-eyes` (pool reviews: every prereg gets a
  sealed battery before compute), `eval-harness` (gate/bar discipline),
  `websearch` (pre-step research check: max ~2 searches, primary sources, cite
  URL + verdict; "nothing external" is a valid answer, recorded).
- Time budget (MEASURED wall-clock from filed ledgers, not estimates):
  W6 800st trunk ≈ 1.5–9 s/seed (`d-newai-w-w6-s0.json` wallMs 1545;
  `d-newai-w-w6sweep-s3-800st.json` wallMs 8977); U31e 800st Mc-copy ≈ 8–18 s
  (e-neg s0 wallMs 8497, e-sel s1 wallMs 18448); U31f 400st rand screen ≈ same
  order. Full Stage 4 is minutes-to-tens-of-minutes per wave, staged and
  COMPLETE-gated, so resume is free — never re-run a COMPLETE ledger.

## 3. Step 0 — every session, no exceptions

1. `read src/agents-augment.md` first. 2. List `src/tools/` + read
   `src/tools/README.md`. 3. Read `src/tools/memory/SKILL.md` +
   `REFERENCE-layers.md` + `REFERENCE-rules.md` IN FULL. 4. Read
   `scratch/CURRENT_TASK.md` (newest timestamped entry wins) +
   `src/CHATLOG.md` tail (~10 entries). 5. A session that answers before Step 0
   logs the miss in CHATLOG the same session.
6. Open/create this session's transcript stub FIRST
   (`src/evidence/conversations/<YYYY-MM-DD>-<label>.md`, format in that
   directory's `README.md`): every assistant turn appends to it same-turn
   (no-tool turns too); every `src/` write updates the unpushed list in the
   working record same-message; every wave files results + CHATLOG line at its
   checkpoint. Session-end is then a flush (record line + CHATLOG + transcript
   tail-check + unpushed + push gate ~20 files / 3 sessions), not a rescue.

## 4. Stage 0 — freeze & snapshot (before any rebuild compute)

1. Snapshot: copy `src/gameplan/GAMEPLAN.md` → `src/gameplan-snapshots/<date>-pre-rebuild.md`,
   log path + bytes in the working record (snapshot rule — no exceptions for
   substance-changing rewrites).
2. Baseline inventory: run `src/tools/rebuild.js` in `execute_js` (§9). It prints
   family counts (drivers / preregs / verdicts / ledgers), checks the canonical
   set (W6 trunks + evals + verdict, U28 base, U31–U31f chains, REPRODUCIBILITY.md,
   paper pointers), and FAILs loudly on anything missing. File its JSON report
   beside it; that report is the "before" photo the rebuild is graded against.
3. Freeze ledger (U32 Wave 0 pattern, reads only): per frozen seed record source
   ledger path + byte length + SHA-256 of canonical param serialization + filed
   eval numbers. Mismatch vs filed verdict numbers = HALT (provenance break, not
   a retrain). Canonical set, EXPLICIT (battery P1d — every path must exist
   before any rebuild compute):
   - `src/evidence/decomp/d-newai-w-w6-s{0,1,2}.json` (trunks; COMPLETE, 800st,
     C=6/auxW=0.5/lam=2, 11 param blocks each — rebuild.js gates w6-s0/1/2).
   - `src/evidence/decomp/d-newai-w-eval-w6-s{0,1,2}-*.json` (N=200 shift +
     base-k0 evals).
   - `src/evidence/decomp/d-newai-w-verdict.json` (scr 0.635/0.595/0.585, two
     0.63/0.595/0.55 — rebuild.js gate w6-verdict-numbers checks exactly).
   - Wave chains per §8 (driver + prereg + verdict each; rebuild.js gates
     chain:u28/u31/…/u32 + u32-battery).

## 5. Execution pattern (how every rebuild wave runs)

Each wave = prereg → sealed battery → adjudicate to vX.1 (pins-only) →
countersign → driver → ledgers → verdict. No wave skips a step; a skipped battery
is filed as a gap, not backlog.

- **How to run a driver** (battery P1b — the entry pattern every driver follows;
  worked example: `src/evidence/decomp/newai-winner-driver.js` header + U32
  prereg): drivers expose `globalThis.<runFn>(fs, log, opts)` — e.g.
  `runWinnerTrain(fs, log, {arm:"w6", seed:0})`. Load order first (the driver's
  `*Init(fs)` pulls its dependency stack via `(0,eval)`), then call per
  (arm, seed). Per-wave opts (arms, steps, streams, diets) live in the driver's
  header + its prereg — never invent them. In-page drivers run via `page_eval`
  after `page_refresh`; worker-portable work runs via `execute_js` with `fs`.
- **Countersign** (battery P1c): the human operator's explicit go-ahead to spend
  compute, recorded in the transcript + working record (in this project: the
  user's "countersigned" reply). No countersign = docs and audits only, never
  trains. A stranger's operator gives it the same way: a dated log line.
- **COMPLETE-gated** (battery P1c): every ledger carries `verdict:"COMPLETE"` on
  success (plus `wallMs`, `curve`, params); re-runs read the ledger first and
  skip it if COMPLETE (scripts filter `done`). Resume is therefore free — never
  re-run a COMPLETE ledger; a ledger without the flag is NOT done.

- **Prereg** (`src/evidence/decomp/self-<wave>-<slug>-prereg.md`): record-search
  (already-run / nearest prior / what differs), frozen vs trainable split,
  recipe (streams, config, steps), bars with quorum, staging + budget,
  limitations (pre-registered, never post-hoc), paper-vs-bench predictions with
  divergence-WHY owed. Version and freeze (v1.0) before review.
- **Battery** (`src/evidence/decomp/fresh-eyes-self-<wave>-<n>x-results.md`):
  N sealed `generateText` reviewers on the frozen prereg only (pool labor, never
  training signal), verbatim replies + adjudication per point
  (ACCEPT/REJECT/PARTIAL, rejects logged with reason). Patch once → v1.1
  (pins-only; design change needs a new version). Stop rule: RED-TEAM CLOSES
  LOOPS (barren unopposed red round ends review; steelman reserved for planned
  cuts).
- **Driver** (`src/evidence/decomp/newai-self<wave>-driver.js`): header carries
  the deviation series (D1, D2, … — every method delta vs prereg, filed never
  silent). COMPLETE-gated resume (re-run skips COMPLETE; scripts filter `done`).
  Grad-check before any training (exact ≤1e-5; filed ledgers: U31b 4.2e-8, U31c
  4.33e-9, U31f 8.63e-8). Frozen params: maxAbsDrift == 0.0 every wave; Mc/none
  copies: copyDiff == 0.
  Known bug classes (all repaired same-session pre-compute, disclosed in review
  docs — do NOT re-fix): (a) consts (U58_HOT, U61_EXPECT_STACK) invisible across
  the eval boundary — use filed literal hashes; (b) u32MaxAbsDiff misused on live
  param objects — use direct grad-array diff (U60b Wave-0 gate crashed pre-write);
  (c) probe ledger infix `-cclean-*` matches filed v1.5 naming, reads/writes
  consistent — leave alone (renaming would invalidate filed ledgers).
- **Eval + verdict** (`d-newai-self-<wave>-*.json` + `d-newai-self-<wave>-verdict.json`):
  paired N=1000 (U31f) / N=200 (trunk) evals on identical row sets across arms;
  verdict JSON carries bars (bar/result/seeds), deviations, mechanism, quorum.
  Numbers sacred: quote exactly, with source paths.

## 6. Stage 1+2 — generator shell & bench core

1. Shell: `main.pjs` (title + plugin imports + demo questions) and `index.html`
   (paper §§1–8 + bench appendices; scripts intact). Verify live: `page_refresh`
   clean, no `syntaxErrors`, all section ids present, ask→"Paris" path alive.
2. Core load order (exact, see `REPRODUCIBILITY.md` §1 / `novel-driver.js`
   NovelInit): `src/tinynn/nn.js`, `seeded.js`, `tasks.js`, `train.js`, `(0,eval)`
   each into one global. Requires `T.trainModel`, `G.Adam`, `G.softmaxCE`.
   Forward convention: eval forwards use r=1, answer = argmax of 4 classes.
3. Guards (must be green before any wave): `window.TinyNN.quickSelfTest()`
   (learning + depth effect), `quickAttnTest` (~8 s), `quickChoosyTest`,
   `quickSettleTest`, `quickPcgradTest`, spelled-keys layout self-test. A red
   guard HALTs the rebuild (fix the core, never tune around it).
4. Task formats: assocR (`tasks.js` — keys 0..3, values 4..7, Q=8, vocab 9);
   forward `[k1,v1,…,q,Q]` → bound value; reverse (driver-local `genReverse`);
   `bindLabels(x)` answer-free aux. Known harness bugs are LOAD-BEARING — do NOT
   silently fix: `A.gen(rng,5)` NaN contamination (~20% B1 lines program-wide;
   relative comparisons stand, absolutes understated; X2 VOID), early
   cycle/pin ledgers eval-only (~250B, no params — V1/R recompute rather than
   continue). New code gets a safe wrapper (clamp qi); filed `A.gen` is never
   touched (would invalidate every filed ledger).

## 7. Stage 3 — W6 trunk (the canonical artifact)

Recipe (exact; from `newai-winner-driver.js` wCfg/wArmCode + `winner-prereg.md` +
`winner-sweep-prereg.md`): C=6 pick-max + auxW0.5 + 800st + lam2.0 + boot on,
B=16, lr5e-3, K=5, H=48. In plain terms (battery P1e): each batch step draws
C=6 candidate episodes, trains on the one with max vote-disagree (ties → lowest
index; pointers: `wCfg`/`runWinnerTrain` in the winner driver, candidate loop +
`curVoteDisagree`); auxW=0.5 weights the auxiliary value-head loss; lam=2.0 is
the Div pressure. Init/data/mask RNGs and the Adam loop live in
`src/tinynn/seeded.js` (`G.makeRng`) and `src/tinynn/train.js` (`T.trainModel`,
`G.Adam`) — shipped, not redefined here. Streams per seed: init `G.makeRng(73000+seed*7919+76*131)`,
data `G.makeRng(42000+seed*104729+55)`, masks `G.makeRng(91000+seed)`.
Ledgers `d-newai-w-w6-s{0,1,2}.json` (carry `trainSeed`, `arch`, full `params` P).
Eval: N=200 shift + base-k0 (`d-newai-w-eval-w6-s{0,1,2}-*.json`).
Expected (filed `d-newai-w-verdict.json`): scr 0.635/0.595/0.585, two
0.63/0.595/0.55 (best single-trunk mean 0.592; two 0.60 held 2/3, s1 misses by
0.005). Sweep expectation (do NOT "fix"): fresh seeds 3–5 → 0.495/0.57/0.50,
combined 1/6 = SWEEP-FAILS (seed-fragile, bimodal ignite-or-not — the finding).
Bit-rebuild protocol = U32 (`self-u32-trunk-repro-prereg.md` v1.1): freeze SHA-256
ledger → zero-step init bit-compare + 1-step gradient compare gates (P1c) →
3 retrains to NEW paths → maxAbsDiff == 0.0 3/3 (P1a reporting on miss; P1d
symmetry-mapping rule if FUNC holds while BIT misses) + evals EXACTLY equal 3/3.

## 8. Stage 4 — self head in dependency order (each: prereg → battery → driver → verdict)

| Wave | Prereg | Driver | Expected verdict (filed) | Cost / notes |
|---|---|---|---|---|
| U28 base | `self-u28-maxhinge-prereg.md` | `newai-selfu28-driver.js` | retrieval S/C/INH/HF per seed (U31-stack prerequisite) | rebuild first |
| U31 monitor | `self-u31-monitor-prereg.md` | `newai-selfu31-driver.js` | MONITOR-BLIND: CATCH 1/3, LIFT 0/3 (vhat forced=1.0 ceiling), WALL exact | 6T+6E |
| U31b r2mon | `self-u31b-r2mon-prereg.md` | `newai-selfu31b-driver.js` | R2MON-VERIFIES: CATCH2 2/3, SELACC 2/3 + coverage 3/3; NaN forensics (INH.W2←Ib2 typo + INH never loaded; fixed, 6 ledgers force-overwritten, deviation filed) | 6T+6E, grad 4.2e-8 |
| U31c subst | `self-u31c-subst-prereg.md` | `newai-selfu31c-driver.js` | SUBSTRATE-VOID: stage-1 keep 0.0000 3/3 < 0.10 tripwire → NO trains per prereg; 200/200 vhat-ceiling diagnostic | no trains; grad 4.33e-9 |
| U31d resample | `self-u31d-resample-prereg.md` | `newai-selfu31d-driver.js` | RETRY-DEAD: LIFT 0/3 (best +0.025); errors systematic not mask-stochastic | 3E |
| U31e selfdir | `self-u31e-selfdir-prereg.md` | `newai-selfu31e-driver.js` | TRAINS-BUT-BLIND: composition Mc learnable 0.84–0.94, LIFT 2/2, SEL 1/2 FAIL (s2 +0.010), RET 1/2 FAIL (s1 −0.05); s0-sel VOID by 0.096<0.10 tripwire; gate = guardrail not engine (demotion cleared: sel>neg) | 11T+11E + 2 VOID, gradcheck + calib |
| U31f hunt | `self-u31f-substrate-hunt-prereg.md` v1.1 | `newai-selfu31f-driver.js` | SUBSTRATE-ABSENT: Stage-A screen ONLY (12T rand 400st + 12 none + 24E; grad 8.63e-8; 12 calib). SCREEN (rand≤0.60 AND lift≤+0.05, 2/3): R1 0.26/0.35/0.26 lifts +0.15/+0.28/+0.15 (below majority) DEAD; R2 0.76/0.61/0.93 DEAD (s1 0.61 closest; training hurts s0/s1) DEAD; R3 0.88 flat (diag easy) DEAD; R4 0.73–0.98 lifts to +0.74 DEAD. Survivors 0/4 → Stage B NOT run | deviations D1–D9 filed in verdict; dilution 35–81% fallback (paired) |
| U32 repro | `self-u32-trunk-repro-prereg.md` v1.1 | `newai-selfu32-driver.js` (built Turn-147) | LOG-INSUFFICIENT (FREEZE PASS + FROZEN stable; BIT 0/3 ~1.6-1.8, FUNC 0/3; W6 ledgers predate current code — sweep s3-5 loss0 reproduces exactly 3/3 as positive control) | Waves 0–2 run Turn-147 under "go ahead" countersign |
| U33 canonical repair | `self-u33-canonical-repair-prereg.md` v1.2 | `newai-selfu33-driver.js` (built Turn-151, extended Turn-152) | CANONICAL-EXACT (PIN 3/3 + BIT 3/3 + FUNC 3/3 + FLOOR 3/3; fresh seeds 3/3 floor + 3/3 sweep-loss0 — the reachable canonical; SUPERSEDES w6 as rebuild target) | Waves 0–2 run Turn-152 under "countersigned everything" |
| U34 trunkcomp | `self-u34-trunkcomp-prereg.md` v1.0 | `newai-selfu34-driver.js` | WALLED-AGAIN (COMPOSE 1/3 — only s2 ≥ +0.05; RET 3/3; ORACLE-CHECK 3/3 gaps shrank; clean-signal compose price reaches the circuit but does not move two at quorum) | 9T+9E run Turn-154 under "countersigned, please run fresh eyes and then continue" (battery already closed Turn-153 — no re-battery spent) |
| U35 capacity | `self-u35-capacity-escape-prereg.md` v1.0 | `newai-selfu35-driver.js` | WALLED-AT-SCALE (COMPOSE 0/3; ABS 2/3 via capacity on s0/s2; comparative gradcheck gate D1 — absolute finite-diff vacuous for this step lineage, H48 fails identically) | 3 parity T+E (BIT-exact vs u34-c0) + 6T+6E H96, Turn-158 |
| U36 diet+dyn | `self-u36-diverse-dynamic-prereg.md` v1.0 | `newai-selfu36-driver.js` | DIET-ONLY (COMPOSE 0/3 — dynamics decorative; diet shuffles ±, no quorum move; diet D1: uniform-pick + OOD qk!=v, R4 dropped) | wave0 (dyn-gradcheck 6.19e-9 + 6/6 twins) + 6T+6E H48, Turn-161 |
| U37 learned-inh | `self-u37-learned-inhib-prereg.md` v1.0 | `newai-selfu37-driver.js` | SCHED-ONLY (COMPOSE 1/3; INH-USE 0/3 — learned inh trains then hollows, ablation changes nothing; ORACLE 0/3 gaps widen; D2 repair: first 6T omitted P0/P, force-overwritten identical) | wave0 (gradcheck 2.13e-9 + 6/6 twins) + 6T+6E H48, Turn-163 |
| U38 stategate | `self-u38-stategate-prereg.md` v1.0 | `newai-selfu38-driver.js` | GATE-DEAD (COMPOSE 0/3; SHUTS 0/3 — 21-param gate saturates ~0.75 open, never shuts; USES 1/3 s2 only; PRED 0/3; LOWCUE 0/3; D2 check-spec fix: joint-perturb tied c-dims, PASS 2.82e-7 + 6/6 twins) | wave0 + 6T+6E H48, Turn-168 |
| U39 diag-ext | `self-u39-diag-ext-prereg.md` v1.1 (pins P1a–P1e; Waves A–C) | `newai-selfu39-driver.js` | DIAG-COMPLETE: Wave-A ledger arithmetic + Wave-B 24 frozen probes (B3 BLIND 3/3 → integration audit owed, Wave-C NOT run); license table ADVANCE 03/04 (bandit INVERTED r=−0.819)/05/06/07/10/13, DEAD 01/08/11, GATED-SHUT 02, MIXED 09 | Turns 175–176 (pre-countersigned; 24 probes + verdict) |
| U40 gate-audit | `self-u40-gate-audit-prereg.md` v1.1 | `newai-selfu40-driver.js` | INTEGRATION-BUG localized: gate + round-2 carry grads ~13x underweight (single-row FD 1.0000, batch 0.065/0.094/0.071); U4 MOVED, U1 CONNECTED, U3 LIVE-INPUT; U38 train verdicts SUSPECT-STEP (magnitudes), B2/B3 forward numbers stand; D5 halted | 9 probes + verdict, Turn-178 |
| U41 step-fix + U42 shortcut | `self-u41-*` + `self-u42-*` preregs + batteries | `newai-selfu41-driver.js`, `newai-selfu42-driver.js` | U41 FIX-VERIFIED/GATE-INPUT-SIDE (double-/B R0=1.000; gate still never shuts w/ true grads → pressure-side; D-g owner bar error filed) + u34:173 orc-line typo repair (zeros→y==0 rate; U34 ORACLE-CHECK vacuous, headline unaffected); U42 FALSIFIED 3/3 (kernel/shortcut dead) | 23 ledgers, Turn-179/184 |
| U43 program | `self-u43-advanced-prereg.md` v1.1 (M2→M1→M5→M3→M4→M6) | `newai-selfu43-driver.js` (+E6–E11 ext) | PROGRAM-COMPLETE: M2 ADVANCE (dGS −0.06/+0.04/+0.04, G≥S+0.03 2/3) + M1 INCONCLUSIVE (floor guard; L-orc collapse) + M5 ADVANCE (absolute transfer caveat) + M3 DEAD (SFMA≈NR) + M4 INCONCLUSIVE (STAGED floor) + M6 DEAD (P≈E); licensed: replay + trajectory programs | 18T+18E (M2/M1, Turn-184) + 33T+45E + rollup (Turn-185) |
| U44 mix-bandit | `self-u44-*` prereg + battery | `newai-selfu44-driver.js` | DEAD-INVERTED (HIGH-MIX≥LOW-MIX 3/3 — B8 direction real, robust at mixture) | 9T+9E, Turn-186 |
| U45 gate-input | `self-u45-*` prereg v1.1 + battery | `newai-selfu45-driver.js` | DEAD (never shuts 2/3, pred-gap 0/3 — pressure-side; gate-input line closed) + dust recipe BLOCKED (needs second machine) | wave0 + 9T+9E, Turn-186 |
| U46 noise | `self-u46-noise-prereg.md` v1.1 (pins P1a–c; 4 paper groups A–D) | `newai-selfu46-driver.js` | ADVANCE-PROT: STOCH≥DET+0.03 on 2/3 (s0 −0.05 fail, s1 +0.035, s2 +0.095); RES 1/3; per-wave 10x→(Turn-201+) review protocol starts here | wave0 + 9T+9E + 6 iterative review docs, Turn-188 |
| U47 combo | `self-u47-combo-prereg.md` v1.0 | `newai-selfu47-driver.js` (brace fix pre-compute) | DEAD-COMBO: STOCH≥BOTH+0.03 on 2/3 (s0 −0.075 hold, s1 −0.105 hold, s2 +0.105 lone BOTH win, two 0.555 best single but 1/3 = no license) | wave0 + 9T+9E + 6 review docs, Turn-190 |
| U48 pctcombo | `self-u48-pctcombo-prereg.md` v1.0 + battery | — (never built) | SHELVED per user order (prereg + 3x IMPL filed, 0 ledgers) | Turn-192, no compute |
| U49 margate | `self-u49-margate-prereg.md` v1.0 | `newai-selfu49-driver.js` | DEAD: dGS −0.02/−0.09/+0.05, nGS=1 nSG=1; s2 GATE 0.5 beats both parents yet loses quorum; stacking 0/3 families | wave0 + 9T+9E + 7 review docs, Turn-193 |
| U50 drift | `self-u50-drift-prereg.md` v1.0 (+D1 alternate-hot fix) | `newai-selfu50-driver.js` | ADVANCE-DRIFT: nRD=2 nSD=2, tiebreak RES mean 0.22 > STOCH 0.155 (s0 +0.14/+0.09, s1 +0.08/+0.065, s2 +0.00/+0.025); blur vindicated under rotation; wall's first conditional breach (stationary: dice; rotating: blur) | wave0 + 9T(first)+9T(refixed)+9E + 10 review docs, Turn-194 |
| U51 slot | (reserved) | — | RESERVED for owed split/resting program — never run | slot held since Turn-199 |
| U52 bioreview | `self-u52-bioreview-synthesis.md` v1.2 (pins P1a–d + P2a–h) + `papers/brief-14..20` + `papers/incoming-outside-perspective-2026-11-26.md` | — (no compute) | REVIEW CLOSED: 7/7 PMIDs verified, 1 full text read (Anderson & Floresco 2022); triage P1 detector-blocked/highest, P5 runnable now (E-EXT1 first), P2 sequenced, P3 split, P4 parked; order of battle 7 experiments | 3x + 10x repass batteries, Turns 199–202 |
| U53 ext1 | `self-u53-ext1-prereg.md` v1.2+A1 (A1 relative bars post-halt; Delta SE-derived; LOWCOMP flag) | `newai-selfu53-driver.js` | FLOOR-FAIL: PIN 3/3 CTX 1/3 NOERASE 0/3 ISOLATE 3/3 FLOOR 0/3 MISFIRE 3/3 (FIRST misfire event); ckpts 0.275/0.340/0.305; vetoA 0.0556/0.0635/0.0502; criterion −1 D1 | wave0 + 12 Phase-1 + 12 Phase-2 + 12E + 4 review docs, Turns 204–206 |
| U54 ext2 | `self-u54-ext2-prereg.md` v1.0 STANDS (C1 800-step brain, C2 closed-init b=−2) | `newai-selfu54-driver.js` (u53 clone, 5/5 load-check) | FLOOR-FAIL: PIN 3/3 CTX 1/3 (s2 0.605 only) NOERASE 1/3 (s2 vetoA 0.0464 clean) ISOLATE 3/3 FLOOR 0/3 (noveto/global 0.22–0.335 drag) MISFIRE 2/3; ckpts 0.585/0.555/0.555 (C1 HELD); SECOND quorum misfire → P5 CLOSED; D3 floor-scope flaw filed | wave0 + 24T + 12E + 4 review docs, Turns 207–208 |
| U55 det1 | `self-u55-det1-prereg.md` v1.1→v1.4 (v1.4 2x2 diet remap into qk {0..3} after Wave-0 HALT at hot guard 0.852; bars untouched) | `newai-selfu55-driver.js` v1.4 (parse 4/4) | DET-COLLAPSED: NONDEGEN 0/3 POWER 3/3 (residual gaps +0.02..+0.14, spikes ~0); E-NE1 BLOCKED; owed: new signal source | wave0 + 240 probes + verdict + 4 review docs, Turns 212–215 |
| U56 leakfix | `self-u56-ext1b-prereg.md` v1.1 STANDS | `newai-selfu56-driver.js` | LEAK-FIXED: CLEAN 3/3 CTX 2/3 (c1 ctxA 0.485 lone miss) FLOOR 3/3 MISFIRE 0/3; E-EXT2 LICENSED; P5 stays CLOSED | wave0 + 60 fits + 60E + verdict + 4 review docs, Turn-213 |
| U57 ext2 (20 seeds, 14/20 frozen) | `self-u57-ext2-prereg.md` v1.0 STANDS | `newai-selfu57-driver.js` (U54 transform + VETO3) | FLOOR-FAIL: PIN 20/20 CTX 8/20 NOERASE 0/20 ISOLATE 11/20 FLOOR 0/20 MISFIRE 20/20; vetoA 0.051–0.068 all seeds; E-EXT2 line DEAD | wave0 + 160T + 80E + verdict + 4 review docs, Turn-215 |
| U58 det2 (probe track, 3 trunks frozen) | `self-u58-det2-prereg.md` v1.0→v1.3 (centering→precision P1, fixed-tolerance POWER P3, RAND/TRIV go/no-go) | `newai-selfu58-driver.js` (full RAND/TRIV logic, code-review CODE-OK) | UNDERPOWERED: PIN 3/3 NONDEGEN/DISSOCIATE/POWER 0/3; gap_STAT 0.73–1.15 pass 3/3, gap_ROT 0.10–0.25 + carry ~0 fail; no license either way | wave0/RAND/TRIV + 12 probes (240) + verdict + 6 review docs + code-review + interpretation note, Turns 216–218 |
| U58 v1.4 (20-trunk conversion; superseded by v1.5 for power) | v1.4 section (2/3 retired, 15/20 trunks, 1600 probes) | STANDS (10x IMPL + 10x CONFIRM) but power-deficient as filed — trunk scaling alone can't fix within-trunk SE; kept for N<20 compliance | battery doc `fresh-eyes-self-u58-v14-10x-results.md` |
| U58 v1.5 (20 trunks x 80 streams, EXECUTED) | prereg v1.5 + driver ext (6 fns, parse-OK, old fns intact) | UNDERPOWERED again: PIN 20/20, gap_STAT 20/20, gap_ROT 14/20 (0.09–0.58), cross 2/20, spike_ROT 0/20, uw 3–4/5 all trunks; 60 reviewers unanimous | 17 canon + wave0/RAND/TRIV + 80 probes (6400) + verdict + 3 review docs, Turn-218+ |
| U59 ext3 (20 seeds, 15/20) | `self-u59-ext3-prereg.md` v1.0→v1.1 (quorum 14/20→15/20, RAND/TRIV, LAM_SUP=1.0) | `newai-selfu59-driver.js` (repaired D1/D2/D3/D5/D6 pre-compute, zero data) | FLOOR-FAIL: PIN/CTX edge 15/20 + NOERASE 20/20 (vetoSUP vetoA 0.0059–0.0064 all seeds — leak FIXED vs U57 0.059; replication 0.0589 holds) but noveto CTX-A 0.21–0.34 kills floor 0/20; line dead on B-heavy, mechanism vindicated | wave0/RAND/TRIV + 100T + 100E + verdict + 6 review docs, Turn-218 |
| U60 det3 (regime substrate; EXECUTED) | `self-u60-det3-prereg.md` v1.0 (20 regime trunks, diet-only pressure, DET2 probes verbatim, MANIP guard, same bars 15/20) | `newai-selfu60-driver.js` | MANIP-FAIL: PIN 20/20, MANIP 10/20 (canon max 0.003314; regime mean ~0.00333, half the trunks above max), NONDEGEN/DISSOCIATE/INDEPEND/POWER 0/20 — guard fires first per filed order, DET3 bars NOT interpreted | wave0 (PIN + P0-identity + Guard + dry-run) + 20 regime trains + 80 probes + verdict `d-newai-self-u60-verdict.json` + closeout `self-u60-det3-closeout.md` + 3 review docs (`fresh-eyes-self-u60-wave{0,1,2}-10x-results.md`, 30 R1 + 30 D unanimous) |
| U60b priced (carry price; EXECUTED) | `self-u60b-priced-prereg.md` v1.0 (SAME 20 regime trunks + aux quarter-loss price; SAME MANIP guard + DET2 probes; Q-probe + Wave-0 gate prove price reaches carry) | `newai-selfu60b-driver.js` (D-pin repair pre-compute: first gate misused u32MaxAbsDiff on live params, crashed pre-write — fixed to direct grad-array diff, zero data) | UNDERPOWERED: MANIP 16/20 (qv 0.0016–0.0082, ~2x U60 max — price installs excursion); quarter-readout 0.313 vs 0.25 chance (echo ceiling ~0.50; training qloss 1.27–1.54 vs ln4 1.386 = elevation WITHOUT information); POWER trips (gated, not interpreted) | 80 probes + verdict `d-newai-self-u60b-verdict.json` + closeout `self-u60b-priced-closeout.md` + 4 review docs (prereg + wave{0,1,2}, 30 R1 + 30 D unanimous) |
| U60c trace (slow surprise-trace; EXECUTED, reads-only) | `self-u60c-trace-prereg.md` v1.0 (same 20 regime trunks; 50-row EMA disagreement trace Z; QV-Z guard vs canon band; ZB-resp spike test; D5 STAT-control disclosed pre-data as confounded) | `newai-selfu60c-driver.js` | Z-ABSENT: QV-Z 0.0003–0.0012 all inside canon band (mean 0.00072 max 0.001385) → guard 0/20; ZB-resp ROT negative everywhere (−0.001 to −0.0035, dips not snaps); STAT ZB-resp ~+0.01 WITHOUT base correction (D5, non-deciding); POWER-diag 0/20 | reads-only on 40 filed frozen trunks (no new trains) + verdict `d-newai-self-u60c-verdict.json` + closeout `self-u60c-trace-closeout.md` + 3 review docs (prereg + wave{0,1}, 30 R1 + 30 D unanimous) |
| U61 ext4 (balanced 50/50 veto; EXECUTED) | `self-u61-ext4-prereg.md` v1.0 (diet-only change from U59; all else identical) + driver `newai-selfu61-driver.js` (mechanical clone, parse-OK) | FLOOR-FAIL: CTX 16/20 + vetoA 0.0024–0.0025 (cleanest) + replication 0.0373, but global 0/20 by-construction + noveto 5/20 kill floor; D3 scope flaw binding; leak∝pressure hypothesis filed | wave0/RAND/TRIV + 100T + 100E + verdict + 3 review docs + closeout `self-u61-closeout.md` |
| U62 rescoped (fair-scope re-gate; EXECUTED, reads-only) | `self-u62-veto-rescoped-prereg.md` v1.0 (recompute on filed U61 100T+100E: FLOOR-R shielded vetoSUP/vetoTASK/unfrozen CTX-A≥0.45 + GLOBAL-DIR control + NOVETO-DIAG, same 15/20 quorum; replication ±0.02 vs U57 0.059) | `newai-selfu62-driver.js` (reads-only; first recompute printed PIN-FAIL from const-visibility bug class U58_HOT/U61_EXPECT_STACK invisible across eval boundary — fixed to filed literal hashes, re-ran pre-review) | TASK-NOREP: PIN 20/20, CTX 16/20, NOERASE 20/20, ISOLATE 11/20, FLOOR-R 20/20, GDIR 20/20, replication 0.0373 vs 0.059 trips by 0.0017 (gate reached because floor now passes) | wave0 ledger-identity + verdict `d-newai-self-u62-verdict.json` + 3 review docs (`fresh-eyes-self-u62-10x-results.md` + wave{0,1}, 20 R1 + 20 D unanimous) |
| U62 replication audit (doc-only, reads-only) | `self-u62-replication-audit.md` (pipeline-intact check + diet-scaling math: 0.0589 × 0.5/0.8 = 0.03681 predicted vs 0.03733 observed, diff ~0.5 SE) | — (no driver) | DIET-EXPLAINED: every other bar replicates U61 exactly; tolerance is diet-blind (leak proportional to B-pressure); licensed U63 diet-scaled recompute or close line | audit doc only, no new ledgers |
| U63 scaled (diet-scaled replication; EXECUTED, reads-only) | `self-u63-veto-scaled-prereg.md` v1.0 (U62-verbatim except replication center 0.036875 = 0.059 × 0.5/0.8, same ±0.02) | `newai-selfu63-driver.js` (U62 clone, 1-line center change) | SUP-PERSISTS: replication 0.0373 vs 0.036875 RESOLVED (diff 0.0005); isolate 11/20 (unfrHolds 0/20 — balanced diet never erases); PIN 20/20 CTX 16/20 NOERASE 20/20 FLOOR-R 20/20 GDIR 20/20 | wave0 + verdict `d-newai-self-u63-verdict.json` + closeout `self-u63-scaled-closeout.md` + 2 review docs (prereg + wave01, 20 R1 + 20 D unanimous). Line status: veto proven, pressure-dependent necessity — no further veto prereg licensed |
| U58+U59 failure analysis | `self-u58-u59-failure-analysis.md` (U58 ruler-short + null carry + rotation attenuation; U59 gate-preserves-not-teaches + all-arm floor scope) | — (doc-only) | STANDS (10x SOUND + 10x CONFIRM); licensed: U58 v1.4 ruler-retry + U59 new-diet prereg | battery doc `fresh-eyes-self-u58u59-analysis-10x-results.md`, Turn-218+ |
| U60 paper-gap analysis | `self-u60-paper-gap-analysis.md` (7 gaps: half-a-variable w/o consumers; un-timed gain; no mode; all-commit + timescale outside window; fixed lam suspect; Lippl points at binding; fixed-schedule clock + no second store + dense interference) + 6-step success recipe (step 1 = rule-switch diet + oracle controls, NOT preregged) | — (doc-only) | STANDS (reviewed); licensed: U60-successor step-1 prereg OR close detector line (substrate-dead by U60/U60b/U60c triangulation) | doc-only, no compute |
| Standing rule (2026-11-26) | NO N<20 on any test (supersedes probe-track 2/3 exemption; filed verdicts frozen) | — | recorded in CURRENT_TASK; U58 v1.4 is first compliant probe track | — |

Wave file pattern (all under `src/evidence/decomp/`): train ledgers
`d-newai-self-<wave>-<arm>-s<seed>-<steps>st.json` (carry `spec`, `track`,
`arm`, `seed`, `steps`, `verdict: COMPLETE`, `wallMs`, `curve`, mining stats,
`P` params, `frozenFrom`, `maxFrozenDrift`, `maxCopyDiff`); eval ledgers
`d-newai-self-eval-<wave>-<arm>-s<seed>-<steps>st.json`; verdict
`d-newai-self-<wave>-verdict.json` (required keys, battery P1f: `bars` (each
`{bar, result, seeds}`) + `deviations` + `mechanism` + `quorum`; per-arm arrays
in seed order). "Functionally same" = parses against these keys AND holds the
prereg's bars. Quorum-divergence rule (battery P1f): 2/3 seeds holding a bar =
PASS, 1/3 = FAIL; near-miss files the distance-to-gate with the verdict (no bar
moves on data — anti-tuning rule) and any follow-up threshold needs a NEW prereg.

## 9. Verification (eval-harness gates; no gate is optional)

- Per-wave bars in its prereg (quorum 2/3 unless noted; N=1000 → per-seed
  SE≈0.0224; LIFT +0.05 ≈ 2.23σ p≈0.013/seed, joint ≈0.0005; SEL +0.03 ≈ 1.34σ
  p≈0.09/seed, joint ≈0.023 — U31f P1f). Determinism bars are exact
  (U32-BIT maxAbsDiff == 0.0; U31f-NONE none==frozen 12/12; U32/U31f-FROZEN drift 0).
- Fresh-eyes health 4/4 per battery (confounds / numbers / controls / plausibility).
- `src/tools/rebuild.js` (§10) re-run after every stage: counts must climb
  monotonically toward the §4 baseline; any drop = investigate before continuing
  (a shrinking ledger count is never "cleanup" — it is data loss until proven
  otherwise).
- Pool discipline: reviewers see the frozen artifact only (sealed briefs, no
  conversation memory); verify each reply is on-brief before merging; reviewer
  errors are data (log them: e.g. R1/R2 U31f reviews argued from stale numbers —
  premise-hygiene miss, logged). Adopted points still need a run; unanimity is
  never proof (shared model family, shared blind spots).

## 10. Automation — `src/tools/rebuild.js`

Runnable audit (no training, no pool, seconds). TESTED pattern (battery cheapest
test, Observed this session — do not "simplify" to an untested import):

    const body = await fs.readTextFile("src/tools/rebuild.js");   // execute_js, fs in scope
    const fn = new Function("fs", `"use strict"; return (async () => {\n${body}\n})();`);
    const report = await fn(fs);   // {summary, gates, missing, counts}

It reads the live workspace via `fs`, checks §6–§8 presence (core files,
load-order symbols, W6 trunks + evals + verdict numbers, U28 base, U31–U31f
driver/prereg/verdict chains, U32 prereg + battery, REPRODUCIBILITY.md, paper
pointers, transcript README), counts ledger families per wave, and prints
PASS/FAIL per gate plus a machine-readable JSON report. TESTED RESULT (this
session): REBUILD-READY — 30/30 gates pass, 4405 src files, 2397 ledgers,
W6 s0–2 COMPLETE 800st C=6/auxW=0.5/lam=2 with 11 param blocks each, verdict
numbers exact. Exit contract: 0 missing = REBUILD-READY; >0 missing = named
list (path + which stage needs it + whether it is regenerable or
frozen-missing). Re-run after every stage (§9).

## 11. When numbers differ (tolerance policy — pre-registered)

1. Determinism checks (BIT, NONE==frozen, drift 0, checksums): ZERO tolerance.
   A miss = STACK-NONDETERMINISM (worker/execution finding) or LOG-INSUFFICIENCY
   (recipe does not determine the trunk) — never "noise". Quote magnitudes,
   file the diff, halt the stage.
2. Bar checks (LIFT/SEL/CATCH/quorum): the prereg's quorum + joint chance math
   stands (anti-tuning rule — no bar moves on reviewer opinion or on data;
   a near-miss files its verdict with the distance-to-gate reported, e.g. U31f
   P1e: R2-s1 0.610, +0.01 over 0.60).
3. Seed-lottery (W6 1/6, C-suite/D-rate bimodality): fresh-seed variance is the
   measured regime, not a rebuild failure. Same-seed MUST reproduce; fresh-seed
   MUST be reported as drawn (never seed-shopped: best-of-seeds selection on a
   train metric is FORBIDDEN — P2-run-2b rule, fires here too).
4. Dead ends to NOT re-run without a new prereg: PCGrad-past-mismatch (helps
   only mismatch-regime), evo readout/gate genes (memorization artifacts via
   voided seed + short-gap training), campfire/gossip (mush), settle-variants
   (desert at K=100), slow-fade (1/3 rescues, lever not THE lever), attention
   for lookup (owns procedural + pointing; hybrid M4 ceiling-match only).

## 12. Push & durability (unchanged during rebuild)

- `src/` is sacred (quota: 2 GB total, 100 MB/file, 10,000 files) and public —
  only files the shipped generator uses plus tooling/scripts. Secrets never in
  `src/` (PATs never leave the browser; user holds the token).
- Every wave updates the unpushed list same-message; push at ~20 files / 3
  sessions — and only on explicit user order ("NO PUSH" stands until the user
  says otherwise; a ready-to-push payload states what is ready, then pushes with
  the token while reminding rotation).

## Appendix A — master file map (Observed, this session)

- Core: `main.pjs` (45 lines: title, 20 plugin imports, demo questions) ·
  `index.html` (171,144 B: paper §§1–8 + bench appendices) ·
  `src/tinynn/{nn,tasks,train,seeded,pcgrad,evo,gseries,spelled-keys}.js` ·
  `src/{inference,offline-solver}.js` · `src/lab/run-p1a.js` ·
  `src/pool/{decider,guard,heartbeat,nursery-data,router,smoke,vault,sources/,kaggle-spend-plan.md}`.
- Evidence: `src/evidence/decomp/` = 2,707 files (70 drivers · 132 preregs ·
  129 verdicts · 2,397 ledgers) · `src/evidence/conversations/` = 44 files ·
  `src/evidence/synthesis/` = 136 files. Repo total: 4,403 src files, ~510 MB.
  (`execute_js` inventory, this session; counts live in §4's baseline report.)
- Log layers: `scratch/CURRENT_TASK.md` (live record) · `src/CHATLOG.md`
  (2,975 lines, durable) · `src/evidence/conversations/2026-11-25-extras.md`
  (Turns 134–145) · `src/RESULTS_INDEX.md` (claim→artifact→status) ·
  `src/gameplan/GAMEPLAN.md` (v23 countersigned frozen) · snapshots in
  `src/gameplan-snapshots/`.
- Docs: `src/agents-augment.md` (standing orders) · `src/README.md` (root map) ·
  `README.md` (front door + license + credit) · `src/tools/README.md` (skill
  index) · this file (stranger path) · `src/evidence/decomp/REPRODUCIBILITY.md`
  (spec→code map for the decomp program).

## Appendix B — seed/stream table (Observed: driver headers + preregs, this session)

- W6 trunk: init `73000+seed·7919+76·131`, data `42000+seed·104729+55`, masks
  `91000+seed`; seeds 0,1,2 (sweep 3,4,5). B=16, lr 5e-3, K=5, H=48.
- U31f: fixedMasks `91000+seed` family; diets rand `93500/94500`, sel `93400/94400`,
  neg `93600/94600`, shuf `94700/95700` (+seed); miner base 66300; eval N=1000.
- Novel/verifier: tutor data `14000+s`, train `14100+s`, test `14200+s`; cycle
  `15000+s/15100+s`, halves `16000+s/16100+s`, R3 `17000+s`; eval streams
  `14900+s` (cycle/H), `15200+s` (ext). Tutor gate: test acc ≥ 0.60 else ABORT.
- Convention everywhere: twin-matched per-seed init/train/eval streams; paired
  eval rows across arms; COMPLETE-gated resume; NO seed shopping.
- U60/U60b regime trunks s0–19: W6 recipe verbatim (800st, B16/lr5e-3/K5/H48,
  C=6 pick-max auxW0.5 lam2.0 boot, init 73000+seed·7919+76·131, data
  42000+seed·104729+55, masks 91000+seed) EXCEPT row sampler: 32 blocks × 400
  rows; block rng 62000+seed·1000+j; jittered boundaries bj=[100±U{0..20},
  200±U{0..20}, 300±U{0..20}]; rotating hot HOT=[[0,1],[2,3],[0,1],[2,3]] per
  quarter; if dataRng.int(10)<7 rejection-sample qk into HOT[q] (≤50 tries).
  Labels never relabeled. Ledger families: `d-newai-self-u60-regime-s{seed}-800st.json`,
  `d-newai-self-u60b-priced-s{seed}-800st.json`. Probes: 4 cells × 80 streams,
  N=400, DET2 v1.5 operators verbatim. Canon qv band (U60 Wave-0, filed):
  mean 0.002272 max 0.003314.
- U60b price only: linear Q (4×8 + 4 bias, init rng 96000+seed) on round-2 carry;
  auxQW=0.5 × CE(Q·cNew, q)/B; full-trunk grads; Q-init twin-checked in Wave-0.
- U60c trace (reads-only, zero new trains): reuse 20 filed U60 regime + 20 filed
  canon trunks; surprise d=curVoteDisagree(fw2.logitsK); slow trace
  z←(1−α)z+α·d, α=0.02 filed (horizon ~50 rows); QV-Z + ZB-resp (z[bb+10]−z[bb−10]
  minus in-quarter baseline); canon band mean 0.00072 max 0.001385 (Wave-0).
- U61 balanced veto (100 Phase-2 trains): reuse U57 Phase-1 verbatim; 5 arms × 20
  seeds; open w=[0,0], lr 1.0, K=10, LAM_SUP=1.0 (vetoSUP own-objective);
  diet ctx=dataRng.int(10)<5 (50% B label-0 / 50% A label-y; U59 was 80/20).
  Eval U54 Phase-3 verbatim (CTX-A/CTX-B/RET-A, N=200, same stream IDs).
  Ledger families: `d-newai-self-u61-phase2-{arm}-s{seed}.json` +
  `d-newai-self-u61-eval-{arm}-s{seed}.json` (arm ∈ noveto/global/vetoSUP/vetoTASK/unfrozen).
- U62/U63 recompute (reads-only, zero train writes): reuse 200 filed U61 ledgers
  (100 Phase-2 + 100 evals); U62 replication center 0.059 ±0.02 (vs U57);
  U63 center 0.036875 = 0.059×0.5/0.8 ±0.02 (diet-scaled; B-fractions U59 0.8,
  U61 0.5 are filed diet constants). Bar→file map: verdict JSON perSeed[*].arms
  carries all five arms; wave0 ledger asserts 200/200 presence + spot-hash.

## Appendix C — verdict glossary (filed meanings, not folk meanings)

- MONITOR-BLIND (U31) · R2MON-VERIFIES (U31b) · SUBSTRATE-VOID (U31c) ·
  RETRY-DEAD (U31d) · TRAINS-BUT-BLIND (U31e) · SUBSTRATE-ABSENT (U31f) ·
  REPRO-EXACT / REPRO-FUNCTIONAL / LOG-INSUFFICIENT / STACK-NONDETERMINISM /
  FREEZE-HALT (U32) · SWEEP-FAILS (W6) · CANONICAL-EXACT (U33) ·
  WALLED-AGAIN (U34) · WALLED-AT-SCALE (U35) · DIET-ONLY (U36) ·
  SCHED-ONLY (U37) · GATE-DEAD (U38) · DIAG-COMPLETE (U39) ·
  INTEGRATION-BUG (U40) · FIX-VERIFIED/GATE-INPUT-SIDE (U41) ·
  FALSIFIED (U42) · PROGRAM-COMPLETE (U43: M2/M5 ADVANCE, M1/M4
  INCONCLUSIVE, M3/M6 DEAD) · DEAD-INVERTED (U44) · DEAD (U45) ·
  ADVANCE-PROT (U46) · DEAD-COMBO (U47) · SHELVED (U48) · DEAD (U49) ·
  ADVANCE-DRIFT (U50) · FLOOR-FAIL (U53/U54; P5 CLOSED on second
  quorum misfire) · VETO-MISFIRE / UNFROZEN-HOLDS (diagnostics) ·
  WINNER-HOLDS/PARTIAL/DEAD · DET-COLLAPSED (U55) · LEAK-FIXED (U56) ·
  FLOOR-FAIL (U57/U59) · UNDERPOWERED (U58; v1.4 20-trunk retry owed) ·
  MANIP-FAIL (U60) · UNDERPOWERED (U60b) · Z-ABSENT (U60c) · FLOOR-FAIL (U61) ·
  TASK-NOREP (U62) · SUP-PERSISTS (U63) · DIET-EXPLAINED (U62 audit) ·
  PHOTOCOPY (Wave-D cold-distillation 0/9) · VOID (tripwire, not failure).
  Each verdict JSON carries its bars + deviations + mechanism — read the JSON,
  not the label.

## Appendix D — pre-step research check (standing; recorded per wave)

Before any rebuild wave, ask what external fact could save compute ("nothing" is
a valid answer — record it). Max ~2 searches (`src/tools/websearch/` recipe:
DDG html via `fetch_url`, top ~8, read 1–2 primaries), double-check every claim
against our code/numbers (research errs like reviewers do), cite URL + verdict
in the wave's log entry. U32's check is the worked example (RepDL 2510.09180 +
  NVIDIA deterministic-training docs → same-seed bit-exact expected, fresh-seed
  variance expected — matches SWEEP-FAILS 1/6).
