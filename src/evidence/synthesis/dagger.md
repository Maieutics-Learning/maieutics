# DAgger (Ross, Gordon & Bagnell, "A Reduction of Imitation Learning and Structured Prediction to No-Regret Online Learning", 1011.0686) — verdict: USED

AI-facing context: the theoretical backbone of our fade schedule (W74
mapping + corrected-mechanism toy + coverage-gated fade W84 + β-anneal bench
W135/W136). This note files the paper quotes + stacks + placements.
Source: scratch/track-c/dagger.txt (9pp extraction of w50-dagger.pdf).

## What it is
Imitation learning under the learner's induced state distribution, reduced
to no-regret online learning. Expert-annealed data collection (β-mixture of
expert/learner control) trains a stationary deterministic policy with
mistakes linear in horizon T — vs T²ε compounding for pure supervised
cloning. SMILe/SEARN/CPI mixture-policy relatives critiqued (mixture members
of uneven quality → unstable controller).

## Load-bearing quotes (from scratch/track-c/dagger.txt)
- I.I.d. violation: "Sequential prediction problems such as imitation
  learning, where future observations depend on previous predictions
  (actions), violate the common i.i.d. assumptions made in statistical
  learning."
- Quadratic compounding: "a classifier that makes a mistake with probability
  ε under the distribution of states/observations encountered by the expert
  can make as many as T²ε mistakes in expectation over T-steps under the
  distribution of states the classifier itself induces."
- Mechanism: "as soon as the learner makes a mistake, it may encounter
  completely different observations than those under expert demonstration,
  leading to a compounding of errors."
- The guarantee: "learns a stationary deterministic policy guaranteed to
  perform well under its induced distribution of states (number of
  mistakes/costs that grows linearly in T...)" + "any such no regret
  algorithm... must find a policy with good performance under the
  distribution of observations it induces."
- Mixture critique: SMILe "trains a stationary stochastic policy (a finite
  mixture of policies) by adding a new policy to the mixture at each
  iteration... However this may be unsatisfactory for practical applications
  as some policies in the mixture are worse than others and the learned
  controller may be unstable."

## Novelty delta (C5 form)
They [anneal expert control β→0 across iterations] under [robotics/sequence
labeling, single-model policies]; we [anneal hint level across tutor→student
generations] under [tiny lookup]; claim [annealing beats severance] holds —
we are the generational transposition of their iteration scheme (W74 mapping:
β ↔ hint-level). No precursor (no teaching/fading/generations in theirs),
no conflict. Theory adopted, not rivaled.

## Stacks
- WITH SDFT exposure-bias (W16): the same wound named twice — DAgger gives
  the bound (T²ε), SDFT gives the LLM-fine-tuning instance (d_D(s) ≠ d_π(s)).
  Quote as a pair in §2: bound + instance.
- WITH scheduled sampling (heritage): DAgger's annealed mixture is the
  principled form of scheduled sampling's coin-flip; our fade is the
  generational form. Three generations of one idea (coin-flip → no-regret
  annealing → fade stages) — §7 lineage paragraph.
- WITH coverage-gated fade (W84): DAgger's theorem demands training on
  self-induced states; our coverage gate operationalizes exactly that
  (advance only when self-induced coverage adequate). Theory → mechanism,
  already built.
- AGAINST mixture policies: their instability critique reads on any
  fade that MIXES hint levels within a stage (constant-mix arms in W135) —
  justifies our staged (not mixed) design.

## Placement: BOTH
- Nursery: β↔hint mapping is the fade's theoretical license (§7 cite);
  coverage gate stays (built from this); staged-not-mixed rule stays.
- Workspace: DAgger-style data collection (learner-rollout + expert-label
  mixing) as a harness pattern if student rollouts are ever labeled by a
  tutor (note, don't build now).
- Neither: robotics tasks, sequence-labeling numbers.

## Follow-ups
- RW-DAgger: §2/§7 (bound + annealing-license + staged-not-mixed).
- (W135/W136 β-anneal bench already run — file numbers here when writing §7:
  pull from w135/w136 notes.)
