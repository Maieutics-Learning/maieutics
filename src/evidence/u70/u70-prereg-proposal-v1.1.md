# U70-CTX neural prereg PROPOSAL v1.1 (battery-patched; NOT licensed — needs re-close + fresh countersign)

Track: U70 (U60 label stays with dead substrate family). Depends on: task spec v1.0, oracle report, causal diagram, lit-lessons v1.1. Phase: neural representation (NO neuromodulation; Phase E gated behind this).
Battery: barrage v1.0 10/10 NEEDS-PATCH (verbatims `prereg-battery/r1..r10`); patches below; re-close pending.

## 1. Independent unit, N, exclusions, stopping (explicit)
- Unit: one seed-run (300 trials on a pre-generated path; paths filed, seeds 0..19 for the main comparison; FRESH seeds 20..39 reserved for a held-out replication if PROCEED).
- N: 20 seed-runs per trained variant (matches oracle ledger; no pooling across seeds for gates — per-seed rows + pooled descriptives).
- Exclusions (pre-hoc): runs with logging gaps or NaN gradients are INVALID and re-run once; never-reached-0.75 delays are recorded as FTD (failure to detect), not silently censored. Dwell-resampled switches are analyzed as-recorded.
- Stopping: fixed N=20/variant, no peeking, no post-data sweeps. Scheduled-reset firewall applies to any Phase-E follow-up (no online resets to inflate persistence).
- Training discipline (R1/R7 fixes): truncated BPTT window 50 with state carry-over, grad-clip 1.0. ONE restart per seed-path (init RNG = path seed), no best-by selection of any kind (best-by-train-loss is a mini-sweep and is banned).

## 2. Variants (all on identical streams)
V0 oracle (reference, filed). V1 reactive cue-follow (floor). V2 recurrent-no-latent (GRU + heads, no z). V3 full minimal-arch (h + discrete z + rho-head + reconstruction). V4 = FROZEN V3 weights with test-time z-shuffle at decision, forced-use (same 20 seeds — a paired intervention, not a separately trained variant). V5 V3 without rho-head (necessity control, trained same discipline).

## 3. Metrics (locked definitions; grace=10; sensitivity at 5/15 for FA/delay)
ctxAcc, ECE (10-bin), detDelay (first t≥switch with P(true)≥0.75; FTD if never within dwell), FA/100 (P(wrong)≥0.75 outside grace; slow detections are penalized by BOTH delay and FA by design), rhoAcc + rhoMAE, maskedAcc, misleadAcc, lowRhoAcc, actionAcc (posterior-guided) vs cueActAcc, latent-usage + KL traces + z-only probe, estimator/task gradient norms + cosine (U57 hypothesis).

## 4. Gates (explicit; sourced to oracle numbers as U70 conventions)
- G1 context (tight): ctxAcc ≥ 0.85 (oracle 0.95; margin for approximation) AND ECE ≤ 0.12 AND detDelay median ≤ 4 with FTD ≤ 10% AND FA ≤ 2.0/100 @grace10 (sensitivity reported @5/15).
- G2 reliability (loose, as designed): rhoAcc ≥ 0.55 AND rhoMAE ≤ 0.14 (oracle 0.66/0.095; noisier by construction).
- G3 robustness: maskedAcc ≥ 0.85 AND misleadAcc ≥ 0.80 AND lowRhoAcc ≥ 0.75 (oracle 0.94/0.90/0.87).
- G4 functional use (paired within-run via V4; R8/R10 fixes): actionAcc(V3) > cueActAcc (per-seed, strict) AND ablation gap actionAcc(V3) − max(cueActAcc, actionAcc(V4)) ≥ 0.05 with paired per-seed differences + CI (forced-use of corrupted z in V4; oracle gap +0.20 is reference, NOT bar). V5 reported alongside for attribution (R4/R6: rho-head bypass check — if V5 ≈ V3, reliability carries the behavior, not z).
- G5 no-collapse (prerequisite for G4; R5/R9 fixes): latent-usage ≥ 50% of categories AND rep-KL above free-bits floor on ≥ 18/20 seeds AND z-only probe p(c|z alone) ≥ 0.70 (proves z carries context, not just h). G5 fail → representation failure (latent collapse) REGARDLESS of actionAcc; G4 uninterpretable without G5.
- Verdicts: PROCEED iff G1+G4+G5 pass (G2/G3 reported; G3 fail → behavioral-failure subclass). Else: representation (incl. collapse) / integration (G1 pass + G4 fail = U64e pattern) / behavioral / inconclusive per causal diagram. TOTAL cap + halt-levels mirror U64e conventions (filed at battery).

## 5. Reporting
Per-seed ledger (all metrics + delays + FTD flags), pooled descriptives, delay CDF, calibration curve, FA-vs-grace sensitivity, paired V3–V4 differences + CI, ablation table (V2/V5), gradient logs, configs + code hashes, evidence synthesis pointer. No neuromodulation claims; Phase E requires PROCEED here first.
