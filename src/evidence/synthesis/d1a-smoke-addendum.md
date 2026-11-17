# D1a smoke addendum (2026-11-17): tutor-generalizes / students-collapse-on-longs

Ledger: `src/evidence/synthesis/d1a-smoke.json` (fingerprint hu:2e7d800214a0+pool:7800372d6329+code:6b847605545f).
Smoke: SMOKE-DONE, tutor gate PASS (killA-spelled 0.965 ≥ 0.95 after curriculum short1500→full3000; single-shot was 0.595 HALT).

Tutor generalization (addendum eval, same blobs):
- tutor killA(train keys) 0.965, killHu(held keys) 0.960, short(train) 1.000 → tutor learned the true rule, not train-key memorization. Curriculum fixed the single-shot failure (short was 0.825 / long 0.590).

Students (transmission via soft targets, replica stages):
- s5201: short(train) 0.775, killHu(held) 0.375, suspAUC 0.5503, Δ 0.027, swap 0.350, rkTop 0.609
- s5202: short(train) 0.850, killHu(held) 0.445, suspAUC 0.6047, Δ 0.059, swap 0.435, rkTop 0.667

Reading: transmission holds for shorts, collapses on longs-with-novel-keys — the ix pattern (machinery works, transfer is the wall) replicated in spelled world. Both smoke brains are LOST (acc<0.5) via test difficulty, not degraded knobs: lost-producer goal met in principle.
- Swap≈acc → context-following (memorizer would collapse under value-swap); template-match verdict avoided.
- Suspicion 0.55/0.60: weak rank, no inversion yet — but these are moderately-lost (0.375-0.445), not systematically-wrong (<0.37 atomic class). Boundary test needs the full sweep.
- Watch: 5201 Δ 0.027 near the v1.2 downgrade line (≤0.02); rkTop 0.61-0.67 overconfident on absent queries.
- killHu is long-only by construction, so ledger shortAcc=null; short numbers above are this addendum.

Verdict: SMOKE-PASS → open 8-12 sweep (seeds 5201-5212). Risk inverted vs run-02: lost fills easily; COMPETENT (≥3 at ≥0.6) is now the hard side.
Sign-flip retest stays queued behind fill bar (n=2 cannot grade mirror).
