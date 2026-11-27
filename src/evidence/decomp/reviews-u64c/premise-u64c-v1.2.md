# Premise artifact U64c v1.2 (frozen 2026-11-27; round-3 reviewers read THIS)

v1.1 premise + round-2 rulings (8 findings → 6 filed additions + 2 principled rejections;
details in `reviews-u64c/fresh-eyes-self-u64c-v2-plus-audit-results.md`).

v1.2 changes (analysis/wording only — K=10, bars, trains unchanged): (1) K-COVERAGE
corrected: uniform-PICKS coverage P(all 4 in 10) ≈ 0.78, diet-independent; rationale is
dilution-not-saturation (lock-in breaks without full sweep). (2) ENDPOINT-RATIONALE: ADAPT
primary (response acts in time), EDGE confirmatory; one-legged WORKS honestly labeled.
(3) DIAG-EXPLORE v2: orT−det reset baseline (filed−filed) + detT−orT explore (outcome-only,
orT ceiling noted) + detT−det joint; det-reset ≡ orT (no new arm). (4) DEAD-SEED
PRE-ANALYSIS: s0/s2/s9/s12/s18 unpassable for ADAPT even at 1.0 → needs 15/15 of rest;
bar unchanged by design. (5) exploreSlots logged. (6) exploreRng dedicated stream
G.makeRng(53400+seed). (7) Explore-drag locus: training-time cost, second-order on
frozen-eval two.

The ask: IMPLEMENTABLE | NEEDS-PATCH + hardest test/falsifier, ≤150 words, numbered.
Repeats of answered points without new substance are STALE — say what v1.2 missed or
stand down. Math auditor: verify the dead-seed list against filed dice adaptEarly
(0.9733/0.96/0.9533/0.9267/0.96 → +0.10 unreachable) and the 0.78 pick-coverage arithmetic.
