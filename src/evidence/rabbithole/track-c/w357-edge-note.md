# Wave 357 (execution; backlog-W302 edge-timing U mapping, bench) 2026-11-12
STOP RULE: stopped after 12-cell edge grid (2 receipts + 2 anchors + 4 cuts
+ 4 re-ON; s10@auxW1, 400 steps, w285 rig verbatim). 1 direct + 1 tangential
below. Spend: 0 + 0 + bench. Script scratch/track-c/w302-edge.js; grid
scratch/track-c/w302-grid.json.

## Direct: the U was a spike — cut75 an isolated hole; collapse phase-slices the readout

- RECEIPT: ON26-75 + return101 trajs + hard400 bit-identical vs w285
  (transcription verified); anchors cut50/cut100 reproduce .8933/.9667.
- (a) REJECTED-as-shaped: the three U points replicate (.89/.79/.97) but the
  fill is high — hard400 by cut: 50:.8933, 60:.9767, 70:.9867, 75:.79,
  80:.98, 90:1.0, 100:.9667. Neighbors of the hole read ≥.98: the valley
  is a SPIKE at 75 (±5 steps), not a U. Three points never licensed the
  interpolation.
- Ignition time is monotone in edge (50:>400, 60:~300, 70:~300, 75:~250,
  80:~200, 90:~200, 100:~150 — more ON-dose before edge = further along),
  and every ignited cell DIPS post-ignition (80: 1.0→.82@250→1.0; 90:
  .97→.87@250→1.0; 75: 1.0→.79@400 unrecovered). Consistent with
  PHASE-SLICE: one moving dip (ignite→dip→recover) sampled by a fixed-400
  readout at different phases — 75 catches the trough, 70 hasn't dipped by
  400 (collapse pending ~450?), 80/90 already recovered. The edge doesn't
  set the outcome; it sets the CLOCK. W319 extends the window (does 70
  collapse past 400; does 75 recover).
- (b) Location HOLDS, context corrected: minimum at cut75 (.79), but
  bracketed ±5 by ≥.98 — the hole is 10 steps wide, not a valley.
- (c) INCONCLUSIVE-as-designed (owned gap): re-ON cells read .9633/1.0/
  .9667/.9367 — none collapsed, so nothing to rescue; perturbations ±.03
  both directions (re-ON neither rescues nor harms systematically here).
  Rescue needs a collapsing cell: cut75+return101 was NOT run (gap —
  W319 runs it).
- Verdict: USED with teeth (w357-edge-note.md is this file). U-points
  replicate + spike localized ±5 + phase-slice evidence (monotone ignition,
  moving dip) + re-ON bounded; (a) reshaped, (c) gapped-honestly.
  Spawned W319 (collapse-window extension ->600 + cut75 re-ON rescue test).

## Tangential: three points suggest a shape; seven points test it (0-spend)

@50/.89 @75/.79 @100/.97 LOOKS like a U the way any three non-monotone
points do — the shape was in the sampling, not necessarily the world.
Rule: a shape claim needs the fill (interior points at the sampling
resolution the shape implies); until the fill runs, quote the points,
not the curve ("low at 75", not "U-shaped in edge"). The fill here paid
twice (spike, not valley; clock, not outcome). W319 fills the other axis
(time past 400).
