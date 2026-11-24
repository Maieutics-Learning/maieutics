# Fresh-eyes battery: self F-check+M3+R3 delta-prereg (3x sealed, parallel via root.generateText)

Goal line carried in every prompt.

## R1 — IMPLEMENTABLE (verbatim)
VERDICT: IMPLEMENTABLE

1. F-check Validity: Valid. Freezing trunk isolates sensor; skipping hv2 retest sound (sensor dead => gate useless regardless). 2. Bias: 3T+3E vs filed W6 baselines sufficient (testing presence of signal, binary gap). 3. R3 Logic: ignorance-gate (entropy+beta) believable for trust-internal-vs-notebook; M3 carry check prevents misattribution.

## R2 — IMPLEMENTABLE (verbatim)
VERDICT: IMPLEMENTABLE

1. M3 Soundness: High. Reusing episodes twin-matched cNew vs zero isolates carry; eval-only proves whether existing compose head can use clean carry. 2. R3 Ceiling: If POISON, R3 capped by compose head; if INNOCENT, capped by gate retrieval. 3. Flow F-check->M3->R3 sound: sensor exists? pipe clogged? automate valve? All frozen-base.

## R3 — IMPLEMENTABLE (verbatim)
VERDICT: IMPLEMENTABLE

1. Chain sound: F-check sensor, M3 carry variable, R3 ignorance-gate; separates capability (M2-nb) from judgment (R3 gate). 2. Controls: r3-ctl-flat (g=0) critical to attribute adaptY gain to gating. 3. Efficiency: frozen trunk+notebook, only critic/gate (~53 params); M3 eval-only saves compute. Note: ensure entropy normalization (H/log4) strictly in driver.

## Adjudication: 3 IMPLEMENTABLE → v1.0 STANDS (no amendment)
- Entropy normalization already pinned (H/log4) — driver must apply exactly (R3 note). Skipping hv2 retest stands (dead 9/9). Episode-reuse pairing stands (twin-matched). Staging stands: Stage 1 F-check + M3 now; Stage 2 R3 iff SENSOR-HOLDS, else BLOCKED openly.
