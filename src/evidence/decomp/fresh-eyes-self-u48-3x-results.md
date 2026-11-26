--- R1 ---
VERDICT: IMPLEMENTABLE
HEALTH: 4/4
PATCHES: none
SELFSERVED: serves; the design uses a fixed-dose percentage blur tied to existing score-row distributions, preventing tuning-trap iterations.
PCT-CHECK: sound; COLLAPSE-RATE diagnostic correctly identifies vacuous slots without introducing a biasing epsilon/floor.

--- R2 ---
VERDICT: IMPLEMENTABLE
HEALTH: 4/4
PATCHES: none
SELFSERVED: Serves as a rigorous control for scale-invariance by substituting a fixed absolute blur for a relative percentage blur.
PCT-CHECK: Sound. No floor is required because the COLLAPSE-RATE diagnostic correctly identifies vacuous slots without biasing the result via an arbitrary epsilon.

--- R3 ---
VERDICT: IMPLEMENTABLE
HEALTH: 4/4
PATCHES: none
SELFSERVED: serves as a rigorous scale-invariant test of noise-injection vs. pure sampling by tying noise amplitude to the existing score distribution.
PCT-CHECK: Sound; no floor is required because COLLAPSE-RATE diagnostic captures the "vacuous" regions, preventing a false-negative from being misread as a failure of the percentage-stacking theory.