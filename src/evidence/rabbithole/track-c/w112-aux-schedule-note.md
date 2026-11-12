# W112exec — distortion-aware aux schedule (A/B; backlog-W98, bench: src/tinynn)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + bench runs, gated-unblocked)
- Bench (assocR attn h16, 150 steps, auxW constant-1.0 vs linear→0 vs expo→0): acc 0.741 / 0.731 / 0.741. FLAT — schedule moves nothing at this budget. Honest non-result, kept.
- Adopted anyway, on structure not delta: (1) distortion-safety — high early aux is safe only if it anneals (W91's auxW4 derailment is permanent under constant, transient under anneal); (2) severance-readiness — schedules end at 0, so the student is hint-free by construction at cutoff (fade-compatibility, D2). The schedule's value is where it ENDS, not what it adds.
- Severance-readiness probe (scheduled vs constant under abrupt cutoff) spawned W115.
- Verdict USED (flat bench + structural adoption, honest). No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- Flat results are verdicts too: the schedule doesn't buy accuracy, it buys safety. Pricing safety at zero accuracy cost is a purchase — the ledger records what was paid (nothing) and what was insured (against distortion + severance shock).

## Spend / queue
- Spend: 0 + 0 + bench (~2 min). Consumed backlog-W98 removed; spawned W115 to BACK. Backlog 17. Synthesis R16 clock: 1/5.
