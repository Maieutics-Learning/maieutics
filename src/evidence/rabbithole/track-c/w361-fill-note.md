# Wave 361 (execution; backlog-W306 sub-4 cliff fill, sandbox) 2026-11-12
STOP RULE: stopped after left-edge fill (theta .5 x D{2,4} x t0{1,2,3} + t0=4
receipt overlap = 8 cells x 2000 trials; receipt 0 vs w289-grid.json;
extended curves t0 1..16 analyzed). 1 direct + 1 tangential below. Spend:
0 + 0 + run. Script scratch/track-c/w306-fill.js (runCell/mulberry/makeNorm
vendored VERBATIM from w289-cliff.js, 57/57 line-verified); grid
scratch/track-c/w306-grid.json.

## Direct: the dense-window cliff was left-censored — true max sits at 2/4, +2 apart, and the blind-joint flips at the edge

- RECEIPT: 2 overlap cells (theta .5, D{2,4}, t0=4) EXACT vs w289-grid.json —
  fill extends the confirmed grid leftward, doesn't redo it.
- Left fill (fq): D2: .4009/.3345/.2717/.2354... D4: .4442/.4044/.3584/.2973/...
  Extended argmax drops: D2 cliff@2 (.0664; runner-up @3 .0628); D4 cliff@4
  (.0611; runner-up @3 .0460). Blind-points: D2@3 (.2717), D4@4 (.2973).
- (a) PASS-decisively: the strict-theta cliff IS left of the dense window
  (D2@2, D4@4 vs dense @5/@6). The dense argmax was left-censored by the
  window edge; true max drops run 2-3x larger (.0664/.0611 vs .0204/.0301).
- (b) REJECTED: D4 does NOT sit +1 (2->4 = +2). The one-notch rule is now
  dead at BOTH thetas in dense fill (.7: +0 in W341; .5: +2 here) — the
  coarse-grid +1 was quantization artifact twice over, not a scoped truth.
  Live pattern: cliff address = D (2->2, 4->4) — dip length sets the address
  directly at strict theta (hypothesis, not claim — owes a D-ladder).
- (c) INVERTED-and-refined: D2 cliff@2 PRECEDES blind@3 (cliff-then-blind —
  the supposedly lax-theta ordering, appearing at strict theta's left
  edge); D4 cliff@4 = blind@4 (simultaneous). W341's level-first joint
  (blindness precedes cliff at .5) holds only RIGHT of t0=3; left of it the
  ordering flips/meets. The joint is edge-dependent, not theta-fixed.
- Verdict: USED with teeth (w361-fill-note.md is this file). Censoring paid
  in public (dense @5/@6 retired), notch rule killed, joint scoped to t0>=3
  with an inversion logged. Spawned W323 (D-ladder at strict-theta left edge:
  D{1,3,5,6} x t0{1..6} — is cliff@D; does +1-per-D hold; blind-vs-cliff per D).

## Tangential: an extremum computed over a window is a property of the window until both edges are explored (0-spend)

W341 flagged the left edge and stopped ("flagged not hidden" — honest but
unpriced); this wave priced it and the map moved by 3 steps with drops 3x
larger. Rule, second instance of the quantization moral (coarse notches hid
theta-dependence in W341; window edges hid the max here): every argmax
address owes a two-sided edge check — extend both sides until the max drop
is interior with measured neighbors on each side, or own the censoring in
the verdict. D2 cliff@2 now has a measured left neighbor (drop 1->2 =
.0664 beats 2->3 = .0628 — interior, kept); any future argmax sitting ON a
grid edge ships with the word "censored" attached.
