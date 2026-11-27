# U70-prereg scout 7 (logging-gradients)

1. **Kill-shot:** The "best-by-train-loss" selection criterion (5 restarts) violates the "no post-data sweeps" and "no peeking" constraints. Selecting the best seed via train-loss before the held-out replication creates a selection bias—essentially a "mini-sweep"—that invalidates the fixed $N=20$ per-seed independence required for the G1-G5 gates.

2. **Fix:** Lock the seed selection. Use the first successful convergence or a pre-determined seed index. If restarts are required, the $N=20$ must be the average of the restarts or a strictly blind random draw from the 5, not a performance-based selection.

3. **Added value:** Previous scouts missed the conflict between "fixed N=20/variant" and "best-by-train-loss." A performance-based selection is a hyperparameters-optimization step masquerading as a seed-run, inflating the reported $p̂(c)$ and $actionAcc$ metrics.