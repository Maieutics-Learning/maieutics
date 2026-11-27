# U70-CTX minimal architecture proposal (not licensed; build only after prereg battery + countersign)

Goal: the smallest RSSM-inspired net that can pass the prereg gates, with collapse and causality instrumented. No ACh/NE modulation (Phase E gated).

## I/O (per trial t)
- Inputs: `x_t` (cue: L/R/∅ one-hot-3), `a_{t-1}` (prev action one-hot-2 + first-trial flag), `r_{t-1}` (prev reward 0/1 + flag). No context or rho labels at input (labels used ONLY as auxiliary head targets in training, never as inputs).
- Outputs: `p̂(c_t)` (2-way), `p̂(rho_t)` (3-way + mean), `x̂_t` + `r̂_t` reconstructions, `v̂` action-value (for the functional-use action selector only).

## State (the h/z split — Dreamer mechanics, U70-scoped)
- `h_t = GRU(64; input ⊕ z_{t-1})` — deterministic history; carries belief across masks/distractors.
- `z_t ~ Cat(4)` discrete (straight-through) — stochastic latent context variable. 4 categories (not 2) so collapse-to-one and context-merging are distinguishable in usage stats. Posterior `q(z|x,h)` from encoder; prior `p(z|h)` from dynamics predictor.
- Heads: context-head `(h,z)→p̂(c)`; rho-head `(h)→p̂(rho)` (deliberately NOT from z — reliability must be estimable independent of context); decoder-heads `(h,z)→x̂,r̂` (generative grounding REQUIRED by battery R2/R9: without these the KL terms are undefined).

## Losses (fixed weights; scale-robust)
- `L_pred`: symlog-squared on `x̂,r̂` + logistic on continuation (keep the Dreamer robustness trick at small scale).
- `L_dyn = KL( sg(q) || p )` (dynamics learns the prior); `L_rep = KL( q || sg(p) )` weight 0.1 with free-bits floor + 1%-uniform mixture on all categoricals (anti-collapse package, exactly the verified Dreamer mechanics).
- `L_ctx = CE(p̂(c), true c)`, `L_rho = CE(p̂(rho), true rho)` — supervised head losses on filed paths (representation phase; not a biological claim).
- `L = L_pred + L_dyn + 0.1·L_rep + L_ctx + L_rho`. Collapse monitors: per-seed latent-usage histogram, KL traces, `q` entropy. Gradient discipline: log estimator/dynamics/head/task gradient norms + cosine (U57 test) separately per module.

## Scale / training
- Params: <50k (GRU-64 + small MLPs). Streams: filed 20 paths; behavior-policy observations regenerated per run (obs seeds filed). Optimizer/lr/epochs set in prereg battery (proposal: Adam, lr 3e-4, 200 epochs/seed-path, batch=whole 300-trial run, 5 restarts → best-by-train-loss; all pre-hoc).
- Anti-shortcut: low-rho + masked + misleading + switch-lag combos already in spec defeat cue-copying; V2 (no-z) baseline quantifies the shortcut floor.

## Causal hooks (built in, not bolted on)
- Freeze/shuffle `z` at decision (V4), zero `rho-head`, lesion recurrence — one flag each, logged. Probe decoders read-only (never fed to policy).

## What this deliberately omits
Neuromodulation, episodic retrieval (Memora/Hindsight patterns stay as data-bookkeeping, not model parts), memory OS, workflow orchestration. Those return only after G1+G4+G5 pass.
