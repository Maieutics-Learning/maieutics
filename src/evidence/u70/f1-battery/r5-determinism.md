# U70-F1 scout 5 (determinism)

1. Determinism failure: The proposal specifies "SAME 20 seeds" but does not lock the `U70N_REPW` linear anneal schedule to a fixed global epoch counter. Because the schedule depends on epoch-step (1..200) rather than a seed-derived state, any variation in batch-processing or asynchronous checkpointing in the v1.1-exact base will introduce non-deterministic gradient drift.

2. Smuggled variable: The transition from a fixed value (0.1) to a time-varying schedule (0 $\rightarrow$ 0.3) is not a "two-number change"; it is a functional change to the loss landscape. Without specifying the exact interpolation formula (linear vs. cosine) and the precise epoch-boundary trigger, the run is not reproducible.

3. Lack of baseline: By altering the floor to 0.05, the "comparability" to Wave 1 (0.25) is broken. The proposal lacks a control run using the 0.05 floor *without* the anneal, masking whether the fix is the floor or the schedule.