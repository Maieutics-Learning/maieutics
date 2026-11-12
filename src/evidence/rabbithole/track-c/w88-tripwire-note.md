# W88exec — quarantine-threshold calibration (B; backlog-W78)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + sandbox toy, floor)
- Calibration table (good rate 0.75 vs bad 0.30, 40 trials/cell): bad versions ALWAYS caught (detect 1.0 everywhere — the gap is wide). The tradeoff is lag vs false-quarantine of GOOD versions: T=0.55/W=12 (W67's default) false-quarantines 40% — too trigger-happy. T=0.45/W=20: lag 21, FP 0. T=0.55/W=20: lag 20, FP 0.10. T=0.45/W=12: lag 12, FP 0.10.
- Adopted default: T=0.50/W=16 (interpolated lag ~16, FP ~0.05); high-cost-quarantine mode T=0.45/W=20. Rollback is cheap (ancestor fallback, W67), so lean slightly aggressive — churn, not catastrophe, is the cost. No single optimum: the table IS the policy (pick by quarantine cost).
- Verdict USED (table + revised default). Quarantine churn cost (rollback frequency vs stability) spawned W95. No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- W67 shipped a default (0.55/12) that would have quarantined 40% of good hints — the toy caught it before the bench had to. Defaults are guesses wearing confidence; calibration tables are how guesses retire.

## Spend / queue
- Spend: 0 + 0 + toy (floor). Consumed backlog-W78 removed; spawned W95 to BACK. Backlog 17. Synthesis R12 clock: 1/5.
