# R2 — paired mapping (F13 v1.0 barrage, 2026-11-27)

VERDICT: NEEDS-PATCH

1. **Hardest Test:** A permutation test where training seeds are randomly shuffled across the 0..39 range to see if the $s \to 20+s$ pairing yields any statistical significance over random pairing.
2. **Reason:** 1:1 pairing ($s_0 \to s_{20}$) risks smuggling a "seed-correlation" bias; if the underlying PRNG or trajectory generator exhibits periodicity or linear correlation between $s$ and $s+20$, the model is simply exploiting a seed-pattern rather than generalizing context.
