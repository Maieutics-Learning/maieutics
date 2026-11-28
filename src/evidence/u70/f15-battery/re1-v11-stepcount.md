# F15 re-close re1 — step-count (verbatim, 2026-11-28)

Angle: step-count T9(d): does asserting 1200 chunk-updates per seed enforce identical-steps, what evasion survives

**Verdict: NEEDS-PATCH**

1. **T9(d) Ambiguity:** Asserting "1200 chunk-updates" is insufficient. If the 8-trajectory round-robin introduces different gradient accumulation or weight-update frequencies compared to the 200-epoch single-path baseline, the "identical total steps" claim is a category error. You are equating *iterations* with *updates*.
2. **Evasion:** The "hidden reset each epoch" gloss fails to address if the 8-trajectory interleaving introduces implicit temporal correlations or prevents the model from overfitting to a single path's specific noise profile.
3. **Blocking Factor:** Without a formal mapping of `[Seed x Epoch]` $\rightarrow$ `[Global Step]`, you cannot prove isolation. If the update-to-data ratio changes, the "distribution effect" is confounded by optimization dynamics.

**Requirement:** Provide a step-by-step trace of one seed's update cycle vs. the F14 baseline to prove $\Delta \text{steps} = 0$.
