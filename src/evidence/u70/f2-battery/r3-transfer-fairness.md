# U70-F2 scout 3 (transfer-fairness)

1. **Invalid Baseline Comparison:** The proposal compares F2 (z-onehot head) against V2 (h-only, no z). Because F2 possesses a structural bottleneck (z-probe) that V2 lacks by design, the "transfer advantage" in Phase 2 is a measurement of architectural difference, not a measurement of learned representation transfer.

2. **Smuggled Capacity Gain:** By unifying representation and use (policy posterior = z-probe), F2 forces a specific gradient flow that V2 cannot replicate. Any observed advantage in N1-N4 is contaminated by the structural cut, rendering the "frozen transfer" result uninterpretable as a purely behavioral or representational victory.

3. **Bar Failure:** The "direction count" (≥3/4 regimes) is statistically underpowered for $N=20$ per regime given the noise in novelty transfer; it lacks a significance threshold, risking a "Mixed" verdict via noise.