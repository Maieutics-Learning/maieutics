=== R6 [scope discipline: any second variable sm] ===
1. VERDICT: STANDS.

2. CRITIQUE: Scope is strictly locked to the forward-pass discrete latent fix. No leakage of hyperparameters (LR/Optimizer), architectural scale, or data-shuffling logic into the F11 track. The "two lines" constraint prevents the smuggling of secondary variables. By fixing the forward latent without altering the pre-existing ST surrogate in the backward pass, the experiment isolates the specific failure mode (posterior leak) without introducing confounding gradient dynamics.

3. HARD TEST: **Symmetry Breakdown.** Run a seed where the original "leaky" forward pass produced a high-confidence incorrect state. If the F11 repair shows an absolute performance drop (REGRESSED) while the paired-comparison remains stable, it proves the "win" was indeed a leak-driven artifact and not a learned feature.
