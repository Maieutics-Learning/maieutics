# U64b barrage v1.0 scout 5

## Angle
ANGLE E2-enforceability: ruleRng continuation + exclusion + adjacent-differ + fallback. Can a driver enforce this EXACTLY from the text, or is there ambiguity (what is continuation state? which of 2 remaining sets is picked)? Quote the ambiguous phrase and give the exact replacement wording.

## Reply (verbatim)
VERDICT: NEEDS-PATCH

1. E2 is underspecified. "ruleRng continuation" fails to define the initial state or seed-offset for the continuation. "first-remaining" is ambiguous when multiple sets satisfy the exclusion/adjacent-differ criteria.
Replace: "ruleRng continuation" $\rightarrow$ "ruleRng initialized with seed+N_total_draws".
Replace: "first-remaining" $\rightarrow$ "the set with the lowest index among remaining valid sets".

HARDEST-TEST: Determinism twin check on W0 (PIN $\times$ 3) to verify `G.makeRng` seed-offset consistency across parallel drivers.
