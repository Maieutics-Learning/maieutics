# Fresh-eyes scratch-v10 battery (3 sealed, pre-compute) + adjudication

Spec frozen: scratch-v10-prereg.md (v10.0 at review time). Briefs sealed, parallel, ≤150 words, return shape verdict + hardest test.

## Raw R1 (math auditor)
1. **ONE-PASS/TWO-PASS (0.60):** Tripwire. A 1.5pp margin over best-single (0.585) is statistically insignificant for $n=200$ with $R=3$. It fails to distinguish a genuine architectural gain from noise/seed variance.

2. **SCRATCH-READS (0.80):** Sound. Setting the bar $\sim 5\%$ below forward precedent (0.85) provides a realistic but rigorous floor for retrieval capability.

3. **Misbehaving Bar:** `SLOT-CONTROL`. The $\Delta \ge 0.05$ requirement is too loose. Given the noise in the $0.60$ bars, a $5\%$ difference between $T$ and $U$ is likely indistinguishable from variance, rendering the "supervision vs. slot" isolation inconclusive.

4. **Verdict:** REJECT/REVISE. The evaluation metrics lack the resolution to prove the "internal carry" bottleneck hypothesis.

5. **Hardest Falsifier:** Compare $T$ (Supervised) vs. $U$ (Unsupervised) on `oracle final` (True $v$ provided). If $\Delta \approx 0$, the supervision is useless; if $T$ still fails `two-pass final` while `oracle final` hits, the failure is the additive head, not the scratchpad.

## Raw R2 (implementation auditor)
1. **Implementability (Train):** YES. `trainModel` handles arbitrary loss targets. Supervision of `posOut[8]` is a standard per-token cross-entropy task.
2. **Implementability (Eval):** YES. The forward-cache stores hidden states/activations. A two-pass harness merely requires reading the cached output of `posOut[8]`, updating the input tensor for the second forward pass, and re-running the model.
3. **U Definition:** WELL-DEFINED. U is a controlled ablation. By providing the slot (physical space) but removing the supervision (gradient), any performance delta between T and U is strictly attributable to the supervision signal.
4. **Unenforceable Steps:** NONE. All constraints (CPU-only, R=3 quorum, frozen seeds) are external to the model logic and enforceable via the driver script.

**Verdict:** IMPLEMENTABLE.

**Hardest Falsifier:** The "Internal Carry" hypothesis. If `one-pass final` $\approx$ `two-pass final`, the model has developed an internal latent carry, rendering the explicit scratchpad redundant and the "addressable value" theory moot.

## Raw R3 (alternative-explanation)
1. **Rival:** **Implicit State Carry.** The model learns to carry the retrieved value $v$ in the hidden state (residual stream) without using the explicit scratch slot. If `one-pass final` $\approx$ `two-pass final`, the scratch slot is decorative, and the model is simply performing a standard forward-pass composition.

2. **Killer Test:** **Symmetry-Break Probe.** Compare `two-pass final` (where the harness feeds $v\hat{}$ back into the slot) against `one-pass final` (internal carry only). If $\Delta \approx 0$, the "scratch-acc" is a decoupled side-effect and not the causal driver of the final answer.

3. **Spec Status:** **CONTAINS.** The `SLOT-CONTROL` bar ($T - U \geq 0.05$) and the comparison between `one-pass final` and `two-pass final` specifically isolate whether the explicit slot provides a performance gain over the internal carry.

4. **Verdict:** **VERIFIED** (via `SLOT-CONTROL` and `ONE-PASS` vs `TWO-PASS` metrics).

## Adjudication (owner: agent, 2026-11-23)
- R1 → SPLIT: SCRATCH-READS soundness agreed. REJECT the tripwire framing with design logic: 0.60 is not calibrated against 0.585 — it separates compose-grade (0.6+, 1.5x chance+noise band) from the walled band (0.38-0.55), and expectation is filed open with predicted ONE-PASS miss vs TWO-PASS hit, so the load-bearing comparisons are paired within-model (one-vs-two-pass, same init/data) and paired across-arm (T-vs-U nested-identical), both at program-standard Δ0.05. Adopted: R1's oracle falsifier as verdict-time analysis (report T-oracle − U-oracle: Δ≈0 → supervision doesn't change the add-step; T two-pass << T oracle → scratch quality is the bottleneck). Free — oracle is already a filed metric. Bars stand.
- R2 → ACCEPT (no patch). Note: R2's falsifier (one-pass ≈ two-pass → internal carry works) is a scored FINDING in favor of composition, not a failure — filed expectation names both directions.
- R3 → ACCEPT (contains; no patch). Implicit-state-carry is the same hypothesis as R2's falsifier from the other side; the filed one-vs-two-pass + slot-control comparisons decide it either way.
- Score: 1 split (+analysis), 2 accept. No re-run (v10 core unchanged; oracle cross-arm is verdict-time analysis on frozen ledgers).
