# Fresh-eyes battery — O3 v10 spec (3 sealed reviewers, verbatim)

## R1 (bar-height)
VERDICT: CONDITIONAL. Fix: Shift LIFT bar to +0.06 or tighten product-check to ≤ 0.02 to ensure O2a-mined isn't just absorbing the s2 headroom.

(a) No. With s2 at 0.655 and a ceiling of 0.85, a +0.03 lift is mathematically trivial if the oracle jump is the primary driver; the bar is too low to prove a structural "ceiling move."

(b) Confound: Oracle-induced inflation. The lift may reflect the O2a-mined oracle's precision rather than an actual improvement in the retriever's capacity to surface relevant tokens.

## R2 (leakage)
VERDICT: FAIL. The harvest-set is a proxy for the test-set. Using the same generator/distribution for training (mined add) and evaluation (test lines) constitutes data leakage; the model is memorizing distribution-specific noise rather than generalizing.

(a) No. With a ceiling of 0.85 and T7 s2 at 0.655, the +0.03 bar is too lenient. The headroom is 0.195; a +0.03 lift is statistically negligible noise.

(b) Overfitting to the specific generator's "wrong" patterns, inflating the oracle's perceived lift.

## R3 (format-overfit)
VERDICT: CONDITIONAL. Fix: Perform a "noisy-format" perturbation test on the O2a-mined add; if LIFT drops >0.02, mark as OVERFIT.

(a) Yes. With s0/s1 at 0.85, +0.03 is the minimum meaningful delta to prove the O2a-mined add actually pushes the ceiling rather than filling T7's s2 headroom.

(b) Confound: The oracle-format bias in the mined add may act as a "shortcut" for the retriever, inflating the composed score without improving general retrieval robustness.

## Adjudication (agent, filed as v10.1)
- ADOPT in part (R1): keep +0.03 floor (a floor, not the claim) + add BEST-SEED-CEILING descriptive: max composed across seeds vs prior best single 0.85. The "ceiling moved" claim rests on reaching ~0.9, reported as magnitude regardless of bar.
- REJECT (R2 FAIL): "same generator = leak" would retroactively void all 35+ program units (every diet and every test share the generator; held-out = disjoint rng streams, the program-wide convention). Harvest rng (53700) and test rng (52500) are disjoint draws. Filed openly with precedent cited.
- REJECT as gate, QUEUE as O4 (R3): noisy-format perturbation is a real question (DL's territory) but out of O3's scope (O3 = payoff measurement). Queued, not gating.
- R1b "oracle-induced inflation" is the product hypothesis restated, not a confound: composed SHOULD track retrieve×oracle; the product-check measures exactly that.
