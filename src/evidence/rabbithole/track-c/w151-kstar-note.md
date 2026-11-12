# W151exec — K-star settling (C; backlog-W131)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 1 sandbox spec-grid, floor)
- Grid (N=20, K ∈ {2,4,6,8,12,20}, criterion pCover≥0.9, 200 trials): bias-schedule {const-0.1, ramp, stall-triggered} × rounds {5, 10, 20}. K*/N: const → 0.6/0.6/0.6 (rounds DON'T move it — weak bias re-serves the same head forever); ramp → 0.4/0.3/0.2; stall → 0.4/0.3/0.3.
- Settled, but as a MAPPING, not a number: K* ranges 0.2–0.6 across the spec grid. W110's lost 0.2 reproduces in exactly one corner (ramp × 20 rounds) — it was the efficient-steering corner all along, misread as the default. The floor logic holds in all 9 cells (K* ≥ N/rounds, slack 2–6×).
- Standing rule: bare K/N ratios are banned from the ledger — every K* ships with (bias-schedule, rounds, criterion), and the default moves from "0.2" to "map + floor": start at max(N/rounds × 3, small-K probe), steer by measured coverage.
- Verdict USED (mapping + floor rule + 0.2 located). No precursor, no conflict. Adaptive steering (bias that prices itself toward minimal K*; close the loop) spawned W148.

## Tangential (reasoning, 0 spend)
- Some constants are points; this one was a landscape photographed from one hill. The settling didn't shrink the number — it grew the coordinates. When a constant won't settle, check whether you're arguing about a value that only exists as a function of things you forgot to write down.

## Spend / queue
- Spend: 0 + 0 + 1 spec-grid (floor). Consumed backlog-W131 removed; spawned W148 to BACK. Backlog 17. Synthesis R22 clock: 4/5.
