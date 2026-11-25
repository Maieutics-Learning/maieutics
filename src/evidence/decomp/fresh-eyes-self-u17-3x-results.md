# Fresh-eyes battery: self-u17-gated-linker-prereg (3x sealed, CLOSED IMPLEMENTABLE, v1.0 STANDS)

Goal line carried in all 3 prompts (self-learning framing). Sealed via root.generateText Promise.all. Raw: scratch/u17-battery-raw.json.

## R1 — IMPLEMENTABLE (verbatim)
**VERDICT: IMPLEMENTABLE**

### Technical Review & Analysis
The transition from U16 to U17 addresses the primary failure mode of the previous iteration: **Standard-half degradation.** In U16, the linker was applied globally, causing the "standard" (baseline) performance to drift/drop because the linker was attempting to optimize a signal that should have remained pristine. 

By introducing the **Adapt-Gated Relay**, you are effectively decoupling the "innovation" (adapt) from the "foundation" (standard). The logic is sound: the linker now only influences the gradient and the forward pass of the adapt-half.

#### 1. Grad-Check Sanity & Frozen Integrity
*   **Integrity:** The "frozen-by-construction" requirement is maintained. Since the trunk (W6/M2/U5) is not updated and the linker is a separate, trainable additive layer, there is zero risk of catastrophic forgetting in the trunk.
*   **Grad-Flow:** The loss function $\mathcal{L} = \text{ce}(\text{adapt-half}, v)$ ensures that $\frac{\partial \mathcal{L}}{\partial W_{linker}}$ is non-zero only for the adapt-stream. The standard-half forward pass $(\text{hv} + \text{read})$ is now a pure probe, meaning the STD recovery logic is physically plausible.

#### 2. Shuf Control & Validity
*   **Twin-Match:** Using `u17-gated` vs `u17-shuf` (cyclic shift) is the correct way to isolate the linker's actual learning from random noise/overfitting. If the gated-shuf performs as well as the gated-true, the "learning" is an artifact of the architecture rather than the weights.
*   **Symmetry:** The 50/50 diet ensures the model doesn't "forget" how to handle standard inputs while optimizing for adapt inputs, even though the linker is inactive on standard inputs.

#### 3. STD Recovery Logic
*   **The "Fix":** In U16, STD was 1/3 (failure to recover baseline). In U17, by skipping the linker forward pass for standard items (`ens = hv+read`), you are mathematically returning to the W6 baseline. 
*   **Prediction:** I expect U17-STD to hit 3/3 (recovery), provided the implementation of the "half-gate" is strictly deterministic.

#### 4. Bars Quorum
*   **PARITY** is the critical check here. If `gated adaptY` $\approx$ `U16-link adaptY`, it proves the gating mechanism didn't break the linker's ability to optimize.
*   **ABLATE** (drop $\ge 0.10$) will prove the linker is actually doing the work and not just acting as a bias shift.

### Implementation Pins (For Execution)
1.  **The Gate:** Ensure the `linker_forward` is wrapped in a conditional: `if item == 'adapt': return linker(x); else: return 0`.
2.  **Loss Masking:** Verify that the loss for `standard` items does not trigger a backward pass through the linker weights.
3.  **Seed Consistency:** Use the exact same seed streams for `u17-gated` and `u17-shuf` to ensure the only variable is the weight-ordering/link-validity.

**Proceed to Battery.**

## R2 — IMPLEMENTABLE (verbatim)
**REVIEWER R2 (STATISTICS/RIVALS) REPORT**
**PROJECT: Self-Learning Bench (U17 Delta)**
**STATUS: Pre-registration Review**

### Executive Summary
The move from U16 to U17 is a surgical attempt to decouple the "adapt" gain from the "standard" cost. In U16, the linker was effectively a parasite on the entire signal chain, dragging down the baseline (STD) performance while boosting the specialized (adapt) performance. By gating the linker—effectively turning it into a conditional bypass that only activates for the adapt-half of the diet—you are testing if the "cost" of the linker was purely additive interference.

### Technical Analysis

**1. Grad-Check Sanity & Frozen Integrity**
*   **The Pin:** The "frozen-by-construction" claim is critical. Since the trunk (W6/M2/U5) is frozen, the gradient flow is restricted entirely to the $\sim 1.7\text{k}$ linker parameters. 
*   **Risk:** If the "gated-off" state in the standard half isn't a hard zero (e.g., a leak in the additive path), you will see drift. However, the design specifies `ens = hv+read` for standard, meaning the linker's `linkOut` is mathematically absent from the graph. This is a robust safeguard.

**2. Shuffle Control Validity**
*   **The Pin:** Twin-matched streams (Gated vs. Shuf). 
*   **Analysis:** By keeping the cyclic shift-by-1 in the `u17-shuf` arm, you maintain a high-entropy control. If `u17-gated` outperforms `u17-shuf` on the adapt-half while both recover the W6 baseline on the standard-half, the "learning" is verified as structural and not a result of seed-luck or distribution shift.

