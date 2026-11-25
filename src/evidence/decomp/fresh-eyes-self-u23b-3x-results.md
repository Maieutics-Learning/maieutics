# Fresh-eyes battery: self-u23b-vhatmining-prereg (3x sealed; 3x IMPLEMENTABLE → v1.0 STANDS)

Goal line carried in thinking + all 3 prompts: "The final goal is we are building a SELF-LEARNING machine (M/C/E live in weights + forward pass, tools as controls only)."
Sealed via root.generateText Promise.all. Raw: scratch/u23b-battery-raw.json (pointer file; verbatim below). Health: goalInAll true, nonEmpty 3/3, hasVerdict 3/3, distinct true.

## R1 — IMPLEMENTABLE (verbatim)
**R1 REVIEW: SEALED SPEC [vhat-mining / oracle-gated]**

**1. Implementability Analysis**
*   **Mining Loop:** The logic is physically plausible. The `minerVhatWrong` trigger (argmax mismatch OR $vhatErr > median$) creates a valid filter for "hard" samples. The 20-try cap prevents infinite loops on clean data.
*   **Oracle Substitution:** The two-step trunk substitution for `oracleY` is a valid ground-truth proxy for the "correct" label when the miner is uncertain.
*   **Determinism:** Use of seed-only disjoint offsets (61300 for train, 62300 for held-out) ensures no overlap between the mining-set and the evaluation-set.
*   **Twin-Matching:** Maintaining same losses for $B=16$ (8 standard / 8 vhat-hard) prevents gradient instability.

**2. Leakage Control**
*   **Held-out Integrity:** The spec explicitly isolates the vhat-mined $N=200$ at offset 62300. Since these are never trained on, the `ORACLE-GATE` and `HARD` bars are valid.
*   **Frozen State:** All components except $S+scorer+HF$ (U22c wiring) are frozen, preventing weight-drift during the mining-phase.
*   **Distractor Re-seeding:** Handled via the disjoint offset protocol.

**3. Cost & Resource Profile**
*   **Compute:** Bounded forward passes (cap 20) per row.
*   **Hardware:** CPU/In-worker execution is sufficient for the $vhatErr$ and $argmax$ calculations.
*   **Memory:** Low overhead; only requires storage of the $N=200$ held-out indices.

**PINS**
*   **CAPS:** 20 tries per row; $B=16$ (8/8 split).
*   **OFFSETS:** Train: 61300+seed; Held-out: 62300+seed.
*   **RULES:** $\text{Keep iff } (argmax\_mismatch \lor vhatErr > median) \land \text{oracleY correct}$.
*   **CONTROLS:** $S+scorer+HF$ (Codes 161/162).
*   **GATES:** $\text{OracleY} \ge 0.70$ (Proceed); $\text{OracleY} \le 0.20$ (Void).

VERDICT: IMPLEMENTABLE

## R2 — IMPLEMENTABLE (verbatim)
**R2 SEALED REVIEW: SPEC U23b (VHAT-MINING)**

**1. Bar Math Verification**
*   **Oracle-Gate (0.70):** Valid. Sets viability threshold for the teacher-substituted trunk.
*   **Miner-Vhat-Floor (Joint):** `adaptY <= 0.60` (2/3) AND `vhatErr > standard` (3/3). This correctly isolates the "blind spot" of the current head, ensuring the miner is actually finding hard samples rather than noise.
*   **Hard/Gap/Select:** `HARD >= 0.60` with `GAP >= 0.15` over frozen-U22c. This is a tight but realistic margin for a targeted diet. `SELECT-HARD >= 0.80` ensures the mining process is high-precision.
*   **Summary/Ablate/Sel:** `SUMMARY-HARD drop >= 0.05` and `ABLATE drop >= 0.10` (3/3) verify that the learned weights are actually doing the work and not just riding the frozen trunk. `SEL +0.05` over shuffle confirms the diet is superior to random sampling.
*   **Quorum:** 2/3 SE (N=200) is statistically robust for the given $\pm 0.05$ STD.

