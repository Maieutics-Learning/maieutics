# W106exec — eviction telemetry (B; backlog-W93)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + sandbox toy, floor)
- Spec: log every eviction {hint id, time, reason (stale/low-posterior/TTL), posterior at evict}; reprobe evicted hints after delay; regret = useful-at-reprobe. Dials: eviction rate (≈0 = stagnation alarm) + regret rate (>0.2 = too aggressive).
- Toy (30 hints): threshold 0.2 → 0 evictions (stagnation caught); 0.4 → 5 evictions, regret 0.20; 0.6 → 17 evictions, regret 0.18. Both failure directions visible — too lax AND too aggressive.
- Loop closed: W78 tripwire sets thresholds → W93 telemetry judges → W95 churn prices. Thresholds are now tunable from data, not guesses (defaults-retire pattern, R13).
- Verdict USED (spec + table + loop). Telemetry dashboard (live eviction/regret dials) spawned W110. No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- Postmortems are generational memory for the CACHE (W65's priors are memory for teaching; W93's log is memory for forgetting). A system that remembers what it forgot, and whether it should have, can tune its own amnesia.

## Spend / queue
- Spend: 0 + 0 + toy (floor). Consumed backlog-W93 removed; spawned W110 to BACK. Backlog 17. Synthesis R15 clock: 1/5.
