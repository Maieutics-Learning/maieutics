# U64e barrage v1.0 reply R5 (verbatim, 2026-11-27)

1. **Verdict:** NEEDS-PATCH.
2. **Critique:** Skipping E2 is a critical failure. E2 represents the ceiling; by omitting it, you mask the saturation point of your modulation strategy. If the oracle arm hits the ceiling in E1 but fails to maintain it in E2, the "improvement" is a local artifact of the E1 distribution, not a systemic gain. You cannot claim a dice + 0.03 margin without verifying the distance to the ceiling across both exam halves.
3. **Hardest Falsifier:** Compare `surBlind` (108) trigger-rate vs. `orReset` (107) true-boundary events. If `surBlind` triggers >= 6 times per pass but `blindHit` rate is < 20% across 20 seeds, the "surprise spike" is noise-driven, not signal-driven, rendering the closed-loop arm a random walk.
4. **Technical Gap:** K=10 blind-window is arbitrary. Without an E2-sweep, you lack the resolution to distinguish between "true recovery" and "stochastic overlap" with the rule-switch boundary.
