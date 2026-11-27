# U70-F2 scout 7 (verdict-logic)

1. **Verdict-Logic Failure:** The "PROCEED" condition creates a logical contradiction. Phase 1 requires `F2-FIXED` (probe+gap pass), but Phase 2 compares F2 against V2. Since V2 is a "no-z" control, the bar `F2 ctxAcc ≥ V2 ctxAcc` is a triviality (z-onehot vs. nothing) that doesn't validate transfer, only presence.

2. **Transfer-Fairness Violation:** Phase 2 uses "frozen weights" transferred to novelty regimes without a baseline for *how* a z-probe responds to distribution shift. By measuring `actionAcc` vs `cueActAcc` across regimes, the proposal smuggles a "performance" metric into a "representation" test.

3. **Bar-Integrity Breach:** The `≥3/4 regimes` requirement is a disguised sweep. It allows F2 to fail catastrophically in one regime (e.g., N1 fast-switch) while claiming "TRANSFER" based on the others, masking a lack of robust generalizability.