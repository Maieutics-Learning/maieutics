# Fresh-eyes battery: self-u23-hardtask-prereg (3x sealed; 2x IMPLEMENTABLE + 1x NEEDS-PATCH → v1.0 STANDS + pins)

Goal line carried in all 3 prompts. Sealed via root.generateText Promise.all. Raw: scratch/u23-battery-raw.json (pointer file; verbatim below). Health: goalInAll true, nonEmpty 3/3, hasVerdict 3/3, distinct true.

## R1 — IMPLEMENTABLE (verbatim)
**ANALYSIS**

1.  **Mining Implementation:** The two-step online rejection sampling is feasible. With a cap of 20 tries per candidate, the worst-case computational overhead is $20 \times (\text{forward pass} + \text{scorer})$. Since the miner is a frozen U21-lowfold ledger, the cost is deterministic and bounded. Seed-only streams ensure reproducibility.
2.  **Data Composition:** The 50/50 hard/standard split per batch of 16 (8 hard, 8 standard) is numerically stable. The use of a held-out mined stream with an offset RNG effectively prevents temporal leakage, provided the RNG state is not shared between the mining loop and the training optimizer.
3.  **OOD & Baselines:** The frozen U22c-scale head serves as a valid control. The twin-matching requirement (identical row composition across arms) is critical and correctly specified to isolate the effect of the "hard" diet from general capacity gains.
4.  **Leakage Audit:** Potential risk identified in the "miner ledgers already exist" clause. If the U21-lowfold miner was trained on any subset of the current "standard" or "held-out" pools, the "hard" categorization is biased. However, based on the provided SPEC, the separation is handled via offset RNGs and frozen heads. No direct leakage of held-out samples into the training set is evident.
5.  **Cost:** CPU/in-worker only. The 20-try cap prevents the "infinite loop" failure mode of rejection sampling. Memory overhead is negligible as the miner head is frozen.

**PINS**

*   **Computational Cap:** $\le 320$ forward passes per batch of 16 for mining (Max $16 \times 20$).
*   **Batch Ratio:** $0.5$ (8 hard / 8 standard).
*   **Control:** Frozen U22c head (OOD).
*   **Matching:** Twin-matched rows (1:1).
*   **Leakage Check:** Offset RNG verified; held-out stream isolated.

VERDICT: IMPLEMENTABLE

## R2 — IMPLEMENTABLE (verbatim)
**ANALYSIS**

1.  **Bar Math Validation:**
    *   **Sanity:** `MINER-FLOOR <= 0.10` (3/3) is a strict baseline check to ensure the miner head isn't hallucinating "hard" tasks.
    *   **Performance:** `HARD adaptY-hard >= 0.60` (2/3) combined with `GAP vs frozen-U22c >= 0.15` (2/3) establishes a clear delta. To hit 0.60 while the frozen baseline stays below 0.45 is a significant shift in a 2/3 quorum.
    *   **Selection/Summary:** `SELECT-HARD >= 0.80` and `SUMMARY-HARD drop >= 0.05` are sensitive. A 0.05 drop in summary error is narrow but statistically relevant if `STD` is kept within $\pm 0.05$.
    *   **Symmetry:** `SEL hard-shuf >= +0.05` validates that the selection mechanism is actually sensitive to the "hard" label rather than just the batch position.
2.  **Rivalry 1: The 50/50 Mix Leakage:**
    *   The concern that standard tasks carry the `ABLATE` (3/3) and `STD` (2/3) metrics is valid. If the model performs perfectly on standard tasks, the aggregate `STD` remains low even if the "hard" half is wildly unstable.
    *   **Counter-measure:** The `Held-out mined stream` (offset RNG) is the critical fail-safe here. Since the held-out set consists *only* of mined hard tasks, the `GAP` and `SELECT-HARD` metrics cannot be "carried" by standard task performance. If the model is merely memorizing the 50% hard training slice, it will fail the held-out stream.
