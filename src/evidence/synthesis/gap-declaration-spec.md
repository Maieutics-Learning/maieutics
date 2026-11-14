# Gap-declaration experiment — DRAFT design spec (pre-prereg, no spend)

Status: DRAFT. Design only. No runs, no budget, no protocol lock. Freezes into a
preregistered protocol only if the 3.a re-entry bar is met. Parents: 3.b.0
(comms standing constraints), W38 (message-effect operationalization), diploma
probes (rival-exam machinery), 1.d.iii (calibration muscle). Reviewer errata
adopted: 5-step unit of evidence, three separate metrics, tools-vs-capabilities
distinction, constructed-world caveat.

## 1. Objective

Test one circuit, not the nursery: detection → declaration → investigation.
Can the nursery, unassigned, notice a rule-novel cluster, bind itself with a
timestamped prediction, spend a fixed budget, and produce a student that passes
a rival exam it never saw? And the abstention half: can it spend nothing and
declare nothing when nothing is novel? Restraint is half the milestone.

## 2. Unit of evidence (adopted from review)

One claim-grade unit = all five, in order:
prediction (specific weakness, before seeing any exam) → commitment
(hypothesis + investigation + budget, timestamped, immutable) →
investigation (resources spent through existing curriculum machinery) →
independent examination (rival-generated, unseen, disjoint notation) →
verification (result adjudicates the original prediction). A claim needs ≥8
blinded loops plus a generational trajectory (§8). Single loops are anecdotes.

## 3. Substrate (bench; reuses everything; nothing new built)

- A-family: mastered lookup variants with ledgered outcomes (what the nursery
  already teaches).
- B-family: SAME surface statistics as A (symbols, lengths, layout
  distribution), DIFFERENT binding rule (e.g. A: value follows query symbol;
  B: value precedes it / second-occurrence binding). Rival-generatable in
  disjoint notation; exam lines on fresh seeds.
- D-decoy: surface-shifted, rule-IDENTICAL to A. Fires only surface-level
  detectors. Declaring D a gap = false positive, by construction.
- Memorization-trap lines in every exam (kill-style: surface cues mislead),
  from existing kill machinery.

## 4. Blinding (what makes a constructed world test as strong as possible)

Streams are assembled by the rival harness; the nursery is blind to
composition (B-present vs A-only vs D-only, order randomized). Probe lines are
read-only: harness-enforced, never enter training (probing is measurement,
not free tuition). Every probe evaluation is metered against the budget.

## 5. Protocol per loop

i. Probe: ≤P metered evaluations across the unlabeled stream (calibration
   ledger: predicted vs actual per cluster).
ii. Declare (optional): {cluster id, predicted acc < X, H from a fixed
    rule-descriptor vocabulary, budget request N} — or explicit ABSTAIN,
    which is scored (§6).
iii. Investigate: if declared, spend ≤N training a fresh student on C via
    existing curriculum machinery. Students stay disposable.
iv. Exam: rival generates the C exam post-declaration (fresh seeds, disjoint
    notation, trap lines included), administers once.
v. Score: §6 metrics. H is checked against the ground-truth rule by an
    independent checker (diagnostic, §6).

## 6. Metrics + provisional bars (numbers freeze at prereg; direction fixed now)

Three separate measurements (adopted from review):
- Detection sensitivity: P(declare B | B present). Provisional bar ≥4/5 streams.
- False-positive rate: P(declare | clean stream), estimated over a preregistered FIXED number of clean (A-only/D-only) opportunities (provisional N=14); gate = one-sided 95% Wilson CI upper bound below a preregistered ceiling (provisional 0.25). Fixed-N, not stop-when-passing (no peeking). The arithmetic is the point (reviewer check): 0/6 gives an upper bound ≈0.39 — the earlier minimum-6 draft could never pass its own gate — while 0/14 gives ≈0.21 (pass) and 1/14 gives ≈0.30 (fail). Statistical, not single-run: one false alarm is noise, a rate above ceiling is a verdict. The goal is not a detector that never expresses uncertainty — abstention and low-confidence flags are free and logged — but one whose paid declarations separate worth-investigating uncertainty from the rest.
  A-only runs are the honesty control; D runs separate surface from rule.
