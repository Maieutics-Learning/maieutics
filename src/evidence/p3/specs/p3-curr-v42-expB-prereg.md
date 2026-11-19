# Experiment B — replay against forgetting (agent-approved under 2026-11-19 pre-countersign)

## What do I want to find out
Frozen v4.2 forgets: retention (S2-easy minus S1-easy) +0.55/+0.61/+0.62, and ear agreement slides
0.85-0.87 -> 0.67-0.75 after class-2. I suspect single-shot sequencing (class-1 then class-2, no
revisit) wipes class-1. If S2 trains on a 50/50 replay mix (half class-1 lines + half class-2 lines,
each with its own bundle's tutor softs), and retention returns toward ~0 while S2-hard holds or
improves and ear holds higher, the lever is replay — the student needs the old textbook open while
reading the new one. If replay rescues easy but tanks hard, capacity (not sequencing) is the wall.

## Lever
One lever: S2 data mix. S1 identical to frozen (800 steps on c1). S2 = 800 steps on replay mix:
each batch item drawn 50/50 from c1-bundle lines vs c2-bundle lines (bundle RNG streams kept
separate; tutor softs travel with their own lines). Same inits (9850+pair), alpha, lambdaEar.

## Method (bundle-only provenance)
Per pair: fresh student (9850+pair) + ear (9950+pair); S1 = trainStudentOnBundle(c1, 800, 9903+pair);
S2replay = joint replay training 800 steps (seed 9914+pair): per batch slot, coin-flip c1 vs c2,
line + tLogits + tEar from the chosen bundle. Measure S1/S2 on frozen tests, retention, ear obs on
shared200, dialect descriptive. Blind/dialect grading unchanged.

## Bars (descriptive)
- Retention (S2easy - S1easy): frozen +0.55-0.62 vs replay — rescue = toward 0.
- S2-hard replay vs frozen; ear obs replay vs frozen; dialect reported.
- ABORT on non-finite.

## Approval
Agent-approved 2026-11-19 under user pre-countersign. No new tutor training. Medium-cheap:
student-only (800 + 800 per pair, same as frozen student cost).
