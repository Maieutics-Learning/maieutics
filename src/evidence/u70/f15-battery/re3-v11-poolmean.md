# F15 re-close re3 — pool-mean (verbatim, 2026-11-28)

Angle: pool-mean category-error gloss: is pool-mean the right TRAIN quantity now

**Verdict: STANDS**

1. **Step-count T9(d):** Resolved. Total budget is fixed; round-robin distribution does not alter global step count, maintaining isolation of the training distribution variable.
2. **Hidden-reset:** Resolved. Explicit resets at epoch start negate periodicity/leakage risks associated with the 8-trajectory cycle.
3. **Pool-mean category-error:** Resolved. Defining the TRAIN quantity as the pool-mean (with min/max as descriptive variance) correctly aligns the metric with the stochastic nature of the expanded training set.
4. **Bars/Variance:** Resolved. Use of F14 verbatim bars ensures the delta is purely a result of the distribution shift, not a moving target.

**Blocking:** None. The protocol now technically isolates the "single vs. multi-trajectory" effect. Proceed to smoke test.
