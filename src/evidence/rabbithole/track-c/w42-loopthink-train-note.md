# W42exec — LoopThink train scripts (Group A; backlog-W40)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 2 primaries, at cap)
- Repo tree via API (15 entries) + `train_systematicity.py` raw 7.9KB read whole. Dumps in `scratch/track-c/w40-*`. URLs durable.
- Recipe: fixed-recurrence systematicity (default R4, d768/12h, 150001 epochs, batch 128, AdamW 1e-4/wd 0.1, warmup 2000, bf16, CE + label-smoothing 0.1 on last-token logits, per-type test eval every epoch to log file, checkpoints every 10 epochs after epoch 100 with full optimizer+scheduler state, seed 42).
- Verdict USED: last-token-loss + per-type-epoch-logging + late-checkpoint discipline port to F-shortcut audit (margin@stage per type, per epoch). No precursor, no conflict.
- Open half: threshold curriculum (dynamic R during training) + zero-init live in `gpt_utils_systematicity.py` (RecurrentGPT2Block init) + `train_extrapolation.py` — spawned W57. This file trains fixed-R only.

## Tangential (reasoning, 0 spend)
- Per-type eval every epoch to a log file is the W4/W25/W31 reporting norm compiled into code. F-new adopts the same shape (per-type topsim/swap-Δ traces, not just terminal accuracy).

## Spend / queue
- Spend: 0 + 2 (at cap). Consumed backlog-W40 removed; spawned W57 to BACK. Backlog 17. Synthesis R4 clock: 3/5.
