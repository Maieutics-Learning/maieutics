# (b)-pilot mini-prereg v0.1 (COUNTERSIGNED 2026-11-18 by user "countersigning the test" — binds this version only; pilot build + run authorized, full (b) needs its own go)

## Objective
Bounded pilot of candidate-(b) mouthpiece on ONE pile (class-0, the bankable one): does a
taught next-token head let N emit its easy pile? Imitation-only, no scores. (a) already
failed the round 0/4 at 0.90, so full (b) is licensed by the ORDER rule — but the pilot
runs first as the cheap headroom check.

## Method (tutor upgrade, not a student)
- Subject: N backbone seed 9601 (the surveyed/recalibrated N — same scorer as run-1a).
- Head: Lnext h->19 next-token head, fresh init from filed RNG (init seed ledgered).
  Backbone arch unchanged (attn h48/m96/d16, vocab19).
- Training (both arms): next-token cross-entropy on SEED POOL lines (P2-spec vocab19,
  matched length bands, fresh pool seed 9760, 400 mixed lines, ledger-listed).
  Imitation-only: targets are the pool lines themselves; no agreement, reward, or
  selection gradients anywhere.
- Arms (parallel, per standing rule — frozen reported first):
  - FROZEN: backbone frozen, head-only training (F-weights axis).
  - UNFROZEN: continuation of the same brains (same seeds/weights/history), full
    fine-tune. Delta named F-weights.
- Budget (proposed): <=800 steps per arm, batch 8, lr 5e-3 (same optimizer family;
  any deviation filed as amendment). rMode 1.
- Generation (filed exactly): prefix = first 3 tokens of a random pool line; complete
  to matched-band length via ancestral sampling (T=1.0); 200 candidates. Keep what the
  frozen N scorer sorts as class-0 at >=0.90. Novelty guard: poolHit must be 0.

## Bar (pilot headroom)
HEADROOM iff >=20 class-0 lines at >=0.90 inside the 200 candidates, passing novelty,
on EITHER arm (frozen first). Else NO-HEADROOM -> full (b) needs redesign, not scaling.
Full (b) (all 4 piles + full build gate incl. round-trip two-half, non-triviality,
diversity, balance chi2, quorum >=3/4) only on user go after the pilot verdict.

## Controls / discipline
- No correctness-driven updates (targets are pool lines, not judgments).
- No seed shopping: pilot seeds fixed pre-run (backbone 9601, head-init 9761, pool 9760,
  sampling 9762); generation uses filed sampling seed only.
- Measurement-only evals exempt from parallel-arms; all learning runs paired.

## Doubt instruments
- Expectation: frozen writes wobbly but sortable (~20-60 keepers); unfrozen similar or
  slightly better. At least one arm shows headroom.
- Pre-mortem: strongest objection = head learns pool statistics but sampling never lands
  in the scorer's 0.90 region (writer and grader speak different dialects) — keepers ~0.
  Most likely failure = 200 candidates too few for a 0.90 hit rate near zero.
- Nearest-failure: sharpener Stage 1 (objective void on uniform noise) — this pilot
  differs because the target is imitation of fixed pool lines (memorizable, verifiable
  train loss), not generalization from noise; train-loss fall is expected here, keepers
  are the open question.
- W: keepers <=5/200 on BOTH arms after one retry (new sampling seed, same budget) ->
  mouthpiece as specified cannot reach the scorer's bar; redesign, don't extend silently.

## Cost
2 short trainings (<=800 steps each) + 400 candidate forwards + gates. Minutes per arm
at timed 395ms/step (~5 min/arm).

## Status
COUNTERSIGNED 2026-11-18. Build + pilot run authorized (frozen + unfrozen, class-0 only).
