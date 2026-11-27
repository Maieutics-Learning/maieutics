# Round-2 verbatims U64h v1.1 (B6–B10, sealed)

--- B6 ---
NEEDS-PATCH

1. **Symmetry Violation (W0)**: The "constant-m vector" check for zero fires across all three sensors (B2) is logically inconsistent with the "ORACLE-ONLY" verdict (which requires sensors-dead AND orTrig-alive). If W0 halts the run entirely as a "run abort," the system cannot reach the verdict state required to classify a dead-sensor/live-oracle event.

2. **Sampling Conflict**: A refractory period of 20 combined with a cap of 6 and K=10 blind is mathematically claustrophobic for a 21-wide window requiring ≥2/3 hits. The burst-derivation (B1) claims 1–2 slots post-switch evidence, but the refractory period effectively wipes the window of the very evidence needed to trigger the guard, rendering the "measured burst" unobservable.

--- B7 ---
NEEDS-PATCH

1. **W0 Contradiction**: (B2) asserts W0 as a "constant-m vector" requiring zero fires across three sensors to avoid HALT, yet (B3) classifies W0 halts as "run abort, never verdicts." If W0 is a prerequisite check for the battery, a HALT here prevents the "verdict field" from ever being the enforcement mechanism, creating a deadlock between the "run abort" state and the required verdict output.

2. **D-Grade Logic Gap**: The 7 full vs 33 partial diagnostic is described as "honest tracking or decoration," but the premise specifies "D-graded never gates." If D-graded results cannot trigger gates, the "honest tracking" of these diagnostics is functionally decorative, as they lack a defined path to influence the verdict field.

**Auditors:**
MATH: 7/33 ratio is static; no arithmetic leak.
IMPL: Driver cannot resolve W0-HALT if the verdict field is the sole enforcement.
RIVAL: Contained-by-design.

--- B8 ---
NEEDS-PATCH

1. **Gate Logic Contradiction**: Design specifies "TWO-GATE" where Gate 1 is "trigger-logs" and Gate 2 is "accRec-only," yet the verdict-order sentence defines a linear sequence (PIN → HALT → floor → Gate 1 → Gate 2). If Gate 1 is a trigger-log and Gate 2 is a record, they are parallel diagnostic states, not sequential filters. A driver cannot implement a "verdict order" where a record-only gate (Gate 2) follows a trigger-log (Gate 1) if both are required for the final verdict field enforcement.

2. **Refractory/Cap Conflict**: With a refractory of 20 and a cap of 6, the system cannot sustain a burst sequence across the 20-read window if the cap is strictly enforced per-pass, potentially orphaned by the "trailing-4 doubling" logic which requires sequentiality that the refractory period may block.

--- B9 ---
NEEDS-PATCH

1. **Burn-in Contamination**: B0 burn-in (first 8 slots) for burst sensors cannot be isolated if the baseline is the source of noise/triggering. If the "baseline itself" is the source of noise/triggering, the B0 burn-in fails to establish a true zero, rendering the subsequent "minimal context" (B1) for min/max conditions mathematically unstable.

2. **Verdict Order Contradiction**: B3 defines a verdict-order sentence (PIN → HALT → floor → Gate 1 → Gate 2) but simultaneously states W0/burn-in halts are "run aborts, never verdicts." If a HALT is triggered during B0/W0, it cannot occupy a position in the verdict-order sentence without contradicting its status as a non-verdict abort. This creates a driver-level logic gap: is a HALT a terminal state (verdict) or a process failure (abort)?

--- B10 ---
NEEDS-PATCH

1. **Verdict-Order Contradiction**: (B3) mandates a sequence (PIN → HALT → floor → Gate 1 → Gate 2), yet explicitly states W0/burn-in halts are "run aborts, never verdicts." If a HALT is an abort and not a verdict, it cannot occupy a position in the verdict-order sentence. This creates a logical null in the enforcement chain.

2. **Measurement Paradox**: (B1) defines a measured burst as 1–2 slots post-switch, but simultaneously requires "8 dilutes per U64e measurement" to avoid diluting the guard. If the burst window is ≤ 2 slots, it is physically impossible to fit 8 dilutes within that window to satisfy the min/max-condition. The temporal resolution of the burst is too narrow to host the required dilution count.
