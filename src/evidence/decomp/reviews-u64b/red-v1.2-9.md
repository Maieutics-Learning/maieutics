# U64b red-team v1.2 scout 9

## Brief
KILL-SHOT 9: prove the anti-tuning story fails — name one filed choice that is tuned to U64 numbers AND evades the sensitivity diagnostic (i.e. the table cannot catch it). Show the tuning path.

## Reply (verbatim)
KILL: The sensitivity diagnostic is a post-hoc check on a fixed-seed novel set, failing to detect tuning of the "filed true boundaries" which determine the primary `accRec` signal.

1. `E1` uses "filed true boundaries" for `accRec`, but the sensitivity diagnostic only monitors the `0.35/0.40/0.45` floor of the *aggregate* `max-arm accRec`. A researcher can tune the boundary offsets to push the signal just above 0.40 without triggering the `AMBIGUOUS-FLOOR` note, as the diagnostic lacks a granular per-boundary sensitivity check.

HARDEST-TEST: Run a permutation test on boundary offsets relative to the `G.makeRng` seed to see if `accRec` variance is significantly lower than the null.
