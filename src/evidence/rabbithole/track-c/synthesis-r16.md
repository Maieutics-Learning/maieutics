# Synthesis R16 (waves 106–110; 0-fetch, queue-jump per rule 5)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Verdicts since R15 (5 waves, 5 verdicts)
- W106 telemetry: USED (postmortem spec; loop closed).
- W107 drift: USED (stale poisons 8/40; decay + cutoff).
- W108 churn: USED bench-table (2 kills; conservative wins; adaptive rule).
- W109 share sweep: USED bench (flat + low edge; toy falsified).
- W110 K sizing: USED (starvation binds; K/N=0.2 + coverage check).
- No conflicts, no precursors, no SKIPs, no UNRESOLVED. SKIP table unchanged. No 3-of-a-kind → no Anti-Pattern.

## New cross-wave convergences (4)
1. Control loops close everywhere: tripwire←telemetry←churn (W108), share-template→bench→falsification (W109), drift→decay→cutoff (W107). Three self-correcting loops spec'd this round — the system now tunes thresholds, shares, and memory from its own measurements.
2. Coverage is the binding constraint, third domain: hints (K/N + min-served), fade stages (coverage gate), probes (min-dwell). Efficiency is always the second question. The ethic is uniform: serve everyone first, spend where it pays second.
3. Stale kills: drift poisoning (8/40 < chance), aggressive FP churn (31), full-aux distortion (0.722). Three ways the past/default/full tax the present. Forgetting (decay/cutoff), conservatism (low FP), and partiality (0.25 share) are the same move: don't let old/loud/much drown the signal.
4. Bench falsifies toys, twice this round: W79's monotone (killed by W109 sweep), W95-v1's rotation (killed by v3). Toys that survive bench (tripwire table, K knee, drift poisoning) graduate to specs. The two-tier pipeline has a documented kill rate — toys are hypotheses with a ~40% mortality, which is exactly right for cheap probes.

## State
- Backlog 17, head W98 distortion-aware aux schedule. Bench batch 14+ items — execution over specs continues to be the priority; this round ran 1 bench wave (W109) + 4 toy waves.
- Conflicts ledger: both historical conflicts resolved, none open. R16 clock RESET 0/5.
