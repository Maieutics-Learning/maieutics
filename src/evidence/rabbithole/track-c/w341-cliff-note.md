# Wave 341 (execution; backlog-W289 cliff-relocation mapping, sandbox) 2026-11-12
STOP RULE: stopped after dense-t0 cliff map (theta{.5,.7} x D{2,4} x t0{4..16
step 1} = 52 cells x 2000 trials; receipt 0 on 12 overlap cells). 1 direct +
1 tangential below. Spend: 0 + 0 + run. Script scratch/track-c/w289-cliff.js;
grid scratch/track-c/w289-grid.json.

## Direct: the notch rule is theta-local — +1 at .5, +0 at .7, blind first at strict theta

- RECEIPT: 12 overlap cells (t0∈{4,8,16}) EXACT vs w272D-grid.json — dense fill
  extends the confirmed grid, doesn't redo it.
- Cliff addresses (argmax adjacent drop, dense steps): (.5,D2) @5 (.0204);
  (.5,D4) @6 (.0301); (.7,D2) @5 (.0327); (.7,D4) @5 (.0372). D4 steepens both
  (.0204→.0301, .0327→.0372 — relocation as steepening, confirmed in dense).
- (a)/(b) SPLIT: exactly-one-notch-later holds at .5 (5→6, +1 ✓) and FAILS at
  .7 (5→5, +0). The coarse "one notch later" was a .5-truth promoted too far:
  at lax theta D4 steepens in place instead of shifting. Notch rule scoped:
  shift-then-steepen at strict theta, steepen-in-place at lax.
- (c) SPLITS-BY-THETA: blind-points .5: 4/4 (BOTH already <.30 at the dense
  window's left edge — blindness precedes the cliff: .235/.297 at t0=4);
  .7: 8/12 (cliff@5 precedes blindness ✓). The joint is level-vs-shape:
  strict theta sets blindness by LEVEL (curve starts blind, cliff arrives
  later into already-blind territory); lax theta orders them cliff-then-blind.
  The .5 cliff is LEFT of the dense window (coarse blind 3→4 says look at
  t0{1,2,3}) — the map's left edge is unexplored, flagged not hidden.
- Verdict: USED with teeth (w341-cliff-note.md is this file). Notch rule
  theta-scoped, steepening confirmed dense, cliff/blind joint split by theta
  with the left edge flagged. Spawned W306 (sub-4 fill at .5: is the cliff at
  3–4, does +1 hold at the left edge).

## Tangential: a rule that holds at one parameter value is a joint waiting to happen (0-spend)

"One notch later" survived three thetas on the coarse grid (1→2, 3→4→... wait,
4, 8→16 — those WERE all +1 notch) and died at the second theta on the dense
grid. Coarse grids quantize shifts into notches; dense grids resolve the
quantization as theta-dependence. Rule: every notch-uniformity claim owes a
dense fill at TWO parameter values before generalizing — uniformity across a
coarse grid is necessary, never sufficient. (W272's blind-point notch-gap
survived three thetas coarse; it now owes the same dense test — noted, not
assumed.)
