# U64e round-2 reply r2-RIVAL (verbatim, 2026-11-27)

1. **Verdict: NEEDS-PATCH**.
2. **Rival Mechanism: Temporal Coherence/Aliasing**. A surBlind pass can be spoofed by high-frequency oscillations in the input stream that align with the sampling rate of the closed-loop bar, creating an illusory "stable" signal (aliasing) rather than true functional recovery. This mimics a "win" without requiring neuromodulatory or plastic shifts.
3. **Killer Test: Jitter-Sample**. Introduce stochastic temporal jitter ( +- 5--10% offset) to the sampling clock of the surBlind bar. If the "win" is an alias, the signal collapses; if real, the pass persists.
4. **v1.1 Status**: Not contained. v1.1 addresses trigger conditions (trailing-8) and randomization of seeds (randBlind), but assumes a fixed, synchronous sampling interval. It lacks a temporal-variance control to decouple signal frequency from sampling frequency.
