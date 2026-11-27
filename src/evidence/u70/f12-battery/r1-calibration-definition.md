# U70-F12 battery verbatim r1-calibration-definition.md (2026-11-27, sealed)

Angle: calibration-definition
Verdict: NEEDS-PATCH
Finding: ECE definition lacks a minimum sample threshold for bin-wise accuracy; n_b=0 risks undefined accuracy defaulting to zero/NaN and deflating ECE.
Falsifier: a seed with n_b=0 in the top bin producing an undefined accuracy term.
