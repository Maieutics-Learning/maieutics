# Lit-lessons battery 1 results (10/10 NEEDS-PATCH, 2026-11-27)

Premise: `src/evidence/u70/premise-lit-lessons-v0.1.md`. Draft: `lit-lessons-draft-v0.1.md`.
Verbatims: `src/evidence/u70/lit-battery/r1..r10`. Round score: 10/10 NEEDS-PATCH (unanimous coherence finding, no valid accept of v0.1 as stands).

## Adjudication (ACCEPT / REJECT / PARTIAL)

- **ACCEPT (1, all 10 converge): kill the "operationalization / correct / license" language.** B2's "correct operationalization of hidden-state inference" (R4/R5/R7/R8), B4's "CUSUM/studentized" jump (R1), A1-(b)'s "predictability pressure without collapse" without a decoder (R2/R9), A2/A3's "retrieval-termination ≈ FA control" (R3/R10), and Mishchanchuk "causal upgrade" (R6) all commit the same error: promoting analogies to derivations and U70 design choices (10-trial grace, FA window, KL weights) to literature requirements. Fix filed: v1.1 downgrades every such claim to analogy/pattern/pointer; thresholds come ONLY from the oracle report, stated as U70 conventions.
- **ACCEPT (2): A1-(b) needs a decoder to be well-defined (R2/R9).** Free-bits + small rep weight + uniform mixture are VAE-bottleneck stabilizers. If the U70 neural model lacks a generative decoder, the anti-collapse claim is undefined and posterior collapse under masking is the predicted failure. Fix filed: minimal-arch REQUIRES cue/reward reconstruction heads (generative grounding) + collapse monitor (KL + latent-usage); prereg carries a representation-failure classification for collapse.
- **PARTIAL (1): grace-sensitivity checks (R4/R5/R7).** Reviewers are right that 10-trial grace is a scoring convention, not a biological constant (ctxAcc is grace-independent; FA needs a grace to be defined). This does not invalidate delay/FA measurement; it requires a prereg sensitivity analysis. Fix filed: prereg reports FA at grace {5,10,15} and delay CDF; gates lock grace=10 pre-hoc.
- **REJECT (0).** No reviewer disputes the bibliography, the oracle numbers, or the separation principle itself; the finding is language-and-licensing, not substance.

## Patch v1.1 (one pass)
`src/evidence/u70/lit-lessons-v1.1.md`: (a) B2 → "benchmarking analog, not operationalization"; (b) B4 → "fast-associative-learning pointer, NOT a CUSUM license"; (c) A1-(b) → " rebuttable analogy; well-defined only with a decoder; collapse is the named risk"; (d) A2/A3 retrieval-termination → "efficiency heuristic, not FA-control pattern; adopt only evidence/inference separation + confidence bookkeeping"; (e) Mishchanchuk → "biological analogy (mice), not causal validation of U70 metrics"; (f) all thresholds explicitly sourced to oracle report as U70 conventions.
