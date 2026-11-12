# W71exec — ponder-cost for fade budget (A/B; backlog-W64)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + sandbox toy, floor)
- Design: price every hint level in ponder-cost (levelCost [0,1,2,4]); per-item compute budget; greedy allocation by marginal-gain/marginal-cost; unspent budget rolls to harder items. ACT ponder (W50) becomes the fade-budget currency: hints are not free, and uniform hints overspend on easy items.
- Toy (worker, seeded, 30 items, budget 60): greedy 17 solved vs uniform 16 at identical spend — direction runs right but separation is WEAK (+1; gain structure too flat). Honest mechanism-only result; magnitudes bench-gated. Real price calibration spawned W81.
- Verdict USED (design + weak-confirm toy). No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- Ponder-cost closes the loop with W68: the probe share and the hint budget are ONE budget in two currencies (information now vs scaffolding later). A single accountant can price both — Thompson picks where, ponder prices how much.

## Spend / queue
- Spend: 0 + 0 + toy (floor). Consumed backlog-W64 removed; spawned W81 to BACK. Backlog 17. Synthesis R9 clock: 2/5.