3.  **Rivalry 2: Noise vs. Learnable-Hard:**
    *   There is a risk that the "hard" tasks are simply label-noise (irreducible error).
    *   **Detection Method:** The `ABLATE >= 0.10` (3/3) and `GAP` metrics are the tell. If the "hard" set were pure noise, the `adaptY-hard` would not significantly diverge from the `frozen-U22c` baseline on the held-out stream. A gap of $\ge 0.15$ suggests the model is capturing a latent structure that the frozen head missed, rather than overfitting to noise.

**PINS**
*   **Critical Path:** `Held-out mined stream` $\rightarrow$ `GAP` $\rightarrow$ `SELECT-HARD`.
*   **Bottleneck:** `STD +-0.05` (2/3) requires extremely stable convergence to avoid `PRESSURE-FAIL`.
*   **Constraint:** `frozen trunk` ensures no leakage via weight updates in the base layers.

VERDICT: IMPLEMENTABLE

## R3 — NEEDS-PATCH (verbatim)
**ANALYSIS: R3 (PAST-TRAPS REVIEW)**

The U23 hard-task mining spec attempts to solve the "frozen-head plateau" by forcing the network to adapt to episodes the U21-lowfold miner failed. While the wiring is stable (U22c parity), the "diet change" introduces a high risk of **CE-shortcut** and **summary-leakage**.

1.  **Decorative Summary Trap:** The `SUMMARY-HARD drop >= 0.05` bar is the only safeguard against the model simply memorizing the "hard" flag as a feature. However, without a strict orthogonality check between the `SELECT-HARD` and `SUMMARY-HARD` gradients, the model can optimize for the "hard" label without actually learning the underlying task complexity.
2.  **The CE-Shortcut:** The 50/50 split (hard/standard) per batch of 16 is dangerously small. With only 8 standard samples per batch, the optimizer may prioritize the "easy" gradient of the standard half to stabilize the loss, effectively treating the hard-samples as noise rather than targets for adaptation.
3.  **Seed Variance/Mining Honesty:** The "held-out mined stream" uses an offset RNG, but there is no specification for the **stratification** of the hard-task mining. If the U21-lowfold miner failed on specific *types* of data, the "hard" set is biased. Without a variance check across seeds for the hard-rate, the `GAP vs frozen-U22c` might be an artifact of the mining bias rather than actual learning.
4.  **Frozen Drift:** The spec claims a frozen trunk, but the "two-step adapt scoring" must be strictly isolated from the weights being tested. If any leakage occurs during the 20-try cap, the `MINER-FLOOR` becomes a vanity metric.

**PINS**
*   **LACK OF STRATIFICATION:** No requirement for hard-rate consistency across seed-split subsets.
*   **BATCH IMBALANCE:** Batch size 16 (8 hard/8 std) is insufficient to prevent CE-shortcuts in high-dimensional spaces; suggests a minimum of 32 or a weighted loss.
*   **SUMMARY VALIDATION:** `SUMMARY-HARD` drop is too lean (0.05). Needs to be $\ge 0.10$ to prove it's not just noise.
*   **OOD CONTROL:** The frozen U22c-scale head provides a baseline, but the `GAP >= 0.15` is not anchored to a complexity-normalized score.

**VERDICT: NEEDS-PATCH**

## Adjudication (agent): v1.0 STANDS + pins adopted
2x IMPLEMENTABLE, 1x NEEDS-PATCH. No train/eval changes (precedent: pins-only adoption). Pins adopted: (a) report hard-rate per seed (stratification monitor — expect ~25-40%, flag <0.15/>0.60 as mining-bias); (b) report per-half loss curves (hard-half vs standard-half separately — CE-shortcut caught if hard-half flat while standard falls); (c) SUMMARY-HARD 0.05 stands as verdict bar, 0.10 flagged as strong-pass stretch (R3's hike noted, not blocking); (d) B16 stands (miner grads never touch trunk — frozen by construction; twin-matching preserved); (e) noise-vs-learnable decided by GAP on held-out (R2's detection method). Proceed to mining-harness test + grad-check + 6T + evals on order.
