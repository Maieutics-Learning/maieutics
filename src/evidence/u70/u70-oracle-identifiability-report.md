# U70-CTX oracle identifiability report (2026-11-27; descriptive, no bars, no verdict)

Spec: `u70-task-spec.md` v1.0 (T=300, 20 seeds, p_sw=0.02 dwell≥25, rho ∈
{0.55,0.75,0.95} p_rho=0.03, mask eps=0.10, 80/20 contingencies, cue-follow
policy). Driver: `u70-oracle.js` (frozen post-run; sha256 in JSON). Ledger:
`d-u70-oracle-identifiability.json` (pooled + 20 per-seed rows). 85 switches
total (dwell resampling brought the realized rate to ~1.4%).

## Pooled (20 seeds × 300 trials)
- Context accuracy 0.9498 — context IS identifiable from observations. Per the
  directive (§B): a neural model MAY be penalized for failing this.
- Calibration ECE 0.0614 (10-bin) — posterior means what it says.
- Detection delay median 2, mean 2.82 trials (P(true)≥0.75); 1 censored / 85.
- False alarms 0.70 / 100 trials (P(wrong)≥0.75 outside 10-trial grace).
- Reliability: accuracy 0.6603, MAE 0.0951 — separately estimable but noisier
  than context, as designed (separable factors, different difficulty).
  Prereg implication: set looser gates on rho than on context.
- Ambiguity (masked trials) 0.9407; misleading-cue trials 0.8960; low-rho
  (0.55) trials 0.8742 — competence holds where cues are absent, wrong, or
  near-chance. Recovery works.
- Functional-use demo: posterior-guided action 0.9498 vs cue-following 0.7470
  (+0.20). This gap is the "why representation matters" number the future
  neural model must close toward — and the ablation/causality tests must
  target (shuffled/frozen-context controls in the prereg).

## Answers to directive §D (oracle scope only)
Accuracy ✓ 0.95; calibration ✓ 0.06; delay ✓ med 2; FA ✓ 0.7/100;
persistence ✓ (masked 0.94 — belief survives cue absence); ambiguity ✓;
misleading-recovery ✓ 0.90; held-out-combo analog ✓ (low-rho 0.87).
Ablations (recurrent/latent/rho-head) and causal-use tests belong to the
NEURAL phase — named here so no red need flag them.

## What this licenses
The oracle ceiling is high on context (0.95), moderate on reliability (0.66).
A neural RSSM-style model has headroom to claim — and no identifiability
alibi if it fails context. Next deliverables in order: causal diagram, prereg
proposal with explicit gates (context tight, rho loose, delay/FA filed from
these numbers), minimal arch proposal. Neural execution needs proposal +
review + countersign. U60 label stays with the dead substrate family; this
track is U70.
