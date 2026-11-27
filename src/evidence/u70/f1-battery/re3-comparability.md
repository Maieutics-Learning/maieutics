# U70-F1 re-close 3 (comparability)

1. **STANDS**. 

2. The "hidden variable" (anneal schedule) is fully excised; `U70N_REPW` is now a static constant (0.1). This restores the integrity of the single-variable comparison.

3. Comparability is preserved via the paired-seed design. By using the same 20 seeds/inits as Wave-1, the delta in `U70N_FREEBITS` (0.25 $\rightarrow$ 0.05) is the only source of variance.

4. The lower floor (0.05) correctly accommodates the observed raw-KL scale (0.11), ensuring gradients flow while maintaining the zero-collapse guard. This allows for a valid "F1-PERSISTS" interpretation without conflating a dead gradient with a design failure.