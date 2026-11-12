# W126exec — telemetry dashboard (B; backlog-W110)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + sandbox toy, floor)
- Dashboard spec: four live dials — eviction rate (/100 serves), regret rate, regret Wilson CI95, reprobe coverage. Alarm rules: STAGNATION (evict < 1/100), CHURN (> 15/100), MISCALIBRATION (regret CI excludes 0.25 AND reprobes ≥ 20).
- Demo (500 events): 6.2/100, regret 0.15, CI [0.052, 0.36], coverage 0.65 → nominal. The CI is the finding: [0.052, 0.36] swallows the 0.25 threshold — point estimates without uncertainty would false-alarm or miss. Alarms fire on CI EXCLUSION, never on point estimates, with minimum reprobe N.
- Reprobe budget (tightening the CI) spawned W127.
- Verdict USED (spec + CI discipline). No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- Every dial on this trail now ships with its uncertainty: permutation p (exact), tie triple (reported), regret CI (Wilson), debt (bounded). A number without its error bar is an anecdote with confidence — the dashboard refuses to be one.

## Spend / queue
- Spend: 0 + 0 + toy (floor). Consumed backlog-W110 removed; spawned W127 to BACK. Backlog 17. Synthesis R18 clock: 3/5.
