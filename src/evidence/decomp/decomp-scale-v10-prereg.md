# Scale staircase for decomposition v1.0 (user-ordered 2026-11-22; agent approval: this file)

## What do I want to find out
v10: h48 tutors do NOT stepwise-decompose 2-chain 2-hop (sensitivity ~0.27,
step-1 at chance). Is decomposition achievable by (a) simplifying the puzzle,
then (b) scaling the model? Climb rung by rung, stop at the first rung where
it is possible.

## Research check
In-repo only (same stack, same tutors where reused). Proceeding.

## Ladder (run rung k+1 IFF rung k fails its bar; STOP at first pass)
- R0 SIMPLE/cheap (eval-only, REUSES filed v10 h48 tutors s0-2, no retraining):
  single chain (a->m, m->e) + 2 PLAIN distractor pairs (no competing chain),
  query a. Fallback list shrinks to [runner-up, DIRECT] (no other chain);
  diag sensitivity uses a distractor key. Ledger slug single-h48.
- R1 DUAL/h96: original 2-chain puzzle, fresh h96 tutors (m=2h, d=16, same
  1-hop recipe/steps/gate 0.60). Slug dual-h96.
- R2 DUAL/h192: same at h192, BUDGET-GATED: any single train > 40 min ->
  ABORT rung (filed, informative: scale wall).
RUNG BAR ("possible", quorum 2/3 seeds): query-sensitivity > 0.50 AND
sub1==mid rate > 0.40. (Lenient: true per-query resolution implies
sensitivity near 1; 0.5/0.4 is the "something is happening" line.)
v10 dual/h48 is the filed failing baseline (sens ~0.27, sub1 ~0.27).

## Expectation (scored at verdict)
R0 PASS (single chain removes the competing doubled token; the frequency
heuristic then points at the right chain and stepwise resolution can ride
along). If R0 passes, R1 is still run (the user's question is about the HARD
puzzle at scale, and v10 already failed it at h48).

## Pre-mortem
Strongest objection: R0 may pass WITHOUT stepwise thought (single doubled
token -> constant function scores perfectly while sensitivity stays low).
Answered: the bar REQUIRES sensitivity > 0.5, which a constant function
cannot pass — R0 passing means per-query resolution, honestly earned.
Most likely failure: h192 wall-blowout -> budget ABORT, ladder ends at h96
evidence; or flat fail everywhere -> decomposition off-the-table at
bench scale (filed finding, not a void: 5 rungs x 3 seeds).

## Nearest-failure
v10 (differs: same puzzle harder (2 chains), one scale (h48). This ladder
prices simplicity and scale separately, cheapest first).

## Cost
R0 ~10 min (eval-only). R1 3x h96 trains (unknown; s0 probed first, batched
by measured wall). R2 gated by R1 walls + 40-min rule.

## Ledgers
src/evidence/decomp/d-scale-{single-h48,dual-h96,dual-h192}-s{s}.json +
d-sdiag-...-s{s}.json, d-scale-verdict.json. Driver: decomp-driver.js
(genLine mode, runDecompTutorH, runDecompScaleEval, runDecompScaleDiag).
Trac: transcript 2026-11-22-decomp.md.
