# U64c barrage v1.0 scout 1

## Angle
ANGLE K-arbitrary: K=10 uniform explore is a filed single value with no sweep and no derivation. Is 10 principled (derive it from the diet fractions or switch spacing), or must the prereg either derive K, bracket it (K in {5,10,20} as separate arms — costs 40 more trains), or pre-commit a K-sensitivity diagnostic? Exact fix.

## Reply (verbatim)
VERDICT: NEEDS-PATCH

1. K=10 is an arbitrary constant without derivation or sensitivity analysis. Since it governs the exploration phase of the new oracle-triggered arm, the lack of a bracketed range (K={5,10,20}) or a derived value from diet fractions introduces a hidden hyperparameter risk. The "filed single value" approach is an implementation detail, not a theoretical justification. The rest of the protocol (U50 exam, dice ledgers, 15/20 quorum) is technically sound and prevents data leakage.

HARDEST-TEST: W0 PIN-check + 3-seed twin p0/step1. Any mismatch in rule-ID or stackHash triggers an immediate PIN-FAIL.
