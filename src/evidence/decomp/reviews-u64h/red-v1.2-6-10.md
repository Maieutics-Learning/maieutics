# Red-team verbatims U64h v1.2 (K6–K10, sealed kill-shots)

--- K6 ---
KILL
1. The senMargin collapse rule is inverted: post-switch competition RAISES top1-top2 gaps (winner-take-all), meaning the sensor fires on calm and sleeps on switches. This falsifies the "SENSOR-VALID" rule by triggering on the absence of the signal it is designed to detect.

--- K7 ---
KILL

1. The "TWO-GATE" comparison is logically void. Because E1-only reads use per-arm disjoint streams (53700+armCode), Gate-1 (trigger-logs/rules) and Gate-2 (accRec/dice) are processing non-intersecting data sets. Since sensors and control are seeing different exams across the arms, any cross-gate comparison is apples-to-oranges, invalidating the shared-trunk assumption required for a valid verdict.

--- K8 ---
KILL

1. The claim that burn-in contamination is "conservative" and "decays 1-2 slots" is physically inconsistent with the "trailing-4 doubling/min-max" logic. If B0 absorbs the transient, the resulting bias in slots 0-7 (post-switch) creates a systematic sensor offset. Because the burn-in is B0-relative and the bars are constructed based on these values, the "unpassable" nature of the bars is not a safeguard but a systemic failure: the sensors are calibrated to a biased baseline. A single run comparing the B0-relative baseline against a true-zero reference would prove the sensors are biased, rendering the "conservative" decay claim false and the entire Gate 1 trigger-log mechanism invalid.

--- K9 ---
KILL

1. K=10 blind windows: A firing sensor blinds itself for 10 slots, suppressing the signal required to confirm tracking. If the signal is suppressed, the sensor cannot verify the "hit" or trigger the specific "blind" state transition, creating a causal paradox where the evidence of the trigger is deleted by the trigger itself. A run with a high-density burst (hits < 10 slots apart) would prove this by showing the sensor fails to record the blind window because the signal was suppressed before the "blind" state could be committed to the log.

--- K10 ---
KILL

1. Gen-2 accounting is fiction. U64h cites U64e's F4 to justify the generational counter, but U64e's verdict line lacks a generation counter. Consequently, W0's assertion that 2<=6 is an assertion against nothing filed. The enforcement mechanism is decoupled from the actual verdict record.
