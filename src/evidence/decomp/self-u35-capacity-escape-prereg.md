# Self U35 prereg: capacity-escape for the compose wall (PROPOSED; NO COMPUTE until battery + countersign)

Agent approval: this file. CPU/in-worker only. NO GPU. Pool = sealed reviewer labor only (3x generateText implementability reviews, never training signal). R=3 seeds 0/1/2, quorum noted per bar, COMPLETE-gated, twin-matched seed-only streams, paired evals. Corrections append-only. NO PUSH without explicit order.

## User request (verbatim, binding — direction delegated to record)

"based on what you think should be next for the vision of the project (look in your memory)"

Reading: user delegates the next-step choice to the durable record. This prereg IS that choice, with the record-search below as its license. No wave is licensed beyond what this file states.

## Record-search (why capacity, why now)

- The wall (stable across 51 verdicts): composition has no exclusion+binding. Selection pressures install use without exclusion (U28 MAX-PARTIAL: USE/SEPARATES 2/3, SELECT-HARD/COMPETE 0/3, margins unmoved); copy-stage selection adds ~nothing over random (U31e TRAINS-BUT-BLIND); random learns every substrate (U31f SUBSTRATE-ABSENT); pricing compose during trunk training moves two +0.035/+0.045/+0.085 but misses quorum (U34 WALLED-AGAIN).
- Dimensions exhausted at H48: query-conditioning tried (U29 Q-FAIL — Eqk unaligned with enc space); wider SELECTION encodings tried (U30 WIDE-PARTIAL — capacity without binding scales distractor room); longer training tried (U30b WIDE-LATE-FAIL — time sharpens the wrong winner); substrates exhausted (U31f 0/4 survivors); trunk-pricing tried (U34).
- Dimensions NOT tried: trunk WIDTH for the compose circuit. U28's mechanism licenses "wider encodings next" (U30 tested it only at the selection stage, never the trunk); U34's verdict qualifies itself "at the W6 capacity point". Steps are exhausted (U30b); width is the one untested degree of freedom the record itself names twice.
- Nearest prior: U34 (identical recipe + oracle-aux wCo=0.5, H48, same streams/seeds). What differs: H48→H96 trunk width ONLY (steps/recipe/streams/seeds/dose unchanged).
- Vision link (reflections v2/v3 forward recipe): if compose installs at capacity, the self-learning trunk has a growth path (grow + keep pricing); if it walls again at 4x params, the wall is STRUCTURAL with a receipt — forcing the architecture track (persistent slow state / new binding mechanism) instead of more scaling. Either outcome is a vision decision, not another blind assault.

## Design

H96 trunk via `inSeqMakeModelH(rng, H)` from newai-fr-driver.js — ALREADY in the pinned 11-file stack, so NO stack surgery and stackHash stays 258d2f06…. `inSeqForward`/`inSeqBackward` read H from M (width-agnostic); `u34TrainOneStep`'s lam term uses `M.H` (follows); snapshot/params/eval-loader are shape-driven. W6 streams identical (init 73000+seed*7919+76*131, data 42000+seed*104729+55, masks 91000+seed; mask VALUES share the H48 prefix by RNG-prefix). Recipe otherwise identical: 800st, B16/lr5e-3/K5, C=6 pick-max, auxW0.5, lam2.0. Arms (new paths `d-newai-self-u35-{arm}-s{seed}-800st-H96.json`, P0 + stackHash in every ledger):
- c0 control: wCo=0.0 at H96 (same-width control — isolates pricing × capacity; also measures what capacity alone does vs W6 canon).
- c1 primary: wCo=0.5 at H96 (U34's effective dose; no dose grid — L2).
- Evals: same paired N=200 shift + 200 base-k0 rows/streams as U34 (`d-newai-self-u35-eval-{arm}-s{seed}-800st-H96.json`).
- Wave 0 setup (gates, HALT on miss): (a) H48 PARITY — u35 driver at H=48 must reproduce u34-c0 loss0+curve+evals EXACTLY 3/3 (proves driver-wiring identity; shapes equal so BIT applies); (b) H96 gradcheck — finite-difference ≤1e-5 on the full step (catches shape bugs the parity run cannot); (c) H96 twin determinism — fresh-init P0 + 1-step exact 3/3.

## Limitations (pre-registered)

- L1 same-seed only (sweep fragility stands). L2 width-only: single H96 point, single dose (dose-finding stays dead per U34). L3 oracle-shortcut risk (same guard as U34). L4 capacity-reallocation (RET vs same-width control). L5 P0 draw-order: `inSeqMakeModelH` draws a different block order than `inSeqMakeModel`, so H96 P0 is NOT comparable to H48 P0 — stated, filed, parity is behavioral (H48 arm) not P0. L6 cost: ~4x params in H-layers (~10 min for 9T+9E).

## Paper predictions vs bench predictions

- Capacity (own, scoped): if the compose circuit is capacity-starved, H96 + clean-signal price should move two at quorum WITHOUT the U34 pattern (positive-but-under). WHY owed if: c0-H96 already ≥ canon+0.05 (capacity alone did it — pricing was never the blocker) / c1 lifts but gap widens (shortcut at scale, L3 trip) / parity misses (wiring bug — HALT, no arms judged) / nothing moves (structural — file, stop scaling).

## Bars (quorum 2/3 unless noted)

- U35-PIN: stackHash == 258d2f06… in all 12 ledgers (9 H96 + 3 H48 parity) + H96 twin-determinism 3/3. Miss = HALT.
- U35-PARITY: H48 arm BIT-exact vs u34-c0 (loss0+curve+P+evals) 3/3. Miss = HALT (setup, no H96 judged).
- U35-COMPOSE (the wall, same-width): two_c1 − two_c0 ≥ +0.05, 2/3 seeds.
- U35-ABS (wall-movement): two_c1(H96) − two_canon(H48) ≥ +0.05, 2/3 (canon = u33-canon evals scr 0.585/0.58/0.6 two 0.57/0.56/0.49).
- U35-RET: scr_c1 ≥ scr_c0 − 0.03, 2/3 (no reallocation at scale).
- U35-ORACLE-CHECK: (orc − two)_c1 ≤ (orc − two)_c0 + 0.02, 2/3.
- U35-FLOOR: scr ≥ 0.50, two ≥ 0.45, all 6 H96 evals.
- U35-FRESH: battery 3x IMPLEMENTABLE or adjudicated v1.1.
- Verdicts: CAP-ESCAPE (COMPOSE + ABS + RET + ORACLE-CHECK) / CAP-PRICE-PARTIAL (COMPOSE hit but ABS/RET/ORACLE miss — pricing works, wall doesn't move) / WALLED-AT-SCALE (COMPOSE miss — structural; STOP scaling; architecture track forced with this receipt).

## Staging + budgets

- Battery on THIS file first (3x sealed) -> v1.1 pins-only. Then driver (`newai-selfu35-driver.js`: u35FreshStack(H) + parity arm + gradcheck + train/eval/verdict) + Wave 0 (parity 3T+3E + gradcheck + twins) + Wave 1 (6T: c0/c1 × 3 seeds) + Wave 2 (6E + verdict) + transcript + CHATLOG + CURRENT_TASK. NO PUSH without explicit order.
- Compute: CPU/in-worker only. 9T + 9E ≈ 10 min (H96 trains ~4x H48). NO COMPUTE until battery adjudicated + fresh countersign for Waves 0-2 (this request covers prereg + battery only).
