# F1 (D-P4r): dialect repair — loss-native bars, fresh everything v1.0 (PRE-COUNTERSIGNED 2026-11-21 user order; agent approval: this file)

## What do I want to find out
Confirm the D-path selection signal (true>unif>shuf 3/3, p~=0.005; true-unif
+0.16 mean) with bars that the instruments can actually meet, on FRESH seeds,
brains, and lines. D failed its filed bars on void instruments (floor-flattened
operator, ceiling pile margin); F1 replaces them with loss-native bars
preregistered BEFORE seeing F1 data.

## Research check
Nothing external: all materials/blobs/seeds/recipes in-repo (D-path + Exp-E).
Proceeding.

## Design (level (a); identical machinery to D-P4 except bars + freshness)
MATERIALS: reuse filed pool files d-pool-{strong,detached,base}.json (same
dialects, zero retraining). Tutor L2g9 mouth blob (unchanged).
FRESH (disjoint from D-path + everything prior; 125xx/126xx block):
- Round-1 students t0/1/2: seeds 12501/12502/12503; mix rng 12505+t (100/pool).
- Score vector: same 6 cells, same gap definition, same pre-round-2 gate
  (max-min >= 0.20; D precedent says PASS 3/3).
- Round-2: fresh gen per t (strong 12530+t, detached 12540+t, base 12550+t),
  draw rng 12561+t*10+arm, students 12571+t*10+arm, S-gen 12591+t*30+arm*2+k,
  pile inits for bigram-distill... DROPPED (no pile distill at all in F1 —
  direction is loss-native; bigram-L1 distance Tutor-vs-S2 < Tutor-vs-S1 kept as
  descriptive, computed from S-gen lines, no training).
- Held-out: SAME D-strong 12160 (common metric with D-path; never trained on).
- Arms: true / unif / shuf (same transform GAP_OK=0.30/FLOOR=0.05).
ATTRIBUTION: cite d-n2.json (same metric, |D|=0.33 filed) — no new N2 compute
(rationale: N2 evidence exists on the identical held-out; re-running wastes
compute for a filed number).

## Bars (loss-native, R10 conjunction)
1. DIRECTION 3/3: true-unif held-out loss gain >= 0.10 per seed.
   (D observed +0.10/+0.15/+0.24; bar set BELOW D's mean 0.16 — conservative.)
2. RESPONSIVENESS: full ranking true>unif>shuf in >= 2/3 seeds (3/3 hoped;
   D showed 3/3, p~=0.005).
Sensitivity: direction at 0.05/0.20 reported. Holds-at-exactly-one = tuning
artifact (v1.0 rule carried over).

## Expectation (scored at verdict)
Direction PASS 3/3 (+0.10-0.25 by D precedent). Ranking 3/3 (same mechanism,
fresh draws). Pre-round-2 gate PASS 3/3 (confound is structural).

## Pre-mortem
Strongest objection: F1 is D with friendlier bars (double-dip by design) —
answered: FRESH seeds/brains/lines, bars preregistered pre-data, bar value set
below D's observed mean (not fitted to it). Most likely failure: ranking breaks
(D was 1/200 luck) — accepted risk, that IS what replication is for.

## Nearest-failure
D-P4 (differs in exactly two priced ways: loss-native bars replace void
instruments; everything fresh. Same materials/tutor/transform.)

## Cost
3 r1 + 9 r2 mouth trains (~12 x 1 min) + evals ~ 25 min across resume-safe calls.

## Ledgers
src/evidence/p4/e-r1-t{0,1,2}.json, e-r2-{true,unif,shuf}-t{0,1,2}.json,
e-s1mouth-t{0,1,2}.json, e-p4r-verdict.json. Driver: runP4DialectF1R1/R2
(parameterized fresh-seed variants; same code shape as D-path).
