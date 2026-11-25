# Fresh-eyes battery: self-u16-linker-prereg (3x sealed, CLOSED IMPLEMENTABLE, v1.0 STANDS)

Goal line carried in all 3 prompts (self-learning framing). Sealed via root.generateText Promise.all. Raw: scratch/u16-battery-raw.json.

## R1 — IMPLEMENTABLE (verbatim)
**VERDICT: IMPLEMENTABLE**

**Reviewer R1 Analysis:**

1.  **Grad-Check & Training Logic:**
    *   **Feasibility:** Yes. Since the trunk, head, and notebook are frozen, the gradient flow is restricted entirely to the linker's projection matrices, the 16x16 relay weights, and the output projection.
    *   **Stability:** Because the "base" features (frozen pieces) are static, the optimizer only needs to solve for the routing/composition of these features. There is no risk of catastrophic forgetting or "wound" to the base weights because dL/dW_frozen = 0.
    *   **Scale:** ~1.5k parameters is negligible for Adam at 5e-3 on a CPU-only worker. No shape/scale bugs detected; D=16 is an appropriate bottleneck for a relay linker.

2.  **The "Shuf" Control:**
    *   **Validity:** The `u16-shuf` control is robust. By permuting pieces across batch positions while keeping the linker architecture identical, you isolate the *capacity* of the linker from the *semantic alignment* of the pieces. If `u16-link` outperforms `u16-shuf`, the gain is strictly due to the learned linkage of specific frozen components, not just "adding parameters."

3.  **Addressing Past Failures:**
    *   **U1/U14 Avoidance:** By freezing the trunk and head, you bypass the "conflicting grads" and "composition collapse" seen in previous unfreeze attempts.
    *   **U10-U12 Mitigation:** Using a fixed 1.0 weight for the ensemble (no learned blend) prevents the "head-dominance" trap where the model simply learns to ignore the linker in favor of the head.

**Implementation Notes:**
*   Ensure the "Zero-carry" (M3 fix) is applied *before* the linker projection to prevent noise from the adapt-half from polluting the relay graph.
*   The "soft-weighted top-2" approach is a correct pivot from the failed STE (U12) attempt.

**Proceed to Battery.**

## R2 — IMPLEMENTABLE (verbatim)
**VERDICT: IMPLEMENTABLE**

**Reviewer R2 Notes:**
The transition from "direct execution" (frozen weights) to "self-learning" (trainable relay) is logically sound. By freezing the trunk/head and training only the linker, you isolate the *composition* of knowledge from the *storage* of knowledge, effectively treating the AI's existing weights as a read-only library. This prevents the "catastrophic forgetting" or "gradient collision" seen in U1.

**Specific Analysis:**
*   **Statistical Soundness:** Delta = +0.05 with N=200 and SE~0.035 provides SNR~1.42. Under R=3 quorum (2/3), tight but winnable. Prevents "lucky" noise from triggering LINK-WORKS while allowing genuine architectural advantage to surface.
*   **Ablation Validity:** The zero-relay ablation is the critical path. Since the linker is the *only* trainable component, any performance drop during zero-relay (keeping frozen pieces intact) proves the gain was derived from linkage, not accidental unfreeze or leakage.
*   **Rivalry/Cheaper Explanations:** "Zero-carry alone" (M3) is already accounted for (standard vs adapt half). Because `u16-shuf` uses the same zero-carry logic but destroys spatial linkage, any link−shuf delta cannot be explained by the carry-fix alone. Design isolates "capacity" from "connectivity."

**Pins:**
- **Sparsity Report:** top-2 report should include softmax entropy. If the linker hard-routes despite soft-max, delta may be unstable.
- **M3 Ceiling:** U16-COMPOSE bar (>=0.50) correctly calibrated to M3 ceiling (~0.58).

**Proceed to Battery.**

## R3 — IMPLEMENTABLE (verbatim)
**IMPLEMENTABLE**

**Reviewer R3 Analysis:**
The design successfully bypasses the **U8-U13 winner-pick trap** by abandoning the "router" architecture in favor of a **compositional relay**. By treating frozen pieces as immutable constants and training only the linker, you eliminate "head dominance" — the linker doesn't pick a winner; it synthesizes from multiple sources.

The **U12 STE trap** is avoided with "soft top-2" weighting. No hard-argmax/quantization in the forward pass; gradients stay fluid. The **fixed 1.0 blend weight** is critical; removing the learned scalar prevents learning to ignore the linker or overpowering base logits.

**Pins:**
- **Pin 1: Frozen-State Integrity.** No trunk/notebook/open-head weights updated. Any drift invalidates u16-std.
- **Pin 2: Zero-Carry Implementation.** `p_carry` explicitly zeroed on adapt half per M3.
- **Pin 3: Soft-Top-2 Weighting.** Softmax strictly additive, not hard-switch.

**Proceed to Battery.**

## Adjudication (agent): v1.0 STANDS, no amendment
3x IMPLEMENTABLE, zero blocking flaws, zero mechanics changes. Pins are watches already covered: frozen integrity (U16-STD bar + drift report), zero-carry (diet code, same as M3), soft top-2 (by construction, + entropy report adopted from R2 pin). Statistics (R2) and shuf-validity (R1) and trap-avoidance (R3) all affirm. Proceed to linker driver + grad-check + 6T+6E.
