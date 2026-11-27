# U70-prereg scout 8 (scope-thresholds)

1. **The Kill-Shot:** The G4 "causal-use" bar is mathematically underspecified. It requires `actionAcc(V3) - actionAcc(V4) ≥ 0.05`, but `actionAcc` is defined as "posterior-guided." In V4 (shuffled/frozen $z$), the "posterior" is by definition corrupted. If the model uses the corrupted $z$ to act, the gap is trivial. If the model ignores $z$ and defaults to `cueActAcc`, the gap is merely the difference between V3's performance and the baseline. The prereg fails to define if the action selector in V4 is *forced* to use the shuffled $z$ or *allowed* to ignore it.

2. **The Fix:** Lock the V4 action selector to the corrupted $z$ (forced-use) and define the gap as: `actionAcc(V3) - max(cueActAcc, actionAcc(V4)) ≥ 0.05`.