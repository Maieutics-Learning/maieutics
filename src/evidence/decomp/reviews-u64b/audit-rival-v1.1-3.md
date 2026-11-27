# U64b audit-rival v1.1 scout 3

## Brief
ROLE ALTERNATIVE-EXPLANATION: bring ONE rival mechanism for a possible EDGE-E2 pass that is not 'detection matters' and not the already-ruled freshness artifact. State it, give the cheapest killer test, and say whether the design contains that test (where) or needs a patch (exact wording).

## Reply (verbatim)
VERDICT: IMPLEMENTABLE

1. Deterministic seeding (G.makeRng) and frozen trunks mitigate leakage. Quorum 15/20 + 0.03 edge ensures statistical rigor. Floor logic (0.40) prevents false positives from low-performance arms. State-space is locked via stackHash/examHash.

HARDEST-TEST: Seed-correlation attack. Test by running identical seeds across different armCodes to check for periodicity or overlap in `e1Rng`. Design contains this via `armCode` in seed sum; no patch needed.

ALTERNATIVE-EXPLANATION: Index-bias. The "lowest-pair-index fallback" in E2 may favor specific set-structures over true novelty. Killer test: Shuffle the order of `novelCandidates` before the fallback trigger. Design needs patch: "novelCandidates shall be randomly permuted prior to lowest-pair-index selection."
