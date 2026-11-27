# Premise artifact U70-PREREG v1.0 (frozen 2026-11-27; battery reads THIS)

**Under review:** `src/evidence/u70/u70-prereg-proposal.md` (neural prereg proposal: 20 seed-runs, V0–V5, metrics locked grace=10, gates G1–G5) + `src/evidence/u70/u70-minimal-arch.md` (GRU64 h + Cat4 z ST, heads, Dreamer KL package, <50k) + `src/evidence/u70/u70-causal-diagram.md` (7 do-interventions + failure taxonomy).
**Pinned inputs (not under review):** task spec v1.0, oracle report (ctx 0.95 / rho 0.66 / delay med 2 / FA 0.7/100 / masked 0.94 / misleading 0.90 / gap +0.20), lit-lessons v1.1.
**Standing constraints:** NO neuromodulation (Phase E gated behind G1+G4+G5); no post-data sweeps; scheduled-reset firewall; per-seed rows, no pooling for gates; veto returns only as baseline.

**The ask (barrage):** Implementability + gate-sanity kill-shot. The single flaw that would make this prereg un-runnable or its verdict uninterpretable as written, plus the cheapest fix (a locked number, a definition, or a dropped claim). <=150 words, numbered, no ELI5. Repeats of another scout's point must say what that point missed, or they are stale.
**Disciplines (10):** implementability, statistics/power, metrology/grace, causality/ablation, collapse/KL, baselines/controls, logging/gradients, scope/thresholds, failure-taxonomy, coherence.
