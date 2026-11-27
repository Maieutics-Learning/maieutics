# F14 battery r1 (eval-only change: does retraining vs re-evaluating filed weights smuggle anything; is replication sanity expect-0 sound)

1. **Verdict: STANDS.** The protocol isolates the variable (eval-path edit) by freezing the weights (F12-exact) and the training regime. By retraining and re-evaluating, the author establishes a "clean" baseline for the new metric, preventing the "smuggling" of performance gains from a flawed evaluation of existing weights.

2. **Hardest Falsifier:** The **Train-Clean Replication Sanity**. If the `train-clean` eval of the F12-exact retrains deviates by even one bit from the filed F12 results, the "training is identical" claim is falsified. This proves the environment/engine is unstable or the "exact" seed/stream reproduction is flawed, rendering the subsequent TRUE-shuffled deltas mathematically suspect.
