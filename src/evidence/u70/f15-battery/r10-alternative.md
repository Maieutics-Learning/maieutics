# F15 barrage r10 — alternative (verbatim, 2026-11-28)

Angle: alternative: one rival mechanism for any F15 outcome plus its cheapest killer test

1. **Alternative Mechanism**: The observed "lift" in F15 is not a result of trajectory diversity, but rather a regularization effect stemming from the round-robin schedule acting as a implicit batch-normalization or noise-injection process, preventing the model from over-indexing on a single-path manifold.

2. **Cheapest Killer Test**: **Permuted-Single-Path Baseline**. Train a model on the same total number of steps and the same 8 trajectories, but present them as 8 separate blocks of 25 epochs (sequential) rather than round-robin. If the "lift" persists, the mechanism is trajectory-count (diversity); if it vanishes, the mechanism was the schedule's temporal interleaving (regularization).

3. **Verdict**: **STANDS**. The experimental design is tight, the pool is disjoint, and the metric path is frozen.

4. **Hardest Falsifier**: **Cross-Seed Variance Analysis**. If $\text{Var}(\text{Pool-Train})$ is significantly higher than $\text{Var}(\text{Single-Train})$, the model is merely oscillating between local minima of different trajectories rather than converging on a robust latent representation.
