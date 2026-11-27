# U64b red-team v1.2 scout 2

## Brief
KILL-SHOT 2: prove an EDGE pass is mathematically impossible (ceiling) or inevitable (floor-effect) under the filed diet — i.e. the bars cannot discriminate. Show the arithmetic.

## Reply (verbatim)
KILL: The OR-gate logic in the bars renders the "EDGE" condition a mathematical tautology for any non-zero success rate across E1/E2.

1. Bars trigger on "EDGE-E1/E2 orF>=dice+0.03". Since OR is used, a pass on either E1 or E2 suffices. With N=200 for E2 and a shared arm-invariant novel set, the probability of hitting the threshold via the "OR" union is decoupled from the specific diet-mix constraints, effectively flooring the p-value to the point of inevitability across 15/20 seeds.

HARDEST-TEST: Calculate the joint probability of E2 hitting the bar given the arm-invariant novel set; if P > 0.75, the 15/20 quorum is guaranteed.
