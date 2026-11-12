# C4 item 1 — SOAR: "Teaching Models to Teach Themselves" (2601.18778, ICML 2026 poster, PMLR v306)

## What it is
Asymmetric self-play via bilevel meta-RL for sparse-reward kickstart. Teacher + student both init from target model.
Outer loop: teacher trained with RLOO to generate Q-A pairs; reward = student improvement on a hard subset
(0/128-success MATH/HARP slices), normalized against a rolling baseline; rewards averaged over parallel student
trainings to cut variance. Inner loop: student trains on generated data with RLOO for 10 steps, then reverts.
Promotion: when rolling teacher-reward average crosses a threshold, baseline updates to the best trained student.
Teacher never sees the hard problems — curriculum recovered from reward signal alone. 600+ runs, multi-seed.

## Three findings
1. Bilevel meta-RL unlocks learning under sparse binary rewards (direct RLVR on hard set fails; teacher-generated stepping stones get the student unstuck).
2. Grounded rewards (measured student progress) beat intrinsic learnability/self-consistency rewards — intrinsics hack, diversity-collapse, unstable across seeds.
3. Question structure/well-posedness matters more than solution correctness.
Plus: "generating ≠ solving" gap is the mechanism (model can generate chain-rule exercises it cannot itself solve);
meta-RL sharpens latent pretraining capacity rather than creating ex nihilo. Stated limitation: bilevel compute cost.

## C4 verdict: USED (not a precursor — different axis)
- Precursor check (C5 bar): their teacher generates PROBLEMS (what-to-teach, content); our tutor executes a FADING
  SCHEDULE (how-to-withdraw-help, scaffolding). No staged hint fading anywhere in SOAR (student trains plain RLOO
  on generated data). Novelty holds. Tag: different-axis, not wrong-scale.
- Steal 1 (corroboration): grounded-reward principle — our ignition gate (Hd/killA bars) is already a grounded
  reward, not an intrinsic proxy. Cite SOAR's finding 2 as independent support. → F-grounded (frame gate as
  grounded reward in §8; joins the paper-patch batch F2/F3/RW-C3, gated behind the no-shipped-code rule).
- Steal 2 (convergent design): their promotion mechanism (rolling-average threshold → new baseline) ≈ our
  winner-promotion tutor rule (best/perfect student becomes next tutor). Independent convergence — cite.
- Differentiator (novelty delta): their bilevel loop is compute-heavy (parallel students × outer iterations);
  ours runs in-browser, zero API/GPU. Cheap selective teaching vs expensive meta-teaching.
- Scale honesty: 600+ runs vs our 8 seeds — note the gap, don't overclaim parity.
- C5 form: "They [meta-train a teacher to generate problems] under [sparse-reward math RLVR]; we [hand-design a
  hint-fading schedule executed by a fixed tutor] under [tiny lookup curriculum]; claim [staged fading ignites
  lookup] holds/falls: unaffected (different teaching axis); goal impact: none; so-what: grounded-gate framing + promotion convergence cited."
- No conflict → no RW patch, no experimental follow-up (their result needs no red-team from us).

## C4 shelf remaining (9 items)
SDFT; curriculum-extraction distillation; SGSD + skill/mistake banks; emergent communication + reviews;
cultural-evolution degeneration warnings + recursive bootstrapping; AlphaZero/MuZero self-play; OPD;
THINK-OR-REMEMBER + memorize-vs-derive split.
