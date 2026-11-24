# Fresh-eyes div-v10 battery (3 sealed, 2026-11-24)

Raw: `scratch/fresh-eyes-div-v10-3x.txt`. Spec: `src/evidence/decomp/div-v10-prereg.md`.

## Raw R1 (math) — PARTIAL
**Hardest Hole:** diversity-accuracy trade-off (β=0.2 pushes disagree 0.10→0.20 easiest via wrong-spread). **Fix:** prioritize E4 gated (bonus only when pop correct).

## Raw R2 (implementation) — NEEDS-PATCH
**Gaps:** 1. Non-differentiability (vote-split step function, backprop impossible). 2. Bootstrap starvation (B/5≈3 noisy). 3. Metric conflict (diverse errors). **Test:** dry-run grad check (∇β·disagree=0 for discrete). **Patch:** differentiable entropy/diversity loss or soft-assignment.

## Raw R3 (rival) — UNVERIFIED
Rival div-func vs div-boot. Killer E4 gated. Contains wrong-spread (E4), starvation (3/head noisy), diversity-without-gain (v11 precedent).

## Adjudication (agent owns verdict, 2026-11-24)

- R2 NEEDS-PATCH ADOPTED as v10.1 (mechanism fix, not threshold move): discrete vote-disagree REPLACED by differentiable logit-spread — loss = −β·spread, spread = mean_o Var_k(logitsK[k][o]), grad dLg[k][o] = −β·2·(lg−mean)/K/C/B (directly into per-head grads, no softmax Jacobian needed). Logit spread ≈ functional spread, differentiable, trivial. Dry-run grad check runs as driver smoke (assert grad nonzero).
- R1/R3 E4 prioritized as v10.1: div-func uses GATED spread (apply diversity grad only when pop argmax mean == y — prevents wrong-spread; filed openly). div-boot stays ungated slices (isolate). E4 is now core, not evolver.
- Bootstrap starvation filed as limitation (B/5≈3 noisy; scale kept to preserve Div precedent; E3 no-Div-nudge reserved if noise dominates).

Amendment v10.1: soft gated logit-spread + bootstraps (core); E4 promoted to core. Zero bar moves. Score: 1 PARTIAL (adopted priority) + 1 NEEDS-PATCH (adopted fix) + 1 UNVERIFIED (contained via gating).
