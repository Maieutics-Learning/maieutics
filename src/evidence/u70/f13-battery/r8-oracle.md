# R8 — oracle Phase A (F13 v1.0 barrage, 2026-11-27)

VERDICT: NEEDS-PATCH

1. The "Oracle Ceiling" on seeds 0..19 is a training-distribution metric; there is no guarantee the task difficulty remains invariant on seeds 20..39.
2. If the held-out ceiling drops (task becomes easier) or spikes (task becomes harder), the neural model's delta relative to the oracle is meaningless for measuring generalization. You are comparing a new-distribution model against a new-distribution oracle, but using a training-distribution expectation of "fairness." This masks whether the model is actually generalizing or simply benefiting from a lower-entropy held-out set.
