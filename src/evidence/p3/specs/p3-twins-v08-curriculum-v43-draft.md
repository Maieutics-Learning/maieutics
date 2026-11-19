# Twins v0.8 CURRICULUM v4.3 (2026-11-19) — COUNTERSIGNED ("Signed!"), run authorized

Inherits v4.2 substance (single trunk/brain, mouth 19 + ear 4, tutor ear self-distill head-only,
bundle-only provenance, IF/THEN bars, EAR-BAR 0.80 + Wilson + delta, 3 nulls with teeth, W tripwire).
ONE change: the student recipe. Tutor side untouched — filed v4.2 bundles reused as-is.

## What do I want to find out
ExpA proved 200 steps fixes overfit (claims 3/3+3/3); ExpB proved replay fixes forgetting
(retention +0.6 -> +0.07, ear-c1 held 0.81). Each alone leaves the other wound open.
Combined: does 200-step + replay give claims + retention + ear all at once? And do the nulls
still have teeth at 200 steps (a passing student is exactly when nulls matter)?

## Recipe (student only; same inits RNG 9850+pair for comparability)
- S1: trainStudentOnBundle(c1, 200 steps, seed 9903+pair, alpha 0.5, lambdaEar 0.2).
- S2: replay mix 200 steps (seed 9914+pair): per batch slot 50/50 c1/c2 lines, softs travel
  with their lines. Same student continued.
- All v4.2 bars apply unchanged (chance floors, deltas, EAR-BAR, Wilson per-pair, dialect
  descriptive, quorum 2/3, W). nUniq already filed for reused bundles.

## Nulls (full retrains at 200 steps, fresh students same inits, same combined recipe shape)
- (a) shuffled-ear: real bundles with within-line position-shuffled ear targets (lengths intact, marginals kept, alignment destroyed).
  Expect mouth claims PASS (mouth softs intact) + ear FAIL — the dissociation that proves teeth.
  Demote rule: ear >= 0.80 or (real-ear minus shuffled-ear) < 0.10 -> EAR-BAR void.
- (b) blind-tutor: blind mouth (fresh init 9860+pair) + blind ear generate c1/c2 lines
  (seeds 9891/9892+pair, nUniq==100 else ABORT) with blind logits/ear; student trains on blind
  bundle only. Expect all bars FAIL. Demote rule: blind student meets any CLAIM bar -> claim void.
- (c) synthetic recipe-null: random-content lines (same length distribution as c1/c2, seed
  9895/9896+pair), mouth hard-CE-only 200 steps (NO tutor signal), ear untrained (random init).
  Expect mouth ~S0 (FAIL) + ear ~0.25. Demote rule: synthetic meets CLAIM bar -> bar vacuous.

## Approval
COUNTERSIGNED 2026-11-19 (user "Signed!"). Any content change = v4.4. No tutor compute (reuse).
