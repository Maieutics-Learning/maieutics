# Fresh-eyes newai-v102 battery (3 sealed, 2026-11-24)

Raw: `scratch/fresh-eyes-newai-v102-3x.txt` (battery parallel Promise.all, full texts). Spec: `src/evidence/decomp/newai-v102-prereg.md`.

## Raw R1 (math auditor)
**Verdict:** PASS

**Hardest Quantitative Hole:**
`SEQ-RETRIEVE` ($\ge 0.70). This requires the model to resolve the "single-pass wall" by autonomously retrieving into a scratch position using its own previous-pass prediction (`vhat`) without teacher-forcing. Given the historical "scratch-acc" failure in v10.1, this is the primary structural risk.

**Cheapest Fix:**
If `SEQ-RETRIEVE` fails but `SEQ-ORACLE-LEARNABLE` passes, the issue is not representation but the "retrieve-into-scratch" bridge. The fix is to implement a **scheduled-sampling warm-start** for `vhat` (gradually transitioning from teacher-forced $v$ to $\text{argmax } Hv$) to stabilize the early-training noise that currently causes the "dummy-kills-slot" collapse.

## Raw R2 (implementation auditor)
**Verdict:** IMPLEMENTABLE

**Gaps:**
1. **Symmetry Risk:** `own-vhat` starts with noise; early gradients in `pass2` may destabilize `pass1` (DC chaining).
2. **Capacity:** $H=48$ is lean for a $10 \times D$ input; potential bottleneck at $H_v$ head.
3. **Evaluation:** $N=400$ total paired evals for SEQ is specified, but split as $200$ shift + $200$ fwd; ensure per-seed variance is tracked to avoid quorum noise.

**Cheapest Code Test:**
Verify the `dc chaining` and `own-vhat` loop without training:
```javascript
// Test: pass2 -> pass1 gradient flow & vhat logic
const vhat = argmax(model.Hv(h1));
const loss2 = CE(model.final(x2(vhat)), y);
loss2.backward();
console.log(model.W1.grad !== null ? "Chain Valid" : "Broken");
```
*Confirmed: No GPU, CPU-only, frozen v10.1 weights for CAL repair.*

## Raw R3 (rival-mechanism auditor)
**Verdict:** CONTAINED

**Rival Explanation:** The "copying-shortcut" occurs when the model bypasses internal retrieval/composition by simply copying a teacher-provided ground-truth value ($v$) into the final pass. This creates a high "oracle" score but causes the internal retrieval mechanism (the "scratch" space) to atrophy, as the model never learns to generate $v$ autonomously.

**Killer Test:** Compare `seq-teacher` scratch-accuracy against `seq-own` scratch-accuracy. If `seq-teacher` $\le$ `seq-own` (while maintaining high oracle performance), the shortcut is contained because the model is forced to build its own retrieval path.

**Spec contains it:** Yes. See **Bars** $\rightarrow$ `SEQ-NO-COPY`: `seq-teacher scratch <= seq-own scratch quorum 2/3`.

## Adjudication (agent owns verdict, 2026-11-24)

- R1 PASS, fix REJECTED as mechanism-mismatched. Scheduled-sampling warm-start (teacher→own) is exactly the copying shortcut scratchx documents (T2 scratch ≤ T 2/3, retrieve atrophy). v10.2 MUST use own-vhat from step 0; early noise is the selection pressure, not a bug to warm-start away. If SEQ-RETRIEVE fails + ORACLE holds, verdict is RETRIEVE-WALLED (wall stands), not a cue to add teacher forcing. No threshold moves (N=400 paired, quorum 2/3, bars as filed).
- R2 IMPLEMENTABLE, no patch (clarification only). Symmetry risk filed as expected-early-noise (contained by 800st recipe + Div nudge + carry chaining; dc check runs as driver smoke). Capacity H=48 sufficient per bottleneck K-dose precedent (K8→K1 monotone at H=48; +23% W1 growth filed). Eval split clarified: 200 shift (retrieve/compose/oracle) + 200 fwd (floor), per-seed + range on every ledger, paired streams — quorum decides, no N change.
- R3 CONTAINED, no patch. SEQ-NO-COPY already the killer test (teacher scratch ≤ own). Copying-shortcut rival contained by design (own vs teacher vs dummy triple).

Amendment v10.2.1: pins-only clarifications (scheduled-sampling explicitly rejected; eval split 200+200 restated; dc smoke filed). Zero train/eval changes. Battery score: 1 PASS + 1 IMPLEMENTABLE + 1 CONTAINED, 0 real gaps, 0 threshold moves.
