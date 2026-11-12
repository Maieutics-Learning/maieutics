# Model Collapse as Cultural Evolution (2605.23054) — verdict: USED (reconciliation, no downgrade)

AI-facing context: the paper a reviewer WILL cite against us ("chains
decay, so your generations must decay too") — and the paper that already
contains our answer. Iterated-learning theory run on LLM self-training
chains (10 generations, LLaMA-2 + Mistral-7B): FIVE predictions, all
confirmed — EXCEPT the quality-filtered arm, which sustains. Our loop
(ignition gate + winner-promotion every generation) IS the filtered arm.
Stability is exactly what the theory predicts under filtering. Prior
note: src/evidence/rabbithole/track-c/c3-collapse-note.md (full read +
conflict table — this note adds verbatim quotes). Source:
scratch/track-c/w3-collapse.txt (60KB).

## What it is
LLM self-training as iterated learning. 50k-passage bottleneck from
held-out Pile; three-condition filtering (unfiltered / random / quality
= QA+NLI+summarization aggregate, LLaMA-2-13B judge); English/German/
Turkish morphology + English constructions/compositionality. P1
frequency-dependent loss order (Q1 retains 32% entropy @gen10, Q4 88%,
log-linear like humans). P2 regularity (+irregulars −42.7% @gen10).
P3 dimension-specific erosion (pragmatic survival 4.2 gens vs syntactic
8.7). P4 non-monotonic compositionality (0.41→0.47@gen3→0.31@gen10
unfiltered; quality filter sustains ~0.48). P5 Zipf narrowing. Mistral
replicates. Repo dead (genuine 404; recheck post-CoNLL 2026).

## Load-bearing quotes (w3-collapse.txt)
- Mechanism: "convergence speed depends on the transmission
  bottleneck" + "transmission chains without communicative pressure
  produce degenerate languages, while chains with communicative pressure
  produce compositional languages balancing learnability and
  expressivity."
- Discriminative prediction: "Only task-grounded evaluation should
  sustain compositionality" — "predicts only monotonic degradation"
  otherwise.
- Quality filter: "The quality filter uses an independent evaluator
  (LLaMA-2-13B, larger than the 7B generator) scoring passages on
  extractive QA, NLI coherence, and summarization fidelity" — "each one
  tests whether the passage successfully communicates content to a
  downstream reader."
- Sustained arm: quality-filtered compositionality "0.48" @gen10 vs
  unfiltered "0.31" (Table 1).
- P2 magnitude: "irregular verb forms decline by 42.7% in English" by
  generation 10.
- Honesty bound: "motivated structural correspondence," not
  "mathematical equivalence" (SGD≈posterior-sampling open).
- Regular-seed control: PCFG seed with "consistent argument structure,"
  "regular morphology (no irregular forms)," "systematic form–meaning
  mappings" still shows the P4 rise-then-fall — "the compression
  interpretation is confirmed."

## Novelty delta (C5 form)
They [test iterated-learning predictions on LLM self-training chains]
under [same-model chains, 7B, 50K bottleneck]; we [teach lookup across
tutor→student generations with gates] under [tiny selective loop];
claim [staged fading ignites lookup] holds — different chain type
(unselected self-training vs selective teaching with ignition gates).
Their UNFILTERED arm is the decay literature; their FILTERED arm is us.
No precursor for staged hint fading (no teaching, no fading, no
ignition-from-zero). So-what: (1) pre-empts the collapse reviewer
(§8: our stability = predicted filtered-arm outcome); (2) F-new gets
P1/P2/P5 as measurements (per-generation entropy/TTR); (3) our gate
satisfies their "task-grounded filter" principle in its strongest form
(computed harness metrics, not model-judged — and the different-family-
evaluator point is moot for us).

## Stacks
- WITH Ren interaction phase: Ren's no-interaction degradation + P4
  unfiltered decay are the same phenomenon in two literatures
  (cultural evolution vs iterated learning) — stack as convergent
  decay-under-no-pressure; our interaction/selection is the shared cure.
- WITH STOP/RSI: scaffold-disable + filtered-arm sustain = same
  no-shelter/no-decay logic; collapse paper is the theoretical spine
  behind both.
- WITH em-comm gibberish: "chains without communicative pressure
  produce degenerate languages" ≡ "encouraging communication alone
  leads to simple gibberish" — same warning, third literature.
- WITH F-new: P1/P2/P5 nominate exact metrics (entropy by frequency
  quartile, irregular-rate analog, Zipf exponent); P3 is a boundary
  note (tiny-lookup may lack the formal/functional split; uniform fade
  untested dimension-specifically).

## Placement (both — reviewer shield + measurements)
- PAPER: RW-C3 paragraph — contrast unfiltered self-training chains
  (decay per iterated-learning predictions) with our gated selective
  chain (sustained, = their filtered arm). The single highest-leverage
  defensive cite in the synthesis.
- NURSERY: F-new per-generation entropy/TTR (from P1/P2/P5); P3 as
  recorded boundary condition, not an arm.
- WORKSPACE: neither.

## Follow-ups
- RW-C3 queued with the RW patch batch (write alongside RW-OPD).
- Repo recheck post-CoNLL 2026 (pipeline + regularized-seed PCFG
  reusable if it appears).
- No further reads: all five predictions + limits + principles on disk.
