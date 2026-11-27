# U70-F12 battery verbatim r5-test-strength.md (2026-11-27, sealed)

Angle: test-strength
Verdict: NEEDS-PATCH
Finding: E4 is a vacuous presence check; does not verify bin-sum integrity (N=sum n_b).
Falsifier: a row with calBins present but bins not summing to N.
