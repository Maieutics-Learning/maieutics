# C6a (1/4) — TinyStories (2305.07759, Eldan & Li, MSR 2023)

## What it is
Synthetic dataset of short stories in 3–4-year-old vocabulary (GPT-3.5/4-generated). Models <10M params — even
single-transformer-block — trained on it produce fluent, consistent multi-paragraph stories with near-perfect
grammar + reasoning traces. Plus a paradigm: GPT-4 as teacher-grader (multidimensional: grammar/creativity/
instruction-following), escaping rigid structured benchmarks.

## C6a verdict: USED (regime corroboration)
- Same regime philosophy: constrain the domain → tiny models learn. Our nursery curriculum is the TinyStories
  move applied to lookup (tiny synthetic task, tiny tinynn students). Cite as precedent that small+synthetic works.
- Contrast that strengthens us: their evaluation needs GPT-4-as-judge (costly, gameable-ish); ours uses computed
  metric gates (Hd/killA — top of the W8 verification hierarchy, zero API cost). The regime precedent + a cheaper,
  harder gate.
- No precursor (data recipe for pretraining, no teaching/fading/generations). No conflict.

## C6a remaining (3 sub-items)
LIMA (1k curated); dataset distillation (gradient/trajectory matching); data pruning/coresets (EL2N, forgetting).
LoRA/PEFT folded as design note (see W17 tangential).

## W17 tangential: LoRA-as-teaching (reasoning scout, folded — no new item)
Question: if only adapters changed per generation (frozen brain + trained adapter), would ignition still occur?
Recorded as a DESIGN VARIANT on F-singlegen (single-student self-fade): the experiment matrix already covers
fading-without-generations; adapter-generations would test generations-without-full-retraining. If F-singlegen
shows generations matter, adapter-variant is the natural follow-up. No new queue item (queue discipline).
