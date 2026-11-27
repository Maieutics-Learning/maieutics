# U64c barrage v1.2 scout 4

## Brief
ANGLE deadseed-final: verify the dead-seed list s0/s2/s9/s12/s18 against filed dice adaptEarly (s0 0.9733, s2 0.96, s9 0.9533, s12 0.9267, s18 0.96). Check each: is +0.10 truly unreachable (need >1.0)? Name any seed where detT.adapt=1.0 could still pass (dice<=0.90) that the list MISSED, or confirm COMPLETE.

## Reply (verbatim)
VERDICT: IMPLEMENTABLE

1. Dead-seed list s0/s2/s9/s12/s18 is COMPLETE. All filed dice values (0.9267 to 0.9733) are > 0.90. Given the +0.10 reach, any seed with dice > 0.90 is mathematically unreachable at adapt=1.0. No seeds missed; the 15/20 quorum requirement necessitates 100% pass rate on the remaining 15 seeds. detT logic is sound; RNG isolation via G.makeRng(53400+seed) prevents cross-talk. FP-drift is negligible.

HARDEST-TEST: Verify quorum 15/20 on seeds {s1, s3-s8, s10-s11, s13-s17, s19} using detT.adapt=1.0.
