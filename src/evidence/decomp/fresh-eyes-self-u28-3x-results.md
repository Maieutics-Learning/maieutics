# Fresh-eyes battery: self-u28-maxhinge-prereg (3x sealed; 3x IMPLEMENTABLE → v1.0 STANDS)

Goal line carried in thinking + all 3 prompts: "The final goal is we are building a machine that learns by itself — continuity + selection + appetite living in weights + forward pass, tools as controls only."
Sealed via root.generateText Promise.all (3 parallel). Raw: scratch/u28-battery-raw.json (verbatim below). Health: goalInAll true, nonEmpty 3/3, hasVerdict 3/3, distinct true.

## R1 — IMPLEMENTABLE (verbatim)
**REVIEWER R1: U28 MAX-HINGE PREREG**
**STATUS:** Sealed / Fresh-Eyes
**SUBJECT:** Implementation Validity Check

---

### (a) Implementability
The transition from `mean-hinge` to `max-hinge` is mechanically sound. By shifting the loss objective from the average of the top-8 to the delta between the `min_true` and `max_distractor`, the gradient signal is sharpened. The restriction of gradients to the "2 extremal slots" (the best true and the worst distractor) effectively turns the hinge into a competitive pairing function. 

Since the forward pass and routing (S+C+INH) remain identical to U27, the architectural footprint is stable. The `detached-routing` (stopping CE/MSE at INH) prevents the primary objective from collapsing the inhibitory routing, while the hinge-path ensures the "winner" of the selection process is pushed away from the distractors. 

**Risk:** The "lowest-index tie-break" for `argmin-true/argmax-dist` introduces a slight bias toward early slots, but at $N=250$, this is negligible unless the weights initialize to near-zero.

### (b) Bar Math
The bars are aggressive but falsifiable. 
- **SELECT-HARD $\ge 0.80$** and **HARD $\ge 0.60$**: These are the critical pivots. Max-hinge is specifically designed to drive these numbers up where means-hinge plateaued.
- **COMPETE strict $\ge 0.50$**: This requires a significant gap between the true signal and the noise floor.
- **INHIB-SEPARATES $\ge +0.10$**: This verifies that the detachment is actually working—if the means converge, the "separation" vanishes.
- **GAP $\ge 0.15$**: Standard sanity check for discriminative power.

The math holds: the max-hinge provides the gradient pressure necessary to hit the $\ge 0.80$ mark, provided the "2 extremal slots" are correctly identified per iteration.

### (c) Leakage
**Low Risk.** 
The use of fresh codes (171/172) prevents cross-contamination from U27. Because the routing is detached (CE/MSE path stops at INH), there is no direct gradient leakage from the final classification back into the selection weights via the standard path. The only leakage path is the hinge-path, which is intended.

### (d) Confounds/Rivals + Ambiguity Flag
- **Sparsity Tax:** There is a risk that restricting gradients to only 2 slots per pass will slow convergence significantly or lead to "dead" slots that never get updated. However, the `max-hinge` is inherently a sparse operator; this is a feature, not a bug.
- **Rival Hypothesis:** The increase in `SELECT-HARD` might not be due to the hinge logic, but rather the `silu 4->8` expansion providing more headroom for the INH to operate.
- **Ambiguity Flag:** [NONE]. The spec is precise regarding the pool $\tau=1.0$ and the combiner dimensions.

---

### VERDICT: IMPLEMENTABLE

## R2 — IMPLEMENTABLE (verbatim)
**REVIEWER R2**
**PROJECT: U28 MAX-HINGE PREREG**
**STATUS: SEALED REVIEW**

---

### (a) Implementability
The transition from `means-hinge` to `max-hinge` is computationally sound. By shifting the gradient target from the centroid ($\mu$) to the extremal pair (True-Min vs. Distractor-Max), the system moves from a "cluster-push" to a "boundary-push" regime. 
*   **Sparsity Logic:** Gradients flowing to only two extremal slots per sample is physically plausible and reduces noise compared to mean-pooling. 
*   **Tie-Breaking:** The "lowest-index" rule for $\text{argmin}/\text{argmax}$ ties is a standard deterministic fallback; it prevents gradient oscillation in perfectly symmetric initialization.
*   **Routing:** The detached routing is intact. The hard-stop at INH for CE/MSE ensures that the "appetite" (gradient flow) for the hinge-loss is isolated to the $S \to C \to INH$ path, preventing the loss from corrupting the primary feature extractors.

