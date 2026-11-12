# Wave 394 (execution; backlog-W333 far-lead autopsy, zero new sims) 2026-11-12
STOP RULE: stopped after pure JSON audit over w316+w299+w265 rows (no new
sims; script scratch/track-c/w333-far.js; grid scratch/track-c/w333-grid.json).
1 direct + 1 tangential below. Spend: 0 + 0 + run. Pre-regs in the script
header were SCOUT-CONTAMINATED (row values seen during scouting) — scored for
calibration record, not credit; the genuine pre-reg'd test is spawned W350.

## Direct: s11's 14.13 decomposes — stale entry rides 5 audits, the 1200 reset is a sideshow

- RECEIPT: per-off meanTot recomputes bit-exact vs w373 (8.36/3.23/4.165/
  3.968/5.933); s11-B@-200 = 14.13 present. The autopsy reuses validated rows,
  doesn't rebuild them.
- (a) PASS (contaminated): s11 gap -200-vs-0 totals 15.10 = A1 0.29 (1.9%) +
  B 13.47 (89.2%) + A2 1.34 (8.9%). Pre-drift drift and post-reset misconfig
  both priced below.
- (b) PASS (contaminated): pre-drift drift owns B. dm400-s11 (w265, same base
  opts corr/mem8/wls.5) shares the 1200 mid-B reset and adds an 800 reset, yet
  B = 3.67 vs -200's 14.13. Entry excess = 10.46 (78% of the B gap); the 1200
  reset's share = 3.01 (22%). Mechanism: dm400's 800 reset caps the stale
  entry ride at 1 audit (relearning on pure B data from 800); -200 rides the
  A1-tuned entry cfg for 5 audits (700->1200) bleeding ~2/audit under R=30,
  then resets. SettleB tells the same story: -200 null (never) vs dm400 null
  but cheap — never-settling alone is not the catastrophe; five audits of
  stale entry is.
- (c) PASS (contaminated): post-reset misconfig priced at both ends. A1 +0.29:
  the 500 reset discards 5 audits of A1 learning, 3-audit relearning to 700.
  A2 +1.34: the 1900 reset (resPh A2=1, unique on the lead side) wipes 5
  audits of A2 adaptation 100 steps before the end (H=1 at 2000, no refit
  possible) — the tail is served frozen.
- (d) PASS (contaminated): phantom resets are exactly free. -50 s11 == 0 s11
  on ALL value fields (exA1/B/A2, settleB/A2, transient, finalCfg) despite
  resets at 650/1350 vs 700/1400. A reset leaving <2 audits before the next
  boundary cannot refit (H=1) so the cfg serves on frozen — price resets by
  their refit window, not their count. Pre-gap ladder for s11 B: 50->+0,
  100->+2.5, 200->+13.47 — a cliff between 100 and 200, not a grade
  (settleB 3/5/null).
- (e) PASS (contaminated): roster shares the penalty 5/6. -200 B minus 0 B:
  s11 +13.47 (settle null, never), s22 +5.11 (settle 5, slow), s44 +2.23,
  s55 +0.96, s33 +0.61 (all settle in 1 — fast settle is NOT free; the entry
  audit bleeds once at R=30 scale), s66 -7.00 (RESCUED: far-lead's 1200 reset
  interrupts s66's split-phase estimate; off0 s66 B=8.25). Per-seed-argmin
  habit honored sixth wave running.
- Verdict: USED with teeth. Stale entry priced (~10.5) vs mid-phase reset
  (~3.0) vs tail freeze (1.34) vs A1 discard (0.29); phantom-reset rule;
  5/6 roster with s66 rescue. Spawned W350 (bench off=-150 x 6 seeds,
  genuine pre-regs: s11 B strictly interior (3.16,14.13), settleB null-or->=5,
  s66 B < 8.25 rescued again, roster order s11-worst).

## Tangential: the transient flag records spikes, grind doesn't trip it (0-spend)

-100 s11 trips transient=true yet pays B=3.16; -200 s11 never trips it
(false) and pays 14.13. The flag fires on R>60||b>1 ever-spikes; sustained
~2/audit bleed under R=30 never crosses it. Rule: a quiet flag next to a loud
bill means grind, not health — read the path average, not the tripwire.
(Readout-address family: the flag is a readout with an address, and its
address excludes slow bleeds.)
