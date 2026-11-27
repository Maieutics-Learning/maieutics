# F14 re-close re3 (re-close glosses: boundary, bar-direction, independence, freshness, hashes)

1. **NEEDS-PATCH**
2. **Residual:** Metric-path verification (T7/T8/T8b). While the proposal moves from "helper-test" to "metric-path-test," it relies on a "black-box" assertion of the `u70nEval` call site. The hardest falsifier is a **silent leak**: if the inline shuffle branch is not fully excised (or if a global state variable persists the original posterior `q` across calls), T7/T8 could pass via fluke or specific seed alignment while the actual gap measurement remains contaminated. A strict byte-diff audit of the `u70nEval` function is required before any weights are processed; the "independent recompute" (T8b) is a necessary but insufficient guard against transient state leaks in the JS engine.

**Technical Critique:**
- **Causal Isolation:** F12-exact training preserves the weights, but the "TRUE intervention" is purely an eval-time shift. This is valid for isolating the intervention, provided the "read-point" boundary is strictly enforced.
- **Oracle Reuse:** Citing F13's ceiling is sound since the oracle is independent of the neural model's internal state.
- **Held-out Validity:** Seeds 20..39 are spent; however, since F14 is a re-grading of the same weights on the same data, "reuse" is not leakage—it is the definition of a controlled experiment.
