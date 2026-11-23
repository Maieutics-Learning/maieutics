# Fresh-eyes batch3-v10 battery (3 sealed, pre-compute) + adjudication

Spec frozen: batch3-v10-prereg.md (v10.0 at review time). Fleet pattern: 3 concurrent sealed generateText calls, scouts never see each other. Replies verbatim below; adjudication after.

## R1 (rival hypotheses) — VERDICT: CONDITIONAL — verbatim

**Rival Hypotheses Analysis**

**(a) T6/C6 Outcomes:**
The predicted $\approx 0.70$ for T6 is not necessarily "composition." If T2 (the retriever) is sufficiently strong, T6 is simply a **retriever-only** chain: Pass-1 (dummy readout) provides a token that Pass-2 (strong retriever) treats as a trigger to fetch the correct answer from memory/context, regardless of whether Pass-1 "computed" anything. The result is a product of retriever accuracy, not a compositional lift.

**(b) DL Killer:**
The "Strong Killer" note acknowledges vocab collision (7 vs 8), but doesn't address:
1. **Positional Readout Shift:** If the model relies on the *absolute position* of the delimiter to trigger retrieval, changing 8 $\to$ 7 may shift the internal attention pointer, breaking the mechanism even if the token is "understood."
2. **Train/Eval Mismatch:** If the "coin flip" is applied during training but the eval uses a different entropy source or static mapping, the model fails due to distribution shift, not format-memorization.
3. **Vocab Collision:** Since 7 is a valid flat value (max 7), the model may treat the delimiter as data, causing a semantic collapse.
*Verdict:* The "Strong" note covers the collision, but the design does **not** explicitly control for positional shift or distribution mismatch.

**(c) Dose Bracket:**
Non-monotone outcomes (e.g., $T < D2 < AUX4 > AUX8$) could occur.
*   **D12 (12x):** Could drop due to **gradient explosion/saturation** during the 800 steps, leading to a "distortion ceiling" where higher pressure destroys the base weights.
*   **D2 (2x):** Could underperform $T$ if the low pressure is insufficient to overcome the initial noise of the scratchpad, creating a "dead zone" before the $4x$ threshold is hit.
*   **Strongest Mislead:** A "hump" in the curve (peak at $4x$) might be mistaken for an optimal pressure point, when it is actually a **failure of the $8x/12x$ arms** due to training instability, not a benefit of $4x$ pressure.

VERDICT: CONDITIONAL

## R2 (enforceability) — VERDICT: CONDITIONAL — verbatim

As the implementer, I identify the following gaps that prevent immediate, deterministic execution:

**1. Data RNG & Consumption Order**
The spec provides seeds (`52200/52300/52600+seed`) but does not define the consumption sequence.
*   **Gap:** Does the train loop draw from `52200` (init), `52300` (data), then `52600` (aux)? Or is there a per-batch draw?
*   **Gap:** Exactly how many lines are consumed per seed? (e.g., 150 train vs 200 eval). Without a line-count/step-count per RNG draw, reproducibility across different worker implementations is impossible.
*   **Status:** **MUST-FIX**.

**2. DL-KILLER Mapping Logic**
*   **Gap:** "Every token==8 in shift lines mapped to 8 or 7." This is ambiguous. Does it mean $8 \to \{8, 7\}$ via coin flip, or a deterministic mapping based on position?
*   **Gap:** "Eval rebuilds with same stream." Does this mean the eval set uses the same RNG sequence as train to determine which tokens were flipped, or a fresh draw from the same distribution?
*   **Status:** **MUST-FIX**.

**3. Readout Indices (T6/C6)**
*   **Gap:** `posOut[8]` is cited for `vhat`. Is this a global index or relative to a specific head/layer?
*   **Gap:** For `len-eval twoPass`, the spec mentions `scrIdx` but provides no value.
*   **Status:** **MUST-FIX**.

