# Phase 1.a verdicts (adjudicated 2026-11-13 against frozen prereg v1.0)

Raw: `src/evidence/synthesis/phase-1a/phase-1a-results.json` (8 tutors + 32 students,
seeds 311–318). Stats recomputed independently here (Fisher exact two-sided,
Newcombe 95% Wilson difference-CIs). Prereg NOT amended — verdicts below use
the frozen δ=0.25 exactly as written.

## Outcomes

- Tutors (T0 HINTED 1200): 4/8 ignited (311, 314, 315, 316). Rotted: 312, 313,
  317, 318. Students nevertheless ignited 23/24 — teaching ≠ score, consistent
  with cheap-tests (d) (rotted T0s tutored igniters).
- staged (reference): 7/8. Lone failure s313 (0.365/0.525) — catastrophic,
  bimodal as usual. Tutor-failure escape clause NOT triggered (7/8 >> 3/8).
- attn-only: 0/8, all far below gate (killA 0.19–0.35, Hd ≤0.44).
  Fisher exact vs staged: p≈0.0014. **VERDICT (frozen rule): "hints
  insufficient alone," NOT "fading essential." DECIDED.**
- constant 8/8 vs staged 7/8: difference-CI (-0.22, +0.47). Inside ±0.25? No
  (upper 0.47). Excludes 0? No. **VERDICT: INCONCLUSIVE.**
- staged 7/8 vs instant-drop 8/8: difference-CI (-0.47, +0.22). Inside ±0.25?
  No (lower -0.47). Excludes 0? No. **VERDICT: INCONCLUSIVE.**

## Calibration finding (my error, a priori demonstrable)

The δ=0.25 margin is unachievable at n=8 for ANY data: even a hypothetical
8/8-vs-8/8 contrast gives difference-CI (-0.32, +0.32) — wider than ±0.25.
The EQUIVALENT zone I wrote into the prereg is empty by construction. This
uses no observed outcome (the 8v8 case is pure math), so it is a design flaw,
not a data-driven excuse. Consequences and fix need a v1.1 amendment
(proposed below, NOT applied — post-data amendments need user countersign).

## Substantive reading (Hypothesis, not verdict)

All soft-target arms ignited (7/8, 8/8, 8/8) regardless of schedule; the only
rotting arm is the one without soft targets (0/8, p≈0.0014). Directionally:
soft targets carry transmission, schedule shape is secondary at n=8
resolution — consistent with review #2 Q1 (soft targets run constant). The
formal schedule contrasts stay INCONCLUSIVE until resolved.

## v1.1 COUNTERSIGNED 2026-11-13 by user — FROZEN (runs may proceed exactly as specified)

## Stage-2 smoke (VERIFIED 2026-11-13 — tinynn shards unlocked per pool rule B4)

Pushed `src/lab/run-p1a.js` + `.github/workflows/p1a-smoke.yml` to the bench
repo, dispatched 2 single-combo jobs (seed 321 staged + constant). Both
`success`; ledger shape verified (seed/arm/tutor/student ev+ig+secs). Seed
321: tutor rotted, both students ignited — same teaching≠score pattern as
Stage 1. Node timing ~2–3 min/combo (tutor ~33–55 s, student ~84–136 s), so a
full-matrix shard (8 combos) lands well inside its 120-min cap.

## Stage-2 adjudication (RUN 2026-11-13/14 — both schedule contrasts DECIDED)

n=80/arm, fresh seeds 321–400, frozen v1.1 rules (δ=0.25, Fisher exact +
Newcombe 95% difference-CI). Raw: `phase-1a-stage2-results.json` (240
students + 80 tutors, GitHub Actions matrix run 43522301561, conclusion
success, 30/30 shards).

- Tutors: 29/80 ignited (same 80 tutors under all 3 arms) — teaching≠score again.
- staged 76/80 vs constant 77/80: diff −0.0125, CI (−0.088, +0.061) inside
  ±0.25, Fisher p≈1.0 → **EQUIVALENT**. The schedule does no detectable work.
