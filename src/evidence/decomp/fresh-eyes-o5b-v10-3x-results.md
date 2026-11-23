# Fresh-eyes battery — O5b v10 spec (3 sealed reviewers, verbatim; note R2 arrived as poetry, judged on substance)

## B1 (75 lines per position — ADOPTED, 100/100/100)
VERDICT: CONDITIONAL. Fix: Increase line depth to ≥ 150 per position or use a shared embedding layer to prevent catastrophic forgetting.
(a) Soundness: Bar is shaky; 75 lines is insufficient to capture the variance of a complex position, leading to underfitting.
(b) Confound: Sample efficiency; the model may optimize for the prefix split ratio rather than the underlying positional logic.

## B2 (ceiling statistics)
VERDICT: CONDITIONAL. Fix: Shift to a non-parametric test or a Bayesian credible interval. At 0.99, the Gaussian assumption for SE fails due to boundary effects; 7 SE is statistically significant but practically negligible.
(a) Bar Soundness: Weak; the proximity to 1.0 creates a skewed distribution where linear subtractions are misleading.
(b) Confound: Ceiling effect—variance shrinks as the mean approaches 1.0, artificially inflating the Z-score.

## B3 (teaching to the test — limit ADOPTED, O7 queued)
VERDICT: CONDITIONAL. Fix: Perform a cross-validation sweep using a separate, unseen perturbation set to decouple the specific jitter noise from the general unification signal.
(a) Bar Soundness: The logic holds; if the model only recovers on the 0.2-scored perturbation, it is overfitting to a specific noise-point rather than learning a robust invariance.
(b) Confound: Data leakage via the "identical draws"—the model may be memorizing the specific seed of the perturbation rather than generalizing the transformation.

## Adjudication (agent, filed as v10.1)
- ADOPT (B1): diet becomes 100 suffix + 100 prefix + 100 fwd (dose 300 fixed; fwd is the distortion anchor, 100 suffices for the watch).
- REJECT (B2): bar uses raw flip counts (10 flips), no Gaussian test anywhere — the objection targets machinery we don't use. Drop of 10/200 is practically meaningful.
- REJECT as gate, ADOPT as limit (B3): diet draws (drng 52200+seed) and eval draws (prng 54700+seed) are disjoint streams — no leakage; "identical draws" (eval == O4a lines) is intended (same test). True invariance needs a THIRD held-out format (query-middle) — queued as O7, not gating (prefix-recovery still answers "can the position be learned").
