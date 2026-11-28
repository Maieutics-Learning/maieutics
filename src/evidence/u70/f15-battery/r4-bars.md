# F15 barrage r4 — bars (verbatim, 2026-11-28)

Angle: bars: are F14 bars fair unchanged on a new training surface, or does the surface change demand re-derivation

1. **Verdict: NEEDS-PATCH**.
2. **Reasoning**: F14 bars measure a model overfit to a single trajectory ($\text{steps}=200, \text{diversity}=1$). F15 shifts to a round-robin surface ($\text{steps}=200, \text{diversity}=8$). This is not a neutral swap; it is a fundamental change in the optimization landscape. Using F14 bars as a fixed benchmark ignores the expected regularization effect of multi-trajectory training. If F15 "fails" to hit F14's train-probe but "wins" on held-out, the F14 bars render the result ambiguous (underfit vs. generalized). Re-derivation of the "success" threshold is required to account for the diversity-induced variance.
3. **Hardest Falsifier**: **Cross-Pool Variance Test**. Compare $\text{Var}(\text{probe})$ across the 8 pool-trajectories vs. the single F14 trajectory. If the variance is high but the mean matches F14, the "win" is a stochastic artifact of the pool selection, not a structural improvement in context-inference.
