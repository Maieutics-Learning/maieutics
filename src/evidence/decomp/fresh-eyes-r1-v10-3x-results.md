# Fresh-eyes r1-v10 battery (3 sealed, pre-compute) + adjudication

Fleet pattern: 3 concurrent sealed generateText calls. Replies verbatim; adjudication after.

## R1 (rival) — VERDICT: CONDITIONAL — verbatim

(a) **C6 Unity Bar**: The bar is vacuous by construction. The spec defines C6 pass-2 as using the "SAME cb model on flat+[qk,k,vhat,8] $\to$ answer," where the input is explicitly defined as the "cb.two input exactly." Because it uses the same model and the same input, any divergence would require a shift in the $\hat{v}$ distribution, but the spec identifies the input as identical. Thus, $|C6 - cb.two| \le 0.10$ is a tautology unless the harness introduces noise.

(b) **LM4 Rescue**: The comparison $\text{lm4 two-3p} - \text{lm1 two-3p} \ge +0.05$ does not isolate "rescue-from-dilution" because it compares a high-pressure model (LM4) against a baseline (LM1) on the same task. Since $4x > 1x$ already outperformed on a clean diet (AUX4 > LM1), the gain could be simple capacity/pressure scaling rather than a rescue effect. To isolate rescue, LM4 must be compared against a "clean" 4x model (non-diluted) on the same 3p task.

(c) **FQ Preservation**: The bar $a4 \text{ flats} \ge 0.80$ does not necessarily test the "clean pathway." The "Nearest-failure" section notes that AUX8 one-pass gains hint that the "answer pathway changed." This suggests AUX4 could achieve high flats-accuracy via a new, pressure-induced route rather than preserving the original FWD3 clean-retrieve mechanism.

**Strongest reasons each bar misleads:**
- **C6**: It tests identity, not unity.
- **LM4**: It confounds capacity gains with rescue effects.
- **FQ**: It tests output correctness, not pathway preservation.

VERDICT: CONDITIONAL

## R2 (enforceability) — VERDICT: CONDITIONAL — verbatim

**ENFORCEABILITY REVIEW**

**1. C6 pass-2 input construction**
*   **Gap:** The spec defines pass-2 as `flat+[qk,k,vhat,8]`, but does not explicitly state if the token layout (ordering, padding, or delimiters) is identical to the `cb.two` baseline. It notes "C6 pass-2 input = cb.two input exactly" under *Nearest-failure*, but this is a comparison, not a construction rule.
*   **Status:** MUST-FIX. Require explicit token-sequence mapping to ensure identity with `cb.two`.

**2. FQ flats construction**
*   **Gap:** Spec cites `composeGenShiftScr(srng)` and `srng-matched rng stream 52500+seed`. While the RNG source is provided, the specific fields extracted from `composeGenShiftScr` to build a "flat" query are not listed.
*   **Status:** TOLERABLE. Implementer can derive fields from the `FWD3` eval codebase.

**3. LM4 diet build order**
*   **Gap:** Spec lists `50x2p+50x3p+50x4p sequential via drng`. It is ambiguous whether "sequential" refers to the *sampling* order into the buffer or the *training* order (epochs). Furthermore, the interaction with `150 fwd` is unclear: are they interleaved or appended?
*   **Status:** MUST-FIX. Define if `150 fwd` is a separate phase or mixed into the diet. Clarify if "sequential" means non-shuffled batching.

**4. len scrIdx for mapped lines**
*   **Gap:** No delimiters are specified for `scrIdx`.
*   **Status:** TOLERABLE. Spec confirms "no delim here," implying a fixed-width or integer-array mapping.

**Summary of Gaps:**
- **C6:** Token layout verification (MUST-FIX).
- **LM4:** Sequencing/Interleaving of diet vs. fwd (MUST-FIX).
- **FQ:** Field mapping from `composeGenShiftScr` (TOLERABLE).
- **scrIdx:** Delimiter absence (TOLERABLE).

VERDICT: CONDITIONAL

## R3 (falsifiability) — VERDICT: ENFORCEABLE — verbatim

