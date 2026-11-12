# Wave 369 (execution; backlog-W312 consol-length stickiness ladder, bench) 2026-11-12
STOP RULE: stopped after 3-cell consol ladder (receipt consol600 bit-exact
vs w295 rec18; all s18 cut50 recut1400 ->2400, fixed 1000-step erosion
window). 1 direct + 1 tangential below. Spend: 0 + 0 + 3 runs. Script
scratch/track-c/w312-consol.js (rig 82/82 line-verified from w295-immortal.js);
grid scratch/track-c/w312-grid.json.

## Direct: the middle wins — restore address owns the verdict, consol length modulates

- RECEIPT: consol600 bit-exact vs w295-grid rec18 (14 traj keys + in1/hard1)
  — the ladder extends the validated bench, doesn't rebuild it.
- Post-recut trajs (1400→2400): consol600 (restore800): 1.0→.993→.97→.957→
  .913→.903 (hard1 .903, steady erosion); consol400 (restore1000): 1.0→1.0→
  1.0→.997→.997→.993 (hard1 .993, holds); consol200 (restore1200): 1.0→1.0→
  .99→.977→.97→.983 (hard1 .983, dips then recovers). Last-3: .924 / .996 /
  .977 — the MIDDLE length wins.
- (a) REJECTED: no monotone consol grade — 400 > 200 > 600 by last-3
  (.996/.977/.924). Longer consol is not stickier; the longest consol
  erodes most.
- (b) REJECTED: consol400 is the best, not the middle — peaked, not graded.
- (c) RECONCILED-as-restore-address (the reconciliation W312 was spawned
  for): consol-400 HOLDS at both onsets (W246 restore400 early + here
  restore1000 late, both ≥.99) — length owns the 400-hold across onsets.
  Consol-200 does NOT replicate across onsets (W348 restore800 → .88 vs
  here restore1200 → .983) — length does not own the 200-fate. Restore800
  erodes at BOTH consols tested (.88 @recut1000, .903 @recut1400) while
  restore{400,1000,1200} all hold ≥.98. The knob order is restore-address
  first (800 erodes, 1000+ holds), consol length second (weak grade within
  address: 600→.903 vs 200→.88; 400→.993 vs 200→.983).
- Verdict: USED with teeth (w369-consol-note.md is this file). Two monotone
  pre-regs rejected by a peaked ladder + W246-vs-W295 reconciled as
  restore-address with consol modulation. Spawned W329 (restore-address
  ladder, bench: restore{600,800,1000} x recut1400 ->2400 s18 — is 800 a dip
  or a cliff; restore600 decides).

## Tangential: peaked ladders are confound signatures — cross the axis, don't refit it (0-spend)

A peaked outcome (middle wins) under a monotone pre-reg means the swept
variable is not the primary knob — fitting a curve through 400>200>600
would be numerology. Rule: when the middle wins, stop fitting the axis and
cross it with the next variable already in the design (here restore address
was in the cells all along; the answer needed no new runs, only the right
group-by — second instance of W310's slice-before-pool: the ladder said
nothing until grouped by restore). W329 inherits the habit (restore ladder
at fixed recut: one variable, one verdict).
