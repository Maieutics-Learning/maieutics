# Fresh-eyes composex-v10 battery (3 sealed, pre-compute) + adjudication

Spec frozen: composex-v10-prereg.md (v10.0 at review time). Briefs sealed, parallel, ≤150 words, return shape verdict + hardest test.

## Raw R1 (math auditor)
1. **Threshold Validity**: +0.05 is statistically insignificant. Given S1 shift variance (0.475–0.51), the noise floor is $\approx 0.035$. A 0.05 delta is barely 1.4x the observed spread; it cannot reliably distinguish a "hit" from variance.

2. **X3 Gate**: Sound. It prevents resource bloat by requiring failure of architectural/data hypotheses (X1/X2) before escalating to brute-force steps. No family bias introduced as it is a downstream fallback.

3. **Misbehaving Threshold**: The "PROCESS-HELPS" and "DATA-HELPS" bars. They are too low to be meaningful but high enough to potentially trigger X3 erroneously due to the narrow margin over S1's ceiling.

4. **Verdict**: **WEAK**. The spec defines a "win" within the margin of error.

5. **Hardest Falsifier**: Run S1 baseline 10x; if $\sigma_{S1} \ge 0.02$, the +0.05 bar is mathematically void.

## Raw R2 (implementation auditor)
1. **Implementation Audit**: The spec is enforceable.
    - **S1-identical data**: Reproducible via hard-coded seed/rng sequences (52200/52300/52600) and fixed sample counts (150/150).
    - **X1 Shift/Forward**: Implementable in one `trainModel` call. Forward uses `bindLabels` (standard target mapping); shift uses `prefixLabels` (mapping the specific token index `x.length-3` to value `v`). This is a standard multi-task loss modification.
    - **X3 Gate**: Enforceable. The driver checks the 2/3 quorum of `PROCESS-HELPS` and `DATA-HELPS` before invoking the X3 training loop.

2. **Unenforceable Steps**: None.

3. **Verdict**: **PASS**.

4. **Hardest Falsifier**: X1 failure where `fwd` stays $\ge 0.75$ but `shift` gain is $< 0.05$. This would prove that pricing the retrieve-hop via `prefixLabels` does not actually accelerate the shift skill, rendering the "retrieve supervision" hypothesis false.

## Raw R3 (alternative-explanation)
1. **Rival Mechanism**: **Supervised Fine-Tuning (SFT) on Chain-of-Thought (CoT) traces.** Instead of auxiliary supervision via `prefixLabels` (which targets the internal representation of the retrieve step), provide full-trace labels $(q \to k \to v)$ as the primary objective. This treats the "shift" as a sequence of discrete tokens rather than a compositional bottleneck to be "priced" via aux loss.

2. **Killer Test**: **Cross-Length Generalization.** Train on shift-lengths $L \in \{1, 2\}$ and test on $L=3$. If the `prefixLabels` mechanism is merely overfitting the specific "retrieve hop" distance of the training set, it will fail on $L=3$. A true "skill" acquisition would generalize.

3. **Control Presence**: **UNVERIFIED.** The spec defines "variety" (X2) and "steps" (X3), but lacks a control for label-depth (full trace vs. point-supervision) or a length-variant evaluation set to distinguish between *compositional logic* and *pattern matching* of the retrieve hop.

## Adjudication (owner: agent, 2026-11-23)
- R1 → REJECTED with filed math + program convention. Per-seed eval SE at n=200, p~0.5 is sqrt(0.25/200)=0.035; paired diff SE ~0.05. +0.05 is the program's standard minimal-meaningful delta (SELECT-ADDS, CAP-LIFTS, LONG-LIFTS precedents — all paired-by-seed). R1's "run S1 10x" is itself the resource spend the user cautioned against; the R=3 quorum IS the variance control (P(2/3|null, paired) ~0.06-0.07 per bar, and expectation is filed open so a miss is a finding, not a failure). X3-gate soundness agreed (pre-registered downstream fallback, no family bias). Bars stand.
- R2 → ACCEPT (no patch; hardest falsifier already the filed bar).
- R3 → PARTIAL. Full-trace CoT rejected as arch scope (single-label 4-class head, no sequence output — would need a new readout, not an extra). Adopted two analysis/infra points with NO bar/train-count changes: (a) same-trainSeed pairing — X1/X2 reuse S1's trainSeed (53200+seed*13: same init + same base streams, so supervision (X1) and variety (X2) are the only deltas; strengthens pairing beyond the spec's same-rng-data rule); (b) length-variant shift eval as verdict-time analysis on frozen models (2-pair shift lines, new test rngs, no training) to test hop-distance overfitting. (b) rides in the eval extension, not the bars.
- Score: 1 adopted-infra, 1 no-patch, 1 rejected-with-math. No re-run (v10 core unchanged; (a) is a driver rule refining the frozen spec's intent, (b) is verdict-time analysis).
