--- R1 ---
VERDICT: IMPLEMENTABLE
HEALTH: 4/4
PATCHES: none
SELFSERVED: serves; design preserves RNG-alignment by drawing the 12+1 block across all arms regardless of gate-state, preventing stream-divergence.
GATE-CHECK: sound; M0==sigma is a principled constant, no-leak (scores only), and gate-rate diagnostic correctly distinguishes between "ineffective" and "vacuous" results.

--- R2 ---
VERDICT: IMPLEMENTABLE
HEALTH: 4/4
PATCHES: none
SELFSERVED: serves as a strict-margin filter for the U47 "BOTH" regime, eliminating tuning by tying $M_0$ to $\sigma$.
GATE-CHECK: Sound; $M_0 = \sigma$ prevents parameter-fishing, and GATE-RATE identifies if the result is a failure of the hypothesis or a vacuous test.

--- R3 ---
VERDICT: IMPLEMENTABLE
HEALTH: 4/4
PATCHES: none
SELFSERVED: serves as a rigorous "no-tuning" test of the resonance hypothesis by fixing $M_0 = \sigma$ and treating the gate as a binary switch rather than a tunable parameter.
GATE-CHECK: Sound; it tests if smudge rescues weak signals without degrading strong ones (via the margin gate), using a fixed constant ($M_0=0.3$) to avoid tuning-traps, with the gate-rate diagnostic providing the necessary context for failure (vacuous vs. failed).