# U64b barrage v1.1 scout 1

## Brief
ANGLE floor-math: grade the v1.1 floor package (0.40 as labeled Hypothesis + 0.35/0.40/0.45 sensitivity diagnostic + AMBIGUOUS-FLOOR note). Is this honest deodorization or dressed-up tuning? Give the exact remaining fix or stand down.

## Reply (verbatim)
VERDICT: NEEDS-PATCH

1. Floor-math is dressed-up tuning. Sensitivity diagnostics (0.35/0.45) around a 0.40 threshold without a pre-specified p-value or alpha-correction is "p-hacking by table." Labeling "Hypothesis" for floor-failure is semantic noise; it doesn't solve the boundary-blurring of a floating floor.
2. E2's `lowest-pair-index` fallback introduces a systematic bias toward low-index candidates during redraw failures, potentially inflating `accTra` via selection pressure rather than actual transfer.
3. Independence is claimed, but W0 twin enforcement on W1 re-evals creates a temporal dependency that may leak state if `stackHash` isn't strictly monotonic.

HARDEST-TEST: Run 1000 iterations with `dice.accRec` set to 0.39; if verdict fluctuates between INCONCLUSIVE and PROCEED based on the sensitivity table, the floor is a ghost.