**3. STD Recovery Logic**
*   **The Pin:** `U17-STD` bar ($\pm 0.05$ of W6).
*   **Analysis:** This is the primary success metric. U16 failed this ($1/3$ recovery). By skipping the linker forward pass on standard items, the model *must* return to W6 performance. If it doesn't, it implies the "standard" items were somehow influenced by the adapt-training (e.g., via a shared optimizer state or hidden leakage), which would be a "FAIL" verdict.

**4. Bars Quorum**
*   The $2/3$ quorum for `SEL` and `STD` is realistic. The $3/3$ requirement for `ABLATE` is correct—if the linker is actually doing work, removing it must always result in a performance drop.

### Concrete Flaws / Pins
*   **Potential Blindspot:** The "zero-carry on adapt half" (M3) is a strong constraint. Ensure that the "standard" half's carry logic remains untouched to ensure the recovery is clean.
*   **Complexity Warning:** The "deterministic half-gate" prevents the model from learning *when* to use the linker. While this simplifies the experiment, it means the AI is not "learning to learn" the gate, but rather the linker is being forced to be a specialized tool. This is correct for a bench-test, but not for a final agent.

### VERDICT: IMPLEMENTABLE

**Reasoning:** The logic is tight. The transition from U16 to U17 correctly identifies the "interference" problem and solves it via hard-gating. The use of twin-matched streams and the specific focus on recovering the W6 baseline provides a scientifically sound way to measure the "cost" of the linker. 

**Pushing to v1.1...**

## R3 — IMPLEMENTABLE (verbatim)
**REVIEWER R3 (Past-Failure Traps)**
**SUBJECT:** Delta-Prereg U17 (Adapt-Gated Relay Linker)
**CONTEXT:** Transitioning from U16 (Global Linker) to U17 (Gated Linker) to recover Standard (STD) performance while maintaining Adaptation (SEL) gain.

---

### CRITICAL ANALYSIS

**1. The "Leakage" Trap (Grad-Check Sanity):**
The primary failure mode of U16 was the "cost" of the linker interfering with the frozen trunk's output during standard tasks (STD recovery was only 1/3). U17 proposes a hard gate: `ens = hv+read` for standard and `ens = hv+read+linkOut` for adapt. 
*   **Risk:** If the `linkOut` logic is not *physically* bypassed in the forward pass of the standard arm (i.e., if it's just multiplied by 0), floating-point drift or epsilon-leakage can still occur.
*   **Requirement:** The implementation must use a conditional branch (`if gated: ...`) rather than a multiplicative mask to ensure absolute frozen integrity of the standard path.

**2. Shuf Control Validity:**
Using a cyclic shift-by-1 for `u17-shuf` is a robust control. Since the trunk is frozen and the linker is tiny (~1.7k), any gain in `u17-gated` must come from the linker's ability to map the frozen trunk's latent space to the target, rather than random noise or seed-luck.

**3. STD Recovery Logic:**
The goal is for U17-STD to return to W6 baselines (±0.05). Because the linker is now gated *off* during standard evals, this is physically plausible. If U17-STD fails to recover, the issue is no longer the linker, but "poisoning" of the shared state during the 50/50 diet. However, since the trunk is **frozen**, poisoning is impossible. The only variable is the linker.

**4. Frozen Integrity:**
The prereg specifies "frozen-by-construction." 
*   **Verification:** R3 notes that `lr5e-3` is applied *only* to the linker. The trunk (W6/M2/U5) must have `requires_grad = False`. If the linker is the only trainable component and is bypassed during STD, the recovery of W6 performance is a mathematical certainty.

---

### VERDICT: IMPLEMENTABLE

**Concrete Pins for Implementation:**
1.  **Hard Bypass:** Ensure `standard` forward pass does not call the linker function at all.
2.  **Loss Isolation:** Confirm `ce(hv+read, v)` for standard items produces exactly zero gradient for the linker weights.
3.  **Entropy Check:** Report the entropy of the `top-2` soft-max in the linker; if entropy is too low, the linker is collapsing to a single-point attractor regardless of the adapt input.
4.  **Parity Anchor:** If `u17-gated` is significantly lower than `u16-link`, the gating mechanism is introducing latency or precision loss.

**R3 Final Note:** The move to a gated relay is the correct architectural correction to resolve the U16 "interference" penalty. Proceed to battery.

## Adjudication (agent): v1.0 STANDS, no amendment
3x IMPLEMENTABLE, zero blocking flaws. Pins adopted as implementation reports (already in bars): hard bypass (conditional, not x0 mask — R3 pin 1), loss isolation (standard contributes zero linker grad — R1 pin 2 / R3 pin 2), seed consistency (twin-matched — R1 pin 3), entropy report (R3 pin 3), parity anchor (U17-PARITY bar — R3 pin 4). R2 complexity warning (deterministic gate is tool-forcing, not self-gating) filed as U18 own-phase-gate future work, not a U17 blocker. Proceed to gated driver + grad-check + 6T+6E.
