# U70-F8 Wave 1 closeout — verdict F8-PERSISTS (tilt does not un-flip, 2026-11-27)

Execution: owner "go for it" = execution on exact F8 v1.1 (F4-exact base + per-seed tilt dir d(s)=RNG(76000+s) mod 4, magnitude 0.5, flat LR). Driver `u70-neural.js` (be tilt at init, then trained). 20/20 rows, 0 invalid. Ledgers: `d-u70-neural-f8-wave1.json`, gates `d-u70-f8-gates.json`. Smoke s0 clean (probe 0.9067, finite).

## Numbers (F8 pooled, n=20)
- ctx **0.8792** (15/20) / probe **0.6963** (11/20 — MISSES 0.70) / gap **0.1335** (20/20) / usage 0.638 / KL 0.036 / catastrophes **4/20** (same seeds 2,6,7,8).
- Paired F8−F4: dProbe **−0.023**, dGap ~0, dCtx ~0 (CIs incl. 0, lean negative).
- Flip table (F4's 4 catastrophe births, identical inits): ZERO un-flipped. Seed 7: 0.4333→0.4367 (+0.003, dir 0). Seed 8: 0.1367→0.1333 (dir 1). Directions across the 4: 3,3,0,1 — nothing correlates because nothing moved.
- Direction-vs-outcome tripwire: clean (no direction works, none leaks — the tilt is inert, not a hidden prior).

## Verdict: F8-PERSISTS (probe fail per locked boundaries)
The symmetry hypothesis is not supported: shared-vs-random orientation changes nothing on the exact births that flip. The lottery is not (only) permutation orientation at birth. Files as evidence AGAINST the flip-accident story as stated.
Next (queued): capacity ruling-out (GRU-128, same births — if identical attractors persist at 2x history, capacity is dead and the cause is definitively dynamical/init-deep); ensemble as the engineering backstop. No Phase-2 spend until formation is reliable. NO PUSH without order.
