# Fresh-eyes battery: self-u30-wideenc-prereg (3x sealed; 3x IMPLEMENTABLE → v1.0 STANDS)

Goal line carried in thinking + all 3 prompts: "The final goal is we are building a machine that learns by itself — continuity + selection + appetite living in weights + forward pass, tools as controls only."
Sealed via root.generateText Promise.all (3 parallel). Raw: scratch/u30-battery-raw.json (verbatim below). Health: goalInAll true, nonEmpty 3/3, hasVerdict 3/3, distinct true.

## R1 — IMPLEMENTABLE (verbatim)
(a) **Implementability**: High. The spec defines a precise capacity increase (4 $\rightarrow$ 12 dim) across S, C, INH, and HF modules while maintaining identical routing, loss functions (CE + max-hinge), and evaluation protocols to U28. Constraints are strictly CPU-bound with clear seed-based quorum requirements.

(b) **Bar Math**: High rigor. The "Wall" is set at $\ge 0.80$ for SELECT-HARD and $\ge 0.50$ for COMPETE. The inclusion of a "shuf shift-by-1" gap ($\ge 0.15$) and the "VOID" oracle threshold ($\le 0.20$) prevents false positives from memorization or random chance.

(c) **Leakage**: None. The design utilizes detached routing for the INH path and twin-matched seed streams (0,1,2) for evaluation, ensuring the "wide" capacity delta is isolated from optimization noise or data contamination.

(d) **Confounds/Rivals + Ambiguity Flag**: 
- **Confound**: The "optimization tax." Increasing parameters without increasing the budget (800st) may lead to underfitting, masking the capacity gain. 
- **Rival**: U29 (query-conditioning) is the primary rival hypothesis for the "Wall." 
- **Ambiguity**: Low. The "WHY" filing requirement for specific failure modes (e.g., SELECT rises but COMPETE stays 0) removes ambiguity regarding the cause of failure.

**VERDICT: IMPLEMENTABLE**

## R2 — IMPLEMENTABLE (verbatim)
(a) **Implementability**: High. The spec defines a precise capacity increase (4$\to$12 dim) while freezing the teacher and OOD sets. It maintains the U28 architectural routing (CE/MSE split) and utilizes a CPU-only, seed-gated execution path.

(b) **Bar Math**: 
- **SELECT-HARD ($\ge 0.80$):** Primary success metric. Requires the 12-dim encoding to resolve the "wall" encountered at 8-dim.
- **COMPETE ($\ge 0.50$):** Measures if wider codes allow for strict competition/exclusion.
- **GAP ($\ge 0.15$):** Ensures performance gain is not just noise but a structural shift.
- **Optimization Tax:** Specifically flagged. If $\text{HARD}$ drops vs U28, the "tax" of training more parameters on the same 800st budget outweighs the capacity gain.

(c) **Leakage**: Low. Uses sealed reviewer labor, twin-matched seed streams, and frozen OOD scales. Fresh codes (175/176) prevent overlap with U28.

(d) **Confounds/Rivals + Ambiguity Flag**: 
- **Rival:** The "Conditioning Hypothesis" (U29). If U30 fails to rise, the bottleneck is not encoding width but query-conditioning.
- **Ambiguity:** The "max-hinge" might chase a single mode regardless of width.
- **Flag:** Potential for "ranking without exclusion" if the pool/combiner fails despite wider encoding.

**VERDICT: IMPLEMENTABLE**

## R3 — IMPLEMENTABLE (verbatim)
**(a) Implementability:** High. The spec is a narrow capacity delta (8-dim $\rightarrow$ 12-dim) while holding all other variables (loss, diet, routing, CPU-only) constant. It uses a strict twin-matched seed protocol to isolate the effect of encoding width.

**(b) Bar Math:** 
- Primary: `SELECT-HARD` $\ge 0.80$ and `COMPETE` $\ge 0.50$ (Quorum 2/3).
- Secondary: `INHIB-USE` $\ge 0.05$; `GAP` $\ge 0.15$.
- Stability: `STD` must remain within $\pm 0.05$ of W6 baseline.

**(c) Leakage:** None detected. Use of "fresh codes 175/176" and twin-matched streams prevents temporal or seed-based leakage. The "hard-shuf gap" acts as a tripwire against index-memorization.

**(d) Confounds/Rivals + Ambiguity Flag:** 
- **Rival:** Binding/Conditioning. If `SELECT` rises but `COMPETE` stays low, the bottleneck is the combiner/pooler, not the encoding width.
- **Confound:** Optimization Tax. Increased parameters on the same 800st budget may lower `HARD` scores.
- **Ambiguity:** Low. The "WHY" filing requirement for divergence ensures any failure to meet predictions is documented.

**VERDICT: IMPLEMENTABLE**

## Adjudication (agent): v1.0 STANDS, no patches
3x IMPLEMENTABLE unanimous. Proceed to grad-check + stage-1 + 6T + evals. No mechanics changes.
