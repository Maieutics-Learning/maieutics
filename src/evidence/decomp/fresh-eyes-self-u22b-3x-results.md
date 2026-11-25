# Fresh-eyes battery: self-u22b-funnel-prereg (3x sealed, CLOSED IMPLEMENTABLE, v1.0 STANDS)

Goal line carried in all 3 prompts. Sealed via root.generateText Promise.all. Raw: scratch/u22b-battery-raw.json. Health: goalInAll true, nonEmpty 3/3, hasVerdict 3/3, distinct true (lens in raw).

## R1 — IMPLEMENTABLE (verbatim)
**ANALYSIS**
The U22b architecture introduces a structured bottleneck to replace the flat scope of U22a. The gradient flow is verified as continuous: Input (20 dims) $\rightarrow$ Bottleneck E (16 $\rightarrow$ 8) $\rightarrow$ Combiner HF (56 dims) $\rightarrow$ Output (4). 

1.  **Dimensionality & Graph:** The transition $20 \to 16 \to 8$ is a valid compression ratio (0.4) for a bottleneck. The Combiner HF input is correctly calculated as $h(48) + summary(8) = 56$. The output mapping $56 \to 24 \to 4$ follows a consistent narrowing pattern. Total parameter count increase ($\sim 2\text{k}$ vs $\sim 1.8\text{k}$) is marginal and does not risk overfit given the $B16$ batch size.
2.  **Learning Dynamics:** The "Self-Learning" mechanism is anchored by the $0.5 \times \text{mse}$ weight on `linkOut*`, which provides a regularization signal to the forward pass. Frozen trunk ensures drift $\approx 0$.
3.  **Ablation Validity:** The zero-summary probe is logically sound; by zeroing the 8-dim summary vector, we isolate the contribution of the bottleneck E from the main $h48$ trunk. A drop $\ge 0.05$ confirms the bottleneck is actually encoding useful features rather than acting as a pass-through.
4.  **Parity:** Target bars ($\pm 0.03$ vs U22a) are tight but realistic given the shared 68-dim scope.

**PINS**
- **Bottleneck Path:** $20 \to 16 \to 8$ (Sane)
- **Combiner Path:** $56 \to 24 \to 4$ (Sane)
- **Code Split:** 155/156 (Validated)
- **Loss Weighting:** $0.5$ (linkOut) / $1.0$ (std) (Sane)
- **Drift:** Frozen Trunk = 0 (Verified)

VERDICT: IMPLEMENTABLE

## R2 — IMPLEMENTABLE (verbatim)
**ANALYSIS**

The U22b bottleneck-funnel architecture attempts to formalize "summary" logic by forcing a 20-dim input through a 16 $\to$ 8 compression sequence before merging with the primary 48-dim hidden state. 

1.  **Parity Math ($\pm 0.03$):** Given U22a's baseline variance (typically $\sigma \approx 0.02-0.04$ on standard benchmarks), a $\pm 0.03$ parity window is tight but statistically sound for a 3-run quorum. However, if the U22a verdict is still pending, the "Battery Parallel" approach is the only way to ensure the target isn't moving. The 0.03 window effectively demands that the structural change (funneling) provides no significant performance degradation compared to the flat scope of U22a.
2.  **The "Decorative" Bottleneck Problem:** The primary risk is that the 20 $\to$ 16 $\to$ 8 bottleneck is merely a capacity limiter (acting as a regularizer) rather than a feature extractor. If the `SUMMARY` zero-ablation only drops performance by $\geq 0.05$, it proves the bottleneck is actually transporting signal. If the drop is $< 0.05$, the bottleneck is "decorative" (the model is simply bypassing it or using it as a scalar multiplier).
3.  **Rival Hypothesis:** The rival hypothesis is that the bottleneck is just a way to fit $\sim 2k$ parameters into a specific shape to mimic U22a's behavior without actually implementing a "summary" logic. The $\text{ABLATE} \geq 0.10$ requirement for 3/3 runs is the necessary safeguard here; it ensures the "summary" path is an essential component of the forward pass, not just a latent variable.

**PINS**

*   **$\text{Var}_{\text{U22a}}$ vs $\text{Parity}$:** The $\pm 0.03$ bar is valid ONLY if $N \geq 3$ for the quorum. If $N=1$, the variance of a single seed will swallow the parity window.
*   **Ablation Delta:** $\Delta (\text{Zero-Summary}) \geq 0.05$ is the critical threshold to distinguish "Learning" from "Rescaling."
*   **Complexity:** $\sim 2\text{k}$ parameters is a negligible increase over $1.8\text{k}$, meaning the overhead is acceptable for the CPU/in-worker constraint.
*   **Loss Weighting:** $0.5 \times \text{MSE}(\text{linkOut})$ is sufficient to prevent the gradient from collapsing in the 16-dim bottleneck.

**VERDICT: IMPLEMENTABLE**

## R3 — IMPLEMENTABLE (verbatim)
**ANALYSIS**
The U22b funnel architecture attempts to solve the "information congestion" seen in U22a by introducing a structured bottleneck. By isolating non-h dimensions ([read4|hv4|headOld4|carry8]) and forcing them through a 20 $\rightarrow$ 16 $\rightarrow$ 8 compression sequence (SiLU), the model is tasked with distilling state-dependency before the HF Combiner stage.

Comparing this to the "Past-Traps" (U18/U19/U21):
1. **U19 Dead-Zone Risk:** The summary8 output is the primary vulnerability. If weights initialize too low, the SiLU activation in the 20 $\rightarrow$ 16 layer may collapse. The spec requires $|summary|$ bounds of $0.3\text{--}1.2$. If the probe shows $<0.15$, we are seeing the same "dead-neuron" failure as U19.
2. **U18 Leakage:** By freezing the trunk and using a hard gate, the risk of gradient leakage into the frozen layers is mitigated. However, the `adapt 0.5*mse` to `linkOut*` introduces a coupling that must be monitored to ensure the bottleneck is actually doing the work, rather than the combiner bypassing the summary.
3. **U21 s2 Variance:** The $R=3$ quorum with $B16$ is tight. Seed variance in the bottleneck layer often exceeds $0.05$ in smaller dimensions (8-dim summary). The $\pm 0.05$ STD bar is aggressive but necessary for parity validation.

**PINS**
- **Symmetry Check:** 68-dim scope is maintained; total param count $\sim 2\text{k}$ is a $\sim 11\%$ increase over U22a ($\sim 1.8\text{k}$), which is acceptable for the added complexity.
- **Ablation Target:** The $\text{ABLATE} \ge 0.10$ (3/3) requirement is the critical success metric. If zeroing the summary doesn't degrade performance by $\ge 0.10$, the bottleneck is functionally transparent (useless).
- **Parity Window:** $\pm 0.03$ vs U22a and $\pm 0.07$ vs U17 are tight. Given the CPU-only constraint, convergence speed may be an issue for $800\text{st}$.

**VERDICT: IMPLEMENTABLE**

## Adjudication (agent): v1.0 STANDS + FRESH-HEALTHY
3x IMPLEMENTABLE, health 4/4. Pins adopted: |summary| dead-flag <0.15, SUMMARY bar as decorative-killer, FUNNEL-PARITY needs U22a verdict (battery parallel ok). Proceed to driver + grad-check + 6T+6E+3P on order.
