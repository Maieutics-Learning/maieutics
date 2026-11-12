# Wave 367 (execution; backlog-W311 easy-blind audit, zero new sims) 2026-11-12
STOP RULE: stopped after 23-row gap audit (receipt 24/24 means exact vs
w294). 1 direct + 1 tangential below. Spend: 0 + 0 + 0. Script
scratch/track-c/w311-blind.js (self-contained, receipt-arbitrated); grid
scratch/track-c/w311-grid.json.

## Direct: everybody hides — s10-fade is the mildest hider with the best press

- RECEIPT: all 24 cell-readout means EXACT vs w294-grid — same grouping,
  same rows; the audit extends the validated cells, doesn't regroup them.
- (a) REJECTED: s10-fade is NOT the only hidden-sick cell — 5 of 6 cells
  hide sickness (11/23 rows easy=1.0 with hard<.95); only s11-const is clean
  (maxGap .047, hidden 0/4). s10-const hides a WORSE gap (max .30 at auxW=3
  vs s10-fade's .205) — the famous hidden-sick cell is out-hidden by its
  own const sibling. Per-cell maxGap: s10-const .30, s10-fade .205, s7-const
  .138, s11-fade .133, s7-fade .0735, s11-const .047.
- (b) REFINED (was: const > fade): sched MEANS tie (fade .0954 vs const
  .0904 — fade nominally higher) while sched MAXES don't (const .30 vs fade
  .205). Sched doesn't separate the spot; shape does: s10-const is
  dose-GATED (gaps −.009/.035/.015/.02 → .265/.30/.2315, cliff at auxW≥2),
  s10-fade is dose-FLAT (.165/.205/.1665), s7-const grades (.057/.138/.1065),
  s11-fade mildly gated (.027/.0385→.133). The spot is cell-level, and
  s10-const's mean (.1225 < s10-fade's .1788) dilutes its cliff with healthy
  doses — mean gap reports the dilution, not the spot.
- (c) COUNTED: 11 hidden-sick rows; easy reads exactly 1.0 on 22/23 rows
  (the one non-ceiling row is healthy: hard .993). Easy readout blindness is
  total, not partial — in1/in4 passed every sick row ever measured here.
- Verdict: USED with teeth (w367-blind-note.md is this file). Only-hider
  rejected with a worse hider, sched-spot refined to cell-shape, blind count
  11, dose-gating priced. Spawned W328 (cliff-dose bisection, bench:
  s10-const auxW{1.25,1.5,1.75} — cliff address; does easy stay ceiling
  through the edge).

## Tangential: spot size is an extremum, never an average (0-spend)

s10-const's mean gap (.1225) ranks it BELOW s10-fade (.1788) while its max
(.30) doubles it — the average of a cliff and its healthy doses is a
property of the dose grid, not the sickness. Rule: every blind-spot (or
risk, or shortfall) ships the MAX alongside the mean, and the headline is
the max (second instance of W308's budget moral: the budget was the table
max, not the table mean; holes, not averages, set coverage). W328 inherits
the habit (bisect the cliff edge, don't average across it).
