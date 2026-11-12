# C6a (3–4/4) — Pruning/coresets (USED) + dataset distillation (SKIP with teeth) — C6a CLOSED

## Forgetting events (Toneva et al., 1812.05159; 54KB text, thesis read)
- Forgetting event = example transitions correct→incorrect during training. Some examples forgotten constantly,
  some never; (un)forgettable sets generalize across architectures; large fractions omittable at SOTA.
## EL2N/GraNd (Paul et al., 2107.07075, "Data Diet"; 75KB text, thesis read)
- Simple scores averaged over inits identify important examples EARLY (few epochs in); prune half of CIFAR-10
  while slightly improving accuracy.

## C6a verdict: pruning USED
- Unforgettable↔ignition-core mapping: our ignition gate selects the unforgettable core (what survives severance);
  our failure repertoire (F-skillbank) = the most-forgotten profile. Pruning vocabulary names both ends.
- Early-score selection (EL2N few-epochs-in) ↔ tutor selection by early-stage signal — same selection logic as
  winner-promotion, different object (examples vs tutors). Convergent selection principle, cite.
- No precursor (data selection for supervised training; no teaching/generations/fading). No conflict.

## Dataset distillation: SKIPPED with teeth (tag: no-fit/cost-mismatch)
- Method (scout-level): compress datasets into tiny synthetic sets via gradient/trajectory matching (MTT, TESLA,
  datamodels) — requires unrolled training trajectories + bilevel optimization, i.e., the SOAR-grade compute
  we explicitly don't have (50 free OR calls/day, 30 T4h/week budget). Our whole program is cheap-teaching;
  a method that costs more than the training it replaces is definitionally out. SKIP stands unless the budget
  changes by 10x. (C5 synthesis: 1st SKIP tag of this kind — no 3-of-a-kind yet.)

## C6a CLOSED (TinyStories USED / LIMA USED / pruning USED / distillation SKIPPED-cost).
Track-C shelf now: all primary sections read (C1, C2, C3, C4×10, C6a). Remaining: paper-patch batch
(F2/F3/RW-C3/RW-fading/F-grounded — gated behind no-shipped-code rule, user's call) + experiment queue
(F-shortcut/F-mech/F-singlegen/F-skillbank/F-deltanet/F-new) + continuous-fade branch (design-stage) + standing slot.
