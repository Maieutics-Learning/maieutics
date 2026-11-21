# F3 AMENDMENT v1.1 (agent-approved under 2026-11-21 user pre-countersign)

## Why (train scores void a third time, zero stage-B compute spent)
m-r1-t{0,1,2} COMPLETE, tutor viable (guard 2.56), gate PASS 3/3 — but all gaps
<= +0.035 (short cells -0.53..-1.07: students MEMORIZE short train lines below
the tutor's own loss; long cells ~0: match). need = max(0, gap-0.30) = 0 in all
6 cells 3/3 -> true = unif = shuf = uniform-with-different-draw-rng. Stage B as
designed measures draw noise. Same root cause as C0-v1.0 (train-loss vs a
reference the student memorizes below); same fix as C0-v1.1 (score on
un-trained lines). F3 R1 blobs ARE saved (m-s1mouth-t*.json) — no rebuild needed.

## Change
1. SCORE POOL: fresh tutor-gen (genLines from filed tutor blob, seed 12645,
   n=300). Same pool all t (common ruler). Disjoint from r1 (12610+t) / r2
   (12620+t) / held-out (12640).
2. Gaps recomputed on score pool with the FILED r1 tercile cuts (same cells).
   New gate: score-gap range >= 0.20 else UNINFORMATIVE (memorization-proof
   version of the pre-round-2 gate). Ledgers m-r1b-t{t}.json (v1.0 files stand
   as the voided attempt, superseded-by pointer inside).
3. Held-out s1held computed in r1b (held-out 12640 regen — deterministic, same
   lines R2 will use). runP4StructMouthR2 reads r1b (one-line path change).
4. Transform, arms, bars, bar VALUES unchanged.

## Expectation
Score gaps positive with spread (student test >= tutor loss: tutor is
~Bayes-optimal for its own emissions; students approximate). Range >= 0.20
(MEMORIZATION hid the spread on train; test restores it). If range < 0.20 the
loop closes UNINFORMATIVE (neutral materials genuinely unselectable — filed).

## Cost
Forward passes only (~2 min). No retraining.
