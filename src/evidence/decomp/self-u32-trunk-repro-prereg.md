# Self U32 prereg: trunk-freeze + retrain-to-frozen (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. Pool = sealed reviewer labor only (3x generateText implementability reviews, never training signal). R=3 seeds 0/1/2, quorum noted per bar below, COMPLETE-gated, twin-matched seed-only streams, paired evals. Corrections append-only. NO PUSH without explicit order.

## User request (verbatim, binding)

"One important thing. For reproducibility, you have your logs. Training things from scratch to where we are right now is something that will need to be done. Can you see if you can freeze the current trunk and also train a new trunk to get to our frozen one?"

Reading (this prereg's scope): (1) FREEZE the current trunk as a canonical artifact; (2) TRAIN a new trunk from scratch, from the logs alone, to the frozen one. Two claims, one wave. This overrides the Turn-144 fold-in-only standing decision FOR THE TRUNK ONLY (retrieval core W6) — the self-direction stack above it (U31-U31f verdicts: MONITOR-BLIND / SUBSTRATE-ABSENT) is untouched and not relitigated here.

## Record-search (already-run / nearest prior / what differs)

- W6 trunk (winner-sweep-prereg.md; recipe C=6 pick-max + auxW0.5 + 800st + lam2.0 + boot on, frozen): scr 0.635/0.595/0.585, two 0.63/0.595/0.55 — best single-trunk mean 0.592; two 0.60 held 2/3 (s1 misses by 0.005). Ledgers `src/evidence/decomp/d-newai-w-w6-s{0,1,2}.json` (carry `trainSeed`, `arch`, full `params` P). Verdict `d-newai-w-verdict.json`.
- W6 SWEEP-FAILS (same recipe, fresh seeds 3,4,5): two 0.495/0.57/0.50, 0/3; combined 6-seed 1/6. Recipe is seed-fragile (bimodal ignite-or-not, same regime as C-suite/D-rate). Fresh-seed robustness is therefore NOT the reproducibility claim here — it is already measured, and it fails.
- U31-U31f stack (context, not target): U31 MONITOR-BLIND, U31b R2MON-VERIFIES, U31c SUBSTRATE-VOID, U31d RETRY-DEAD, U31e TRAINS-BUT-BLIND, U31f SUBSTRATE-ABSENT (verdict `d-newai-self-u31f-verdict.json`). All of it sits ON W6 (Mf frozen, Mc copies). Freezing W6 freezes the floor under all of it.
- Wave-D PHOTOCOPY (Turn-144 receipt): cold distillation 0/9 fidelity — copying a trunk via distillation fails. This wave does NOT distill. It re-executes theexact training recipe from scratch (same seeds, same streams). Different claim, different mechanism.
- Turn-91 fold-vs-retrain + H2 memorize + h96-capacity (Turn-144 receipts): reasons retraining from scratch was refused as a LEARNING strategy. This wave reframes retraining as a REPRODUCIBILITY audit, not a learning strategy — the trunk is not expected to improve, only to re-arrive.
- Pre-step research check (this session, websearch skill): DDG query "neural network training reproducibility deterministic retraining same seed bit identical" -> top: NVIDIA deterministic-training docs (seeds + deterministic ops -> bit-identical re-runs), RepDL arXiv 2510.09180 (bit-level reproducible DL training/inference, fetched `scratch/repro-repdl.html`), PyTorch reproducibility guides (seed control + deterministic flags; nondeterminism comes from unseeded ops/parallelism, not from the math). Verdict for U32: same-seed re-execution from filed logs SHOULD be bit-exact on our stack (seeded CPU Float64, COMPLETE-gated, already checksums elsewhere); fresh-seed same-recipe SHOULD vary (matches our own SWEEP-FAILS 1/6). So the prereg claims bit-reproducibility on identical seeds and explicitly scopes fresh-seed robustness OUT (already measured, already failed). (CHATLOG rule: 1 search -> primary, no spiral; done.)

## What differs vs ALL prior waves

First wave that does not try to teach anything. No selection, no diet, no gate, no probe, no composition. The only question: do the filed logs suffice to rebuild the trunk from nothing? Freeze (reads only) + retrain (same recipe, same seeds, new ledger paths) + bit-compare + functional eval compare.

## Design

Frozen (reads only, never stepped):
- W6 trunks s0/1/2: `src/evidence/decomp/d-newai-w-w6-s{0,1,2}.json` (recipe C=6/auxW0.5/800st/lam2.0/boot, init stream `73000+seed*7919+76*131`, data `42000+seed*104729+55`, masks `91000+seed`, B=16/lr5e-3/K=5/H=48 — see `src/evidence/decomp/newai-winner-driver.js` wCfg/wArmCode/runWinnerTrain).
- Filed eval baselines: `src/evidence/decomp/d-newai-w-eval-w6-s{0,1,2}-*.json` (N=200 shift + base-k0; scr/two recorded in `d-newai-w-verdict.json`: scr 0.635/0.595/0.585, two 0.63/0.595/0.55).
- Freeze ledger (new, reads only): `src/evidence/decomp/d-newai-self-u32-freeze.json` — per seed: source ledger path + byte length + SHA-256 of canonical param serialization + filed eval numbers + recipe table above. No training, no gradients. Mismatch vs filed verdict numbers = HALT (provenance break, not a retrain).

Trainable (from scratch, logs alone):
- New trunks u32-repro s0/1/2: FRESH init, IDENTICAL W6 recipe re-executed via the same code path (`WinnerInit` + `runWinnerTrain` arm `w6`, same seeds 0,1,2, same streams — implementation: new driver `src/evidence/decomp/newai-selfu32-driver.js` that calls the identical train function but writes to NEW ledger paths `src/evidence/decomp/d-newai-self-u32-repro-s{seed}-800st.json` so the existing COMPLETE ledgers are never overwritten and the skip-if-COMPLETE gate cannot mask a fresh run). Only the ledger path differs from the original run; streams/config/ordering identical (audited line-by-line in the driver header; any delta filed as deviation D-series).
- Evals: paired frozen-test evals on the SAME N=200 shift + 200 base-k0 rows as the filed W6 evals (same eval seeds/streams as `runWinnerEval`; new ledger paths `d-newai-self-u32-eval-repro-s{seed}-800st.json`), plus a bit-compare of retrained params vs frozen params (maxAbsDiff over every P array).

Stage order (all COMPLETE-gated; resume skips COMPLETE):
- Wave 0 (reads only): freeze ledger + stream-audit (driver asserts init/data/mask streams equal the W6 originals by construction; prints the three stream ids per seed into the freeze ledger).
- Wave 1: 3 retrains (800st each, s0/1/2).
- Wave 2: 3 retrain-evals + 3 frozen re-evals (recompute frozen evals from frozen params on the same rows as determinism checksum; expect exact match) + bit-compare.
- No Stage B. No fresh seeds. No selection arms. No probes.

## Limitations (pre-registered, not post-hoc excuses)

- L1 same-seed only: this wave proves LOG-SUFFICIENCY (the filed recipe rebuilds the trunk), not ROBUSTNESS (fresh seeds already measured SWEEP-FAILS 1/6 — cited, not re-litigated). A fresh-seed arm would need a new prereg and would be expected to reproduce the sweep failure, not the trunk.
- L2 ledger-path split: new paths avoid overwriting history but introduce one implementation delta (the path string). The driver audits that no stream/config depends on the path; the audit line is in the freeze ledger.
- L3 determinism assumption: bit-exactness assumes the worker's Float64/loop ordering is stable across runs (it has been: U31-U31f NONE==frozen 12/12, P2-run-2 checksum 0.537 EXACT, run-6 N2 checksum EXACT). A BIT miss therefore prices the stack, not the recipe — filed as STACK-NONDETERMINISM, not REPRO-FAIL-of-recipe, with the diff magnitude quoted.
- L4 trunk-only: Mc/U31 stack above W6 is NOT retrained here (Mc copies are downstream consumers; their reproducibility inherits W6 + their own filed diets, separately auditable).

## Paper predictions vs bench predictions (divergence-WHY owed)

- Reproducibility literature (imported, scoped): same-seed deterministic re-execution -> bit-identical; fresh-seed same-recipe -> variance. WHY owed if: BIT holds but FUNC evals differ (eval nondeterminism — stack bug, high value); BIT fails but losses/evals match (param symmetry — e.g. head-permutation degeneracy — real finding, reframes BIT as too strict); both fail together (log-insufficiency — the recipe as filed does not determine the trunk; highest value, triggers a log-repair wave).
- Seed-fragility (own, scoped): W6 sweep 1/6. WHY owed if: same-seed BIT holds EXACTLY (fragility is init-lottery, not log-rot — the trunk is real but lucky; freezes as LUCKY-CANONICAL with the sweep attached, not as robust).

## Bars (N/A SEs — determinism bars are exact; eval tolerance only as fallback)

- U32-FREEZE: freeze ledger COMPLETE with per-seed SHA-256 + filed eval numbers matching `d-newai-w-verdict.json` exactly (0.635/0.595/0.585 scr, 0.63/0.595/0.55 two). Mismatch = HALT (provenance break).
- U32-BIT (THE claim): maxAbsDiff(retrained P, frozen P) == 0.0, 3/3 seeds. Exact, no tolerance. (Fallback reporting only: if 0/3 but evals match exactly, file PARAM-SYMMETRY hypothesis with the diff magnitude + permutation test owed in a follow-up, never in this wave.)
- U32-FUNC: retrained evals EXACTLY equal frozen evals (accScratch/accTwo per seed, same rows), 3/3. (If BIT holds this is automatic; the bar exists to price eval determinism independently.)
- U32-FROZEN: retrain touches NOTHING except the new u32 ledgers (no writes to W6/U31 files; maxAbsDrift of frozen params re-read before/after == 0.0).
- U32-FRESH: battery health 4/4 (3x IMPLEMENTABLE or adjudicated v1.1).
- Verdicts: REPRO-EXACT (FREEZE + BIT 3/3 + FUNC 3/3) / REPRO-FUNCTIONAL (BIT misses but FUNC 3/3 — symmetry finding, follow-up owed) / LOG-INSUFFICIENT (FUNC misses on 2/3+ — filed recipe does not rebuild the trunk) / STACK-NONDETERMINISM (BIT misses with chaotic magnitudes + frozen re-eval also drifts — worker/execution finding). Freeze-only failures = FREEZE-HALT (no retrain judged).

## Staging + budgets

- Battery on THIS file first (3x sealed) -> v1.1 pins-only. Then driver ext (stream-audit + retrain + eval + bit-compare) + Wave 0 freeze ledger + Wave 1 3T + Wave 2 6E + verdict. Transcript extras Turn-145 + CHATLOG + CURRENT_TASK. NO PUSH without explicit order.
- Compute: CPU/in-worker only. 3x800st trunk retrains + 6 evals (cheaper than U31e; no diets/mining). COMPLETE-gated. NO COMPUTE until battery adjudicated + fresh countersign for Waves 0-2 (this request covers prereg + battery only).

## v1.1 pins (battery 3x IMPLEMENTABLE unanimous -> adjudicated same session; NO COMPUTE until countersigned)

- P1a BIT-failure reporting (R1/R3 converging): on any BIT miss log maxAbsDiff magnitude + worst array + binary-compare note (f64 epsilon; register-spill/Kahan caveat). BIT bar stays exact 0.0 — no tolerance move.
- P1b stream validation (R2/R3): Wave 0 logs first-N draws hash of init/data/mask streams per seed (frozen vs retrain) + asserts eval-row identity (same eval seeds/streams as W6). Proves "identical" is byte-identical before any step.
- P1c dry-run gates (R1/R2/R3 cheapest converging): Wave 0 runs zero-step init bit-compare + 1-step gradient compare per seed as audit gates before full 800st retrains (cheap; still needs countersign; no compute now). Step-1 dP != 0 = HALT with recipe-insufficiency finding.
- P1d symmetry rule (R2): BIT-miss + FUNC-hit files PARAM-SYMMETRY hypothesis ONLY with the permutation mapping + magnitude (follow-up owed, never assumed in this wave).
