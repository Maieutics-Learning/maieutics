# U70-F4 Wave 1 closeout — verdict F4-FIXED (pooled bars; delay still slow, 2026-11-27)

Execution: owner "run it" = execution on exact F4 v1.1 (F2-exact base + ctxw 3.0, forcing Wc←z-onehot in train+eval, Adam 3e-4 + clip 1.0 unchanged). Driver `u70-neural.js` + F4 cut. 20/20 F4 rows, 0 invalid. Ledgers: `d-u70-neural-f4-wave1.json`, gates `d-u70-f4-gates.json`. Smoke s0 clean (probe 0.9167, gap 0.17, loss 4.49→2.86 finite).

## Numbers (F4 pooled, n=20)
- ctxAcc **0.8795** (16/20 ≥0.85 — pass) / probe **0.7192** (12/20 ≥0.70 — PASS by +0.0192) / gap **0.1362** (20/20 ≥0.05 — pass) / usage 0.613 / KL raw 0.032 / delay-med **10** (13 detected, 7 seeds censored; oracle 2).
- Paired F4−F2 same-seed: dProbe **+0.0247** CI [−0.0067, +0.0560] (pooled pass, paired CI includes 0 — gain is broad but seed-heterogeneous), dGap **+0.0192** CI [+0.0071, +0.0313], dCtx **+0.0187** CI [+0.0058, +0.0316] (recovers ~1/3 of the F2 forcing cost).

## Verdict: F4-FIXED (per locked boundaries: probe pass AND gap pass)
The dial got sharper AND stayed load-bearing. ctx cost of forcing partially reversed. No stability blow-up (all finite, clip held — barrage worry did not materialize).

## Shape notes (follow-ups, not verdict-changers)
- Heterogeneity persists: seed 8 still collapses (probe 0.137 vs F2 0.147 — same seed stuck), seeds 9/10/15 stall 0.55–0.66. 12/20 pass vs 11/20 in F2 — the mean crossed, the tail did not.
- Detection still slow: delay-med 10 vs bar 4 (G1 delay fails; F4 verdict does not gate on it, but F3 speed work is still owed).
- KL raw 0.032 still under old floors — pressure now comes from the dense ctx teacher, not KL. As designed.
- Next (each needs own prereg+battery+countersign): F5 restart-discipline (your queued #2 — lottery vs discipline); F3 detection-speed; Phase-2 transfer now UNLOCKED by FIXED (needs gated proposal, frozen F4 vs fresh V2).

NO PUSH without explicit order + PAT.
