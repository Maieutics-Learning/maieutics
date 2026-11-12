# W102exec — probe difficulty ladder (A; backlog-W90)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + sandbox toy, floor)
- Flip-flop: last-token baseline flat ~0.63 across distances 1–16 (this floor doesn't ladder — recorded, not hidden). The ladder lives on the MODEL side: rungs = read distances 1/2/4/8/16/32, pass = ≥0.90 (true latch = 1.0 everywhere; decay profiles diagnose memory horizon).
- Dyck: random-valid-guess baselines ladder cleanly — K=1: 1.00 (degenerate, excluded — one valid move ever, zero information); K=2: 0.75; K=3: 0.69; length T barely matters (8 vs 16 identical). Rungs = K=2/T8 → K=2/T16 → K=3/T8 → K=3/T16; depth, not length, is the dial.
- Verdict USED (ladder spec + honest flat floor). Latch-rung bench runs spawned W107. No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- A degenerate rung (Dyck K=1, baseline 1.00) is a probe that cannot fail — it measures nothing and flatters everything. Every battery needs its K=1 audit: find the rung that passes by construction and cut it.

## Spend / queue
- Spend: 0 + 0 + toy (floor). Consumed backlog-W90 removed; spawned W107 to BACK. Backlog 17. Synthesis R14 clock: 3/5.
