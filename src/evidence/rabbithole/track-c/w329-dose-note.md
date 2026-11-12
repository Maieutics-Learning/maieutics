# Wave 329 (execution; backlog-W279 dose-interior holes, bench) 2026-11-12
STOP RULE: stopped after 27-cell bench (15 main sweep + 6 replication + 6 force-sep;
masked-attn parity6, h/aw/seed cells, 1000 steps, w262 rig verbatim + ramp arm).
1 direct + 1 tangential below. Spend: 0 + 0 + 27 runs. Script scratch/track-c/w279-dose.js;
grid scratch/track-c/w279-grid.json (saved post-hoc; page has no fs).

## Direct: interiority confirms 3/3, but it is seed-conditional with a healing window

- RECEIPT: 10/10 overlap cells bit-EXACT vs w262-grid.json (every field incl b10 —
  same eval order, so no W309 stream artifact this time).
- (a) HOLDS-AMENDED: t1000 minimum is interior in all 3 groups — (16,10):
  1.0/.1.0/.83/1.0/.85 (min @1); (24,10): 1.0/.97/1.0/1.0/1.0 (min @.5);
  (24,15): 1.0/1.0/.93/1.0/1.0 (min @1, clean U). Edges agree: (16,10)
  ∞,∞, <10, 16, <10; (24,10) ∞,14,16,20,16; (24,15) ∞,∞,12,20,∞. AMENDMENT:
  W309's "more dose heals past the hole" holds only inside a HEALING WINDOW —
  extreme dose re-injures in 2/3 groups ((16,10) edge <10 again at aw4, t.85;
  (24,10) edge retreats 20→16 at aw4). The curve is U-then-down, not U-then-flat.
- (b) MISSES (scored honestly): second seed-set (seed 24) shows NO interior minimum.
  (16,·,24) t1000 .91/1.0/1.0, edges 12,∞,24 — monotone healing from the lowest
  dose. (24,·,24) t1000 1.0/1.0/.99, edges 20,∞,20 — flat. Dose-interiority is a
  SEED-CONDITIONAL address property, not a general dose law; composes with W309's
  address axis (interiority lives at certain (seed,h) addresses, absent at others).
- (c) UNRESOLVED-WITH-DIRECTION: BOTH forces heal, so no separation. Capacity (h×2)
  heals all three holes (t .83→.99, .97→1.0, .93→1.0; edges <10→all-pass,
  @l14→@l16, @l12→@l20). Ramp-500 heals all three too — and further (edges →@l16,
  @l20, all-pass). The crossing model survives but these arms don't identify its
  forces. DIRECTION: ramp healing means the injury needs EARLY aux — delaying dose
  while representation establishes first heals as well as doubling capacity.
  The dependence force acts early; steep-early-dependence is the injurer candidate.
- (d) EXTENDED BAR TABLE (t=t1000; edges first-rung-<.9; holes *; C=capacity, R=ramp):
  (16,·,10): ∞(1.0) ∞(1.0) <10*(.83) 16(1.0) <10(.85) | C-32 ∞(.99) | R-500 @16(.99).
  (24,·,10): ∞(1.0) 14*(.97) 16(1.0) 20(1.0) 16(1.0) | C-48 @16(1.0) | R-500 @20(1.0).
  (24,·,15): ∞(1.0) ∞(1.0) 12*(.93) 20(1.0) ∞(1.0) | C-48 @20(1.0) | R-500 ∞(1.0).
  seed24: (16,·,24) 12(.91) ∞(1.0) 24(1.0); (24,·,24) 20(1.0) ∞(1.0) 20(.99).
- Verdict: USED with teeth (w329-dose-note.md is this file). Bounds W309 twice:
  interiority is seed-conditional (b) and healing is windowed (a); force-sep stays
  open with an early-dependence direction (c). Spawned W296 (ramp-timing + aw8).

## Tangential: healing windows imply dose has three regimes, not two (0-spend, reasoning)

Two forces crossing give a U (injurer wins, then healer wins). A U-then-down needs
the injurer to come BACK at extreme dose — i.e. the injurer itself is non-monotone,
or a THIRD force (saturation/toxicity) joins late. Rule: when a sweep heals then
re-injures, do not stretch the two-force fit — price a third late-acting force and
probe past the edge (W296: aw8 re-opens or not). W259's ceiling/floor split is the
standing candidate for the late force (its floor may be what aw4 hits).
