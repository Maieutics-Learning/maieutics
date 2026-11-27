# U70-CTX neural prereg PROPOSAL (not licensed; needs battery + countersign before execution)

Track: U70 (U60 label stays with dead substrate family). Depends on: task spec v1.0, oracle report, causal diagram, lit-lessons v1.1. Phase: neural representation (NO neuromodulation; Phase E gated behind this).

## 1. Independent unit, N, exclusions, stopping (explicit)
- Unit: one seed-run (300 trials on a pre-generated path; paths filed, seeds 0..19 for the main comparison; FRESH seeds 20..39 reserved for a held-out replication if PROCEED).
- N: 20 seed-runs per model variant (matches oracle ledger; no pooling across seeds for gates — per-seed rows + pooled descriptives).
- Exclusions (pre-hoc): runs with logging gaps or NaN gradients are INVALID and re-run once; delay censoring at dwell end is RECORDED (not excluded). Dwell-resampled switches are analyzed as-recorded.
- Stopping: fixed N=20/variant, no peeking, no post-data sweeps. Scheduled-reset firewall applies to any Phase-E follow-up (no online resets to inflate persistence).

## 2. Variants (all on identical streams)
V0 oracle (reference, filed). V1 reactive cue-follow (floor). V2 recurrent-no-latent (GRU + heads, no z). V3 full minimal-arch (h + discrete z + rho-head + reconstruction). V4 V3 with frozen/shuffled z at decision (causal-use control). V5 V3 without rho-head (necessity control).

## 3. Metrics (locked definitions; grace=10; sensitivity at 5/15 for FA/delay)
ctxAcc, ECE (10-bin), detDelay (first t≥switch with P(true)≥0.75; censored at dwell), FA/100 (P(wrong)≥0.75 outside grace), rhoAcc + rhoMAE, maskedAcc, misleadAcc, lowRhoAcc, actionAcc (posterior-guided) vs cueActAcc, latent-usage + KL traces, veto/task gradient logs (U57 hypothesis: log estimator-vs-task gradient cosine).

## 4. Gates (explicit; sourced to oracle numbers as U70 conventions)
- G1 context (tight): ctxAcc ≥ 0.85 (oracle 0.95; margin for approximation) AND ECE ≤ 0.12 AND detDelay median ≤ 4 with censored ≤ 10% AND FA ≤ 2.0/100 @grace10 (sensitivity reported @5/15).
- G2 reliability (loose, as designed): rhoAcc ≥ 0.55 AND rhoMAE ≤ 0.14 (oracle 0.66/0.095; noisier by construction).
- G3 robustness: maskedAcc ≥ 0.85 AND misleadAcc ≥ 0.80 AND lowRhoAcc ≥ 0.75 (oracle 0.94/0.90/0.87).
- G4 functional use: actionAcc > cueActAcc (paired per-seed, strict) AND V4-ablation gap: actionAcc(V3) − actionAcc(V4) ≥ 0.05 (causal-use bar; oracle gap +0.20 is the reference, NOT the bar).
- G5 no-collapse: mean latent-usage ≥ 50% of categories across seeds AND rep-KL above free-bits floor on ≥ 18/20 seeds (else representation failure regardless of accuracy).
- Verdicts: PROCEED iff G1+G4+G5 pass (G2/G3 reported; G3 fail → behavioral-failure subclass). Else: representation / integration (G4 fail with G1 pass = U64e pattern) / behavioral / inconclusive per causal diagram. TOTAL cap + halt-levels mirror U64e conventions (filed at battery).

## 5. Reporting
Per-seed ledger (all metrics + delays + censor flags), pooled descriptives, delay CDF, calibration curve, FA-vs-grace sensitivity, ablation table, gradient logs, configs + code hashes, evidence synthesis pointer. No neuromodulation claims; Phase E requires PROCEED here first.
