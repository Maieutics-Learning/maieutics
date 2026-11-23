# OFF1 v10 — off-by-one autopsy on filed ADD4 models (FROZEN for review battery)

Agent approval: this file. User countersign: 2026-11-23 ("up to you where you want to go next" — direction chosen by agent: attack the systematic off-by-one). Scope: O1 = 3 units (zero-training diagnostic, R=3 seeds on FILED d-r2-add4 models); O2 intervention specced AFTER O1 verdict (adaptive). Every unit R=3; quorum 2/3; CPU-only in-worker; NO PUSH.

## Why (program closeout questions)
Off-by-one is 44–100% of add errors across every add model (K3P, ADD4P). ADD4 oracle sits at 0.825–0.925 — if the off-by-one mass is low-margin (calibration), a zero-retrain fix lifts add AND composed (product) for free. If it is high-margin systematic overshoot, O2 needs targeted dose or explicit carry supervision. O1 decides which.

## Design (zero training; restore filed d-r2-add4-s{seed}.json params into attn h48/m96/d16/vocab9/classes4; oracle lines byte-identical to R2 oracle: composeGenShiftScr via srng 52500+seed, x = flat+[qk,k,v,8], n=200)
Per oracle line record: true y, pred, signed error (pred−y), top-2 logit margin, k = e.k (hop count / difficulty tag from the generator — record e.k alongside).
Report per seed:
- ERR-HIST: counts of signed errors in {−2,−1,0,+1,+2,other} (other = |err|>2).
- DIRECTION: P(err>0 | wrong) vs P(err<0 | wrong) — overshoot bias + binomial p (two-sided, p=0.5, n=wrong).
- PER-K: accuracy + off-by-one share per k value present.
- MARGIN: median top-2 margin on correct vs off-by-one vs other-wrong (three medians); LOWMARGIN-SHARE = fraction of off-by-one errors with margin below the correct-median.

## Bars (quorum 2/3; verdict d-off1-verdict.json)
- OBO-DOMINANCE (descriptive, no gate): off-by-one share of wrong, per seed (confirms 44–100% range on ADD4 specifically).
- DIRECTION-BIAS (primary): |P(overshoot|wrong) − 0.5| ≥ 0.15 with binomial p < 0.05, 2/3 seeds → SYSTEMATIC else MIXED.
- CALIBRATION-OPENING (decision, pre-registered): LOWMARGIN-SHARE ≥ 0.50, 2/3 seeds → O2 = CALIBRATION work (temperature/threshold/decision-rule on frozen model); else → O2 = REPRESENTATION work (near-miss-targeted dose or explicit carry supervision retrain). Either way a ROUTE, not a FAIL.

## Expectation (filed open)
OBO share 0.5–0.7; overshoot bias SYSTEMATIC (models round up — lean, from K3P k3-worst pattern); margins: off-by-one below correct-median but not by much → lean CALIBRATION route but under 0.50 share (borderline, decided by quorum honestly).

## Nearest-failure
- K3P confusion rows (differ: K3P profiled t2/cb-oracle, not dose-lifted ADD4; no margins, no signed direction).
- ADD4P worst-lift residual 100% off-by-one s0 (differs: single-seed anecdote; O1 measures all 3 seeds with direction+margins).

## Amendment v10.1 (pre-compute pins; blind battery 2026-11-23 — 3x CONDITIONAL)
- SYSTEMATIC bar moves to POOLED wrongs across 3 seeds (per-seed bias descriptive). R1's "N≈600 wrongs" scale rejected as 10x over-ask: pooled n≈60–100 suffices (52/80=0.65 fires at p≈0.01).
- Direction bias INTERIOR-ONLY (true y ∈ {1,2}); plus edge-vs-interior error rates (R3 edge-artifact adopted — boundary classes can only err one way).
- Pred-marginal vs true-marginal per seed (R1c+R3c label-frequency rival).
- CORRECTION to battery adjudication: the promised "temperature sweep T∈{0.5,1,2} on argmax accuracy" is VACUOUS (positive monotone transform preserves argmax — T changes nothing; caught before compute, filed openly). Substituted MARGIN-AUC: AUC of top-2 margin as correct-vs-offbyone classifier per seed (threshold-free, honest zero-training calibration test). Decision rule: MARGIN-AUC ≥ 0.70 on 2/3 seeds → O2=CALIBRATION (a margin-gated reject/second-guess rule can harvest the mass) else O2=REPRESENTATION. LOWMARGIN-SHARE stays descriptive.
- REJECT R2c tokenization rival: inapplicable (vocab 9 discrete symbols, no tokenizer).

## Cost
0 trains + 3 diagnostic evals (restore + 200 forward passes each, seconds), COMPLETE-gated. Driver: runOFF1Diag. O2 (≤5 units) specced after verdict. NO PUSH.
