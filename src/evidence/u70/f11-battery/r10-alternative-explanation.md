=== R10 [alternative explanation: one rival mecha] ===
1. **Alternative Explanation**: Any observed performance drop (REGRESSED) or stability (REPAIRED) may not be due to the removal of "posterior leak-through" via discrete latents, but rather a shift in the gradient landscape caused by changing the forward pass to a different stochasticity regime. The model may simply be failing to converge with the new forward-pass noise, regardless of "leakage."

2. **Killer Test**: **Ablated-Noise Baseline**. Run the original (leaky) forward pass but replace the discrete latent with a continuous Gaussian noise source of equivalent variance. If the performance gap persists between the "fixed" F11 and this "continuous-leaky" baseline, the result is an implementation artifact, not a leak-correction.

3. **Verdict**: **NEEDS-PATCH**. The paired-retrain logic is insufficient to isolate the specific mechanism of "leakage" from general training instability induced by changing the forward pass.
