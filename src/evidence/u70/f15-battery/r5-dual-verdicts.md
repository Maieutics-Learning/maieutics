# F15 barrage r5 — dual verdicts (verbatim, 2026-11-28)

Angle: dual verdicts: can TRAIN-pool/HELDOUT split hide or smuggle a win

1. **Verdict**: NEEDS-PATCH.

2. **Falsifier**: Compare `TRAIN-pool` mean vs. `TRAIN-single` (canonical) performance on the same seed. If the model generalizes to the pool but fails the single-trajectory probe, the "win" is a distribution artifact (smoothing), not a representational gain.

3. **Reasoning**: A "win" can be smuggled by averaging performance across 8 diverse trajectories in the training pool, masking the failure of the model to actually resolve the latent state for any *specific* trajectory. If the `HELDOUT-DEGRADES` result persists while `TRAIN-pool` improves, you haven't fixed the root cause; you've merely expanded the training set to include the test-like variance of the pool. The split hides the failure if the `TRAIN-pool` metric is a mean rather than a per-trajectory minimum.
