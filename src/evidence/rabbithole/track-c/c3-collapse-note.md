# C3 read — Model Collapse as Cultural Evolution (2605.23054) + conflict table vs G-series

## Paper (what it is)
"Model Collapse as Cultural Evolution" (arXiv 2605.23054, CoNLL 2026 submission — anonymous reviewers thanked, so preprint pre-publication).
Authors incl. Betty Guo (repo namespace), computational resources Univ. of Hong Kong.
Chain: LLM self-training as iterated learning; 10 generations, two models (LLaMA-2, Mistral-7B),
three languages for morphology (English, German, Turkish), English for constructions/compositionality.
Pipeline: 50k-passage bottleneck from held-out Pile; 50-token prompts; three-condition filtering
(unfiltered / random / quality = QA+NLI+summarization aggregate).
Repo: github.com/bettyguo/iterated-collapse — DEAD (genuine GitHub 404 2026-11-11, paper's own URL,
arXiv abs has no code link; recheck after CoNLL 2026). Materials claim: pipeline + stats code + PCFG + configs.

## Five predictions (all confirmed, large effects)
- P1 frequency-dependent loss order: rarest quartile Q1 retains 32% entropy @gen10, most frequent Q4 88%;
  gradient closely matches the human log-linear curve (their discriminative test = the functional form, not just tail loss).
- P2 regularity increase (confirmatory): monotonic; English irregulars −42.7% @gen10; low-freq irregulars
  regularize by gen3, high-freq persist to gen10; German slower (richer paradigms), Turkish ceiling effects.
- P3 dimension-specific degradation (partially discriminative): pragmatic constructions mean survival gen 4.2
  vs syntactic 8.7, morphological 6.1; log-type-frequency ↔ survival correlation = entrenchment signature;
  converges with formal-vs-functional competence dissociation.
- P4 non-monotonic compositionality (CRITICAL, uniquely discriminative): unfiltered natural seed
  0.41 → peak 0.47 @gen3 → 0.31 @gen10; regularized seed 0.52 → 0.54 @gen3 → 0.33 @gen10 (rules out
  noise-removal); random filter ≈ unfiltered; quality filter sustains ~0.48 @gen10. Seed-independent convergence.
- P5 distributional narrowing (confirmatory): Zipf exponent decreases monotonically.
- Sensitivity: lower temperature shifts P4 peak gen4→gen2; 5K vs 50K bottleneck shifts peak to gen1–2.
  Mistral replicates all five (qualitative invariance, not architecture artifact).
- Stated limitations (6): structural correspondence, not formal equivalence (SGD≈posterior-sampling open);
  English-only CxG/compositionality; unilateral filter, not interactive partner; 7B + 50K bottleneck only;
  single-source human comparison; filter-task-mix ablation left open.
- Design principles: task-grounded (not random) filtering; different-family evaluator; bottleneck width as tunable rate.

## Conflict table — theory vs our G-series (T0+G1–G5: 8/8→6/8→7/8→8/8→6/8, 35/40 CI 0.74–0.95, best perfect every gen, s608 first collapse)

| # | Theory predicts | We observe | Reading |
|---|---|---|---|
| 1 | P4 unfiltered: rise-then-fall by gen ~10 | Flat rates, overlapping CIs, no trend G1–G5 | NOT a conflict — our loop is the *quality-filtered condition analog*: ignition gate (Hd/killA bars) every generation + winner-promotion tutor = task-grounded selection. Their filtered arm sustains 0.48 @gen10; stability is exactly what the theory predicts under filtering. Reconciliation — strengthens §8. |
| 2 | P1/P2/P5 drift (entropy loss, regularization, Zipf narrowing) | Unmeasured (review §5.4 lens: TTR/entropy/path-diversity not in ledger) | Gap, not conflict. ADOPT as measurements (F-new): per-generation entropy/TTR on student outputs. |
| 3 | P3 pragmatic-before-syntactic erosion | Unmeasured; our hints fade uniformly, not dimension-specific | Gap + possible boundary condition: tiny-lookup domain may lack the formal/functional split. Note it. |
| 4 | Seed-independent convergence to prior | Tutor-dependence (winner-promotion; G2 dips to 6/8 even under perfect tutor s202; s608 collapses under s502) | Different chain type: selective (ours) vs unselected self-training (theirs). Converges with P4 filter logic — selection is the mechanism. No conflict. |
| 5 | Bottleneck width governs convergence rate | h24/h96: no scale collapse at 4x width, wider failure repertoire at top | Consistent: width changes failure *shape*, not aggregate rate. Cite. |

## Verdict: USED (no downgrade, no precursor)
- Frame adopt: iterated-learning vocabulary (compression–communication tradeoff, bottleneck width) for §8 discussion.
- Reconciliation adopt: our stability = predicted outcome of the quality-filtered condition; state explicitly
  (pre-empts the "but collapse literature says chains decay" reviewer).
- Measurement adopt: F-new (entropy/TTR per generation) from P1/P2/P5; P3 as boundary note.
- Design-principle check: our gate is metric-grounded (Hd/killA computed by harness, not model-judged) —
  satisfies the strongest form of their "task-grounded filter" principle. Different-family-evaluator point is moot for us (no LLM judge).
- Related-Work patch (C5 bar, same wave): contrast unfiltered self-training chains (decay per iterated-learning
  predictions) with our gated selective chain (sustained) — cite this paper as the discriminative-theory reference.
- NO precursor for staged hint fading: their chain is same-model self-training, not teacher→student fading.
  Same verdict shape as C1. Novelty gate holds for everything already run.

## Follow-ups opened
- F-new: per-generation entropy/TTR metrics (from P1/P2/P5).
- RW-C3: Related-Work paragraph (unfiltered-decay vs gated-sustained contrast).
- Repo recheck post-CoNLL 2026 (pipeline + regularized-seed PCFG reusable if it appears).
