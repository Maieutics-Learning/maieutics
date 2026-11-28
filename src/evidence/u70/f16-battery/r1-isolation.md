# F16 v1.0 barrage r1 — isolation (STANDS)

1. **Verdict: STANDS.**

The protocol successfully isolates the causal variables (ZREC, H128) while capturing non-linear interactions via the folded arm (B).

2. **Analysis:**
- **Isolation:** Arms A1 and A2 are strictly single-variable changes relative to A0 (F14-exact).
- **Symmetry:** Step-counts, epochs, and initialization sources are locked across all arms, preventing temporal or stochastic leakage.
- **Interaction:** Arm B captures synergy/interference without polluting the attribution of A1/A2, as the interaction readout is strictly descriptive and decoupled from the binaryH-Generalizes/Train-Repaired verdicts.
- **Scope:** Eval-only extras (unfamiliar/ablation) are correctly bounded to frozen weights, ensuring no "stealth training" occurs during diagnostic probes.

3. **Hardest Falsifier:**
**T10b (Step-Count Variance).** If any seed in any arm deviates from 200 epochs/1200 chunks, the isolation is void. A single "convergence-based" early stop in Arm B would smuggle a training-duration variable into the interaction analysis, invalidating the "composition" premise.
