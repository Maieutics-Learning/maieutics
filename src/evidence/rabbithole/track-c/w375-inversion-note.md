# Wave 375 (execution; backlog-W317 order-inversion autopsy, sandbox) 2026-11-12
STOP RULE: stopped after per-fold rank audit + resub flip + frozen-z LOO on
w232+w300 rows (32 folds; receipt exact vs w283 ladder). 1 direct +
1 tangential below. Spend: 0 + 0 + run. Script
scratch/track-c/w317-inversion.js (56/56 line-verified from w300-sign.js);
grid scratch/track-c/w317-grid.json.

## Direct: inversion without information — flat resub, perfect LOO inversion

- RECEIPT: looAUC 0.000 + nPos 19 exact vs w283 ladder (lam=1/k=50 row).
  The audit extends the validated autopsy, doesn't rebuild it. (Note: the
  .104 from W354 was the *constrained* trnLOO; unconstrained trnLOO here is
  0.000 — same object, different readout. Readout-address, W313.)
- (a) PASS DECISIVELY: positive-slope folds misrank too — posMeanFrac 0.000
  across all 19 positive folds AND negMeanFrac 0.000 across all 13 negative
  folds. Not one fold in either sign group correctly ranks its held-out
  point against the opposite class. The inversion is sign-blind: it does
  not ride on the negative-slope folds.
- (b) REJECTED — and the rejection is the finding: there is no
  resub-vs-LOO flip because resub itself is flat-chance (b1 0.0082 ≈ 0,
  resub AUC 0.485). The feature carries NO in-sample signal at all, yet
  LOO inverts perfectly (0.000). Inversion without information: the ranks
  are manufactured by the holdout loop, not measured from the data.
- (c) PASS: frozen full-sample mu/sd does NOT rescue (fzAUC identical
  0.000; resub-slope-on-frozen-z just reproduces resub chance, rzAUC .485
  = resub value). The standardization channel is ruled out — within-fold
  z-shift is not the inverter. The inversion lives in the leave-one-out
  slope-fitting dynamics themselves.
- Verdict: USED with teeth (w375-inversion-note.md is this file).
  Sign-blind perfect misranking (32/32 folds at 0.000 in both groups) +
  resub-flat-chance (no flip to explain — the loop manufactures order) +
  frozen-z ruled out. Spawned W334 (inversion-mechanism probe, zero new
  sims on w317+w232+w300 rows: per-fold slope-vs-heldout-leverage — does
  each fold's absence flip its own slope sign; influential-point audit;
  single pivot fold vs distributed).

## Tangential: an AUC of exactly 0.000 is a structure, not an estimate

- A chance-AUC comes with noise (.485 ± wobble); a 0.000 across 32 folds
  with identically-zero per-fold fractions is exactness, and exactness in
  an estimator output points at the procedure, not the data. Rule: when
  resub is flat (b1≈0) and LOO is perfectly inverted, validate the loop
  (frozen variants, resub baseline) before theorizing the data — the
  holdout machinery manufactures order out of nothing here.
