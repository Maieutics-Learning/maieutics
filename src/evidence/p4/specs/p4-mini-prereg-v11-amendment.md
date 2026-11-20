# P4 mini-prereg v1.1 AMENDMENT (COUNTERSIGNED 2026-11-19 — binds the calibration + step rule)

## Why (wall hit in smoke, zero countersigned compute spent)
Smoke (execute_js, this session): stack loads, pools A/B/C guards PASS
(hist exact, SEP 0.0529–0.0534), N2 checksum EXACT [442,252,148,158] at r=4 —
the rebuilt 9100 pool is bit-identical to P2's, READ_R=4 confirmed as P2's
convention, no deviation owed. BUT: 100 steps on 50 lines = 508s wall
(~5s/step, batch-16 bound, pool-size independent). A countersigned 3000-step
train ≈ 4.2h — unrunnable under the 60-min call cap (trainFaded has no resume).
The v1.0 step count (3000, P2 recipe) cannot execute. Nothing trained yet.

## Amendment (calibration first, then set steps by gate)
1. Calibration (E round-1 only, same lines/seed as specced seed-0): trains at
   300 / 600 / 1000 steps (one call each; 1000 steps ≈ 85 min needs... does NOT
   fit — cap calibration at 300 + 600; 1000 only if 600-step timing projects
   it under 55 min). Measure train-agree-E + fresh-B delta per point.
2. Step rule: STEPS = smallest of {300, 600} with train-agree ≥ 0.50 AND
   fresh-B delta ≥ 0.15. Both criteria or escalate (no silent 1000, no batch
   change, no arch change without a second amendment).
3. Everything else in v1.0 stands (pools, seeds, arms, transform, bars,
   operator, direction, attribution). Only the step count moves, and it moves
   once, by this rule, before the loop starts.
4. Cost of calibration: 2 trains + evals (≈ 25 + 50 min), ledgers
   `src/evidence/p4/cal-300.json`, `cal-600.json`. If neither clears the gate:
   file the ceiling, kill the toy loop, do NOT shopping-trip upward.

## Expectation
300 steps lands train-agree ~0.45–0.55 (MEM100 hit 0.97 on 100 lines; 500
noise lines at 300 steps ≈ 9–10 presentations/line — thin but nonzero);
fresh-B delta ~0.10–0.20 (run-1's 0.25 at full strength). 600 likely clears
both gates. The risk owned: a weak carrier compresses all downstream effects
toward zero — the calibration gates exist to refuse an instrument that can't
resolve what it's asked to measure.

## Pre-mortem
Strongest objection: fewer steps changes the recipe, so P4's carrier is not
P2's carrier and cross-phase comparisons break — answered: the claim under
test is selection (round-2 minus round-1 within the same recipe), never the
absolute level; P2 numbers are referenced as mechanism context, not bars.
Most likely failure: 300-step carrier too weak (gate refuses) AND 600-step
timing overruns the call cap mid-train (ledger ABORT, no partial credit) —
guarded by running 300 first (timing projection before committing to 600).
