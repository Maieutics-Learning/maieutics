# U70-F1 scout 9 (failure-modes)

1. **Anneal Schedule Collision:** Linear ramp of `U70N_REPW` (0 $\to$ 0.3) over epochs 1..100 while simultaneously lowering the KL floor to 0.05 creates a confounding variable. It is impossible to discern if representation recovery is driven by the floor change or the delayed introduction of representation weight. This is a disguised sweep of two hyperparameters.

2. **V4-Shuffle Validity:** The proposal uses "F1-V4 (frozen-F1 test-time z-shuffle)" to measure the gap. Because the floor was lowered during training, the resulting $z$ distributions will differ fundamentally from Wave 1. Shuffling $z$ values from a 0.05-floor distribution into a V4-test may trigger baseline instabilities, making the $\geq 0.05$ gap bar uninterpretable relative to the original V1.1 baseline.

3. **Verdict Logic Gap:** "F1-PARTIAL" (probe pass, gap fail) is listed, but the primary outcome requires *both*. The logic fails to define the transition to "F1-FIXED" if the gap is marginal but not $\geq 0.05$.