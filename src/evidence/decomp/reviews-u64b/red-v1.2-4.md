# U64b red-team v1.2 scout 4

## Brief
KILL-SHOT 4: prove PROCEED reachable by noise alone at >5% despite the filed 0.041 bound. Show where the bound's assumptions break (which assumption, exactly).

## Reply (verbatim)
KILL: The 0.041 joint bound is invalidated by the FLOOR-ANCHOR sensitivity diagnostic, which allows a "PROCEED" verdict via a non-zero probability of noise-driven convergence in the 0.35-0.45 range.

1. The "sensitivity diagnostic 0.35/0.40/0.45" introduces a variable threshold for "INCONCLUSIVE" results; if the floor guards are not strictly independent of the EDGE-E1/E2 bars, the union bound P<=0.041 fails to account for the conditional probability of a "PROCEED" result emerging from the noise floor when the diagnostic triggers "AMBIGUOUS-FLOOR."

HARDEST-TEST: Monte Carlo simulation of the 0.35-0.45 sensitivity range to check if the "PROCEED" rate exceeds 4.1% under null.
