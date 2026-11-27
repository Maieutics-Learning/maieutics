=== R9 [halt conditions: what stops a bad run] ===
1. **Verdict:** NEEDS-PATCH.

2. **Critique:** The premise assumes a "forward-only" repair is sufficient because the "gradient path pre-exists." This is a dangerous assumption in custom ST (Straight-Through) implementations. If the forward pass was previously continuous (non-discrete) but the backward pass was already treating it as a discrete jump (ST surrogate), the model was training on a gradient mismatch. Fixing the forward pass to be discrete without verifying the exact alignment of the surrogate gradient with the new discrete boundary risks introducing training instability or divergence that masks the "leak" effect.

3. **Falsifier:** Compare the gradient of the loss with respect to the latent state $\nabla_z L$ exactly one step before and after the repair. If $\nabla z_{old} \neq \nabla z_{new}$ despite the "gradient path pre-existing," the repair is not isolated and the paired-retrain is confounded.
