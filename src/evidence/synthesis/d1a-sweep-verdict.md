# D1a sweep verdict (2026-11-17): FILL-FAIL-competent-empty + inversion challenged

Sweep: 12 brains 5201-5212 (2 smoke + 10 sweep, curriculum tutor, replica students, killHu-spelled held-keys 200/brain).
Ledger: `src/evidence/synthesis/d1a-smoke.json` (+migration code 6b84→f68d, hu/pool unchanged).

## Numbers
- Regimes: 11 lost (<0.5) / 1 mid (5209: 0.530) / 0 competent (max acc 0.530). Fill bar (≥3 + ≥3) FAILS on the competent side — mirror image of run-02 (which failed on lost).
- rho(acc,suspAUC) = 0.3134 < 0.6 bar; p ≈ 0.307 (50k permutation); n=12, no nulls.
- Lost median suspAUC = 0.5767; min over all 12 = 0.5402 — EVERY brain ranks above chance. Zero anti-predictions.
- Lost median Δ (meanSusp incorrect−correct) = 0.037 (>0.02 downgrade line, but small — flat-ish).
- Swap≈acc throughout (0.35-0.51) → context-following, not memorization. rkTop 0.50-0.72 on absent queries.

## Verdicts
1. **FILL-FAIL-competent-empty** (primary, pre-registered): boundary untestable from the competent side under this recipe. Spelled longs via soft-target transmission produce only weak matchers.
2. **Inversion half challenged (exploratory, new data):** the atomic pattern (systematically-wrong brains anti-predict, 0.32-0.43) does NOT replicate on spelled lost brains (0.54-0.67, none <0.5). Lost-via-weakness ≠ lost-via-wrong-axis. The regime taxonomy needs refining: the boundary account as stated (inversion under systematic error) survives only if restricted to wrong-axis lost, which this recipe never makes.
3. No downgrade triggered (0.037 > 0.02) but the margin is thin; the R4 calibration-bias rival lives on.

## Next (needs user go; nothing started)
- **Student-curriculum variant** (proposal): students train short-only → full pool like the tutor (same principle that fixed the tutor 0.595→0.965). Replica constraint would be amended by spec patch + countersign; tutor, exams, bars unchanged. Goal: competent-fill, then the boundary re-test opens with both regimes genuinely filled (atomic-competent? No — same spelled exam for both).
- **Sign-flip retest** (user reminder, still queued): cheap path REFUTED on atomic; hard path (unsupervised mirror detection) needs design. Spelled lost brains are weak-lost, not mirror-lost — they do NOT substitute. Options: run mirror test on saved atomic brains, or wait for competent spelled brains.
- Paper block stays. Nothing enters paper.
