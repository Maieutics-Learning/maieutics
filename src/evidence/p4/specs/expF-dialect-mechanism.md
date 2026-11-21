# Exp-F: dialect content + mechanism (COUNTERSIGNED 2026-11-20 — user: "study that
and go ahead and generate some experiments of your own to run, pre-countersigned")

## What Exp-E left us (content analysis 2026-11-20, scratch/expF-content.json)
Regenerated lines from stored teacher mouths. Prefix (first 3 toks, uniform-3 by
construction) stays ~2.93 entropy throughout — all change is in the body.
- Narrowers L2/L6/L1/L8: lag-1 persistence AMPLIFIED (0.37→0.44-0.46), body entropy
  falls, bigram mass concentrates on SELF-LOOPS of lineage-specific favorite tokens:
  L2 token 8 (16% of all bigrams), L6 token 0 (19%), L1 tokens 3/13, L8 tokens 15/17.
  L6 also shows lag-2 0.38 (period-2 alternation alongside runs).
- L9 (mild narrower): different route — lag-1 flat/down (0.32), lag-2 up (0.29):
  alternation, not runs.
- L5 (detached): ANTI-structure — lag-1 0.11, bigram entropy 5.43 ≈ max, top bigram
  0.019 (near-uniform over 361). Detachment via avoidance of pattern.
- L0 (resurrected): unstructured like L5 but milder (lag-1 0.12).
Mechanism hypothesis: the mouth trainer is a persistence AMPLIFIER (gain > 1 on
lag-1) + rich-get-richer on whichever token leads early (symmetry breaking).
E-visibility hypothesis: E couples to persistence (rewards sticky lines), so
amplifier lineages stay E-visible while L5's anti-structure decouples.

## Experiments (all resume-safe, same machinery, seeds filed per run)
- F1 E-VISIBILITY (no training): E grades synthetic pools with lag-1 in
  {0.0, 0.2, 0.35, 0.5, 0.7, 0.9} + early (g1) vs late (g9) lines per lineage.
  Predicts: E entropy falls / confidence rises with persistence; E labels track
  stickiness. Explains origin coupling/decoupling. (~15 min)
- F2 AMPLIFIER GAIN (3 mouth trains, no pile): fresh mouths on synthetic pools
  with lag-1 {0.0, 0.35, 0.7}; measure output lag-1 of their generations.
  Predicts: output lag-1 > input lag-1 (gain > 1) at least for mid inputs.
  (~30 min)
- F3 ONE-STEP TRANSPLANT: fresh mouth+ear trained directly on L2g9 lines
  (150/50 split, same recipe). Predicts: mouth test ≈ 2.1, ear fid ≈ +0.6 in ONE
  step — transmissibility is a property of the lines, not the chain history.
  (~20 min)
- F4 SEED-PERTURBATION REPLICATION (attractor vs contingent): rerun L2 lineage
  5 gens with student-train/gen seeds shifted +50000 (same G0). Predicts under
  attractor: same favorite token (8) + sticky content re-emerges by g5;
  under contingency: a DIFFERENT token wins. (~2h)
- F5 L9 ALTERNATION + L5 AUTOPSY (free compute on regenerated lines): ABAB rate
  P(x_t==x_{t-2}!=x_{t-1}) for L9 trajectory; L5 unigram-vs-bigram structure
  (concentrated tokens in random order?). (~10 min)

## Bars
- F1 pass: E confidence/entropy monotonic in pool lag-1 (Spearman |rho| > 0.8).
- F2 pass: gain > 1.05 on at least 2/3 inputs.
- F3 pass: mouth test within 0.3 of L2g9's 2.10 AND fid within 0.15 of +0.62.
- F4: attractor if g5 top self-loop token == 8 AND lag-1 within 0.05 of original
  g5 (0.43); contingent otherwise. Either way filed, no further chain.
- No T-beyond, no cross-lineage transplants, no new countersign needed: this file
  IS the countersign (user order 2026-11-20). Replication of F4-full-10-gens or
  new lineages need a fresh order.
