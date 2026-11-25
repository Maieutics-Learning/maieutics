# Fresh-eyes battery: self-u26-perassembly-prereg (3x sealed; 3x IMPLEMENTABLE → v1.0 STANDS)

Goal line carried in thinking + all 3 prompts: "The final goal is we are building a machine that learns by itself — continuity + selection + appetite living in weights + forward pass, tools as controls only."
Sealed via root.generateText Promise.all (3 parallel). Raw: scratch/u26-battery-raw.json (verbatim below). Health: goalInAll true, nonEmpty 3/3, hasVerdict 3/3, distinct true.

## R1 — IMPLEMENTABLE (verbatim)
**Implementability Review: R1**

**(a) Implementability**
The loss term is a contrastive hinge $\max(0, 1.0 - (\text{mean}(\text{true}) - \text{mean}(\text{top8})))$. This is numerically stable and computable. The margin (1.0) and weight (1.0) are well-defined and consistent with U25. Twin-matching is intact via seed-only streams and paired evaluations. The introduction of the $\text{INH}$ MLP (8 $\to$ 4 $\to$ 1) with softplus output ensures non-negative inhibition, and the gradient path from the hinge loss through $\text{INH}$ to $\text{S}$ is clear.

**(b) Bar Math**
The COMPETE row-fraction (0.50) is a significant step up from U25 (0.0) but represents a realistic "Kim-style" operationalization of separation. The SELECT-HARD bar (0.80 hit-rate) remains the "wall," providing a binary distinction between simple retrieval and true assembly-competition. Quorum (2/3) is standard. The $\text{SEL}$ tripwire ($\ge 0.05$) effectively guards against index-memorization by comparing the hard-set against the shuffled-set.

**(c) Leakage**
Held-out integrity is maintained via the $N=200$ mined set at a distinct seed offset (66300+). Frozen discipline is strictly enforced for the teacher (U17) and miner (U21). Determinism is ensured through explicit RNG seeds for the new $\text{INH}$ weights per arm/seed.

**(d) Confounds/Rivals**
The primary risk is **index-memorization**, which is mitigated by the "content-only" architecture (no slot index input to $\text{INH}$) and the $\text{SEL}$ shuf-arm. **Inhibition collapse** (where $\text{INH}$ becomes a constant offset) is addressed by the $\text{INHIB-USE}$ ablation bar ($\ge 0.05$ drop), ensuring the MLP is actually performing feature-selective suppression. The forward-delta is minimal (one subtraction), isolating the architectural change from training noise.

**Ambiguous Lines:**
- "S (shared 4->8 encoder)": Spec says "4->8", but later "8-dim". Assuming $\text{S}$ is a linear layer transforming 4-dim input to 8-dim embeddings.
- "$\text{HF}$ (combiner 56->24->4)": This is a large reduction; assuming this is a frozen/fixed head from previous versions as it is listed under "Trainable" but "Same inits... as U23b".

VERDICT: IMPLEMENTABLE

## R2 — IMPLEMENTABLE (verbatim)
**Implementability Review: R2**

**(a) Implementability**
The spec is technically sound. The loss term (contrastive hinge) is a standard $max(0, 1 - \Delta\mu)$ implementation, computable via mean reductions. Margin (1.0) and weight (1.0) are well-defined. Twin-matching is intact via the seed-only stream requirement and paired evaluation blocks. The addition of the `INH` MLP introduces a subtractive scalar to the final score; since it uses a `softplus` output, it ensures non-negative inhibition, preventing uncontrolled score inflation.

**(b) Bar Math**
Coherent. The `COMPETE` row-fraction ($\ge 0.50$) is a strict operationalization of the Kim #5 hypothesis (assembly-specific inhibition). The `SELECT-HARD` wall ($\ge 0.80$ hit-rate) provides a binary success/fail threshold for the architectural delta. Quorum is consistently defined at $2/3$. The `SEL` index-cheat tripwire (hard minus shuf $\ge +0.05$) is a necessary and sufficient check for content-only learning.

