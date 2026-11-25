# Fresh-eyes battery: self-u22a-scopeparity-prereg (3x sealed; 2x IMPLEMENTABLE + 1x NEEDS-PATCH → v1.0 STANDS + pins)

Goal line carried in all 3 prompts. Sealed via root.generateText Promise.all. Raw: scratch/u22a-battery-raw.json. Health: goalInAll true, nonEmpty 3/3, hasVerdict 3/3, distinct true (lens in raw).

## R1 — IMPLEMENTABLE (verbatim)
**ANALYSIS**
1.  **Input Topology:** Fixed 68-dim vector $[h48, read4, hv4, headOld4, carry8]$. Forward pass $68 \to 24 \to 4$ is computationally trivial for CPU/in-worker. SiLU activation is stable.
2.  **Loss Dynamics:** The dual-objective loss is aggressive: $CE(hv+read+HFW, v) + 0.5 \cdot MSE(HFW, linkOut^*)$. The secondary term $1.0 \cdot MSE(HFW, 0)$ acts as a strong regularizer/anchor. With $lr=5e-3$, there is a risk of the MSE term dominating the CE gradient, potentially causing "dead-head" syndrome where $HFW \to 0$ to minimize loss, ignoring the signal.
3.  **Code Collisions:** Codes 153/154 are narrow. Given the $HFW$ output is a 4-dim projection, the mapping to 153/154 must be handled via a hard-max or specific indexer. If these are soft-assignments, the small range (2 codes) relative to the 68-dim input space suggests extreme sparsity.
4.  **The "S2 Stuck" Problem:** Previous failures (U20/U21) show $|HF|$ increased ($0.29 \to 0.74$) but performance stayed at $0.09$. This confirms a "scope bound" issue—the model is learning features that are not linearly separable or usable by the ensemble. The proposed "wide fold" (68 $\to$ 24 $\to$ 4) attempts to break this by increasing non-linearity before the final projection.
5.  **Gate Mechanism:** Hard eval-gate $(hv+read)$ bypasses $HFW$. This is critical for the "S2 recovery" target ($0.09 \to 0.10$). If $HFW$ fails, the ensemble reverts to standard $hv+read$.

**PINS**
*   **Gradient Vanishing:** Check if $MSE(HFW, 0)$ suppresses the $CE$ gradient for the 4-dim output. If $|HFW| < 0.1$ after 200 steps, the "dead-head" risk is realized.
*   **Quorum Drift:** With $R=3$ and $2/3$ quorum, a single divergent worker in the "shuf" arm could skew the parity check ($\pm 0.07$).
*   **Memory Leak:** Ensure the "frozen trunk" doesn't accumulate gradients in the $U17$ teacher blocks during the forward pass.

**VERDICT: IMPLEMENTABLE**

## R2 — NEEDS-PATCH (verbatim)
**ANALYSIS**
The U22a proposal seeks to break the "s2 stuck" plateau (0.09) observed in U20/U21 by expanding the scope of the Head Forward Weight (HFW). In U21, the scope was restricted to $HF(h)$; U22a expands this to a full 68-dim vector (h48+read4+hv4+headOld4+carry8). 

1.  **Control Strength:** The `u22a-shuf` (shift-by-1) is a weak baseline. A simple index shift doesn't prove "scope" utility—it only proves that the specific alignment of the 68-dim vector matters. To truly isolate *scope* (information availability) from *capacity* (parameter count), we need a zero-init or random-frozen baseline for the additional 64 dimensions of the HFW.
2.  **Quorum Math:** The $R=3$ quorum (2/3) for SEL/STD/PARITY is statistically thin. A single outlier run could swing the result. Given the tight bars ($\pm 0.05$), the variance across the three runs must be extremely low to hit 2/3 consistency.
3.  **The "S2" Problem:** The transition from U21 $\to$ U22a is essentially an increase in input dimensionality (48 $\to$ 68). If the result improves, the claim is that "scope" was the bottleneck. However, the rival explanation is simply **overfitting/capacity increase**. The `ABLATE` bar ($\ge 0.10$) is the only safeguard here, but it targets a recovery of the U21 s2 failure. If the model hits 0.10, it doesn't prove *why* it worked, only that it did.
4.  **Loss Function:** The hybrid loss $ce(hv+read+HFW, v) + 0.5 \cdot mse(HFW, linkOut^*)$ introduces a strong bias toward the teacher $L^*$. This may mask whether the self-learning is actually "learning" or just mimicking the teacher's 68-dim projection.

