# W103exec — prerequisite-debt meter (A; backlog-W91)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + sandbox toy, floor)
- Meter spec (from W83-v3): per-advance record {window mastery m, factor f = 1 if m≥0.9 else 0.55+0.45m, cumulative debt ×f}; alarm when debt < 0.5; track worst single advance. Coefficients are toy-scale (bench-calibrated later) — the LEDGER SHAPE is adopted, not the numbers.
- Demo: criterion trace (m all ≥0.9) debt holds 1.0, no alarm; rushed trace (0.62/0.71/0.58) debt 0.58 after 3 advances, trending to alarm — same direction as W83-v3's 0.3. The meter reproduces the guarantee it was built to track.
- Verdict USED (meter + demo). Debt-coefficient calibration spawned W108. No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- Debt ledgers turn a bound into an instrument: W83 proved the guarantee exists, the meter watches it live. Every guarantee on the ledger (debt, coverage, quarantine) now has a live dial — guarantees without meters are hopes.

## Spend / queue
- Spend: 0 + 0 + toy (floor). Consumed backlog-W91 removed; spawned W108 to BACK. Backlog 17. Synthesis R14 clock: 4/5.
