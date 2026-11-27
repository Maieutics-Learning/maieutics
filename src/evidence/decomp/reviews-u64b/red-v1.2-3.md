# U64b red-team v1.2 scout 3

## Brief
KILL-SHOT 3: prove E2 novelty illusory — the novel set is predictable from filed artifacts (ruleDrawCount, candidate order, seed arithmetic) in a way that favors a specific arm. Name the mechanism.

## Reply (verbatim)
KILL: E2 novelty is illusory because the "novel" set is deterministically derived from a shared seed and a linear ruleRng offset, allowing the driverHash to pre-calculate the candidates.

1. `e2Data G.makeRng(53300+seed)` is ARM-INVARIANT and shared; `ruleRng(64000+seed)` is a simple linear shift. Since `seed` is known/recoverable from the `examHash` or `driverHash` vectors, the "novel" candidates are predictable. This creates a leakage path where the driver can optimize for the "novel" set before the `ruleDrawCount` is logged.

HARDEST-TEST: Run a seed-recovery attack on the `examHash` to predict the `e2Data` sequence; if the predicted set matches the "novel" set with $p < 0.001$, novelty is zero.
