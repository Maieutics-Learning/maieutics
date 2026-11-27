# U64e round-2 reply r2-MATH (verbatim, 2026-11-27)

1. **Verdict: NEEDS-PATCH.**
2. **Technical Critique:** The joint bound of 0.041 is mathematically fragile. By introducing the "TEETH" demotion rule for randBlind, you've created a conditional dependency between the control arm and the primary bar (surBlind). If randBlind is demoted to TRIGGER-INSENSITIVE based on a joint clear, the "two win-paths" logic collapses into a single-path dependency for the 0.041 bound to hold. Furthermore, the detectRate denominator is unstable across three boundaries at n=20; the sample size is insufficient to prevent variance from swallowing the 0.03 offset.
3. **Hardest Falsifier:** Execute a "Blind-Drag" stress test: Force a p=0.45 (just above floor) across all 20 seeds. If the detectRate fails to distinguish the 0.03 offset from stochastic noise at n=20, the 15/20 quorum is a coin-flip, rendering the 0.041 joint bound a theoretical hallucination.
