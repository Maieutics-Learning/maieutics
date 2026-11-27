# U70-F1 scout 6 (scope-creep)

1. **Smuggled Variable**: The proposal introduces `U70N_REPW` as a linear anneal (0 $\to$ 0.3). This is not a "two-number change" but a structural modification of the loss objective across 200 epochs.

2. **Comparability Breach**: By modifying the annealing schedule, F1 is no longer a direct variable-swap comparison against Wave 1 (which used a fixed 0.1). Any resulting delta in probe/gap cannot be uniquely attributed to the `FREEBITS` floor reduction, as the temporal pressure of the representation weight is now a confounded variable.

3. **Disguised Sweep**: The "linear anneal" effectively creates a multi-point sweep of weights across the first 100 epochs. This violates the "no other changes" constraint and renders the "fixed" comparison invalid.

**Verdict: UNRUNNABLE.** F1 is a disguised architecture/schedule sweep, not a targeted parameter fix.