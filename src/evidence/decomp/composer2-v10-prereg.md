# Compose round-2 extras v10 — ratio + width (FINAL 2 of 5 budget; FROZEN for review battery)

Agent approval: this file. User countersign: 2026-11-23 "go ahead and figure out what you want to do to next to advance on the goal" (bench scale, in-worker/CPU only; R=3 quorum 2/3; NO GPU; NO PUSH without explicit order).

## Why
Composex verdict (CEILING-CONFIRMED 0/3): retrieve-labels, 2x variety, and 2x steps each move single seeds but none moves quorum; step-doubling weakest (+0.017 mean), variety best (+0.05 mean, best single 0.585, best at every length). Composition solved (joint-holds, lure avoided, length-flat); the unary shift map ceilings ~0.5-0.55. Two hypotheses remain untried within budget: (a) the easy skill is over-budgeted — forward holds at ~0.81 with 150 lines, so shifting budget to shift (same 300-line/800-step envelope) should lift shift without losing forward; (b) the attn substrate is capacity-bound on the add-step (kcliff K-dose precedent on channel; never tested on attn shift).

## Design (attn from scratch, probe recipe: batch 16, lr 5e-3, attnAux true; frozen tests 52400/52500+seed; per-k + echo + len analysis carried)
- X4 RATIO (arm x4): 225 shift + 75 fwd (shift drng 52200+seed draws 225 — first 150 nested-identical to S1's; fwd frng 52300+seed draws 75 — first 75 of S1's; shuffle 52600+seed), 800 steps, h48/m96. Same envelope as S1, rebalanced toward the hard skill.
- X5 WIDE (arm x5): S1-identical data (150+150, same rngs), 800 steps, h64/m128/d16 (same vocab/classes). Mild resource (~1.8x/step), explicitly labeled — the user's caution stands, this is the last resort before arch change.
- Evals: standard (200 fwd + 200 shift 3-pair) + len (200 shift-2p + 200 shift-4p, rngs 52800/52900+seed) on frozen models.

## Bars (quorum 2/3; verdict d-composer2-verdict.json; S1 refs paired by seed: shift 0.475/0.505/0.51, fwd 0.78/0.865/0.785)
- RATIO-HELPS: X4 shift - S1 shift >= +0.05 AND X4 fwd >= 0.70 (lower fwd bar is honest: only 75 fwd lines; 0.70 still 1.8x chance and tests hold-vs-erase).
- WIDE-HELPS: X5 shift - S1 shift >= +0.05 AND X5 fwd >= 0.75.

## Expectation (filed open)
X4 HIT (dose logic: shift variety helped in X2; fwd is easy and should hold ≥0.75 on 75 lines — composite replay held fwd on 25% mix); X5 HIT-or-near (capacity dose gradual per kcliff; but E7 SATURATES-THEN-HURTS warns wider can hurt single-round learning — the fwd bar + lastLoss check adjudicates).

## Nearest-failure
- X2 DATA (2x variety +0.05 mean, 1/3; differs: ratio keeps envelope fixed instead of growing the pool).
- S1 joint (differs: ratio rebalance; width substrate change).
- E7 W8<W4 (stronger pressure hurt single-round learning; differs: width adds capacity, not constraint — but same direction of caution, watched via fwd bar + train loss).
- kcliff K-dose gradual (channel width lifted rev; differs: attn width on the add-step, untested).

## Cost
6 trains (X4 ~2 min, X5 ~3-4 min each) + 12 evals (standard + len), split across calls, COMPLETE-gated. Driver: runRatioTrain/runWideTrain + reuse runShiftEval/runShiftEvalLen (arch-aware restore). Closes the compose-track extras budget (5/5). NO PUSH.
