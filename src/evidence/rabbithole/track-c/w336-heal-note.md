# Wave 336 (execution; backlog-W285 healing-vs-edge, bench) 2026-11-12
STOP RULE: stopped after 5-cell ON/OFF grid (2 receipts + ON26-75 + OFF-forever
+ return101; s10@auxW1 seed10, w268 rig verbatim). 1 direct + 1 tangential
below. Spend: 0 + 0 + 5 runs. Script scratch/track-c/w285-heal.js; grid
scratch/track-c/w285-grid.json (saved post-hoc; page has no fs).

## Direct: three honest misses that redraw the map — the edge timing is U-shaped

- RECEIPT: ON26-50 .8933 + ON26-100 .9667 bit-identical (substrate confirmed).
- (a) MISSES: ON26-75 = .79 — extending ON past 50 does NOT heal toward .9667,
  it HURTS (.79 < .8933). Worse, the trajectory ignites (300:1.0) then
  COLLAPSES (400:.79): the OFF edge at 75 destabilizes a nearly-ignited net
  with no re-ON to recover on. Cut timing is U-shaped: edge@50 → .89,
  edge@75 → .79, edge@100 → .97. "Late-ON heals" dies as stated; the truth is
  edge-timing-dependent and non-monotone.
- (b) MISSES-WIDE: OFF-forever (never-ON) = .4233, not ≥.95. Owned conflation:
  W295's protective absence was absence-THEN-ON (R100=1.000, delayed ON), not
  never-ON — I equated them and the data refuse. Aux is NECESSARY here
  (never-ON never ignites); the W268 damage is not "the OFF state" but the
  ON×edge interaction. Absence protects only as a delay, never as a diet.
- (c) MISSES-HIGH: ON26-50+return101 = 1.000 — full rescue, holds from 200 on,
  beating every W268 cell (incl early50+R100 .8333 and ON26-100 .9667). Late
  re-ON after the gap DOES rescue completely. The gap variant (OFF 51-100)
  plus re-ON composes: less early ON-dose (26-50 vs 1-50) + same gap + late ON
  = the round's best cell. The wave's actionable product.
- Mechanism sketch (unclaimed): aux-ON enables ignition; an OFF edge during
  the ignition attempt (edge@75, net rising) is worse than an edge before it
  starts (@50, slow grind .89) or after it consolidates (@100, ignites post-
  edge anyway — ON26-100 hits 1.0 at 150 AFTER its edge). Return101 works
  because re-ON re-enables the stalled ignition. Edge timing vs ignition phase
  is the joint — W302 maps it (cut sweep 50–100 + re-ON variants).
- Verdict: USED with teeth (w336-heal-note.md is this file). Three misses, one
  discovery (return101 = 1.000), one new shape (edge-timing U + late collapse).
  Spawned W302 (edge-timing U mapping).

## Tangential: conflations confess fastest when the prediction is numeric (0-spend)

OFF-forever ≥.95 was the most confident pre-reg of the three and the most
wrong (.42) — because it smuggled an equation (absence-then-ON = never-ON)
that a number would have caught one line earlier. The miss is the method
working: numeric pre-regs turn quiet conflations into loud errors the same
day. Rule: when a prediction borrows authority from another wave's number,
re-state the borrowed number's EXACT cell beside it (R100 = delayed-ON, not
never-ON) — the address mismatch then fails on paper, before the bench runs.
