# U70-F13 closeout — verdict F13-DEGRADES, subclass collapse (generalization fails, 2026-11-27)

Execution: owner "countersigned" = execution on exact F13 v1.1 (held-out split: train F12-exact seeds 0..19, eval each model on train s + paired fresh 20+s; T5/T5a/T6/E4h + F11 T1-T4 + F12 E1-E4 gates; weight+config hashes; Phase A oracle 20..39 reads-only). Drivers `u70-neural.js` + `u70-oracle.js` + F13 edits (held-out eval path, hash helpers/lanes, T5/T6/E4h block, F13 test gate, oracle opts.seeds + f13 tag; nothing else — no LR/scale/recurrence/shuffle-semantics change).

## Pre-smoke + Phase A (all PASS)

- T5a CODE half (agent grep pre-smoke): path-generation call sites use seeds 5/4/7 (tests), `s` from U70N_SEEDS 0..19, smoke [0]; oracle U70_SEEDS 0..19, test seed 3. No 20..39 path use anywhere. T5a LEDGER half (wave script): 29 filed neural ledgers, 436 rows, maxSeed 19, zero violations. Reservation fresh — T5a PASS.
- Phase A oracle 20..39 (reads-only, E1-E3 PASS, determinism double-check seed-25 identical): ctxAcc **0.9537** (filed 0.9498, shift +0.0039 → NO qualifier) / valid ECE 0.0237 / MCE 0.2352 / delay med 2 / FA 0.58/100 / rho 0.676 / masked 0.9441 / mislead 0.9013 / oracleAct 0.9537 vs cueAct 0.7165 (gap +0.237 — headroom exists). Filed seeds-0..19 values stand.
- Smoke s0 (13/13 gates PASS: T1-T4, E1-E4, T5/T6a/T6b/E4h; loss finite): train ctx 0.91/probe 0.91/gap 0.17/ece 0.1996; held-out s20 ctx 0.7667/probe 0.7667/gap -0.0333/ece 0.0997. Hashes 64-hex present.

## Wave (20/20 + 20/20, 0 invalid)

- Replication sanity: train-eval rows vs filed F12 rows — **0 mismatches** (all shared numerics + calBins + calTrace bit-identical). Hash format valid 40/40; s0 smoke-vs-wave hashes equal. Harness exact.
- Held-out pooled: probe **0.6227** (8/20) / gap **+0.0224** (12/20) / ctx **0.7777** (4/20: seeds 7,10,11,12) / ECE 0.1871 / MCE 0.2891. Bars: probe FAIL, gap pass, ctx FAIL.
- Paired train-minus-heldout (descriptive): dProbe -0.0957 CI [-0.164,-0.028], dGap -0.1136 CI [-0.153,-0.074], dCtx -0.1007 CI [-0.148,-0.054] — all CIs exclude 0: systematic degradation, not noise.
- Bias-shift read: V1 cue floor held-out **0.7503** vs train 0.7315 — cues equally informative; the model (0.7777) barely beats cue-following on new trajectories (+0.027), while the oracle beats cues by +0.237 on the same trajectories.
- Subclass: probe fails with klMedFail **0.0317** ≤ 0.06 (klMedHeld 0.0337, klMedTrain 0.0328 — KL near floor everywhere) → **collapse** per locked rule. Reading: the latent carries train-trajectory-specific codes that do not transfer; on new trajectories the system falls back to ≈ cue-following.

## Verdict: F13-DEGRADES (collapse)

Filed wins do not generalize. Training-trajectory performance (F4/F11/F12) is trajectory-memorization with a graded carrier, not reusable context inference. No qualifier, no retroactive moves, no PROCEED claim. Ledgers: `d-u70-oracle-f13.json`, `d-u70-neural-f13-smoke.json`, `d-u70-neural-f13-wave1.json`; gates `d-u70-f13-gates.json`; analysis `f13-analysis.json`.

## Corrections carried (append-only)

- `f11-shuffle-path-correction-2026-11-27.md` (filed pre-compute this session): F11 "pure-shuffle read" never reached the V4 metric path — filed gaps F4–F13 are partial-shuffle gaps (C2 meaning). F13's held-out gap (+0.0224) is the same partial metric on fresh trajectories; verdict unaffected (absolute bars on a fixed path).

## Follow-ups (each needs own prereg + battery + countersign)

- TRUE pure-shuffle wave F14 (wire `u70nApplyShuffle` into `u70nEval` V4 path — the intervention F11 claimed; C2 finally tested). z-recurrence wiring, unfamiliar-context probe, causal ablations, calibration bar (held-out ECE 0.1871 now fileable as input), sharpened F3, GRU-128, trace study, Phase-2. NO PUSH without order.
