# Wave 400 (execution; backlog-W338 quadrant-cross audit, zero new sims) 2026-11-12
STOP RULE: stopped after 2x2 quadrant refit on regenerated w321 poolTrials
(8000 trials; w253 deep-equal + 4/4 union receipts). 1 direct + 1 tangential
below. Spend: 0 + 0 + run. Script scratch/track-c/w338-quad.js (rig 155/155
line-verified from w321-split.js); grid scratch/track-c/w338-grid.json.
WIND-DOWN: no spawn (backlog drains 13->12).

## Direct: the .04 lives in exactly one quadrant — odd-d x second-100

- RECEIPT: poolTrials regen deep-equals w253-grid (inherited) + all 4
  quadrant-union refits reproduce the w321 half taus exactly (even/odd,
  first/second) — the quadrants tile the validated halves without remainder.
- (a) PASS: oddSecond is the sole .04 quadrant (b65 tau .04); evenFirst,
  evenSecond, oddFirst all fit tau 0. The half-level flip (each split holds
  one 0-half and one .04-half) resolves to a single cell of the cross.
- (b) PASS: edges — oddSecond 0.00005 (> 0, the hair of real edge); the
  other three EXACTLY 0.0. The 0-quadrants are ties-or-worse under strict-<
  bestTau, not near-misses: at 1e-7 resolution there is no edge hiding in
  them. The pooled .04 was carried by one quarter of the data all along.
- (c) FAIL narrow with redirect: captures .994/.999/.99 — except evenFirst
  at 1.013 (over-capture past the band by .003). A 0-quadrant fitting its
  own noise beats the global price denominator slightly. Captures are flat
  to ±.013, not ±.01 — and the outlier is a 0-quadrant, so the over-capture
  is noise-fitting, not signal.
- Verdict: USED with teeth. Sole-carrier quadrant + exact-zero edges +
  union tiling + capture flatness (with the 1.013 redirect). NO SPAWN
  (wind-down).

## Tangential: ties report as zeros — read the mechanism, not the value (0-spend)

Three quadrants fit tau 0 with edge exactly 0.0000000 — not 1e-6, not
"small". Under earliest-on-ties fitting, 0 means "nothing beat the
endpoint", which is a fact about the search, not a measurement of zero
effect. Rule: an exactly-zero fitted knob is a tie report — confirm with
the margin (edge), and if the edge is exactly zero too, the quadrant has
no say, not a small say. (Tie-break family, W321's mechanism priced one
level down: halves → quadrants.)
