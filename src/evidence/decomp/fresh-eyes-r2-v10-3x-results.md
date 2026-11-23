# Fresh-eyes r2-v10 battery (3 sealed, pre-compute) + adjudication

Fleet pattern: 3 concurrent sealed generateText calls. Replies verbatim; adjudication after.

## R1 (rival) — VERDICT: ENFORCEABLE — verbatim

(a) **ADD4 Vacuity:** `auxW` (4.0) is not vacuous. While `v` is provided in the input, the `prefixLabels` / `scratchLabelsT` mechanism supervises the *generation* of intermediate scratchpad tokens. Since T2 trains on the same data but with lower/different dose, the auxiliary weight actively modifies the gradient update for those specific labels. If `auxW` were 0, it would be a T2 rerun; at 4.0, it is a supervised dose-increase. The bar tests if this specific label-weighting lifts oracle performance.

(b) **R2H Routing Confound:** The "Difficulty Confound" (Hard Lines). On truly difficult lines, both retrievers (a and b) and the ADD module may fail regardless of noise. If `comp|agree` is high simply because both retrievers are consistently wrong on hard cases, the gap narrows. However, the routing rule survives this because it measures the *differential* ($\text{agree} - \text{disagree}$). If noise-binding is the primary failure mode, the second retriever will often provide a different $\hat{v}$, increasing `comp|disagree` and shrinking the gap. A gap $\ge +0.15$ confirms the error is noise-driven (retriever-specific) rather than task-inherent.

(c) **K3P Confusion:**
- **Actionable:** Clusters where the model consistently predicts $k+1$ or $k-1$. This indicates a systematic off-by-one shift in the ADD logic, solvable via architectural tweaks or targeted data.
- **Trivia:** Random distribution across all $k$ or high-frequency collapse to a single "favorite" number regardless of input. This indicates total failure to bind the value.
- **Misleading Bar:** The `t2-vs-cboracle gap` is misleading because it doesn't distinguish between "almost correct" (off-by-one) and "completely random," treating both as failures while the `worst-k` might be a fluke of a small sample size.

VERDICT: ENFORCEABLE

## R2 (enforceability) — VERDICT: CONDITIONAL — verbatim

**ENFORCEABILITY ANALYSIS**

**1. ADD4 Train Build**
*   **Gap:** The spec defines the data composition (150 TRUE-flat + 150 fwd) and the `auxW 4.0` delta, but does not explicitly name the training script or recipe.
*   **Requirement:** Must confirm `runADD4Train` utilizes the same hyperparameters/optimizer as `runScratchTF`.
*   **Status:** **MUST-FIX** (Define recipe/script).

**2. ADD4 Eval Oracle-3p**
*   **Gap:** "one-pass on true-flat lines" is mentioned, but the input layout is not explicitly mapped to the T5-oracle measure.
*   **Requirement:** Confirm input tensor layout (e.g., `[batch, seq]`) and prompt template are identical to the T2-oracle baseline to prevent measurement drift.
*   **Status:** **TOLERABLE** (Implicitly linked to T2-oracle).

**3. T2 Fwd Baseline**
*   **Gap:** The spec references "filed `d-scratch-eval-t2` fwd" for the verdict, but does not state which specific ledger/version of the T2 evaluation this file belongs to.
*   **Requirement:** Specify ledger version/timestamp.
*   **Status:** **MUST-FIX** (Specify ledger version/timestamp).

**4. R2H Pass-2 Input**
*   **Gap:** Pass-2 uses `flat+[qk,k,vhat_a,8]`. The spec says "cb's" (callback/consensus), but does not explicitly define the "vhat" selection logic when `vhat_a` and `v_b` disagree.
*   **Requirement:** Confirm `vhat_a` is used regardless of agreement to prevent leakage from `vhat_b` into the `t2` evaluation.
*   **Status:** **TOLERABLE**.

