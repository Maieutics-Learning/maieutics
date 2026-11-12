# OPD — On-Policy Distillation survey (Song & Zheng, Tencent, 2604.00626) — verdict: USED (strong framing)

AI-facing context: the survey that re-labels our fade schedule in the
field's own vocabulary. Definitions first: knowledge distillation =
training a small student model from a big teacher model. OFF-policy KD =
student trains on static teacher-generated text, never seeing its own
mistakes (behavior cloning). ON-policy KD = student generates its own
trajectories and the teacher corrects THOSE (interactive imitation
learning — the DAgger family). Exposure bias = train/test mismatch where
prediction errors compound step after step at inference. Our loop,
classified: students train on tutor-structured hinted data (off-policy
early) and the hints fade until the student generates unaided (on-policy
late) — so the fade schedule IS off→on-policy annealing with the tutor as
the expert. Prior note: src/evidence/rabbithole/track-c/c4-opd-degen-note.md
(abstract + zones; this note upgrades with verbatim quotes from the full
171KB source). Source: scratch/track-c/w16-opdsurvey.txt.

## What it is
First comprehensive survey of on-policy distillation for LLMs. Unified
f-divergence framework over on-policy samples; three organizing
dimensions: feedback signal (logit-based / outcome-based / self-play) ×
teacher access (white-box / black-box / teacher-free) × loss granularity
(token / sequence / hybrid). Covers GKD (mixture ratios), MiniLLM
(teacher-mixed sampling), DistiLLM, G-OPD (OPD = special case of dense
KL-constrained RL). Open problems: distillation scaling laws,
uncertainty-aware feedback, agent-level distillation.

## Load-bearing quotes (from scratch/track-c/w16-opdsurvey.txt)
- Off-policy diagnosis: "the dominant paradigm remains off-policy:
  students train on static teacher-generated data and never encounter
  their own errors during learning. This train–test mismatch, an
  instance of exposure bias, causes prediction errors to compound
  autoregressively at inference time."
- OPD fix: "On-Policy Distillation (OPD) addresses this by letting the
  student generate its own trajectories and receive teacher feedback on
  these self-generated outputs, grounding distillation in the theory of
  interactive imitation learning."
- The 3-D map: "feedback signal (logit-based, outcome-based, or
  self-play), teacher access (white-box, black-box, or teacher-free),
  and loss granularity (token-level, sequence-level, or hybrid)."
- DAgger theorem (our formal backbone): "The DAgger algorithm (Ross et
  al., 2011) established that querying an expert on the learner's own
  visited states reduces the compounding error from O(T²) under pure
  behavior cloning to O(T), where T is the horizon length."
- One-shot → iterative reframe: "OPD instantiates this principle for
  autoregressive language generation, transforming distillation from
  one-shot distribution matching into an iterative, self-correcting
  optimization loop."
- GKD λ-knob (formalizes our fade): "Setting λ = 1 yields purely
  on-policy training, while λ = 0 recovers standard off-policy KD."
  Our fade is λ annealed 0→1 across generations.
- MiniLLM mixing (precedent for intermediate λ): "with probability
  α = 0.2, tokens are drawn from the teacher to alleviate reward
  hacking."
- Open problem we can claim: "open problems including distillation
  scaling laws, uncertainty-aware feedback, and agent-level
  distillation."

## Novelty delta (C5 form)
They [survey + unify on-policy distillation] under [LLM KD literature,
single-model student training]; we [fade hints across tutor→student
generations to ignite lookup] under [tiny lookup curriculum]; claim
[staged fading ignites reasoning] holds — convergent formalization, not
precursor: OPD anneals the sampling distribution WITHIN one student's
training; we anneal the teaching signal ACROSS generations with ignition
from zero as the object. Nobody in their survey teaches across
generations. So-what: (1) exposure-bias lens PREDICTS our severance
collapse s608 (never saw unaided states → errors compound) — second
derivation of the same prediction alongside DAgger, which is strong;
(2) our fade slots into their 3-D map (outcome-based feedback ×
black-box teacher × sequence-level granularity) and our λ-trajectory is
a data point toward their open scaling-laws problem.

## Stacks
- WITH DAgger (see dagger.md): the survey's DAgger theorem is the formal
  statement of dagger.md's T²ε guarantee — cite the survey for breadth,
  dagger.md for the bound. Same direction, two depths.
- WITH Coconut one-at-a-time: GKD's configurable mixture ratio + our
  λ-annealing + Coconut's fine-grained stages all say the same thing —
  the off→on transition must be gradual and parameterized, not binary.
- WITH scheduled sampling (Bengio 2015, noted in c4-opd-degen-note.md):
  same fading mechanism inside single-model training — idea old, our
  object (generational teaching + ignition) new. Cite honestly as
  mechanism-precursor in the paper.
- WITH STOP/RSI scaffold warnings: STOP says scaffolds must be disabled
  before eval; OPD says students must meet their own errors during
  training. Same rule from opposite ends — stack as the no-shelter
  principle.
- WITH Ren 2024 interaction phase: Ren's generational transmission with
  interaction is the cultural-evolution cousin of OPD's expert-on-visited-
  states — both beat one-shot matching (survey's "one-shot distribution
  matching" vs Ren's no-interaction degradation).

## Placement (both — framing backbone + one experiment slot)
- PAPER (Related Work §2): the single most citable framing source we
  have. RW-OPD: off-policy diagnosis quote → DAgger theorem → "our fade
  is λ annealed 0→1 across generations" → scheduled-sampling honesty
  footnote. Also seeds the distillation-scaling-laws open problem as
  future work we partially answer.
- NURSERY: F-lambda — log per-generation on-policyness (fraction of
  student outputs generated unaided vs hinted) and test whether ignition
  tracks λ rather than generation count. Cheap logging arm; distinguishes
  "time matters" from "distribution matters." Gated on ignition
  replicates, bundles with F-mech analysis pass.
- WORKSPACE: neither (survey, no tooling).
- Reason for split: OPD's value is vocabulary + prediction (severance
  collapse) + one cheap logging arm; no new training machinery follows.

## Follow-ups
- RW-OPD queued with the F2/F3 RW batch (highest-weight RW cell after
  RW-C3).
- F-lambda: spec with F-mech (same analysis pass over saved
  checkpoints).
- Degeneration warnings (Kirby/cultural-evolution): CLOSED by reference
  per c4-opd-degen-note.md — W3 collapse (full read + conflict table) +
  W8 RSI + W13 em-comm already cover; fourth citation adds nothing.
  Redundant-coverage tag stands.
- No further fetches: full 171KB source on disk and mined.
