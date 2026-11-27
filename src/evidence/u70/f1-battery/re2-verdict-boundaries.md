# U70-F1 re-close 2 (verdict-boundaries)

1. **STANDS**. 

2. The barrage finding (anneal = hidden variable) is resolved by the transition to a fixed `U70N_REPW` (0.1). 

3. Verdict boundaries remain locked and disciplined; the shift to a 0.05 floor is a gradient-flow optimization, not a boundary shift. The "F1-PERSISTS" logic correctly handles cases where raw KL remains below the floor, attributing the failure to mechanism rather than design.

4. Causal testing (F1-V4) remains valid as it is internal to the run, ensuring the "gap" metric is not contaminated by the floor change. No boundary leakage detected.