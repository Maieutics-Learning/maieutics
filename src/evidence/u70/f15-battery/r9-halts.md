# F15 barrage r9 — halts (verbatim, 2026-11-28)

Angle: halts: what stops a bad run

1. **Verdict**: NEEDS-PATCH.

2. **Halt Logic**: The premise lacks a defined "circuit breaker" for the compute wave. Because the total steps are held constant (200 epochs round-robin), the run cannot be halted by a traditional convergence metric without biasing the distribution effect. There is no specified early-stop criterion based on the F14 gap failure; if the model diverges or collapses early in the round-robin, the current plan blindly completes the 200 epochs.

3. **Hardest Falsifier**: The "Distribution-Step Trade-off." Since you are swapping 1 trajectory $\times$ 200 epochs for 8 trajectories $\times$ 25 epochs (total 200 updates), any "improvement" in held-out performance may be a byproduct of reduced over-fitting (regularization via diversity) rather than a "verified root cause" of the distribution. A rival mechanism is simply **reduced epoch-overfit**. The cheapest killer test: a control run of 1 trajectory $\times$ 25 epochs. If the gap remains, your "diversity" claim is falsified.
