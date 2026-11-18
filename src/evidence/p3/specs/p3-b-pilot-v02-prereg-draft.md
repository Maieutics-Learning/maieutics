# (b)-pilot mini-prereg v0.2 (COUNTERSIGNED 2026-11-18 by user "Countersign" — binds this version only; Step 0 + pilot run authorized, full (b) needs its own go)

## Change from v0.1 (killed: NO-HEADROOM, 0/200 all four runs)
Same mouth, different food. v0.1 trained the writer on uniform noise — nothing to grip,
loss pinned at chance. v0.2 trains on STRUCTURED noise (real input dependencies) while
keeping imitation-only. Only the pool changes; arms, budget, bar, and seeds otherwise
identical so v0.1 is the control.

## No-hard-labels clause (binding)
The structure lives in the INPUT distribution only and is CLASS-AGNOSTIC: identical
generator for every line, no conditioning on scorer piles, no class information planted.
Targets are the lines themselves (next-token = the input's own next token). No
correctness, reward, agreement-gradient, or selection anywhere. The scorer (N-9601,
frozen, unchanged) still defines the piles by its own argmax — pseudo-classes, never
ground truth. Agreement stays thermometer.

## Structured pool spec (filed exactly)
Markov-repeat noise, vocab19, matched length bands (half short 10/15/20, half len-50):
token t+1 = token t with prob RHO=0.35, else uniform 0..18. Fresh pool seed 9770, 400
mixed lines. Class-agnostic by construction (one RHO, no pile conditioning). Uniform-pool
control already on file (v0.1: 0/200, max top1 0.80/0.83).

## Step 0 — existence check (measurement-only, exempt from parallel-arms)
BEFORE training: dense hill-climb toward class-0 only on N-9601 (40 starts x 500 evals,
pool9810, rng 7000+9601). Records the max reachable class-0 softmax. If max < 0.90, the
0.90 region is effectively absent and no writer can land there — reported, not hidden;
the pilot still runs (writers might find what blind search misses) but expectations drop
to diagnostics (max top1 movement vs v0.1's 0.83).

## Method (unchanged from v0.1 except the pool)
- Subject: N backbone seed 9601; Lnext h->19, head-init 9761.
- Training: next-token CE via per-position aux through Lout19 (same build as v0.1).
- Arms (parallel, frozen first): FROZEN head-only Adam vs UNFROZEN full fine-tune,
  same seeds/weights/history (F-weights axis).
- Budget: <=800 steps/arm, batch 8, lr 5e-3, rMode 1, train-sampling 9780 (same data
  order as v0.1 for comparability).

## Generation (unchanged)
Prefix-3 + ancestral sampling T=1.0 to matched length, 200 candidates, sampling 9762
(retry 9763). Keepers: N-scorer class-0 >=0.90 + poolHit 0 vs training pool 9770.

## Bar (unchanged)
HEADROOM iff >=20 keepers in 200 on EITHER arm. Diagnostics regardless: train
first/last loss vs chance, max top1, delta vs v0.1. Full (b) only on user go.

## Doubt instruments
- Expectation: train loss falls below chance (structure IS learnable, unlike v0.1);
  keepers 5-40 if the writer's distribution overlaps the scorer's 0-90 region, else 0-5.
- Pre-mortem: strongest objection = the ceiling — if Step 0 shows no 0.90 region exists,
  writers aim at a target that isn't there; structured food doesn't fix a missing
  destination. Second = dialect mismatch (writer's structured lines live where the
  scorer mumbles).
- Nearest-failure: v0.1 (same writer, uniform food, 0/200) — the ONLY change is the pool,
  so any movement is attributable to structure. If train loss still pins at chance, the
  build is broken, not the idea.
- W: keepers <=5/200 on BOTH arms after retry -> v0.2 as specified cannot reach the bar;
  redesign, don't extend silently.

## Cost
Step 0 (~20k forwards, seconds) + 2 short trainings (~4-5 min/arm) + candidates.

## Status
COUNTERSIGNED 2026-11-18. Step 0 + pilot run authorized (structured pool 9770, frozen + unfrozen, class-0 only).
## 2026-11-18 — (b)-pilot v0.2 COUNTERSIGNED (user "Countersign")
- Binds v0.2 only. Order: Step 0 existence check first, then frozen arm, then unfrozen.
## 2026-11-18 — (b)-pilot v0.2 DRAFT filed (structured food, same mouth; awaits countersign)
- User direction: "lets redesign... actual patterns in noise... no hard labels". v0.2: Markov-repeat pool (RHO=0.35, seed 9770, class-agnostic) + binding no-hard-labels clause + Step-0 existence check (40x500 class-0 hill-climb) before training. Arms/budget/bar/generation identical to v0.1 (control). Binds nothing until countersigned.
