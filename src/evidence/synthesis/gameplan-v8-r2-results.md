# Gameplan battery v8 round 2 — results + adjudication (2026-11-13)

Premise frozen: `src/GAMEPLAN.md` v8. Spec: `src/evidence/synthesis/gameplan-v8-battery-spec.md`.
Raw: `scratch/gameplan-v8-r2-raw.json` (10 fresh reviewers, same ask shape, rotated angles;
9/10 primaries fetched). Score: 1 HOLD / 2 BREAK / 7 PARTIAL.
Dominant residual: single-chain luck (6 of 10 circle it — only runnable evidence, 2.b,
settles it). No barren round → patch once → v9 → round 3 (narrow steelman, not full
battery: documentary yield is diminishing; the residual is empirical).

## Adjudication

1. **R2-A1 HOLD** (2.b.0 insufficient proxy; add G1→G5 survival metric). ACCEPT.
2. **R2-A2 PARTIAL** (underpowered CIs; fix α). ACCEPT: 95% Wilson declared plan-wide.
3. **R2-A3 PARTIAL** (1.b/1.c lack numbers). ACCEPT: 1.b.iii correlation ≥0.95 →
   position-independent; 1.c pilot ≥3/4 → full n=8, ≤1/4 → skip.
4. **R2-B1 PARTIAL** (skimmer misread). ACCEPT: explicit no-weight-transfer disclaimer in
   1.c + paper (generality = schedule-level).
5. **R2-B2 BREAK** (tutor-quality confound; tutor-swap control). ACCEPT — genuinely new:
   low-vs-high G1 winners as tutors, inside 2.b.0 (cheap, prospective; post-hoc T0 analysis
   is not a substitute).
6. **R2-B3 PARTIAL** (G2-vs-G5 gap undefined). ACCEPT: 2.b.iii gap analysis explicit.
7. **R2-C1 BREAK** (no owned fail-closed gate). ACCEPT ownership half: CI (GitHub Actions)
   runs byte-compare; local pre-commit hook; overrides ONLY via logged ledger-or-cut
   decision (humans can override anything — the control is that override is a verdict).
8. **R2-C2 PARTIAL** (rate scaling; timestamp cap). ACCEPT: Phase 1 <2h, 2.b.0 <1h wall caps.
9. **R2-D1 PARTIAL** (2.b.0 mandatory blocking). ACCEPT: explicit — zero Phase-2 spend
   until 2.b.0 passes.
10. **R2-D2 PARTIAL** (cross-family failure frame). ACCEPT: 2.c.iii distinguishes
    task-specific failure (B fails, A replicates) from mechanism collapse (both fail).

## Patch v8 → v9

Survival metric + gap analysis (A1/B3), plan-wide 95% α (A2), 1.b/1.c numerics (A3),
disclaimer (B1), tutor-swap + mandatory blocking (B2/D1), CI ownership (C1), time caps
(C2), failure frame (D2). Reviewer errors: none material (C2's rate worry answered by
caps, not dismissed). Adoptions: 9. Next: round 3 = 6-steelman on v9 residuals, then stop
by the rule (diminishing documentary returns; chain-luck residual is empirical).
