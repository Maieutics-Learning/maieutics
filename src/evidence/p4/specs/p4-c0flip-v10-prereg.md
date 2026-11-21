# F2 (C0-flip): teach the learnable v1.0 (PRE-COUNTERSIGNED 2026-11-21 user order; agent approval: this file)

## What do I want to find out
Test the D-vs-C0 synthesis directly: C0 showed weighting toward FAILED
(high-gap, near-chance tiers) yields ~0 (true-unif +0.06, FAIL). D showed
weighting toward LEARNABLE tutor-competent material yields +0.16 (ranking
p~=0.005). Does INVERTING C0's transform — weight toward LOW-gap (learnable)
cells — beat uniform? A pass flips the program's selection direction
(re-weight toward failed cells -> re-weight toward the competence frontier);
a fail at both directions says C0 has nothing to select, period.

## Research check
Nothing external: r1b scores/weights/pools/held-out all filed in-repo. Proceeding.

## Design (same C0 v1.1 setup, flipped transform, fresh pools+brains)
SCORES: reuse filed c-r1b-s{0,1,2}.json gaps (stand — no recompute).
TRANSFORM (inverted): need = max(0, EASY_CAP - gap), EASY_CAP = 0.60
(~= max observed gap + margin; lowest-gap cells get most mass), raw = need +
FLOOR 0.05, w = raw/sum. Everything else (6 cells, arms structure) same shape.
ARMS per seed s (fresh pools 12280+s n=600 + fresh students, held-out SAME 12220):
- easy: inverted weights, students 12291+s*10+0... (students 12291/12292/12293 + arm offset; filed in ledger)
- unif-fresh: uniform on the SAME fresh pools (pool-difficulty confound removed;
  costs 3 extra trains, worth it).
CONTROL note: filed c2-r2-unif (old pools) reported descriptively, NOT the bar
comparator (different pools).
BAR: easy - unif-fresh held-out gain >= +0.10, 3/3. Sensitivity 0.05/0.20.
No operator (2-arm focused direction test; ranking easy>unif per seed descriptive).

## Expectation (scored at verdict)
PASS 2/3 (owned uncertainty — flip is a hypothesis: easy tiers may already be
saturated (S1 near floor there => little headroom) while hard tiers carry the
only headroom. If easy saturates AND hard is unlearnable, both directions read
~0 and C0 closes with 'nothing to select'.)

## Pre-mortem
Strongest objection: easy-weighting just re-teaches what S1 already knows
(headroom argument) — answered: that IS the empirical question; the bar prices
it (a ~0 outcome with small |easy-unif| says saturation, filed as such).
Most likely failure: easy ~= unif ~= 0 (saturation + no headroom) — informative
close of C0, not a failed run.

## Nearest-failure
C0b (differs in exactly one priced way: transform direction flipped; same
scores/pools-shape/recipe/metric. The pair prices DIRECTION, holding all else.)

## Cost
6 mouth trains (~1 min each) + evals ~ 12 min, one call.

## Ledgers
src/evidence/p4/f-r2-{easy,unif}-s{0,1,2}.json, f-flip-verdict.json. Driver:
runP4HeteroFlip (fresh pools 12280+s, inverted transform).
