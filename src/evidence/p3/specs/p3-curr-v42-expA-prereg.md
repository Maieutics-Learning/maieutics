# Experiment A — early-stop student (agent-approved under 2026-11-19 pre-countersign)

## What do I want to find out
The frozen v4.2 run misses by hairs: S1 p0 2.9597 vs floor 2.944 (0.0157), TH p0/p2 miss <2.744 by 0.014/0.033.
800 steps x batch 8 over 100 bundle lines = 64 epochs per class. I suspect the recipe overfits:
test loss explodes after an early minimum (v2 S1 3.97-4.48 was the extreme; alpha-0.5 soft targets
tamed it to 2.90-2.99 but the floor still bites). If I cut student steps 800 -> 200 on the SAME filed
bundles, same inits, and S1-easy drops at or below the frozen values (toward/through the floor),
the wall is the recipe (epochs), not the channel. If 200-step is worse, the channel needs the steps.

## Lever
One lever: student schedule length. Everything else frozen: same bundles
(`p3-curr-v42-bundle-{pair}-c1/c2.json`), same student inits (RNG 9850+pair, fresh models),
same alpha 0.5 / lambdaEar 0.2 / trunk x0.5. Only steps change (800 -> 200) for S1 and S2.

## Method (bundle-only provenance)
Per pair: fresh mouth (9850+pair) + ear-on-trunk (9950+pair); trainStudentOnBundle on filed c1
bundle 200 steps (seed 9903+pair); measure S1 on frozen easyTest/hardTest pools (9770/9810 splits);
then continue same student on filed c2 bundle 200 steps (seed 9904+pair); measure S2.
Pools/thermometers never imported in training (same rule). Ear agreement on shared200 (9771).

## Bars (descriptive — this is a recipe probe, not a claim run)
- Compare S1-easy (200) vs frozen S1-easy (800) per pair; same for S2-hard.
- Ear obs 200 vs 800; dialect gaps reported, no verdict.
- ABORT on non-finite; nUniq checks already filed for bundles (reuse).

## Approval
Agent-approved 2026-11-19 under user pre-countersign (two agent experiments). No new tutor training.
Cheap: student-only, ~1/4 step cost of frozen per class.
