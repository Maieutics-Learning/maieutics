# U70-CTX neural Wave 1 closeout — verdict NO-PROCEED (2026-11-27, prereg v1.1 EXACT)

Execution: driver `u70-neural.js` (GRU64 h + Cat4 z ST, BPTT-50, grad-clip 1.0, 1 restart/seed, Adam 3e-4, 200 epochs, free-bits 0.25, rep-w 0.1, 1% uniform). Countersign: owner "train at least 20" = execution on exact v1.1. 80/80 rows COMPLETE, 0 invalid. Ledger: `d-u70-neural-wave1.json`; gate rollup: `d-u70-neural-gates.json`. No peeks, no post-data changes (floor value was set pre-hoc in driver; smoke metrics did not alter it).

## Pooled V3 (n=20) vs gates
- G1 context: ctxAcc 0.9273 (20/20 seeds ≥0.85 ✓) / ECE 0.0698 ✓ / detDelay median **6** (bar ≤4 ✗) / FTD 1/81 (1.2% ✓) / FA 0.58 ✓ → **G1 FAIL (delay)**.
- G2 reliability: rhoAcc 0.7063 ✓ / rhoMAE 0.0883 (20/20 ≤0.14 ✓) → **G2 PASS**.
- G3 robustness: masked 0.9163 ✓ / mislead 0.8925 ✓ / low-rho 0.8638 ✓ → **G3 PASS**.
- G4 functional use: actionAcc 0.9273 > cueActAcc 0.7315 on 20/20 seeds ✓-strict, but ablation gap mean **0.0017**, 0/20 seeds ≥0.05 → **G4 FAIL**.
- G5 no-collapse: usage 0.94 (20/20 ✓) / z-only probe **0.6155** (7/20 ≥0.70 ✗) / rep-KL above 0.25 floor on **0/20** seeds (mean raw KL 0.11 ✗) → **G5 FAIL**.

## Verdict: NO-PROCEED — representation failure (latent collapse) + integration-failure signature
- V2 (no-latent GRU) actionAcc 0.9280 ≈ V3 0.9273; V5 (no rho-head) 0.9360. The deterministic history path carries everything; z is decorative. Shuffling z changes nothing (gap ~0) — the exact U64e pattern the prereg was built to catch, now measured in the neural substrate itself.
- Mechanism (filed pre-hoc risk, now observed): raw KL (0.11) sits permanently under the 0.25 free-bits floor, so dynamics/representation KL gradients are identically zero; z learns only from head supervision and carries partial context (probe 0.62) without causal role. Usage stays high (all 4 cats active) — collapse is functional, not distributional. G5's multi-part design caught what usage-alone would have missed (battery R5/R9 vindicated).
- Delay median 6 vs oracle 2: the h-path detects switches late — consistent with a reactive-plus-inertia strategy rather than latent inference.

## Follow-ups (each needs own prereg + battery + countersign; nothing licensed)
- F1: sub-floor free bits (0.05) + β-annealed rep weight, testing whether KL gradients restore z-use without posterior collapse. Names the exact flaw above; does not touch gates.
- F2: force z through the action bottleneck (policy reads z-only + rho-gated), testing whether causal-use can be architecturally required rather than hoped for.
- F3: detection-speed diagnosis — is delay-6 inherent to GRU-64 inertia or a training artifact (probe: auxiliary switch-prediction loss on h, read-only).
