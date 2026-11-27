# R3 — bar fairness (F13 v1.0 barrage, 2026-11-27)

VERDICT: NEEDS-PATCH

1. **Falsifier:** Compute the Bayesian oracle ceiling specifically for seeds 20..39; if $\text{ceiling}_{\text{held-out}} \neq \text{ceiling}_{\text{train}}$ (within $\epsilon$), the F12-derived bars are invalid.
2. **Reason:** Applying training-trajectory performance bars (0.70/0/0.85) to held-out data assumes distribution invariance across seeds; any shift in the oracle's ceiling on the new seeds renders the "GENERALIZES" vs "DEGRADES" verdict mathematically meaningless.