**4. C6 Specification**
*   **Gap:** The spec defers C6 to R1. While the "Design" section describes it as a zero-training unity check, the actual evaluation metrics and "battery shape" for C6 are missing.
*   **Status:** **TOLERABLE** (since it's moved to R1, but blocks the "Batch 3" total count if not clearly delineated).

**5. Unit Count Discrepancy**
*   **Gap:** The "Design" lists 11 units, then "TRIM" reduces it to 10. However, the `D12-DOSE` section still implies 3 seeds. If $T6(1) + DL(3) + D2(3) + D12(3) = 10$, the math works, but the "10-vs-11" confusion in the text suggests a lack of finality.
*   **Status:** **TOLERABLE** (Guess: the final count is 10).

**6. Token Collisions**
*   **Gap:** "7 collides with flat values." This is a warning, but not a spec. Does the implementer need to mask 7s in the flat sequence to ensure the "killer" effect is isolated to the delimiter?
*   **Status:** **TOLERABLE** (Guess: allow collision as part of the "strong killer" test).

**6. Token Collisions** (duplicate in original — preserved verbatim; reviewer emitted the section twice, second copy identical and omitted here)
*   **Status:** **TOLERABLE** (Guess: allow collision as part of the "strong killer" test).

VERDICT: CONDITIONAL

## R3 (falsifiability) — VERDICT: CONDITIONAL — verbatim

**FALSIFIABILITY / PREDICTION REVIEW**

**1. T6-HARNESS**
*   **Rule:** $\text{composed} \ge 0.60$ for $\ge 2/3$ seeds.
*   **Ambiguity:** A result of $0.59$ on all seeds fails the letter but satisfies the "stronger retriever" spirit if T5 was significantly lower.
*   **Prediction:** $0.70$. (Mechanism: T6 uses the strongest single-model retriever $\text{cb}$ which mirrors $\text{AUX4}$ performance).

**2. DL-FORMAT**
*   **Rule:** $\text{scratch} \ge 0.60$ for $\ge 2/3$ seeds.
*   **Ambiguity:** "MEMORIZED" is a label, not a value. If scratch is $0.55$, it is technically MEMORIZED, but if $\text{DL} - \text{AUX4}$ is small, the "killer" effect is negligible.
*   **Prediction:** $0.45$. (Mechanism: $\text{DL}$ introduces token 7 which collides with flat values, breaking the learned delimiter-anchor).
*   **Flag:** **Gameable.** The "adapter" clause for R2+ allows the researcher to move the goalposts by redefining "robustness work" if the primary bar fails.

**3. D2-DOSE**
*   **Rule:** $\text{D2 scratch} \ge \text{T scratch}$ AND $\text{AUX4 scratch} \ge (\text{D2 scratch} - 0.05)$ for $\ge 2/3$ seeds.
*   **Ambiguity:** If $\text{D2} = 0.70$ and $\text{AUX4} = 0.64$, it fails the $0.05$ buffer but maintains monotonicity.
*   **Prediction:** $0.75$. (Mechanism: Monotone increase in dose $1\text{x} \to 2\text{x} \to 4\text{x}$ before hitting saturation).

**4. D12-DOSE**
*   **Rule:** $\text{D12 scratch} - \text{T scratch} \ge +0.10$ for $\ge 2/3$ seeds.
*   **Ambiguity:** If $\text{D12}$ achieves $+0.11$ but $\text{fwd}$ drops to $0.70$, the "distortion watch" flags it, but the verdict remains ENFORCEABLE.
*   **Prediction:** $0.85$. (Mechanism: $\text{D12}$ fwd follows the $\text{AUX8}$ precedent of high stability).
*   **Flag:** **Un-falsifiable.** Since it is not a gate, the result of this bar cannot change the VERDICT.

**5. D12-DISTORTION (Secondary)**
*   **Rule:** $\text{fwd} < 0.75$ is flagged.
*   **Ambiguity:** This is a "watch," not a "gate." It cannot trigger a REJECT.
*   **Prediction:** $0.95$. (Mechanism: $\text{D12}$ fwd follows the $\text{AUX8}$ precedent of high stability).
*   **Flag:** **Un-falsifiable.** Since it is not a gate, the result of this bar cannot change the VERDICT.

VERDICT: CONDITIONAL

## Adjudication (pre-compute)

- R1a (retriever-only chain): PARTIAL ADOPT as framing — harness = retrieve x add by construction (T4/T5 same); product-check is the control. T6 bar stays a replication floor (v10.1-style); T6−T5/T6−T4 descriptive. No train/eval change.
- R1b (DL fairness): REJECT positional-shift with mechanism (mapping is VALUE-only, lengths/positions preserved — posOut[8] index unaffected); REJECT mismatch (eval = fresh draws, same distribution — stated); collision ADOPTED already (openly part of the killer). Amendment pins all three explicitly. No design change.
- R1c (dose hump = instability): PARTIAL ADOPT as verdict-time lens — report firstLoss→lastLoss per dose arm; a D12 collapse with divergent loss = instability not optimum. No train change.
- R2 MUST-FIXes: DOWNGRADE to pinned clarifications (implementer holds batch1/2 driver precedent: build order 150 shift via drng → 150 fwd via frng → shuffle via sh; erng drawn once per shift line at build, before shuffle; mapping per-line coin 8→{8,7} on shift-line tokens only; fwd lines untouched; eval fresh draws same stream; posOut[8] = forward cache index as in runBatch2Eval; len scrIdx = x.length−2 as in runBatch1Len; collision allowed). Filed as v10.1 amendment; zero train/eval changes.
- R2 unit count: CONFIRM final = T6 + DLx3 + D2x3 + D12x3 = 10; C6 deferred to R1 (carries full C6 eval spec there).
- R3 ambiguities: NOTED, rules stand (quorum decides; adapter routes follow-ups, never overturns a FAIL). Adopt: report DL−AUX4 gap + full dose curve numerically. Recorded predictions: T6 0.70, DL 0.45, D2 0.75, D12 scratch 0.85 / fwd 0.95.

## Amendment v10.1 (clarifications only; zero train/eval changes)
See batch3-v10-prereg.md Amendment v10.1 (appended): value-only delim mapping (positions preserved), fresh-draw eval, consumption order, readout indices, final count 10, R1c loss-curve lens, DL−AUX4 gap + dose curve reporting.
