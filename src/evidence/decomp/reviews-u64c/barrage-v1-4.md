# U64c barrage v1.0 scout 4

## Angle
ANGLE orT-redundancy: filed orT ALREADY resets at true boundaries (adapt 0.94-1.0). detT = orT + 10 explore slots. What does detT measure that filed orT ledgers + filed dice ledgers don't already answer? If the answer is 'explore vs exploit post-reset', say what comparison isolates it (detT vs orT, which the prereg never bars) and file the missing bar or concede the arm redundant.

## Reply (verbatim)
VERDICT: NEEDS-PATCH

1. Logic is sound, but the evaluation is redundant. detT is functionally orT + 10 uniform slots. Since the "filed context" confirms orT already resets at true boundaries (adapt 0.94-1.0), detT merely tests if random exploration improves edge outcomes over the existing oracle. However, the prereg compares detT to *dice* (baseline), not *orT* (the actual functional equivalent). This hides whether the "10 slots" add value or if the result is just the baseline oracle effect. The "ANGLE" identifies a critical gap: without a detT vs orT bar, the arm is a redundant exercise in measuring a known oracle.

HARDEST-TEST: Verify if `detT.adapt` significantly outperforms `orT.adapt`. If $\Delta \approx 0$, detT is functionally identical to the existing oracle.
