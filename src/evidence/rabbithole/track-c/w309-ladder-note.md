# Wave 309 (execution; backlog-W262 ladder-edge mapping, bench) 2026-11-12
STOP RULE: stopped after 12-cell bench (5 holes + 7 neighbors x l{10,12,14,16,20,24};
masked-attn parity6, h/aw/seed cells, 1000 steps; w211 rig verbatim + l20/l24 evals).
1 direct + 1 tangential below. Spend: 0 + 0 + 12 runs. Script scratch/track-c/w262-ladder.js;
grid scratch/track-c/w262-grid.json (saved post-hoc; page has no fs).

## Direct: edges located; holes sit interior in dose; sharpness is uniform

- RECEIPT: training + fair ladder (t1000/traj/l10–l16) bit-EXACT vs w228 on all 12 cells.
  Owned stream artifact: b10 differs 6/12 (l20/l24 inserted before b10 in the eval rng stream —
  biased probe only, unused below; fair evals unaffected).
- (a) EDGES (first rung <.9): (16,1,10) <l10 (l10 .78); (16,4,10) <l10 (l10 .833);
  (24,.5,10) @l14; (16,4,15) @l14; (24,1,15) @l12 (l10 exactly .90). Split replicates (2
  early-collapse + 3 pure-ladder). Past l16 nothing stabilizes: all holes bleed to .45–.58
  by l24, no floor.
- (b) REJECTED-as-separator: edge SHARPNESS is uniform — max adjacent-rung drops .177/.147/
  .137/.147/.143 across the 5 holes (.14–.18 cliffs, both kinds). Neighbors cliff too
  (.11–.20). What separates pure-ladder from early-collapse is NOT sharpness but ADDRESS
  (edge on-ladder vs below-floor) + t-traj (flat vs falling). The taxonomy's axis was wrong;
  the classes survive on relocated axes.
- (c) HOLDS-UPGRADED: the edge moves with dose NON-MONOTONE — in 3/4 neighbor groups the
  HOLE IS THE MIDDLE DOSE: (10,16) edges ∞(aw.5) → <10(aw1) → 16(aw2); (10,24) ∞(.25) →
  14(.5) → 16(1); (15,24) ∞(.5) → 12(1) → 20(2); only (15,16) is monotone (20→14).
  More dose heals past the hole — injury peaks interior, not at the extreme.
- (d) LADDER-INDEXED BAR TABLE (.9 bar, P=pass; holes *):
  (16,1,10)* FFFFFF t.83 | (16,4,10)* FFFFFF t.85 | (24,.5,10)* PPPFFF t.97 |
  (16,4,15)* PPPFFF t.99 | (24,1,15)* PFFFFF t.93 | (16,.5,10) PPPPPP t1.0 |
  (16,2,10) PPPPFF t1.0 | (24,.25,10) PPPPPP t1.0 | (24,1,10) PPPPFF t1.0 |
  (16,2,15) PPPPPF t1.0 | (24,.5,15) PPPPPP t1.0 | (24,2,15) PPPPFF t1.0.
  (rungs l10/l12/l14/l16/l20/l24; t=t1000.)
- Verdict: USED-strong (w309-ladder-note.md is this file). Spawned W279 (dose-interior holes).

## Tangential: interior extrema need two forces (0-spend, reasoning)

A middle-dose hole means TWO dose-gradients cross: something worsens with dose (more aux →
deeper length-dependence) AND something heals with dose (more aux → stronger representation),
and the hole is where the first outruns the second before the second wins outright. Monotone
theories (more-aux-helps / more-aux-hurts) both die to the same U. Rule: an interior extremum
is a crossing signature — model it as two monotone forces, never as one non-monotone force;
the follow-up varies them separately (W279: dose sweeps per force — dependence vs capacity).
W259's ceiling/floor split composes (its floor-force may be the healer here).
