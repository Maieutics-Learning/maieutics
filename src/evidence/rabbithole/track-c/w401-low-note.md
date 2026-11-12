# Wave 401 (execution; backlog-W339 low-start autopsy, zero new sims) 2026-11-12
STOP RULE: stopped after T1 high-slope fate split + tercile collapse rates
+ end−200 AUCs on w220-feed (receipt exact vs w322). 1 direct + 1 tangential
below. Spend: 0 + 0 + run. Script scratch/track-c/w339-low.js
(self-contained, receipt-arbitrated); grid scratch/track-c/w339-grid.json.
WIND-DOWN: no spawn (backlog drains 12->11).

## Direct: at low start the fall predicts — end−200 AUC .837 where slope sees .556

- RECEIPT: T1 = 21 rows over [.44,.505] + tercile slope-AUCs .556/.981/.860
  exact vs w322-grid. The autopsy reuses the validated feed, doesn't
  rebuild it.
- (a) PASS: among above-median-slope T1 rows (12: 7 failures, 5 jackpots),
  the fall splits fate cleanly — failures drop median .295 from 200 to 400
  while jackpots climb further (−.045, 400 above 200). Same rise, opposite
  second act: the trajectories share the ignition and diverge at the fall.
- (b) PASS: rose-then-fell collapse rate is worst in T1 (.381 vs .286/.273).
  Low starters don't just fail more — they fail by the specific
  rise-then-collapse shape, at the highest rate of any tercile.
- (c) PASS: end−200 rescues T1 prediction (.837 vs .556, +0.281) and ONLY
  T1 — T2 .656 vs .981, T3 .518 vs .860, overall .70 vs .802. Rise predicts
  mid/high starts; fall predicts low starts; neither predicts everywhere.
  The predictors are complements partitioned by start, not competitors.
- Verdict: USED with teeth. Fate-split fall + worst-tercile collapse rate
  + start-partitioned predictor complement. NO SPAWN (wind-down).

## Tangential: predictors have addresses, not ranks (0-spend)

Overall slope AUC (.802) beats end−200 (.70) — and the better predictor is
useless exactly where prediction fails (.556 in T1). Rule: never crown a
predictor on its pooled AUC; quote it per address (rise above mid-start,
fall below it). A pooled winner that loses its worst tercile by .28 is a
local expert with good PR. (Slice-before-pool, seventh instance — the habit
now covers features, not just comparisons.)
