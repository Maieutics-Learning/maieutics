# Semi-supervised pin v1.1 (user-countersigned 2026-11-22; agent approval: this file)

## What do I want to find out
v10 verdict: OVERWHELMED — a 16-point pin is memorized as exceptions while the
general procedure collapses to echo (pin-tutor B0 0.41 vs anchor-only 0.9).
The pin failed because it constrains 16 POINTS; gradient routes around points.
Does a DISTRIBUTION-WIDE constraint — distill the frozen tutor's full forward
distribution on fresh lines every step, so there is nowhere to route around —
block the echo fixed point while cycles teach reverse?

## Research check
In-repo only (assoc stack, v11 soft-cycle machinery + frozen teacher). Proceeding.

## Design
TUTOR start: filed 1-hop tutors d-novel-tutor-s{s}.json (s in {0,1,2}).
FROZEN TEACHER: second restore of the same tutor, never stepped.
ARMS (300 steps, Adam 5e-3):
- point16: v10 protocol with pin weight 16 (L = L_cycle_mean8 + 16*L_sup_mean16
  on the same fixed 16 anchors, rng 15000+s). Tests: was v10 just underweighted?
- distill1: L = L_cycle_mean8 + 1*KL_mean8, where KL = mean over 8 FRESH forward
  lines/step (A.gen 1..3 pairs) of KL(teacher||student) on final logits
  (dL/dz_student = p_student − p_teacher, /8; teacher forward only, no backward,
  no aux — the constraint targets answer behavior; filed choice).
- distill4: same with weight 4.
No distill-only control (filed omission with reason: forward-only inputs carry
zero reverse signal by construction, so any B3 lift under distill+cycles must
come from cycles; v10's anchor-only already validated the battery).
EVAL: identical v11 battery via runCycleEval (B0 fresh-line tripwire catches
memorize-the-constraint; B4/B5 descriptive).
BARS (per arm, preregistered):
- P1 (constraint holds): arm B0 >= 0.90, 3/3.
- P2 (cycles teach under constraint): arm B3 > 0.35 quorum 2/3.
VERDICT per arm: BLOCKS (both) / HOLDS-BUT-TEACHES-NOTHING / OVERWHELMED.
Comparison read: point16 vs distill1 at matched... (not matched weight —
matched FORWARD COUNT per step: 16 anchors vs 8 fresh lines; the variable is
coverage (points vs distribution), weight is swept separately by distill1/4).

## Expectation (scored at verdict)
point16: P1 PASS (16x should hold what 1x nearly held alone) but P2 FAIL
(holding by memorization harder — weight doesn't fix coverage; predicts
HOLDS-BUT-TEACHES-NOTHING). distill1: P1 borderline (fresh coverage, weak
weight). distill4: BLOCKS (coverage + weight; honest 55%).

## Pre-mortem
Strongest objection: distillation also collapses (student matches teacher on
forward lines while BOTH shift together — no, teacher is FROZEN, cannot shift;
the failure mode is instead student ignores cycles and sits on teacher: P1
pass + P2 fail = cycles contribute nothing, filed as such).
Most likely failure: all three OVERWHELMED (echo beats even distribution
pressure — quantifies the degenerate attractor's strength; structural freeze
would be next, but same-parameters-for-both-directions makes freezing
non-trivial: filed open problem, not attempted here).

## Nearest-failure
pin-v10 (differs: 16 fixed points, weight 1, memorized-as-exceptions; here
coverage is distributional and weight is swept).

## Cost
9 trains x 300 steps x ~96 forwards (h48) ~ 45-65 min + evals, resume-safe,
split across runs.

## Ledgers
src/evidence/decomp/d-pin11-{point16,distill1,distill4}-s{s}.json,
d-pin11-verdict.json. Driver: novel-driver.js (runPin11Train).
