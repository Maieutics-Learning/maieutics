# Wave 347 (execution; backlog-W294 healthy-flat audit, zero new sims) 2026-11-12
STOP RULE: stopped after per-cell dose-slopes x 4 readouts (24 slopes +
levels on 23 rows; receipt exact vs w277). 1 direct + 1 tangential below.
Spend: 0 + 0 + 0. Script scratch/track-c/w294-flataudit.js; grid
scratch/track-c/w294-grid.json.

## Direct: flat-high holds everywhere; flat-low hides on easy readouts

- RECEIPT: 6 hard4 dose-slopes exact vs w277-grid.json — audit extends the
  validated rows, doesn't rebuild them.
- (a) PASS: s11-const is flat-high on ALL four readouts — in1 0/1.0, in4
  0/1.0, hard1 +.0109/.9768, hard4 +.0093/.9697 (|slope|<=.011, mean>=.97
  everywhere). Healthy-flat generalizes beyond hard4.
- (b) REFINED: s10-fade is flat everywhere (|slope|<=.0093 all four) but
  low only on HARD readouts — in1/in4 read 1.0/1.0 (ceiling, identical to
  s11-const), hard1/hard4 read .82/.8223. The disease is flat x hard-low,
  not flat x low: on easy readouts the sickest cell looks the healthiest.
- (c) PASS: hard-readout contrast, both slopes flat (|dSlope|<=.011) with
  level gaps .157/.147 (>=.1 on hard1/hard4) — level-as-second-axis holds
  on two readouts, not just hard4.
- (d) PASS: in1/in4 slopes ~0 in all six cells (only s10-const .0017
  nonzero) — easy readouts carry no cell differences at all; every bit of
  diagnostic signal lives on hard1/hard4.
- Verdict: USED with teeth (w347-flataudit-note.md is this file). Flat-high
  confirmed multi-readout + flat-low scoped to hard readouts + contrast
  doubled + receipt; one pre-reg refined, and the refinement is the finding
  (easy readouts can't see the sickness). Spawned W311 (easy-blind audit).

## Tangential: audit the readout before the cell (0-spend)

s10-fade is simultaneously the sickest cell (hard .82) and a perfect cell
(easy 1.0) — the readout decides the diagnosis before the data arrives.
Rule: a cell-level claim ships with the readout it was read on, and a
"healthy" verdict on an easy readout is worth nothing until a hard readout
concurs (in1/in4 passed ALL six cells here, sick or not). W311 maps the
blind spot (per-cell easy-vs-hard gaps: is s10-fade the only hidden-sick
cell, how big is the spot per sched).
