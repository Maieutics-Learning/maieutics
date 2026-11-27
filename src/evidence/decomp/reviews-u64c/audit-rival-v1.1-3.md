# U64c audit-rival v1.1 scout 3

## Brief
ROLE ALTERNATIVE-EXPLANATION: ONE rival for detT beating dice on ADAPT that is neither 'response works' nor filed-mechanism (e.g. detT's post-trigger uniform explore acts as regularization/annealing that improves LATE training generally — timing irrelevant). Killer test (e.g. shT-style random-trigger detT arm — NOT filed: is its absence the hole?) + contained-or-patch.

## Reply (verbatim)
VERDICT: IMPLEMENTABLE

1. Mechanism is sound. K=10 is logically derived from the 4-slot coupon collector problem (E≈8.33) to ensure coverage. The DIAG-EXPLORE setup effectively isolates the reset trigger from the explore phase, preventing confounding. FP-drift is negligible ($10^{-7}$) relative to the 0.03/0.10 margins. The "dice" baseline is stable and seeds are matched. The only risk is that $K=10$ is a heuristic; however, the 15/20 quorum provides sufficient statistical protection against seed-specific anomalies.

HARDEST-TEST: Trigger-Null arm. Implement a version of detT that executes the "reset qkCount + UNIFORM explore K=10" sequence upon a random trigger instead of the TRUE filed boundary. If this arm also beats dice on ADAPT, the benefit is generic regularization/annealing, not the specific boundary-trigger mechanism.
