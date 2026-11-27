# Red-team verbatims U64h v1.2 (K1–K5, sealed kill-shots)

--- K1 ---
KILL

1. The burst-sensor is untestable because any threshold calibrated to trigger on 1-2 slot jumps necessarily triggers on diet noise, collapsing the signal-to-noise ratio to $\approx 1$. Since the design relies on a "burst-derived" B0-relative baseline during a trailing-4 doubling phase, the noise floor of the live slots (which v1.2 admits are subject to transient decays) is indistinguishable from the targeted 1-2 slot jump signal. Therefore, the Gate 1 trigger-logs cannot differentiate a valid burst from stochastic noise, rendering the H1/H2 verdict mapping functionally random.

--- K2 ---
KILL

1. Gate 1 reads trigger-logs/filed rules; Gate 2 reads accRec/filed dice. Since these input sets are disjoint, no single arm failure can be uniquely attributed to the sensor (input) or the response (processing) without a reference from the opposing gate. Any failure in Gate 1 is ambiguous: it is either a sensor-read error of the trigger-log or a response-logic error in the rule-check. Because the two gates do not share a common input source or a synchronized heartbeat, an observer cannot distinguish between a localized sensor failure and a systemic response failure. Proof: Map failure state $\sigma$ to $\text{Input}_1$ and $\text{Input}_2$; since $\text{Input}_1 \cap \text{Input}_2 = \emptyset$, the error term $\epsilon$ is non-localizable to a single arm.

--- K3 ---
KILL

1. orTrig as positive control proves nothing — it shares the blind K response the sensors use, so LOOP-O MET is guaranteed regardless of sensor quality.

--- K4 ---
KILL

1. The H-tree is unreachable: SENSOR-DEAD requires !LOOP-O, but orTrig always delivers LOOP-O, so H1/H2/H3 never fire. Dead letter.

--- K5 ---
KILL

1. D-graded (7 full switches) diagnostic is insufficient for Reviewer Step 4 (activation tracks magnitude). Because the design relies on a "too thin" diagnostic footprint, it cannot quantitatively verify the required magnitude of activation tracks. The failure is an observability gap: 7 switches cannot map the gradient of activation across the specified range, rendering the magnitude check unverifiable.
