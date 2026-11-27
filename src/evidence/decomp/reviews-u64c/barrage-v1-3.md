# U64c barrage v1.0 scout 3

## Angle
ANGLE washout: the OLD exam washed out orF (perfect info) to 4/20. detT has LESS information than orF (timing only + blind explore vs timing + true hot set). Derive the best-case detT.two ceiling under the old exam: if even orF caps at ~0.52, can detT.two>=dice.two+0.03 @15/20 EVER fire, or is RESP-EDGE a dead bar that can only produce RESPONSE-DEAD-by-construction? Numbers.

## Reply (verbatim)
VERDICT: IMPLEMENTABLE

1. Technicals: Valid. Deterministic policy + fixed boundaries (no redraw) ensures stability. Seed-specific RNGs prevent leakage. Use of OLD U50 exam creates a strict information bottleneck.
2. Math: orF (perfect info) yielded 4/20. detT is strictly weaker (blind K=10 explore vs hot set). If orF $\approx$ 0.2, detT.two $\approx$ 0.2. dice.two is baseline. A +0.03 delta is mathematically plausible but high-variance.
3. Logic: RESP-EDGE is likely a "dead bar" because the old exam washes out response gains. However, since it's a lower bound than RESP-ADAPT, it doesn't invalidate the run.

HARDEST-TEST: RESP-EDGE. Given orF's 4/20 failure on the same exam, detT.two $\ge$ dice.two + 0.03 is the primary failure vector.
