# Fresh-eyes force-v10 battery (3 sealed, 2026-11-24)

Raw: `scratch/fresh-eyes-force-v10-3x.txt` (parallel Promise.all, full texts). Spec: `src/evidence/decomp/force-v10-prereg.md`.

## Raw R1 (math auditor)
**Verdict:** PARTIAL

**Hardest Quantitative Hole:**
The **FWD-HOLD (0.60)** is the primary risk. Lowering this from 0.70 (v10.2) acknowledges a systemic struggle with shift-only floors. If `fr-force` fails to hit 0.60 on base-k0, the "forced-read" mechanism is merely treating the symptom (bypass) without fixing the underlying representational collapse.

**Cheapest Fix:**
Run **E3 (H96 capacity)** immediately upon first `fr-force` failure. Since the design uses a narrow H48 trunk, a failure to meet the 0.70 retrieve bar while the `fr-explicit` (mask-check) passes would prove the bottleneck is parametric capacity, not the masking logic. Increasing H to 96 is a zero-cost architectural tweak that isolates "capacity walls" from "bypass shortcuts."

## Raw R2 (implementation auditor)
**Verdict:** IMPLEMENTABLE

**Gaps:**
None. The spec provides a closed-loop logic for the "forced-read" bottleneck. By replacing the flat pass2 with an OOB bucket `[9x6]`, the model is physically unable to bypass the `vhat` retrieval. The `fr-explicit` control specifically guards against formatting bugs (masking failure), while `fr-dummy` isolates whether the model is learning the slot or the content. The `dc chaining` (pass2 $\to$ pass1) and `own-vhat` from step 0 ensure the gradient flow is tied to the retrieval bottleneck.

**Cheapest Code Test:**
A JS-only script (no GPU) that initializes the `[9x6]` mask and verifies that a forward pass of `fr-explicit` (oracle $v$) yields a loss $\approx 0$, while `fr-dummy` (unsupervised $H_v$) yields a loss consistent with chance.

```javascript
// Minimal Check: Mask OOB Logic
const mask = new Array(9).fill(6); // [9x6] OOB bucket
const testInput = [/*.../];
const output = model.forward(testInput, {pass2Mask: mask});
console.assert(output.vhat_accessed === true, "Bottleneck Bypass Detected");
```

## Raw R3 (rival auditor)
Verdict: **CONTAINED**
Rival: **v10.2 SEQ / Scratch T**
Killer Test: **`fr-dummy` (auxW=0) vs `fr-force`**
Spec Contains: **Yes**

**Analysis:**
- **Mask-Memorization:** Contained via `fr-explicit` (oracle check) and `fr-dummy` (unsupervised baseline). Since `fr-force` is trained from step 0 with the mask, any gain over `fr-dummy` proves retrieval of `vhat` rather than memorizing the flat-mask pattern.
- **Carry-Bypass:** Addressed by Evolver **E1** (carry-zero). If `fr-force` performance holds when carry is zeroed, the bypass is debunked; the model is reading the slot.
- **OOD-Mask vs Force:** Contained. The mask is not a post-hoc test but integrated into training from step 0, preventing OOD artifacts from mimicking retrieval. The `fr-explicit` arm verifies the mask doesn't break the additive format.

## Adjudication (agent owns verdict, 2026-11-24)

- R1 PARTIAL, fix ADOPTED as evolver priority (not a gate change): if fr-force retrieve fails + explicit passes, E3 H96 runs FIRST (capacity vs bypass isolation). FWD 0.60 stays as filed (open lowering from v10.2 0.70 with reason — shift-only floor, not threshold tuning to pass). No bar moves.
- R2 IMPLEMENTABLE, no patch. Code test = driver smoke (mask OOB + dc chaining check pre-train, filed in driver log).
- R3 CONTAINED, no patch. E1 carry-zero already in spec as the bypass killer; mask-memorization contained by train-from-step-0 + dummy baseline.

Amendment v10.1: evolver order pinned (E3 first on retrieve-fail/explicit-pass; else E1 first). Zero train/eval changes. Score: 1 PARTIAL (adopted priority) + 1 IMPLEMENTABLE + 1 CONTAINED, 0 real gaps, 0 threshold moves.
