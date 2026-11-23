# Fresh-eyes r5-v10 battery (3 sealed, pre-compute) + adjudication (FINAL ROUND)

Replies verbatim; adjudication after.

## R1 (rival) — VERDICT: ENFORCEABLE — verbatim

(a) **Effective Pressure.** Zeroing aux labels on non-k3 lines does not merely lower total pressure; it creates a **gradient imbalance** (spot-pressure). Because the "clean" diet is uniform but the auxiliary signal is sparse (only on k3 lines), the model is forced to rely on the aux-signal specifically for k3-recovery while treating others as noise. This is a test of **spot-pressure**, not just a lower-total-pressure regime.

(b) **T8 Value.** T8 is a "compositional" test. By replacing the `cb-retrieve` (T7) with the `K3AUX` retriever, it tests if the spot-pressure repair actually restores the retrieval mechanism to a functional state. It adds a **verification of repair**: if T8 $\approx$ T7, the K3AUX repair is functionally equivalent to the gold-standard retriever.

(c) **FQ2 Threshold.** A 0.70 threshold is a **strawman**. Since the ADD4 model never encountered the `flat+[qk,8]` query format (OOD), a success rate of $\geq 0.70$ would imply the "dose" (training) created a universal directional symmetry regardless of input format. The expectation of $\sim 0.4$ is realistic; 0.70 is an intentionally high bar to prove "unification" rather than mere chance.

**Strongest reasons each bar misleads:**
- **K3AUX-REPAIR:** The $+0.05$ delta could be noise if the GUARD (k1-oracle) is violated, meaning the "repair" is actually just broad-spectrum distortion.
- **T8-HARNESS:** The 0.60 floor is too low to prove repair; a model could hit 0.60 via bias without actually repairing the k3-retrieval mechanism.
- **FQ2-DIRECTIONS:** The binary decision (UNIFIES vs. SPECIALIZED) ignores the possibility of partial transfer, treating a 0.69 as a total failure.

VERDICT: ENFORCEABLE

## R2 (enforceability) — VERDICT: CONDITIONAL — verbatim

**ENFORCEABILITY GAPS**

**K3AUX prefixLabels:**
*   **MUST-FIX:** The spec defines `prefixLabels` logic based on `x[7] === 3` (add-k) and `x[9]===8/x[8]===0`, but fails to define the **length** of the "all-null" vector. If the model expects a fixed-size tensor for auxiliary labels, the null-vector must match that exact dimensionality.
*   **MUST-FIX:** `scratchLabelsT(A, x)` is referenced but not defined. The mechanism for generating these labels is a black box.
*   **TOLERABLE:** `bindLabels` is mentioned as "intact"; assuming it follows existing `AUX4` implementation for forward lines.

**K3AUX Diet:**
*   **TOLERABLE:** Stated as "AUX4-identical." This implies seeds and distribution are mirrored, but the spec doesn't explicitly link the `drng/frng` seeds to the `AUX4` baseline.

**T8 Inputs:**
*   **MUST-FIX:** "m1 swapped" is ambiguous. It must be explicitly stated that `m1` (from T7) is replaced by the `k3aux` retriever output to ensure the harness measures the intended component swap.

**FQ2 Construction:**
*   **MUST-FIX:** Spec claims "same 200 lines as FQ," but `srng` is set to `52500+seed`. If FQ used a different base seed, the "same 200 lines" is mathematically impossible. Stream state must be verified against the original FQ seed.

**Per-k Oracle:**
*   **MUST-FIX:** "K3P construction" is mentioned but not detailed. Without the specific construction logic for the K3P oracle, the `K3AUX-REPAIR` bar (+0.05 over t2 k3-oracle) cannot be objectively calculated.

VERDICT: CONDITIONAL

## R3 (falsifiability) — VERDICT: ENFORCEABLE — verbatim

**1. K3AUX-REPAIR**
*   **Rule:** Primary: $\text{Score}_{\text{K3AUX}} - \text{Score}_{\text{T2}} \ge +0.05$ (2/3 quorum).
*   **Guard:** $\text{Score}_{\text{K1-Oracle}} \ge (\text{T2-K1} - 0.10)$ (2/3 quorum).
*   **Guard Semantics:** Strict. If the guard is violated (poisoning occurs), the bar fails regardless of the primary lift.
*   **Ambiguity:** Low. Quantitative delta is explicit.
*   **Prediction:** HIT. $\Delta \approx +0.07$. Mechanism: Uniform diet removes skew-poisoning while spot-pressure preserves $k_3$ labels.

**2. T8-HARNESS**
*   **Rule:** $\text{Composed Score} \ge 0.60$ (2/3 quorum).
*   **Secondary:** $\Delta(T8 - T7)$ is descriptive only.
*   **Prediction:** HIT. $\text{Score} \approx 0.65$. Mechanism: K3AUX retriever approximates CB performance in the T8 composition.

**3. FQ2-DIRECTIONS**
*   **Rule:** $\text{Accuracy} \ge 0.70$ (2/3 quorum) $\rightarrow$ UNIFIES; else $\rightarrow$ SPECIALIZED.
*   **Ambiguity:** Low. Binary outcome based on a hard threshold.
*   **Prediction:** SPECIALIZED. $\text{Score} \approx 0.40$. Mechanism: ADD-only training lacks the reverse-mapping (query $\rightarrow$ value) required for retrieval without a provided $k$.

**Gameability/Falsifiability Flags:**
*   **T8-HARNESS:** Potentially gameable if "composed" allows for partial credit or heuristic scoring; however, the $\ge 0.60$ floor makes it falsifiable.
*   **K3AUX-REPAIR:** High falsifiability due to the Guard clause; the model cannot "cheat" the repair by sacrificing $k_1$ stability to boost $k_3$.

VERDICT: ENFORCEABLE

## Adjudication (pre-compute)

- R1a/R1b: confirm design (spot-pressure by construction; T8 as verification-of-repair). No change.
- R1c + guard semantics: GUARD STRICT pinned (violation fails bar even if primary hits). FQ2 partial-transfer: raw number reported, binary decision stands.
- R2 MUST-FIXes → v10.1 pins: all-null = new Array(x.length).fill(null) (scratchLabelsT shape convention — same-length arrays, null = no loss); scratchLabelsT = driver line 1698 (filed precedent); diet = AUX4-identical incl. drng/frng/sh seeds + shuffle; T8 = T7 with m1:=k3aux (pass-2 identical ADD4 on flat+[qk,k,vhat,8], byK same); FQ2 = FQ construction exactly (srng 52500+seed → same 200 lines; verified runFQ uses same stream); per-k = K3P construction (n=200 total, true-v flat lines, same bins).
- R3: rules stand. Predictions: K3AUX +0.07 HIT; T8 ~0.65 HIT; FQ2 ~0.40 SPECIALIZED.

## Amendment v10.1 (pins + strict guard)
As adjudicated above.
