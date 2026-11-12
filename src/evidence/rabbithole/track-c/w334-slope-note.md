# Wave 334 (execution; backlog-W283 slope-only LOO, sandbox) 2026-11-12
STOP RULE: stopped after fixed-intercept slope-only LOO grid (lam{0,.1,1,10} x
9 K x {prefix,trainAcc} + subsample min-n; w266 rig verbatim, receipt 0).
1 direct + 1 tangential below. Spend: 0 + 0 + run. Script
scratch/track-c/w283-slope.js; grid scratch/track-c/w283-grid.json.

## Direct: the intercept was a third of the disease; slope-sign is the rest

- RECEIPT: ridge looRidge reproduces w249-grid lam1/10 exactly (recMax 0).
- (a) PARTIAL: agreement mean|fixedLOO−rank| = .224 at ALL lam (vs
  .340/.342/.349/.370) — closes by ~.12, flat across lam, but MISSES the <.15
  bar. The intercept was ~a third of the ridge-rank gap; the remainder is
  lam-proof, hence slope-side. pre@10 exhibits the residue nakedly: all 32
  fold slopes NEGATIVE while rank says .356 — the fit is sign-inverted, and
  fixed-LOO .604 ≈ flipped-rank .644. The folds agree with each other and
  disobey the data (W313's prePos pathology survives the intercept freeze).
- (b) PARTIAL: exact-0 cells 6/6/6/8 → 1/9 at every lam — the intercept was
  most of the zeros (constant-prob folds now tie at .5, never 0), but one cell
  RESISTS: trn@50 LOO=0 at all lam (rank .485, 19/32 slopes positive —
  majority-right sign, perfectly-wrong held-out order). The disease has a new
  address: trainAcc@50's slope fits anti-generalize fold by fold. Bar (0)
  missed by one stubborn cell.
- (c) MIXED: min-n (degeneracy-corrected, same subsample seed) @50: 45 (vs
  193 — big win); @100: 192 (vs 70 — LOSES: IQR flat .344/.350/.357 across
  nsub, no degeneracy to exclude this time, medLOOs .429/.183/.154 all
  non-constant); @200: 168 (vs 192 — small win). Un-rigging the intercept
  helps where the intercept was the binding constraint (@50) and exposes the
  slope variance where it wasn't (@100). No clean min-n story; fitted
  predictor stays disqualified (all ≫ 32).
- Verdict: USED with teeth (w334-slope-note.md is this file). W293's
  suggestion un-rigs a third of the gap and seven-eighths of the zeros, and
  names the remainder precisely (sign instability + trn@50). Spawned W300
  (slope-sign autopsy + sign-constrained LOO).

## Tangential: fixes that move the number halfway are addresses, not failures (0-spend)

.340→.224 with a flat lam profile is not "didn't work" — it is a measurement
of the intercept's share (about a third) with the rest isolated to slope-sign.
A partial fix that localizes the remainder (trn@50, sign flips) out-values a
total fix with no address. Rule: score a repair by the address it leaves
behind, not just the gap it closed — .224-flat says "look at signs," and
trn@50 says "look HERE first." W300 looks there (per-fold sign vs held-out
correctness; sign-constrained b1≥0 LOO: does the constraint close agreement,
and what does it cost where signs were right).
