# F16 v1.1 re-close re1 (STANDS)

1. **Verdict: STANDS.**
2. **Analysis:**
    - **G1 (Ordering):** Properly isolates training arm verdicts from interaction analysis. Prevents "result-driven" verdict shifting.
    - **G2 (Unfamiliar Math):** Correctly defines unfamiliarity as a generator-parameter shift (timing/distribution) rather than a seed-shuffle. Use of a disjoint seed range (2000+) and a dedicated oracle prevents ceiling-leakage between held and unfamiliar sets.
    - **G3 (Init Logging):** Explicitly acknowledges that H128 cannot be bit-identical to H64 due to structural scale differences. Logging fan/scale/first-draw provides sufficient transparency for procedure-identity without claiming impossible bit-parity.
3. **Scope Check:** No smuggling of design, bars, or compute. Training arms are strictly limited to A0, A1, A2, and B-COMB. Eval extras are read-only on frozen weights. T10 provides necessary hard-stops for execution integrity.
