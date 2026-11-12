# Wave 293 (execution; backlog-W249 ignition-predictor check, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).

- DIRECT: n=32 w232 runs (fresh seeds 103-134), ignition = hard@600>=.9 (20 ign / 12 non).
  LOO-logistic AUC of ignition from prefix@K and trainAcc@K per K in {10,25,50,75,100,125,150,175,200},
  three estimators: (i) v1 plain 50-iter Newton LOO (W237 harness); (ii) v2 ridge LOO (lam/n-scaled);
  (iii) v3 ridge LOO (lam in {1,10} on within-fold z-scores, 200 iters) + rank-AUC reference (no fit, no folds).
- HONEST COLUMN (rank-AUC): prefix@K = .356/.302/.292/.550/.471/.492/.371/.463/.571;
  trainAcc@K = .600/.552/.485/.452/.381/.392/.375/.415/.450.
- PRE-REG SCORE: (a) prefix@200>=.8 — FAILS badly (.571: K200 is NOT a usable ignition predictor on this
  seed set, contra the W272 hope); (b) prefix@200>prefix@50 with @50<.6 — direction HOLDS (.571>.292) but
  @50 is INVERTED signal (.292), not mush: the early-prefix deficit (W272/W252 crossover) replicates as
  anti-signal; (c) trainAcc max<=.65 — HOLDS-ish (max .600 @10, rest <=.552: predicts nowhere);
  (d) prefix@200-prefix@50>=.15 — HOLDS (+.279 on rank).
- ARTIFACT AUTOPSY (the wave's real yield): LOO-logistic AUCs collapse to EXACT 0.000 at most K under EVERY
  penalty (v1 plain, v2 lam/n, v3 lam in {1,10} z-scored — identical zeros), with 32-unique finite probs
  (NaN hypothesis killed by direct per-fold check: nanB=0, nanP=0, full-sample fits finite).
  Mechanism, confirmed by K75 per-fold dump: (1) INTERCEPT artifact — the fold base-rate shift between
  leave-a-neg-out (20/31=.645) and leave-a-pos-out (19/31=.613) folds is logit(.645)-logit(.613)=0.137,
  which DWARFS the slope tilt (|b1|~.03-.08 over z-range ~ +/-2, i.e. +/-0.1): held-out positives
  systematically score below held-out negatives BY CONSTRUCTION (removing a positive lowers the rate);
  (2) SLOPE instability — LOO slope-score AUCs (lam=1 vs 10 identical, so not a penalty problem) wander
  independently of rank-AUCs (@25: .675 vs .302; @75: .196 vs .55; @150: .575 vs .371; @200: .533 vs .571):
  per-fold slopes on n=31 mush features point wherever the removed point dictates. v2's lam/n penalty
  (~0.03 vs h11~2.7) was homeopathic and fixed nothing; v3's real penalty changes nothing either, because
  the disease is in the EVALUATION (LOO+intercept on tiny-n mush), not the fit. An AUC of exactly 0.000
  is a confession of plumbing, not a measurement.
- W198 FEED RELEVANCE (which K a predictor can use): NONE. No K clears .6 except trainAcc@10 at exactly
  .600 (chance-adjacent); if forced, @200 prefix (.571) with a barely-above-chance caveat; early K
  actively misleads (inverted .292-.356 @10-50). LOO-with-intercept is disqualified as an estimator on
  this sample size — rank statistics only.
- Verdict: USED with teeth (w293-auc-note.md is this file; grids in scratch/track-c/w249-grid.json,
  script w249-auc.js v3). Spawned W266 (ignition-predictor autopsy).
- TANGENTIAL (reasoning, 0 spend): the intercept artifact generalizes beyond this grid — ANY
  leave-one-out comparison of intercept-inclusive classifiers on tiny imbalanced samples inherits
  base-rate anti-correlation with the held-out label, so LOO-AUC is pessimistically rigged even for a
  TRUE weak signal; fixed-intercept LOO or slope-only scoring removes the rigging but leaves the slope
  instability, which only sample size cures. Practical rule earned: on n~30 mush, fit nothing — report
  ranks, and treat any exact-0 (or exact-1) LOO-AUC as a harness bug until proven otherwise.
- Spend: 0 + 0. Clock: R46 3/5.
