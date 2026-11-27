# U70-F2 scout 10 (coherence)

1. **Invalid Transfer Baseline:** The proposal compares F2-V3 (z-only) against V2 (h-only). Because V2 lacks the structural cut (z-probe) by design, it cannot possibly meet the `ctxAcc` metric in Phase 2. Comparing a z-probe model to a non-z-probe model on `ctxAcc` is a smuggled advantage; the bar is a formality, not a test.

2. **Verdict Contradiction:** Phase 1 labels `F2-PERSISTS` as a "probe fail" (meaning no context in z). However, the "Overall" proceed condition requires `F2-FIXED` (probe pass). If the probe fails, the experiment halts, yet the proposal claims to test if factorization *transfers*. You cannot test the transfer of a representation that failed to emerge.

3. **Metric Collapse:** In N3 (novel-rho), the 3-way head retains old labels. Descriptive metrics on a frozen head with shifted inputs without retraining is noise, not signal.