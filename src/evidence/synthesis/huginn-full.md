# Huginn full paper (Geiping et al., "Scaling up Test-time Compute with Latent Reasoning", 2025) — verdict: USED

AI-facing context: our project ("Teaching Small Models to Learn") studies
staged hint fading to ignite lookup learning in tiny recurrent nets, plus a
generational nursery (tutor→student generations with gates). The C2 track
already filed the COLM-workshop probe paper (negative result: no structured
latent CoT found) and LoopThink. This note covers the MAIN paper (37pp,
extracted to scratch/track-c/huginn-full.txt pp cited below), which the
paper track had never read (PDF sat on disk used only as a pdf-tool test doc).

## What it is
prelude (2 blocks) → recurrent core (4 shared blocks, looped r times, random
latent init s0) → coda (2 blocks + unembed). r sampled per-input at train
time from log-normal Poisson (mean 33/median 29/mode 24); truncated BPTT
k=8; 3.5B params, 800B tokens on Frontier (AMD). At test time r scales to
32-64; 8 "real" layers unfold to 132 effective. Behaviors emerge: per-token
adaptive exits (KL divergence < 5e-4), self-speculative decoding, KV-cache
sharing, orbits/sliders in latent space, path independence.

## Load-bearing quotes (from scratch/track-c/huginn-full.txt)
- Random-r training objective, p.4: "we randomly sample iteration counts
  during training, assigning a random number of iterations r to every input
  sequence (Schwarzschild et al., 2021b). We optimize the expectation of the
  loss function L over random samples x ... and random iteration counts r
  from distribution Λ." + "We fix k = 8 in our main experiments."
- Failed runs diagnosis, Fig.5 caption p.6: "Note the hidden state collapse
  (middle) and collapse of the recurrence (right) in the first two failed
  runs, underlining the importance of our architecture and initialization in
  inducing a recurrent model."
- Test-time scaling, p.9 (Fig.8): "Model performance on harder tasks grows
  almost linearly with the training budget, if provided sufficient test-time
  compute." GSM8K CoT 34.80/42.08 at r=32 (Table 2); code 24.80/23.17 (Table 3).
- Adaptive compute, p.10 (Fig.10): "we choose a simple exit criterion to
  evaluate convergence, the KL-divergence between two successive steps. If
  this divergence falls below 5 × 10−4, we stop" — converges quicker on
  math than on fallacies/moral scenarios.
- Path independence, p.13: "When re-initializing from multiple starting
  states s0, the model moves in similar trajectories, exhibiting consistent
  behavior. The same orbital patterns, fixed points, or directional drifts
  emerge regardless of initialization."
- Proof-of-concept hedge, §10 Conclusions p.14: "The models described in this
  paper are ultimately still a proof-of-concept... trained a single model at
  scale. Future training runs are likely to train with more optimized learning
  rate schedules, data mixes and accelerators."

## Novelty delta (C5 form)
They [loop shared weights / probe frozen recurrence] under [3.5B params,
800B tokens, synthetic arithmetic + GSM8K]; we [fade hints across
tutor→student generations] under [tiny lookup curriculum, behavioral gates];
claim [staged fading ignites lookup] holds — different mechanism (cross-model
generational teaching vs single-model weight-shared recurrence), no precursor.
Their negative probe result (no structured latent CoT) does not touch us:
our reasoning is explicit in the fade schedule, not latent.

## Stacks
- WITH LoopThink (c2): random-r training ≈ dynamic-Poisson recurrence; both
  find train-time variation load-bearing (their §: inference scaling needs
  train r≥4; ours: fade schedule needs stages). Same direction.
- WITH collapse/C3: their "no specialized training data" claim vs our gated
  selection — our gates ARE the quality filter their theory demands; cite
  as convergent (selection makes latent training work, same as generational).
- AGAINST "just add depth": their probe (3.11→4.93 GSM8K for 4→32 steps
  without CoT) is our filed anti-recurrence-alone evidence; main paper's
  gains all ride r≥16 + CoT setup. Consistent with our scaffolding-first design.
- MoE complementarity (p.14: recurrent-depth refines, MoE stores) — boundary
  note for nursery memory architecture.

## Placement: BOTH
- Nursery: (1) random-r-per-input training as a fade-schedule analog —
  experimental arm (vary fade stage per sample, not fixed stages); (2) KL-exit
  adaptive compute as an inference-efficiency mechanism for student evals;
  (3) hidden-state-collapse monitoring (their Fig.5 middle: correlation of
  hidden states) as a health metric for our recurrent students — cheap,
  behavioral, matches our seed-fragility findings.
- Workspace: truncated-BPTT k=8 recipe + RMSNorm/adapter stability notes for
  src/tinynn training harness; log-normal-Poisson sampler for any future
  compute-budget randomization.
- Neither: Frontier-scale DDP, AMD workarounds, tokenizer recipe (not our scale).

## Follow-ups
- F-huginn-arm: per-sample randomized fade stage (mirror of random-r).
- F-collapse-monitor: track hidden-state correlation during student training;
  collapse → reseed (operationalizes seed-fragility).
- RW-§2: cite as closest-work contrast (single-model recurrence vs
  generational fading) + training-stability corroboration.
