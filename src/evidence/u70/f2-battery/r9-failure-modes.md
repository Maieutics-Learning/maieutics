# U70-F2 scout 9 (failure-modes)

1. **Invalid Baseline:** Phase 2 compares F2 (z-only head) against V2 (h-only, no z). Because V2 lacks the structural bottleneck/forcing of F2, it is not a controlled baseline for transfer; it is a different architecture. Any delta in `ctxAcc` is attributable to the structural cut, not the "transfer" of factorization.

2. **Smuggled Metric:** The `N3 novel-rho` regime uses descriptive metrics only, yet the "Bar" requires F2 to outperform V2 in $\ge 3/4$ regimes. If N3 is descriptive-only, the denominator for the win-rate is effectively 3/4, making the "3/4 regimes" bar a disguised "all-or-nothing" requirement for the remaining functional regimes.

3. **Verdict Leak:** `N2-TRANSFER` is triggered by direction count without specified CIs or effect size, risking a "win" based on noise in the $N=20$ per-regime samples.