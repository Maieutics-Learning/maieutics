# Fresh-eyes battery — O4b v10 spec (3 sealed reviewers, verbatim)

## B1 (harvest fill)
VERDICT: CONDITIONAL. Fix: Quantify harvest size relative to 100; if <100, padding with randoms logically dilutes the intended "repair" density.
(a) Soundness: Questionable; assumes harvest volume is independent of the 0.925 threshold.
(b) Confound: Sample variance—small harvest sizes may lead to stochastic noise overriding the repair signal.

## B2 (product wording)
VERDICT: CONDITIONAL (Fix: Define "track product" as a formal mathematical divergence or a specific failure state in the loss function).
(a) Bar soundness: Moderate; it tests the gap between retrieval-augmented memory and synthetic composition, but "tracking" is too colloquial.
(b) Rival: The "Retrieval Gap"—the model may simply be failing to integrate the retrieved token into the latent space, regardless of whether it "composed" the addition.

## B3 (reseed control — ADOPTED, cheap form)
VERDICT: CONDITIONAL. Fix: Run a reseed control with the same hyperparameters to isolate initialization luck from diet-induced collapse.
(a) Soundness: High; distinguishes between architectural constraints (diet) and stochastic failure (bad-init).
(b) Confounder: Hyperparameter sensitivity—the "bad luck" may actually be an unstable learning rate interacting with the dieted width.

## Adjudication (agent, filed as v10.1)
- NOTED (B1): design already pads + logs nHarvest per seed (ledger field); dilution question answered by the s2-vs-s0/s1 contrast (s2 harvests most by construction).
- ADOPT wording (B2): product-check formalized as |composed − retrieve×oracle| ≤ 0.05 (O3 precedent); the "retrieval gap" rival is exactly what a product VIOLATION would show — tripwired, not missing.
- ADOPT cheap form (B3): +1 reseed-control train on s2 ONLY (unmodified cb diet, fresh trainSeed 55200) → if control ≈ 0.775, s2 is diet-hard (repair meaningful); if control ≈ 0.93, s2 was bad luck (repair = reseed effect). One train, decisive.
