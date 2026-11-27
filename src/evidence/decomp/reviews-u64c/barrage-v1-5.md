# U64c barrage v1.0 scout 5

## Angle
ANGLE explore-policy: uniform explore for K slots then exploit — why uniform (not softmax-T, not round-robin over qk pairs, not recency-weighted)? If uniform explore scores BELOW dice during K slots (random picks in a 75%-familiar diet), detT.adapt could UNDERperform dice.adapt and the arm backfires. Derive the K-slot cost or demand the policy justification.

## Reply (verbatim)
VERDICT: IMPLEMENTABLE

1. Architecture is a standard oracle-triggered arm with a hard-reset exploration phase. Use of filed U64 dice ledgers ensures a valid baseline without new exam leakage. The 15/20 quorum is statistically rigorous given the joint probability ($\le 0.042$).
2.- Policy `detT` is simplistic: uniform exploration $K=10$ followed by max-score exploitation. Lack of softmax or recency-weighting risks "cold-start" variance. However, given the stationary U50 exam and $N=200$, $K=10$ is a negligible overhead ($\sim 5\%$ of sample). 
3.- The hypothesis that `RESP-ADAPT` passes while `RESP-EDGE` is uncertain is consistent with the "washing-out" effect of old exams.

HARDEST-TEST: Compare `detT.adapt` against `dice.adapt` using $K=0$ (pure exploit) vs $K=10$; if $\Delta \text{adapt} < 0.10$, the uniform exploration cost exceeds the gain.
