# U70-F1 re-close 1 (single-variable)

1. **STANDS.** The "disguised second variable" (anneal schedule) is deleted. `U70N_REPW` is now a static constant (0.1), ensuring the only delta between Wave-1 and v1.1 is the `U70N_FREEBITS` floor.
2. The shift to 0.05 is physically plausible; it sits below the observed raw-KL mean (0.11), allowing gradients to flow without inducing the zero-collapse that a higher floor (0.25) would trigger.
3. Causality remains intact: the paired-run design (same seeds/streams) isolates the floor constant as the sole independent variable. No other parameters were touched.