# Wave 395 (execution; backlog-W334 inversion-mechanism probe, zero new sims) 2026-11-12
STOP RULE: stopped after per-fold leverage audit on w317+w232+w300 rows (32
folds; receipt exact vs w317). 1 direct + 1 tangential below. Spend: 0 + 0 +
run. Script scratch/track-c/w334-lever.js (rig 46/46 line-verified from
w317-inversion.js); grid scratch/track-c/w334-grid.json. WIND-DOWN: no spawn
(backlog drains 17->16).

## Direct: the slope hugs zero and every fold can tip it — no pivot, all levers extreme-x

- RECEIPT: looAUC 0.000 + nPos 19 + resub b1 0.0082 + resubAUC 0.485 exact vs
  w317-grid. The audit reuses validated rows, doesn't rebuild them.
- (a) PASS: distributed knife-edge, single-pivot rejected. Removing a fold
  flips its LOO slope sign on 13/32 folds (full-sample rb1 = +0.0082, so any
  removal that costs >0.008 of slope tips it negative); the largest single
  |delta| holds only 10.8% of total |delta| mass (totAbs 1.547). No fold
  owns the inversion — the slope lives within one removal of zero in every
  direction.
- (b) PASS: levers are extreme-x, not label oddities. Top-5 |delta| folds
  have |zf| = 2.00/1.78/2.66/1.60/1.22 — all far from center. Sign pattern:
  high-x y=0 points (i=13) drag the slope down when present (removal +0.168);
  the highest-x y=1 point (i=2, zf 2.66) props it up (removal −0.139,
  flips negative). The +0.008 slope is a truce between extreme points, not
  a trend through the middle.
- (c) PASS: z-shift contributes nothing per-fold either. Mean pairwise-
  correct frac: LOO probs 0.000/0.000 (pos/neg) vs frozen-z probs 0.000/0.000
  — identical to three decimals in both sign groups. The whole inversion
  rides the LOO slope refit; standardization is innocent at every address
  (closes W317's remaining channel at per-fold resolution).
- Verdict: USED with teeth. Removal-flip roster (13/32) + no-pivot share
  (10.8%) + extreme-x lever audit + per-fold z exoneration. NO SPAWN
  (wind-down).

## Tangential: name the truce, not the winner (0-spend)

13 folds flip the sign and the top lever holds a tenth of the mass — yet the
pooled slope (+0.008) gets reported as "the" direction. Rule: a slope within
one-removal of zero is a truce between extremes, and its sign is not a
finding; report the flip roster (who tips it, from where) instead of the
sign. (Sixth instance of slice-before-pool: the habit now covers jackknives.)
