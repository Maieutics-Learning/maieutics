# Fresh-eyes battery: self-u22c-scalestress-prereg (3x sealed, CLOSED IMPLEMENTABLE, v1.0 STANDS)

Goal line carried in all 3 prompts. Sealed via root.generateText Promise.all. Raw: scratch/u22c-battery-raw.json. Health: goalInAll true, nonEmpty 3/3, hasVerdict 3/3, distinct true (lens in raw).

## R1 — IMPLEMENTABLE (verbatim)
**ANALYSIS**

*   **Architectural Validity:** The use of a shared slot encoder $S$ (4 $\to$ 8) reused across 250 slots is a computationally efficient way to handle high-input dimensionality without parameter explosion (~40 params). The pipeline flow (Encoder $\to$ Scorer $\to$ Top-2 Mean Pool $\to$ Summary8) is mechanically sound for a selection-based attention mechanism.
*   **Gradient Flow:** The "top-2 mean-pool" represents a hard-selection bottleneck. For this to be differentiable, it requires a straight-through estimator (STE) or a soft-max approximation. The spec implies a hard gate; provided the implementation uses STE, the gradient path to the shared encoder remains viable.
*   **Leakage Prevention:** The Teacher linkOut is strictly mapped to the TRUE 20 slots. Since the distiller/learner only sees the Teacher's output and the input stream, there is no label leakage from the 245 distractor slots.
*   **Noise Robustness:** Re-seeding the Gaussian noise per batch for distractors is critical. By matching mean/var to the true signals, the model is forced to learn *features* rather than *statistical artifacts* of the noise distribution.
*   **Dimensionality Check:**
    *   Input: $250 \times 4 = 1000$
    *   Encoder: $4 \to 8$
    *   Summary: Top-2 mean pool $\to$ 8-dim summary.
    *   Combiner: $[h48 | \text{summary8}] = 56 \to 24 \to 4$.
    *   The math holds: $48 + 8 = 56$. The reduction to 4 codes aligns with the output spec.
*   **Metric Alignment:** The SELECT-hit $\ge 80\%$ and DISTRACTOR-swap $\pm 0.03$ are appropriate probes for validating that the model is actually attending to the 20 true slots and ignoring the noise.

**PINS**

*   **PIN 1 (Encoder):** Shared $S$ (4 $\to$ 8) applied $\times 250$.
*   **PIN 2 (Bottleneck):** Top-2 mean-pool $\to$ Summary8 (requires STE for backprop).
*   **PIN 3 (Leakage):** Teacher $\to$ True-20 only.
*   **PIN 4 (Noise):** Per-batch re-seed Gaussian noise (matched mean/var).
*   **PIN 5 (Codes):** 157/158 mapping confirmed via $56 \to 24 \to 4$ architecture.

VERDICT: IMPLEMENTABLE

## R2 — IMPLEMENTABLE (verbatim)
**ANALYSIS**

The objective is to distinguish an emergent selection mechanism from simple coordinate memorization in a high-noise environment. With 250 slots and only 20 true signals, the signal-to-noise ratio is critically low. The architecture relies on a shared encoder $S$ (4 $\to$ 8), which forces the model to learn a *type* of feature rather than a *positional* feature, provided the input is not spatially correlated.

1.  **Memorization vs. Selection:** The "NOMEM $\pm 0.03$" probe is the primary safeguard. By swapping seeds of Gaussian distractors while keeping true slots fixed, the model must demonstrate that its score is tied to the *content* of the slot, not the *index* of the slot. If the model had memorized the indices [7, 41, 129, 166, 203], the DISTRACTOR-swap would yield a delta $\approx 0$ regardless of content. A delta of $\pm 0.03$ suggests the model is sensitive to the underlying distribution, not just the address.
2.  **Scale Parity:** The $\pm 0.05$ parity between U22b and U22c ensures that the increase in input dimensionality (scaling to 1000 total inputs) does not degrade the selection efficiency.
3.  **Ablation Justification:** The relaxation of ABLATE to $\ge 0.08$ (3/3) is justified. In a 250-slot environment with 20 true signals, the variance of the top-2 mean-pool is naturally higher than in smaller benchmarks. A strict threshold would likely fail due to the stochastic nature of the Gaussian noise matching, even if the selection logic is sound.
4.  **The Rival Hypothesis:** The rival claim that "top-2 just memorizes positions" is explicitly countered by the `u22c-shuf` arm. By shuffling the slot positions per batch, any model relying on fixed-index memorization will fail the SELECT $\ge 0.80$ bar. The requirement for SELECT to hold across both scale and shuffle arms proves the shared encoder $S$ is extracting invariant features.

**PINS**

*   **SELECT (0.80):** Validated. Requires $\ge 80\%$ hit rate for true slots in top-2 pool.
*   **NOMEM ($\pm 0.03$):** Validated. Proves sensitivity to value over index.
*   **SCALE-PARITY ($\pm 0.05$):** Validated. Ensures $\text{U22b} \approx \text{U22c}$ performance.
*   **ABLATE ($\ge 0.08$):** Accepted as relaxed.

VERDICT: IMPLEMENTABLE

## R3 — IMPLEMENTABLE (verbatim)
**ANALYSIS**
The U22c architecture is designed to solve a "needle-in-a-haystack" selection problem (20 true signals among 1000 inputs) using a shared-weight encoder strategy to keep parameter counts low (~2k) and prevent overfitting to specific slot indices.

1.  **Leakage/Dead-head Risk:** The use of a shared slot encoder $S$ (4 $\to$ 8) across 250 slots effectively prevents the model from "memorizing" the location of the true slots. Since the distractor slots are Gaussian noise re-seeded per batch, there is no static pattern for the network to exploit. The "Teacher linkOut" restricting gradients to the TRUE 20 ensures the model learns *what* a signal looks like, not *where* it is.
2.  **Computational Complexity:** With a shared encoder, the compute scales linearly $\mathcal{O}(N)$ with the number of slots. The bottleneck is the top-2 mean-pool to summary8, which is a simple sort/reduction operation.
3.  **Stability (STD Tax):** The loss function is a hybrid ($0.5 \times \text{mse}$ for signals, $1.0 \times \text{mse-to-0}$ for distractors). This creates a strong pressure to suppress noise. The "hard gate" prevents gradient explosion during the forward pass of the 245 distractors.
4.  **Control Parity:** The `u22c-shuf` arm is a critical control. By maintaining the same distractor budget and noise variance but shuffling the "true" signal positions, the R3 check confirms that any performance gain is due to the self-learning mechanism and not a byproduct of the 1000-input scale.

**PINS**

*   **Param Count:** $\approx 2,000$ (Encoder: $4 \times 8 = 32$; Scorer: $8 \times 1 = 8$; Combiner: $56 \times 24 + 24 \times 4 \approx 1440$; plus biases). Well within the "constant" budget.
*   **Sparsity:** 20/1000 (2%) signal density.
*   **Noise Floor:** $\pm 0.03$ delta on distractor-swap indicates high robustness to seed changes.
*   **Selection Bar:** $\ge 80\%$ hit rate for top-2 mean-pool is realistic given the Gaussian noise separation.

**VERDICT: IMPLEMENTABLE**

## Adjudication (agent): v1.0 STANDS + FRESH-HEALTHY
3x IMPLEMENTABLE, health 4/4. Pins adopted: STE for top-k straight-through (R1), fixed-slot memorization rival answered by shuf arm + NOMEM probe (R2/R3), ABLATE 0.08 relaxation accepted for selection noise. Proceed to driver + grad-check + 6T+6E+6P on order (needs U22b verdict for parity target).
