# R1 v10 — unity, pressure-vs-dilution, clean-retrieve preservation (FROZEN for review battery)

Agent approval: this file. User countersign: 2026-11-23 (batch3 + 5x5 rounds, R=3, adaptive waves). Scope: R1 = 5 units (C6 block + LM4x3 trains + FQ block). R2–R5 pool (adapted after R1 verdict): AUX8-lenmix, round-2 harness, k3 repair, add-side intervention, delimiter-robust training, paper core.

## Why (batch-3 questions)
Unity untested (C6 deferred); dilution-vs-pressure confounded (LM failed at 1x — does 4x rescue?); pressure may corrupt the clean-retrieve pathway (AUX models never tested on flats-format queries — FWD3 owns 0.97, does AUX4 keep it?).

## Design (attn h48/m96, 800 steps, batch 16, lr 5e-3; frozen tests 52400/52500+seed; trainSeed 53200+seed*13, rngs 52200/52300/52600+seed)
- E1 C6-UNITY (zero training): pass-1 = filed COMBO (d-batch2-cb) posOut[8] vhat on dummy lines; pass-2 = SAME cb model on flat+[qk,k,vhat,8] → answer. cb saw both formats in train (50/50). Bar tests single-model unity.
- E2-4 LM4-RESCUE (trains, lenmix diet 50x2p+50x3p+50x4p sequential via drng + 150 fwd, T labels, auxW 4.0): lenmix diet at COMBO pressure. NOTE: LC-clean as pre-queued (150x3p+150fwd @4x) was AUX4-identical — redefined to LM4 (the non-vacuous isolation). Predict partial rescue.
- E5 FQ-PRESERVE (zero training): filed AUX4 (d-batch1-a4) evaluated on flats-format queries (flat+[qk,8] → v, 200 lines srng-matched to FWD3 eval shape) → does pressure preserve clean retrieve?

## Evals
- C6: composed + retrieve + oracle(same cb, true v) + product + |C6 − cb.two| + byK.
- LM4: standard battery + len (2p/4p) + rescue deltas vs LM1 (filed d-batch2-lm) + spread.
- FQ: flats accuracy (200, seed-matched rng stream 52500+seed equivalent: flat queries built from composeGenShiftScr(srng) same as FWD3 eval).

## Bars (quorum 2/3; verdict d-r1-verdict.json; refs cb.two 0.495/0.63/0.37, LM1 two 0.265/0.355/0.25 spread 0.06/0.065/0.03, f3 flats 0.97/0.955/0.98)
- C6-UNITY: |c6 − cb.two| ≤ 0.10 (2/3); report abs composed (secondary: unity ≥ split?).
- LM4-RESCUE (primary): lm4 two-3p − lm1 two-3p ≥ +0.05 (2/3); SECONDARY spread ≤ 0.20 (2/3).
- FQ-PRESERVE: a4 flats ≥ 0.80 (2/3) → PRESERVES else CORRUPTS (pressure cost on clean pathway).

## Amendment v10.1 (pre-compute; blind battery 2026-11-23 — R1 vacuity ACCEPTED with rescue)
- C6 bar REPLACED: |C6−cb.two| ≤ 0.10 was circular (same weights + same inputs). v10.1: sanity |C6−cb.two| ≤ 0.01 (2/3, expect 0.000 — validates harness determinism) + INTEGRATION PROFILE (descriptive, the real unity question): P(pass-2 correct | vhat correct) vs P(pass-2 correct | vhat wrong) on single cb. Unity-positive = re-derivation; strict-pipeline = collapse on wrong vhat.
- LM4: primary stays (lift) + ADOPTED secondary closure fraction (LM4−LM1)/(AUX4−LM1) per seed (full rescue ≈ 1).
- FQ: reframed operational SERVES (≥0.80) vs DROPS (mechanistic pathway question → R2 pool).
- Build pins: C6 pass-2 = byte-identical to runBatch2Eval x2 construction; LM4 = 50x2p→50x3p→50x4p sampling via drng, +150 fwd via frng, concat, shuffle via sh (sampling order only); FQ flats = {x: e.flat.concat([e.qk,8]), y: e.v}, srng 52500+seed (same lines as FWD3 eval); len scrIdx = x.length−2.
- Recorded blind predictions: C6 |Δ|≈0.04 (v10.1 expectation: 0.000), LM4 Δ≈+0.10, FQ≈0.90.

## Expectation (filed open)
C6 HOLD (|Δ| ≤ 0.06, abs ≈ cb.two); LM4 partial rescue (+0.08-0.12, spread holds); FQ ~0.9 PRESERVES.

## Nearest-failure
- cb.two itself (differs: C6 pass-2 input = cb.two input exactly — should match unless vhat distribution shifts).
- LM1 flat-at-floor (differs: LM4 = LM1 diet @4x — pure pressure isolation).
- FWD3 flats 0.97 (differs: AUX4 pressured — preservation not guaranteed; AUX8 one-pass gains hint the answer pathway changed).

## Cost
3 trains + 6 LM4 evals + 2 harness blocks (C6, FQ), COMPLETE-gated. Driver: runLM4Train + runR1Eval/runR1Len (d-r1-*) + runHarnessC6 + runFQ. NO PUSH.
