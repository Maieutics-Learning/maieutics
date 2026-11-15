# Phase 1.d.vi ensemble-disagreement driver — verdict (RUN 2026-11-14, zero new training)

Method: retrospective from the frozen iii ledger (`phase-1diii-results.json`).
Same filed killHd exams (7008, 200 lines) across all 8 retrained winners, so
line i is comparable across subjects. For each (subject, line) pair (1600
pairs, 146 errors): single-model loudness = 1 − top1; committee-split =
leave-one-out disagreement among the OTHER 7 (1 − |2p−1|, p = mean correct
of others; 0 = unanimous, 1 = 4/4 split — no leakage from the predicted
subject). Target = that subject errs on that line. Comparison by mean
separation (Δ) and AUC (Mann-Whitney, ties averaged).

## Result: committee LOSES, loudness wins

- Loudness: mean 0.0913 correct vs 0.2988 err (Δ = 0.2075), AUC = 0.8515.
- Committee-split (LOO): mean 0.1590 correct vs 0.3112 err (Δ = 0.1522),
  AUC = 0.6274.
- nPairs = 1600, nErr = 146 (all killHd; killA 1600/1600 correct).

Committee-split is above chance but clearly worse than the model's own
loudness. Disagreement-among-plausible-models does NOT beat single-model
1 − top1 for predicting errors here — honest negative for the cheap-doubt
hope. The s313 memorize-lean signature (confident + on-target + wrong) is
exactly the case committees should catch and don't: the failure is shared,
not idiosyncratic.

## Feeds

- F-new: committee-split as doubt signal — CUT at this budget/arch
  (single-model loudness is the better weirdness-meter).
- L0/L1: loudness travels as the calibrated doubt readout; no committee
  premium claimed.
- 1.e.iii: loudness AUC 0.85 supports printing top-1 as the honest number.

Cost: 0 new training, in-worker recompute from filed rows. Pool spend: 0.
