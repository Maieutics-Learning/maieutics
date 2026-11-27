# U64b focused re-close red v1.3 scout 6

## Brief
KILL-SHOT F: open kill — the single strongest NEW objection to v1.3 not raised in any prior round (floor-banked, union-bound-banked, arm-invariance-banked, orF-is-oracle-banked, frozen-banked: repeats are STALE, say BAREN instead).

## Reply (verbatim)
KILL: (a) ruleDrawCount range assert | 1. The upper bound (Wave-0 draws+20) is an arbitrary constant not derived from the joint bound (<=0.041 union), creating a potential drift where valid high-variance draws are rejected despite being statistically sound within the union.

HARDEST-TEST: Simulate Wave-0 draws at 21+ variance offset.

KILL-SHOT F: The range assert introduces a state-dependent failure mode that bypasses the arm-invariance of the original v1.2 framework; if Wave-0 is anomalously low, valid subsequent draws are killed by a hard ceiling regardless of the global union bound.
