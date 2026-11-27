=== R3 [test strength: do T1-T4 prove what they ] ===
1. **Verdict: NEEDS-PATCH.**

2. **Analysis:** The premise claims F11 isolates "posterior leak-through" via 20 paired retrains. However, altering the forward pass from continuous to discrete (ST) changes the fundamental optimization landscape, not just the "leak." Because the forward pass defines the objective function's surface, the "paired" seeds are no longer comparing the same model under different leaks, but two different model architectures. This introduces a massive confounding variable: the "repair" itself changes the training dynamics, making the "leak-size read" theoretically invalid.

3. **Hardest Falsifier:** Compare the *gradient variance* of the original vs. repaired models. If the repair is merely closing a leak, the variance should remain stable; if the "repair" fundamentally alters the latent space representation, the "leak" is a red herring and the performance shift is actually due to regularization/discretization effects.
