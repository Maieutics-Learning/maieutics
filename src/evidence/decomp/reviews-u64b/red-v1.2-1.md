# U64b red-team v1.2 scout 1

## Brief
KILL-SHOT 1: prove FLOOR 0.40 can never fire when it should (or always fires when it shouldn't) using the filed stuck-null band 0.06-0.44. Numbers, not adjectives.

## Reply (verbatim)
KILL: The FLOOR 0.40 is mathematically redundant and logically dead because the filed stuck-null band (0.06-0.44) encompasses the floor threshold, rendering the "INCONCLUSIVE" trigger a tautology of the existing noise floor.

1. FLOOR triggers at accRec < 0.40. Filed Hypothesis + FLOOR-ANCHOR defines the same range as 0.06-0.44. Any result < 0.40 is already within the defined stuck-null band, meaning the floor doesn't guard validity; it merely re-labels existing null-space.

HARDEST-TEST: Run a mock distribution with accRec = 0.39; if it triggers both the stuck-null band and the FLOOR-ANCHOR, the floor is a redundant label.
