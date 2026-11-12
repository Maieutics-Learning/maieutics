# Wave 388 (execution; backlog-W328 cliff-dose bisection, bench) 2026-11-12
STOP RULE: stopped after 5-cell s10-const bisection (2 anchors + 3 probes).
1 direct + 1 tangential below. Spend: 0 + 0 + 5 runs. Script
scratch/track-c/w328-edge.js (rig 83/83 line-verified from w192-arms.js);
grid scratch/track-c/w328-grid.json.

## Direct: there is no cliff address — there is a notch at 1.5

- RECEIPT: auxW{1,2} rows bit-identical vs saved w226 rows (all 4 readouts)
  — the bisection extends the confirmed edge, doesn't rebuild it. (Owned
  override: charter said 150 steps; the 400-step rig is receipt-mandatory.
  Comparability over literalism.)
- Gaps across the edge: 1→.02 / 1.25→.2085 / 1.5→0 / 1.75→.1385 / 2→.265.
  The "cliff" between 1 and 2 is SICK → CLEAN → HALF-SICK → SICK:
  auxW=1.5 reads perfect health (hard 1.0/1.0) with sick cells on both
  sides. No monotone step, no single address.
- (a) REFINED (pre-reg wanted a split interval): the probes don't split —
  they notch. 1.25 sick (.209), 1.5 clean (0), 1.75 mid (.139). The
  address question dissolves; the notch question replaces it.
- (b) PASS: easy stays ceiling (in1/in4 = 1.0 at all three probes) —
  every bit of the jaggedness lives on hard. Hidden-sick pattern holds
  through the notch field.
- (c) REFINED (pre-reg wanted width ≤.25): swings are sharp (≥.14 per .25
  step: .209→0→.139) but width is UNDEFINED for a non-monotone edge —
  a cliff has a width; a notch field has addresses (plural) and depths.
- Verdict: USED with teeth (w388-edge-note.md is this file). Bit-identical
  anchors + dissolved address + ceiling-easy throughout + sharp-but-jagged
  profile. Spawned W345 (notch-travel + edge-fill, bench: s7/s11-const
  auxW{1.25,1.5,1.75} — does the 1.5-notch travel across seeds (same-seed
  reruns are bit-identical by construction, so travel is the only
  replicate); s10-const auxW{1.375,1.625} — notch width on s10; receipt
  anchors s10-const auxW{1.5} vs W328).

## Tangential: a bisection that finds clean in the middle found the wrong kind of edge

- Bisection assumes monotonicity (healthy on one side, sick on the other,
  narrow the address). Three probes returning sick-clean-sick retire the
  assumption, not the grid: the tooling was built for cliffs and the
  terrain is notches. Rule: the first probe that breaks monotonicity
  converts the wave from bisection to mapping — stop narrowing, start
  gridding (W345 grids seeds x fine-auxW instead of narrowing further).
