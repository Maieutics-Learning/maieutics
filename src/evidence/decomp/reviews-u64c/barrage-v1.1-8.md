# U64c barrage v1.1 scout 8

## Brief
ANGLE rival-2: ONE rival for a RESP-EDGE pass that is not 'response works' (e.g. detT's 3x10 explore slots inject 30 extra uniform draws per run ~ fresh data that dice's T=0.5 softmax never quite matches — a data-augmentation artifact, not a response effect). Killer test + contained-or-patch.

## Reply (verbatim)
VERDICT: IMPLEMENTABLE

1. Logic is sound. $K=10$ is physically plausible given the coupon-collector expectation ($H_4 \approx 2.08 \times 4 \approx 8.33$) to ensure state-space coverage post-reset. $\text{FP-DRIFT} \approx 10^{-7}$ confirms stability. $15/20$ quorum is robust against stochastic noise. The "rival-2" angle identifies a valid data-augmentation bias: $\text{detT}$'s forced uniform exploration may artificially inflate $\text{RESP-EDGE}$ via sample diversity rather than policy superiority. This is mitigated by the $\text{DIAG-EXPLORE}$ margins.

HARDEST-TEST: Compare $\text{detT}$ vs. a control arm with $K=10$ uniform draws but *without* the boundary reset; if $\text{RESP-EDGE}$ persists, the effect is the reset, not the augmentation.
