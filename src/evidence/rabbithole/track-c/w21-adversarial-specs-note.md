# W21 — adversarial precursor hunt (FAILED to falsify = scoped novelty survives) + experiment specs

## Adversarial hunt
Queries: quoted "hint fading"/"fading hints" + neural/teacher/stages (→ no results); unquoted scaffolding-
withdrawal/machine-teaching (→ 8 hits). Followed the two load-bearing ones:
1. "Scaffolding Networks for Teaching and Learning to Comprehend" (Celikyilmaz et al., MSR 2017, 68KB text):
   scaffolding teaching operationalized as ITERATIVE QUESTIONING (question simulator + RL memory policy), NOT
   hint fading. Different mechanism (interrogation vs withdrawal). USED as contrast (two operationalizations
   of "scaffolding teaching"); no precursor, no conflict.
2. "Strong-to-Weak Scaffolding" paradigm page (emergentmind, updated 2026-08): definition confirms fading-as-
   paradigm across education/LLM-tutoring/programming/ML (graduated reduction of prompts/structure/computation
   as independence develops) — paradigm-level, already priced into W10. Paper list JS-walled; no generational
   machine-teaching primary surfaced in extracted text.
NOT followed (low yield): ed-tech withdrawal frameworks (human learners), Neuron alignment paper (neuro), both
flagged in log, returnable if the paradigm threat needs primary-level rebuttal.
Verdict: F-adversarial — one genuine falsification attempt, failed. Scoped novelty (W10 5-point scope) stands.
Recorded as evidence, not absence-of-evidence: the exact query an adversary would run returns nothing.

## Experiment specs (docs for bench; no runs)
### F-new: drift metrics beyond accuracy (per generation, on student outputs)
- Entropy/TTR: token-level Shannon entropy + type-token ratio per generation (W3 P1/P5 adoption).
- Topsim (W13): meaning–form mapping needs a meaning space — ours exists (key→value ground truth):
  pairwise cosine distance in output-embedding space vs Hamming distance in key space; Spearman correlation
  per generation. Falling topsim + flat accuracy = path collapse without answer collapse (R4's nightmare).
- Message-effect / causal influence (W13): ablate the retrieved value (replace with distractor) and measure
  answer-change rate — does the retrieved value CAUSALLY drive the answer, or is it decorative? Per generation.
- Inter-agent divergence: pairwise output distance across the 8 seeds per generation (diversity-collapse tripwire).
### F-shortcut: suffix/shallow-solution audit (W4 LoopThink method + W13 Mu&Gookman backing)
- Permutation control: shuffle key↔value mapping; a genuine lookup chain must break (accuracy → chance).
  If accuracy survives mapping shuffle, the probe is solvable by a shallow statistic — FIX THE PROBE before any
  generational claim.
- Suffix control (LoopThink App-K analog): truncate inputs to trailing elements only; above-chance performance
  = suffix shortcut present.
- Run both on T0 (tutor) and one ignited student BEFORE spending generations on F-singlegen.
### F-singlegen (CONFLICT follow-up, W10): same fade schedule, ONE continued student vs fresh-per-generation.
  Decides whether generations matter. +Adapter variant (W17): freeze brain, train adapter per generation.
### F-mech (W9): NMD-style neuron diff (memorize-lean vs ignited students) on tinynn; late-layer prediction (TOR).
### F-skillbank (W11): skill/mistake records per generation (SGSD recipe); tutor selection by mistake-profile
  complementarity; gated-disagreement signal from collapse-and-recover shapes.
### F-deltanet (W11): delta-rule memory vs attention-supervised tinynn on same lookup probe (code: fla-org/
  flash-linear-attention); hybrid-supervisor arm per the hybrid finding.

## Queue after W21
Gated paper patches (5, need user go): F2, F3, RW-C3, RW-fading, F-grounded. Experiment queue (6, need bench):
F-new, F-shortcut, F-singlegen, F-mech, F-skillbank, F-deltanet — all SPEC'D, no runs. Continuous-fade design
done (blocked on F-singlegen). Standing slot + 2 unresolved lookups (aiwiki URL = user; iterated-collapse
recheck post-CoNLL 2026). Next legitimate wave without user/bench: synthesis R2 (needs 5+ new verdicts —
only 3 since R1) or deeper reads of already-fetched material (diminishing). RECOMMEND: pause for user steer.
