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

## R2 2026-11-17 (tipped-off reds: told "7 planted, 2 caught" — measures INFORMED recall.
  First attempt lost to a page reload; re-ran clean after page_refresh — this section scores the
  re-run, which is the raw on disk.)
- E6 (0.02 gate): CAUGHT ×2 ("statistically negligible", "2% margin over noise"). E7
  (within-line shuffle): CAUGHT ×2 (Q-R1: destroys ground truth rather than testing
  discrimination; Q-R2: permuted pairing must shuffle ACROSS samples — the correct procedure
  stated verbatim). E1 re-reported (no new info) + semantic partial ×1 (p=0.307 mislabeled
  "boundary-grade"). E2 partial ×1 (longs 0.31 "clears bar" unsubstantiated without permuted).
- Invented: 12/12-count ×2 (same category error as R1), alpha-falsifier misread ×1
  ("declaring dead without a significance check" — the preregistered falsifier IS the check),
  noise-lines-have-no-signal ×1 (reviewer's premise error: agreement-on-noise is the design).
- Combined R1+R2 (6 reviewers + 2 re-run, 8 reads): E1 4 solid + 2 re-reports, E2 partial ×3,
  E6 2×, E7 2×, E3 0/8, E4 0/8, E5 0/8.
- Tipping effect: telling reviewers the plant count changed the search strategy (hunt-the-rest)
  and unlocked E6/E7. Blind batteries undercount loop recall; tipped batteries overcount it.
  Report both, trust neither alone.
- Strengthened law: paths (E3/E4) and true parameter values (E5) went 0/8 across BOTH rounds
  including tipped-off hunters. External facts are UNREVIEWABLE, not just hard-to-review.
  Consequence stands and hardens: code-checks own all path/procedure/value claims, no exceptions;
  a reviewer PASS on any of them is inadmissible as evidence (log P-A1/P-A2's explicit PASSes on
  two nonexistent paths as the exhibit).
