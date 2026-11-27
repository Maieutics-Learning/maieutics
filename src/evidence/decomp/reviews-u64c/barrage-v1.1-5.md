# U64c barrage v1.1 scout 5

## Brief
ANGLE K-upper: K=10 explore slots cost accuracy during explore (random picks). If uniform explore scores ~chance (0.25-0.5) for 10/800 slots (1.25% of training), quantify the maximum two-drag from explore alone. If the drag exceeds +0.03 on any plausible seed, RESP-EDGE is self-sabotaged by construction. Numbers.

## Reply (verbatim)
VERDICT: NEEDS-PATCH

1. K=10 is an aggressive exploration penalty. If uniform explore scores 0.25-0.5, the expected loss per explore-slot is ~0.20-0.30 relative to exploit. At 1.25% training density (10/800), the aggregate drag is $\approx 0.0025$ to $0.00375$. While nominally below the +0.03 RESP-EDGE bar, this assumes zero-variance. High-variance seeds will see local drag spikes exceeding 0.03, potentially sabotaging the quorum (15/20) if the edge is thin. The "margin" logic is qualitatively sound but numerically precarious.

HARDEST-TEST: Run 20 seeds; verify if $\text{detT.two} \ge \text{dice.two} + 0.03$ holds across 15/20 seeds given $K=10$ exploration noise.
