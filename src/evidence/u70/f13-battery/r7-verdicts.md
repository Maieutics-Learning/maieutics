# R7 — verdict-rule gaming (F13 v1.0 barrage, 2026-11-27)

VERDICT: NEEDS-PATCH

1. **Hardest test:** A "Degrades" result where the model maintains high absolute accuracy but fails the paired delta ($\Delta \approx 0$) compared to the training-trajectory baseline.
2. **Reason:** If "Generalizes" is defined by maintaining training-level performance on held-out seeds, a model could simply overfit a global bias or a coarse-grained state-space common to all seeds, meaning it "generalizes" without actually mastering the context-inference task. Conversely, "Degrades" might not indicate a failure to generalize, but rather a fragile harness/probe that breaks under the slight distributional shift of new trajectories.
