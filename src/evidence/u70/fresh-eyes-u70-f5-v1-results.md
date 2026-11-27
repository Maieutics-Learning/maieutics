# U70-F5 battery barrage results (CLOSED 10/10 NEEDS-PATCH, 2026-11-27)

Premise: `premise-u70-f5-v1.0.md`. Verbatims: `f5-battery/r1..r10`.

## Convergent finding (10/10, same flaw in different words)
Unit-of-analysis / comparability break: primary = per-seed MEAN over k=0..2 (20 means) vs F4 = single run per seed. Including k=0 (the F4 baseline itself) in the mean anchors the result to the baseline (R3); mean-vs-single mixes variance-reduction with init effects (R1/R2/R5–R10); binary single-run bars applied to means change meaning (R4/R7/R10); LOTTERY-CEILING filed as a verdict label contradicts descriptive-only (R2p2). The mean washes the very lottery variance F5 exists to quantify.

## Proposed adjudication (for owner arbitration → v1.1)
Rewrite the primary, no arch/loss/bar change:
1. k=0 becomes replication-check ONLY (must match filed F4 within floating noise, else halt) — excluded from every primary number. Removes the anchor (R3).
2. Primary sample = 40 new-init RUNS (k=1,2 × 20 seeds), unit = run. Pooled probe/gap over 40, same bars (≥0.70 / ≥0.05). Same single-run meaning as F4 pooled-20 — no mean-of-means for the verdict.
3. Paired attribution demoted to descriptive: per-seed mean(k=1,2) − F4 same-seed dProbe/dGap + CI, labeled stability-delta (variance shrinkage acknowledged).
4. LOTTERY-CEILING stays an analysis heading, never a verdict (R2p2 adopted). Consistency (2/2, 1/2, 0/2 per-seed pass counts + max table) reported descriptively.
5. Verdicts: F5-FIXED = pooled-40 probe pass AND gap pass; PARTIAL / PERSISTS as before. No new bars.

## Arbitration record (2026-11-27)
- v1.1 re-close split 2 STANDS / 2 NEEDS-PATCH (re1, re4 STANDS; re2, re3 NEEDS-PATCH demanding all-runs-pass). Owner declined the moved bar; v1.1 stands on pooled-run convention.
- v1.2 (mean+median companion) delta battery 8/8 NEEDS-PATCH (`f5-battery/v12-r1..r8`): convergent bimodal-blindness / median-gaming objection — 21/40 barely passing clears the median with 19 catastrophic; pair constrains neither spread nor consistency.
- Owner arbitration: PROCEED on pooled-40 MEAN+MEDIAN (v1.2) with the bimodal limit FILED openly (sorted 40-run list + 2/2–1/2–0/2 + max tables are the backstop, not a hidden caveat). Rationale: the bar's job is typical-run strength, not a consistency proof; the distribution is published either way. Verdicts under v1.2 stand as filed; a bimodal pass would read FIXED-with-tail, not clean FIXED.
- Needs FRESH countersign on exact v1.2 before compute. NO PUSH without order.
- SD-cap proposal (2026-11-27): owner asked for pushback; numbers filed (F2 SD 0.21, F4 SD 0.22, 21×1.0+19×0.4 hypo SD 0.30 — any cap killing the hypo also kills filed F4). Rejected: unjustified threshold, wrong units, hurdle-stacking. Owner: "keep it simple" — v1.2 (mean+median + WITH-TAIL gloss) stands as the run version.
