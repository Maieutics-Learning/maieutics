# A2 seed map (2026-11-23; spec v1.2, N_OBS=20, B_REH=2, evals N=400 paired)

Resume order: verdict → prereg v1.2 → battery file → this map → CURRENT_TASK → CHATLOG → transcript tail.
Method: Adam lr5e-3, B=16, 3000st; init/data/target seed-only (twin-matched; only selRng arm-coded); eval testRng/targetRng/selRng seed-only (paired rand-vs-shuf). Optimizer Adam (driver G.Adam). Determinism from seeded rng; wallMs perf-only.
Bars: rand-gain FAIL 0/3; none-gain FAIL 0/3 (pivot fires); audit HOLD 2/3; shuffle HOLD 3/3 (pairing fix); floor HOLD 3/3.

| arm | seed | loss0 | lossN | wallMs | acc | gap | overlap | divCos |
|---|---|---|---|---|---|---|---|---|
| A2own | 0 | 5.049224 | 0.760893 | 151468 | 0.5 | 0.1778 | 0.009 | 0.999 |
| A2own | 1 | 4.976843 | 0.672155 | 157520 | 0.505 | 0.0501 | 0.01 | 0.9995 |
| A2own | 2 | 5.006928 | 0.75658 | 153852 | 0.505 | 0.1336 | 0.0172 | 0.9996 |
| A2rand | 0 | 5.037124 | 0.6636 | 154972 | 0.495 | -0.0003 | 0.0175 | 0.9993 |
| A2rand | 1 | 4.977047 | 0.700691 | 151785 | 0.525 | -0.004 | 0.018 | 0.9993 |
| A2rand | 2 | 5.00284 | 0.786338 | 84923 | 0.48 | -0.0072 | 0.0165 | 0.9994 |
| A2none | 0 | 4.200213 | 0.669001 | 114382 | 0.51 | -0.0378 (N/A, sel empty) | 0.0135 | 0.9994 |
| A2none | 1 | 4.14707 | 0.711869 | 114449 | 0.5125 | -0.0283 (N/A) | 0.0202 | 0.9995 |
| A2none | 2 | 4.172197 | 0.775156 | 113959 | 0.4675 | -0.0527 (N/A) | 0.02 | 0.9995 |
| A2oracle | 0 | 5.122526 | 2.708332 | 126450 | 0.495 | 0.1387 | 0.0332 | 0.998 |
| A2oracle | 1 | 5.047688 | 3.584658 | 125507 | 0.46 | -0.0297 | 0.0503 | 0.9996 |
| A2oracle | 2 | 5.058054 | 3.588481 | 125796 | 0.525 | -0.0345 | 0.0152 | 0.9994 |
| A2shuf | 0 | 5.034268 | 0.675301 | 124312 | 0.4875 | 0.0063 | 0.021 | 0.9981 |
| A2shuf | 1 | 4.983304 | 0.687566 | 125232 | 0.525 | 0.0056 | 0.0207 | 0.9995 |
| A2shuf | 2 | 5.002675 | 0.787873 | 124895 | 0.49 | 0.0001 | 0.014 | 0.9995 |

Derivations: own−rand gaps +0.005/−0.02/+0.025 (0/3); own−none −0.01/−0.0075/+0.0375 (0/3, none≥own 2/3); |shuf−rand| 0.0075/0/0.01 (3/3); enrich saturates under ties (threshold hits tie mass — descriptives only); rand-s2 wallMs 84923 is machine variance, not a claim.
