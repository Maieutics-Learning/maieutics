# U64c barrage v1.2 scout 10

## Brief
ANGLE anti-tuning-final: K=10 pre-picked, derivation now justifies 0.78 coverage (not full). Is keeping K=10 with corrected rationale honest, or must the prereg admit the derivation is post-hoc and pre-commit a K-robustness check (e.g. report detT margins; if thin, file K-SENSITIVITY-UNKNOWN note)? Exact fix or stand down.

## Reply (verbatim)
VERDICT: NEEDS-PATCH

1. K=10 is an arbitrary constant. The 0.78 coverage derivation is post-hoc and fails to justify why K=10 is sufficient or optimal. Claiming "honest" retention while correcting the rationale to avoid "saturation" is a linguistic hedge, not a technical justification. Without a pre-committed K-sensitivity analysis or a reported margin for detT, the result is vulnerable to p-hacking via K-selection. The dead-seed analysis (s0, s2, s9, s12, s18) creates a precarious 15/15 requirement for the remaining seeds, amplifying the risk that K=10 is tuned to the specific noise of the remaining sample.

HARDEST-TEST: K-SENSITIVITY-UNKNOWN (Run detT with K=5 and K=20; if outcomes diverge, the K=10 result is an artifact).