**FALSIFIABILITY ANALYSIS**

**C6-UNITY**
- **Decision Rule:** $|c6 - 0.495/0.63/0.37| \le 0.10$ for $\ge 2/3$ seeds.
- **Ambiguous Outcome:** $c6$ falls in $[0.37, 0.53]$ for exactly one seed; result depends on whether "report abs composed" can override the quorum.
- **Prediction:** $| \Delta | \approx 0.04$.
- **Mechanism:** Frozen weights; input format shift (flat vs combo) is negligible for a model previously trained on 50/50 split.

**LM4-RESCUE**
- **Decision Rule:** $(LM4_{3p} - LM1_{3p}) \ge +0.05$ for $\ge 2/3$ seeds.
- **Ambiguous Outcome:** Delta is exactly $+0.049$; fails primary but might pass "partial rescue" narrative.
- **Prediction:** $\Delta \approx +0.10$ (C6 abs $\approx 0.50$ is irrelevant here).
- **Mechanism:** 4x pressure (AUX4-style) increases density/signal-to-noise ratio for 3p tokens over LM1 baseline.

**FQ-PRESERVE**
- **Decision Rule:** $\text{accuracy} \ge 0.80$ for $\ge 2/3$ seeds.
- **Ambiguous Outcome:** Accuracy is $0.79$; labeled "CORRUPTS" despite being near-perfect.
- **Prediction:** $\approx 0.90$.
- **Mechanism:** Clean-retrieve pathway is robust to pressure unless weights are shifted beyond a critical threshold; AUX4 is likely stable.

**FLAGGED BARS**
- **LM4-RESCUE (Secondary):** "Spread $\le 0.20$" is vague. (Spec: spread = max−min({2p,3p,4p} two-pass), as all prior spreads.)
- **C6-UNITY:** "Report abs composed" is secondary. (Kept secondary.)

VERDICT: ENFORCEABLE

## Adjudication (pre-compute)

- R1a (C6 vacuous): ACCEPTED — the bar as written is circular (same weights + same inputs = same outputs; |Δ| should be 0.000). RESCUE: C6 run becomes a determinism sanity check (expect 0.000, validates harness) PLUS the non-vacuous question — the INTEGRATION PROFILE: P(pass-2 correct | vhat correct) vs P(pass-2 correct | vhat wrong) on the single cb model. Unity-positive = re-derivation (correct despite wrong vhat); strict-pipeline = collapse when vhat wrong. Bar v10.1: sanity |C6−cb.two| ≤ 0.01 (2/3) + descriptive profile. The unity *decision* is the profile, not the delta.
- R1b (LM4 confound): PARTIAL — primary stays (lift test) + ADOPTED secondary closure fraction (LM4−LM1)/(AUX4−LM1) per seed: full rescue ≈ 1, partial ∈ (0,1). Dose-alone alternative reported openly via the AUX4 comparator.
- R1c (FQ pathway): REFRAME — bar becomes operational SERVES (≥0.80) vs DROPS; mechanistic pathway-preservation moves to R2 pool. No eval change.
- R2 MUST-FIXes: PINNED — C6 pass-2 = byte-identical construction to runBatch2Eval x2 (same code path, determinism expected); LM4 build = 50x2p→50x3p→50x4p sampling order via drng, then 150 fwd via frng, concat, shuffle via sh (sampling order only — training order is shuffled as all prior arms); FQ flats = {x: e.flat.concat([e.qk,8]), y: e.v} (runFwd3Eval flT shape), srng 52500+seed (same lines as FWD3 eval); len scrIdx = x.length−2 (no delim). Filed as v10.1.
- R3: rules stand; spread defined as before. Recorded predictions: C6 |Δ|≈0.04 (v10.1: expect 0.000), LM4 Δ≈+0.10, FQ≈0.90.

## Amendment v10.1 (clarifications + C6 rescue; zero train changes — C6/FQ are zero-training, LM4 build pinned to family precedent)
C6 bar replaced (sanity + integration profile); LM4 secondary closure fraction; FQ reframed SERVES/DROPS; build pins above.
