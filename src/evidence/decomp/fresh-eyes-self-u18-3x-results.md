# Fresh-eyes battery: self-u18-headfold-prereg (3x sealed, CLOSED IMPLEMENTABLE, v1.0 STANDS)

Goal line carried in all 3 prompts. Sealed via root.generateText Promise.all. Raw: scratch/u18-battery-raw.json.

## R1 — IMPLEMENTABLE (verbatim)
**REVIEWER R1 (DISTILLATION/MECHANICS)**
**PROJECT:** U18 Linker-to-Head Fold
**STATUS:** PREREG REVIEW

### Analysis
The architectural goal is a **parameter collapse**: transitioning a functional mapping from a dedicated linker module ($L^*$) into the weights of the head ($HF$), effectively "folding" the linker's logic into the head's final layers.

**1. Distillation Validity:**
The target is well-defined. Using the frozen $L^*$ as a teacher to provide a soft target ($\text{MSE}$) while maintaining the hard task ($\text{CE}$) ensures the head doesn't just learn the task, but specifically learns to *mimic the linker's transformation*. The use of a "shuffled" control (cyclic shift of inputs) is a rigorous way to prove the head is learning a specific structural mapping rather than just generalizing the task via the trunk.

**2. Frozen Integrity & Leakage:**
- **Trunk:** Frozen (Correct).
- **Linker ($L^*$):** Frozen as teacher (Correct).
- **Head ($HF$):** Only trainable component (Correct).
- **Eval Path:** Linker is physically removed. This is the only way to verify a true "fold." If the linker were present at eval, the head could simply learn to be an identity matrix.

**3. Gating & Stability (STD):**
The design preserves the $\text{standard vs. adapt}$ split. By pushing $HF \to 0$ during standard cycles via $\text{MSE}(HF, 0)$, you prevent "leakage" where the head starts influencing the standard output. This keeps the $\text{STD}$ anchored to the W6 baseline, preventing the distillation from corrupting the base performance.

**4. Potential Pins (Risk Factors):**
- **Gradient Conflict:** The head is fighting two losses ($\text{CE}$ vs $\text{MSE}$). If $\text{MSE}$ is too aggressive, $\text{CE}$ may drift. The $0.5$ weighting is a reasonable starting point, but $\text{PARITY}$ checks against U17 will be the primary indicator of failure.
- **Capacity:** The head is $\sim 1.3\text{k}$ params; the linker is $\sim 1.7\text{k}$. This is a tight fit. If $\text{SEL}$ fails, it’s likely a capacity issue, not a logic issue.

### Verdict: IMPLEMENTABLE

**Concrete Pins for Execution:**
- **Seed Matching:** Ensure $L^*$ teacher and $HF$ input-piece are matched exactly to the U17 seed.
- **Zero-Head Baseline:** The $\text{ABLATE}$ check (zero-head adaptY drop $\ge 0.10$) is critical.
- **Symmetry:** The $50/50$ diet is mandatory.

**Proceed to Battery.**

## R2 — IMPLEMENTABLE (verbatim)
**REVIEWER R2 (STATS/RIVALS)**
**SUBJECT:** U18 Linker-to-Head Fold Prereg
**STATUS:** Pre-Compute Review

### 1. DISTILLATION VALIDITY
The transition from a gated linker (U17) to a dedicated head-weight (U18) is a classic distillation task. By freezing the U17 linker as the teacher and training the head $HF$ to mimic $\text{linkOut}^*$, you are essentially attempting to "bake" the routing logic into the head's weights.
*   **The Risk:** If the linker's output is highly non-linear or depends on a state-space the head cannot replicate from the input $h$, the head will only learn the "average" output.
*   **The Guard:** The `U18-PARITY` bar ($\pm 0.07$ vs U17) is the critical pin.

### 2. SHUFFLE CONTROL
The `u18-shuf` arm (cyclic shift of inputs) is a robust control. If `u18-shuf` matches `u18-fold`, the linker was decorative.

### 3. STD/GATING & FROZEN INTEGRITY
*   **Integrity:** CPU-only is a fail-safe against accidental drift.
*   **Gating:** $\text{mse}(HF, 0)$ for standard episodes is necessary.
*   **The "Folded" state:** Removing the linker at eval is the only way to prove the fold.

### 4. CRITIQUE / PINS
*   **Loss Weighting:** $0.5$ MSE vs CE is an assumption; warmup pure-MSE parked as repair.
*   **Seed-only streams exactly matched.**
*   **Ablation $0.10$ reasonable.**

### VERDICT: IMPLEMENTABLE
1. Verify $HF$ fresh (not U17 copy). 2. Strictly enforce No-Linker-at-Eval. 3. Monitor std.

## R3 — IMPLEMENTABLE (verbatim)
**REVIEWER R3 (Past-Failure Traps)**
**PROJECT:** U18 Linker-to-Head Fold (Distillation)
**STATUS:** PRE-COMPUTE REVIEW

### 1. CRITICAL PATH
Convert runtime-gated linker (U17) into static head weight (U18). If successful, linker ceases to exist as separate component.

**Risk (Decorative Trap):** head learns to ignore linkOut* and overfit to v via CE if MSE too weak.
**Mechanism (Shuf Control):** cyclic inputs — any gain must be structural.

### 2. TECHNICAL PINS
*   **Gating Preservation:** HF→0 via mse(HF,0) correct.
*   **MSE/CE Balance:** ce + 0.5*mse — risk CE drowns mimicry. Monitor grad magnitudes.
*   **Distillation Tolerance:** PARITY ±0.07 realistic.

### 3. VERDICT: IMPLEMENTABLE
1. Strict Freeze U17 linker. 2. S-TIGHT compliance hv+read exact. 3. Zero-Linker Eval.

**PROCEED TO BATTERY.**

## Adjudication (agent): v1.0 STANDS, no amendment
3x IMPLEMENTABLE, zero blocking flaws. Pins adopted as reports: seed matching (construction), zero-head ablation (U18-ABLATE), 50/50 diet (construction), fresh-HF init (construction), no-linker-at-eval (U18-NOLINK), gradient-conflict watch (PARITY bar), capacity note (SEL fail → capacity, not logic — filed as rival). Proceed to fold driver + grad-check + 6T+6E.
