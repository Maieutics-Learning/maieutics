# Brief 01 — Irie & Lake (2025), "Overcoming classic challenges for ANNs by providing incentives and practice"

Source: `scratch/papers/irie-lake-2025-arxiv.html` (arXiv:2410.10596v4, CC-BY; Nature MI version). Perspective/review, no new experiments; unifies prior metalearning results under one frame.

## Thesis (Problem of Incentive and Practice, PIP)

Traditional ANN training neither incentivizes the target weakness nor gives practice at it — it "hopes the desired behaviour will emerge through optimizing related but different objectives." Fix: meta-training episodes with explicit three-part structure — demonstration sequence S_demo (x–y pairs), challenging query X_query, target behavior Y_target — optimizing p(Y_target | S_demo, X_query). Incentive = meta-objective prices the weakness directly; practice = many randomized episodes.

## Mechanism (Metalearning Sequence Learners, MSL)

- Parameterize the learner as a sequence-processing ANN (RNN/LSTM historically; quadratic/linear transformers now); MSL metalearns the entire learning dynamics, not just init (beats MAML when the sequence model is powerful enough).
- Critical detail: Irie et al.'s continual-learning result uses a LINEAR transformer variant holding only a FIXED-SIZE state updated per input (like an RNN) — it cannot cheat by storing all past tasks in context; it must meta-learn WHAT to store. Contrast: vanilla transformers auto-store history (violates the continual setting).
- Randomization per episode (e.g. primitive→meaning remapped each episode) prevents memorizing input-output patterns in weights; forces learning-to-learn from the demo.

## Results surveyed (their numbers, not ours)

- Systematic generalization (Lake & Baroni 2023): high accuracy on SCAN, COGS, few-shot instruction learning; human-like side-by-side.
- Continual learning (Irie et al.): Split-MNIST WITHOUT catastrophic forgetting where hand-crafted algorithms failed.
- Few-shot: Omniglot/Mini-ImageNet beyond hand-crafted reach (Santoro 2016 → Mishra 2018).
- Multi-step reasoning: no explicit metalearning setting exists (demo usually empty); best current approach = datasets that incentivize intermediate steps (incl. synthetic episode training).

## Author-stated limitations (§4.1 — load-bearing for us)

1. The target behavior must fit the demo/query/target mold; open whether it covers all abstraction/reasoning.
2. Metalearning rides on in-distribution generalization; OOD fails. No meta-meta-learning yet — a model meta-trained to decompose problem class A will NOT generalize the skill to problem class B.
3. Episode generation needs human ingenuity/hand-engineering (LLM data is the exception: implicit episodes).
4. §4.3 kicker: "problem awareness" — humans told they are in a continual setting change strategy; naive ANNs lack awareness of what they will be evaluated on. Metacognitive knowledge of goals is a separate avenue from implicit incentives.

## Bench mapping (our wall)

- DIRECT HIT on our method error: U35–U38 added pressures are exactly "related but different objectives" (scorer shaping, gate openness, diet diversity). U34 priced the TARGET (compose during trunk training) and got closest (COMPOSE 1/3, all deltas positive). The paper says: price the thing itself.
- Our 8-dim carry IS Irie's fixed-size state. Their continual-learning success came from meta-training where the QUERY SET spans all tasks (explicit no-forgetting incentive). Our round-2 eval is structurally the same test (does round-1 learning persist?) — and retrieval passes it. So the mechanism works in our trunk for storage; the missing piece is SELECTIVE deployment, which no cited result prices either.
- Limitation #2 bites us directly: even if we meta-train selection on diet X, expect NO transfer to diet Y without meta-meta structure. Any proposal must name which diet class the selection skill is trained on AND test a held-out class.
- Problem-awareness gap: our trunk is trained end-to-end (round-2 loss reaches round-1 params through carry), so training-time awareness exists; but nothing at INFERENCE tells the trunk which regime it is in. A context signal (the U38 gate input idea) is the architectural counterpart — U38's gate failed, but the paper suggests the failure may be incentive-side (gate openness was priced, shutting never paid — matches our D2 probe hypothesis).

## Concrete test + falsifier

- Test: meta-episodes where EACH episode randomizes the cue→target mapping (Lake-Baroni style remap) and the query is a novel composition; price query-after-demo directly (not via scorer shaping). Bar: COMPOSE ≥ +0.05 at quorum on HELD-OUT mappings.
- Falsifier (teeth): same-episode memorization control — if a trunk trained with FIXED mappings (no remap) matches the meta-trained trunk, the mechanism is memorization, not learning-to-learn; PASS demotes to scoped.
- Predicts: U39-DIAG D2 (pressure probe) first — if shutting never pays on our rows, no incentive framing can install it; redesign rows before any meta-training.
