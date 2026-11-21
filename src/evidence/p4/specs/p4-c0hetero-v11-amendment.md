# Path 3 (C0-hetero) AMENDMENT v1.1 (agent-approved under 2026-11-21 user pre-countersign)

## Why (r1-train scores void selection, zero stage-B compute spent)
c-r1-s{0,1,2} COMPLETE: ALL train gaps <= +0.07 (short cells -0.83..-1.06:
students MEMORIZE short train lines below the oracle floor; long cells
-0.07..+0.07: match floor). need = max(0, gap-0.20) = 0 in all 6 cells 3/3 seeds
-> true arm identical to uniform -> stage B cannot discriminate. Root cause:
train-loss against an UNBEATABLE oracle floor carries no selection signal
(memorization contaminates the short cells; calibration contaminates the long).
The v1.0 wording already says "studentTestLoss" — this amendment implements it.

## Change (scores move to un-trained lines; everything else stands)
1. SCORE POOL heteroPool(12205, 300): fresh, never trained on by any brain,
   disjoint from r1 (12200) / r2 (12210+s) / held-out (12220) / weak-r2 (12229).
   Same pool all seeds (common ruler, filed).
2. S1 rebuilt deterministically (same seeds; F6 digit-for-digit precedent) +
   DETERMINISM CHECK: rebuilt lastLoss must equal filed r1 lastLoss EXACTLY,
   else HALT (stack drift). Blobs saved c-s1mouth-s{0,1,2}.json.
3. Gaps recomputed on score pool (student test loss - oracle floor per cell).
   Transform, arms, bars, bar VALUES (gain >= 0.15 3/3, sensitivity triple,
   attribution >= 0.10) UNCHANGED. Ledgers c-r1b-s{s}.json (v1.0 files stand as
   the voided attempt, superseded-by pointer inside).
4. runP4HeteroR2 reads r1b (one-line path change).

## Expectation
Score gaps positive (+0.1-0.4, hardest cells highest), range >= 0.20 (students
cannot memorize un-trained lines; generalization shortfall is the true reducible
loss). If range < 0.20 the loop still runs (true ~= uniform) and the verdict
prices it as "even perfect information finds no leverage" — no second amendment.

## Cost
3 rebuilds x ~2 min. No new machinery.
