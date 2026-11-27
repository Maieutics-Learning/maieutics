# Premise artifact U64c v1.1 (frozen 2026-11-27; round-2 reviewers read THIS)

v1.0 premise (`premise-u64c-v1.0.md`) + round-1 rulings (2 findings → 3 filed additions;
details in `reviews-u64c/fresh-eyes-self-u64c-v1-barrage-results.md`).

v1.1 changes: (1) K-DERIVATION: E[slots to observe all 4 qk under uniform explore] =
4·H4 ≈ 8.33 (coupon-collector) → K=10 covers one full observation sweep per trigger +
margin. No sweep, no new trains. (2) DIAG-EXPLORE diagnostic (no quorum): detT−orT
margins (explore over reset) AND detT−det margins (filed det = reset-disabled control;
detT ≈ det ⇒ reset inert) on outcome+adapt, verdict-time only, interpretation filed.
(3) FP-DRIFT sentence: same-driver twins; cross-run drift ~1e-7 vs +0.03/+0.10 margins.

The ask (unchanged): IMPLEMENTABLE | NEEDS-PATCH + hardest test/falsifier, ≤150 words,
numbered. New-version rule: repeats of answered points (K-arbitrary, orT-redundancy,
FP-drift) without new substance are STALE — say what v1.1 missed or stand down.
