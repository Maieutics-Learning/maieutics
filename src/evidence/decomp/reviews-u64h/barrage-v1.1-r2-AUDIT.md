# Round-2 staff audit verbatims U64h v1.1 (MATH / IMPL / RIVAL, sealed)

--- MATH ---
NEEDS-PATCH

1. **Arithmetic Collision**: Quorum is 15/20 (75%), but `detectRate` is 2/3 (~66.7%). If a seed triggers the `detectRate` threshold, it cannot mathematically satisfy the quorum requirement for a valid signal. This creates a dead-zone where signals are detected but cannot be validated.
2. **Implementation Paradox**: (B2) asserts a "constant-m vector" for zero-fires across three sensors to avoid HALT, yet the "TWO-GATE" design requires Gate 1 to trigger-log before Gate 2 can record accumulation. If W0 requires zero-fires to avoid a halt, the transition to Gate 1 trigger-logs is logically obstructed during the burn-in phase, rendering the sequence unrunnable.

RIVAL: A time-shifted drift in the shared-stream weights would simulate the `senPick` variance without requiring the filed policy-dependence, breaking the static-lookup assumption.

--- IMPL ---
NEEDS-PATCH

**Pseudocode:**
`for sensor in {121, 122, 123}:`
`  if (W0_flatline == False) HALT`
`  if (burnin_trailing4_doubling == True) trigger_log(Gate1)`
`  if (accRec_criteria == True) trigger_log(Gate2)`
`  if (hit_dist >= 2/3_windows) verdict = H1 || H2 || H3`
`  else if (val < 0.40) verdict = floor`

**Ambiguities:**
1. **Trigger-Logic Gap:** Premise defines "Gate 1 trigger-logs" and "Gate 2 accRec-only" but lacks the boolean logic mapping sensor readings to these gates.
2. **H-Hierarchy:** H1>H2>H3 is noted, but the mathematical threshold for transitioning between these H-levels is undefined.

**Findings:**
1. **Unrunnable:** The "trailing-4 doubling/min-max" is cited for burn-in, but the specific arithmetic for the doubling check is missing, making the trigger non-deterministic for a driver.
2. **Contradiction:** `orTrig 124` is a "positive control," yet the `W0` check mandates zero fires for *all three* sensors; it is unclear if 124 is exempt from the `W0` HALT.

--- RIVAL ---
NEEDS-PATCH

1. **U64e Rival Mechanism: Window-Slippage.** The design fails to distinguish a genuine signal from a "sliding" burst artifact where a high-frequency noise spike drifts across the 21-wide window boundary. With ±1 jitter allowed and a 2/3 distribution requirement, a single high-amplitude cluster shifting by 1-2 slots can trigger a false positive without being "contained" by the burn-in or the 4-slot burst derivation, as the minimal context (8 dilutes) is insufficient to decouple phase-shift noise from true recurrence.

2. **Implementation Gap: Gate 1/2 Circularity.** The "Gate 1 trigger-logs; Gate 2 accRec-only" logic is contradictory if the verdict-order sentence (PIN → HALT → floor → Gate 1 → Gate 2) is strictly enforced. A "Gate 2" verdict is unreachable if the trigger-log (Gate 1) is a prerequisite for the accumulation record, yet the design treats them as sequential verdict fields. This creates a state-machine deadlock during driver execution.
