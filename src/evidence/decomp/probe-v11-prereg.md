# Probe v1.1: degeneracy adjudication (user-countersigned 2026-11-22; agent approval: this file)

## What do I want to find out
Probe v10 promoted B to FULL-2HOP — but P(a==mid) = 0.25 of lines are 1-HOP
DEGENERATE (query a, pair (a,a), pair (a,4+e): no second hop needed), and
degenerate lines are occStep1-PROOF (removing (a,a) leaves (a,4+e): still
1-hop). Null math fits everything: base 0.46 ~= 0.25x1.0 + 0.75x0.28;
decoyQ 0.50 ~= same; occStep1 0.40 ~= 0.25x1.0 + 0.75x0.20. Was the promotion
bought by 25% free lines + chance? Condition every rate on degeneracy and find
out. (Also reframes v10->v11 drop 0.57->0.47: salience diluted by decoys, not
2-hop stressed.)

## Research check
In-repo only (reuses v10 tutors; fresh N=400 battery, rng 17100+s).
Proceeding.

## Design
LINES: hard-line generator (true + 2 decoy chains + 50% plain). Per line flag
deg_a = (a==m), deg_c = (c1==d1). N=400/seed (deg subsets ~100 lines each).
BATTERY (filed tutors a/b/ab x s0-2):
- baseA = fwd(flat,a)==e; baseC = fwd(flat,c1)==f1.
- occA = fwd(flat minus (a,m), a)==e.
Each rate reported overall AND conditional on deg_a (for baseA/occA) /
deg_c (for baseC). (Query-swap as formerly proposed is SUBSUMED: baseA +
baseC already swap queries on identical flats; the missing variable was
degeneracy, not queries.)
BARS (B-arm, preregistered):
- D1 (degeneracy explains occStep1): B occA|deg_a >= 0.80 AND B occA|¬deg_a
  <= 0.35, quorum 2/3.
- D2 (genuine 2-hop off-degenerate): B baseA|¬deg_a > 0.40, quorum 2/3.
VERDICT matrix: OCC-EXPLAINED + 2HOP-REAL (D1+D2 pass: puzzle dissolves,
promotion stands) / DEMOTION (D1 pass + D2 fail: no real 2-hop; base was
0.25x1-hop + chance + salience; v10 promotion revoked, query-blindness
reinstated) / PUZZLE-STANDS (D1 fail: occStep1 survives off-degenerate;
first-hop channel still unidentified).
Descriptive: same conditionals for AB (predicts baseA|¬deg_a ~= 0.40 —
AB conditions but answers worse); baseC|deg_c symmetry check.

## Expectation (scored at verdict)
D1 PASS (the null math fits three independent rates too well). D2 FAIL
(same math predicts baseA|¬deg_a ~= 0.30). → DEMOTION. Honest 65%: if D2
passes, the promotion was earned and only the puzzle dissolves.

## Pre-mortem
Strongest objection: deg subsets (~100 lines) are noisy (±0.05); a 0.38 with
bar 0.40 is a coin flip, not a finding — answered: quorum 2/3 over seeds
absorbs per-seed noise; report exact rates and let the margin speak; a
0.38/0.39 borderline is filed as INCONCLUSIVE-on-D2, not fail.
Most likely failure: D1 fail because occA|deg_a < 0.80 (removing (a,a) DOES
hurt even degenerate lines — distribution-shift dominates) — filed as
PUZZLE-STANDS with the shift confound named (probe-v10's occDecoy control
says shift helps, not hurts, but a 1-hop default is more fragile than a
salience readout; priced).

## Nearest-failure
probe-v10 (differs: graded unconditional rates; here every rate is split on
the confound v10 never measured).

## Cost
9 batteries x 400 lines x ~4 forwards (h48) ~ minutes, resume-safe.

## Ledgers
src/evidence/decomp/d-probe11-{a,b,ab}-s{s}.json, d-probe11-verdict.json.
Driver: assembly-driver.js (runProbe11Eval).
