# Agent Exp-A prereg (agent-approved under 2026-11-19 user pre-countersign; no user input needed)
What do I want to find out: is the LEARNED ear-head the lossy step? F1c rule one-hots gave
the best-held gap anywhere (0.30 vs v44 0.08–0.14) at comparable absolute (0.46) — but
cross-pool with diverged mouth. Within-distribution (same weak tutor, same pools as v44),
do clean rule-targets transmit better than learned-head softs?

## Lever (one change vs v44)
Same weak tutor (retrain determinism 1600 steps/pair, seeds 9901/9902 — ABORT on drift like
v44), same v44 lines (c1+c2), same student combined 200+replay (seeds 9903/9914, inits
9850+pair). ONLY tEar changes: rule one-hot logits (±4 via filed v44 cuts, F1c §ruleLogits)
instead of learned-head softs. tLogits unchanged (same tutor). 3 pairs (quorum 2/3).

## Bars
- PRIMARY (head-is-lossy): pair-matched rule-transfer minus v44 learned-transfer >= +0.10
  with gap held, on >=2/3 pairs.
- INTERESTING: absolute rule-transfer >= 0.60 on >=2/3.
- CLEANER: gap held 3/3 (vs v44 2/3, v45 0/3).
- Nulls: shuffled-rule (position-shuffled rule targets; expect FAIL, gap<0.10) + blind
  inherited FAIL. Metric-confound rule (pre-filed): if shuffled-rule ALSO holds >=0.10 gap
  while absolute rises, the one-hot sharpness inflates gaps (ceiling effect) — verdict FAIL
  even on primary pass (metric broken, not signal found).
- Mouth guard: student S1e/S2h finite else ABORT pair with cause (F1c divergence must not
  repeat within-distribution; if it does, that IS the finding: rule-sharp targets break
  mouth learning even in-distribution).

## Expectation / pre-mortem / nearest-failure
Expectation: rule 0.50±0.05 (vs v44 0.48), gap held 3/3 (cleaner targets fix shuffled-rise),
absolute <0.60 → PARTIAL (head lossy, concept still capped at ~0.50).
Pre-mortem: one-hot sharpness inflates gaps (killer above — confound rule decides);
alternatively rule targets train FASTER to the same 0.50 ceiling (then the head was never
the wall; quantization was — converges with WHY boundary finding).
Nearest-failure: F1 ABORTs (graft NaN; mouth NaN cross-pool) — not repeated: no graft
(rule bypass), within-distribution (same pools/tutor family as v44); ABORTs filed with cause.
x-ablation single-draw — quorum 2/3 + Wilson, no line-level trips.
