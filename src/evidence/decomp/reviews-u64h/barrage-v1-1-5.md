# Barrage verbatims U64h v1.0 (R1–R5, sealed)

--- R1 ---
NEEDS-PATCH

1. **Smuggled Calibration via Trailing-4:** The "trailing-4 doubling/min-max" rules on burn-in are not principled thresholds; they are adaptive gains masking sensor instability. By scaling based on a 1–2 slot jump (U64e), you are calibrating the detector to the noise floor of the specific dataset rather than an absolute physical constant. If the "burst scale" is derived from the measured jump, the "threshold" is a moving target that guarantees a hit regardless of signal-to-noise ratio.

**Killer Test:** Run a "Flat-Line" control where input is constant-value noise. If the trailing-4 logic promotes the run to SENSOR-ONLY or CLOSED-LOOP-WORKS by adapting the scale to zero-delta noise, the threshold is a phantom and the verdict is a false positive.

--- R2 ---
NEEDS-PATCH

1. Gate 1 is a soft-filter, not a hard-stop. Because "reads trigger logs by definition," any signal processing at the `accRec` level (Gate 2) creates a log entry that mimics a "detectRate" event. If the ORACLE-ONLY state is reached, the system has already processed data; the "verdict field" enforcement is a post-hoc label, not a physical circuit break. A "leaky" sensor with a high False Alarm rate but a strong `accRec` signal can bypass the intended G1/G2 sequence, promoting a failure to a success via log-inflation.

Killer test: Force a `SENS-DEAD` state on all arms except `orTrig`, then verify if `accRec` increments trigger a `CLOSED-LOOP-WORKS` verdict despite the G1 failure.

--- R3 ---
NEEDS-PATCH

1. Sensor-set incoherence: senPick (122) is unimplementable on frozen weights. By definition, "choice-surprise" requires a dynamic probability shift or a live-weight gradient to measure "surprise" relative to a baseline. On frozen weights, the output distribution is static; any "surprise" is merely a fixed-value lookup from the filed det trunks. Without a live-weight delta or a comparative stream, senPick cannot distinguish between a genuine surprise trigger and a static high-entropy token.

Killer test: Run a parity check between senPick and a static hash of the frozen weights. If the "surprise" value is perfectly correlated with the static seed, senPick is a redundant proxy for the seed, not a sensor.

Fix: Replace senPick with a cross-entropy delta measured against a secondary, non-frozen reference model.

--- R4 ---
NEEDS-PATCH

1. **Control Leakage via Shared Trunks:** v1.0 specifies "shared filed det trunks" for all 4 arms. Because `orTrig` (the positive control) shares the same underlying deterministic stream as the sensors, any systematic bias in the stream-generation or the "trailing-4 doubling/min-max rules" will correlate the oracle's success with the sensors' performance. This invalidates the independence of the `ORACLE-ONLY` vs `CLOSED-LOOP-WORKS` verdicts; you aren't measuring sensor validity, you are measuring stream-consistency.

**Killer Test:** Run a "Zero-Sensor" trial using only the `orTrig` path on the shared trunks. If `orTrig` fails to hit its expected rate while the sensor-logic (using the same trunks) suggests a "pass," the shared trunk is corrupted. **Cheapest Fix:** Shift `orTrig` to a disjoint seed-set/stream.

--- R5 ---
NEEDS-PATCH

1. Verdict Gap: The "TWO-GATE" logic fails to account for the `LINE-HALT` and `HALT` states within the H-tree. If a seed triggers a halt during the burn-in or Gate 1 evaluation, there is no defined path to map a "Halt" event to a final verdict (e.g., does a `LINE-HALT` override `SENSOR-ONLY`?).

**Killer Test:** Force a `LINE-HALT` via the `orReset` m3 range (-0.40) during Gate 1 processing for 16/20 seeds; verify if the system defaults to `INCONCLUSIVE` or crashes due to a missing transition state in the verdict field.
