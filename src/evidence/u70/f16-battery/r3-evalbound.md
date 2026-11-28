# F16 v1.0 barrage r3 — evalbound (STANDS)

1. **Verdict**: STANDS.

2. **Technical Justification**: The protocol successfully isolates attribution via a 4-arm training matrix (Anchor, A1, A2, B-Combined) while preventing "scope creep" by restricting complex evaluations (unfamiliar distribution, ablations) to frozen weights of A0 and B. The T10e hash-proof is the critical mechanism here; by asserting weight-identity before and after ablation/unfamiliar runs, it mathematically precludes training-time leakage or "smuggling" of results into the attribution phase. The use of a separate, pre-registered oracle for the unfamiliar distribution prevents ceiling-contamination with the held-out set.

3. **Hardest Falsifier**: **T10b (Step-Count Rigidity)**. If any training arm exhibits a variance in optimizer steps or chunk passes (e.g., due to a silent crash, skip, or dynamic scheduling), the entire wave is BROKEN. This is the single point of failure that prevents the "distribution is not the fix" claim from being undermined by accidental compute-imbalance.
