# U64b barrage v1.0 scout 8

## Angle
ANGLE logging: user ordered LOG EVERYTHING. Does the ledger spec satisfy it? Name exactly what is missing (eval-side scr/orc heads? per-window dice comparisons? curves? driver version pin? novelHot derivation inputs?). List omissions or say COMPLETE.

## Reply (verbatim)
VERDICT: IMPLEMENTABLE

1. LEDGER INCOMPLETE. Missing: driver version pin, eval-side scr/orc heads, per-window dice comparisons, and raw novelHot derivation inputs.

HARDEST-TEST: Verify `e1Rng` seed-determinism across 20 seeds to ensure no leakage into `e2Data` shared space.
