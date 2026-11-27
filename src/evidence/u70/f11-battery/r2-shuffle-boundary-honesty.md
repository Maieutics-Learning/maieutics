=== R2 [shuffle-boundary honesty: is read-point ] ===
1. **Verdict: NEEDS-PATCH**

2. **Critique:** The premise claims to isolate "posterior leak-through" via a forward-pass fix (`onehot(shuffled)` $\rightarrow$ `onehot(original)`), while asserting the backward ST-surrogate remains untouched. This is a contradiction in terms. If the forward latent was "never discrete" (leaking continuous values), the gradient path computed by the ST-surrogate was operating on a different manifold than the proposed "fixed" discrete state. By changing the forward projection, you are not just "stopping a leak"; you are changing the objective function the optimizer sees.

3. **Falsifier:** Compare the gradients of the "leaky" vs. "fixed" forward pass. If $\nabla_{latent}$ differs significantly at the shuffle-boundary, the "paired retrains" are not comparing the same model with/without a leak, but two different optimization trajectories. The "leak-size" becomes an artifact of convergence, not a measurement of information smuggling.
