# Mamba (Gu & Dao, "Linear-Time Sequence Modeling with Selective State Spaces", 2312.00752) — verdict: USED

AI-facing context: Tier-2 mechanism paper. Different architecture class
(selective SSM, not teacher→student), but its selection vocabulary and
synthetic-validation norm transfer directly. Source: scratch/paper-mamba.html
→ stripped text scratch/track-c/mamba-full.txt.

## What it is
Structured SSMs with data-dependent selection: Δ, B, C become input
functions, breaking LTI (constant dynamics) so the fixed-size state can
compress context by content. Hardware-aware selective scan keeps linear
time. Results: first linear-time model with Transformer-quality LM
(scaling laws to 1B, beats LLaMa-recipe baselines; Mamba-3B matches 2x-size
Transformers, +4 avg commonsense vs Pythia-3B, exceeds Pythia-7B; 5x
generation throughput). Synthetic validation: Selective Copying (memorize
relevant, filter noise at varying positions) + Induction Heads. Code +
checkpoints: github.com/state-spaces/mamba.

## Load-bearing quotes (from scratch/track-c/mamba-full.txt)
- LTI failure mode: "These tasks reveal the failure mode of LTI models.
  From the recurrent view, their constant dynamics (e.g. the transitions
  in (2)) cannot let them select the correct information from their context."
- Selective Copying: "It requires content-aware reasoning to be able to
  memorize the relevant tokens (colored) and filter out the irrelevant ones
  (white)."
- Induction Heads: "a well-known mechanism hypothesized to explain the
  majority of in-context learning abilities of LLMs (Olsson et al., 2022).
  It requires context-aware reasoning to know when to produce the correct
  output in the appropriate context."
- Δ as gating: "Δ_t = softplus(Parameter + Linear(x_t))" of the leaky
  integrator h(t) = -h(t) + x(t); Ā_t = σ(-Linear(x_t)) — i.e. a
  data-dependent forget gate ("connection to RNN gating mechanisms").
- Results: "Mamba is the first linear-time sequence model that truly achieves
  Transformer-quality performance, both in pretraining perplexity and
  downstream evaluations" + "Mamba-3B's quality matches that of Transformers
  twice its size (e.g. 4 points higher avg. on common sense reasoning
  compared to Pythia-3B and even exceeding Pythia-7B)."
- Selection framing (§3.1): "Selection as a Means of Compression."

## Novelty delta (C5 form)
They [select by data-dependent state dynamics] under [LM/DNA/audio at
100M–3B scale]; we [select by fading hints across generations] under [tiny
lookup curriculum]; claim [selection schedules ignite learning] holds —
convergent principle, different mechanism (intra-model dynamics vs
cross-model curriculum). No precursor, no conflict.

## Stacks
- WITH our fade schedule: the fade IS a selection schedule over the
  curriculum (which hints survive to which generation ≈ which tokens enter
  the state). Their "selection as compression" gives us the vocabulary:
  describe fade stages as compression of the curriculum into the student.
- WITH Coconut/Huginn: third member of the granularity family — Mamba
  selects per-timestep (Δ gating), Coconut stages replacement granularity,
  Huginn randomizes recurrence depth. All three say: what varies per
  step/stage carries the capability.
- WITH our bench method: their synthetic-task validation (copying/induction
  as mechanism probes) is the same norm as our parity6 ladder — cite as
  precedent for small synthetic mechanism probes in §3/§7.
- Δ-gating as adaptive-compute analog: data-dependent step size ≈ per-token
  compute (pairs with Huginn's KL-exit; two implementations of one idea).

## Placement: BOTH (light)
- Nursery: selection-as-compression framing for the fade (§2/§7 language);
  induction-head-style probe as a SECOND synthetic mechanism check
  alongside parity (do students form induction heads during fade? —
  file as F-induction, cheap, diagnostic).
- Workspace: Δ-gating / data-dependent step size as a candidate student
  mechanism IF recurrent students are ever tried (note, don't build now).
- Neither: SSM architecture itself, DNA/audio results, throughput claims.

## Follow-ups
- F-induction: induction-head probe on faded students (mechanism check).
- RW-Mamba: §2 selection-vocabulary + synthetic-probe-norm citation.
