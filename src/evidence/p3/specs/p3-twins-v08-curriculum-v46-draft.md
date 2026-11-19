# Twins v0.8 CURRICULUM v4.6 DRAFT (2026-11-19) — UNCOUNTERSIGNED, no compute

Inherits v4.4 bundles + v4.5.1 lessons. Re-scopes the ear (user-ordered 2026-11-19):
ear is an INSTRUMENT (feedback), not a second transmission. The 0.80 agreement bar is RETIRED
(filed descriptively only, never PASS/FAIL). v4.5 closed ear-as-transmission (FAIL: real 0.41–0.50,
gap 0/3, comparative 0/3); v4.6 asks whether the ear helps the mouth.

## Base (frozen, reused — no new tutor training)
- Bundles: filed v44 quartile bundles (mouth CLAIM1/CLAIM2 3/3, ear weak-not-zero, gap 2/3, fair ruler).
  No new tutor compute, no new cuts. Student inits RNG 9850–52, seeds 9903/9914, combined 200+replay,
  pools 9770/9771/9810, blind 9860–62 — all unchanged for comparability.
- Ear agreement (tutor-vs-student modal on shared-200) filed descriptive per pair, no bar.

## Test 1 — Ablation: do ear marks move mouth learning?
- Same student init, same lines (v44 c1/c2), two conditions:
  WITH (standard: mouth hardCE+0.5KL + ear KL, lambdaEar 0.2, trunk x0.5) vs WITHOUT
  (mouth only: ear head detached, trunk mouth-only, ear loss weight 0 — same steps/seeds).
- Control: shuffled-WITH (real lines + position-shuffled ear softs, same recipe as WITH).
- Bar (pre-registered): WITH S2-hard beats WITHOUT by >=0.10 on >=2/3 pairs (95% Wilson on the
  difference reported, Fisher exact on survive counts where applicable). Shuffled-WITH must sit
  at WITHOUT level (±0.05) or the gain is extra-params, not information (confound rule).

## Test 2 — Steering: does ear-guided reselection beat random?
- After S1 (WITH), rank 200 fresh candidate lines (gen seed 9931+pair, tutor-written) by mean
  tutor-ear entropy (quartile bands from filed cuts); pick top-100 (GUIDED) vs 100 random
  (RANDOM, seed 9932+pair). Train S2 200 steps on each (same student continued, same replay shape).
- Bar: GUIDED S2-hard beats RANDOM by >=0.10 on >=2/3 pairs. If GUIDED picks merely-harder lines
  (distribution shift), it loses — that IS the result (steering hurts or ties).

## Test 3 — Calibration: does student ear predict student error?
- Eval-only on shared-200 + easyTest/hardTest. Per position: student mouth correct?
  (argmax vs true next token) vs student ear bucket (low/high split at median cut q50).
- Bar: accuracy(low-uncertainty) − accuracy(high-uncertainty) >=0.15 on >=2/3 pairs (calibration
  gain, challenger-style — never an agreement bar). Descriptive: full 4-band curve + Wilson.

## Quorum / W / nulls
- Quorum >=2/3 pairs per test. W: WITH==WITHOUT AND GUIDED==RANDOM AND calibration <0.05
  on >=2/3 → ear line retires (decorative at this scale), mouth stands alone.
- Nulls inherit v44 (blind FAIL/FAIL, synthetic CLEAN must still hold on the WITH arm).

## What do we want to find out
Does the ear help, steer, or calibrate mouth learning? PASS on any test = ear is auxiliary-useful
(kept as instrument with that named job). FAIL on all three = ear retires, mouth-only curriculum stands.

## Agent expectation (numeric, scored in verdict)
T1: WITH ≈ WITHOUT (±0.05, 0/3 reach +0.10) — decorative. T2: GUIDED ≈ RANDOM (±0.05, 0/3)
— selection theater at this scale. T3: gap +0.05–0.10, below 0.15 bar (0/3). Overall FAIL/FAIL/FAIL
→ ear retires. (A PASS on any test is a welcome miss.)

## Pre-mortem (strongest objection + most likely failure, scored post-hoc)
Objection: T1 confounds information with optimization (WITH shapes trunk differently regardless of
content). Killer: shuffled-WITH beats WITHOUT — then any WITH gain is extra-gradient, verdict FAIL
even if T1 bar met (confound rule above). Most likely failure: T2 GUIDED loses (picks hard-only,
distribution shift) and T3 ear miscalibrated (flat 0.45 agreement was positional, per v4.5) —
triple FAIL by mechanism, not by noise.

## Nearest-failure citation
v4.5 positional (shuffled rose with real, gap 0/3): not repeated — T1 has shuffled-WITH control,
T2 has RANDOM control, T3 grades correctness not agreement. x-ablation single-draw trip: not
repeated — quorum 2/3 + per-pair Wilson, no line-level bootstrap. v4.3 degeneracy: not repeated —
v44 quartile base + filed marginals, absolute/relative confusion retired with the 0.80 bar.

## Provenance / seeds
Bundle-only (v44 files); pools/thermometers never in student training. RNG: students 9850–52,
S1 9903+pair, replay 9914+pair, candidates 9931/9932+pair, shared-200 9771. nUniq==100 else ABORT.
All losses finite else ABORT.

## Approval
UNCOUNTERSIGNED — no compute. Countersign approves: v44-base reuse + T1/T2/T3 procedures +
+0.10/+0.10/+0.15 bars + confound rule + quorum/W. Any content change = v4.7.
