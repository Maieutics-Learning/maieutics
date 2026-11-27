# U64c barrage v1.2 scout 6

## Brief
ANGLE drag-final: grade the explore-drag locus sentence. 30 slots at chance during training shift the trunk's final params; two is frozen-eval. Is 'second-order, bounded << +0.03' actually derivable, or hand-waved? Give the worst-case bound (30/800 of updates at worst 0.5 acc-cost, diluted over 800 steps) or show it could exceed +0.03.

## Reply (verbatim)
VERDICT: NEEDS-PATCH

1. Drag locus is hand-waved. Worst-case bound for 30/800 updates with 0.5 cost is $\approx 0.01875$, but this assumes linear dilution. If updates are concentrated or non-linear, the +0.03 bound lacks a formal derivation. $P(\text{all 4 picked}) \approx 0.78$ for $K=10$ is correct, but "diet-independent" is a claim, not a proof. Dead-seed analysis is a vulnerability; requiring 15/15 pass rate on remaining seeds creates a fragile quorum. Compute status (UNLICENSED) is a compliance risk.

HARDEST-TEST: Verify $\text{FP-DRIFT} < 1\text{e-7}$ across 20 seeds.
