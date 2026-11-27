# Paper-rep battery 3 (RED-TEAM) verbatims R1-R5 (verbatim, 2026-11-27)

--- R1 ---
1. **Attack:** The decoupling of P1 (transmission-only) and P2 (goal-not-result) creates a semantic vacuum. By stripping transmission results from the contextual substrate (§5 P1) and framing the endpoint as a goal rather than a result (§8), the paper effectively removes all empirical anchors for its "U-verdicts." The claims now rely on a conceptual framework that explicitly excludes the data required to validate them.

2. **Kill-shot:** If the "goal" in P2 is not a measurable result, the U-verdicts (especially U55/U57) are non-falsifiable assertions, not scientific findings.

3. **Cheapest Test:** A **Cross-Substrate Transfer Test**. Attempt to map a U64b "PROCEED" result onto the contextual substrate defined in §5. If the transmission-only scope prevents this transfer, the "verdict" is computationally isolated and meaningless for the broader architectural claim.

--- R2 ---
1. **Attack:** The decoupling of transmission from substrate (§5 P1) is a semantic shield, not a technical one. If the "goal-not-result" framing of the endpoint (§8) is a concession that the desired state was never achieved, the paper is a report on a failed experiment masquerading as a theoretical framework. The "UNDERPOWERED" verdict for U58 suggests the architecture cannot support the claim; the "transmission-only" scope is a post-hoc attempt to redefine failure as a boundary condition.

2. **Kill-shot:** The "ORACLE-ONLY" status of U64h/e proves the system cannot generalize without external ground-truth injection. If the oracle is removed and the "goal" remains unreachable, the central claim of autonomous substrate transfer is null.

3. **Verification:** Zero-hint, non-oracle cross-substrate transfer test (U60 spec). Failure to produce a non-null result is a mandatory retraction of v1.2's validity.

--- R3 ---
1. **Attack:** The "goal-not-result" framing of the endpoint (§8) creates a tautological escape hatch. By decoupling the intended goal from the actual result, the paper claims a "Proceed" (U64b) based on a failure to disprove a theoretical ceiling rather than the achievement of a functional benchmark. This renders the "underpowered" (U58) and "floor-fail" (U55/59) verdicts descriptive rather than diagnostic; they describe a lack of signal but claim the architecture is still viable.

2. **Kill-shot:** If the transmission-only scope (§5 P1) prevents any contextual substrate transfer, the system is a closed-loop signal processor, not a learning agent.

3. **Verification:** Zero-shot cross-substrate transfer. If a U64h-equivalent cannot apply a learned pattern to a novel, non-oracle substrate without retraining, the "Proceed" verdict is a false positive for generalizability.

--- R4 ---
1. **Attack:** The transition of P2 from "result" to "goal" in v1.2 is a semantic retreat that masks a failure in endpoint verification. If the "goal" is not an achievable "result" within the current architectural constraints (U58), then the paper claims a destination it cannot prove exists, rendering the "endpoint" a theoretical conjecture rather than a scientific finding.

2. **Kill-shot:** The U58 "underpowered" architectural verdict contradicts the P2 "goal" framing; you cannot claim a goal-oriented endpoint while admitting the architecture lacks the power to reach or verify it.

3. **Cheapest Test:** A "Blind-Goal" ablation: Remove all oracle-hints from U64h. If the system fails to converge on the P2 goal without the oracle, the "goal" is an artifact of the hint-system, not the architecture. Retraction of P2 claim is mandatory.

--- R5 ---
1. **Attack:** The "goal-not-result" framing of §8 (P2) creates a tautological shield. By decoupling the endpoint from the result, the paper claims success via intent rather than empirical attainment. This renders the U64h "Oracle-Only" status a feature rather than a failure, masking a fundamental lack of autonomous convergence.

2. **Retraction Trigger:** Evidence that the "transmission-only" scope (§5 P1) is not a constraint of the substrate, but a failure of the transmission mechanism to carry state. If transmission is the only valid vector, yet fails to transfer contextual substrate, the system is a series of isolated snapshots, not a coherent process.

3. **Cheapest Test:** Zero-hint, cross-substrate transfer. If U64b cannot maintain a state-variable across a substrate shift without an oracle hint, the "Proceed" verdict is an artifact of leakage, not capability.
