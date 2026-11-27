# U64e barrage v1.0 reply R2 (verbatim, 2026-11-27)

1. **Verdict**: **NEEDS-PATCH**.
2. **Critique**: The "ORACLE-ONLY" verdict is a leakage vulnerability. If `surBlind` (closed-loop) fails but `orReset` (oracle) succeeds, you are attributing success to a mechanism that doesn't exist in production. Smuggling a win via the oracle arm masks failure in surprise-detection logic.
3. **Technical Gap**: The "blind window" (K=10) is too short to decouple stochastic noise from actual rule-switch recovery. With a 2x surprise spike criterion, you risk high False Alarm rates (FA) that are superficially corrected by the blind window, creating a fake "hit" correlation.
4. **Hardest Falsifier**: **Cross-Boundary Noise Injection.** Introduce high-variance noise in the 8-step burn-in window. If `surBlind` triggers on noise and hits the target by chance during the K-10 window, your "closed-loop" win is a statistical artifact, not a functional detection.
