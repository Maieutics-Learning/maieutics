# F15 barrage r1 — pool size (verbatim, 2026-11-28)

Angle: pool size: is K=8 the right diversity-vs-exposure trade, does 25 exposures/trajectory risk underfit-confound

1. **Pool Size/Exposure**: $K=8$ is an arbitrary hedge. With 200 epochs total, each trajectory is seen 25 times. Given GRU64 capacity, this is high-risk for overfit-to-pool rather than generalization. If $K=8$ fixes the "held-out" collapse, it's likely due to increased sample diversity, not a fix for the underlying capacity-distribution mismatch.

2. **Confound**: 25 exposures per trajectory is sufficient for the model to memorize the mapping of the 8 specific paths, potentially mimicking "learning" while remaining brittle. This risks confounding *distributional breadth* with *simple sample augmentation*.

3. **Verdict**: **NEEDS-PATCH**.

4. **Hardest Falsifier**: Compare the "Held-out TRUE" probe against a "Pool-out TRUE" probe (evaluating on a trajectory from the pool of 8 that was *not* used in a specific gradient update). If the model performs better on the pool-out than the held-out, you have not solved the generalization gap; you have merely expanded the memorization set.
