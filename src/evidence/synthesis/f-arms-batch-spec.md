# F-series remaining arms — batch spec v1.0 (2026-11-12)

Compact specs for the queued arms (INDEX §5). Full pre-registration;
each states its kill condition. Costs assume ~60 s/gen at 1800 steps.

## F-lambda (OPD: does ignition track λ, not generation count?)
Q: is ignition a function of cumulative on-policyness or of
generational turnover? Design: three λ-trajectories to the same
endpoint — fast (100→0 in 1 gen), staged (current 3-stage), slow
(5 micro-stages) — same tutors, same total steps; log per-stage
unaided fraction vs ignition gen. O: trajectories ignite at equal
cumulative-λ (not equal gen) → fade IS λ-annealing (RW-OPD upgraded
from framing to measurement); else generations matter. Phase 3.

## F-new metrics (emcomm + collapse P1/P2/P5; R2 gated-vs-ungated)
Q: do entropy/TTR track (and predict) ignition/rot? Design:
per-generation rollout-entropy + answer-TTR on killA + killHd for
EVERY Phase-3 chain (cheap logging, same pass as F-lambda/F-mech) +
P4-style ungated baseline chain (no ignition gate, no promotion).
O: gated entropy flat while ungated rises (R2's prevention-vs-filter
test); entropy spike precedes rot by ≥1 gen → early-warning meter.
Phase 3 (logging) + 1 ungated chain (~1 h).

## F-deltanet (memory arm: delta vs attention-supervised tinynn)
Q: does erase-then-write memory ignite where pure attention stalls?
Design per deltanet.md: (a) attention-supervised baseline, (b) delta
memory (learned β, l2 keys, short-conv — W24 craft spec),
(c) hybrid. Same lookup probe, same fade. O: (b)/(c) ignite with
fewer hinted steps than (a) → student memory upgrade; hybrid wins →
matches field convergence. Needs harness build (W24 sandbox code as
seed). Phase 4 (after Phase 3).

## F-induction (Mamba: do faded students form induction heads?)
Q: mechanism check — is there an induction-head signature at ignition?
Design: induction probe (prefix [A][B]...[A] → predict B) on saved
checkpoints across generations (post-hoc, like F-mech) + on delta
students (closes deltanet.md candidate↔meter loop). O: probe score
jumps at ignition gen → induction is (part of) the mechanism;
flat → lookup without induction (report the null). Post-hoc part doable
now (cheap); delta part waits on F-deltanet.

## F-continuous-fade (CGAR exponential vs linear vs λ-annealed)
Q: which fade shape ignites cheapest? Design: same tutors/seeds,
three schedules matched on total steps — linear-staged (current),
exponential w_t = λ^{t-1}/Z (CGAR), GKD λ-annealed sampling mix.
R3's isomorphism test: if all three ignite at equal cumulative
guidance → "granularity" is one rule, three spellings (stack
confirmed); if exponential wins → adopt as default (RW-CGAR upgraded).
Phase 3.

## F-collapse-monitor (Huginn: hidden-state correlation as early warning)
Q: does state correlation across stages predict rot? Design: log
per-stage checkpoint state-correlation (CKA/cosine vs tutor) in all
Phase-3 chains. O: correlation collapse precedes ignition failure →
monitor ships in harness; else drop. Logging only — free with Phase 3.

## F-diversity-reservoir (Ren: runner-up lineage)
Q: does preserving losing lineages help? Design: keep runner-up
students (ignited but not promoted) as fallback tutors; when champion
lineage rots, resume from reservoir vs fresh T0 restart. O: reservoir
recovers faster → selection-plus-archive beats pure elitism (Ren
diversity axis). Phase 3 (cheap branch — blobs already saved).

## Parked / spec-only
- Mastery-gated fade (LoopThink 95%-gate): parked per queue discipline
  (fixed stages first; revisit iff Phase 3 shows stage-boundary rot).
- F-grounded: gate-as-grounded-reward framing for §8 — paper-side,
  no experiment (SOAR Finding 2 already supports; cite, don't build).
