# Battery: U46-NOISE prereg v1.0 (3x IMPLEMENTABLE unanimous)
Reviewers: 3x sealed via root.generateText (labor only, never training signal).
R1: IMPLEMENTABLE, 4/4 HEALTH, no patches. R2: IMPLEMENTABLE, 4/4 HEALTH, no patches.
R3: IMPLEMENTABLE, 4/4 HEALTH, no patches.
Owner adjudication -> v1.0 STANDS, no pins (no v1.1 needed).
Execution (on fresh countersign): driver newai-selfu46-driver.js + Wave 0
(twins + score/noise-block determinism) + Wave 1 (9T) + Wave 2 (9E + verdict).

--- R1 ---
VERDICT: IMPLEMENTABLE
HEALTH: 4/4
H1: Arms (DET/RES/STOCH), twin-matched streams, and paired evals are fully specified.
H2: RNG alignment block (12 uniforms + 1 sample) ensures stream-parity across arms.
H3: Parameters (T=0.5, sigma=0.3) are fixed; no oracle or tuning loop present.
H4: Quorum 2/3 and 0.03 delta cover all terminal states (ADVANCE/DEAD/INCONCLUSIVE).

PATCHES: none

SELFSERVED: serves
Reason: Reviewer is a sealed labor-only agent with no stake in the outcome.

NOTE: The doses are reasonably mapped as first-order approximations. sigma=0.3 provides a non-trivial perturbation relative to the s x n range (0-4) to test stochastic resonance without drowning the signal. T=0.5 creates a plausible probabilistic spread for a 6-candidate slot. As noted in the "Owed" section, the lack of dose-tuning is a design choice for falsifiability, not a flaw, and does not block implementation.

--- R2 ---
VERDICT: IMPLEMENTABLE
HEALTH: 4/4
- H1: Arms (DET/RES/STOCH), twin-matched streams, and quorum bars are fully specified.
- H2: Stack 258d2f06 is pinned; RNG alignment via dummy-draws prevents stream drift.
- H3: Parameters are fixed (T=0.5, sigma=0.3); floor-guard prevents false positives.
- H4: Decision logic (ADVANCE/ADVANCE-PROT/DEAD/INCONCLUSIVE) is exhaustive and quorum-based.

PATCHES: none

SELFSERVED: serves
The design adheres to a strict "labor only" fresh-eyes review without requesting additional compute or altering the pinned stack.

NOTE: The doses map reasonably to the cited claims as a "first-pass" falsification. sigma=0.3 provides a moderate perturbation relative to the 0-4 score range to test stochastic resonance (Battaglini), while T=0.5 provides a non-trivial probabilistic selection (Rolls) without collapsing into pure uniform noise. These are fixed-dose probes rather than optimized curves, which is consistent with the "cheapest falsifiable slice" objective.

--- R3 ---
VERDICT: IMPLEMENTABLE
HEALTH: 4/4
H1: Arms (DET/RES/STOCH), streams, evals, and quorum bars are fully specified.
H2: Pinned stack and RNG-alignment (12+1 draw block) prevent stream drift.
H3: Fixed doses (T=0.5, sigma=0.3) and floor-guard prevent tuning/leak.
H4: All outcomes (ADVANCE, DEAD, INCONCLUSIVE) are mapped to quorum results.
PATCHES: none

SELFSERVED: serves
The implementation is a lean, fixed-dose probe that avoids the "tuning trap" by freezing parameters.

NOTE: The mapping to Battaglini (RES) and Rolls (STOCH) is fair as a first-order binary test: the dose of sigma=0.3 is reasonably scaled to the 0-4 range of s*n to provide sub-threshold "kick" without drowning the signal, and T=0.5 provides a standard probabilistic sampling curve. By fixing these and not tuning them, the experiment acknowledges it is testing the *existence* of a noise-benefit rather than searching for an *optimal* noise-peak, which correctly scopes the claims to the "owed U47+" roadmap.
