# W115exec — bench coverage meter (A; backlog-W101, audit: src/tinynn)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + code audit, floor)
- Audit (trainModel, train.js:104-145): every forward call feeds data inputs — `model.forward(ex.x, r)` on sampled examples, `attnSupervision` on data states, prefix labels on data positions. No training step anywhere consumes a learner-generated state. The fade loop's self-induced share is 0.00 BY CONSTRUCTION, at every stage, in every preset (FAST_FADE, HINTED, D-rate, D-slow).
- This is the exposure-bias wound (W16/SDFT) measured at its source: W95's gate (coverage ≥ 0.4) can never fire because there is nothing to measure. The meter's first reading is zero — and a meter that reads zero is working (it found the missing pipe, not a missing signal).
- Spec: coverage meter = per-stage self-induced share with target ≥ 0.4; feed = DAgger-style rollout mixing in the train loop (aggregate learner trajectories, W54). Mixing implementation spawned W118.
- Verdict USED (audit + spec + zero-reading). No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- Zero is a measurement: the most informative meter readings are the ones that reveal absence. Coverage-0 explains s608-class severance collapses better than any skill curve — the student never stood where it falls.

## Spend / queue
- Spend: 0 + 0 + audit (floor). Consumed backlog-W101 removed; spawned W118 to BACK. Backlog 17. Synthesis R16 clock: 4/5.
