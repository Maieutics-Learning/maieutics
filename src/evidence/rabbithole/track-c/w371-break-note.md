# Wave 371 (execution; backlog-W314 break-localization, sandbox) 2026-11-12
STOP RULE: stopped after 48-cell fine-mixture grid (8 null cells x
w{0,.05,.1,.15,.2,.25}; double receipt exact; N=20000/cell). 1 direct + 1
tangential below. Spend: 0 + 0 + run. Script scratch/track-c/w314-break.js
(rig 68+41 line-verified from w297-mix.js; driver mine, arbitrated by
receipts); grid scratch/track-c/w314-grid.json.

## Direct: the bar breaks at 5% pooling — the bar-setting cell breaks first

- RECEIPTS (double): w=0 all-fields vs w280 sep + w=.25 all-fields vs w297
  sep-family, all 8 cells exact — the fine grid extends both validated
  lines, rebuilds neither. (Per-trial deterministic streams: each w replays
  independently, no cross-w entanglement to own.)
- Max claim by w: 0→.0131 / .05→.0197 / .1→.0265 / .15→.0296 / .2→.0324 /
  .25→.0336. Breakers: 0/8 → 2/8 → 8/8 → 8/8 → 8/8 → 8/8.
- (a) PASS-refined: the bar breaks at w=.05 (+50% over the bar at 5%
  pooling) — but only 2/8 cells (both ladder-I12: .0197/.0155; next .0129 a
  hair under). Smallest breaking fraction: ≤.05 for the headroom-less
  cells, ≤.1 for all eight. The break lives inside (0,.05], finer grid owed
  (W331), not guessed.
- (b) PASS with shape: strictly increasing, DECELERATING increments
  (+.0066/+.0068/+.0031/+.0028/+.0012 per .05) — concave from the first
  step, no flat foot, no threshold. The hump has no onset: overshoot past
  the pool max (.0278) already by w=.2 (.0324). First-dilution damage is
  front-loaded; extrapolating the concave start, any w>0 breaks (lean,
  not finding — W331 prices it).
- (c) PASS: futSave share .276–.343 across all six fractions (one cell .276,
  hair under .28 — owned) — futility rides along from the first mixture.
- The bar-setting cell breaks first: ladder-I12-obf set the .0131 bar (max
  at w=0) and leads every fine fraction (.0197/.0265/.0296, top until w=.2
  where I6 takes over at .0324/.0336 — the lead migrates with w, second
  hump-shape note).
- Verdict: USED with teeth (w371-break-note.md is this file). Break priced
  at ≤.05 (2/8) / ≤.1 (8/8), hump immediate and decelerating, futility
  rides, lead-migration owned. Spawned W331 (sub-.05 bisection, sandbox:
  w{.01,.02,.03,.04} x ladder-I12 both policies + receipt — break address
  inside (0,.05); does any w>0 break).

## Tangential: headroom orders the breakers — re-measure the max cell first (0-spend)

The cell with zero headroom (ladder-I12-obf, exactly .0131) broke first;
the ranking by headroom predicted the 2/8 split (next-nearest .0129 held
at .0129 — one ten-thousandth under). Rule: under any perturbation probe,
order cells by (bar − value) and spend the finest grid on the smallest
headrooms — extremal cells are canaries (fourth instance of the max moral:
budget-holes, spot-gaps, cross-tab maxima, now break-order). W331 inherits
the habit (only the two ladder-I12 cells go sub-.05; the other six already
spoke at .1).
