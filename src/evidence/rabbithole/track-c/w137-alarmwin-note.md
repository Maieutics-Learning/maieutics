# W137exec — difficulty-stratified alarm windows (C; backlog-W119)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 1 sandbox toy, floor)
- Toy (documented rebuild — W67 script lost): 3 difficulties as outcome-noise regimes (easy .9/.1, med .8/.25, hard .65/.4 good/bad Bernoulli), window-mean tripwire at 0.5, global window 8 vs stratified {4, 8, 16}, 2000 trials/cell. Metrics: false-quarantine (good) + escape (bad).
- Hard: global (0.103 / 0.415) vs stratified-16 (0.069 / 0.298) — longer window cuts BOTH errors. Easy: global (0.000 / 0.006) vs stratified-4 (0.006 / 0.057) — shorter window RAISES escapes 10× to save 4 max-wait serves. Med identical by construction.
- Correction to the proposal: stratify UP, never down. Expected-detection-gen sets the FLOOR for slow tasks (hard needs 16), not the ceiling for fast ones (easy keeps the global 8). Cutting easy windows to their expected detection gen buys 4 serves of exposure at 10× the escape rate — the trade prices itself out. Rule adopted: window(task) = max(global_floor, k × difficulty-noise), floor binds on easy.
- Verdict USED (table + corrected rule). No precursor, no conflict. Sequential-tripwire spec (continuous evaluation + per-difficulty max-wait; price exposure vs escape; difficulty-adjusted thresholds) spawned W136.

## Tangential (reasoning, 0 spend)
- Evidence windows are one-sided instruments: more evidence helps both error types, less helps neither and only saves waiting. Any proposal to shorten a window is a proposal to buy escapes with exposure — write the exchange rate down before signing.

## Spend / queue
- Spend: 0 + 0 + 1 toy (floor). Consumed backlog-W119 removed; spawned W136 to BACK. Backlog 17. Synthesis R20 clock: 2/5.
