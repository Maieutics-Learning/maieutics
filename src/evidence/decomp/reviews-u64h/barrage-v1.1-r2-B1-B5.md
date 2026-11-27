# Round-2 verbatims U64h v1.1 (B1–B5, sealed)

--- B1 ---
NEEDS-PATCH

1. **Doubling Constant Paradox**: The premise mandates "trailing-4 doubling/min-max on per-pass burn-in" while simultaneously requiring a "flat-line W0 check" (constant-m vector) for the same sensors. A burn-in that scales/doubles by definition violates a zero-fire constant-m vector check. Both cannot be true for the same initialization window.

2. **Gate 2 Deadlock**: Gate 1 handles trigger-logs, but Gate 2 is "accRec-only." Since the verdict-order sentence (PIN → HALT → floor → Gate 1 → Gate 2) places Gate 2 last, and the design stipulates that W0/burn-in halts are "run aborts, never verdicts," there is no defined mechanism for an `accRec` (Gate 2) to trigger a final verdict without first passing through the "run abort" logic of the burn-in, creating a logical loop where the final gate is unreachable during a HALT state.

--- B2 ---
NEEDS-PATCH

1. **Burst-Derivation Contradiction**: B1 admits "≤2 cannot host the guard," yet the hit-window [b, b+20] is 21 slots wide. If the guard requires the full window to validate a burst, a "minimal context" of 1–2 slots is insufficient to anchor the 21-slot window without causing a boundary underflow or truncation error during the 4-slot measurement.

2. **W0 Vector Conflict**: B2 mandates a constant-m vector asserting zero fires for all three sensors to avoid HALT. However, the design specifies "trailing-4 doubling/min-max on per-pass burn-in." If the burn-in period (initialization) generates any non-zero signal to calibrate the floor (0.40), the W0 flat-line check will trigger a HALT before the first operational read, rendering the battery unrunnable.

--- B3 ---
NEEDS-PATCH

1. **Refractory/Cap Conflict**: A refractory-20 regime is physically incompatible with a cap-6 limit if the cap is intended to throttle burst frequency within the refractory window. If cap-6 is a hard limit per-window and refractory-20 is a lockout, any signal exceeding the cap before the refractory period expires creates a state contradiction (blocked vs. capped).

2. **Verdict-Order Logic**: The sequence (PIN → HALT → floor → Gate 1 → Gate 2) is logically flawed for a prereg battery. Running "floor" (a performance threshold) before Gate 1 (the trigger log) means the system evaluates success/failure before it has verified the trigger event, risking the processing of null-streams as "floor" failures.

RIVAL: A "leaky-bucket" rate limiter would explain U64e data while breaking the rigid 20-slot refractory/6-cap binary, as it allows bursty arrivals that the current frozen design would simply HALT.

--- B4 ---
NEEDS-PATCH

1. **Gate-1 DetectRate Paradox**: 2/3 detectRate with FA ≤ 3 is too lax for a "Gate" intended to filter noise before accRec. In a 20-read window, FA=3 is 15% noise; combined with a 66% detectRate, the "trigger-log" will be saturated with false positives, rendering Gate-1 a nominal pass-through rather than a selective filter.

2. **W0/Burn-in Contradiction**: B2 asserts a "flat-line W0 check" (zero fires across all three sensors), yet the design specifies a "trailing-4 doubling/min-max on per-pass burn-in." If W0 is a strict zero-vector halt, the burn-in logic for min/max calibration is unreachable or redundant, as any signal during burn-in would either be a "fire" (triggering W0 HALT) or a zero (making calibration moot).

--- B5 ---
NEEDS-PATCH

1. **Causal Loop / Initialization Failure**: The "flat-line W0 check" (B2) asserts zero fires across all three sensors to validate the vector, yet "burn-in halts are run aborts, never verdicts" (B3). If a W0 check fails (detects a fire), it triggers a HALT. However, the design requires a "trailing-4 doubling/min-max on per-pass burn-in." This creates a contradiction: the system cannot establish a baseline for the burn-in period if the W0 check immediately aborts the run upon any signal, preventing the very "burn-in" the design relies on to calibrate the floor (0.40).

2. **Gate 1 Logical Void**: Gate 1 is defined as "trigger-logs" while Gate 2 is "accRec-only." With no defined transition criteria or state-change logic between the two, Gate 1 functions as a passive logger rather than a gate, rendering the "TWO-GATE" architecture functionally a single-gate system.
