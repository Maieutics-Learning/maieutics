# U64b barrage v1.1 scout 2

## Brief
ANGLE verdict-logic: grade the filed 0.041 joint bound (independence upper bound; positive correlation lowers it). Does the EITHER-gate survive at 0.041<0.05, or is a single-gate/adjusted-quorum still required? Exact fix or stand down.

## Reply (verbatim)
VERDICT: NEEDS-PATCH

1. Joint bound 0.041 assumes independence; E1 and E2 are likely positively correlated via seed-dependency or shared hardware jitter. This inflates Type I error. 0.041 is insufficient for an "EITHER" gate at 15/20 quorum. Requires Bonferroni correction or a tighter single-gate threshold ($\alpha < 0.02$) to maintain 0.05 global significance.
2. Floor logic (0.40) is binary; sensitivity diagnostic is descriptive but doesn't mathematically resolve the "AMBIGUOUS-FLOOR" state, leaving the verdict frozen/undefined for the most critical failure mode.

HARDEST-TEST: Run 20 seeds with E1-gap=0.04 and E2-gap=0, verify if 15/20 triggers PROCEED despite E2 failure.
