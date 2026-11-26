--- R1 ---
VERDICT: IMPLEMENTABLE
HEALTH: 4/4
PATCHES: none
SELFSERVED: serves; implements a strict-alignment "BOTH" arm using existing U46 RNG-block logic to test noise-stacking vs pure dice.
STACK-CHECK: Yes; BOTH composes via u46AlignedDraws (12-float Gaussian block) $\to$ u43ScoreRow $\to$ softmax(T0.5) $\to$ u46Pick (1-float sample) using the pinned 258d2f06 stack.

--- R2 ---
VERDICT: IMPLEMENTABLE
HEALTH: 4/4
PATCHES: none
SELFSERVED: serves; logic is fully constrained by U46 verbatim requirements and fixed hyperparameters.
STACK-CHECK: Yes; `u47BothPick` is a compositional wrapper of `u46-RES` (Gaussian) and `u46-STOCH` (softmax) using existing `uSamp` and `Box-Muller` logic.

--- R3 ---
VERDICT: IMPLEMENTABLE
HEALTH: 4/4
PATCHES: none
SELFSERVED: serves; all parameters (T=0.5, $\sigma=0.3$, quorum 2/3) and the pinned stack 258d2f06 are fixed and non-tunable.
STACK-CHECK: Yes, BOTH composes via existing `u43ScoreRow` $\rightarrow$ `Gaussian(0,0.3)` $\rightarrow$ `softmax(T=0.5)` $\rightarrow$ `uSamp` using only provided dependencies.