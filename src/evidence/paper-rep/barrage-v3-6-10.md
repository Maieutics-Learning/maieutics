# Paper-rep battery 3 (RED-TEAM) verbatims R6-R10 (verbatim, 2026-11-27)

--- R6 ---
1. **The Kill-Shot:** The failure to reconcile the "transmission-only" scope clause (§5 P1) with the "goal-not-result" endpoint (§8). If transmission results are decoupled from the contextual substrate, the "goal" in §8 becomes a floating variable with no causal mechanism to influence the substrate. The paper claims an architectural bridge while simultaneously defining it as a non-transferring bridge.

2. **The Retraction Trigger:** Proof that U64h’s "ORACLE-ONLY" status is a result of substrate-leakage rather than architectural capability. If the oracle provides a hint that bypasses the transmission-only constraint, the U64h "PROCEED" verdict is a false positive based on data contamination.

3. **Cheapest Verifying Test:** A zero-hint, cross-substrate transfer test on U64h. If the model fails to maintain state without the oracle, the "goal" in §8 is unreachable, rendering v1.2 a description of a broken circuit.

--- R7 ---
1. **Claim Grading/U-Coherence:** The shift of P2 from "result" to "goal" in v1.2 creates a semantic void. If P2 is merely a goal, the "PROCEED" verdict for U64b lacks a success metric. The paper claims a path forward while decoupling the endpoint from the actual data.
2. **§5 Transmission Scope:** The U58 exclusion (no transmission to contextual substrate) renders the "UNDERPOWERED" verdict a tautology. If the architecture forbids transfer, the failure to transfer is a design constraint, not a finding.
3. **The Kill-Shot:** The "ORACLE-ONLY" status of U64h, combined with the "goal-not-result" framing of P2, suggests the system cannot generalize without external hints.
4. **Cheapest Test:** Zero-shot prompt on a U64-equivalent task without the Oracle hint. If it fails (which the "ORACLE-ONLY" tag implies), the "PROCEED" status of U64b is a hallucination of progress.

--- R8 ---
1. **Attack:** The "transmission-only" scope clause in §5 P1 is a post-hoc rescue of the U58 architectural failure. By decoupling transmission from contextual substrate, the paper effectively admits the model cannot generalize the property across domains, rendering the "transmission" a mere syntactic echo rather than a semantic transfer.

2. **Kill-shot:** If the "transmission" is purely structural (transmission-only) and does not influence the substrate's internal state, the claim of a functional "endpoint" (P2) is a category error—it is a signal, not a result.

3. **Verification:** Cross-substrate transfer test: Attempt a zero-shot transfer of the property from the transmission channel to a secondary, independent substrate. If the substrate remains "blind" to the property despite the transmission, the paper's core utility is nullified.

--- R9 ---
1. **Attack:** The "goal-not-result" framing of §8 (endpoint) creates a tautological shield. By decoupling the endpoint from the result, the authors have transformed a failure to reach a metric into a successful pursuit of a "goal." This obscures whether U64b's "PROCEED" is a meaningful architectural win or merely an artifact of a shifted goalpost.

2. **Kill-shot:** If U64b's "PROCEED" status relies on a transmission-scoped proxy (per §5 P1) rather than a direct substrate transfer, the claim of architectural viability is a category error.

3. **Cheapest Test:** Zero-hint, cross-substrate transfer of a U64b-derived state to a clean U55 instance. If the state fails to initialize or execute without the original transmission-scope context, the "PROCEED" verdict is a false positive based on leakage, necessitating a major downgrade of all U64-series claims.

--- R10 ---
1. **Attack:** The decoupling of §5 P1 (transmission-only scope) from the contextual substrate creates a logical vacuum; if transmission results cannot transfer to the substrate, the "endpoint" in §8 is a floating goal devoid of a causal mechanism. This renders the U64h "Oracle-Only" results meaningless as they cannot be mapped back to the architectural failures of U58.

2. **Retraction Trigger:** Proof that U64h performance is an artifact of the "loop-O" replication environment rather than the model's internal state.

3. **Cheapest Test:** A zero-shot, non-oracle prompt using a synthetic, out-of-distribution token sequence (unhinted) to verify if the transmission result persists without the substrate's contextual scaffolding. If the result collapses, v1.2’s claim of "transmission-scoped" success is an illusion of the test harness.
