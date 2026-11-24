# Fresh-eyes rec-v10 battery (3 sealed, 2026-11-24)

Raw: `scratch/fresh-eyes-rec-v10-3x.txt`. Spec: `src/evidence/decomp/rec-v10-prereg.md`.

## Raw R1 (math)
**Verdict: PASS**

**Hardest Hole:**
The "representational gap" caused by the omitted gradient in the carry path. Because the trunk previously received no credit for writing useful carry data, the system hit a performance ceiling (Retrieve 0.605 / Compose 0.495). The risk was that the "wall" was architectural (requiring attention/multi-head) rather than just a credit assignment failure.

**Cheapest Fix:**
Restore the omitted gradient line: `dh += Wfᵀ·dsf + Wcᵀ·dsc`.

By implementing full BPTT and expanding time capacity (CD8 $\rightarrow$ CD16), the design isolates whether the bottleneck was purely the lack of credit assignment or a physical memory limit. Using `rec-ctl` (zero-train re-evals of Step 1 ledgers) ensures a high-integrity, low-cost baseline for the $+0.10$ BPTT-delta requirement.

## Raw R2 (implementation)
**Verdict:** IMPLEMENTABLE

**Gaps:**
1. **Numerical Stability:** Transitioning from truncated to full BPTT introduces risk of gradient explosion in the carry path. While clipping and Adam are noted, the specific clip threshold is undefined.
2. **Memory Overhead:** CD16 and 3-pass evolvers increase memory footprints; however, given the "small" scale (H48/H96), this remains within CPU-in-worker limits.
3. **Baseline Rigor:** The "rec-ctl" must ensure strictly identical seed/stream mapping to avoid noise-driven deltas.

**Cheapest Test:**
Run `rec-full` (CD8, BPTT enabled) against `rec-ctl` (truncated) using a single seed/stream pair. If `REC-BPTT-DELTA` $\ge 0.10$ on a 100-step mini-batch, the credit assignment gap is confirmed. This validates the core hypothesis before scaling to CD16 or 3-pass evolvers.

## Raw R3 (rival)
"Wait, why is the gradient actually flowing?"

The auditor stared at the `rec-full` logs. For months, the "Wall" was treated as a representational deficit—a lack of width. But the Step 1 `fr-force` ledgers proved the width was irrelevant; the trunk was simply blind to the carry path. By restoring the omitted BPTT line, the agent didn't just learn; it stabilized.

The rival auditor notes the brilliance of `rec-ctl`: by reusing Step 1 ledgers as a zero-compute baseline, any gain in `rec-full` is mathematically isolated to credit assignment, not random seed variance. The transition to CD16 tests if the bottleneck was memory volume or logic.

**Verdict: UNVERIFIED**
**Rival:** Internal Audit (BPTT-specialist)
**Killer:** Full-BPTT instability mimic (gradient explosion risk).
**Contains:** CD16-capacity vs time; truncated-control reuse honesty (fr-force as baseline).

## Adjudication (agent owns verdict, 2026-11-24)

- R1 PASS, no patch (fix IS the spec — restore dh line + CD16 isolate).
- R2 IMPLEMENTABLE, patch ADOPTED: global grad-norm clip 1.0 (filed; Adam + clip contains explosion) + rec-ctl strict seed/stream mapping (same 41000/42000/91000+seed, same 52500/52400 eval — enforced in driver) + 100-step single-seed smoke before full (cheap, runs as driver smoke, filed in log).
- R3 UNVERIFIED-as-rival, CONTAINED as design: instability mimic would HURT (loss spike, divCos collapse) not help — gain + stable loss + paired delta isolates memory; CD16 comparison separates volume vs logic (if CD16 flat while full helps, it was credit, not volume).

Amendment v10.1: clip 1.0 pinned + smoke 100-step filed. Zero train/eval changes. Score: 1 PASS + 1 IMPLEMENTABLE (patched) + 1 UNVERIFIED-contained.
