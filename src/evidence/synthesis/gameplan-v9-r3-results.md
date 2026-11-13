# Gameplan battery v9 round 3 STEELMAN — results (2026-11-13): 6/6 HOLDS → STOP

Premise: `src/GAMEPLAN.md` v9. Spec: `src/evidence/synthesis/gameplan-v9-battery-spec.md`.
Raw: `scratch/gameplan-v9-r3-raw.json` (6 fresh defenders, 1 claim each + priced residual).
**Satisfaction declared. The iteration stops here by the stop rule (unanimous steelman).**
Residuals priced below are execution notes, not new batteries — only runnable evidence
(Phase 1 arms, 2.b chain) can retire them, and that is the plan working, not the plan lacking.

## Priced residuals (kept, assigned)

- S1 (1.a decidability): an attn-only *failure* reads as "hints insufficient alone," not
  "fading essential" — verdict wording fixed in v10. Extra low-hint/high-noise arm declined
  (diminishing; reopen only if 1.a.iii lands inconclusive-null).
- S2 (1.b operability): correlation可疑 common-mode caveat noted; slot-sweep already moves
  the target across slots (the requested "shuffle" is the sweep). Residual: positional bias.
- S3 (two-task sufficiency): residual = algorithmic depth/compositionality; gap analysis
  (2.b.iii) is the tripwire (high G2 + rotted G5 = slow leak, not generality).
- S4 (gate logic): tutor-swap already in 2.b.0 — defender confirms completeness. Residual:
  G1-winner luck (priced into the survival metric + gap analysis).
- S5 (harness ownership): FOLDED to v10 — tolerance-mode compare for cross-engine runs
  (exact on same engine; documented tolerance fallback so CI can't deadlock on ulp drift).
- S6 (venue path): FOLDED to v10 — power analysis for n=8 justifying the numeric
  thresholds (detectable effect sizes at 95% Wilson) ships with v0.15.

## Iteration totals

3 rounds, 26 reviewers (10 + 10 + 6): r1 1/3/6 → 8 adoptions; r2 1/2/7 → 9 adoptions;
r3 6/6 HOLDS. Reviewer errors logged (C2 per-step misread; B1 weight-transfer demand).
v10 = v9 + S1 wording + S5 tolerance + S6 power analysis. Next: execute, don't review —
Phase 1.a prereg is the next artifact.
