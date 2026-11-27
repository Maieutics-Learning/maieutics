# F14 battery r7 (oracle reuse: is citing F13 ceiling without recompute sound)

1. **Verdict: STANDS.**
The proposal is technically sound because the oracle ceiling is a property of the *task* (the Bayesian limit of the hidden state given the observations), not a property of the *intervention* (partial vs. TRUE shuffle). Since the oracle is defined by the ground-truth context and the observation stream, the ceiling remains constant regardless of whether the neural probe is measuring a partial or a true latent intervention.

2. **Hardest Falsifier: The "Oracle-Leak" Divergence.**
Run a "Perfect Oracle" under the TRUE-shuffle intervention. If the TRUE-shuffle oracle’s `ctxAcc` or `ECE` deviates from the F13 partial-shuffle oracle by $>0.01$, the "task" has fundamentally changed, rendering the F13 ceiling invalid. If the oracle is truly an oracle of the *context*, the intervention method (how we mask the latent) should not shift the theoretical maximum performance of a Bayesian observer.
