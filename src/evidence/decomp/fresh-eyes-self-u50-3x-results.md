--- R1 ---
VERDICT: IMPLEMENTABLE
HEALTH: 4/4
PATCHES: none
SELFSERVED: serves as a closed-loop validation of the "non-stationarity" hypothesis using fixed-dose arms (DET/STOCH/RES) against a rotating-menu diet.
DRIFT-CHECK: Fair; the hard boundary of quarter-rotations creates immediate "staleness" in the qkCount, forcing a test of the mechanism's agility (ADAPT-RATE) rather than just steady-state convergence.

--- R2 ---
VERDICT: IMPLEMENTABLE
HEALTH: 4/4
PATCHES: none
SELFSERVED: serves; validates "last refuge" of blur (RES sigma 0.3) by testing against a non-stationary diet using fixed-dose arms and a no-leak diagnostic (ADAPT-RATE).
DRIFT-CHECK: Fair; by keeping qkCount cumulative while rotating the "hot set," it creates a genuine staleness trap for DET/STOCH that only a noise-driven explorer (RES) can efficiently bypass.

--- R3 ---
VERDICT: IMPLEMENTABLE
HEALTH: 4/4
PATCHES: none
SELFSERVED: serves as a clean-room execution of U50-DRIFT (no GPU/deps, pinned stack, locked doses).
DRIFT-CHECK: Fair; the combination of staleness-by-construction (boundary resets) and the ADAPT-RATE diagnostic ensures a win is attributed to agility/exploration rather than mere stochastic noise.