# Brief 08 — Jarvis, Klein, Rosman & Saxe (2026), "Compositionality and systematicity emerge from iterated learning in deep linear networks"

Source: `scratch/papers/jarvis-2026.txt` (PNAS, theory + Jax experiments, code on GitHub). Exact learning dynamics derived.

## Mechanism (what IL does, formally)

- Iterated learning = generations of learners training on the previous generation's OUTPUTS. Exact dynamics in deep linear nets: predominantly COMPOSITIONAL substructure (mode π1 connecting compositional input↔output) is learned FIRST; noncompositional modes (π2, π3) learned last — so early-stopping each generation + retransmission progressively REMOVES noncompositional modes. DEPTH required: deep net removes π3 while keeping π1/π2; shallow net merely shrinks all modes (no removal). Multiple generations required — single generation with optimal early stopping is beaten.
- Redundant solutions: the same training data admits systematic mappings (via compositional features, low-rank) AND nonsystematic ones (via noncompositional features, high-rank) — inductive bias decides, invisible on training data. Rank argument: compositional input↔output correlation is rank-nx (nx points suffice for 2nx); noncompositional is rank-2nx (memorize everything).
- Taxonomy via Rank-Cardinality Ratio: OUTPUT systematicity (rely on low-rank output substructure), INPUT systematicity (low-rank input substructure), FULL = both. IL operates ONLY on output labels → gives output systematicity, CANNOT give input or full systematicity ("IL has no mechanism to deal with noncompositional input structure aside from gradient descent's inductive bias, shown ineffective").
- "Weak systematic generalization": with large vocabularies, networks tend toward systematicity from SCALE alone (larger nx → random samples likely span the compositional subspace).

## Limits (author-stated)

- Cannot uncover regularity in INPUT features — needs extremely large datasets for the network to ignore non-generalizing input features.
- Linear-network theory; transformers need structured data/prompting for consistent systematicity; compositionality⇔generalization correlation itself debated.

## Bench mapping (our wall)

- This paper EXPLAINS our G-series result and bounds it: our tutor→student chain (35/40 transfers) is output-label refinement across generations — IL theory predicts exactly this compounding AND predicts it cannot fix the input side. Our wall (binding/query-side) is plausibly the INPUT-systematicity half that IL provably cannot touch.
- Actionable split: keep IL for output-side refinement (already works); attack INPUT systematicity separately (low-rank input substructure reliance). Our shared 8-dim encodings entangle compositional + noncompositional input features with no pressure to use the low-rank part — the rank argument says generalization needs nx noncollinear points in the COMPOSITIONAL subspace; our diets never guarantee the compositional subspace is even spanned.
- Depth requirement: our trunk is shallow (MLP); IL-style mode-removal needs depth. U35 tested WIDTH, never depth. The paper predicts depth (not width) interacts with generational refinement.
- Weak-systematicity-from-scale: larger vocabularies → more systematicity for free. Our vocab is 4 classes — the smallest possible. A larger output vocabulary (even artificially) should increase systematicity per the rank argument — cheap to test, never tried (all our waves use 4-way).

## Concrete test + falsifier

- Test: input-substructure diet — construct rows where the compositional input features span their subspace with nx noncollinear points while noncompositional features are decorrelated; bar = two-query generalization to held-out combos. Plus a larger-vocabulary probe (e.g. 8-way) vs 4-way same budget.
- Falsifier: IL-vs-single-generation on OUR bench — if 3 tutor generations don't beat single-generation-with-early-stopping on output metrics, our G-series compounding is explained by something else (e.g. selection of lucky seeds); file scoped. If input-decorrelated diet doesn't beat entangled diet, the rank argument doesn't transfer to our substrate.
- Predicts: generations help output metrics only; input-side metrics move only with input-subspace design or depth — pre-register the split (don't let output gains masquerade as full systematicity).
