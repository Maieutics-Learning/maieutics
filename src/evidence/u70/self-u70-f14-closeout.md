# U70-F14 closeout — verdicts F14-TRAIN-REPAIRED + F14-HELDOUT-DEGRADES, subclass collapse (TRUE metric, 2026-11-27)

Execution: owner "countersigned" = execution on exact F14 v1.1 (TRUE full-latent intervention: `u70nApplyShuffle` IS the `u70nEval` V4 metric path; training F12-exact; 20 retrains + 80 evals train-clean/train-TRUE/held-clean/held-TRUE; T1-T4 + E1-E4 + T5/T6/E4h + T7/T8/T8b gates; per-seed early-HALT replication vs filed F12; oracle ceiling reused from F13). Driver `u70-neural.js` + F14 edits (eval-branch replacement + captureShuf hook + T7/T8/T8b + f14 gate/spec/config + epLoss + repCheck; nothing else — no LR/scale/recurrence/shuffle-semantics beyond the branch).

## Pre-smoke + smoke (all PASS)

- T5a CODE half (agent grep pre-smoke): literal path seeds 3/4/5/7/11/23 (tests), `s` from U70N_SEEDS 0..19, smoke [0], mapping s→s+20 (max 39). No path seeds beyond 0..39 — T5a CODE PASS. T5a LEDGER half (wave script): new-ledger maxEvalSeed 39, no seeds beyond 0..39 — PASS.
- Full gate suite pre-smoke (16/16 PASS): T1 forward-one-hotness, T2a jacobian, T2b vitality (284/284 moved), T3 helper isolation, T4 determinism, E1 zero-on-perfect, E2 detector, E3 determinism, E4 retention, T5 disjointness, T6a/T6b hashes, E4h retention, T7 metric-path isolation (300 trials), T8 helper-metric equivalence (strict ===), T8b independent recompute (strict ===, q never referenced).
- Smoke s0 (filed, no tweaks): train ctx 0.91/probe 0.91/TRUE-gap 0.1967 (filed partial 0.17 — TRUE larger, as the v1.1 bar-direction gloss predicts); held s20 ctx 0.7667/probe 0.7667/gap -0.0333; [F14-REP] s0 0-mismatch PASS; hashes 64-hex. Loss 4.5963/3.8923/3.5209/3.2667 (F12/F13-identical training).

## Wave (20/20 + 20/20, 0 invalid, 0 early-HALTs)

- Replication sanity: train-clean rows vs filed F12 rows — **0 mismatches** (all shared numerics + bins + traces bit-identical); hashes valid 40/40. Training identical; verdict weight comes ONLY from TRUE-metric absolute bars.
- TRAIN TRUE: probe **0.7183** (12/20) / gap **0.1468** (20/20) / ctx **0.8783** (16/20). Bars (probe ≥ 0.70 AND gap ≥ 0.05) both met → **F14-TRAIN-REPAIRED**: filed wins survive the TRUE repair.
- HELDOUT TRUE: probe **0.6227** (8/20) / gap **0.0274** (8/20, bar ≥ 0.05 FAIL) / ctx **0.7777** (4/20) FAIL → **F14-HELDOUT-DEGRADES**.
- Subclass: probe fails with klMedFail **0.0363** ≤ 0.06 (klMedTrain 0.0327, klMedHeld 0.0334 — KL near floor everywhere) → **collapse** (same rule as F13): latent carries train-trajectory-specific codes, falls back to ≈ cue-following on new tracks (held ctx 0.7777 vs V1 floor 0.7503 = +0.027; oracle beats cues by +0.237 on the same tracks).
- Leak-size finally measured correctly (DESCRIPTIVE, no verdict weight): TRUE-vs-partial gap train **+0.0108** CI [-0.0005,+0.0222], held **+0.0050** CI [-0.0046,+0.0146] — both CIs include 0: the filed partial gaps were hard-category use with ≈ zero leak-through, not leak-powered wins. F11's "leak-size ~0" read is confirmed on the TRUE metric it should have used.
- Train-minus-heldout TRUE deltas (descriptive): dProbe +0.0957 CI [+0.034,+0.158], dGap +0.1195 CI [+0.084,+0.155], dCtx +0.1007 CI [+0.058,+0.144] — all exclude 0: systematic degradation, not noise.
- Oracle ceiling reused from F13 (reads-only already filed): ctx 0.9537, shift +0.0039 → NO distribution-shift qualifier. Held ECE 0.1871 (clean-eval identical to F13, as expected).

## Verdicts (locked, independent)

**F14-TRAIN-REPAIRED** (both TRUE bars met — F4/F11 wins survive TRUE repair) + **F14-HELDOUT-DEGRADES, subclass collapse** (filed wins do not generalize under the TRUE intervention either). No qualifier, no retroactive moves, no PROCEED claim. Ledgers: `d-u70-neural-f14-smoke.json`, `d-u70-neural-f14-wave1.json`; gates `d-u70-f14-gates.json`; analysis `f14-analysis.json`.

## Follow-ups (each needs own prereg + battery + countersign)

z-recurrence wiring (C5), unfamiliar-context probe, causal ablations, calibration bar (held-out ECE 0.1871 fileable as input), sharpened F3, GRU-128, trace study, Phase-2. NO PUSH without order.
