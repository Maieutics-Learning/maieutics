# Wave 345 (execution; backlog-W292 forward-rank audit, sandbox) 2026-11-12
STOP RULE: stopped after forward-rank audit (5 step-transitions x 2
conventions + absorber trajectory; zero new sims on w190+w258 rule; receipt
.887 + lists). 1 direct + 1 tangential below. Spend: 0 + 0 + run. Script
scratch/track-c/w292-fwd.js; grid scratch/track-c/w292-grid.json.

## Direct: one-step prediction decays down the ladder; the absorber falls then flats

- RECEIPT: rankAUC .887 + fallen/d6/d25 lists reproduce w258-grid.json — the
  audit extends the validated rule, doesn't rebuild it.
- Forward ladder (margins@A rank degen@B / newly-degen@B): 0→1 —/— (no dips);
  1→3 1.0/1.0 (one dipper 0.35/0.2, trivially perfect); 3→6 .887/.887;
  6→12 .847/.711; 12→25 .720/.641. (a) replicates ✓. (b) HOLDS on
  all-convention (all >.7, monotone decay .887→.847→.720) and MISSES-by-a-hair
  on newly-degen (.641 at the last step — small positives (n=1, n=4) +
  censoring noise). (c) D3→D6 predicts best under BOTH conventions — the .887
  is the ladder's top, not just its first rung.
- Newly-degen rolls call the census: 0.35/0.2 dips at D3 AND D25 (the
  dip-twice cell, both times caught as newly-degen); D25's other three
  first-dippers (0.1/0.05, 0.1/0.35, 0.2/0.1) are right-censored terminals
  (W324's flag honored: counted in AUCs, labeled censored, not counted as
  returns). 6→12's sole new dipper is 0.2/0.35.
- (d) ABSORBER TWO-PHASE (lean refined): 0.2/0 margins D0→D25:
  level(m.5) → level(m.332) → level(m.094) → degen(m−.004) → degen(m.002) →
  degen(m−.006). Deepening THROUGH D6, then a FLAT degen floor (−.004/+.002/
  −.006 — no further collapse, no recovery signal). Neither deepening-forever
  nor slow-return by D25: the damage completes by D6 and sits. Degen-forever
  lean stands (no lift in 19 delays), but the floor's flatness says the
  progression stopped — D50 decides (W309).
- Verdict: USED with teeth (w345-fwd-note.md is this file). Receipt + decay
  ladder + dip rolls + two-phase absorber + censoring honored. Spawned W309
  (absorber-D50 probe: floor persists or lifts).

## Tangential: report both conventions, lead with the question asked (0-spend)

All-degen (.720) vs newly-degen (.641) differ by WHAT the positives mean
(stock vs flow) — the charter asked flow ("dippers"), the receipt needs stock
(.887 convention). Running both costs one filter line and prevents the
equivocation (".887 at every step" would have been false for dippers at
12→25). Rule: when the receipt convention and the question convention differ,
compute both, label which answers which, and never let the receipt number
stand in for the question number. W309 keeps the habit (floor-persists vs
lifts: pre-register the D50 bar before the bench runs).
