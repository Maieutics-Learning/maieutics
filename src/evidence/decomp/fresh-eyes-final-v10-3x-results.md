# Fresh-eyes final-v10 battery (3 sealed, 2026-11-24)

Raw: `scratch/fresh-eyes-final-v10-3x.txt`. Spec: `src/evidence/decomp/final-v10-prereg.md`.

## Raw R1 (math) — PARTIAL
Hardest hole absolute wall (0.70/0.60); F1 2-token bottleneck decider (bypass vs incapacity). Fix: F1 oracle control 0.80 (already in spec — run first; if oracle fails, format-break, dosing moot; if passes, hybrid F5 converts strong-partial).

## Raw R2 (implementation) — IMPLEMENTABLE
Gaps: F1 bottleneck risk (positional/carry sneak), F5 gated on F1, baseline drift (weight-locking). Test: F1 alone (freeze backbone → tiny head → end-to-end; ≥0.60 viable, oracle ≥0.80 required).

## Raw R3 (rival) — UNVERIFIED (GRADUATION-BLOCKED)
Rival gate/arch shift. Killer absolute wall. Contains F1 bottleneck + dose/recipe + combine (F5 hybrid rand/pick) + CPU/quorum. Success = bars via 2-head.

## Adjudication (agent owns verdict, 2026-11-24)

- R1 PARTIAL, no new patch (oracle control already the decider; run F1 + oracle first, F2-F5 gated by what F1 teaches — evolving order kept).
- R2 IMPLEMENTABLE, clarifications PINNED (no train change): F1 trains full trunk+Hv+tiny-head end-to-end from scratch (not frozen backbone — "freeze backbone" in R2 test means lock eval streams/weights versions for paired comparison, i.e. same rngs/masks/streams as winners; filed openly); weight-locking = eval streams + mask seeds locked (42000/91000/52500/52400+seed), not weight-freezing; F5 gated on F1 (already).
- R3 UNVERIFIED-pending: run F1 (that's the verification); graduation-blocked stands (absolute wall unmet; final-10 is architectural, not graduation).

Amendment v10.1: end-to-end + weight-locking pinned. Zero bar moves. Score: 1 PARTIAL + 1 IMPLEMENTABLE + 1 UNVERIFIED-pending. Run F1 first.
