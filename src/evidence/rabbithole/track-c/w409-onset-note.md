# Wave 409 (execution; backlog-W346 onset-bisection, bench) 2026-11-12
STOP RULE: stopped after 4-cell onset ladder (2 new + 2 anchors, 4 slices;
receipts exact). 1 direct + 1 tangential below. Spend: 0 + 0 + 4 cells-worth
(4x2400-step arms, 4 page_eval slices). Script
scratch/track-c/w346-onset.js (rig 82/82 line-verified from w329-restore.js);
grid scratch/track-c/w346-grid.json (rebuilt from slice files; receipts
re-checked in the rebuild). WIND-DOWN: no spawn (backlog drains 5->4).
Clock R65: 4/5 -> FULL — synthesis R66 fires next as queue-jump.

## Direct: the cliff edge pins to (700,900), and the step is sharp

- RECEIPT (double, exact): restore600 traj+hard1+in1 bit-identical vs
  w329-grid (.897; 2200:.897 flat 2200->2400); restore1000 bit-identical
  (.993). The ladder extends the confirmed rungs; the instrument holds.
- (a) PASS: restore700 erodes — hard1 .873 (traj 1600:.983 1800:.957
  2000:.91 2200:.873 flat to 2400), joining the <=800 floor band; restore900
  holds — hard1 .983 (traj 1.0 through 1600, .99/.99/.983 glide), joining
  the >=1000 side. Edge narrows from (800,1000)-class to (700,900).
- (b) PASS (sharp): neither new rung lands intermediate — .873 below .93,
  .983 above .97. The transition is a step between adjacent 100-rungs,
  not a grade. No shoulder to price.
- (d) PASS: easy ceiling — in1 = 1.0 in all 4 cells.
- Verdict: USED with teeth. Pinned address + sharp step + double receipt.
  NO SPAWN (wind-down).

## Tangential: floors are bands with texture, not points (0-spend)

restore700 (.873) erodes marginally DEEPER than restore600 (.897): the
W329 monotone (earlier restore = worse: .897 < .903 < .993) inverts on the
new pair by .024. Both rungs sit in the same floor band (~.87-.90, vs
hold-side .983-.993), so the ordering flip changes no verdict — but it
retires point-monotonicity inside the floor. Rule: floor-band — an
erosion floor ships its band width (here ~.03) before any ranking of
rungs inside it; deterministic streams make even .024 real, so report
the band, not the rank. (Receipt family: the two anchors are the
receipt for the floor's edges; the band is the finding between them.)
