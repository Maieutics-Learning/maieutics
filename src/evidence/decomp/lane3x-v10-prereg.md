# Lane 3 extras v10 — retention curation from TEACHES-BUT-ERASES (countersigned practice program)

Agent approval: this file. User countersign: 2026-11-23 practice program (≤5 extras/lane post-verdict).

## Why
v10.1: gated R3 learns reverse (0.915-0.97, +0.57..+0.69 over fixed) + transfers to reverse-long (+0.21..+0.43), but forward collapses (0.25-0.31 vs 1.0). Gates allocate; nothing retains. Curate retention + the SecondHead selection test.

## Arms (R=3; same recipes/rng conventions as v10.1; resume-safe)
- X1 REPLAY (3 trains): gated with R3-mixed batches (75% reverse + 25% forward-1..3 replay), same gates/caps. Bar BOTH-HELD: in-dist >= 0.80 AND rev >= 0.80, 2/3. Expectation: RESCUES (Lane2 X1 rule: train mixed or not at all).
- X2 DOSE200 (3 trains): gated prefix, R3 capped at 200 steps then stop (total = r1+r2+200). Bars: REV-DOSE rev(750+) > rev(200) AND ERASE-DOSE in(200) > in(750+), 2/3 (less R3 = less learned + less erased). Expectation: both hold.
- X3 SELECT (6 trains): R1/R2 gates as v10.1, R3 fixed 800 steps; R3 batches top-half by current-model CE (CE arm) vs uniform RANDOM arm (same init per seed, stream offset like selfdir). Bar: SELECT-HELPS ce rev >= rand rev + 0.05, else NO-DIFFERENCE |Δ| <= 0.05. Expectation: NO-DIFFERENCE (selfdir precedent: CE carries no learnability signal).
- X4 SAVINGS (3 trains): gated v10.1 retrain + 100 forward-1..3 steps; eval in/rev. Bar: RECOVERS in >= 0.90 (dormant/savings) vs ERASED in < 0.60. Expectation: fast recovery (open either way).
- X5 GATE99 (3 trains): R2 gate 0.99 (cap 400). Bar GATE-INDEPENDENT: r2 steps longer than v10.1 AND gated in <= 0.40 (erasure stands regardless). Expectation: holds — gates don't protect, retention does.

## Cost
18 train-equivalents (~25-40 min, split across calls, COMPLETE-gated). Ledgers `d-lane3x-{x1,x2,x3ce,x3rand,x4,x5}-s{seed}.json` + verdict. NO PUSH.
