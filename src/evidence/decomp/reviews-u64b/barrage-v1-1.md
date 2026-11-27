# U64b barrage v1.0 scout 1

## Angle
ANGLE floor-math: is FLOOR 0.40 principled or tuning-by-proxy (authors know U64 all-arm band 0.25-0.52 and adaptEarly 0.6-1.0)? What floor would you file blind, and why? If 0.40 is unjustified, give the exact replacement rule.

## Reply (verbatim)
VERDICT: NEEDS-PATCH

1. FLOOR 0.40 is tuning-by-proxy. Based on U64 bands (0.25-0.52), 0.40 is an arbitrary mid-point, not a principled failure threshold. It protects the model from "too-easy" seeds rather than validating the arm. A blind floor must be tied to the null distribution of the dice arm.
REPLACEMENT: FLOOR max-arm accRec < (dice.accRec + 2*std_dev) on >= 6/20.

2. E1 recovery uses filed boundaries; if the original filing had leakage or shift, E1 inherits it. E2's "adjacent-differ" logic is vague—needs a strict distance metric to ensure novel set orthogonality.

HARDEST-TEST: Run W0 with `seed=0` and `seed=1` on identical hardware; any variance in `stackHash` or `examHash` triggers immediate PIN-FAIL.
