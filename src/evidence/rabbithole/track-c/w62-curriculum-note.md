# W62exec — LoopThink utils + extrapolation-train (Group A; backlog-W57)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 1 primary + mined zones, under budget)
- `train_extrapolation.py` (21KB) zones: threshold curriculum — train per-hop stages, advance when accuracy ≥ 0.95 (`acc_threshold_curriculum`), per-stage LR decay (`stage_lr_base` 1e-4 × `stage_lr_gamma` 0.9^stage, min 2e-5, `use_lr_decay`), resume-from-checkpoint skipping completed stages (`hops_generalized`), dynamic-recurrence option (Poisson `dynamic_mean`, clamped min/max) vs fixed `recurrence`.
- Init (mined from W43 dump, `RecurrentGPT2Block.__init__`): `c_scale=0.003` residual downscale (c_proj weights × 0.003, c_proj biases zeroed), tied lm_head. Correction: not "zero-init" — small-init + zero-bias (the W4 "load-bearing" claim stands in substance: default full init fails; the file just names the scale).
- Verdict USED: stage-gate + LR-decay + resume-skip = the executable curriculum behind "threshold curriculum" (W4/W25); dynamic-Poisson = Huginn's training distribution (W32) as a flag. Exact advance-loop body spawned (W74). No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- Per-stage LR ×0.9 is the exponential shape a third time (W15 supervision decay, W26 fade master, now LR). The lab's schedules keep rediscovering e^{−kt}: fade H, weights w, LR — unify them in F-singlegen as one decay clock.

## Spend / queue
- Spend: 0 + 1 (under budget). Consumed backlog-W57 removed; spawned W74 to BACK. Backlog 17. Synthesis R7 clock: 5/5 FULL → synthesis R8 jumps queue next per rule 5.
