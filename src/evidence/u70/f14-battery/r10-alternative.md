# F14 battery r10 (alternative: one rival mechanism for any F14 outcome plus cheapest killer test)

1. **Verdict**: NEEDS-PATCH.
2. **Hardest Test/Falsifier**: **Cross-Seed Distributional Shift (CSS).**
Since F14 relies on "F12-exact" training but changes the evaluation metric to a "TRUE" shuffle, the only way to prove the result is an inherent property of the latent state (and not a fluke of the 20-seed sample) is to test the model on a completely disjoint set of seeds (e.g., seeds 40–60) using the TRUE metric. If the "TRUE gap" collapses or shifts significantly compared to the F12-exact training seeds, the "TRUE intervention" is not capturing a generalizable mechanism, but is instead overfitting to the specific noise of the F12/F13 seed-set.

3. **Rival Mechanism**: **Residual Posterior Leakage.** The model may not be using the "TRUE" shuffled latent, but instead leveraging a high-dimensional, non-linear correlation between the partial shuffle and the remaining posterior $q$, which survives the "TRUE" removal because the GRU's hidden state still contains traces of the original trajectory.
4. **Cheapest Killer Test**: **Zero-Shot Latent Ablation.** Replace the GRU hidden state at the evaluation point with a zero-vector. If the "TRUE gap" persists, the model is using an observation-based shortcut, not the latent state. If the gap vanishes, the "TRUE" result is still vulnerable to the Residual Posterior Leakage mentioned above.
