# re2 residual-precision (sealed)

VERDICT: NEEDS-PATCH. Residual: 1e-3 tolerance too coarse for 6dp targets; low-count bins amplify rounding. Adjudication: ACCEPT — tolerance tightened 1e-3 -> 1e-4 (worst-case 4dp accumulation ~5e-5, 1e-4 is 2x slack). Micro-patched directly in v1.1.
