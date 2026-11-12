# W56exec — EGG interaction.py + game logging (Group A; backlog-W52)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 1 primary, under budget)
- `egg/core/interaction.py` raw 12.2KB, read whole (334 lines). `LoggingStrategy` (7 per-field toggles + `minimal()`/`maximal()` + `filtered_interaction`), `Interaction` dataclass (sender/receiver in, labels, aux, message, output, lengths; `+` concat with strict non-empty check, `from_iterable`, `empty`, distributed gather, `.to(device)`), `dump_interactions` (eval-mode full-log dump: gumbel argmax option, variable-length EOS-zero padding, concat across batches, restores train mode).
- Verdict USED: the logging substrate every F-metric consumes — dump once via `dump_interactions`, run topsim (W35)/gap-MI (W37)/swap-Δ (W38)/per-type (W42) post-hoc. No precursor, no conflict.
- Lengths + `Batch` convention detail spawned (W69): EOS-zero padding + `Batch(*batch).to(device)` for our probe's per-position ablation (W53).

## Tangential (reasoning, 0 spend)
- `minimal()` during training / `maximal()` at audit epochs = the W26 hint-budget applied to logging itself; mirrors W42 late-checkpoint discipline. Log cheap always, log everything rarely.

## Spend / queue
- Spend: 0 + 1 (under budget). Consumed backlog-W52 removed; spawned W69 to BACK. Backlog 17. Synthesis R6 clock: 5/5 FULL → synthesis R7 jumps queue next per rule 5.
