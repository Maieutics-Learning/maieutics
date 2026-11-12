# W108exec — quarantine churn cost (B; backlog-W95)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 3 sandbox toys, floor)
- v1 (muddled rotation): aggressive wins (124 vs 393/341) — setup artifact, killed. v2 (no rotation): versions never deploy except after quarantine — broken model, killed (tp≈0).
- v3 (fixed deploy cadence/40, split FP/TP/exposure, price = 3·exposure + FP + 0.5·TP): aggressive 235 (31 FP churn), balanced 159 (1 FP), conservative 124 (0 FP). Ordering flips: with rare bad versions (5%), FP churn is the binding cost — catching fast costs more than it saves.
- Rule: lean conservative at low bad-rates; re-tune aggressive as observed bad-rate rises. The bad-rate comes from W93/W106 telemetry — the tripwire is now ADAPTIVE (threshold ← observed bad-rate), closing W78→W88→W95→telemetry into a control loop. Spawned W112 (adaptive tripwire).
- Verdict USED (2 kills + fixed-cadence table + adaptive rule). No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- The series is the lesson: v1 said "aggressive wins," v3 says "conservative wins" — same question, opposite answers, and the difference is entirely whether versions deploy on their own (they do). Model the world before pricing the policy; the first toy measured the harness, not the question (8th meter lesson).

## Spend / queue
- Spend: 0 + 0 + 3 toys (floor). Consumed backlog-W95 removed; spawned W112 to BACK. Backlog 17. Synthesis R15 clock: 3/5.
