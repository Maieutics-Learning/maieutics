=== RE2 [does the verdict firewall hold (absolute bars] ===
1. STANDS.

2. Falsifier: **The "Backward-Only" Gradient Hypothesis.** 
The premise claims the repair is "forward-only" because the ST surrogate already exists in the backward pass. However, if the original forward pass was non-discrete (continuous), the analytic gradient $\frac{\partial L}{\partial z}$ was likely operating on a different manifold than the intended discrete jump. The hardest test is to verify if the manual backward pass—which assumes a specific $\text{softmax}$ Jacobian—was actually mathematically consistent with the *incorrect* forward implementation. If the backward pass was "correct" for a "wrong" forward op, the paired retrains may show a "repair" that is actually just a shift in optimization landscape, not a fix of a leak.
