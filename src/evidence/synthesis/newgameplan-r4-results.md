# Round 4 raw — verify R3 fixes in v4 (V-MATH/V-IMPL/V-ALT)

## V-MATH

1. STATUS: FIXED
2. REASON: The two-half gate prevents bias-only passing by requiring a statistically significant delta (≥0.20) over the permuted control, decoupling marginal frequency from actual transmission.
3. RESIDUE: None.

---

## V-IMPL

1. STATUS: FIXED
2. REASON: The plan now specifies a separate-process scoring harness (no weight access), length-band constrained pools with discard rules, a 500-iteration budget with seed-based build-failure, and a programmatic two-sample test for falsification.
3. RESIDUE: none.

---

## V-ALT

1. STATUS: FIXED
2. REASON: P2 Control #5 explicitly requires frequency-matched fresh lines to sit at the permuted level, meaning any agreement above the permutation baseline on these lines triggers a "marginal-overfit" failure.
3. RESIDUE: none.

---

