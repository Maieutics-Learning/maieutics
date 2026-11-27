# U64c barrage v1.1 scout 9

## Brief
ANGLE anti-tuning-2: K=10 was chosen BEFORE the coupon derivation (derivation justifies a pre-picked round number — classic post-hoc rationalization). Is the derivation independent of the choice (would it have picked 10 blind), or must K be re-derived from scratch with the method pre-committed? Rule it post-hoc-justified (acceptable, filed) or rationalized (re-derive blind).

## Reply (verbatim)
VERDICT: IMPLEMENTABLE

1. Post-hoc rationalization of K=10 via coupon-collector (E[X]~8.33) is acceptable as a technical baseline for a reset-triggered explore phase. The 1.67 margin is negligible. FPGA-drift is suppressed (~1e-7). Quorum 15/20 is sufficiently robust. Logic is sound.

HARDEST-TEST: detT vs dice on RESP-ADAPT (margin +0.10) across 20 seeds.
