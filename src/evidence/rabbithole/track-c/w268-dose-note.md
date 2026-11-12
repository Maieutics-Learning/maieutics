# Wave 268 note (execution; backlog-W228 dose x width window map, bench)

STOP RULE: stopped after 30-run grid (auxW{.25,.5,1,2,4} x h{16,24,32} x {s10,s15},
1000 steps, ladder evals). 1 direct + 1 tangential below. Spend: 0 search, 0
fetch (vendored w211 rig). Clock: R42 1/5. Pre-reg scored: (a) PARTIAL (b)
REFINED-notch (c) CONFIRMED-reject. Receipts: all four W247 anchor cells
replicate to the digit (s10-h16-aw1 .78/.60/.55/.53; s15-h24-aw1 .90/.757/.653/.587).

## Direct: windows don't have edges — they have holes

Strict-bar (all rungs ≥.9) windows: s10-h16 {.25,.5} | s10-h24 {.25,2} |
s10-h32 {1,4} | s15-h16 {.25,2} | s15-h24 {.25,.5,2,4} | s15-h32 {.5,1,4}.
The interval-with-edges framing is dead: three cells are bimodal ({.25,2} twice,
{1,4}), and high dose (aw4) goes PERFECT-1.0 in s10-h32 and s15-h24.

(a) s10: h16 {.25,.5} as predicted ✓; h24 predicted {1,2}, got {.25,2} — the .5
hole is deep (l16 .73, real), the 1-hole is bar-marginal (.8767); h32 predicted
4-fails, got 4-PERFECT — refuted on 4. PARTIAL with a surprise.
(b) s15-h24: predicted {.25,.5}/fail/partial/fail, got {.25,.5,2,4} FULL passes —
the over-scaffolding peak is a NOTCH at exactly aux1, not a gradient. aux2/aux4
don't partially rescue; they fully pass. REFINED point-hole.
(c) No monotonic width-shift ✓ (predicted reject): s10 h16{.25,.5} → h24{.25,2} →
h32{1,4} — reshuffle, not shift. Dose, width, and seed interact pointwise.

Deep-hole ledger (l16 <.8): s10-h16 {1,4}, s10-h24 {.5}, s15-h16 {4}, s15-h24 {1};
s10-h32 and s15-h32 have NO deep hole (worst .8233/.8). No dose is safe everywhere
(.25 fails s10-h32 strict-bar; 1 hits both classic laggard cells); no cell passes
everything. Low dose is closest to universal (4.5/6), high dose is bimodal
(perfect-or-deep).

Mechanism note: aux1 hits exactly the two W247 laggard cells and passes the
other four — the laggard phenomenon is two points, not two regions. And the W247
inverse-dose story gains a third direction: UP (aw4 perfect where aw1 notches).

Verdict: USED-strong (4 receipts + interval-kill + notch + aw4-perfect surprises).
No precursor, no conflict.

## Tangential: edges are bars wearing a theory (0-spend, reasoning only)

Two of this wave's "holes" (.8767, .8533) exist only because the bar is .9 — move
it to .85 and the map changes shape. A window edge that moves with an arbitrary
threshold is a bar artifact, not a mechanism; the deep holes (.73, .61, .59) are
bar-proof. Rule: every window map ships the bar-sensitivity beside the map
(which edges survive .85/.9/.95), or the edges are decorative. The deep-hole
ledger above is this wave's compliance. Spawned W245 accordingly (hole dynamics
from saved trajs — do holes never-learn or late-collapse?).

## Spend / queue

- Spend: 0 + 0 + 30 runs (floor). Consumed backlog-W228 removed; spawned W245 to
  BACK. Backlog 17. Synthesis R42 clock: 1/5.
- W245 (C, zero new sims on w228 grids): hole-dynamics — t300/500/700/t1000
  trajs of hole vs neighbor cells (never-learn vs learn-then-collapse vs
  learn-then-unlearn-late; does the hole dose fail early or fall late?).
