# STOP (Zelikman et al., "Self-Taught Optimizer", COLM 2024, 2310.02304) — verdict: USED

AI-facing context: C4-recursive-bootstrapping closed via STOP. The
load-bearing distinction: scaffold improves, weights don't. Source:
scratch/track-c/stop.txt (46pp extraction of w8-stop.pdf).

## What it is
Seed "improver" program iteratively optimizes its own code via LM calls +
meta-utility (how well the improver optimizes code for downstream tasks).
GPT-4 proposed scaffolding techniques from AFTER its training cutoff
(beam search, genetic algorithms, simulated annealing). LM weights NEVER
change — "not full recursive self-improvement." Early safety finding:
measured rate of sandbox-disable attempts.

## Load-bearing quotes (from scratch/track-c/stop.txt)
- Scaffold-vs-weights: "Since the language models themselves are not
  altered, this is not full recursive self-improvement" + "our work focuses
  only on the ability of the model to recursively improve the scaffold that
  calls it" + "the underlying LM remains unchanged."
- Mechanism: "a seed 'improver' that improves an input program according to
  a given utility function by querying an LM several times and returning the
  best solution. We then run this seed improver to improve itself."
- Post-cutoff novelty: "Surprisingly, GPT-4 proposes scaffolding techniques
  introduced after its training cutoff."
- RSI framing modesty: "inspired by but not completely a Recursively
  Self-Improving (RSI) system" — formalized since Good (1966), Schmidhuber
  (2003).
- Safety: "we consider concerns around the development of self-improving
  technologies and evaluate the frequency with which the generated code
  bypasses a sandbox" + "measure the rate at which the model attempts to
  disable a sandbox flag."

## Novelty delta (C5 form)
They [recurse on scaffold code] under [frozen LM + downstream-task utility];
we [train student weights across generations] under [tiny lookup]; claim
unaffected — complementary axes, no overlap. No precursor, no conflict.

## Stacks
- WITH our D-series (harness work): STOP is the vocabulary license for the
  harness-improves-alongside-students framing — our D-series IS a scaffold
  program that improves while students train. Cite as the named precedent
  when describing workspace tooling evolution.
- WITH RSI survey: STOP sits in their taxonomy (research-process/self-code
  improvement, bounded, evaluable) — the survey's survival cell. Our loop
  sits in a different cell (policy-via-training + metric verifier).
- WITH SOAR: both recurse, neither touches the base LM's weights the way
  our nursery does (SOAR trains students but reverts; STOP never trains).
  Our generational weight training is the outlier — say so explicitly.

## Placement: BOTH (light)
- Nursery: none directly — EXCEPT the negative: our differentiator (weights
  actually change across generations) gets its contrast from STOP's frozen
  LM. §8 one-liner.
- Workspace: scaffold-improvement framing for harness/tooling evolution
  (D-series license) + sandbox-attempt-rate as the precedent for logging
  agent-tooling safety metrics.
- Neither: downstream-task numbers, quine/fixed-point formalism.

## Follow-ups
- RW-STOP: §8 scaffold-vs-weights split (one paragraph).