- staged 76/80 vs instant-drop 74/80: diff +0.025, CI (−0.057, +0.110) inside
  ±0.25, Fisher p≈0.75 → **EQUIVALENT**. Graduality inert; the final
  hint-free state does the work.
- Tutor-failure escape clause not triggered (76/80).

Phase 1.a CLOSED: hints-alone DECIDED (insufficient alone, Stage 1);
both schedule contrasts DECIDED EQUIVALENT (Stage 2). Substantive reading
promoted from Hypothesis: soft targets carry transmission; schedule shape
is secondary at n=80 resolution.

## Cross-engine note (1.d prep — Node≡browser check, RUN 2026-11-14)

One-off: re-ran Stage-1 seed 311-staged in Node (workflow p1a-verify.yml,
since deleted), diffed against the filed browser ledger.
- Tutor phase (1200 steps): CROSS-ENGINE IDENTICAL — all five metrics exact
  (killA 1.0, Hd 0.715, Da 0.995, Hu 0.455, indist 1.0). Same code + same
  trajectory for 1200 steps; code-drift explanation disfavored.
- Student phase (3000 steps, same tutor): SAME VERDICT (ignite both), drifted
  scores — browser Hd 0.995/Hu 1.0 vs Node Hd 0.88/Hu 0.58.
- Codebase grep: no unseeded randomness (no Math.random/Date/cauchy anywhere
  but a comment). Presumed mechanism: transcendental ulp drift (softmax exp
  in the distillation path) amplified over the longer student trajectory.
- Standing of Stage-2 verdicts: UNCHANGED. Rate-level EQUIVALENT margins
  (±0.25, observed gaps ≤0.025) absorb far more than engine drift can
  plausibly move (~15/80 flips needed); cross-stage base rates match
  (95.8% vs 94.6%). Determinism claim restated precisely: same-engine
  bit-exact; cross-engine verdict-stable with score drift. The drift source
  (which op diverges first) is now 1.d's first question.

- (a) Recalibrated δ (e.g. 0.50): would render both contrasts EQUIVALENT on
  current data. NOT RECOMMENDED by me — picking the margin that flips the
  verdicts post-data is verdict-shopping even with honest math.
- (b) RECOMMENDED: accept the decided verdict (attn-only), keep both
  schedule contrasts INCONCLUSIVE, and specify the resolver: n≈24/arm
  confirmation OR a near-deterministic exact test. File the substantive
  reading as Hypothesis.
  - (b-i) Resolver update 2026-11-13 (user: run bigger until conclusive;
    GitHub confirmed): Stage 2 = n=80/arm on FRESH seeds 321–400 (disjoint
    from 311–318 and all prior runs), same 3k-step protocol + tutor/pool/
    exams frozen from v1.0, δ=0.25, Fisher exact + Newcombe difference-CI,
    same zones. Arms: staged reference (re-run on the SAME 80 seeds +
    tutors) + constant + instant-drop (attn-only stays decided, not re-run).
    Per-job self-contained (each job trains its own tutor then its
    student — deterministic, no cross-job deps); compute = GitHub Actions
    matrix (spec src/pool/workflows/p1a-matrix.yml, runner
    src/lab/run-p1a.js). Stage 1 (n=8) stands as filed; Stage 2 is a
    pre-registered extension, not a re-peek (countersign required before
    any Stage-2 run). EXECUTED 2026-11-14: countersigned by user, ran on the
    GitHub matrix (run 43522301561, success, 30/30 shards), adjudicated
    above — both contrasts EQUIVALENT, Phase 1.a CLOSED.
- (c) Minimal: keep everything INCONCLUSIVE, no v1.1, move on to 1.b/1.c
  (the schedule question matters less now that attn-only failed — the live
  question is what soft targets carry, not how they fade).

## Cost note

2 launches, ~110 min wall (worker variance 70–530 s/run; the gameplan's
"≈35 s/seed" estimate was 4–6× off on this worker). Resume-safe partials
worked as designed. Pool spend: 0.
