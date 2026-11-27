# U70-F1 scout 8 (statistics)

1. **Smuggled Parameter Change:** The proposal introduces a linear anneal for `U70N_REPW` (0 $\to$ 0.3 over 100 epochs) while claiming "everything else v1.1 EXACT." This is a structural change to the training dynamics, not a "two-number change." By shifting from a fixed weight to a schedule, the proposal masks whether the recovery is due to the lowered KL floor or the delayed application of representation pressure.

2. **Comparability Collapse:** The "paired comparison" against Wave 1 V3 is statistically invalid. Wave 1 used a fixed 0.1 weight; F1 uses a ramp. Any delta in probe or gap cannot be attributed solely to the `U70N_FREEBITS` floor change, as the regularization trajectory is now non-equivalent.

3. **Verdict:** Un-runnable as a controlled experiment. It is a disguised sweep of floor-value and annealing-schedule.