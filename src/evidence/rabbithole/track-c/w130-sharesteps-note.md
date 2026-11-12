# W130exec — share-x-steps interaction (B; backlog-W113)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 1 live-page bench grid)
- Grid: constant aux shares {0, 0.25, 0.5, 1.0} × steps {120, 300, 600} × seeds {7, 8} (24 runs, assocR attn h16, W109 protocol). Q: does the optimal share rise with training length?
- 120 steps: means .739 / .748 / .741 / .750 — flat, and seed-7 column (.722/.741/.736/.722) replays W109 EXACTLY. Replication in the strictest sense: same seed, same numbers.
- 300 steps: means .762 / .734 / .748 / .762 — tie between 0 and 1.0, middle sags.
- 600 steps: means .743 / .732 / .743 / .778 — edge to full aux (1.0), driven by seed-7 .801.
- Against interest: seed spreads within a cell run 0.03–0.06, ≥ the between-share gaps. Seed 7 alone says full-aux rises monotonically; seed 8 alone says no trend at all. The optimum does NOT cleanly rise — the honest reading is noise ≥ effect at n=2, with a suggestive (not established) full-aux edge at 600.
- Verdict USED (interaction table + replication + stated resolution limit). No precursor, no conflict. Resolution run (4+ seeds/cell) spawned W130.

## Tangential (reasoning, 0 spend)
- This grid is the case study the reprobe-budget wave (backlog-W127) is waiting for: a 0.035 effect fished with n=2 seeds where cells wobble ±0.05. Interaction-hunting needs seed budgets scaled to the effect size, not the grid size — the grid was 12 cells, the budget was 2.

## Spend / queue
- Spend: 0 + 0 + 1 bench grid (~2 min). Consumed backlog-W113 removed; spawned W130 to BACK. Backlog 17. Synthesis R19 clock: 1/5.
