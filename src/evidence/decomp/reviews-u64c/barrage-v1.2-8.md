# U64c barrage v1.2 scout 8

## Brief
ANGLE logging-final: ledger has U64 keys + exploreSlots + dedicated exploreRng stream ID filed. Under LOG EVERYTHING, what is STILL missing for a post-hoc trigger audit (pre-reset qkCount values? per-slot pick log? explore outcome log)? Name it or COMPLETE.

## Reply (verbatim)
VERDICT: IMPLEMENTABLE

1. PREREG is technically sound. K=10 for 4-slot coverage (P~0.78) is a reasonable heuristic for breaking lock-in via dilution. Seed-based RNG isolation (G.makeRng) prevents state leakage. Dead-seed pre-analysis justifies the 15/20 quorum, preventing false-negative failures on mathematically impossible seeds. FP-drift is negligible.

2. Audit Gap: To complete post-hoc trigger audits, the ledger must explicitly log the `pre-reset qkCount` and the `per-slot pick index` for every explore sequence. Without the specific pick sequence, the "uniform" claim is unverifiable.

HARDEST-TEST: Verify 15/20 pass rate on the 15 viable seeds using the U64 dice (matched) to confirm the 0.9733-0.9267 seed-failure hypothesis.
