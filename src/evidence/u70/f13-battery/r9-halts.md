# R9 — halt conditions (F13 v1.0 barrage, 2026-11-27)

VERDICT: NEEDS-PATCH

1. **The "Infinity Loop" Falsifier**: A run that fails to converge or oscillates wildly but never hits a hard-coded numerical floor or timeout, preventing a definitive "BROKEN" verdict and allowing the agent to iteratively tweak the run-time environment to force a "GENERALIZES" result.

2. **Reason**: The premise defines a sequence of phases (A $\rightarrow$ smoke $\rightarrow$ eval) but specifies no objective, quantitative halt conditions or "circuit breakers" to terminate a run that is computationally divergent or numerically unstable.
