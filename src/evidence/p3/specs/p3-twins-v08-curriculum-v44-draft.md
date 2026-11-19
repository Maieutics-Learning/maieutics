# Twins v0.8 CURRICULUM v4.4 DRAFT (2026-11-19) — UNCOUNTERSIGNED, no compute

Inherits v4.3 (single trunk/brain, 200-step student + replay, bundle-only, IF/THEN bars, W).
ONE change: the ear buckets. (Spec change = new version.)

## Problem (Observed, v4.3)
Fixed thresholds (<1.5/<2.2/<2.7/else) put 79% of tutor-entropy positions in one bucket
(filed marginal [21,640,2492,2]/3155). Majority predictor scores 0.79, so the absolute
0.80 EAR-BAR is nearly free: real ear 0.82-0.87 (+0.03 over marginal), shuffled ear 0.78-0.87.
The gap rule voided the bar 3/3 as designed — the ruler, not necessarily the channel, is broken.

## Change: adaptive quartile buckets (tutor-originated, filed per-pair)
Per pair, before ear training: run the tutor mouth over its own 200 ear-train lines, collect all
per-position entropies, take the 25/50/75 percentiles as cut points (filed in ledger as
`bucketCuts: [q25, q50, q75]`). Buckets = quartile bands (4 balanced classes, marginal 0.25 each).
Everything else about ear training is unchanged (head-only, trunk frozen, stability probe).
Rationale: quartiles are tutor-originated (its own uncertainty distribution), keep 4 bands and all
threshold machinery, but make 0.80 mean something again (0.55 over marginal instead of 0.01).

## Consequences (filed openly)
- Tutor ear retrains (new targets) -> new tEar -> NEW bundles (v44-bundle files; tutor mouth
  untouched, lines may be regenerated with same seeds for comparability or reused — decision: reuse
  v4.2 lines, recompute only tEar with the retrained ear; filed as CHOICE).
- Student reruns combined recipe (200 + replay) on v44 bundles.
- Nulls rerun at v4.4: shuffled (expect teeth now: shuffled should sit ~0.25 vs real >= 0.80),
  blind + synthetic unchanged in form.
- EAR-BAR keeps 0.80 + Wilson + delta>=0.20 + gap rule (gap rule now discriminates by construction).

## What do I want to find out
Does the ear channel carry real signal once the ruler is fair? PASS = real ear >= 0.80 with
shuffled <= 0.40 (gap >= 0.10 rule holds the bar). FAIL = real ear collapses to marginal —
then the channel itself is weak and the ear project closes.

## Approval
COUNTERSIGNED 2026-11-19 (user "point 4 countersign"). Tutor ear + bundle + student compute authorized. Any content change = v4.5.
