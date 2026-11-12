# Wave 414 (execution; backlog-W350 cliff-interior probe, sandbox — LAST WAVE) 2026-11-12
STOP RULE: stopped after 13-cell cliff grid (7 anchor receipts exact).
1 direct + 1 tangential below. Spend: 0 + 0 + run. Script
scratch/track-c/w350-cliff.js (rig 170/170 line-verified from
w316-phase.js); grid scratch/track-c/w350-grid.json (written by driver;
receipt "clean"). WIND-DOWN: no spawn (backlog drains 1->0 — DRAINED).
Clock R66: 4/5 (round ends with 4 verdicts — no R67; the wind-down
outruns the clock, as designed).

## Direct: the cliff edge sits in (150,200), and the worst seat moves to s44

- RECEIPT (7 anchors, exact): off=0 x 6 seeds 9-fields vs w316-grid +
  off=-50 s11 7 value-fields vs w299-grid (driver "clean"). Rerun
  phantom holds: -50 == 0 s11 on all 7 fields (phantomRerun true) —
  the frozen-cfg equality replicates on this rig version.
- (a) FAIL-boundary: s11 B = 3.16 — exactly the -100 wall, not strictly
  inside (3.16,14.13). Third strict-inequality boundary touch of the
  round (W332 .003, W345 .950, now wall-equality). The touch IS the
  location: B(-150) = B(-100) puts the shoulder flat from -150 to -100
  and the edge strictly in (150,200) abs — pre-reg (f) pointer named.
- (b) PASS: settleB = 5 (null-or->=5 — slow, five audits of stale entry
  before the cfg turns, same count as the -100 wall).
- (c) PASS: s66 B = 0.45 < 8.25 — rescued again, deeper than -200's
  rescue (-7.00 → B 1.25; here -7.80). The far-lead reset interrupts
  s66's split-phase estimate at every far offset tried.
- (d) FAIL: roster order s44-worst — s44 B=3.73 > s11 3.16 > s22 2.53 >
  s33 1.83 > s55 0.59 > s66 0.45. s11 takes the second seat; s44 (settle
  null — never) takes the worst. The never-settler pays most where the
  entry ride is longest — consistent with W333's mechanism (five audits
  of stale entry), just not on the predicted seed.
- Verdict: USED with teeth. Edge located (150,200) + rescue repeats +
  double receipt + phantom rerun + worst-seat correction. NO SPAWN
  (wind-down; backlog EMPTY).

## Tangential: same bills, different journeys — equifinality at the wall (0-spend)

-150 s11 and -100 s11 agree on every value field that bills (exA1, exB,
exA2, settleB, transient) while disagreeing on the entire path there
(alarmT 550,1250,1950 vs 600,1300; finalCfg 12,0.02 vs 16,0.16;
settleA2 null vs 6; A2 resPh 1 vs 0). Two different reset schedules
converge to the same 3.16. Rule: shoulder-extension — an exact
wall-touch plus a flat billed neighbor extends the shoulder (the edge
moves outward, here past 150); and path-divergence with bill-equality
is equifinality, not receipt failure — quote the journey fields next to
the bill fields, never instead. (Calibration record: W333's
scout-contaminated pre-regs called s11-worst and interior; the genuine
run corrects both — contamination flagged its own replacement, and the
replacement shipped. The charter habit holds.)
