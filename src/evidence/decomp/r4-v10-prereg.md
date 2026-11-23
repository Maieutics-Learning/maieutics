# R4 v10 — last dilution probe, best-meets-best harness, add dose profile (FROZEN for review battery)

Agent approval: this file. User countersign: 2026-11-23 (batch3 + 5x5, R=3, adaptive). Scope: R4 = 5 units (AL8x3 trains + T7 block + ADD4P block). CPU-only; NO PUSH.

## Why (R3 questions)
Dilution unprobed above 4x (LM4 failed at 4x — does 8x rescue?); ADD4 is the best add (0.925/0.91/0.825) but untested in harness (T7 = cb × ADD4 could take the ceiling); dose lifted add — but which bins (ADD4P)?

## Design (attn h48/m96, 800 steps, batch 16, lr 5e-3; frozen tests 52400/52500+seed; trainSeed 53200+seed*13, rngs 52200/52300/52600+seed)
- E1-3 AL8 (trains, lenmix diet 50x2p+50x3p+50x4p sequential via drng + 150 fwd via frng, concat, shuffle via sh, T labels, auxW 8.0): dilution@8x. Last dilution probe (if FAIL, dilution closes as pressure-inert).
- E4 T7-HARNESS (zero training): pass-1 = filed cb (d-batch2-cb) posOut[8] vhat on dummy; pass-2 = filed ADD4 (d-r2-add4) on flat+[qk,k,vhat,8]. Best retriever × best add. Predict ~0.8/0.8/0.6 (products 0.856/0.851/0.639).
- E5 ADD4P-PROFILE (zero training, filed ADD4 d-r2-add4): K3P construction (n=200, true-v flat lines, srng 52500+seed): per-k acc + confusion + off-by-one share; vs K3P-t2 baselines per bin (which bin did dose fix?).

## Evals
- AL8: standard battery + len + rescue-delta vs LM1 (two-3p) + closure vs AUX8 (same 8x, clean diet: (AL8−LM1)/(AUX8−LM1)).
- T7: composed + retrieve + oracle + product + byK + T7−T6 (T6 refs 0.70/0.825/0.585).
- ADD4P: per-k + confusion + obo (as K3P).

## Bars (quorum 2/3; verdict d-r4-verdict.json; refs LM1 two 0.265/0.355/0.25 spread 0.06/0.065/0.03; AUX8 two 0.395/0.345/0.345 scratch 0.935/0.975/0.98)
- AL8-RESCUE (primary): al8.two3p − lm1.two3p ≥ +0.05 (2/3); SECONDARY spread ≤ 0.20 + closure fraction.
- T7-HARNESS (primary): composed ≥ 0.60 (2/3 floor); SECONDARY T7−T6 (best-meets-best?).
- ADD4P-DOSE-FIXES-WEAKEST (primary): lift on the T2-worst bin per seed (k3 s0/s2, k1 s1) ≥ +0.10 (2/3) → FIXES-WEAKEST else DIFFUSE. SECONDARY descriptive per-k + confusion + obo.

## Amendment v10.1 (pre-compute; blind battery 2026-11-23 — R1 ENFORCEABLE / R2 CONDITIONAL→pinned / R3 CONDITIONAL→concrete-bar)
- AL8 build = LM4-identical (same sampling order/concat/shuffle; ONLY auxW 4→8); T7 = T6 with m2 swapped (pass-1 identical; byK = T6 construction); ADD4P = K3P construction exactly (n=200 total, same bins).
- Closure denominator ≤ 0 → fraction N/A, raw deltas reported. Bin-shift noise floor 0.15 (R1c): smaller shifts = noise.
- Recorded predictions: AL8 Δ≈+0.02 FAIL; T7 ~0.73 (0.78/0.80/0.62); ADD4P k3 floor +~15%.

## Expectation (filed open)
AL8 FAIL (dilution pressure-inert: +0.0-0.03, 0-1/3); T7 HIT (~0.78/0.80/0.62, new ceiling mean ~0.73); ADD4P k3 still worst but lifted (dose helps weakest most).

## Nearest-failure
- LM4 rescue FAIL 1/3 @4x (differs: AL8 = same diet @8x — dose escalation on dilution).
- T6 0.70/0.825/0.585 (differs: T7 swaps T2→ADD4 (+0.175/+0.05/+0.085 oracle); retrieve identical).
- K3P-t2 perK (differs: ADD4P profiles the DOSE-LIFTED add — which bin moved?).

## Cost
3 trains + 6 AL8 evals + 2 blocks (T7, ADD4P), COMPLETE-gated. Driver: runAL8Train + runR4Eval/runR4Len (d-r4-*) + runHarnessT7 + runADD4P. R5 (5 units) specced after verdict (pool: K3AUX spot-pressure, round-2 add harness, paper core). NO PUSH.
