=== R5 [paired-comparison validity: is same-seed] ===
1. **Verdict: NEEDS-PATCH.**

2. **Critique:** Paired-comparison using identical seeds is invalid here. You are altering the forward pass (discrete latent repair), which fundamentally changes the gradient flow and the loss landscape. Because the "forward change alters training dynamics," the same seed in F11 will traverse a different optimization trajectory than in F4. Any delta in performance cannot be attributed solely to the "repair" vs. "leak" but rather to the fact that the model is now optimizing a different objective function from step zero. You are comparing two different models, not two versions of the same model.

3. **Hardest Falsifier:** Run a "Null-Repair" control: re-run F4 seeds with a functionally identical but computationally distinct change to the forward pass. If the performance delta persists, your pairing is noise; the dynamics are seed-sensitive to the implementation, not just the logic.
