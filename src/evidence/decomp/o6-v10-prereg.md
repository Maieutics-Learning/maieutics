# O6 v10 — depth sweep on filed single-pass models (FROZEN for review battery)

Agent approval: this file. User countersign: 2026-11-23 ("run all three... then 3" — move 3, the architectural bet). Scope: O6 = 12 units (3 seeds × 4 r-values, ZERO training; restore filed d-sp1). Quorum 2/3; CPU-only; NO PUSH.

## Why (SP1 verdict: SLOT-WRITTEN-BUT-UNREAD)
The single-pass model writes v into pos8 (decode 0.84–0.88) but its readout can't consume it in the same pass (composed 0.44–0.59). The trainer already runs random depth r∈1..4 per pass ("paper style", train.js l.105) and the lab's depth-curve precedent (parity: monotone hard-curve gains) says extra ticks buy sequential compute. O6 asks whether depth substitutes for the missing second pass: evaluate filed SP1 snapshots at r = 1, 2, 4, 8.

## Design (zero training)
Per seed: restore filed d-sp1 params; 200 e.x test lines (srng 52500+seed — identical to SP1 eval lines); at each r ∈ {1,2,4,8}: (1) COMPOSED acc = argmax readout after model.forward(x, r); (2) SLOT decode = best-pos argmax-decode of v over positions 0..9 (same probe as SP1). Ledger d-o6-s{seed}.json holds per-r pairs. Driver: runO6Sweep. Note: r ≤ 4 is in-training distribution; r = 8 is extrapolation (labeled as such).

## Bars (quorum 2/3; verdict d-o6-verdict.json; baseline SP1 r1 composed 0.585/0.48/0.435)
- O6-LIFTS (primary): composed@r8 − composed@r1 ≥ +0.10 (2/3) → LIFTS (depth substitutes, architectural answer) else FLAT (depth doesn't compose here — file vs parity precedent).
- MONOTONE + SLOT (descriptive): per-r curves + decode@r trajectory (decode rising with r = slot sharpening; decode flat + composed rising = readout learning to consume).

## Expectation (filed open)
LIFTS 1/3 or FLAT (honest: settle-history says untrained dynamics don't retrieve; but the slot is ALREADY written here, so depth only needs the readout step — lean weak-LIFT, s0 most).

## Nearest-failure
- Parity depth curves (differ: procedure grading; O6 is consume-the-slot — same machinery, new job).
- Settle-100 desert (differ: settling from scratch; O6 starts from a written slot — the missing half only).

## Amendment v10.1 (pre-compute pins; blind battery 2026-11-23 — 3x CONDITIONAL)
- C1 adopted: PARTIAL level (r4 lifts, r8 collapses).
- C2 rejected with symmetry (mean-r 2.5; retraining changes the question).
- C3 rejected with pointer (bar is on composed, headroom ample).

## Cost
0 trains + 24 forward evals (cheap), COMPLETE-gated. NO PUSH.
