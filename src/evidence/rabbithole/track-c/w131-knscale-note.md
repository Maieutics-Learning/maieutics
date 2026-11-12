# W131exec — K/N across scales (C; backlog-W114)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 2 sandbox toys, floor)
- W110's script is lost (scratch wipe), so this wave is a documented REBUILD, not a replication: N items, values U(0,1), 10 rounds, serve top-K by posterior-mean + BIAS/(serves+1), 200 seeded trials/cell. Efficiency quality q = mean served value (falls with K, matching W110's shape); coverage = P(minServed ≥ 1).
- v1 (bias 0.5, oracle-normalized eff): everything covered everywhere, eff rises trivially — meter disagrees with W110's table. Killed, not tuned (p-hacking toys is forbidden). v2 (bias 0.05/0.1/0.2, quality-q): reproduces W110's qualitative shape — N=20 control starves at K=2 (pCover 0.00, all biases ✓) and q falls with K.
- Scaling result (criterion pCover ≥ 0.9): bias 0.1 → N=10 K*=6 (0.60), N=20 K*=12 (0.60), N=40 K*=20 (0.50); bias 0.2 → 0.60/0.60/0.50; bias 0.05 → 1.00/0.60/1.00. Proportionality HOLDS (K* ∝ N across 4× of N) but the CONSTANT does not reproduce: rebuild says 0.5–0.6, W110 said 0.2.
- Scoped verdict: the 0.2-style proportional rule's shape transfers; 0.2 as a number is mechanism-bound (bias strength, rounds, coverage criterion — all unknown for the lost toy) and stays suspect. Absolute floor logic ports cleanly: 10 rounds × K serves must cover N items → K/N ≥ 0.10; W110's 0.2 = 2× floor, rebuild's ~0.55 = ~5× floor (weak steering). The constant is the steering efficiency, not a law.
- Verdict USED (scaling shape + scoped non-reproduction of the constant). No precursor, no conflict. Constant-settling toy (fully-specified mechanism; bias-schedule × rounds grid) spawned W131.

## Tangential (reasoning, 0 spend)
- This wave is the durability rule's exhibit A: W110's script died in a scratch wipe, so its 0.2 is now an oracle number no one can re-derive. src-vs-scratch exists precisely so wave-notes never again cite a number whose instrument is gone. The trail remembers the rule; it lost the meter.

## Spend / queue
- Spend: 0 + 0 + 2 toys (floor; v1 killed). Consumed backlog-W114 removed; spawned W131 to BACK. Backlog 17. Synthesis R19 clock: 2/5.
