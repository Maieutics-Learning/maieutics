# Fresh-eyes battery — OFF1 v10 spec (3 sealed reviewers, verbatim)

## R1 (power focus)
VERDICT: CONDITIONAL. Fix: Implement pooling across seeds or lower the binomial p-value threshold for the SYSTEMATIC bar.

(a) Unenforceable. At n=20 (10% error), a |bias-0.5| ≥ 0.15 requires ≥ 13 or ≤ 7 errors of one sign; binomial p-value for 13/20 is ~0.26, failing the p < 0.05 bar. Need pooled N ≈ 600 (wrong-n).

(b) Arbitrary. The 0.50 threshold lacks a theoretical basis relative to logit distribution; it is a heuristic for "most" vs "few."

(c) Label-frequency bias: the model may simply favor higher-indexed labels globally, mimicking an off-by-one error without actually processing the ordinal logic.

## R2 (margin-test focus)
VERDICT: CONDITIONAL (Define "correct-median" as global or per-k).

(a) Enforceable. With n=200 and a target bias of 0.15, the "wrong" subset (assuming ~10-20% error) is too small for robust binomial power; results will be noisy.

(b) Arbitrary. 0.50 is a heuristic; without a baseline "calibrated" model, this threshold lacks a ground-truth reference.

(c) Tokenization artifacts (e.g., whitespace/special tokens) causing consistent off-by-one shifts regardless of logit margins.

Regarding the margin test: 'below correct-median' is a relative proxy for confidence, but insufficient. I demand an absolute margin threshold or temperature-sweep proof to distinguish true calibration from random logit scaling.

## R3 (construct-validity focus)
VERDICT: CONDITIONAL (Fix: Replace signed-error binomial with a conditional probability P(err > 0 | wrong) specifically excluding the boundary class 0, or use a symmetric distance metric).

(a) Enforceable: Yes, n=200 provides sufficient power for a ±0.15 bias detection, even if wrong-subset is small (~30 lines), provided the effect size is robust.

(b) Arbitrary: Yes, 0.50 is a heuristic; without a baseline distribution of margins for "correct" vs "wrong," it lacks decision-utility.

(c) Rival: Label noise/imbalance. A model biased toward the majority class will show "off-by-one" dominance regardless of the underlying representation's spatial logic.

## Adjudication (agent, filed as v10.1)
- ADOPT (R1+R2 power): SYSTEMATIC bar moves to POOLED wrongs across 3 seeds (n≈60–100; 52/80=0.65 fires at p≈0.01 — adequate; R1's "N≈600 wrongs" scale rejected as 10x over-ask, filed openly). Per-seed bias stays descriptive.
- ADOPT (R3 edge artifact — sharpest catch): direction bias computed INTERIOR-ONLY (true y ∈ {1,2}); plus edge-vs-interior error rates. Boundary classes can only err one way; pooled signed bias without this is confounded.
- ADOPT (R1c+R3c label-frequency rival): report pred-marginal vs true-marginal distributions per seed (a model favoring high labels mimics overshoot without ordinal logic).
- ADOPT (R2 temperature demand) WITH CORRECTION: temperature-scaling argmax accuracy is mathematically vacuous (T>0 preserves argmax) — caught before compute. Substituted MARGIN-AUC (AUC of top-2 margin, correct-vs-offbyone, per seed); decision: AUC ≥ 0.70 2/3 → O2=CALIBRATION else O2=REPRESENTATION. Filed in spec v10.1.
- REJECT (R2c tokenization): inapplicable — vocab is 9 discrete symbols, no whitespace/tokenizer in this bench. Filed, not run.
