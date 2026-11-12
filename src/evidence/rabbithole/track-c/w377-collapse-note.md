# Wave 377 (execution; backlog-W319 collapse-window extension, bench) 2026-11-12
STOP RULE: stopped after 4-cell x 600-step extension (2 slices; receipts
clean). 1 direct + 1 tangential below. Spend: 0 + 0 + run. Script
scratch/track-c/w319-collapse.js (runCell stack verbatim from w302-edge.js;
STEPS 600, EVALS +500/600); grid scratch/track-c/w319-grid.json.

## Direct: the .79 was an edge-effect — cut75 recovers by 500, re-ON never dips

- RECEIPT: cut70/cut75/cut80 traj ≤400 + hard400 bit-identical vs w302-grid
  (steps 1-400 untouched by the extension) — the window extends the validated
  rig, doesn't rebuild it.
- (a) PASS: cut70 never collapses past 400 (500: 1.0, 600: 1.0 — the notch
  is narrow; 70 fine on both sides of the window).
- (b) PASS: cut75 recovers — 500: .9667, 600: .96 (recovered already by 500,
  a full step earlier than the pre-reg's by-600). The 300:1 → 400:.79 cliff
  is a transient dip, same family as cut50's dip@250 (recovered by 400): the
  dip slides with cut, then heals.
- (c) PASS with a haircut: cut75r (re-ON at 100 of the ACTUAL collapse cell)
  never dips — 400: .9967, 500: .9933, 600: .99 (pre-reg said exactly 1.0;
  a .003-.01 hair below, same hair as cut70r/cut80r's .9633-.9667 class).
  Re-ON rescue is general, not cut-specific — extends w302's (c) to the cell
  that actually collapses.
- Phase-slice vs edge-effect, owned: edge-effect. Three cells high at both
  500 and 600, the fourth recovered by 500 — no sustained collapse phase
  anywhere in the window. The fixed 400-readout manufactured the crisis
  (fixed-window caution, W302).
- Verdict: USED with teeth (w377-collapse-note.md is this file). 4/4
  pre-regs pass + collapse reclassified transient + rescue generalized to
  the collapse cell + receipts exact. Spawned W336 (dip-shape mapping, bench:
  cut75 dense EVALS {325,350,375,425,450,475} + cut70/cut80 sparse anchors —
  localize the .79 dip floor + recovery slope; V (single-readout transient)
  vs U (sustained phase); notch half-width).

## Tangential: a readout that only fires once is a rumor

- cut75 sat at 1.0 (300), printed .79 (400), and was back at .9667 (500).
  Any verdict written at 400 alone — "cut75 collapses" — would have been
  exactly wrong about 500. Rule: a shape claim needs the readout AFTER the
  readout (extend the window past the extremum before naming the outcome) —
  the dip is only a dip once you've seen both sides.
