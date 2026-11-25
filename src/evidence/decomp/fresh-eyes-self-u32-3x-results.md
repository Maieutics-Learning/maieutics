# Fresh-eyes battery: self-u32-trunk-repro-prereg.md v1.0 (3x sealed, parallel)

Method: file text read from workspace + 3 parallel reviewer calls (reviewer labor only; never training signal). Each reviewer saw ONLY the prereg + <=200-word return shape (VERDICT / patches / HEALTH / cheapest experiment).

## Verbatim

U32-R1: IMPLEMENTABLE. (1) Log the maxAbsDiff magnitude if U32-BIT fails (binary fail useless for Float64 drift vs recipe divergence). (2) Define bit-identical as binary_compare(serialized_params) to avoid float-precision noise in maxAbsDiff. HEALTH 4/4 PASS. Cheapest: Null-Run (zero-step init bit-compare isolates init-drift from training-drift).

U32-R2: IMPLEMENTABLE. (1) Symmetry check: if BIT fails but FUNC passes, log the weight-permutation mapping to prove param symmetry, not noise. (2) Stream validation: hash the data stream before training to prove the "identical" stream is the same bytes. HEALTH 4/4 PASS. Cheapest: single-seed dry run (1 step); if dP != 0 at step 1, recipe insufficient.

U32-R3: IMPLEMENTABLE. (1) Define maxAbsDiff precision (f64 epsilon; register-spill/Kahan false negatives). (2) Lock runWinnerEval seed to the W6 constant to prevent data-shuffling confounds in FUNC. HEALTH 4/4 PASS. Cheapest: single-epoch smoke (s0, first-gradient compare vs saved W6 checkpoint) before full 800st.

## Adjudication (3x IMPLEMENTABLE unanimous -> v1.1 pins-only, no design change)

- ACCEPT-reporting (R1-P1/R1-P2/R3-P1 converging, top risk): P1a BIT-failure reporting — on any BIT miss log maxAbsDiff magnitude + worst array + binary-compare note (f64 epsilon; register-spill/Kahan caveat filed). BIT bar stays exact 0.0 (no tolerance move).
- ACCEPT-audit (R2-stream/R3-lock): P1b stream validation — Wave 0 logs first-N draws hash (init/data/mask streams per seed) for frozen vs retrain + asserts eval-row identity (same eval seeds/streams as W6). Proves "identical" is byte-identical before any step.
- ACCEPT-audit (R1/R2/R3 cheapest converging): P1c dry-run gates — Wave 0 runs zero-step init bit-compare + 1-step gradient compare per seed as audit gates before the full 800st retrains (cheap, still needs countersign; no compute now). A step-1 dP != 0 = HALT with recipe-insufficiency finding (kills the wave for cents).
- ACCEPT-conditional (R2-symmetry): P1d symmetry rule — BIT-miss + FUNC-hit files PARAM-SYMMETRY hypothesis ONLY with the permutation mapping + magnitude (follow-up owed, never assumed in this wave).
- Round score: 4 pins, 0 design changes. HEALTH 12/12. Proceed to v1.1 (pins below in prereg), NO COMPUTE until fresh countersign for Waves 0-2.
