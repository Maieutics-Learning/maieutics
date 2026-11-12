# W90exec — expert-choice static-budget mapping (C; backlog-W80)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + sandbox toy, floor)
- Mapping (from MoR W70): fade budget as a TOKEN CAP — at most K hint-units per round; items compete by score = need + bias; losers accrue bias (+0.15/round unserved), winners reset. Balancing without auxiliary loss, exactly MoR's loss-free router bias, ported from FLOPs to hints.
- Toy (worker, seeded, 20 items, K=8, 10 rounds): capped 62 solves / 80 spent (1.29/solve, everyone served ≥1) vs uncapped 135 / 200 (1.48/solve). Cap buys efficiency (1.29 < 1.48) at 40% spend with full coverage; price is absolute throughput. Bias works: min-served 1, no starvation.
- Verdict USED (mapping + toy). K sizing (units per round vs generation count) spawned W97. No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- The cap turns hints from a faucet into a market: need bids, bias clears. Markets need losers to come back tomorrow — bias is the mechanism that keeps them bidding (same job as W85's optimistic loading: protect the unproven).

## Spend / queue
- Spend: 0 + 0 + toy (floor). Consumed backlog-W80 removed; spawned W97 to BACK. Backlog 17. Synthesis R12 clock: 3/5.
