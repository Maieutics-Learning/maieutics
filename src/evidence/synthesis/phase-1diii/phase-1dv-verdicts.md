# Phase 1.d.v energy-score full verdict (RUN 2026-11-14, 8 retrains)

Pilot (`phase-1dv-pilot-verdicts.md`) passed its bar on s313 (energy AUC
0.8306 > loudness 0.737 where top-1 collapses), warranting this full run.
Method: all 8 iii subjects retrained via the exact 1.b recipe (T0 blobs
intact, same engine), filed killA + killHd (7008) re-dumped with full
logits; energy = −logsumexp(logits). Ledger: `scratch/p1dv-full.json`
(per-subject correct/top1/energy rows). Comparisons by Δ and AUC, two
framings: pooled errors vs correct (both exams) and the spec-literal
killHd-errors vs killA-correct.

## Result: energy does NOT replace top-1 — CUT as the general meter

- Pooled (nCorrect 3054, nErr 146): loudness Δ = 0.255, AUC = 0.9293;
  energy Δ = 2.9307, AUC = 0.8938. Loudness wins.
- Spec-literal (killHd-errors vs killA-correct): loudness AUC = 1.0000
  (killA all at ceiling, separation trivially perfect); energy AUC = 0.9993.
  Both saturate — the framing is ceiling-driven, not informative.
- Pilot nuance stands: on s313 alone (60 errors, error-conf 0.84) energy
  AUC 0.8306 beat loudness 0.737. Energy carries signal exactly where
  top-1 goes blind (confident errors), but pooled it trails loudness.

Ruling: the free weirdness-meter is ruled OUT as a top-1 replacement —
no expensive meter is bought on this basis. Energy kept only as a
conditional companion for high-confidence-error regimes (s313-type),
not as the readout. Feeds F-new as a scoped negative with one
positive pocket, not as L0/L1.

Cost: 8 retrains + 3200 logit dumps in-worker (same order as iii).
Pool spend: 0.
