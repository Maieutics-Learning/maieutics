=== R1 [forward-edit correctness: does fix (a) a] ===
1. **Verdict: NEEDS-PATCH**.

2. **Technical Critique**: The premise claims a "forward-only" repair to a discrete latent state while asserting the backward path already implements a Straight-Through (ST) surrogate. This is logically inconsistent. If the forward pass was previously continuous (leakage), the backward pass was calculating gradients through a continuous function. Implementing a discrete step in the forward pass *without* an explicit `backward()` override or a `detach()`-based ST-gradient bridge in the graph will either: (a) trigger a `NaN/Undefined` gradient at the discontinuity, or (b) use the identity gradient of the discrete op (which is zero), killing the learning signal. A "two-line" forward fix cannot magically align with a pre-existing manual backward path unless that path was explicitly designed to ignore the forward op's actual derivative.

3. **Falsifier**: A gradient-check unit test comparing $\nabla_{input} \text{Loss}$ for the "fixed" forward pass vs. the manual backward logic. If $\text{grad}_{forward} \neq \text{grad}_{manual}$, the repair is an illusion.
