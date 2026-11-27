# U64c barrage v1.1 scout 2

## Brief
ANGLE DIAG-grade: does DIAG-EXPLORE (detT-orT + detT-det, no quorum) actually isolate explore-over-reset, or does det (no reset, no explore) vs detT (reset+explore) conflate TWO interventions, leaving explore isolated NOWHERE (orT comparison is outcome-only if orT adapt saturates at 1.0)? Name the conflation or confirm the 2x2 logic closes.

## Reply (verbatim)
VERDICT: NEEDS-PATCH

1. DIAG-EXPLORE is logically flawed. Comparing `detT` (Reset+Explore) against `det` (No Reset, No Explore) conflates two variables. Comparing `detT` against `orT` (Reset-only) isolates Explore, but only if `orT` is a valid baseline; if `orT` adapt saturates at 1.0, the margin is a ceiling effect, not an intervention effect. The 2x2 logic fails because `det` is not a proper control for `detT`'s reset mechanism. Conflation: Reset-trigger vs. Explore-K.

HARDEST-TEST: `det` vs `orT` (No Explore, Reset vs No Explore, No Reset) to baseline the cost of the reset trigger independently of K-exploration.