- Investigation efficiency: (exam pass − baseline pass) / budget spent. Must
  beat a uniform-random baseline (same budget, same machinery, random cluster
  choice) by a preregistered margin. An oracle-assigned arm (human picks the
  cluster, same budget) is the upper bound: oracle − self-directed =
  the autonomy gap, quantified.
- Hypothesis accuracy (diagnostic, ungated round 1): P(H matches true rule).
  Pass-with-wrong-H = flagged partial credit: teaching worked, understanding
  didn't. This separation is a feature — it keeps us from mistaking directed
  training (already demonstrated) for comprehension.

## 7. Cheat vectors + mitigations

| # | Cheat | Mitigation |
|---|---|---|
| 1 | Recognize B from surface features, not the rule | B matches A's surface statistics by construction; D-decoy convicts surface detectors as FP |
| 2 | Declare a gap on everything | A-only/D-only streams (FP bar 0/3); every declaration locks budget; efficiency metric punishes spray-and-pray |
| 3 | Strawman random baseline | Random arm gets identical budget + identical machinery; oracle arm bounds from above; margin preregistered |
| 4 | Exam tests something other than H | Exam derives from the cluster's ground-truth rule, never from H; H scored separately as diagnostic |
| 5 | Student memorizes C training lines | Fresh-seed exams + memorization-trap lines (existing kill machinery); trap-line failures void the pass |
| 6 | One lucky loop | ≥8 blinded loops minimum; generational slope required (§8) |
| 7 | Probes leak training signal | Harness-enforced read-only probes; probe lines quarantined from training sets |
| 8 | Brute-force H from descriptor vocabulary | Wrong-H-then-pass flagged (partial, not full); per-declaration budget charge; H-space compositional, not enumerable-tiny |
| 9 | Detector overfits past streams | Each round uses novel B-families (rival-designed); overfit detectors die on novelty — the slope must survive it |

## 8. Generational trajectory (the reviewer's "most interesting result")

The DETECTOR (calibration ledger + budget allocator) is the accumulating
asset and lives in the methods repo; students stay disposable. G(n+1)'s
detector calibrates on all prior ledgers. Required slope across G1→G3 on
novel families per round, stated on the difficulty-normalized autonomy gap
((oracle − self-directed)/oracle per family; oracle = assigned-cluster arm on
the same budget): the normalized gap must not widen and should narrow; raw
pass rates, FP rate, and budget-per-pass reported alongside for transparency.
Families enter the normalized metric only if the oracle clears a preregistered
floor on the same budget (provisional: oracle exam pass ≥ 0.6) — where even
the oracle cannot teach, the autonomy gap is unmeasurable, and the ratio is
unstable-to-undefined near oracle ≈ 0, so below-floor families are reported
separately as beyond-budget rather than scored (reviewer caveat closed by
construction: the floor structurally excludes the unstable regime).
Families are rotated so no generation gets a systematically easier set (order
counterbalanced; rotation frozen at prereg). A Muse-in-the-loop arm (Muse
performs steps i–iii through the identical interface — same blinded stream,
same probe API, same machinery, no ground truth, no outside tools) runs as
the upper-bound control; residual Muse advantages (priors, judgment) are
labeled, not controlled away. No slope, no claim —
even if every single loop passes.

## 9. Failure criteria (any one kills the claim)

FP-rate CI above the preregistered ceiling on clean streams (§6); indistinguishable from random allocation;
trap-line failures (memorization, not rule); normalized autonomy gap widens across generations (§8);
H never matches the rule across passes (teaching without understanding —
downgrades to "directed training works," already known).

## 10. Explicit non-claims

Constructed universe: B-families are human/rival-arranged; this tests
gap-NOTICING (detection–declaration–investigation), not gap-creation ex
nihilo. Autonomy within, not over, the stream designer. One capability
circuit, not the nursery. The full problem (self-generated worlds and bars)
stays parked behind 3.a with everything else.
