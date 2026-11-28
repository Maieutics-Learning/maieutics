# F16 v1.0 barrage r2 — interaction (STANDS)

1. **Verdict: STANDS.**

The "folded-arm firewall" is logically sound. By anchoring the verdict to absolute F14 bars and treating the B-arm interaction (synergy/interference) as strictly descriptive, you prevent "result leakage." The separate arms (A1, A2) are judged in isolation; the combined arm (B) is judged in isolation. The delta (B - A_n) is a metadata layer that cannot retroactively alter a pass/fail status.

2. **Hardest Falsifier:**
**Cross-Arm Variance Contamination.** Since you are using 20 seeds across 4 arms, the only way this fails is if the "descriptive" interaction is used to justify a *post-hoc* adjustment of the A1/A2 bars (e.g., "A1 failed, but since B showed synergy, A1 is actually a partial success").

**The Test:** A blind audit of the verdict assignments *before* the interaction table is generated. If the verdict for A1 changes after seeing the result of B, the firewall is breached.
