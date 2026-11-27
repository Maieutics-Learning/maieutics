# U70-prereg scout 1 (implementability)

1. **Kill-shot:** The "batch=whole 300-trial run" training specification is computationally incompatible with the "best-by-train-loss" 5-restart selection process for a GRU-64. Processing 300 sequential steps as a single batch triggers vanishing/exploding gradients in the BPTT window and prevents the model from learning the temporal dependencies required to pass G1 (detDelay) and G3 (maskedAcc). The model will either fail to converge or collapse to a reactive policy (V1), rendering the causal-use gap (G4) uninterpretable.

2. **Cheapest Fix:** Change "batch=whole 300-trial run" to "truncated BPTT (window=25)" or "stochastic mini-batching over shuffled trial-segments," and lock the number of restarts to 5 per seed-path.