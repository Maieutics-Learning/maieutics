# F5: round-3 extension — compound vs saturate v1.0 (PRE-COUNTERSIGNED 2026-11-21 user order; agent approval: this file)

## What do I want to find out
P5's accumulation question in miniature: does a THIRD selected round compound
the round-2 gain, saturate, or collapse? D/F1 stop at round 2. F5 continues the
true-chain one round on F1 t-seeds (fresh brains/lines, same tutor/materials).

## Research check
Nothing external: F1 r1/r2 ledgers/blobs/pools all filed. Proceeding.

## Design (true-chain continuation, deterministic rebuild + check)
ROUND-2 REBUILD (per t): replicate the F1-R2-true draw EXACTLY (filed pools
d-pool-*.json + filed gen seeds 12530/12540/12550+t + filed draw rng
12561+t*10+0 + filed student seed 12571+t*10+0 + train seed) and retrain S2.
DETERMINISM CHECK: rebuilt lastLoss must equal filed e-r2-true-t{t}.json
mtr.lastLoss EXACTLY (F6/C0-r1b precedent), else HALT (stack drift).
ROUND-3 SCORES: S2 per-cell gaps on ITS OWN 300 train lines (same 6 cells, same
gap definition vs L2g9 tutor) -> transform (GAP_OK=0.30/FLOOR=0.05) -> fresh gen
(12830+t strong / 12840+t detached / 12850+t base) -> draw rng 12861+t -> train
S3 (student 12871+t) -> held-out 12160 gain vs S1 (recomputed from e-s1mouth-t
blob; same S1 as F1).
VERDICT TRICHOTOMY (preregistered, per seed; quorum = same category 2/3+):
- COMPOUND if r3gain - r2gain >= +0.10 (selection stacks across rounds)
- SATURATE if |r3gain - r2gain| <= 0.10 (one round extracts what's extractable)
- COLLAPSE if r3gain - r2gain <= -0.10 (continued selection hurts)
EXPECTATION: SATURATE 2/3+ (owned: round-2 already concentrates 0.30-0.50 on the
learnable cell; round-3 re-selects the same region with less headroom).

## Pre-mortem
Strongest objection: round-3 scores come from S2 (a different student than S1)
so r3 weights target S2's errors, not the same curriculum — answered: that IS
multi-round teaching (each round responds to the CURRENT student); the design
matches P5's loop semantics, filed openly.
Most likely failure: COLLAPSE (re-concentration on memorized shorts?) — priced
as a real outcome (would bound single-round claims: selection doesn't stack).

## Nearest-failure
F1 (differs in the priced way: one more round on the true-chain; same tutor,
materials, metric. Tests accumulation, which no prior run prices).

## Cost
3 rebuilds + 3 S3 trains + evals ~ 15 min, resume-safe.

## Ledgers
src/evidence/p4/g-r3-t{0,1,2}.json (rebuild check + r3 gaps/weights/gain),
g-r3-verdict.json. Driver: runP4Round3.
