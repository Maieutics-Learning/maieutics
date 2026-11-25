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

## Appendix C — verdict glossary (filed meanings, not folk meanings)

- MONITOR-BLIND (U31) · R2MON-VERIFIES (U31b) · SUBSTRATE-VOID (U31c) ·
  RETRY-DEAD (U31d) · TRAINS-BUT-BLIND (U31e) · SUBSTRATE-ABSENT (U31f) ·
  REPRO-EXACT / REPRO-FUNCTIONAL / LOG-INSUFFICIENT / STACK-NONDETERMINISM /
  FREEZE-HALT (U32) · SWEEP-FAILS (W6) · CANONICAL-EXACT (U33) ·
  WALLED-AGAIN (U34) · WALLED-AT-SCALE (U35) · DIET-ONLY (U36) ·
  SCHED-ONLY (U37) · GATE-DEAD (U38) · WINNER-HOLDS/PARTIAL/DEAD ·
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
