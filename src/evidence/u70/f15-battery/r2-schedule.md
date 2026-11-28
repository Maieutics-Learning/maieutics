# F15 barrage r2 — schedule (verbatim, 2026-11-28)

Angle: schedule: does round-robin e-mod-8 smuggle order/curriculum effects, is there a cleaner schedule at identical steps

1. **Analysis**: Round-robin $e \pmod 8$ is a naive shuffle. While it maintains total step parity with F14, it introduces a periodic sequence of 8 distinct trajectories. If the model picks up on the sequence index (position in the 8-cycle), it may develop a temporal bias or a "slot-based" memory that doesn't generalize to the held-out set, which lacks this rhythmic structure. This is not a "curriculum" in the intentional sense, but it is an unintended periodic signal. A cleaner schedule would be a random permutation of the pool per epoch to break the $e \pmod 8$ periodicity.

2. **Verdict**: **NEEDS-PATCH**.

3. **Hardest Falsifier**: Compare the `HELDOUT-TRUE` performance of the $e \pmod 8$ schedule against a run using a randomly shuffled pool per epoch. If the shuffled pool outperforms the round-robin, the "win" was merely overfitting to the periodicity of the training loop.
