# Wave 331 (execution; backlog-W281 extreme-N probe, sandbox) 2026-11-12
STOP RULE: stopped after extreme-N grid (combo-2.5 frozen + old + flat-2.5 at
N{2,80} x M{180,720} x match{.05,.15}; FA + DET; w264 receipt maxDiff 0; 8 cells).
1 direct + 1 tangential below. Spend: 0 + 0 + run. Script
scratch/track-c/w281-extreme.js; grid scratch/track-c/w281-grid.json.

## Direct: combo holds both extremes 8/8; rival corners go total, not wider

- RECEIPT: w264's 8 combo cells recomputed maxDiff 0 (same seeds/streams).
- (a)(b) CONFIRMED: combo-2.5 frozen holds FA≤.05 in 8/8 extreme cells (max .037,
  match.05-N80-M180): 4/4 at N=2 (dep term covers dependence noise) and 4/4 at
  N=80 (BI term covers burn-in noise). Jurisdiction now spans N∈{2,10,40,80} —
  two doublings each way from the fitted middle, no break.
- (c) CONFIRMED-SHARPENED: the rival corners don't widen — they go TOTAL at the
  extreme. Old rule: 0/4 at N=2 (FA .093–.233 everywhere; kOld .73–1.46
  under-covers when N is tiny relative to M) vs 4/4 at N=80. Flat-2.5: 0/4 at
  N=80 (FA .057–.217; deployment term vanishes, BI noise rules) vs 4/4 at N=2.
  Each rival owns exactly one extreme and collapses at the other — the
  opposite-corner certificate from W311 upgraded to an opposite-EXTREME
  certificate. Old's N2 DET (.093–.257) is hyper-sensitivity, not power (fires
  on everything: FA .09+ beside DET .09+); flat's N80 DET (.93–1.0) likewise
  (threshold → eh + epsilon, claims everything including the null at .06–.22).
- (d) CONFIRMED-EXCEEDED: DET combo ≥ old on 4/4 valid-old cells (+.1/+0/+.313/
  +.093) — validity costs nothing for the third round; the +.313
  (match.15-N80-M180, the noisiest extreme cell) is the reallocation signature
  again (W291 +.146, W311 +.26: the noisiest cell is where combo's second term
  buys the most).
- Verdict: USED-strong (w331-extreme-note.md is this file). No hole for a third
  term anywhere in N{2,10,40,80} × M{180,720} × match{.05,.15}. Spawned W298
  (M-extremes: the untested axis).

## Tangential: extremes that separate totally license the middle (0-spend, reasoning)

When rivals fail partially, the middle is contested ground; when each rival fails
 totally at exactly one extreme and owns the other, the middle is covered by
 construction, not by luck — combo's 8/8 at N{10,40} was already implied by the
 form, and the extremes confirm the implication rather than extending it. Rule:
 total-separation at the extremes promotes the interior from evidence to
 entailment; stop re-probing the interior (no more N=20 grids) and move the
 remaining axis (M: W298 M{45,2880} × N{2,80} corners).
