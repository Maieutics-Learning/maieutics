# Phase 1.b prereg v1.0 (COUNTERSIGNED by user — FROZEN, runs may proceed exactly as specified)

Gameplan: v13 §1.b (review #2 Q2) + §1.f stats. Motivation: the kill exams
that carry every Stage 1/2 verdict are target-first in all 200 lines
(`killAExam`, `killMatrix` in src/tinynn), while training has used fair slots
since F1. A pure "answer = first pair" policy scores ~1.00 on all four kills
in principle. F2 flatness (0.78–0.84) and the transfer mid-slot shift cover
other nets/regimes — never the transmitted verdict-carriers. This closes that.

## Subjects (8 winners, spanning arms)

staged 311, 314, 315, 316 + constant 312, 317 + instdrop 313, 318.
(All ignited in Stage 1; includes seed 313 — staged's lone failure — as an
instdrop winner. attn-only has no winners by verdict.)

No student weights were ever saved, so 1.b.i runs as deterministic
retrain-then-sweep: T0 tutor blobs survive in scratch/ (`p1a-t0-<seed>.json`),
student training is a pure function of (seed, arm, tutor), so retraining
reproduces the filed winners exactly.

## Protocol (IN-BROWSER REQUIRED — same engine as Stage 1)

Node drifts scores (see cross-engine note in phase-1a-verdicts.md), so the
retrain + sweep must run in the browser worker via the filed wave1-driver
recipe (tutor cache → trainFaded → evalSuite, identical OPTS/HINTED/ARMS).

- Replication gate (validity, per subject): retrained slot-0 ev must EQUAL
  the filed `armsDetail` ev exactly (same engine → bit-exact expected).
  Any mismatch voids that subject (investigate, never silently include).
- Swept exams (eval-only, fresh seeds, no overlap with train or filed exams):
  killA_s and killHd_s for s in 0..8 — same construction as `killAExam` /
  `killMatrix` (200 lines each, same combo distributions, query marker last),
  except the target pair sits at slot s instead of slot 0. Exam base seed
  9100+s (disjoint from pool seed 7 and exam seed 7008).
- Per subject: acc[w][K][s] for K in {killA, killHd}, s in 0..8.
  (Da/Hu skipped: the ignition bar uses A+Hd only.)

## Verdict (three conditions, δ=0.25 from 1.f)

1. Consistency: pooled Spearman ρ between the killA grid and killHd grid
   (8 winners × 9 slots = 72 cells, midrank ties) ≥ 0.95. Guards against exam
   noise dominating. Degenerate rule (pre-registered): if all 144 cells pass
   (zero variance — ρ undefined), condition 1 PASSES with the reason recorded.
2. Flatness: mean over winners and kill types of (max_s − min_s) ≤ 0.25.
3. No dead slot: for every (winner, kill, slot): (max_s − acc) ≤ 0.25 AND the
   cell stays above its ignition gate (killA ≥ 0.60, killHd ≥ 0.55).
   Any slot that fails a winner = meaningful failure rate at that position.

- All three pass → position-independent: kills stand, Q2 answered in text.
- Else → position-sensitive: kills are REPLACED with the position-swept
  variant, and Stage 1/2 verdicts are marked provisional pending re-gating
  under swept kills (consequence stated now, not later).
- Correlation alone never passes (r5): condition 1 cannot pass without 2+3.

## 1.b.ii (conditional)

Fresh-seed confirmation runs ONLY if sensitivity shows — new winners, same
protocol, pre-registered before launch. If 1.b.i passes clean, no ii.

## v1.1 amendment (RULED 2026-11-14 by user — verdict: INDEPENDENT*)

cond1's degenerate rule is widened: either grid at ceiling (all cells ≥ 0.99)
makes consistency vacuous — condition passes with the reason recorded, the
flatness conditions (cond2, cond3) carry the verdict. Recomputed from the
filed ledger, no new runs. Verdict flips to POSITION-INDEPENDENT* (asterisk
mandatory downstream, paper included — the run's bar-design mistake in
phase-1b-verdicts.md §Calibration finding travels with it). Kills stand, Q2
answered, no 1.b.ii, Stage 1/2 verdicts keep full standing. v1.0 above is
untouched; mechanical SENSITIVE stays on record as the mistake trail.

## Records / cost (v1.0, unchanged)

Driver + swept-exam ledgers beside results:
`src/evidence/synthesis/phase-1b/` (driver, `phase-1b-results.json`).
Paper inputs (1.e) fold the verdict only. Cost: 8 retrains (~2 min each) +
8×2×9 eval-only sweeps (forward passes, seconds each) ≈ 25 min wall,
in-browser, pool spend 0.
