# U64e barrage v1.0 reply R8 (verbatim, 2026-11-27)

1. **Verdict:** NEEDS-PATCH.
2. **Critique:** The "closed-loop" trigger (surBlind) is critically underspecified. A "trailing-8 mean" against a "first-8 burn-in" is a naive T-test without variance normalization; it will trigger on stochastic noise in high-entropy regimes, not just rule-switches. Furthermore, the "blind window" (K=10) risks missing the exact boundary transition, potentially shifting the "hit" window beyond the filed [b-5, b+15] range, rendering the primary bar null.
3. **Leakage:** Oracle arm (orReset) uses true boundaries to reset qkCount; if the closed-loop arm's "blind window" logic shares any state or seed-sequence with the oracle-diagnostic bar, the independence is void.
4. **Hardest Falsifier:** The "Blind-Drag" Test. If `detectRate` is high but `accRec` does not exceed the filed dice mean by +0.03, the system is merely reacting to noise-spikes, proving the trigger is not a proxy for actual rule-boundaries.
