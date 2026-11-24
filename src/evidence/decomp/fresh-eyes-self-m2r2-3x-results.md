# Fresh-eyes battery: self M2/R2 delta-prereg (3x sealed, parallel via root.generateText)

Goal line carried in every prompt (self-learning machine; directedness; newly-trained-AI prescription).

## R1 — IMPLEMENTABLE (verbatim)
VERDICT: IMPLEMENTABLE

1. **Loss Balance**: The 50/50 split is sufficient. Because the "standard" half uses a frozen trunk and a low-capacity `Watt`, the model cannot "collapse" into a trivial solution; it must maintain the frozen base's performance while simultaneously learning the peaked attention required for the "adapt" half.
2. **Gradient Integrity**: Frozen trunk/discarded grads solve the M1 "wound" (base degradation). By isolating updates to the new $\sim 200$ params, the "write-all" strategy transforms from a destructive noise source into a mere retrieval challenge for the attention mechanism.
3. **Vitality**: Measuring attention-mass (sum of $a$ on matching supports) is a physically plausible proxy for selectivity. If `M2-VITAL` passes while `M2-ADAPT` fails, it proves the AI can *see* the answer in the notebook but cannot *use* it to compose the final output.

## R2 — IMPLEMENTABLE (verbatim)
VERDICT: IMPLEMENTABLE

1. **R2 Validity**: The transition from R1 (depth-collapse) to R2 is logically sound. By using complementary masks (new subspace) rather than redundant depth, you avoid the "same-input" degradation. Decoupling the critic from the trunk via frozen-trunk gate-only learning prevents the gradient from corrupting the base model.
2. **M2 Safeguards**: The "mixed diet" (50% standard/50% adapt) effectively creates a regularization pressure. The model must maintain base performance (STD bar) while learning the specific attention-peak for notebook retrieval (VITAL bar), preventing the "notebook-only" overfitting seen in M1.
3. **Execution Rigor**: Twin-matching and sealed reviewer pools ensure the delta is an actual architectural gain rather than seed-noise or distribution shift. The "frozen trunk" is the critical failure-preventer here.

## R3 — IMPLEMENTABLE (verbatim)
VERDICT: IMPLEMENTABLE

1. **M2 Stability:** The frozen trunk is the critical fix. By isolating gradients to the new parameters, you prevent the "mixed diet" from inducing catastrophic forgetting in the base model. The "write-all" approach transforms the notebook from a gated memory (which failed in M1) into a persistent external buffer, shifting the burden of selectivity from the *writer* to the *reader* (via $W_q$).
2. **R2 Recovery:** Moving to a complementary subspace for Pass 3 solves the R1 "depth-hurt" problem. Instead of redundant processing of the same signal, the model accesses an orthogonal feature set. This, combined with the "WHEN-gate" (critic) rather than a "WHAT-gate," prevents the rabbit-hole collapse by treating the second pass as a conditional correction rather than a recursive loop.
3. **Risk Mitigation:** The "standard" diet half in M2 acts as a regularizer. If the model attempts to over-rely on the notebook for standard tasks, the loss on the standard 50% will penalize that drift, forcing the model to maintain the frozen trunk's original capabilities while utilizing the notebook only when the signal is absent.

## Adjudication: 3 IMPLEMENTABLE → v1.0 STANDS (no amendment)
- No pins, no mechanism changes. All three endorse frozen trunk + write-all/mixed-diet (M2) and critic-gate + complementary-masks (R2) as the correct repairs for M1/R1 deaths; R3-equivalent watch (mass-without-use, critic miscalibration, complementary-no-signal) is already covered by bars (M2-VITAL vs M2-ADAPT split, R2-VITAL, R2-SEL vs ctl, M2-STD).
- Proceed to driver + grad-checks + waves per prereg. Pool = reviewer labor only.
