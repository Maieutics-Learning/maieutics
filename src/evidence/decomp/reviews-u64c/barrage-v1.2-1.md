# U64c barrage v1.2 scout 1

## Brief
ANGLE K-final: grade the corrected K-COVERAGE (0.78 pick-coverage, dilution rationale, K kept). Is 0.78 coverage with dilution-rationale an honest basis for a 20-train arm, or must K rise (15: 0.96, 20: 0.9997)? If rise, show the lock-in math that 0.78 fails; else stand down.

## Reply (verbatim)
VERDICT: NEEDS-PATCH

1. K=10 is insufficient. P(all 4 picked >=1) = 0.78 creates a 22% probability of blind-spots per boundary reset. In a 20-train regime, the variance in exploration coverage introduces unacceptable noise, risking "false-dead" seeds. Dilution rationale is a hand-wave; without a full sweep, lock-in is probabilistic, not deterministic. To guarantee 15/20 quorum stability across the 800st H48 config, coverage must exceed 0.95. K=15 (0.96) or K=20 (0.9997) is required to ensure the "dilution" doesn't simply become "missing data."

HARDEST-TEST: Run seed s12 (0.9267 dice) through detT with K=10; if it fails while K=20 passes, the 0.78 coverage is proven inadequate for the 15/20 quorum.
