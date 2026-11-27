# U70-F2 scout 6 (scope-creep)

1. **Smuggled Baseline Shift:** Phase 2 compares F2-V3 (frozen) against V2 (frozen), but V2 is defined in Phase 1 as "retrained fresh" to be h-only. This creates a baseline disparity: V2 is an ablation of the architecture, not a control of the training process. Any transfer advantage could be attributed to the absence of z-interference in V2 rather than the presence of functional factorization in F2.

2. **Verdict Logic Gap:** The "F2-FIXED" requirement for Phase 1 is a binary gate, but the Phase 2 "N2-TRANSFER" bar relies on a "direction count" (≥3/4 regimes). This allows a model to pass via high-magnitude success in one regime despite failing in others, masking a lack of generalizable transfer.

3. **Scope Creep:** N3 introduces "descriptive only" rho metrics, bypassing the "no other arch changes" constraint by adding un-evaluated observational data to the output stream.