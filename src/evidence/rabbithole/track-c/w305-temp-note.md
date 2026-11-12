# Wave 305 (execution; backlog-W259 noise-temperature ladder, sandbox) 2026-11-12
STOP RULE: stopped after 8-cell grid (SGD-pow2 x LR{.15,.2} x B{4,8,32,128} x 20 seeds,
W225/W284 seeds, 1500 steps; w208 rig verbatim + LR/B params). 1 direct + 1 tangential below.
Spend: 0 + 0 + 160 runs (floor). Script scratch/track-c/w259-temp.js; grid w259-grid.json.

## Direct: temperature governs the ceiling, not the fate

- RECEIPT: LR15/B32 -> settle 18 + strand 2 + NaN 0; LR2/B32 -> 20 flips, NaN 16 + strand 2 +
  settle 2 — W284's numbers EXACTLY (its "collapsed" = exact-0 strand). Rebuild validated;
  medFlip=10 in all 8 cells (every run flips first — NaN/strands are post-flip fates).
- (b) HOLDS-strongly: B128 rescues LR.2 perfectly — NaN 16->0, settle 2->20/20 (better than any
  LR.15 cell). (c) HOLDS: B4 AND B8 kill LR.15 — settle 18 -> NaN 20/20 both (the sweet spot
  dies in noise). Batch is life-or-death at fixed LR, both directions.
- (a) REJECTED-as-stated, REFINED: fates do NOT collapse onto T=LR/sqrt(B). NaN-ness does —
  T>=.053: NaN 20/20 all four cells; T=.0354: NaN 16/20; T<=.0265: NaN 0/60. The blow-up
  boundary (~.03-.05) is temperature-owned. But strand-vs-settle among survivors INVERTS T:
  B128/LR.2 (T.0177) settles 20/20 while B128/LR.15 (T.0133) strands 4 — lower T settles WORSE.
  (d) HOLDS-trivially: matched pair T.075/.0707 both NaN 20/20 — agreement at the ceiling,
  which constrains nothing (owned).
- Two-knob replacement: (1) TOP catastrophe (post-flip blow-up) ⟺ T above ~.04 — temperature
  holds; (2) FLOOR fate (strand vs settle, given survival) ⟺ small-LR + low-noise strands
  (LR.15/B128 strands 4/20; LR.2/B128 jumps over, 0/20; noisier B32 strands fewer) — the floor
  is LR-×-noise-owned, temperature-blind, direction-opposite. W284's "temperature, not speed"
  is scoped: temperature governs whether you explode, not whether you land. Speed (LR) still
  owns the landing.
- Verdict: USED-strong (w305-temp-note.md is this file). Spawned W276 (blow-up boundary
  bisection + floor-ownership at matched T).

## Tangential: one-sided knobs (0-spend, reasoning)

Temperature predicts the catastrophe perfectly and the landing backwards — a knob can be exactly
right about the tail and exactly wrong about the body. The ladder looked like a collapse because
both LRs were read at B32 (one T each, fate differing) — varying B revealed the knob's
jurisdiction ends where survival begins. Rule: a collapsing variable must be tested on BOTH
sides of every fate boundary it claims; a knob that orders blow-ups but inverts settle-vs-strand
is a ceiling knob, not a fate knob — label its jurisdiction (T > ~.04: explode; below: ask LR).
W253's coarseness composes (knobs have jurisdictions, count them separately).
