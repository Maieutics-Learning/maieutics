# Twins v0.8 CURRICULUM v3 DRAFT (2026-11-18) — UNCOUNTERSIGNED, no compute

Supersedes v2 only on the hard pool + bars. Everything else identical to
`p3-twins-v08-curriculum-draft.md` v2 (same seeds except hard-pool generator,
same 800-step recipe, same 3 pairs, same frozen-test matrix, same thermometers).
Isolates one variable: hard goes from unlearnable noise to harder-but-real.

## Change 1: hard pool is a real pattern, harder to find

- EASY unchanged: lag-1 repeat, `x[t] == x[t-1]` with p=0.35, seed 9770, 600 lines
  (500 train / 100 held-out test). Bigram diagonal-heavy. Mouth learns "copy last".
- HARD-V3: lag-2 copy, `x[t] == x[t-2]` with p=0.35, else `rng.int(19)`, seed 9810,
  600 lines (500 train / 100 held-out test). Same vocab 19, same lengths
  (first half [10,15,20], second half len-50), same count.
  - Why harder: unigrams uniform, bigrams uniform (unlike easy). Signal lives
    only in trigrams. A bigram table or "copy last" gets nothing; must attend
    back 2. Attn h48 can do this (F-series distance addressing), so learnable,
    but strictly harder to find than easy.
  - Example easy test line (lag-1 stutter):
    `[1,5,5,5,6,3,3,0,0,7,5,2,12,12,14,14,...]`
  - Example hard-v3 line (lag-2 echo, same seed stream shape):
    `[a,b,a,c,d,c,e,e,b,e,...]` — e.g. positions 0,2 match; 3,5 match.
    No adjacent stutter; echo one step further back.

## Change 2: bars calibrated vs chance (kills vacuous passes)

Chance floor `ln(19) = 2.944`. Old bars compared only to S0 init (3.2-3.3,
miscalibrated high), so drift to 3.0 passed. New bars require beating chance:

- TE gate (tutor-easy): `tutor-E easy < 2.744` (chance − 0.20). v2 measured
  2.65/2.62/2.61 — passes under both, no change.
- TH gate (tutor-hard): `tutor-H hard < 2.744` (chance − 0.20). v2 measured
  3.02/2.98/3.00 — FAILS under v3 (as it should: noise was unlearnable).
  v3 predicts PASS by learning lag-2.
- CLAIM 1: `S1 easy < 2.944 AND <= S0 easy − 0.20` (must beat chance, not just S0).
- CLAIM 2: `S2 hard < 2.944 AND <= S1 hard − 0.20`.
- DIALECT unchanged (gap >= 0.15, both thermometers, 200-line pool 9771).
- W unchanged (tutor gates pass but both claims fail on >=2 pairs → close line).

## What stays identical (isolation)

Tutors 9840-42, students 9850-52, blinds 9860-62, class-gen 9871/9872+pair,
stage-gen 9880+stage, blind-gen 9889+pair, U1 pool 9771, 800 steps lr 5e-3
batch 8, ancestral T=1.0 prefix-3 gen, 100-line classes. Thickness fix
(100 lines x 800 steps = 64 epochs overfit) DELIBERATELY deferred to v3b so v3
measures only the hard-pattern change. Expect CLAIM 1 to fail again by design.

## What countersign approves

Lag-2 hard generator above, seed 9810 reuse filed (new stream, same number),
chance-calibrated bars (2.744 gates, 2.944 claims), all unchanged v2 seeds/
recipe/matrix. Any change = new version.
