# Wave 244 note — backlog-W208 optimizer × barrier (sandbox, executed)

STOP RULE: stopped after 12-cell optimizer grid (adam/sgd/signsgd × natural/pow1.5/pow2/pow3 × 20 seeds, same toy+seeds as W223, 1500 steps). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (vendored w191 rig, update-rule swap only). Clock: R38 1/5. Pre-reg scored: (a) CONFIRMED (b) REFINED-sharper (c) CONFIRMED.

## Direct: the barrier is an optimizer artifact; SGD strands at exactly zero

- (a) Adam replicates W223 to the digit (receipt): natural 1.0/20/50, pow1.5 1.0/30/60, pow2 1.0/30/90, pow3 0.6/70/420, meanFinal −0.555 = −0.555. Same seeds + same code path (traj stripped) — the replication wall holds, and the flat-then-cliff shape is Adam's shape.
- (b) SGD does NOT restore monotone slowdown — it draws a sharper cliff (REFINED against the graded prediction): natural 1.0/10/30 and pow1.5 1.0/10/40 flip FASTER than Adam, then pow2/pow3 strand at 0.0 — finals EXACTLY 0.000 all 20+20 runs. Mechanism, no mystery: at p=0 the pow gradient k|p|^{k−1} is exactly 0 for k>1, so the first zero-crossing attempt lands in a permanent zero-grad trap. Raw vanishing gradients don't slow the crossing — they forbid surviving it. The monotone prediction was wrong; the strand prediction (pow2 dead) was right.
- (c) sign-SGD flips EVERYTHING (1.0 all k, medFlip uniformly 20 — first REC check past the deterministic 18-step march from p0≈0.9 at step .05). Magnitude-blindness deletes the whole family: pow3 flips as fast as natural. Settles sloppily for k=3 (medSettle −1, finals −0.58…−1.46 dither — fixed steps can't converge, owned).
- Artifact map: W223's flat-then-cliff (Adam defeats vanishing grads by normalization until batch-noise sign-flips win at k=3) vs SGD's fast-or-dead (no normalization: crossable k≤1.5 flips faster than Adam, k≥2 dies at exactly 0) vs sign-SGD's flat-fast (no magnitude: no barrier at all). W203's square/prod-sym "capture into exactly-zero" now has its dynamic twin: SGD-pow2/pow3 strand at exactly 0.000 by the same zero-grad mechanism — the exact-zero signature is optimizer-independent, the escape from it is optimizer-owned (Adam normalizes out, sign-SGD never sees it, SGD dies in it).

Verdict: USED with teeth (exact Adam receipt + sharper-than-predicted SGD cliff + exact-zero strand mechanism + full artifact map). No precursor, no conflict.

## Tangential: match the optimizer to the barrier question (0-spend, reasoning only)

"Can the barrier be crossed?" has no optimizer-free answer: the same geometry (pow2) flips at 30 (Adam), dies at 0 (SGD), flips at 20 (sign-SGD). Timing claims without a named optimizer are underspecified the way λ* without λ-units would be. Rule: every barrier-timing number ships its update rule (rule, LR, batch) the way every price ships its λ — and cross-optimizer comparisons (like this grid) outrank single-optimizer timings, because the interesting property is the map, not the cell.

## Spend / queue

- Spend: 0 + 0 + 1 grid (240 runs × 1500 steps; floor). Consumed backlog-W208 removed; spawned W225 to BACK. Backlog 17. Synthesis R38 clock: 1/5.
- W225 (A, sandbox): LR × rescue map — LR {0.01,0.05,0.2} × {sgd,adam,signsgd} × pow{1.5,2,3}, same toy+seeds: does high LR rescue SGD-pow2 (jump over zero) at the cost of settling; does low LR strand pow1.5; is Adam's k=3 cliff LR-dependent; strand boundary in (LR,k,opt).
