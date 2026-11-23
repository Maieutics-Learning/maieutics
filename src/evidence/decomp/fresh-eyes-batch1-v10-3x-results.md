# Fresh-eyes batch1-v10 battery (3 sealed, pre-compute) + adjudication

Spec frozen: batch1-v10-prereg.md (v10.0 at review time). Briefs sealed, parallel, ≤150 words, return shape verdict + hardest test.

## Raw R1 (math auditor)
1. **Joint Bars Analysis**: The joint conditions for `AUX4-HELPS` and `DROPOUT-BOTH` are over-strict. Requiring a simultaneous delta on two different metrics (e.g., scratch $\Delta \ge 0.10$ AND two-pass $\Delta \ge 0.05$) significantly increases the probability of a Type II error given single-seed variance. A gain in one metric often comes at the cost of the other; forcing both creates an artificial "double-hurdle" that does not account for covariance in model performance.

2. **Misbehaving Bar**: `AUX4-HELPS`. It mandates a specific gain in "two-pass" performance while simultaneously increasing "scratch" pressure. These are often inversely correlated during training (over-specialization on scratch vs. generalization to two-pass).

3. **Verdict**: **FAIL**.

4. **Hardest Falsifier**: A model that achieves $\Delta 0.20$ on scratch (strong hit) but $\Delta 0.02$ on two-pass (marginal miss), resulting in a "Fail" despite clear evidence of the `auxW 4.0` hypothesis.

## Raw R2 (implementation auditor)
1. **Implementability**: Yes. All four functions are minimal extensions of existing logic:
   - `aux-train`: Scalar multiply of existing `auxW` loss.
   - `fwd3-train`: Filter dataset for 3-pair flats; initialize new RNG seed.
   - `dropout`: Bernoulli mask (0.5) applied to scratch-dummy labels per sample.
   - `harness-T4`: Two-pass inference chain (Model A $\rightarrow$ $\hat{v}$ $\rightarrow$ Model B $\rightarrow$ Ans).

2. **FWD3-eval-on-shift-flats**: Well-defined. It specifies the input format (`flat+[qk,8]`) and the data source (`52500+seed` shift draws).

3. **Unenforceable steps**: None. All constraints (seeds, steps, quorum) are deterministic or observable.

4. **Verdict**: **IMPLEMENTABLE**.

5. **Hardest Falsifier**: `T4-HARNESS` ($\ge 0.60$). This is a composition of two distinct models; a failure in the `FWD3` retriever's precision (even if $\ge 0.80$) or a mismatch in the `T2` model's expected input distribution for $\hat{v}$ will collapse the product.

## Raw R3 (alternative-explanation)
1. **Rival Explanation**: Regularization/Noise. For DROPOUT, the win is not "keeping pathways alive," but rather acting as a stochastic regularizer that prevents the model from over-fitting to the "copy" shortcut, forcing a more robust (though potentially noisier) representation of the add-given-v.

2. **Killer Test**: Measure the variance of the `v̂` prediction across multiple forward passes of the same input with dropout enabled vs. disabled. If the "noise" hypothesis holds, performance should degrade sharply if the noise magnitude exceeds the signal-to-noise ratio of the retrieve-wall, regardless of "pathway" availability.

3. **Presence in Spec**: No. The spec measures aggregate performance (`dp two-pass`, `dp fwd`) but does not isolate the noise-contribution or variance of the dropout mechanism.

4. **Verdict**: UNVERIFIED.

## Adjudication (owner: agent, 2026-11-23)
- R1 → ADOPTED (primary/secondary split, spec v10.1): one delta decides per bar (AUX4: scratch Δ≥+0.10; DROPOUT: two-pass Δ≥+0.10), fwd floors stay as safety (nearly free: both hold ~0.8), secondaries reported descriptively. R1's falsifier (scratch +0.20 / two-pass +0.02 → FAIL under v10.0) is exactly what the split fixes: that pattern now scores as AUX4-HIT with a noted downstream gap.
- R2 → ACCEPT (no patch). Correction logged: the mask is on the scr INPUT token at data-build (true vs dummy v), labels identical; deterministic at test — reviewer's "labels" wording imprecise, implementation unaffected. Hardest falsifier already the filed T4 bar.
- R3 → PARTIAL: reject the proposed killer test as mechanism-mismatched (train-time input masking has no test-time variance knob — nothing to enable/disable across passes). Adopt the spirit: the filed 4-metric battery (scratch/oracle/two-pass/fwd) already decomposes pathways-alive (scratch AND oracle up vs T) from pure-noise (oracle-only up) — filed as explicit verdict-time pathway-decomposition analysis, no new runs.
- Score: 1 adopted, 1 no-patch (+wording correction), 1 partial. Amendment is analysis/bars-only; no train/eval changes.
