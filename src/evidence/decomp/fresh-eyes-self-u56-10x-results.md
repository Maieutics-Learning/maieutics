# Fresh-eyes battery: U56-EXT1b prereg — 10x R1 + 10x discussion — v1.1 STANDS

**Artifact:** `self-u56-ext1b-prereg.md` v1.0 → v1.1 (FIXED-language fix). Frozen U54 checkpoints, VETO3 (2 params, no shared bias), balanced 50/50 BCE, 20 fits/checkpoint (60 total), frozen U54 probes, bars CLEAN/CTX/FLOOR(D3-scoped)/PIN. **Reviewers:** 10 NEW sealed contextless (disjoint angles) + 10x strict discussion. NO compute exists. Cover: user "go ahead and lets do one and 2".

## Raws (verbatim)
U1: 1) verdict: IMPLEMENTABLE / 2) Pure logistic fit on balanced rows ignores non-linear leakage patterns inherent in the U54 ckpts. / 3) OVERCLAIM. Balanced sampling masks bias-drift; B-heavy is the only true stress test for "FIXED" status.
U2: 1) verdict: IMPLEMENTABLE / 2) 800 steps at lr=1.0 for a pure logistic fit is erratic; risk of oscillation/divergence before convergence. / 3) OVERCLAIM. Balanced sets mask B-heavy leakage; a "FIXED" verdict on balanced data provides zero guarantee against B-heavy saturation.
U3: 1) IMPLEMENTABLE. / 2) Logistic fit on balanced rows ignores latent skew in frozen U54 projections; "pure logistic fit" may mask leakage if the projection space is collapsed. / 3) OVERCLAIM. Balanced training is a baseline; B-heavy distribution is required to prove the veto doesn't collapse to a trivial prior.
U4: 1) IMPLEMENTABLE. / 2) Quorum logic on `LEAK-CLEAN` is overly permissive; `≤ 0.05` on a `N=200` sample allows noise to mask leak. / 3) OVERCLAIM. Balanced training masks the B-heavy bias drift that P5 specifically targets; "necessary-not-sufficient" is an understatement.
U5: 1) IMPLEMENTABLE. / 2) Zero-gradient assertion on PIN-frozen state is tautological but necessary; fails if sidecar leakage occurs via shared-weight residue not explicitly zeroed. / 3) OVERCLAIM. Balanced training masks the B-heavy gradient instability that usually triggers P5 failure.
U6: 1) verdict: IMPLEMENTABLE. / 2) `B cannot drag A by construction` is a bold claim for a 2-param logistic fit without structural constraints beyond "no shared bias." / 3) OVERCLAIM. Balanced 50/50 sets mask B-heavy leakage patterns; P5 reopening requires asymmetric stress-testing, not just a balanced fit.
U7: 1) IMPLEMENTABLE. / 2) Pure logistic fit on frozen ckpts risks overfitting to specific noise patterns in the 50/50 split, potentially masking true leak signals. / 3) OVERCLAIM. Balanced sampling prevents bias drag but doesn't simulate the B-heavy distribution required for a robust P5 reopen.
U8: 1) verdict: IMPLEMENTABLE / 2) Logistic fit on balanced rows ignores the actual class distribution of the U54 latent space, risking a "clean" veto that fails on real-world skewed data. / 3) OVERCLAIM. Balanced sampling masks the B-heavy gradient pressure; a "FIXED" verdict here is a lab-artifact, not a generalizable fix.
U9: 1) verdict: IMPLEMENTABLE. / 2) Zero-compute assertion contradicts the requirement for 60 fits/evals; logically impossible to execute without hardware. / 3) OVERCLAIM. Balanced training masks B-heavy leakage; necessary but insufficient to guarantee FIXED status. (U9P2 is reviewer error: "zero-compute" means no compute HAS RUN, not that none is needed — the prereg explicitly waves 1–2 with 60 fits + 60 evals under countersign.)
U10: 1) IMPLEMENTABLE / 2) Pure logistic fit on frozen ckpts is a trivial sanity check, not a robust leak-detection framework. / 3) OVERCLAIM. Balanced sets mask B-heavy skew; P5 reopening requires asymmetric stress tests.

## v1.1 fix (doc-only)
10x OVERCLAIM accepted: LEAK-FIXED retracted from "P5 REOPENS" to "E-EXT2 LICENSED — P5 REMAINS CLOSED until E-EXT2 itself ADVANCEs at quorum under B-heavy". FIXED is a gate pass on balanced supervision, never a reopen. lr-oscillation (U2) answered by filed loss trajectories + 20-fit means (convex 2-param BCE; means absorb transient); N=200-noise (U4) answered by per-checkpoint 20-fit means with SE filed (quorum on means, not single probes). No bar/design changes.

## Discussion (10x strict): 10x CONFIRM-STANDS
D1–D10: all CONFIRM-STANDS (E-EXT2 licensed, P5 remains closed).

## Adjudication (owner, final)
v1.1 STANDS (10x IMPL → 10x OVERCLAIM-accepted → 10x CONFIRM; the OVERCLAIM chorus improved the verdict language without moving any bar). U9P2 logged as reviewer error (zero-compute = nothing run yet). U56 driver built (`newai-selfu56-driver.js`, 5/5 fns load-checked, zero fits/evals run). AWAITING fresh countersign for Waves 0–2 (Wave-0 gradcheck + twins + checkpoint/probe identity; Wave-1 60 fits; Wave-2 60 evals + verdict). NO COMPUTE until then.
