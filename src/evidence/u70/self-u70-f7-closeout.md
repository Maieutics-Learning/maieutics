# U70-F7 Wave 1 closeout — verdict F7-PERSISTS (warmup does not stabilize, 2026-11-27)

Execution: owner "execute" = execution on exact F7 v1.1 (F4-exact base + LR warmup 0→3e-4 over epochs 1..20, then flat). Driver `u70-neural.js` (lrEff in Adam step; variant F4 arch + warmup:20). 20/20 rows, 0 invalid. Ledgers: `d-u70-neural-f7-wave1.json` (warmup:20 filed), gates `d-u70-f7-gates.json`. Smoke s0 clean, loss path visibly different from F4 smoke (warmup applied).

## CORRECTION (append-only, affects baselines, not verdicts)
F6/F7 proposals stated "8 F4-catastrophe seeds (probe<0.50)". Wrong: 8/20 was F4's sub-0.70-BAR count. Actual F4 probe<0.50 = **4/20** (seeds 2, 6, 7, 8). No filed verdict changes (all verdicts use pooled bars), but the F7 reading rule's baseline ("drops vs 8") is void — re-derived below against 4.

## Numbers (F7 pooled, n=20)
- ctx **0.8777** (16/20) / probe **0.6970** (11/20 — MISSES 0.70 by 0.003) / gap **0.1343** (19/20) / usage 0.625 / KL 0.032 / catastrophes (probe<0.50) **5/20** (seeds 2,6,7,8 + new 16) / delay-med 11.
- Paired F7−F4 same-seed: dProbe **−0.022** CI [−0.061,+0.017] (n.s., leans negative), dGap −0.002 ~ zero, dCtx −0.002 ~ zero.
- Flip table on F4's 4 catastrophe births: NONE un-flipped (all 4 identical to 4 decimals); seed 16 flipped the other way (0.887→0.487).
- Path note: smoke/early losses differ (warmup applied), yet **11/20 seeds land on bit-identical metrics** — strong attractors, path-insensitive outcomes. Warmup moved the road, not the destination.

## Verdict: F7-PERSISTS (probe fail per locked boundaries) + NOT-STABILIZED per reading rule (catastrophes 4→5, no drop)
Warmup neither crosses the bar nor calms births. The early-slam hypothesis is not supported on same births. Next: initiation-scale/ensemble/symmetry-break at birth (F8) — the road is fine, the BIRTH is the lottery. F4 FIXED stands as filed (existence + use); F5+F7 qualify it twice (fragile, path-insensitive). NO PUSH without order.
