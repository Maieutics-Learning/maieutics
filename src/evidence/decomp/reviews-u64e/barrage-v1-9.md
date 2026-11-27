# U64e barrage v1.0 reply R9 (verbatim, 2026-11-27)

1. **Verdict**: NEEDS-PATCH.
2. **Rival Mechanism**: *Stochastic Drift*. If the "surprise spike" merely correlates with high-variance noise in the qk-count distribution, `surBlind` acts as a randomized restart. In a narrow-margin environment, a random candidate pick (weight-blind) may hit the target by pure chance more effectively than the "informed" trigger, mimicking a detection signal.
3. **Killer Test**: *Isomorphic Noise Injection*. Replace the true boundary-induced surprise with a synthetic, non-boundary-aligned noise spike of identical magnitude/frequency. If `surBlind` triggers and recovers (accRec increases) despite the absence of a rule-switch, the mechanism is a noise-driven lottery, not a detection system.
4. **Design Check**: Not present. The current design lacks a "null-surprise" control arm to decouple trigger-sensitivity from actual recovery gain. Without this, you cannot distinguish between a "blind-hit" and a "detected-hit."
