# Verifier v1.0 — does the distill4 verifier stack? (user-countersigned 2026-11-22; agent approval: this file)

## What do I want to find out
v11 verdict: distill4 (distribution-wide frozen-teacher distillation + answer-free
cycles) BLOCKS 3/3 — B0 1.00, B3 0.46-0.52 ≈ supervised supmix ceiling, the first
no-labels PASS. The reading: consistency pinned by a frozen prior over the known
direction is the label-free verifier in miniature. Open question: does it STACK
across rounds, or does one round extract everything (F5 taught us continued
selection without fresh signal reverts — but F5 had no constraint; here the
distillation constraint persists, so round 2 may hold or climb)?

## Research check
In-repo only (assoc stack, v11 distill4 machinery + frozen teacher + filed
cycle battery). No external facts needed. Proceeding.

## Design
Filed endpoints were never persisted (all cycle/pin ledgers are eval-only
JSONs, ~250B, no params) — so round 2 cannot continue a filed checkpoint.
Instead each seed runs the IDENTICAL distill4 protocol for 600 steps with an
eval at step 300 (R1 checkpoint) and step 600 (R2), same rng streams as v11
(rng 15000+s, drng 15100+s) so R1 must reproduce v11.
ARM distill4x2 (seeds 0,1,2): L = L_cycle_mean8 + 4*KL_mean8, B=8 fresh
forward lines/step, Adam 5e-3, frozen teacher restored from
d-novel-tutor-s{s}.json. Eval = runCycleEval with modelOpt (no file read).
ROUND BOUNDARY (adopted from fresh-eyes REJECT): at step 300 the run
re-anchors — eval R1 checkpoint, then fresh Adam(5e-3) state + rng/drng
reseeded (16000+s / 16100+s) for steps 300-600. Round 2 is thus the same
recipe re-applied to carried weights with fresh stochasticity (Exp-E
generation semantics), NOT the same gradient flow continued: a climb across
the boundary reads as further extraction, a flat as one-round saturation.
Residual caveat filed: more-steps vs round-effect cannot be fully separated;
the re-anchor is the standard chaining notion of a round.
EVAL readouts: B0 (constraint tripwire), B3 (reverse), B4 (longer reverse =
filed harder readout), echo rate, lastCyc/lastCon losses at both checkpoints.
BARS (per seed unless noted):
- P1 (replication gate): R1 B0 >= 0.90 AND |R1 B3 − filed v11 B3_s| <= 0.10.
  Guards harness drift; a miss voids that seed's P3/P4 (not the program).
- P2 (constraint holds round 2): R2 B0 >= 0.90, 3/3.
- P3 (stacking): R2 B3 >= R1 B3, quorum 2/3 (directional hold-or-climb;
  absolute bar refused — F5 showed round structure dominates levels).
- P4 (harder holds): R2 B4 >= R1 B4, quorum 2/3 (descriptive).
VERDICT: STACKS (P2 + P3, B3 climbs ≥2/3) / HOLDS (P2, R2≈R1 — one round
extracts; still informative) / DECAYS (P2 miss or B3 drops — cycles re-corrupt
under saturated constraint).

## Expectation (scored at verdict)
HOLDS: distill4 B3 0.46-0.52 sits at the supmix ceiling (0.53-0.68) with no
headroom, so climb is unlikely; continued distillation should at least hold
B0 = 1.00 and B3 (R2 ≈ R1 ± 0.05). P1 3/3 (deterministic replay).

## Pre-mortem
Strongest objection: continued cycles corrupt forward even under distillation
(B0 < 0.90 round 2 → DECAYS; mechanism = constraint saturates, cycles find a
new corrupt satisfier — quantifies verifier half-life).
Most likely failure: flat R2 == R1 (student sits on teacher; cycles contribute
nothing further → HOLDS, bounds single-round claims for the verifier program).

## Nearest-failure
pin-v11 distill4 (differs: 300 steps, single round; here 600 with midpoint
checkpoint = replication + stacking in one run).

## Cost
3 seeds × 600 steps × ~96 forwards (h48) ≈ 2× distill4 ≈ 30-45 min total,
one seed per execute_js call (each ~10-15 min, inside the 60-min cap),
resume-safe via COMPLETE-gated ledgers.

## Ledgers
src/evidence/decomp/d-ver1-distill4x2-s{s}.json (r1 + r2 evals in one body),
d-ver1-verdict.json. Driver: novel-driver.js += runVerifierV1.
