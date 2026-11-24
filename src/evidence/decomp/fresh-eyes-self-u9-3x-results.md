# Fresh-eyes battery: self U9 read-restored adapt-weighted comparative gate (3x sealed)

Goal line + self-learning framing (unprompted multi-skill pull) carried in every prompt.

## R1 — NEEDS-PATCH
1. 2.0 blunt, STD tax risk. Fix: dynamic weight 1+|corr(m,g)|. 2. vhat_base: gate may replace not adapt. Fix: log saliency Δ=logit(base)−logit(blend), flag hard-switch. 3. Ablate keeps wY so weighting confounds comparison. Fix: cross-ablation matrix (cmp@1.0 vs ablate@2.0).

## R2 — NEEDS-PATCH
1. 2.0 overpay: gate opens to harvest weight, not signal; threatens STD. Fix: symmetric clip / confidence-derived wY. 2. vhat_base leakage: base guess calibrates gate post-hoc. Fix: strict temporal barrier, stochastic/masked base logit. 3. Ablate insufficient: same wY can't separate weighting driver from comparison driver.

## R3 — NEEDS-PATCH
1. Weight-tax leakage (same as R1.1/R2.1). Fix: symmetric scaling with corr(m,g). 2. Causal leak: vhat0→agree makes VITAL artificially easy. Fix: read-only vhat0 register; gate sees only head−base difference, never argmax identity. 3. Ablate overlap risk. Fix: ensure RP6 sees no m-derived logic.

## Adjudication: 3 NEEDS-PATCH → v1.1 CLARIFICATION-ONLY (no new arms, keep blunt 2.0 as the tested hypothesis)
- PIN: both arms share wY=2.0/1.0 — cmp-vs-ablate delta ISOLATES comparison info (weighting equal). Cross-matrix (cmp@1.0 / ablate@2.0) = new arms, rejected to U10 (R1.3/R2.3 closed as design, not flaw: equal-weighting is the control).
- PIN: RP inputs are scalars only (m scalar + a bit + H/beta/dis) — no vhat identity flows into gate (R2.2/R3.2 closed; vhat0 is compose-pass input only, read-only).
- ADOPT (eval-only): saliency Δ + logit saturation flag + corr(m,g)|disagree (R1.2/R2.2 reports, no graph change).
- REJECT: dynamic/corr-scaled weighting, stochastic base logit (optimizer/graph changes → U10). WEIGHT-TAXES-BASE verdict already prices overpay as a filed outcome.
