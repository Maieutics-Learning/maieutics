# Wave 396 (execution; backlog-W335 maxed-on-clean-cells + climb decomposition, sandbox) 2026-11-12
STOP RULE: stopped after paired forced-vs-inherited runs on the 2 clean
cells + serve-class decomposition of the 7 tail walls (fork identity 0/2100;
inherited receipt exact vs w284). 1 direct + 1 tangential below. Spend:
0 + 0 + run. Script scratch/track-c/w335-clean.js (rig 135/135 line-verified
from w318-forced.js + identity-receipted counted fork); grid
scratch/track-c/w335-grid.json. WIND-DOWN: no spawn (backlog drains 16->15).

## Direct: maxed wins even where there is no tail, by the same 27x — the climb never earns its keep

- RECEIPT: clean-cell inherited wall exact vs w284 wallRetry (189.1/188.6);
  tries == 2 on all 600 clean trials (the protocol-wasted retry, both arms
  pay it — same one-retry tax as W318); counted fork agrees with plain
  runTrial on all 6 fields over 2100 trials (0 divergences — the serve
  classes are measured on the same object, not a model of it).
- (a) PASS: maxed wins the wall on 2/2 clean cells (6.9 vs 189.1/188.6) with
  done150 = 1.000 for BOTH arms on both cells. No tail, no finish margin,
  same verdict: wall ratio 0.0365/0.0366 lands INSIDE the tail-cell band
  (0.032-0.037). The margin doesn't even shrink where climbing is least
  needed — in this world adaptivity is pure overhead at every address.
- (b1) REJECTED — and the rejection refines: serves-part of the inherited
  tail wall is 0.574-0.591 in all 7 cells, not >= .65. Attempts carry ~42%
  of the wall everywhere. The real pattern is the flatness (spread 0.017
  across PF x2/1.5, PL x2, counter x3): the bill-split is cell-blind, the
  fifth flatness finding in this family (W318's flat ratio, W313's flat
  window, W312's flat middle, W321's flat capture).
- (b2) REJECTED with redirect: phantom-serve share ranks with PL, not PF.
  PL8 cells hold the top-3 phantom shares (.281/.272/.235) while the
  highest-PF cell (pf0.03 PL4 window) sits at .207. Phantom length, not
  phantom rate, sets the phantom tax — rate sets how often you pay it.
- (c) PASS 7/7: stall serves exceed phantom serves in every tail cell
  (stall 0.595-0.723 of serves vs phantom 0.153-0.281). Productive serves
  are only 0.116-0.141 of serves — one serve in eight does work. The named
  latency: S-stall detection waits (60-72%) + the attempts they force (42%
  of the wall), not phantoms (15-28%).
- Verdict: USED with teeth. Same-ratio clean-cell win (climb never earns
  keep) + flat bill-split + PL-redirect + named latency (stalls + forced
  attempts). NO SPAWN (wind-down).

## Tangential: when the margin is cell-blind, stop gridding the cell (0-spend)

Ratio 0.032-0.037 across tail cells, 0.0365-0.0366 on clean cells; serves-part
0.574-0.591 across PF/PL/counter. Two independent decompositions, same
message: the margin doesn't live in the cell parameters. Rule: a second
flat decomposition converts the axis from "map it" to "stop spending on it"
— grid the mechanism (stall waits, attempt pricing), not the cell.
