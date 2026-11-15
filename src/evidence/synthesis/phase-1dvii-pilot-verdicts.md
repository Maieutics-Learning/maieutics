# Phase 1.d.vii s313 pilot verdict (RUN 2026-11-14 on frozen vii v1.0, ledger `scratch/vii-pilot.json`)

## Gate
- Replication: s313 instdrop retrain vs filed ev BIT-EXACT (346.8 s). 4th replication of the recipe.
- MC fallback: NOT used (0/400 lines degenerate). Predictive = linearized probit throughout, deterministic.

## Numbers (arm F, confirmatory)
- λ selection: valNLL = [1.281733, 1.081514, 0.640073, 0.152375, 0.01334, 0.001981]
  for λ = [1e-3 … 100] — strictly decreasing, selection sits at the GRID EDGE
  (λ=100). Posterior ≈ MAP + sliver. Pre-mortem "collapse to MAP end" echo: recorded.
- s313 (400 lines, 60 err): Laplace-AUC 0.891618, entropy-AUC 0.892108,
  own-MAP loudness-AUC 0.891520 on identical lines.
- Guardrails: killA 200/200 == 1.00 ✓; killHd 140/200, frozen 140/200 ✓.
- Bars: AUC ≥ 0.85 ✓, killA ✓, killHd ✓ → ALL TRUE → PILOT-PASS.

## Honest reads (numbers first, no narration-laundering)
1. Laplace ≈ loudness to the 3rd decimal (0.8916 vs 0.8915). The pilot passes on
   the ABSOLUTE bar, not on improvement: curvature adds ~nothing on s313; the
   MAP's own separation is doing all the work. The full-8 RELATIVE bar
   (beat 0.9293 by ≥0.01) is the real test.
2. λ=100 grid edge + strictly decreasing valNLL: the selector wants an even
   tighter posterior. If the full run also pins λ=100 everywhere, suspect (a)
   (Gaussian re-describing a bad peak) gains — filed here as pre-result.
3. Expectation was 0.78–0.88; observed 0.8916, slightly above — driven by MAP
   separation, not curvature help (see 1).
4. Mean predictive NLL on exams 0.383578 (reference, no bar attached).

## Research arm U (quarantined diagnostic — NEVER confirmatory)
- 10 hard-label steps on own killHd error lines (seed 9813): killA 82/200,
  killHd 98/200, Laplace-AUC 0.643662, loudness-AUC 0.654154, λ=0.1.
- "Little bit unfrozen" destroys the brain: even 10 correction steps break killA
  (1.00 → 0.41) and doubt collapses with accuracy. Reinforces the 50-step
  diagnostic (correction sharpens remaining errors / breaks the easy exam).
- Disclosure: errSet collected 59/60 error lines — the diagnostic's local
  `argmax` compared value-to-index (same typo shape as dump-driver's ptr-only
  quirk), so one error line escaped the 10-step set. Confirmatory arm F is
  UNAFFECTED (its correctness loop is strict-greater first-max, matching
  dump-driver). Diagnostic stays quarantined regardless.

## Ruling: PILOT-PASS → full-8 authorized per staged bars
- Feeds: full-8 result (pass or fail) → 1.e.iii Laplace line + F-new.
- Standing warnings carried into full: λ-edge watch, Laplace≈loudness watch.
