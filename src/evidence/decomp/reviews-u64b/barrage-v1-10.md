# U64b barrage v1.0 scout 10

## Angle
ANGLE anti-tuning: authors know U64 numbers (edge 4/20, adapt 15/20, band 0.25-0.52). Name exactly which filed U64b choice smells most like tuning-by-proxy on those numbers, and give the concrete deodorization (blind derivation, wider margin, or pre-committed sensitivity analysis). If none, say NONE with one-line why each suspect is clean.

## Reply (verbatim)
VERDICT: IMPLEMENTABLE

1. TUNING-BY-PROXY: accRec floor (0.40) and edge (0.03). U64 reported max arm < 0.45 (11/20) and edge 4/20; authors tightened floor to 0.40 and kept 0.03 margin to recapture signal. DEODORIZATION: Pre-commit sensitivity analysis for any floor < 0.45.

HARDEST-TEST: Determinism twin check on W0 gate using shared seed G.makeRng(53100+seed*104729+55+armCode) across 20 seeds.
