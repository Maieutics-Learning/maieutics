# Fresh-eyes battery — O6 v10 spec (3 sealed reviewers, verbatim)

## C1 (r=4 anchor — ADOPTED as PARTIAL level)
VERDICT: CONDITIONAL. Fix: Require a baseline test at r=4 before assessing r=8.
(a) Bar soundness: Unsound; without an r=4 control, a failure at r=8 provides no evidence to distinguish between a general depth collapse and a specific extrapolation failure.
(b) Confound: The model may have a hard-coded capacity limit at r=4 regardless of training, making the r=8 failure a hardware/architecture constraint rather than a learned generalization issue.

## C2 (head/r mismatch)
VERDICT: CONDITIONAL (Normalize head weights by 1/r across training samples to decouple mean-r bias from the composition signal).
(a) Bar soundness: Sound; the readout is a linear probe, but the input distribution is shifted.
(b) Confound: The head may learn a scalar offset for each r rather than the relative difference between r1 and r8.

## C3 (bar misread)
VERDICT: CONDITIONAL. Fix: Redefine threshold as a relative delta (Δ) from the r1 baseline rather than a static +0.10 offset.
(a) Soundness: Bar is unsound; saturation at r1 collapses the differential, rendering the "half-bar" logic mathematically void.
(b) Confound: Signal-to-noise ratio degradation due to ceiling effects at the 0.88 saturation point.

## Adjudication (agent, filed as v10.1)
- ADOPT (C1): verdict levels LIFTS / PARTIAL (r4 lifts, r8 collapses — in-distribution depth works, extrapolation fails) / FLAT. Per-r curves already in ledger.
- REJECT with symmetry (C2): head trained r-mixed (mean r=2.5) — r=1 is as "mismatched" as r=4; the fix (retrain with normalized heads) changes the question from "does the as-trained head compose at depth" to something else. Filed openly.
- REJECT with pointer (C3): primary bar is on composed (baselines 0.44–0.59, headroom ample); decode was never in the bar. The "saturation" targets the wrong half.
