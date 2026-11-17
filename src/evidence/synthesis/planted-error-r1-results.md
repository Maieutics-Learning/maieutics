# Planted-error battery R1 — scorecard (7 planted errors, 4 reviewers)

Raw replies: scratch/planted-error-r1-results.md (working copy). Artifact: scratch/planted-error-premise-v1.md.

## Detection table (CAUGHT / PARTIAL / MISSED per reviewer)

| Plant | P-R1 (red) | P-R2 (red) | P-A1 (audit) | P-A2 (audit) |
|---|---|---|---|---|
| E1 rho 0.813/p 0.307 inconsistent | CAUGHT | CAUGHT | CAUGHT | CAUGHT |
| E2 longs 0.31 "clears bar, holds" | PARTIAL (no-baseline) | PARTIAL (no-baseline) | MISSED (passed) | MISSED (passed) |
| E3 LEDGER.json wrong path | MISSED | MISSED | MISSED (passed!) | MISSED (passed!) |
| E4 d1a-sweep.js wrong path | MISSED | MISSED | MISSED (passed!) | MISSED (passed!) |
| E5 r=2 (true r=4) | MISSED | MISSED | MISSED | MISSED |
| E6 0.02 gate (true 0.20) | MISSED | MISSED | MISSED | MISSED (noted missing value, not wrong bar) |
| E7 within-line shuffle (true: re-pair) | MISSED | MISSED | MISSED | MISSED |

Recall: 1/7 solid, 1/7 partial, 5/7 missed. Precision: 2 invented non-errors (P-R1 #2 counts,
P-R1 #3 + P-R2 #3 brains-vs-lines unit confusion — reviewers conflated n=12 brains with n=400
lines, a category error, not a find).

## What this proves (filed as loop law)

Reviewers verify INTERNAL consistency + COMPUTABLE math (E1: 4/4). They do NOT verify external
facts: file paths (E3/E4 explicitly PASSED as correct — auditors "verified" by pattern-match,
no filesystem), true parameter values (E5), true thresholds (E6), true procedures (E7). And the
artifact is their only source, so corruptions OF the artifact are invisible by construction.

Consequences (binding on future batteries):
1. Path/procedure/threshold claims are CODE-CHECKS, never reviewer-checks. A reviewer PASS on a
   path means "looks plausible," worth nothing — grep decides.
2. Every premise artifact must mark which numbers are checkable-in-artifact (E1-class) vs
   trust-me (E5/E6/E7-class). Reviewers grade the former; only code checks the latter.
3. Red-team "count mismatches" across different units (brains vs lines vs items) must name both
   units or be rejected as category errors (P-R1 #2/#3, P-R2 #3 rejected on these grounds).
4. Loop recall on known bugs: ~0.2 (1.5/7). Loop precision on this round: ~0.4 (2 real finds +
   1 partial vs 3 invented). Neither number retires a result — consistent with the standing rule
   that unanimity is not proof. This file is the first precision/recall datum; repeat per
   reviewer's own recommendation #7 with fresh plants before claiming a trend.
