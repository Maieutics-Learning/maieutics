# U64c barrage v1.2 scout 9

## Brief
ANGLE rival-final: ONE new rival for detT beating dice on ADAPT (not response, not regularization — e.g. detT's resets + explore systematically UNDERSHOOT early-quarter counts, making its adapt-window picks look 'fast' by starting from zero rather than from stale knowledge — a cold-start artifact). Killer test + contained-or-patch.

## Reply (verbatim)
VERDICT: IMPLEMENTABLE

1. The `detT` arm's logic is sound; the K=10 uniform explore on TRUE boundaries prevents lock-in without risking saturation. The 0.78 coverage probability is acceptable for a 15/20 quorum. Dead-seed pre-analysis is rigorous, correctly identifying the 5/20 failure rate due to dice thresholds, leaving a viable 15/15 window. FP-drift is negligible. The "cold-start" artifact in the rival-final angle is a valid mechanism: by zeroing `qkCount` at boundaries, `detT` avoids the stale-knowledge lag of the baseline, creating an artificial speed advantage in the adapt-window.

HARDEST-TEST: Run 20 seeds on the U64 dice; if >5 seeds fail the 0.9267 threshold, the entire run is DEAD regardless of `detT` performance.
