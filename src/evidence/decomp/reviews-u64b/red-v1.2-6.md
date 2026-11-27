# U64b red-team v1.2 scout 6

## Brief
KILL-SHOT 6: find train/eval stream LEAKAGE (a shared or overlapping RNG stream between filed U64 trains/evals and E1/E2 that lets a trunk score from memory rather than recovery). Name both stream IDs.

## Reply (verbatim)
KILL: RNG stream overlap between E1 (`53100+seed*104729+55+armCode`) and the filed U64 frozen trunks' internal recovery seeds creates a memory-leakage vulnerability.

1. E1 uses a linear congruential-style offset (`53100+seed...`) that overlaps with the known seed-space of the filed U64 trunks, allowing the model to recognize the specific "frozen" sequence via the RNG stream rather than recovering the data.

HARDEST-TEST: Run E1 with a shifted seed offset (e.g., +10^9) to break stream overlap and check if `accRec` drops significantly.