**(c) Leakage**
Integrity is maintained via frozen-scale OOD controls and the use of a held-out `vhat-mined` set ($N=200$). The "frozen discipline" is enforced across $W6-s$ and $M2-nb-s$. Mining determinism is guaranteed by the dedicated stream (65300+seed) and the requirement for a contextless replay.

**(d) Confounds/Rivals**
The "Shared-Linear vs. Per-Content" confound is correctly isolated: by keeping the diet, seeds, and loss identical to U25, any delta in performance is attributable solely to the `INH` network. The "Index-Memorization" rival is mitigated by the `shuf` arm and the structural absence of slot indices in the forward pass. The "Forward-Delta" is minimal (one MLP subtraction), ensuring that a failure to hit the wall is a result of the architecture's inability to separate engrams, not a failure of convergence.

**Ambiguous Lines:**
- "S (shared 4->8 encoder)": Specify if this is a linear projection or a non-linear block; though for a reviewer, "encoder" is generally sufficient to assume a standard layer.

VERDICT: IMPLEMENTABLE

## R3 — IMPLEMENTABLE (verbatim)
**Implementability Review: U26 delta-prereg**

**(a) Implementability**
The loss term is a contrastive hinge $\max(0, 1.0 - (\text{mean}(\text{true}) - \text{mean}(\text{top8})))$, which is computationally trivial and well-defined for CPU/JS workers. The top-8 margin is a standard rank-based operation. Twin-matching is intact via seed-only streams and paired evaluations. The architectural shift from a global scalar to a per-content inhibitory MLP ($\text{softplus}(\dots)$) is implementable and grad-checkable.

**(b) Bar Math**
- **Row-fraction:** $\text{COMPETE} \ge 0.50$ (strict separation: $\text{distractor-max} < \text{true-min}$) is a coherent, high-bar metric for assembly inhibition.
- **Margins/Weights:** Hinge weight 1.0 and margin 1.0 are consistent with U25, ensuring the delta is architectural, not hyperparameter-driven.
- **Quorum:** $2/3$ for all primary bars is standard and well-defined.

**(c) Leakage**
- **Held-out Integrity:** Use of dedicated vhat-mined $N=200$ (seed 66300+) and standard $N=200$ twin-matched sets prevents training set contamination.
- **Frozen Discipline:** W6, M2, and U17 teacher are frozen; only $S, C, \text{INH}, \text{HF}$ are trainable.
- **Mining Determinism:** Miner/oracle probes are applied post-training, maintaining a strict separation between discovery and evaluation.

**(d) Confounds/Rivals**
- **Index-Memorization:** Effectively neutralized. The $\text{INH}$ MLP takes `enc_i` (content) only, not the slot index. The `u26-shuf` arm acts as a tripwire; if $\text{SEL}$ (hard minus shuf) $\ge 0.05$, position-memorization is ruled out.
- **Inhibition Scale:** The `U26-INHIB-USE` ablation (setting $\text{inh}_i = 0$) prevents "decorative" weights by requiring a $\ge 0.05$ drop in $\text{HARD}$ performance.
- **Forward-Delta:** Minimal. The only addition is the subtraction of $\text{inh}_i$ from the score, maintaining the linear-bottleneck nature of the scorer.

**Ambiguities:** None. The mapping from Kim #5 (biological E-to-I) to the MLP subtraction is explicitly operationalized.

VERDICT: IMPLEMENTABLE

## Adjudication (agent): v1.0 STANDS, no patches
3x IMPLEMENTABLE unanimous. R1/R2 notes ("S 4->8", "HF 56->24->4") are naming pointers to U22c-verbatim code (u22cMakeS 4->8 silu; u22bMakeHF 56->24->4) — no train/eval changes. Proceed to stage-1 + 6T + evals.
