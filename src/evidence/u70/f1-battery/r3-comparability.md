# U70-F1 scout 3 (comparability)

1. **Baseline Contamination**: The proposal pairs F1-V3 against "Wave-1 V3 rows per seed," but Wave 1 was a closeout of v1.1. Because v1.1 used a fixed `U70N_REPW` (0.1) and F1 uses a linear anneal (0 $\to$ 0.3), the baseline is not a control for the specific mechanism being tested.

2. **Comparability Failure**: The proposal requires reporting KL at both floors (0.25 and 0.05) to maintain "comparability," but the verdict logic relies solely on the new 0.05 floor. By shifting the floor to 0.05 while simultaneously increasing `U70N_REPW` to 0.3, the experiment conflates gradient restoration with increased representation pressure. You cannot isolate whether the "fix" is the lower KL floor or the higher reward weight.

3. **Verdict Ambiguity**: F1-FIXED requires a gap $\ge$ 0.05. If the gap is 0.04, it is a failure, despite the 0.0017 baseline.