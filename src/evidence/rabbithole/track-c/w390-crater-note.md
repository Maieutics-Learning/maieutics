# Wave 390 (execution; backlog-W330 crater-dose mapping, bench) 2026-11-12
STOP RULE: stopped after 3-cell dose ladder (1 receipt + 2 new, 3 slices).
1 direct + 1 tangential below. Spend: 0 + 0 + 3 runs. Script
scratch/track-c/w330-crater.js (rig 98/98 line-verified from w313-ramp.js);
grid scratch/track-c/w330-grid.json.

## Direct: the dose-response is inverted — aw8 is the deepest crater, dose rescues

- RECEIPT: [24,16,10,0] all fields exact vs w313-grid — the ladder extends
  the confirmed crater cell.
- (a) REJECTED decisively: aw8 does NOT heal on (24,10) — full crater
  INCLUDING t1000 (.8367; ladder .45–.82; traj W-oscillates .94→.997→.927).
  W313's "(24,15)-aw8 heals" is seed-specific (seed 15 vs seed 10), exactly
  as W313's own "late force seed-specific" warned. There is no healthy
  dose in {8,12,16} for the ladder — only t1000 rescues with dose.
- (b) REFINED: aw12 "splits" only weakly (t1000 .9133 vs l24 .5133 — a .4
  gap, but t1000 itself cratered). The split t1000−l24 reads .287 / .400 /
  .370 across aw{8,12,16} — widest at 12, not monotone. Every dose splits;
  t1000 recovers FIRST (.837→.913→.997 monotone rescue) while the ladder
  stays cratered through 12 (l20 .453 flat at 8 AND 12, jumps only at 16).
- (c) PASS: receipt exact (all 14 fields).
- (d) REJECTED: l24 does not deepen monotone (.550 → .513 → .627 —
  aw8≈aw12, jump at 16). The ladder dose-response is flat-then-jump, not
  graded; the graded response lives only in t1000.
- Verdict: USED with teeth (w390-crater-note.md is this file). Exact
  receipt + inverted dose-response (dose rescues, 8 deepest) + t1000-first
  recovery order + flat-then-jump ladder. Spawned W347 (dose-fine +
  seed-split, bench: aw{4,6,10,14} x (24,10) — is there ANY healthy ladder
  dose below/above; split width across dose; aw8 x (24,15) receipt vs
  W313 — does the seed-15 heal replicate).

## Tangential: rescue order is a readout hierarchy

- t1000 recovers across the full dose range (.84→.91→1.0) while l20 sits
  flat (.45, .45) then jumps (.74): the readouts don't move together, they
  move IN ORDER (t1000 first, ladder later-or-never). Rule: a dose ladder
  that lifts one readout gradeably while another sits flat-then-jumps is
  two mechanisms (t1000-rescue + ladder-crater), not one dose-response —
  report them as separate curves sharing an x-axis, never as one averaged
  slope.
