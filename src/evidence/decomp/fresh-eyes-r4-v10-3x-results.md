# Fresh-eyes r4-v10 battery (3 sealed, pre-compute) + adjudication

Replies verbatim; adjudication after.

## R1 (rival) — VERDICT: ENFORCEABLE — verbatim

(a) **AL8**: To isolate dilution-rescue from simple dose-scaling, the spec employs the **closure fraction**: `(AL8−LM1)/(AUX8−LM1)`. Because `AUX8` uses the same 8x dose but a *clean* diet (no dilution), it serves as the saturation ceiling. If `AL8` only improves due to dose, it will fail to close the gap relative to `AUX8`. The rescue is "earned" only if the delta between the dilution-train (`AL8`) and the baseline (`LM1`) is significant relative to the clean-dose gain.

(b) **T7**: T7 is a zero-training composition of two frozen weights (`cb-retrieve` $\times$ `ADD4-add`). It tests whether the "best retriever" can successfully hand off to the "best add." T7 cannot beat T6 purely via dose because T6 already incorporates the `T2` add. The delta `T7 - T6` specifically isolates the additive gain of `ADD4` over `T2`. If `T7` hits the predicted $\sim 0.73$ mean, it proves the compositional pipeline is functional, as the "oracle" increase is derived from the `ADD4` component.

(c) **ADD4P**: With $n=200$ total across bins, a bin size of $\sim 66$ is statistically underpowered to claim subtle shifts. Any observed difference is likely noise unless the shift is massive ($>15\%$). The strongest reason each bar misleads is **sampling variance**: at $N=66$, a few misclassifications swing the percentage wildly, creating "phantom" trends in the per-k profile.

VERDICT: ENFORCEABLE

## R2 (enforceability) — VERDICT: CONDITIONAL — verbatim

**Gaps identified for implementation:**

1.  **AL8 Diet Build:** SPEC defines the diet (50x2p+50x3p+50x4p sequential via drng + 150 fwd via frng), but lacks the exact concatenation/shuffle logic compared to LM4. If the shuffle mechanism differs, the "pressure-inert" hypothesis is compromised. (**MUST-FIX**)
2.  **T7 Inputs:** SPEC identifies pass-2 uses `d-r2-add4` on `flat+[qk,k,vhat,8]`. It is not explicitly stated if pass-1 inputs are identical to T6 with only $m_2$ swapped, or if the dummy state for `posOut[8]` carries different offsets. (**TOLERABLE**)
3.  **ADD4P Construction:** SPEC states it follows "K3P construction," but K3P-t2 used specific binning for dose-lift analysis. It is unclear if ADD4P uses the same bin boundaries or a new profile for the "dose-lifted" version. (**MUST-FIX**)
4.  **Closure Fraction Formula:** Formula is $(AL8 - LM1) / (AUX8 - LM1)$. If $AUX8 \approx LM1$ (denominator $\le 0$), the metric is undefined/divergent. No fallback or epsilon is specified for the zero-denominator case. (**MUST-FIX**)
5.  **T7 byK:** SPEC asks for "byK" (per-k accuracy) in Evals but does not explicitly link the byK mechanism of T7 to the T6 baseline. It is assumed identical, but not codified. (**TOLERABLE**)

VERDICT: CONDITIONAL

## R3 (falsifiability) — VERDICT: CONDITIONAL — verbatim

**1. AL8-RESCUE**
*   **Rule:** `al8.two3p - lm1.two3p ≥ +0.05` for at least 2/3 of the battery.
*   **Ambiguous Outcome:** `+0.04` or `+0.06` on only 1/3 of samples (borderline failure/success).
*   **Prediction:** $\Delta \approx +0.02$ (FAIL).
*   **Mechanism:** Dilution pressure is inert at 8x; dose escalation fails to trigger rescue.
*   **Status:** Enforceable.

**2. T7-HARNESS**
*   **Rule:** `composed ≥ 0.60` (2/3 floor).
*   **Prediction:** $\sim 0.73$ mean ($0.78 / 0.80 / 0.62$).
*   **Mechanism:** Swapping T2 for ADD4 increases oracle ceiling, lifting the composed product.
*   **Status:** Enforceable.

**3. ADD4P-PROFILE**
*   **Rule:** Comparison of per-k acc/confusion/obo vs K3P-t2 baselines.
*   **Ambiguous Outcome:** Uniform lift across all bins (no specific "worst-bin" identified).
*   **Prediction:** K3 bin remains lowest but exhibits $\sim 15\%$ lift in accuracy.
*   **Mechanism:** Dose-lifted additive primarily rescues the lowest-frequency/highest-error bins.
*   **Status:** **GAMEABLE.** (Descriptive; lacks a binary "pass/fail" threshold; "worst-bin" is a relative observation, not a hard bound).
*   **SUMMARY PREDICTIONS:** **AL8:** $\Delta < +0.05$ (Pressure-inert). **T7:** Composed $\approx 0.73$ (New ceiling). **ADD4P:** Bin-specific lift, k3 floor.
*   **R3 note (adjudicator):** "ADD4P ... Bin-specific lift observed, but k3 remains the floor" listed under predictions; the gameability flag is the actionable part.

VERDICT: CONDITIONAL (T7/AL8 are enforceable; ADD4P is descriptive/gameable and requires a concrete numerical target to be truly falsifiable).

## Adjudication (pre-compute)

- R1a/R1b: design confirmed sound (closure fraction + T7−T6 isolation already in spec). No change.
- R1c (n=66/bin noise): ADOPTED noise floor — only bin-shifts ≥ 0.15 count as real; smaller = noise. Feeds the concrete ADD4P bar below.
- R2 MUST-FIXes → v10.1 pins: AL8 build = LM4-identical (same sampling order/concat/shuffle; ONLY auxW 4→8); T7 = T6 with m2 swapped (pass-1 dummy posOut[8] identical; byK = T6 construction); ADD4P = K3P construction exactly (n=200 total, true-v flat lines, srng 52500+seed, same bins); closure denominator ≤ 0 → fraction N/A, report raw deltas.
- R3 gameability → CONCRETE BAR: ADD4P-DOSE-FIXES-WEAKEST: lift on the T2-worst bin per seed (k3 s0/s2, k1 s1; K3P-t2 refs k1 0.75/0.776/0.78, k2 0.82/0.93/0.80, k3 0.693/0.871/0.610) ≥ +0.10 (2/3) → FIXES-WEAKEST else DIFFUSE.
- Recorded predictions: AL8 Δ≈+0.02 FAIL; T7 ~0.73 (0.78/0.80/0.62); ADD4P k3 floor with ~15% lift.

## Amendment v10.1 (pins + concrete ADD4P bar)
As adjudicated above.
