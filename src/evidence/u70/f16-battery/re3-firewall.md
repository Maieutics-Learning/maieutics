# F16 v1.1 re-close re3 (STANDS)

1. **Verdict: STANDS.**
2. **Firewall Analysis:** The "G1 ordering" gloss effectively decouples the interaction readout from the individual arm verdicts. By mandating that absolute bars are applied *before* the combined-vs-separates delta is computed, the interaction table is rendered a post-hoc descriptive artifact. It cannot retroactively shift a TRAIN-REGRESSED or HELDOUT-DEGRADES status.
3. **HALT Table:** Exhaustive. T10 (a-f) covers the critical failure modes: flag leakage, step-count drift, non-determinism, oracle disjointness, and weight-hash stability for ablations.
4. **Technical Validity:**
    - **Unfamiliarity:** Correctly isolated via generator-parameter shifts and a dedicated oracle (d-u70-oracle-f16-unfam.json), preventing ceiling contamination.
    - **Initialization:** Acknowledging non-bit-identity for H128 while maintaining formulaic consistency (sqrt(1/fan)) is physically plausible.
    - **Ablations:** Read-only status is enforced by T10e hash-checks, preventing "leakage" of ablation results into training.
