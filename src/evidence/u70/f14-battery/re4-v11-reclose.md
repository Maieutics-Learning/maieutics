# F14 re-close re4 (re-close rejections: rewrite-arm, bar-move, inverted-shuffle, heldout-void, SHA-churn, new-seed arms)

1. **NEEDS-PATCH**.
2. **Residual:** The "Independent Recompute" (T8b) is a verification of implementation, not a falsifier of the underlying claim. The hardest remainder is the **Held-out Validity Gap**. Seeds 20..39 were already "spent" in F13 to measure a partial-shuffle collapse. Using them again for F14 to measure a TRUE-shuffle collapse is a repeated-sample violation. To be scientifically sound, F14 requires a fresh, unseen held-out set to prove the intervention generalizes beyond the F13-contaminated set.

**Technical Critique:**
- **Smuggling:** Retraining F12-exact weights is safe, but re-evaluating them on the same seeds (20..39) that showed degradation in F13 creates a dependency. You are testing if the "fix" works on a dataset the model's failure was already quantified against.
- **Metric Path:** T7/T8b effectively kill the "leak" hypothesis. If T8b passes, the `+q` artifact is gone.
- **Symmetry:** The claim that "training is identical" isolates the variable to the eval-branch, which is the only valid way to close F13's failure.
