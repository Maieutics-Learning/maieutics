# Self U34 prereg: compose-priced trunk training (PROPOSED; NO COMPUTE until battery + countersign)

Agent approval: this file. CPU/in-worker only. NO GPU. Pool = sealed reviewer labor only (3x generateText implementability reviews, never training signal). R=3 seeds 0/1/2, quorum noted per bar, COMPLETE-gated, twin-matched seed-only streams, paired evals. Corrections append-only. NO PUSH without explicit order.

## User request (verbatim, binding)

"perfect. Note that [cross-machine dust owed follow-up] and lets move on to the wall we were at before, the wall that requires more training"

Reading: return to the pre-detour frontier — the U31e/U31f self-direction wall — via its licensed next step, which requires full trunk training rather than copy diets. (Label note: this redefines the unused "U34 per-stream input proposals" label from the superseded Nov-25 plan; that plan never ran. U32/U33 were likewise relabeled when the reproducibility detour took them.)

## Record-search (the wall + why trunk training is the way through)

- U31e TRAINS-BUT-BLIND (d-newai-self-u31e-verdict.json): composition LEARNABLE on copies (lifts to 0.84-0.94 hardY on s1/s2) but the gate diet does not beat random at quorum; where training helps, selection adds ~nothing (s2 sel-rand +0.010); where training hurts, selection rescues (+0.214). Verdict's licensed next: "price composition during trunk training (not a copy), or find substrates where random diets fail and only selection lifts."
- U31f SUBSTRATE-ABSENT: the second option failed — rand learns every substrate (R1/R4 lifts by rand alone; R2 margin-only; R3 diag-easy). So this wave takes the FIRST option: move the price into trunk training itself.
- U33-canon (CANONICAL-EXACT): pinned stack 258d2f06… reproduces exactly; canonical evals scr 0.585/0.58/0.6, two 0.57/0.56/0.49 = the floor to beat and the setup control (control arm must re-reproduce it).
- F-series precedents: F3 longer HELPS compose 3/3; F7 (f3+pick) two 0.63 best single; auxW2.0 dose HURTS (keep compose dose modest); sweep fragility (fresh-seed robustness OUT — same seeds 0/1/2 only).

## Design

Trunk trains from FRESH init on the pinned U33 stack + identical W6 streams (init 73000+seed*7919+76*131, data 42000+seed*104729+55, masks 91000+seed), 800st, B16/lr5e-3/K5/H48, C=6 pick-max, lam2.0, auxW0.5 — PLUS an oracle-compose aux term (round-2 forward with TRUE v, xom=[9,9,9,9,9,9,qk,k,v,8], CE vs y, weight wCo/B added to the batch loss + backpropagated through the round-2 path only). The W6 recipe's round-2 trains through predicted vhat; the aux prices the compose circuit with clean signal. Arms (new paths `d-newai-self-u34-{arm}-s{seed}-800st.json`, P0 + stackHash in every ledger):
- c0 control: wCo=0.0 (exact canonical replication; setup validity — expect BIT-exact vs u33-canon-A).
- c1 primary: wCo=0.5. c2 secondary: wCo=1.0 (dose direction, reported; no tuning beyond).
- Evals: same paired N=200 shift + 200 base-k0 rows/streams as W6/U33 evals (`d-newai-self-u34-eval-{arm}-s{seed}-800st.json`).

## Limitations (pre-registered)

- L1 same-seed only (sweep stands). L2 two-dose grid is coarse by design (dose-finding is a follow-up, not this wave). L3 oracle-aux shortcut risk: the aux may teach v-dependence (bypass the hv round). Priced openly: the filed accOracle gap (orc − two) per arm must NOT widen vs canonical, else the lift is oracle-dependence, not composition (filed as ORACLE-CHECK, load-bearing).
- L4 retention risk: compose price may reallocate capacity trunk-wide (U31e-D2 precedent). Priced by U34-RET.

## Paper predictions vs bench predictions

- Composition-pressure (own, scoped): pricing round-2 with clean signal during trunk training should lift two WITHOUT the copy-stage blindness (the price reaches the circuit while it forms). WHY owed if: c1 lifts two but scr collapses (reallocation, not learning — U31e-D2 at trunk scale) / oracle gap widens (shortcut, L3 trip) / c0 fails to replicate canon (pin broken — HALT, setup bug) / nothing moves (compose pressure saturates at this capacity — file, don't tune).

## Bars (quorum 2/3 unless noted)

- U34-PIN: stackHash == 258d2f06… in all 9 ledgers + c0 BIT-exact vs u33-canon-A 3/3 (maxAbsDiff 0.0). Miss = HALT (setup, no arms judged).
- U34-COMPOSE (the wall): two_c1 − two_canon ≥ +0.05, 2/3 seeds.
- U34-RET: scr_c1 ≥ scr_canon − 0.03, 2/3 (no retrieval collapse).
- U34-ORACLE-CHECK: (orc − two)_c1 ≤ (orc − two)_canon + 0.02, 2/3 (lift is composition, not oracle-dependence).
- U34-FLOOR: canon floor restated (scr ≥ 0.50, two ≥ 0.45) applies to c1/c2, 3/3.
- U34-FRESH: battery 3x IMPLEMENTABLE or adjudicated v1.1.
- Verdicts: COMP-PRICE-WORKS (COMPOSE + RET + ORACLE-CHECK) / COMP-PRICE-PARTIAL (COMPOSE hit but RET or ORACLE-CHECK miss — finding, not win) / WALLED-AGAIN (COMPOSE miss — trunk-scale blindness confirmed, file, don't tune).

## Staging + budgets

- Battery on THIS file first (3x sealed) -> v1.1 pins-only. Then driver (`newai-selfu34-driver.js`: oracle-aux train loop = u33 loop + one aux term, new paths) + Wave 1 (9T: c0/c1/c2 × 3 seeds) + Wave 2 (9E + bit/func compare vs canon + verdict) + transcript + CHATLOG + CURRENT_TASK. NO PUSH without explicit order.
- Compute: CPU/in-worker only. 9x800st small-MLP trains (~9s each, U33-measured) + 9 evals (~3 min). NO COMPUTE until battery adjudicated + fresh countersign for Waves 1-2 (this request covers prereg + battery only).
