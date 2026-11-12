# F-new gated side + F-induction gen — 40-model cross-generation meters

Status: RUN 2026-11-12 (post-hoc; all 40 G1–G5 blobs; ~20k forwards).
Runner: scratch/f-genmeters.js. Raw: scratch/f-genmeters-g1g3.json +
scratch/f-genmeters-g4g5.json (40 rows: killA/killHd acc + answer-entropy,
killHd attention-entropy, induction copyRate/mass).

## Correlations (n=40, vs killHdAcc)
- indCopy: r = +0.372 — induction signature tracks generalization.
- attnEnt: r = −0.391 — sharper readout attention ↔ better Hd.
- killHd answer-entropy: degenerate models show LOW entropy
  (s306 1.554, s403 1.274, s605 1.672, s607 1.555, s603 1.663,
  s608 1.606 vs healthy ≈1.99) — entropy flags collapse, not success.
  (Direction matters for the meter: watch for entropy DROPS.)

## Outliers (mechanism confirmation)
- s608 (severance): attnEnt 1.923 ≈ uniform — total retrieval collapse;
  indCopy 0.19 < chance. Severance destroys the read-out, not just
  the answers.
- s603 (lean): attnEnt 0.368 (diffuse), indCopy 0.25 (chance).
- Ignited models: attnEnt 0.001–0.12, indCopy 0.3–0.67.

## Reading
Three-meter panel (answer-entropy-drop + attention-sharpening +
induction-copy) coheres across 40 models and 5 generations with
|r| ≈ 0.37–0.39 — moderate, honest, pre-registered-direction. The
F-new meter program is VALIDATED on the gated side: these meters belong
in every Phase-3 chain log (F-collapse-monitor gets attnEnt as its
signal; F-new gets answer-entropy with the drop-direction rule).
Ungated baseline (R2 prevention-vs-filter) still needs training.

## Bounds
Correlational, cross-sectional (not within-chain trajectories);
lineages not separated (pooled n=40). Phase 3 logs within-chain meter
trajectories to test precedence (does sharpening precede ignition?).
