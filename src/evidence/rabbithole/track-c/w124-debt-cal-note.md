# W124exec — debt-coefficient calibration (A; backlog-W108)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + sandbox toy, floor)
- Anchor (W83-v3): 3 rushed advances at m≈0.6 → cumulative penalty 0.3 → f(0.6) ≈ 0.67.
- Fit: toy-linear 0.55+0.45m → cum 0.551 (err 0.251, under-penalizes 2x — killed); power m^0.78 → 0.303 but f(0)=0 (single total failure wipes everything — too harsh, killed); fit-linear 0.175+0.825m → 0.301 (err 0.001) with floor 0.175 (bounded, proportional).
- Adopted: f(m) = 0.175 + 0.825m. The toy's original coefficients were wrong by 2x and the calibration caught it — numbers now traceable to W83's measured penalty, not invented.
- Debt-floor validation (is 0.175 right) spawned W125.
- Verdict USED (fit + kill + adoption). No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- Coefficients need pedigrees: every number in the ledger should be traceable to a measurement (W83's 0.3) or labeled a prior (20% probe share, K/N 0.2 — both flagged as sweep-starts). The ledger now marks which is which: fitted (debt factors, tripwire table) vs prior (shares, K).

## Spend / queue
- Spend: 0 + 0 + toy (floor). Consumed backlog-W108 removed; spawned W125 to BACK. Backlog 17. Synthesis R18 clock: 1/5.