**PINS**
*   **Capacity Leak:** The HFW expands from a narrow slice to the full 68-dim. If $\text{SEL} > 0.05$, check if the model is simply utilizing the `carry8` or `read4` vectors as shortcuts rather than learning the continuity of the weights.
*   **Gate Report:** $|HFW|$ must be monitored. If $|HFW|$ spikes while the error drops, it indicates the "appetite" is simply absorbing the teacher's variance.
*   **Parity Check:** The expected jump from $0.67 \to 0.69$ is very narrow ($+0.02$). This is within the noise floor of most CPU-only trainers.

**VERDICT: NEEDS-PATCH**

## R3 — IMPLEMENTABLE (verbatim)
**ANALYSIS**
The U22a "wide fold head" attempts to resolve a persistent bottleneck observed from U20 through U21: the "s2 stuck 0.09" phenomenon. Despite increasing the scope of the head from $HF(h)$ to $HFW(all\ 5)$, previous iterations failed because the pressure was not the issue—the scope was bound. 

The current spec moves to a 68-dim input (h48+read4+hv4+headOld4+carry8) mapping to 4 codes via a SiLU layer. The critical mechanism here is the loss adaptation: adding a $0.5 \times \text{mse}(\text{HFW}, \text{linkOut}^*)$ term to the standard cross-entropy. This is a direct attempt to force the "appetite" in weights to align with the link-out projections, effectively trying to "learn how to learn" the sequence continuity that failed in U21.

The risk profile is high due to the "U18 leak" and "U19 dead" history. Specifically, if the gate $|HFW|$ is not strictly monitored, the model may revert to a degenerate solution where it ignores the 68-dim wide-fold and relies on the frozen U17 teacher, leading to the same 0.09 recovery ceiling. The "STD tax" (variance in standard benchmarks) often hides a lack of genuine self-learning in the $s2$ metric.

**PINS**
1. **Gate Leak Check:** $|HFW|$ must be logged per batch. If $|HFW|$ drops below $0.5$ while loss is decreasing, the model is leaking to the frozen teacher; abort run.
2. **S2 Variance:** $s2$ recovery target is $0.10$ (up from $0.09$). To avoid "seed luck," a minimum of 3 different random seeds must hit $\geq 0.10$ for the $\text{ABLATE}$ bar to be considered met.
3. **Parity Hedge:** The $\pm 0.07$ window against U17 is tight. If the $0.67 \to 0.69$ jump is purely additive without a corresponding increase in $|HFW|$, it is a fluke of the frozen trunk, not a result of the wide-fold head.
4. **Quorum 2/3:** For $\text{SEL} +0.05$ and $\text{COMPOSE} \geq 0.50$, the $R=3$ quorum must be strictly enforced; a single outlier cannot carry the average.

**VERDICT: IMPLEMENTABLE**

## Adjudication (agent): v1.0 STANDS + pins adopted
2x IMPLEMENTABLE, 1x NEEDS-PATCH (R2 capacity-vs-scope rival). No train/eval changes. Pins adopted: (a) report param counts U21-HF vs U22a-HFW in verdict to separate scope from capacity; (b) |HFW| bounds 0.35-0.85 with dead (<0.35) / leaky (>0.85) flags; (c) s2 +0.02 noise hedge — recovery needs ABLATE 3/3, not a single seed. Proceed to U22a driver + grad-check + 6T+6E on order.
