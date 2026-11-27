=== R4 [verdict-rule gaming: can REPAIRED be met] ===
1. VERDICT: NEEDS-PATCH.

2. FALSIFIER: The "paired retrains" are conceptually void if the forward-pass repair (discrete latent) alters the loss landscape enough to trigger different local minima across the 20 seeds. If the "REPAIRED" verdict is reached via a distribution shift in convergence rather than a direct delta in probe accuracy, the "leak-size read" becomes an artifact of optimization variance, not a measurement of posterior leak. To prove the repair *matters*, you must demonstrate that the "filed wins" (F4/F10) are statistically impossible to replicate with the fixed code using the same seed-trajectories, regardless of convergence stability. Without a strict convergence-parity check, "REPAIRED" is just a lucky seed-drift.
