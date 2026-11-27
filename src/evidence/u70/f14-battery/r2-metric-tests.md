# F14 battery r2 (metric-path tests: do T7/T8 prove the intervention landed; what leak could survive both)

1. **Verdict: NEEDS-PATCH**

2. **Hardest Falsifier: T8-T7 Logic Gap.**
T7 asserts the output is one-hot (z-part), and T8 asserts that the `u70nEval` output matches a manual call to `u70nApplyShuffle`. However, if `u70nEval`'s internal shuffle branch is simply broken (e.g., returning a constant or a mirrored failure), and the "manual" helper is also broken in the same way, T8 passes vacuously. 

To prove the intervention *actually* landed, you need a **cross-implementation check**: compare the output of the "fixed" `u70nEval` against a known-good, independent reference implementation of the TRUE shuffle (one that doesn't rely on the `u70nApplyShuffle` helper). Without this, T7/T8 only prove the code is internally consistent in its error, not that the "partial" leak (`+ c.q[k]`) is gone.
