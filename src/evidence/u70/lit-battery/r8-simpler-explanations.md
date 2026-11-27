# Lit-lessons scout 8 (simpler-explanations)

1. Overclaimed: B2 (Remapping as hidden-state inference). The "lesson" that U70's switch-detection metrics (delay, FA, grace) are the "correct operationalization" of hidden-state inference is an overreach. B2 provides a theoretical framework for *what* is happening, but it does not validate the *metrics* used to measure it.

2. Kill-shot: The "Grace + FA separation" is an arbitrary experimental design choice for U70, not a derived property of the Sanders et al. (2020) model.

3. Verifying check: Compare the "10-trial grace" in the U70 spec against the latent-state transition dynamics in B2. B2 describes the *mechanism* of inference; it does not prescribe a specific trial-count window for "correct" detection. If the grace period is changed to 5 or 15 trials, the B2 logic remains unchanged, proving the metric is an implementation detail, not a bio-fidelity requirement.