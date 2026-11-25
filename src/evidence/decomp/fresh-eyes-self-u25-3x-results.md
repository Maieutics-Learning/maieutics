# Fresh-eyes battery: self-u25-competition-prereg (3x sealed; 3x IMPLEMENTABLE → v1.0 STANDS)

Goal line carried in thinking + all 3 prompts: "we are building a machine that learns by itself — continuity + selection + appetite living in weights + forward pass, tools as controls only."
Sealed via root.generateText Promise.all. Raw: scratch/u25-battery-raw.json (pointer file; verbatim below). Health: goalInAll true, nonEmpty 3/3, hasVerdict 3/3, distinct true.

## R1 — IMPLEMENTABLE (verbatim)
### Implementability Review (R1)

**(a) Implementability**
*   **Loss Term:** Computable. $L_{comp} = \max(0, 1.0 - (\text{mean}(\text{true\_scores}) - \text{mean}(\text{top-8\_distractors})))$. Tensors are well-defined as a vector of 250 scores.
*   **Margin/Top-8:** Well-defined. "Top-8 distractor scores" implies taking the 8 highest values from the set of 245 non-true indices.
*   **Twin-matching:** Intact via "twin-matched seed-only streams."

**(b) Bar Math**
*   **COMPETE row-fraction:** Coherent. $\text{row\_fraction} \ge 0.50$ where $\max(\text{distractors}) < \min(\text{true\_slots})$ provides a binary success metric per row, then averaged.
*   **Margin/Weight:** $\text{margin}=1.0$ and $\lambda_c=1.0$ are sane for a contrastive term added to a standard row loss, assuming the underlying scorer output is not extremely small/large.
*   **Quorum:** $2/3$ defined.

**(c) Leakage**
*   **Held-out Integrity:** Maintained. New disjoint stream offsets (65300+ vs 66300+) ensure no overlap between training and held-out sets.
*   **Frozen Discipline:** Explicit (W6-s, M2-nb-s, U17 teacher, etc.).
*   **Mining Determinism:** Preserved via "frozen U21-lowfold miner per seed."

**(d) Confounds/Rivals**
*   **Screwer Scale/Collapse:** The use of $\text{mean}(\text{true})$ vs $\text{mean}(\text{top-8 dist})$ rather than a softmax cross-entropy reduces the risk of total scale collapse, though it pushes for a specific gap.
*   **True-slot Memorization:** Risk is mitigated by the "vhat-mined held-out" set; if the model merely memorizes the training indices, it will fail the held-out $N=200$ evaluation.
*   **Gate Removal:** Justified by "U24 GATE-FAIL" (converged to constant $\sim 0.75$).
*   **Forward-Identical:** Claim is verified; the only change is the additive loss term $\lambda_c$, not the forward pass architecture.

**Ambiguous Spec Line:** `"S 4→8"` (Assuming this refers to a specific layer/dimension shift in the U23b wiring, but lacks explicit definition in this document; however, it is marked as "IDENTICAL to U23b", making it implementable as long as U23b is the reference).

VERDICT: IMPLEMENTABLE

## R2 — IMPLEMENTABLE (verbatim)
**Reviewer R2 - Implementability Report**

**(a) Implementability**
*   **Loss Term:** Computable. $L_{comp}$ is defined as a hinge loss $\max(0, 1.0 - (\mu_{true} - \mu_{top8\_dist}))$. Tensors are named (scores, trueIdx, distractors).
*   **Margin/Top-8:** Well-defined. The contrastive term specifically targets the gap between the mean of the 5 true slots and the mean of the 8 highest-scoring distractors among the remaining 245 slots.
*   **Twin-matching:** Intact. Spec mandates "twin-matched seed-only streams" and "paired evals," ensuring the held-out set is not leaked via seed-correlation.
*   **Bar Math / COMPETE / Margin / Quorum:** Coherent; $\lambda_c = 1.0$ standard; $2/3$ defined.
*   **Leakage:** High. Disjoint stream offsets (65300+seed vs 66300+seed); frozen components explicit; mining determinism guaranteed.
*   **Confounds:** Scorer scale (relative difference; soft pool + combiner normalize); memorization (mitigated by hard-shuf + OOD); gate removal justified (U24 ~0.75 constant); forward-identical confirmed.

**VERDICT: IMPLEMENTABLE**

## R3 — IMPLEMENTABLE (verbatim)
As sealed implementability reviewer R3, I have analyzed the SPEC for the U25 delta-prereg assembly-competition scorer.

### (a) Implementability
- **Loss Term:** The contrastive loss $L_{comp} = \max(0, \text{margin} - (\text{mean}(\text{true scores}) - \text{mean}(\text{top-8 distractor scores})))$ is computable using standard tensor operations.
- **Margin/Top-8:** Well-defined. "Top-8 distractor scores" implies taking the 8 highest values from the 245 non-true slots.
- **Twin-matching:** Intact; seed-only streams are paired for evals.

### (b) Bar Math
- **COMPETE row-fraction:** Coherent. It requires $\text{distractor-max} < \text{true-min}$ for $\ge 50\%$ of rows. Strict binary check per row, aggregated as fraction.
- **Margin/Weight:** $\text{margin}=1.0$ and $\lambda_c=1.0$ sane.
- **Quorum:** $2/3$ standard.

### (c) Leakage
- **Held-out Integrity:** Maintained via disjoint stream offsets (65300+ vs 66300+).
- **Frozen Discipline:** Explicitly listed.
- **Mining Determinism:** Guaranteed by frozen U21-lowfold miner per seed.

### (d) Confounds & Rivals
- **Scorer Scale:** Contrastive loss against the *mean* of top-8 distractors provides smoother gradient, reduces single-outlier gaming.
- **True-slot Memorization:** Mitigated by hard-shuf bar.
- **Gate Removal:** Justified by U24-GATE-FAIL.
- **Forward-identical:** Valid; loss modification, not structural change.

**Ambiguous Line:** *"C over 250 slots"* (Assuming $C$ refers to the score vector produced by the scorer).

**VERDICT: IMPLEMENTABLE**

## Adjudication (agent): v1.0 STANDS, no patches
3x IMPLEMENTABLE unanimous. R1/R3 notes ("S 4→8", "C over 250 slots") are naming pointers to U23b-verbatim code (u22cMakeS 4→8 silu encoder; pf.scores 250-vector) — no train/eval changes. Proceed to stage-1 + 6T + evals on standing user order ("do those in order").
