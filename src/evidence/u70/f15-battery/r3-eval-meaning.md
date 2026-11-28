# F15 barrage r3 — eval meaning (verbatim, 2026-11-28)

Angle: eval meaning: is pool-mean the right TRAIN quantity, or should TRAIN stay single-canonical

1. **Verdict: NEEDS-PATCH**.

2. **Reasoning**: Using pool-mean for TRAIN quantity creates a fundamental mismatch in the "training surface" versus "evaluation surface." If the model is trained on a pool of 8 trajectories but evaluated on a single-canonical "TRUE" interventional path, you are measuring the model's ability to generalize *across* trajectories, not its ability to resolve the latent state of a *specific* trajectory. If TRAIN is a pool-mean, the "win" is merely an averaging effect (smoothing), not a causal inference of the latent state. TRAIN must remain single-canonical to prove the model actually learned the mapping from observation to latent state, rather than just learning a centroid of the distribution.

3. **Falsifier**: Compare `TRAIN-pool-mean` vs. `TRAIN-single-trajectory` (where the single trajectory is one of the 8 used in the pool). If the pool-mean is high but the single-trajectory probe is low, the model is simply averaging, not inferring.
