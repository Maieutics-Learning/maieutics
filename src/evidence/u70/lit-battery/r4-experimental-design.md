# Lit-lessons scout 4 (experimental-design)

1. Overclaim: B2. The claim that U70's switch-detection metrics (delay, FA, grace period) are a "correct operationalization" of hidden-state inference is an overreach. B2 (Sanders et al.) provides a theoretical framework for remapping, but it does not validate a specific set of hyperparameters (e.g., 10-trial grace) as "correct." This is an arbitrary design choice, not a derived necessity.

2. Kill-shot: The "10-trial grace" period. 
Verification: A control trial where the grace period is shifted (e.g., 2 vs 20 trials). If the "correctness" of the operationalization holds, the system's ability to distinguish true state-shifts from noise should not be fragile to this specific window. If the oracle's 0.95 ctxAcc relies on this arbitrary grace period to suppress FAs, the "inference" is a byproduct of the windowing, not the latent-state logic.