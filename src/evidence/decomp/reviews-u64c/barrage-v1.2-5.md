# U64c barrage v1.2 scout 5

## Brief
ANGLE exploreRng-final: grade the dedicated exploreRng(53400+seed). Does it fully resolve diet/explore conflation (diet draws proceed per slot regardless of policy — confirm the prereg SAYS that), or can a driver still couple them? Quote the gap or confirm CLOSED.

## Reply (verbatim)
VERDICT: IMPLEMENTABLE

1. The separation of `exploreRng(53400+seed)` from the diet-draw stream ensures that the exploration policy (K=10) cannot bias the underlying diet sampling. Since the prereg specifies "explore picks from DEDICATED exploreRng," the coupling is CLOSED; a driver cannot correlate the diet-draw sequence with the exploration decision without violating the RNG isolation.

HARDEST-TEST: Verify the 15/20 quorum against the dead-seed list (s0, s2, s9, s12, s18). If any of these 5 are required for a pass, the result is a binary failure regardless of `detT` performance.
