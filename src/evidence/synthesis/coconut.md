# Coconut / Chain of Continuous Thought (Hao et al., Meta FAIR, 2412.06769) — verdict: USED (strong)

AI-facing context: closest METHOD analog to our staged hint fading yet
discovered independently. C4 note (c4-sdft-coconut-note.md) already filed
the verdict; this note adds verbatim paper quotes + stacks + placements.
Source: scratch/track-c/w12-coconut.txt (extraction) + w12-coconut.pdf.

## What it is
Feed the last hidden state directly as the next input embedding (skip
LM-head/embedding bottleneck); fully differentiable latent reasoning.
Continuous thoughts encode multiple candidate next steps (BFS-like).
Multi-stage training: start from full language CoT, progressively replace
language thoughts with continuous thoughts. Beats no-CoT on GSM8k/ProntoQA/
ProsQA (GPT-2; Llama gains smaller).

## Load-bearing quotes (from scratch/track-c/w12-coconut.txt)
- Mechanism: "directly uses it [the last hidden state] as the next input
  embedding. This allows the LLM to reason in an unrestricted latent space
  instead of a language space" + "instead of mapping between hidden states
  and language tokens using the language model head and embedding layer."
- End-to-end: "the system can be optimized end-to-end by gradient descent,
  as continuous thoughts are fully differentiable."
- BFS reasoning: "continuous thoughts ... can encode multiple potential next
  steps simultaneously, allowing for a reasoning process akin to
  breadth-first search (BFS)" + "it can maintain many possible options
  within the continuous thoughts and progressively eliminate incorrect paths
  through reasoning, guided by some implicit value functions."
- Coarse-transition instability: "adding three continuous thoughts at once —
  particularly during the final stage transition — leads to a sharp spike in
  training loss, causing instability."
- Finer-grained prescription: "Future work will explore finer-grained
  schedules, such as incrementally adding continuous thoughts one at a time
  while removing fewer language tokens."
- Language-skeleton hybrid: "combining language and latent reasoning —
  e.g., generating the reasoning skeleton in language and completing the
  reasoning process in latent space — could provide a promising direction."
- Scale caveat: "larger models have already undergone extensive
  language-focused pre-training, making the transition to latent reasoning
  more challenging" + "Universally surpassing language-based CoT likely
  requires significant research efforts dedicated to latent space pre-training."

## Novelty delta (C5 form)
They [replace language CoT steps with continuous thoughts in one model]
under [GSM8k/ProntoQA, GPT-2→Llama-8B]; we [fade hints across tutor→student
generations] under [tiny lookup curriculum]; claim [staged fading ignites
reasoning] holds — convergent discovery, not precursor (single-model latent
training, no teaching, no generations, no ignition-from-zero). Their
coarse-transition instability independently justifies our fine-grained
stage design.

## Stacks
- WITH Huginn: latent-space reasoning family; Coconut trains INTO latency
  from language (fade), Huginn pretrains recurrence natively. Coconut's
  staged entry is the closer analog to our fade; Huginn's stability recipe
  (RMSNorm/concat) is the training complement. All three agree: granularity
  of transition is load-bearing.
- WITH LoopThink threshold curriculum: 95%-gate before harder data ≈
  fine-grained stages; same direction (mastery-graded transitions).
- WITH our fade schedule: their "one at a time, fewer tokens removed" IS
  our many-small-stages rule, derived independently. Cite as convergent
  method in §2/§7.
- Their hybrid (language skeleton + latent completion) MAPS to our discrete
  hints + continuous supervision branch — names the continuous-fade variant.

## Placement: BOTH
- Nursery: continuous-fade branch (language skeleton + latent completion per
  their hybrid proposal) as a named experimental variant of the fade
  schedule; fine-grained-stage rule already adopted — keep + cite.
- Workspace: multi-stage replacement scheduler (language→continuous) as a
  training-harness pattern for src/tinynn if latent supervision is ever tried.
- Neither: ProsQA/ProntoQA tasks, Llama-scale claims.

## Follow-ups
- F-continuous-fade: skeleton+latent variant arm (their hybrid, our schedule).
- RW-Coconut: §2 convergent-method citation (independent staged fading +
  granularity lesson).
