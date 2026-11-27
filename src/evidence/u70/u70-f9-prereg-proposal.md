# U70-F9 prereg PROPOSAL v1.0 (NOT licensed — needs battery + countersign)

Track: U70-CTX de-lottery #4 (birth volume). Base: F4 EXACT (forcing Wc←z-onehot train+eval, ctxw 3.0, floor 0.05, repw 0.1, GRU64/Cat4-ST, BPTT-50 carry-over, clip 1.0, 200 epochs, Adam FLAT 3e-4 — no warmup, no tilt).

## Diagnosis
F5: same streams, different births → 10/20 split (birth, not path). F7: same births + calm road → same graves (not the road). F8: same births + shared orientation → zero un-flips (not orientation). Remaining birth property: VOLUME — uniform draws ±sqrt(1/fan) still produce births where a few loud encoder voices scream one category from trial one and the room falls in line before lessons arrive (below-chance = locked, not blurry).

## Change (ONE global scalar; everything else F4 EXACT)
- Init scale: all `u70nParam` uniform draws ×**0.5** (same seeds → same draws, half magnitude; biases stay zero). One scalar, whole net, no subset-picking.
- Why quieter (pre-registered direction): loud-at-birth locks flips early; halving lets the dense ctx teacher lead from trial one. If catastrophes move, it's volume. If the same four seeds (2,6,7,8) die at half volume, the curse is in the draw pattern itself → ensemble.
- Self-policing: if half-volume breaks learning globally (pooled collapses), that files as PERSISTS with mechanism (too quiet to break symmetry) — informative either way. Usage/KL/grad-norms filed.

## Design
- Retrain on SAME 20 seeds (same draws, same streams — paired vs filed F4; ONLY the scale differs). N=20. Exclusions/stopping/firewall verbatim. No selection.
- Sharpest read (DESCRIPTIVE): F4's 4 catastrophe births on identical draws — un-flip at half volume?
- Driver change (post-battery, pre-countersign): `U70N_INITSCALE` (default 1.0; F9 = 0.5) multiplying init draws. Smoke 1 seed (locked: filed, bugs-only, no tweaks).

## Outcomes (bars UNCHANGED)
- Primary: detached probe ≥0.70 (pooled) AND gap ≥0.05. Paired F9−F4 dProbe/dGap/dCtx + CI.
- Verdicts locked: FIXED / PARTIAL / PERSISTS. Near-misses do not move bars. No Phase-2 in this wave.

## Reporting
Per-seed ledger + paired diffs + CI + catastrophe/flip/usage tables, configs + hashes, verdict. Ensemble queued behind this (F10) if volume fails.
