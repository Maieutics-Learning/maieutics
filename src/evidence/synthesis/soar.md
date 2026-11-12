# SOAR (Sundaram et al., "Teaching Models to Teach Themselves", ICML 2026 poster, 2601.18778) — verdict: USED

AI-facing context: asymmetric self-play via bilevel meta-RL. C4 note filed
the verdict (different-axis, not precursor) + two steals. This note adds
verbatim abstract/method quotes + stacks + placements. Source:
scratch/track-c/soar.txt (39pp extraction of w7-soar.pdf).

## What it is
Teacher + student both init from target model. Outer loop: teacher trained
with RLOO to generate Q-A pairs; reward = student improvement on 0/128-
success MATH/HARP slices, normalized vs rolling baseline, averaged over
parallel student trainings. Inner loop: student trains 10 RLOO steps, then
reverts. Promotion: rolling teacher-reward average crosses threshold →
baseline updates to best student. Teacher never sees hard problems.
Findings: (1) bilevel meta-RL unlocks sparse-binary-reward learning;
(2) grounded > intrinsic rewards; (3) question well-posedness > solution
correctness. Mechanism: generating≠solving gap. Limitation: bilevel cost.
600+ runs, multi-seed.

## Load-bearing quotes (from scratch/track-c/soar.txt)
- Framing: "A teacher model generates synthetic problems for the student to
  train on with RL. The teacher is rewarded by the student's measured
  improvement on the real problems, providing a grounding signal."
- Finding 1: "it is possible to realize bilevel meta-RL that unlocks learning
  under sparse, binary rewards by sharpening a latent capacity of pretrained
  models to generate useful problems."
- Finding 2: "grounded rewards outperform intrinsic learnability rewards used
  in prior LLM self-play, reliably avoiding typical instability and
  diversity collapse modes."
- Finding 3: "the structure and well-posedness of questions are more
  critical for learning progress than solution correctness."
- Generating≠solving: "the ability to generate useful stepping stones does
  not require the preexisting ability to solve the hard problems, paving a
  principled path to escape reasoning plateaus without additional curated
  data."
- Promotion: "We subtract the initial student accuracy so that teacher
  rewards are normalized across outer-loop steps, necessary for the student
  promotion mechanism" + "average rewards over r parallel student trainings
  per dataset" (variance control).
- Double loop: "This is the first instance of 'double meta-RL loop' we are
  aware of in the context of self-play for LLMs."

## Novelty delta (C5 form)
They [meta-train a teacher to generate problems] under [sparse-reward math
RLVR, 600+ runs]; we [hand-design a hint-fading schedule executed by a fixed
tutor] under [tiny lookup, 8 seeds]; claim [staged fading ignites lookup]
holds: unaffected (content-axis vs scaffolding-axis). No precursor (no
fading anywhere in SOAR), no conflict. Scale gap noted (600+ vs 8 — no
parity claim).

## Stacks
- WITH our ignition gate: their Finding 2 (grounded > intrinsic) is
  independent support for Hd/killA bars — our gate is ALREADY a grounded
  reward. Frame the gate as such in §8 (F-grounded, joins patch batch).
- WITH winner-promotion tutor: their promotion (rolling-average threshold →
  new baseline) ≈ our promotion (best/perfect student becomes next tutor).
  Independent convergence — cite as corroboration of the rule shape.
- WITH Ren-IL: their grounded outer reward IS an interaction phase
  (selection on generated problems); their diversity-collapse-avoidance
  parallels Ren's Heff filtering. Three-way: selection done right sustains.
- AGAINST intrinsic-reward designs: our nursery must never gate on
  self-consistency/learnability proxies — SOAR measured that failure.

## Placement: BOTH
- Nursery: grounded-gate framing (§8) + promotion-rule corroboration (§7);
  generating≠solving as the license for tutors that can't solve what they
  teach (our tutor never takes the test — now a cited design choice, not an
  embarrassment); question-well-posedness > correctness as a curriculum
  design rule (spend effort on problem shape, not answer keys).
- Workspace: RLOO-outer/RLOO-inner double loop as a known-expensive pattern
  to AVOID in harness design (bilevel cost stated) — prefer our cheap
  fixed-tutor schedule; cite the cost asymmetry as the reason.
- Neither: MATH/HARP numbers, RLOO hyperparameters.

## Follow-ups
- F-grounded: frame gate as grounded reward in §8 (patch batch).
- RW-SOAR: §2 (different-axis contrast) + §8 (promotion convergence,
  generating≠solving license, well-posedness rule).
