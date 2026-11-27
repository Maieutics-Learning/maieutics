# U64b barrage v1.0 scout 2

## Angle
ANGLE verdict-logic: PROCEED fires on EITHER edge at quorum — two bites. Score the joint gate: what is the chance probability that at least one of two ~0.021 bars fires, and does the prereg survive it? If not, give the exact gate fix.

## Reply (verbatim)
VERDICT: NEEDS-PATCH

1. Joint probability of $\ge 15/20$ on two $p=0.5$ bars is $\approx 0.041$. This is too low for a meaningful effect size of $+0.03$. The "EITHER" logic creates a massive multiple-testing problem; you are effectively fishing for a $2\%$ fluke. The Floor (0.40) is too permissive, risking a "Proceed" verdict on noise.

HARDEST-TEST: Seed-deterministic run of W0 (PIN×3) to verify `e1Rng` and `e2Data` offsets before W1; any jitter in `stackHash` fails the gate.
