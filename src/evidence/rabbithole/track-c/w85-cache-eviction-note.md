# W85exec — cache-eviction policy (B; backlog-W76)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 3 sandbox toys, floor)
- Policy: evict lowest Thompson posterior mean; posteriors update ONLY on use outcomes (never on misses); optimistic load (new entries seed A=6,B=2); evidence gate (only entries with ≥5 uses are evictable); slow decay toward prior (×0.92/10 queries); TTL as backstop.
- Toy v1 (HONEST BUG, killed): B[q]++ on cache misses — poisoned newcomers' posteriors for the crime of being uncached. Second-half 0.13 vs LRU 0.92. A miss is not a failure; the meter punished absence.
- Toy v2 (still 0.13): misses unpenalized, but newcomers enter at prior 0.5 BELOW incumbents (~0.8) → instantly evicted before proving themselves. Cold-start eviction — the cache equivalent of judging a student by their first answer.
- Toy v3 (adopted): optimistic load + evidence gate → second-half 0.92, parity with LRU. Parity on hit rate is the wrong triumph to claim; the real win is structural: eviction posteriors double as the quality signal (W65 router reads them, W67 quarantine trips on them). LRU knows recency; Thompson knows quality.
- Verdict USED (policy + 2 kills + parity-with-structure). Eviction postmortems (log evicted hints; feed W85 filter tasks) spawned W93. No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- The v1 bug is promotion-gate shaped (W3/W22): never punish for lack of opportunity — evaluate on attempts, backfill the unattempted (W68's real-data backfill, same mercy). Every selector on this trail keeps rediscovering due process.

## Spend / queue
- Spend: 0 + 0 + 3 toys (floor). Consumed backlog-W76 removed; spawned W93 to BACK. Backlog 17. Synthesis R11 clock: 4/5.
