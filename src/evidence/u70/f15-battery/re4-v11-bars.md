# F15 re-close re4 — bars (verbatim, 2026-11-28)

Angle: bars-unchanged plus variance descriptive: do unchanged F14 bars plus pool spread avoid tuning-to-reviewers

**VERDICT: STANDS**

1. **Step-Count/T9(d):** Valid. Total updates per seed are invariant; only the trajectory-switching frequency changes.
2. **Hidden Reset:** Necessary. Resetting hidden states at epoch start prevents the GRU from treating the 8-trajectory loop as a single long sequence, ensuring the "distribution effect" is the only variable.
3. **Pool-Mean:** Resolved. Using the pool mean as the representative value while filing the min/max prevents cherry-picking and corrects the category error.
4. **Bars/Variance:** Acceptable. Reusing F14 bars while reporting pool spread provides the necessary statistical context to determine if the "TRUE-gap" collapse is systemic or stochastic.

**Blockers:** None. The proposal isolates the training distribution without leaking into hyperparameter tuning. Proceed to smoke tests.
