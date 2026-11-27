=== R8 [determinism: replication conventions int] ===
1. **Verdict**: NEEDS-PATCH.
2. **Falsifier**: The claim that "backward already implements the ST surrogate" while the "repair is forward-only" is a red flag for replication. If the forward pass was non-discrete (continuous), the gradients were flowing through a continuous path. Switching to a discrete forward pass *without* altering the backward pass to specifically handle the Straight-Through (ST) gradient identity ($\frac{\partial \text{out}}{\partial \text{in}} = 1$) creates a mismatch between the actual computation and the gradient approximation. 

**Hardest Test**: Perform a gradient check on the 2-line repair. If the backward pass is not explicitly coupled to the new discrete forward state, the "repair" is merely a projection at inference, and the training dynamics remain leaky. Without a verified $\nabla$ identity, the 20 paired retrains measure noise, not a fix.
