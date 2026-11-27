# U64c barrage v1.0 scout 8

## Angle
ANGLE logging: under LOG EVERYTHING, grade the ledger spec (U64 keys + {two,scr,orc}). Missing for a response arm: per-slot trigger logs? explore-slot masks (which 10 slots were explore)? post-explore exploit trajectory? reset magnitudes (qkCount before/after)? Name omissions or COMPLETE.

## Reply (verbatim)
VERDICT: IMPLEMENTABLE

1. Logic sound. Oracle-triggered reset with K=10 uniform exploration is a well-defined policy. Using OLD U50 exam as a baseline prevents inflation. Quorum 15/20 is statistically rigorous for the hypothesized gain. Compute is unlicensed but the protocol is self-contained.

2. Ledger spec is INCOMPLETE. Missing: per-slot trigger timestamps, identity of the 10 explore-slots, post-explore transition vectors, and qkCount delta magnitudes. Without these, "uniform explore" is an unverifiable claim.

HARDEST-TEST: Verify `ruleRng` and `dataRng` output parity across 20 seeds to ensure no leakage/drift before the first oracle trigger.
