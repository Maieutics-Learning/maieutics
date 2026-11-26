# Brief 04 — Oudeyer, Kaplan & Hafner (2007), "Intrinsic Motivation Systems for Autonomous Mental Development"

Source: `scratch/papers/oudeyer-2007.txt` (IEEE TEC 11(2); 22pp extracted). Foundational curiosity/LP paper; robot experiments, not ML benchmarks.

## Mechanism (IAC — Intelligent Adaptive Curiosity)

- Drive = keep LEARNING PROGRESS maximal (abstract cognitive variable, like a hunger drive). Curiosity/novelty-seeking are SIDE EFFECTS, not the target.
- Implementation: memory of all sensorimotor exemplars → INCREMENTAL REGION SPLITTING (variance-minimizing cut when exemplar count > threshold) → ONE EXPERT PREDICTOR PER REGION (explicitly to avoid monolithic forgetting in lifelong setup — footnote: monolithic variant possible but suffers catastrophic forgetting) → per-region error lists → LP = decrease of smoothed mean error (windows τ=15, θ=25; child regions inherit parent error lists) → action selection = argmax EXPECTED LP (myopic: LP achieved in region with recent exemplars; ε-greedy 0.35).
- Framing: internal CRITIC producing intrinsic reward; any RL technique (Q-learning shown) can maximize it. External + intrinsic rewards combine by weighted sum.

## Results (numbers)

- Playground (Sony Aibo on baby mat: biteable + bashable objects): self-organized stages — random → just-looking (A) → bite-wrong-affordance (B) → bash-wrong-affordance (C) → look-at-object (D) → bite-right (E,F) → bash-right (G). Complexity order matches intrinsic dimensionality (look 2D < bite 3D < bash 4D); nonaffordant ALWAYS precedes affordant.
- 200 simulated runs: complete scenario 34% (high given combinatorics); systematic successful bite 100%, bash 78% — WITHOUT being preprogrammed for either task. Trajectories differ per run (infant-like diversity: some bash before bite, but nonaffordant→affordant preserved).

## Author-stated limits

- Region splitting is deliberately dumb (count threshold) → many uninterpretable regions; prediction/expert machinery kept simple on purpose (delayed-reward RL machinery deferred to future work — Barto et al. direction).
- Regularities are STATISTICAL, not programmed; atypical trajectories exist and are treated as data (parallels infant variability).

## Bench mapping (our wall)

- This is the mechanistic ancestor of Colas's LP-bandit (§6.1) and the outside opinion's H1. The transferable pieces for our bench:
  (a) LP as REGION error-derivative, not 1-step surprise: our evals/measures are all point-estimates; an LP quantity needs error LISTS per stream region over time. Our ledgers log loss curves per run but training never USES them online.
  (b) Per-region EXPERTS as the anti-forgetting device: our trunk is monolithic across diet regions (W6/R2/R4 mixed in one trunk) — IAC predicts interference; U31f R2 (filter hurt s0/s1) is consistent. A per-family expert (or per-region head) is the IAC-consistent architecture — NOTE: this is a different claim from "more capacity" (U35): experts are about INTERFERENCE, not size.
  (c) Nonaffordant→affordant ordering: our E2c surprise-gate degenerated because the trunk==miner made surprise always ~0. IAC's ordering emerges only when the predictor actually errs differentially across regions — requires the predictor to be WEAK somewhere. Our trunks may be too uniformly competent/incompetent for LP to differentiate.
- The E2 caveat sharpened: E2's gate failed with "nothing to exclude"; IAC would say the drive failed because LP was flat everywhere (no region had nonzero error-derivative). LP needs a LEARNABLE GRADIENT in the environment — our 800-step toy diet may provide none after step ~200 (loss curves plateau: check ledger curves — U36 c0 lossN 1.27–1.46 from ~2.1; the drop is front-loaded).
- Metacognition link (Irie §4.3): IAC's "stages" are observable from OUTSIDE (peaks); the robot has no explicit stage representation. For self-direction WITH awareness, stages would need reifying — matches our missing "problem awareness" piece.

## Concrete test + falsifier

- Test: ONLINE LP-bandit over diet regions during trunk training (regions = stream families; LP = smoothed loss-drop per region over trailing window, τ/θ-style; sample ∝ LP; inherit on split). 800 steps, 3 seeds, bar = RET/COMPOSE gain vs fixed diet at quorum.
- Falsifier: yoked control — a second run fed the EXACT region sequence the bandit chose, but with LP replaced by uniform sampling matched on counts. If yoked matches, the sequence (not LP-responsiveness) explains any gain. Also flat-LP diagnostic first: if per-region error-derivatives are ~0 after step 200 on our diet, LP has no signal to ride — file as substrate finding (kills H1 on this bench without further spend).
- Predicts: LP-bandit only helps if (i) regions differ in learnability AND (ii) the trunk is still learning (non-flat derivatives) when selection acts. Our diets may violate (ii) — measure first (cheap, from filed curves).