**5. K3P True-Flat Test Build**
*   **Gap:** `srng 52500+seed` is provided, but "confusion (for each true k, distribution of wrong answers)" is vaguely defined.
*   **Requirement:** Define confusion matrix as: $\text{Count}(\text{predicted } k_j | \text{true } k_i)$ where $i \ne j$.
*   **Requirement:** Confirm $n=200$ refers to total samples or 200 per $k$-category.
*   **Status:** **MUST-FIX** (Define counts over $k$-distribution).

VERDICT: CONDITIONAL

## R3 (falsifiability) — VERDICT: ENFORCEABLE — verbatim

**FALSIFIABILITY ANALYSIS**

**1. ADD4-DOSE**
*   **Rule:** `add4.oracle - t2.oracle ≥ +0.05` for $\ge 2/3$ seeds.
*   **Ambiguous Outcome:** $\ge 2/3$ seeds show a lift of $0.01 \le \Delta < 0.05$ (Positive trend but fails threshold).
*   **Prediction:** $\text{Lift} < 0.05$; $1/3$ seeds pass. (Mechanism: T2 already converged on the data distribution; $4\times$ dose provides diminishing returns).
*   **Status:** Falsifiable.

**2. R2H-ROUTING**
*   **Rule:** $\text{gap} \ge +0.15$ for $\ge 2/3$ seeds $\rightarrow$ RETRIEVER route; else $\rightarrow$ ADD route.
*   **Prediction:** $\text{Gap} \approx +0.20$; $3/3$ seeds pass. (Mechanism: Retriever noise is stochastic; a second independent pass/model often corrects the first's delimiter error, creating a significant gap between agreement and disagreement).
*   **Status:** Falsifiable (Binary routing).

**3. K3P-PROFILE**
*   **Rule:** Descriptive analysis of `worst-k` and confusion patterns.
*   **Ambiguous Outcome:** Uniform error distribution across all $k$ (No specific "worst-k" identified).
*   **Prediction:** $k=3$ remains the worst-performing bin. (Mechanism: Historical baseline across T2/T6 shows consistent failure at $k=3$ due to specific token-length/attention boundaries).
*   **Status:** Non-falsifiable (Descriptive only; serves as input for R3).

**CRITICAL FLAGS**
*   **Gameability:** Low. The use of frozen test sets (52400+) and specific seed-based RNGs prevents cherry-picking.
*   **Physical Plausibility:** High. CPU-only restriction and NO PUSH ensure the result is a product of the specified compute, not an external optimization.
*   **Risk:** The "WATCH fwd < 0.75" is a flag, not a fail, which prevents the experiment from being prematurely rejected due to distortion.

VERDICT: ENFORCEABLE

## Adjudication (pre-compute)

- R1 vacuity concern: ANSWERED by R1 itself (auxW active via prefixLabels on true lines — dose is real). No change.
- R1b difficulty-confound: rule survives as differential (adjudicator agrees). No change.
- R1c off-by-one actionability: ADOPTED as K3P read lens (report off-by-one share vs random-collapse). No eval change.
- R2 MUST-FIXes → v10.1 pins: ADD4 recipe = runScratchTF-identical (same arch/steps/batch/lr/optimizer/data build incl. shuffle; ONLY auxW 1.0→4.0); oracle-3p = byte-identical to T5-oracle construction (true-v flat+[qk,k,v,8], srng 52500+seed, same 200 lines); T2 fwd baseline = accFwd from filed d-scratch-eval-t2-s{seed}.json (read at verdict); R2H pass-2 ALWAYS vhat_a (no vhat_b leakage); K3P n=200 total, confusion = Count(pred j | true i) over the 200.
- R3: rules stand; recorded predictions (ADD4 lift<0.05 1/3; R2H gap≈+0.20 3/3; K3P k3 worst).

## Amendment v10.1 (pins only; zero design changes)
As adjudicated above.
