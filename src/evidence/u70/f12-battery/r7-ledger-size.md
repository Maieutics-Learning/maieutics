# U70-F12 battery verbatim r7-ledger-size.md (2026-11-27, sealed)

Angle: ledger-size
Verdict: NEEDS-PATCH
Finding: 4-decimal rounding across 10 bins can accumulate and mask MCE deltas.
Falsifier: cumulative rounding error exceeding the calibration delta.
