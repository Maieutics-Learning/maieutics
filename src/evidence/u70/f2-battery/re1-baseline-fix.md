# U70-F2 re-close 1 (baseline-fix)

1. **STANDS.** The baseline is now correctly anchored to filed F1a-V3 paired rows rather than the floating V2. This eliminates the "baseline drift" identified in the barrage.
2. **Integrity Check:** By relegating V2 to a floor reference and forbidding fresh V2 training in Phase 1, the attribution of the F2 advantage is now isolated to the architecture/input change, not training variance.
3. **Consistency:** The restoration of the 0.85 ctxAcc bar ensures no degradation in quality standards while shifting the comparison metric. 
4. **Verdict:** The baseline-fix is robust and does not conflict with the Phase 2 transfer logic.