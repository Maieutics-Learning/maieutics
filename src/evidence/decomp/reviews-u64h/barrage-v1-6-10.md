# Barrage verbatims U64h v1.0 (R6–R10, sealed)

--- R6 ---
NEEDS-PATCH

1. Quorum collapse: Gate-2 requires `+0.03@quorum` on `accRec` only, but the "thin" diagnostic (7 full vs 33 partial switches) fails to provide a statistically significant baseline for a quorum. With `detectRate 2/3` and a `FA cap` of 3, the narrow window of "full" switches is insufficient to distinguish a true signal from the `+0.0197 blind-drag` noise floor reported in U64e.

**Killer Test:** Force a "Full-Switch Only" run. If the verdict shifts to `INCONCLUSIVE` or `SENSOR-DEAD` despite `detectRate` passing, the quorum is a ghost of the noise floor. Fix: Expand diagnostic depth to $\ge$ 15 full switches or lower the `FA cap` to 1 to tighten the signal-to-noise ratio.

--- R7 ---
NEEDS-PATCH

1. **Weakness:** Burst-scale derivation. The claim that trailing-4 doubling/min-max rules can be derived from the U64e "1-2 slot jump" is mathematically fragile. If the 1-2 slot measurement is a stochastic artifact or noise-floor fluctuation rather than a linear scaling constant, the trailing-4 derivation is an unproven assumption (tuned), not a derived property.

**Killer Test:** Run a "Scale-Step" variance check. Apply the trailing-4 rules to a disjoint stream with a known 3-slot jump. If the derivation is authentic, the rule must hold; if the system fails to trigger or over-corrects, the scale was tuned to the U64e dataset, not derived from the physics of the burst.

--- R8 ---
NEEDS-PATCH

1. **Ambiguity in "trailing-4 doubling/min-max rules":** The premise specifies these rules apply to "per-pass burn-in" but fails to define the trigger for a "pass" or the specific sequence of the doubling/min-max operation. A driver cannot implement this without knowing if the operation is cumulative per seed or reset per arm, risking logic drift between the 80 re-evals.
**Killer Test:** Run a parity check between two independent driver implementations on a single seed; if the trailing-4 results diverge due to different "pass" interpretations, the rule is under-specified.

**Fix:** Explicitly define "pass" as [X] reads and specify the operation order (e.g., `min(max(val, floor), ceiling)`).

--- R9 ---
NEEDS-PATCH

1. **Weakness:** The "TWO-GATE" verdict logic is susceptible to a "Count-Inflation" rival mechanism. U64e's `RESET-VALUE 16/20` and `RAND 11/20` suggest a binary success threshold, but v1.0 fails to account for temporal clustering of "sensor-validity" triggers. If Gate 1 is satisfied by a burst of counts rather than distributed stability, the `accRec` requirement in Gate 2 becomes a trivial formality of volume, not a proof of sensor precision.

2. Killer Test: Run a "Jitter-Sieve" test. Shift the evaluation window by $\pm 1$ slot across the 20 seeds. If the verdict flips from `CLOSED-LOOP-WORKS` to `INCONCLUSIVE` despite the `mean FA` remaining $\le 3$, the design is counting coincident spikes rather than validating sensors. Fix: Require $\ge 15/20$ seeds to meet the threshold *independently* across disjoint time-slices.

--- R10 ---
NEEDS-PATCH

1. **Weakness:** The "Two-Gate" verdict is logically compromised by the `orTrig` (124) oracle control. While stated as a control, its inclusion in the 4-arm matrix allows a "positive control" signal to leak into the quorum read (`accRec`). Since the win condition requires Gate 1 AND Gate 2, but the verdict field allows `ORACLE-ONLY` as a terminal state, the system permits a "success" state based on the oracle without requiring the sensor-validity thresholds of Gate 1. This creates a firewall leak where the oracle can mask sensor failure.

**Killer Test:** Run a 20-seed batch with `senMax`, `senPick`, and `senMargin` hard-set to zero (Sensor-Dead) while keeping `orTrig` active. If the system returns any verdict other than `ORACLE-ONLY` or `SENSOR-DEAD` (specifically if it promotes to `CLOSED-LOOP-WORKS`), the Gate 1 enforcement is bypassed.