**2. Rivals Analysis**
*   **Noise-vs-Learnable:** The `GAP` on held-out (N=200) vs. frozen-U22c is the decisive metric. If the gain disappears on held-out, it's noise; if it persists, it's learnable.
*   **CE-Shortcut:** The 50/50 split (8 standard / 8 vhat-hard) with per-half curve monitoring prevents the model from simply ignoring the hard samples to minimize global loss.
*   **Capacity Rival:** Since the trainable S+scorer+HF uses *exact* U22c wiring (codes 161/162), any delta in performance is strictly attributable to the "diet" (the mined samples) and not an increase in parameter count or architectural advantage.
*   **Oracle-Gate Viability:** High oracle performance + high miner-vhat-wrong indicates the information exists in the trunk but is missing in the head. This confirms the problem is "head-fixable" rather than "trunk-deficient."

**3. OOD Control**
*   `Frozen-U22c` acting as the baseline on the *same* vhat-hard set is a rigorous control. It prevents "leakage" of the result by proving the base architecture cannot solve the mined set without the U23b training.

**PINS:**
*   `S+scorer+HF` wiring lock (161/162).
*   `vhatErr > median` (Miner-Vhat-Floor).
*   `Oracle-Gate >= 0.70`.
*   `GAP >= 0.15` vs. Frozen-U22c.

VERDICT: IMPLEMENTABLE

## R3 — IMPLEMENTABLE (verbatim)
**R3 REVIEW: U23b SPEC**

**Trap Analysis:**
1. **Trunk-Bound Trap (U23):** The transition from `minerY` (previous fail) to `vhat-mining` with `oracleY` (trunk two-step substituting `linkOut*`) effectively decouples the miner's internal bias from the ground-truth validation. By requiring `minerVhatWrong AND oracleY correct`, the spec ensures we are mining for "hard-but-learnable" samples rather than "miner-wrong-but-actually-wrong" (trunk-bound/OOD) samples. The `oracleY` gate prevents the model from training on noise if the trunk cannot resolve the substituted link.
2. **Decorative/Shortcut Risks:**
    - **Summary:** The `SUMMARY-HARD drop >= 0.05` bar prevents the summary from being decorative; it must demonstrate a functional loss of information/performance when degraded.
    - **Twin-match:** Explicitly called out as "twin-matched," maintaining parity with the standard diet.
    - **Transcription:** Use of `mse(minerHF, linkOut*)` for `vhatErr` avoids the categorical transcription errors seen in U23.
3. **Stratification & Ambiguity:**
    - **Ambiguity:** The spec resolves the `argmax-vs-median` conflict by defining `minerVhatWrong` as *either* an `argmax mismatch` OR `vhatErr > median`. This creates a hybrid hard-mining strategy that doesn't rely solely on a potentially drifting median.
    - **Strain:** While a explicit "fallback-strain flag > 0.25" is not listed as a metric, the `cap 20 tries` and `fallback counted` logic implements the necessary pressure valve. If the 20-try cap is hit frequently, the `ORACLE-GATE` will naturally fail ( < 0.70), triggering `VOID`.

**PINS:**
- **PIN-1 (Oracle Gate):** The $0.70$ threshold on held-out vhat-mined data is the primary circuit breaker against U23-style pressure failure.
- **PIN-2 (Diet):** $50/50$ split (8 standard / 8 vhat-hard) prevents catastrophic forgetting of the base distribution while forcing adaptation to the hard-set.
- **PIN-3 (Validation):** The `held-out vhat-mined N=200` set is strictly separated from training, ensuring the `SELECT-HARD` metric is an honest reflection of learning, not memorization.

**VERDICT: IMPLEMENTABLE**

## Adjudication (agent): v1.0 STANDS, no patches
3x IMPLEMENTABLE unanimous. No train/eval changes (precedent: pins-only adoption; here no pins beyond spec — spec already carries hard-rate reporting, per-half curves, twin-matching, fallback counting, oracle-gate VOID). Proceed to oracle-gate probe + grad-check + 6T + evals on order.
