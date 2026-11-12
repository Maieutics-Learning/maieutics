# Wave 397 (execution; backlog-W336 dip-shape mapping, bench) 2026-11-12
STOP RULE: stopped after cut75 dense ladder + cut70/80 anchors (2 slices;
27/27 overlap receipts exact). 1 direct + 1 tangential below. Spend: 0 + 0
+ run. Script scratch/track-c/w336-dip.js (rig 91/91 line-verified from
w319-collapse.js + ONE-line dense EVALS); grid scratch/track-c/w336-grid.json.
WIND-DOWN: no spawn (backlog drains 15->14).

## Direct: the floor sat exactly on the old readout — V with a one-rung recovery

- RECEIPT: all 27 overlapping evals bit-identical vs w319-grid (cut75/70/80
  trajs ≤300 + 400/500/600). The inserted mid-evals (325-475) perturb
  nothing — forward is pure, the dense fill is a clean lens, and this doubles
  as eval-purity proof for the whole bench stack.
- (a) FAIL with correction: floor at 400 (.79), not 375 (.9333). The legacy
  400 readout WAS the floor address. Dense fill dates it: descent
  350:.9933 → 375:.9333 → 400:.79, instant recovery 425:.9833.
- (b) MIXED (hair over, then flat): hard475 = .9667 (misses [.90,.96] by
  .0067); hard500 = .9667 = hard475 — no rising slope to measure. Recovery
  completes by 425 (.9833): the whole recovery is ONE rung (+.19 in 25
  steps), then flat .96-.98 through 600.
- (c) PASS: V, decisively — a single dense eval below .90 (400:.79; neighbors
  .9333/.9833). Half-width ~25 steps each side. U/phase rejected.
- (d) FAIL narrow: anchors wobble but hold — cut70@425 .9467, cut80@350 .9433
  (both hairline below .95, both immediately recovered). Sympathetic wobble
  ±.05, no dip, no travel. The notch is cut75's alone.
- Verdict: USED with teeth. Floor dated (descent + one-rung recovery +
  flat) + V confirmed + anchor wobble bounded + 27/27 receipt. NO SPAWN
  (wind-down).

## Tangential: fill that doesn't move the extremum dates it (0-spend)

The dense ladder didn't relocate the dip — it gave it a descent, a
one-rung recovery, and a flat tail. Rule: when fill leaves the extremum on
its legacy address, the shape around it is the finding — quote descent +
recovery width + tail, retire the address. (Readout-address family: the
address was right, the shape was missing.)
