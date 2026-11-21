# F3 (S-P4b): mouth-loss port on neutral structured pools v1.0 (PRE-COUNTERSIGNED 2026-11-21 user order; agent approval: this file)

## What do I want to find out
Is D-path's signal about DIALECTS or about mouth-world selection generally?
S-P4b ports the v1.0 machinery to mouth-loss on NEUTRAL structured pools (no
dialects, no narrowing, no chain history). Pass => selection works generally in
the mouth world (D's materials were convenient, not necessary). Fail (with D
passing F1) => the signal is dialect-specific (narrowed/transmissible materials
matter). Either way the scope of the finding is priced.

## Research check
Nothing external: structPool/genLines/trainMouth/mouthLoss all in-repo. Proceeding.

## Design (level (a); v1.0 machinery, mouth-loss score vector)
TUTOR: fresh viable structured mouth — train 800 steps on structPool(12600, 600),
seed 12601. Viability guard: held-structured (structPool(12602, 200)) loss <= 2.7
else ABORT as TUTOR-STILLBORN (Exp-E G0 precedent: 1/5 stall expected; guard
filed, no reseed shopping).
MATERIALS: tutor-generated lines (genLines from tutor mouth — student learns the
tutor's emissions, Exp-E semantics).
SCORE VECTOR (tutor-grounded cells, no pile classes available): 2 bands
(short<=20/long) x 3 tutor-loss terciles (intrinsic difficulty: tutor's own
per-line loss on its generations, terciled per pool) = 6 cells.
gap[c] = studLoss - tutLoss per cell (same definition as D-path).
ROUND 1: students t0/1/2 (seeds 12611/12612/12613) train 300 tutor-gen lines
(pool gen 12610); pre-round-2 gate max-min >= 0.20 (D precedent says PASS;
neutral materials may be FLATTER — owned risk).
ROUND 2: fresh tutor-gen lines (gen 12620+t), transform GAP_OK=0.30/FLOOR=0.05,
arms true/unif/shuf, fresh students (12631+t*10+arm). Held-out fresh tutor-gen
(12640, 200). BAR: true-unif held-out gain >= +0.10, 3/3 (same bar as F1 —
the pair F1/F3 is comparable by construction). Ranking descriptive.
No pile anywhere (mouth-native throughout; bigram-L1 descriptive as F1).

## Expectation (scored at verdict)
PASS 2/3 (neutral materials => weaker signal than dialects expected; tutor-loss
terciles may span < 0.2 nats => soft weights. Owned.)

## Pre-mortem
Strongest objection: tutor-loss terciles on self-generated lines span nothing
(tutor equally good everywhere it generates) => uniform-true, void — answered:
the pre-round-2 gate prices exactly this (UNINFORMATIVE, not failed).
Most likely failure: flat gaps (neutral lines equally learnable) => honest
scope bound (selection needs structured difficulty to bite).

## Nearest-failure
D-P4/F1 (differs in the priced way: neutral tutor-generated materials instead
of graded dialects; cells tutor-terciled instead of pool-sourced. Same
transform/arms/bars/metric family.)

## Cost
1 tutor + 3 r1 + 9 r2 mouth trains ~ 15 min across resume-safe calls.

## Ledgers
src/evidence/p4/m-tutor.json, m-r1-t{0,1,2}.json, m-r2-{true,unif,shuf}-t{0,1,2}.json,
m-s1mouth-t{0,1,2}.json, m-p4b-verdict.json. Driver: runP4StructMouth* (tutor +
R1 + R2; tercile cells new ~15 lines).
