# W119exec — mask-vs-magnitude split (A/B; backlog-W104)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + sandbox toy, floor)
- Toy (150 pulls, mask {0,2} known): mask-split 62 solves vs flat-12-arm 61 vs hierarchical 41. Hard mask beats soft sharing — eliminating 6 dead arms entirely beats sharing posteriors about them; hierarchical still pays to explore dead slots.
- Caveat (load-bearing): mask assumed KNOWN from ablation (W58). Mask errors flip the ranking — a wrong mask is worse than no mask. Adopted two-phase: ablation learns mask → Thompson exploits within mask → telemetry (W93) watches staleness → re-ablate on drift. Mask refresh cadence spawned W121.
- Verdict USED (split + caveat + two-phase). No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- Knowing what's dead beats debating how dead: the mask is a decision, the posterior is a deliberation. Decide once (ablate), deliberate within (Thompson), re-decide on drift (telemetry). Three beats, one loop.

## Spend / queue
- Spend: 0 + 0 + toy (floor). Consumed backlog-W104 removed; spawned W121 to BACK. Backlog 17. Synthesis R17 clock: 2/5.
