# Fresh-eyes battery: self-u29-querycond-prereg (3x sealed; 3x IMPLEMENTABLE → v1.0 STANDS)

Goal line carried in thinking + all 3 prompts: "The final goal is we are building a machine that learns by itself — continuity + selection + appetite living in weights + forward pass, tools as controls only."
Sealed via root.generateText Promise.all (3 parallel). Raw: scratch/u29-battery-raw.json (verbatim below). Health: goalInAll true, nonEmpty 3/3, hasVerdict 3/3, distinct true.

## R1 — IMPLEMENTABLE (verbatim)
(a) **Implementability**: High. The logic is a standard MLP-based conditioning delta. The forward pass is well-defined: `scores_i = C(.) - softplus(MLP([enc_i | Eqk]))`. The routing is explicitly detached for the CE path and attached for the max-hinge path, preventing gradient collapse.

(b) **Bar Math**: Rigorous. The "Wall" (SELECT-HARD $\ge$ 0.80) and "Competition" (COMPETE $\ge$ 0.50) are binary success markers. The use of zero-query and zero-inh ablations ensures that the conditioning is functional and not merely a constant bias (the "U24 gate" failure).

(c) **Leakage**: None detected. The use of twin-matched seeds (0,1,2) and a held-out set (N=200) starting at step 68300 prevents training signal contamination. The "sealed reviewer labor" clause ensures no human-in-the-loop feedback during the forward pass.

(d) **Confounds/Rivals + Ambiguity**: 
- **Rival**: The `max-hinge` loss may still favor a single global maximum even with conditioning, potentially keeping COMPETE at 0.0 despite better ranking (addressed by the U29b top-k proposal).
- **Ambiguity**: Low. The distinction between "content-only" (U28) and "query-conditioned" (U29) is isolated to a single input tensor change.

**VERDICT: IMPLEMENTABLE**

## R2 — IMPLEMENTABLE (verbatim)
(a) **Implementability**: High. The architecture is a delta of U28; it preserves the frozen backbone and diet, introducing only a query-conditioned MLP for inhibition. The use of `softplus` and `silu` is standard, and the "detached" gradient routing ensures the query-conditioning doesn't corrupt the core content embeddings.

(b) **Bar Math**: Rigorous. The "Wall" (SELECT-HARD $\ge 0.80$) is the primary falsifiability check. The inclusion of `Q-USE` (zero-query ablation) prevents "decorative" conditioning from claiming success. The `COMPETE` bar ($\ge 0.50$) specifically tests for competitive exclusion, addressing the U28 failure where "max still wins every row."

(c) **Leakage**: Minimal. The use of twin-matched seeds, held-out sets (N=200), and frozen OOD scale heads mitigates data leakage. The "sealed reviewer labor" ensures the training signal isn't contaminated by the review process.

(d) **Confounds/Rivals + Ambiguity Flag**:
- **Rival**: The "Top-K-Max" hypothesis (U29b). If `SELECT` rises but `COMPETE` stays 0, the issue is likely a multimodal distractor manifold rather than a lack of conditioning.
- **Ambiguity**: The "Low-Cue" boundary. If gains are only seen in high-cue rows, the conditioning is merely augmenting existing signal rather than resolving ambiguity.
- **Flag**: Low. The design explicitly accounts for these via the `WHY` filing requirement.

**VERDICT: IMPLEMENTABLE**

## R3 — IMPLEMENTABLE (verbatim)
(a) **Implementability**: High. The spec defines a precise architectural delta (adding `Eqk` to the `INH` input) while freezing teacher weights and maintaining the U28 training harness. The use of CPU-only in-worker processing and deterministic tie-breaks ensures reproducibility.

(b) **Bar Math**: Rigorous. The "Wall" is explicitly defined as `SELECT-HARD >= 0.80` and `COMPETE >= 0.50`. The inclusion of zero-query and zero-inh ablations prevents "decorative" success, ensuring that any gain is mathematically attributed to the query-conditioning.

(c) **Leakage**: Minimized. Fresh codes (173/174), twin-matched seed streams, and held-out sets ($N=200$) prevent data leakage. The "sealed reviewer labor" constraint ensures the review process doesn't leak into the training signal.

(d) **Confounds/Rivals + Ambiguity**: 
- **Rivals**: The "max-pressure" failure of U28 is the primary rival; U29 tests if query-conditioning solves the lack of competitive exclusion. 
- **Ambiguity**: Low. The "WHY" filing requirement for any divergence between paper predictions and bench results eliminates interpretive ambiguity.
- **Flag**: None. The logic is sound.

**VERDICT: IMPLEMENTABLE**

## Adjudication (agent): v1.0 STANDS, no patches
3x IMPLEMENTABLE unanimous. Proceed to grad-check + stage-1 + 6T + evals. No mechanics changes.
