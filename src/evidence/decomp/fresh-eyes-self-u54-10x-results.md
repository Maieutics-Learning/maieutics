# Fresh-eyes battery: U54-EXT2 prereg v1.0 — 10x IMPLEMENTABLE → 10x CONFIRM-STANDS — CLOSED

**Artifact (frozen):** `self-u54-ext2-prereg.md` v1.0 (redesign #1 after U53 FLOOR-FAIL; C1 Phase-1 800 steps, C2 veto closed-init b=-2; bars unchanged). **Reviewers:** 10 NEW sealed contextless, disjoint angles 1–10, ≤200w. **Tool:** page_eval Promise.all root.generateText, no truncation warnings. Cover: user "Lets go redesign and strengthen the brain and go again" = prereg + battery + driver (NO WAVES until fresh countersign).

## Raws (verbatim)
U1: 1) verdict: IMPLEMENTABLE

2) nuB~0.69 vs nuA~0.06 asymmetry risks catastrophic forgetting of A-mapping during B-heavy Phase-2.

3) TUNING. Longer Phase-1 and closed-init are heuristic responses to U53's floor-fail, not architectural corrections.
U2: 1) verdict: IMPLEMENTABLE

2) Phase-1 step-doubling (400->800) risks over-saturation of the 0.98 criterion before the 0.45 floor is secured.

3) TUNING: Closed-init b=-2 is a targeted tuning response to U53's residual leak/mapping failure.
U3: 1) verdict: IMPLEMENTABLE

2) VetoA hairline (0.0502) vs. 0.05 threshold leaves zero margin for stochastic noise in Phase-2.

3) CORRECTION. Closed-init (b=-2) is a legitimate fix for residual leak/mapping failure observed in U53.
U4: 1) verdict: IMPLEMENTABLE

2) Risk of over-smoothing: 800-step Phase-1 with C1's target may collapse gradient before Veto2 closed-init activates.

3) CORRECTION: Legitimate correction to resolve U53 floor-fail by forcing mapping failure via closed-init.
U5: 1) verdict: IMPLEMENTABLE.
2) Risk of over-fitting at 800 steps given U35 ceiling (0.6) vs desired floor (0.45).
3) CORRECTION. Closed-init targets the U53 residual leak by forcing a mapping failure, not just tuning.
U6: 1) verdict: IMPLEMENTABLE

2) VetoA $\\le 0.05$ is too tight given the $\\approx 0.05$ hairline ckpts; risk of premature P5 closure.

3) TUNING: Correction to U53 failure via closed-init and step-scaling to prevent "unlearning" leakage.
U7: 1) verdict: IMPLEMENTABLE

2) Veto switch direction (nuB~0.69) suggests high instability during closed-init transition.

3) CORRECTION: Closed-init targets specific U53 leak failures, not general tuning.
U8: 1) verdict: IMPLEMENTABLE

2) Risk of overfitting Phase-1 (800 steps) leading to premature saturation before VETO2 closed-init mapping takes effect.

3) TUNING: Corrective response to U53 failure; closed-init prevents the "unlearning" artifact seen in previous open-init runs.
U9: 1) verdict: IMPLEMENTABLE

2) Risk of catastrophic forgetting in A-branch due to closed-init (b=-2) causing immediate residual collapse before mapping stabilizes.

3) TUNING: Corrective response to U53's floor-fail; increasing step count and shifting init bias targets the specific failure mode of premature convergence.
U10: | Metric | Value |
| :--- | :--- |
| **Verdict** | IMPLEMENTABLE |
| **Objection** | Risk of gradient collapse in Phase-1 due to 2x step increase on fixed diet. |
| **Classification** | CORRECTION: Closed-init prevents A-weight pollution during B-heavy mapping. |

## Discussion (10x strict, one line): 10x CONFIRM-STANDS
D1: CONFIRM-STANDS: Correction maintains bars; closed-init validates the leak test. / D2: CONFIRM-STANDS / D3: CONFIRM-STANDS: Correction verified by strict closed-init and unchanged bars. / D4: CONFIRM-STANDS: Correction based on measured ceiling, no bar changes. / D5: CONFIRM-STANDS: Correction based on measured ceiling, not tuning. / D6: CONFIRM-STANDS: Correction validated by fixed bars and strict closed-init. / D7: CONFIRM-STANDS: Correction valid, bars unchanged, closed-init strengthens leak test. / D8: CONFIRM-STANDS / D9: CONFIRM-STANDS / D10: CONFIRM-STANDS: Correction valid, bars intact, no tuning-to-pass occurred.

## Adjudication (owner, final)
STANDS v1.0 (unanimous IMPLEMENTABLE, 0 patches, 10x CONFIRM). TUNING-vs-CORRECTION 5-5 ruled CORRECTION: filed before any U54 compute, bars NOT lowered (floor 0.45, vetoA 0.05, relative CTX all kept), closed-init makes the leak test stricter, 800-step Phase-1 carries a filed falsifier (ckpt still <0.45 kills C1). Overfit/saturation worries are Wave-1 diagnostics (file vetoA/B + ckpt trajectories), not prereg blocks. Driver built (newai-selfu54-driver.js, 5/5 fns load-checked, no waves run). AWAITING fresh countersign for Waves 0–2 compute (12 Phase-1 800-step + 12 Phase-2 + 12E + verdict, ~5 min). NO COMPUTE until then.
