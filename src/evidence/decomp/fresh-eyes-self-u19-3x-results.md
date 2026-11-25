# Fresh-eyes battery: self-u19-gatedhead-prereg (3x sealed, CLOSED IMPLEMENTABLE, v1.0 STANDS)

Goal line carried in all 3 prompts (self-learning framing). Sealed via root.generateText Promise.all. Raw: scratch/u19-battery-raw.json. Health: goalInAll true, nonEmpty 3/3, hasVerdict 3/3, distinct true, lens [2024,2419,2496].

## R1 — IMPLEMENTABLE (verbatim)
**REVIEWER R1 (DISTILLATION/MECHANICS)**

**ANALYSIS:**
The primary failure mode of U18 was "head leak," where the standard-zero pressure was insufficient ($\text{weight } 0.5$) to prevent the head from absorbing signal that should have been handled by the trunk, thereby degrading the Standard (STD) baseline. 

U19 addresses this via two mechanisms:
1. **Loss Weighting:** Increasing the $\text{mse}(HF, 0)$ penalty from $0.5 \to 4.0$ (an $8\times$ increase). This forces the head to remain quiescent unless the adaptive gradient strongly outweighs the penalty, effectively pushing the "standard" signal back into the frozen trunk.
2. **Hard Bypass (Structural Guarantee):** By implementing the U17 Hard Bypass (where `standard eval ens = hv + read` and specifically excludes the $HF$ call), the $STD$ metric is no longer a measurement of "leakage" but a measurement of the frozen trunk's integrity. This decouples the evaluation of the baseline from the presence of the head, ensuring $STD$ recovers $3/3$ by construction.

**MECHANICAL RISK:**
The high penalty ($4.0$) combined with a relatively high learning rate ($5\text{e-}3$) could lead to "dead head" syndrome if the initial gradients are too steep toward zero, potentially killing the adaptive capacity before the $L^*$ teacher signal can take hold. However, the twin-matched seed stream and $800\text{st}$ budget should be sufficient for recovery.

**VERDICT: IMPLEMENTABLE**

**CONCRETE PINS:**
*   **Pin 1 (Pressure):** Verify that the $4.0$ weight on $\text{mse}(HF, 0)$ does not collapse the $HF$ weights to a point where $\text{grad\_clip } 1.0$ is never triggered; if the head is *too* dead, $SEL$ will fail.
*   **Pin 2 (Bypass):** Ensure the "Hard-Gate" is implemented at the inference graph level, not just the loss level, to guarantee the $STD$ bar.
*   **Pin 3 (Battery):** Health check confirms $3/3$ parallel streams with distinct angles; the "goal line" (teaching AI how to learn/surpass) is present in the prompt chain. Proceed to battery execute.

## R2 — IMPLEMENTABLE (verbatim)
**REVIEWER R2 (STATISTICS/RIVALS)**
**PROJECT:** U19 Gated-Head Repair
**CONTEXT:** Solving the "leakage" of the head into the standard-zero baseline observed in U18.

### Statistical Analysis & Rival Comparison
The primary failure of U18 was the inability to maintain the `STD` bar (1/3), meaning the "standard" evaluation was being contaminated by the head's learned weights despite a zero-mask. The "rival" here is the U17 GATED-WORKS architecture, which proved that a **hard bypass** (conditional logic) is superior to a **soft mask** (multiplication by zero).

By adopting the hard bypass (`ens=hv+read` for standard), you are effectively removing the head from the computational graph during standard evaluation. This transforms the `STD` bar from a learned behavior (which failed in U18) into a structural guarantee. 

However, the "price" of this guarantee is shifted to the training phase. By cranking the `standard loss mse weight` to 4.0 (an 8x increase from U18), you are applying massive pressure on the head to collapse to zero when the gating signal is "standard." This creates a high-gradient tension between the `adapt` loss (which wants the head to be expressive) and the `standard` loss (which wants it dead). 

**Risk Assessment:**
1. **Gradient Conflict:** With $\text{MSE}=4.0$, there is a risk that the head becomes *too* suppressed, hindering the `SEL` (Selectivity) gain. 
2. **Evaluation Integrity:** The `U19-GATE` check is critical. If the head is bypassed by construction, `STD` will pass by default. The real test is whether the `ABLATE` bar ($\ge 0.10$) holds, proving the head actually learned something useful for the `adapt` task despite the aggressive zeroing pressure.

### Technical Pins
*   **The Bypass:** Moving from `x0 mask` $\rightarrow$ `conditional bypass` is the correct architectural move to ensure `STD` parity.
*   **The Weight:** $4.0$ is aggressive but necessary to overcome the "leak" seen at $0.5$.
*   **The Parity:** Comparing `adaptY` to U17-gated ensures no regression in performance while fixing the leak.

### VERDICT: IMPLEMENTABLE

**Reasoning:** The design directly addresses the U18 failure mode by replacing a soft-zeroing constraint (which leaked) with a hard-coded architectural bypass and increased training pressure.

## R3 — IMPLEMENTABLE (verbatim)
**REVIEWER R3 (Past-Failure Traps) – U19 Gated-Head Repair Prereg**

**Angle:** Mechanical failure analysis and loss-function stability.
**Context:** U18 failed because the "Standard" (zero-link) performance leaked, meaning the head was absorbing the trunk's baseline intelligence rather than remaining a neutral "zero" pipe.

### Analysis

1.  **The Pressure Pivot (MSE Weight 4.0):** 
    In U18, `mse(HF, 0)` was weighted at 0.5. This was insufficient to overcome the Cross-Entropy (CE) gradient, allowing the head to "cheat" by encoding features that helped the standard task. Moving to **4.0 (8x increase)** shifts the priority from "be a useful head" to "be a dead head" during standard passes.

2.  **The Hard Bypass (The "U17 Solution"):** 
    The prereg specifies `ens=hv+read` (HF not called) for standard eval. This is a structural guarantee. By physically removing the head from the forward pass during standard evaluation, the $\text{STD}$ bar becomes a measurement of the *trunk's* stability, not the head's ability to stay silent.

3.  **Symmetry & Parity:** 
    By using twin-matched seed-only streams and a frozen U17 linker as the teacher, the U19 setup correctly isolates the variable to the *Head-Only* training.

4.  **Risk Factor:** 
    The only remaining risk is "Gradient Tug-of-War." With a $4.0$ MSE weight on standard and $0.5$ on adapt, the head is being pushed in two opposite directions. However, since the trunk is frozen, this cannot corrupt the base model—only the head.

### Verdict: IMPLEMENTABLE

**Pins for Implementation:**
- **Pin 1:** Verify that `standard eval ens=hv+read` is hard-coded in the eval loop, not just a mask of $0.0$.
- **Pin 2:** Monitor $\text{MSE}(\text{HF}, 0)$ during training. If it doesn't converge rapidly, the $4.0$ weight is being drowned out by CE; increase to $10.0$.
- **Pin 3:** Ensure the U17 teacher linker is truly frozen.

**PROCEED TO BATTERY.**

## Adjudication (agent): v1.0 STANDS + FRESH-HEALTHY
3x IMPLEMENTABLE, health 4/4 (goalInAll true, nonEmpty 3/3, hasVerdict 3/3, pairwise distinct true). Pins adopted: dead-head watch (SEL bar), hard-gate at graph level (U19-GATE), teacher frozen (construction), mse0 monitor (report |HF|). Fresh-eyes mechanism VERIFIED working: sealed parallel calls, goal line in every prompt, distinct angles, verbatim filed. Proceed to gated-head driver + grad-check + 6T+6E.