### (b) Bar Math
The bars are strictly falsifiable and high-resolution.
*   **SELECT-HARD $\ge 0.80$:** This is a high-pass filter. Since $U27$ failed this (0/3), the $U28$ shift to `max-hinge` is a direct attempt to fix the "blurry" boundaries caused by means-pooling.
*   **COMPETE strict $\ge 0.50$:** This requires a clear winner. With $L_{max}$ targeting the gap between the best-distractor and the true-target, the probability of a "flat" distribution is reduced.
*   **Gap/STD:** The $\text{GAP} \ge 0.15$ and $\text{STD} \approx \text{W6}$ constraints ensure that the model isn't just inflating weights to meet the hinge (weight-explosion) but is actually refining the decision boundary.

### (c) Leakage
**Risk: Low to Moderate.**
The "lowest-index" tie-breaker is a potential (though unlikely) source of index-memorization if the dataset has a systemic bias in how "True" labels are sorted. However, since the gradient is restricted to the extremal slots, the model cannot "cheat" by distributing the error across the entire 250-slot vector. The detachment of the CE/MSE path prevents the hinge-loss from leaking into the global feature weights.

### (d) Confounds/Rivals + Ambiguity Flag
*   **The "Sparsity Tax":** There is a risk that updating only 2 slots per sample will slow convergence significantly compared to the $U27$ means-approach. This may lead to a "FAIL" on speed, even if "IMPLEMENTABLE" on logic.
*   **Ambiguity Flag:** $\text{NONE}$. The spec for the linear-inh and pool $\tau=1.0$ is explicit.

---

**VERDICT: IMPLEMENTABLE**

## R3 — IMPLEMENTABLE (verbatim)
(a) **Implementability**
The transition from `means-hinge` to `max-hinge` is computationally sound. By targeting the two extremal slots (argmin-true / argmax-distractor), the gradient signal is sharpened into a sparse update rather than a blurred average. The "lowest-index" tie-breaker for argmin/argmax is a standard deterministic fallback that prevents stochastic oscillation during backprop. Detached routing remains intact: because the CE/MSE path terminates at the INH (Inhibitory) block and the hinge-path targets the S+C+INH sequence, the structural separation of "what to learn" (CE/MSE) vs "how to compete" (Hinge) is preserved. The 2-slot sparse signal is implementable via indexed slicing or masking in the backward pass.

(b) **Bar Math**
The bars are rigorous and falsifiable. Specifically:
- `SELECT-HARD >= 0.80` and `COMPETE strict >= 0.50` create a high-pressure bottleneck.
- The `GAP >= 0.15` ensures that the "winner" isn't winning by a marginal epsilon, forcing a distinct separation in the latent space.
- `STD within 0.05 of W6` acts as a regularization check; if the max-hinge causes weight explosion or collapse (divergence from the W6 baseline), the run is invalidated.
- The additive requirements (`SEL >= +0.05`, `HARD >= 0.60`) ensure that the model isn't just gaming the average but is performing across the specific difficulty tiers.

(c) **Leakage**
Low risk. The use of "Fresh codes 171/172" prevents temporal leakage from U27. Because the hinge-path is detached from the primary CE/MSE path, the model cannot "leak" the label through the inhibitory weights to bypass the forward pass. However, the "lowest-index" tie-breaker introduces a negligible systemic bias toward early slots; given the 250x4 scale, this is statistically irrelevant.

(d) **Confounds/Rivals + Ambiguity Flag**
**Confounds:** The primary risk is the **Sparsity Tax**. By only updating the two extremal slots, the model may develop "dead zones" in the weights where non-extremal values never receive a gradient, potentially leading to fragile convergence.
**Rivals:** A "soft-max hinge" would be a rival implementation, but the current "hard-max" approach is more aligned with the goal of a self-learning machine (selection/appetite).
**Ambiguity Flag:** [CLEAR] — The spec is mathematically closed.

**VERDICT: IMPLEMENTABLE**

## Adjudication (agent): v1.0 STANDS, no patches
3x IMPLEMENTABLE unanimous. Sparsity-tax noted (pre-registered in prereg as HARD-drop WHY); tie-break deterministic logged. No mechanics changes. Proceed to grad-check + stage-1 + 6T + evals.
