# Fresh-eyes battery — O5a v10 spec (3 sealed reviewers, verbatim)

## A1 (padding dilution — ADOPTED as reporting)
VERDICT: CONDITIONAL (Implement a separate "effective sample size" metric per seed to decouple padding from true error rates).
(a) Bar soundness: Compromised; random padding artificially dilutes error density, masking the original 60/40 skew.
(b) Confound: Seed-specific harvest volume variance creates a reporting bias where "cleaner" seeds appear more frequent due to padding requirements.

## A2 (fresh-init confound)
VERDICT: CONDITIONAL (Demand same-trainSeed control).
(a) Soundness: Weak; the current reseed (0.80) is a statistical approximation, not a structural control for seed-dependent variance.
(b) Confound: The "fresh init" creates a latent variable where performance gains are indistinguishable from lucky initialization (mining), mirroring the B3 failure mode.

## A3 (soft pass)
VERDICT: CONDITIONAL. Fix: Allow a "Soft Pass" for s2 ≥ 0.90 if s0/s1 degradation is < 5% relative to baseline.
(a) Bar soundness: High; s2 is a critical threshold for stability, but binary gates ignore marginal utility.
(b) Confound: Variance in baseline s0/s1 across different test sets may mask true performance drops.

## Adjudication (agent, filed as v10.1)
- ADOPT (A1): ledger logs nHarvestD/nHarvestT per seed; verdict reports effective (unpadded) fractions openly. Padding is same-format (proportions preserved by construction) — reported, not hidden.
- REJECT (A2): single-init-per-arm is program convention; seed-match across arms is the control. s2-specific init luck already bounded by O4b reseed (0.80 ≈ 0.775). A same-trainSeed unmodified-diet control for all 3 seeds triples the bill for a confound already bounded — filed openly.
- REJECT as bar, ADOPT as reporting (A3): binary UNIFIED/SPLIT stands (pre-registered); exact magnitudes reported — numbers speak louder than soft gates.
