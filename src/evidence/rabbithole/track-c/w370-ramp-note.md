# Wave 370 (execution; backlog-W313 ramp-micro + late-force trace, bench) 2026-11-12
STOP RULE: stopped after 7-cell bench (1 receipt + 6 new: micro-ramps,
third-group aw8, aw16 both groups; masked-attn parity6, 1000 steps). 1 direct
+ 1 tangential below. Spend: 0 + 0 + 7 runs. Script scratch/track-c/w313-ramp.js
(rig 98/98 line-verified from w296-rampx.js); grid scratch/track-c/w313-grid.json.

## Direct: no ramp fails; the third hole is real at (16,10); (24,10) splits by readout

- RECEIPT: [16,8,10] bit-exact vs w296-grid (every field incl traj + b10) —
  the trace extends the validated bench, doesn't rebuild it.
- (a) REJECTED-refined: NO micro-ramp fails — ramp10/25/50 t1000 = 1.0/.9967/
  .9967 (trajs flat at ceiling). Even a 10-step delay heals fully vs
  constant-dose .83: the injury needs full dose from literally step 1; the
  t1000-window sits inside steps 1–10. But the ramp leaves an EDGE trace:
  l24 grades with ramp (.8133/.8333/.9633 — shorter ramp, worse long edge;
  W296's ramp100 edges all-passed, so the edge-window closes by ramp100).
  t1000 heals by ramp10; l24 needs ramp100.
- (b) REJECTED: aw8 at (24,15) does NOT re-injure — t1000 1.0, traj 1/1/1,
  edges all ≥.9767. The late force is (h,seed)-addressed (seed-specific),
  not group-h. (24,10)'s U-then-down does not transfer to seed15.
- (c) SPLIT: aw16 at (16,10) opens the THIRD hole — t1000 .9333 with a
  DECLINING traj (.9667/.9433/.9367) and broad crater (l12 .78 → l24 .55).
  The W oscillates: holes at aw1, aw4, aw16 with healings between (aw2?/aw8
  1.0). aw16 at (24,10) does NOT saturate-as-floor: t1000 RECOVERS to .9967
  (+.16 over aw8's .8367) while the LONG edges crater (l20 .7433, l24 .6267;
  l10/b10 healthy at .9967/.98). The injury goes length-gated: short
  readouts heal, long readouts crater, same cell, same run.
- Verdict: USED with teeth (w370-ramp-note.md is this file). Window priced
  at ≤10 steps (t1000) / ≤100 (edge), late force localized to its address,
  third oscillation confirmed, length-gated crater found. Spawned W330
  (crater-dose mapping, bench: aw{8,12,16} x (24,10) — crater onset dose;
  does aw12 already split readouts; t1000-vs-l24 divergence dose).

## Tangential: a cell with two readouts disagreeing has no verdict — it has an address (0-spend)

aw16 (24,10) is simultaneously healed (t1000 .9967) and cratered (l24 .63) —
quoting either number alone is false. Rule (third instance of W347's:
easy/hard, stock/flow, now t1000/ladder): readout-conditionality is not
noise around a cell verdict, it IS the verdict's address; cells ship as
(readout, value) pairs, and any claim of heal/injury names its readout or
it names nothing. W330 inherits the habit (t1000-vs-l24 divergence dose,
not "the" crater dose).
