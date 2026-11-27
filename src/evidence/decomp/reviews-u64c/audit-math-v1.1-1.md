# U64c audit-math v1.1 scout 1

## Brief
ROLE MATH-AUDITOR: (a) K=10 under diet-mix: recompute E[slots to see all 4 qk] with 75/12.5/12.5 draws (assume familiar draws show current-hot qk uniformly among 2; OOD/uniform show uniform qk). Is 10 cover or short? (b) Explore-drag on two: 30 explore slots/800 with chance-level picks — worst-case two impact? (c) detT-vs-dice adapt bar +0.10: dice adapt 0.61-0.97 filed; which dice values make the bar unpassable even for perfect detT (adapt=1.0)? Name the seeds (dice>0.90: s0/s2/s9/s12/s18). Does the bar survive 5 dead seeds (needs 15/20 of remaining 15)? Arithmetic.

## Reply (verbatim)
VERDICT: NEEDS-PATCH

1. K=10 is insufficient. With 75% dominant draw and 12.5% tails, E[slots] for all 4 qk is $\approx 1/0.125 + 1/0.125 + 1/0.25 \dots$ actually, the bottleneck is the two 12.5% slots. $E = 1/0.125 + (1/0.125 \cdot 1/2) \approx 12$. K=10 risks missing the tail qk, causing a reset-loop failure.
2. Explore-drag: 30/800 is 3.75%. Negligible impact on `two` if picks are random; likely absorbed by noise.
3. Adapt Bar: Dice seeds s0, s2, s9, s12, s18 are $>0.90$. If `dice.adapt` $> 0.90$, `detT.adapt` cannot exceed `dice.adapt + 0.10` (max 1.0). With 5 seeds mathematically blocked, quorum 15/20 requires 100% success on remaining 15. Zero margin for error.

HARDEST-TEST: Run seeds s0, s2, s9, s12, s18; if any pass, the bar is functionally dead.
