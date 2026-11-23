# O4b v10 — retriever error-mining repair, all seeds (FROZEN for review battery)

Agent approval: this file. User countersign: 2026-11-23 pre-countersign. Scope: O4b = 3 units (R=3 full retrains, cb-diet reconstruction). Quorum 2/3; CPU-only; NO PUSH.

## Why (O3 verdict)
Wall is now the retriever on s2 (0.775 vs 0.925/0.935). O2a proved error-mining substitution teaches boundaries on the add side. O4b mirrors it on the retrieve side. O4c (combined ceiling = repaired retriever × mined add) is verdict-time analysis of O4b's evals — no extra runs.

## Design
- Stage-1 = filed d-batch2-cb params (cb recipe exactly: 800 steps, 150 lines coin crng 53500+seed true/dummy + 150 fwd, auxW 4.0, T labels, trainSeed 53200+13s — reuse, zero new stage-1 trains).
- Harvest: 300 fresh e.x (dummy-format) lines (hrng 54400+seed); restore cb; vhat = scratchArgmax(posOut[8]); collect mis-retrieved (vhat≠v), up to 100 (pad randoms).
- Stage-2: fresh model (trainSeed 55000+seed), 800 steps, filed cb diet rebuilt (same rngs) with 100 random lines REPLACED by harvested (dose fixed at 300).
- Eval per seed: (1) RETRIEVE acc on 200 e.x lines srng 52500+seed (identical lines to harness pass-1); (2) COMPOSED: pass-1 vhat → filed O2a add → answer (identical lines); (3) fwd watch (frng 52400+seed A.gen). Driver: runO4RetMine (ledger d-o4b-s{seed}.json).

## Bars (seed-matched; verdict d-o4b-verdict.json; baselines: cb retrieve = O3 ret 0.925/0.935/0.775; O3 composed 0.91/0.91/0.765; cb fwd from filed d-batch2-eval-cb)
- O4b-REPAIR (primary): retrieve − cbRetrieve ≥ +0.03 (2/3) → REPAIRS else HOLDS.
- O4c-CEILING (secondary, verdict-time): composed − O3composed ≥ +0.03 (2/3) → CEILING-2 else HOLDS-AT-0.86.
- DISTORTION watch: fwd < cbFwd − 0.10 flagged.

## Expectation (filed open)
REPAIRS 2/3 (s2 lifts most — most headroom; s0/s1 near their ceiling already). CEILING-2 marginal (composed tracks product; s2's retrieve gain × 0.99 oracle).

## Nearest-failure
- O2a ERRMINE (differs: add-side oracle errors; O4b mines RETRIEVE errors on dummy lines — different skill, same substitution machinery).
- K3R skew-poison (differs: skew floods one regime; mining substitutes hard cases across regimes — O2a precedent says substitution≠skew).

## Amendment v10.1 (pre-compute pins; blind battery 2026-11-23 — 3x CONDITIONAL)
- B1 noted: nHarvest logged per seed; s2-vs-s0/s1 contrast answers dilution.
- B2 adopted: product-check = |composed − retrieve×oracle| ≤ 0.05.
- B3 adopted (cheap): +1 reseed-control train s2-only (unmodified cb diet, trainSeed 55200) → control≈0.775 means diet-hard, ≈0.93 means bad luck.

## Cost
3 stage-2 trains + 1 reseed control + 12 evals, COMPLETE-gated. NO PUSH.
