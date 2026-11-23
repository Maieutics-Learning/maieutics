# O5a v10 — proportion-preserving mining (FROZEN for review battery)

Agent approval: this file. User countersign: 2026-11-23 ("run all three", moves 1+2 first). Scope: O5a = 3 units (R=3 retrains). Quorum 2/3; CPU-only; NO PUSH.

## Why (O4b verdict)
Error-mining repaired s2 (+0.165) but collapsed s0/s1 (−0.34/−0.26): substitution skewed the true/dummy/fwd balance healthy models need (third poison datum). O5a tests the mechanism: preserve diet proportions — harvested dummy-errors replace dummy lines only, harvested true-errors replace true lines only, fwd untouched.

## Design
- Stage-1 = filed d-batch2-cb params (zero new stage-1 trains).
- Harvest on 300 fresh lines EACH format (hrng 54400+seed dummy e.x; trng 55400+seed true flat+[qk,k,v,8]): retrieval errors (vhat≠v via posOut[8]) per format; cap 60 dummy + 40 true (mirrors ~50/50+ diet balance; pad with same-format randoms if short).
- Stage-2: fresh model (trainSeed 55500+seed), 800 steps, rebuilt cb diet with dummy lines replaced by dummy-harvest and true lines by true-harvest (fwd identical), auxW 4.0, T labels.
- Eval per seed: (1) RETRIEVE on 200 e.x lines (srng 52500+seed); (2) COMPOSED via filed O2a add; (3) fwd watch. Driver: runO5aMine (ledger d-o5a-s{seed}.json, nHarvestD/T logged).

## Bars (seed-matched; verdict d-o5a-verdict.json; baselines cb retrieve 0.925/0.935/0.775, O3 composed 0.91/0.91/0.765)
- O5a-UNIFIED (primary, conjunctive): s2 retrieve ≥ 0.90 AND no seed drops > 0.05 vs cb (all 3) → UNIFIED else SPLIT (name which half fails).
- O5c-CEILING (secondary): composed vs O3 per seed, pooled direction reported.

## Expectation (filed open)
UNIFIED 3/3 (s2 repaired via dummy-harvest, s0/s1 hold via preserved balance). The skew hypothesis predicts exactly this.

## Nearest-failure
- O4b RETMINE (differs: unconstrained 100-substitution; O5a constrains by format — the mechanism test).
- O2a ERRMINE (differs: add-side; O5a is retrieve-side with the O2a lesson applied).

## Amendment v10.1 (pre-compute pins; blind battery 2026-11-23 — 3x CONDITIONAL)
- A1 adopted: nHarvestD/nHarvestT logged; effective fractions reported.
- A2 rejected: program convention + O4b reseed bounds init luck; same-trainSeed ×3 rejected as 3x bill for a bounded confound.
- A3 rejected as bar (binary stands), adopted as reporting (exact magnitudes).

## Amendment v10.2 (bug found + fixed mid-run, agent-caught, both versions filed)
True-harvest compared vhat against e.y (the answer) instead of e.v (the retrieved value) — on true lines y≠v always, so v1 true-harvest = first-40 random true lines. Fixed (vhat≠e.v), reran all 3 seeds (ledgers d-o5a-s*; v1 preserved as d-o5a-v1-s*). Effective true-errors recomputed: 21/12/14 per 300 — padding-dominated either way. Conclusion draws on BOTH versions + convergence lens (v2-s2 lastLoss 0.064 = only non-converged run).

## Cost
3 trains + 9 evals, COMPLETE-gated. NO PUSH.
