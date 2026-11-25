# Self E2b delta-prereg: full controls on frozen E2 trains (eval-only, no retrain; PROPOSED; pre-countersigned)

Agent approval: this file. Pre-countersignature (user 2026-11-25): this spec + battery (3x sealed) + driver ext + 6E-controls + verdict under same bars/discipline. CPU/in-worker only. NO GPU. NO PUSH without explicit order. Pool = sealed reviewer labor only. R=3 seeds 0,1,2, quorum 2/3, COMPLETE-gated, twin-matched seed-only streams, paired evals. Corrections append-only.
Standing orders: push only on order; every paper-divergence gets filed WHY; log everything for contextless replay.

## Record-search (already-run / nearest prior / what differs)
- E2 APPETITE-FAIL (Turn-130, d-newai-self-e2-verdict.json): E-RECALL 0/3 (+0.015/-0.046/-0.091), TAKEN-LIFT 1/3 (+0.008/+0.022/+0.092), mFinal 0.85/0.70/0.70 saturates, shuf mirrors comp. Deviations D1-D4 filed: eta fixed 0.3, tau deferred, ORDER/NO-HARM/frozen-m/zero-rehearsal UNMEASURED owed as E2b, SPEED as E2c.
- A1 COMPUTE-ONLY / A2 REHEARSAL-DEAD: post-hoc diet replay dead; E2 query-time momentum also flat so far. E2b isolates whether momentum does anything at all vs general priming.
- What differs vs E2: ZERO new trains. Loads existing e2-comp (code 177) / e2-shuf (178) 800st trains s0/s1/s2. Four eval-only controls on identical held-out rows (69300+seed family N=200, same miner/oracle probes): (C1) frozen-m (m pinned 0.5, rehearsalVec 0); (C2) zero-rehearsal (tau(m) live, b=0); (C3) shuffled-order (same 200 rows permuted, momentum integrates in shuffled order); (C4) sequential (E2 original, for ORDER contrast). NO-HARM = post-failure rows vs frozen-m rows.

## Design
- Frozen: W6-s / M2-nb-s; U17 L*; U5-old; U21-lowfold; U22c-scale OOD; E2 P weights loaded verbatim.
- Forward: u26PoolForward + summary bias m*rehearsalVec, tau(m)=1.0-0.5*m (E2 recipe). C1 pins m=0.5/b=0. C2 keeps tau(m) live, b=0. C3 same as sequential but row order permuted with seed-matched permutation (rng 81000+seed).
- Diet/streams/evals: held-out 70300+seed N=200 vhat-hard mining (u23bVhatKeep), standard N=200 twin-matched, OOD frozen scale, miner/oracle floors. VOID iff oracleY<=0.20 2/3.
- Arms: e2-comp / e2-shuf × 4 controls. 12E-controls total (6 trains × 2 orders × 2 ablations collapsed to paired ledgers).

## Bars (quorum 2/3)
- E2b-ORDER: sequential eRecall minus shuffled eRecall >= +0.05 2/3 (order-driven, not diet).
- E2b-NO-HARM: post-failure acc >= frozen-m acc -0.03 2/3.
- E2b-TAU-ONLY: zero-rehearsal takenLift vs full: report only (isolates temp vs bias).
- E2b-FROZEN-BASE: frozen-m hardY vs E2 sequential hardY: report only.
- E2b-HARD >=0.60 2/3, E2b-STD within +-0.05 W6 2/3, E2b-FRESH 4/4.
- Verdicts: CONTROLS-CLEAN (ORDER+NO-HARM hold, effect is real but weak) / CONTROLS-FLAT (all ~0, momentum does nothing — kill appetite, pivot to surprise/delta) / CONTROLS-PRIMING (shuffled==sequential, general priming not selective) / VOID / BREACH.

## Staging + budgets
- Battery on THIS file first (3x sealed) -> v1.0 STANDS or pins-only.
- Then driver ext newai-selfe2b-driver.js (eval-only, loads E2 P, no optimizer) + 6+6 control evals + verdict d-newai-self-e2b-verdict.json. Transcript + CHATLOG + CURRENT_TASK. PUSH only on order.
- Compute: CPU/in-worker only, ~12 evals N=200 (minutes), COMPLETE-gated.
