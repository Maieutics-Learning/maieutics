# Synthesis R9 (waves 64–68; 0-fetch, queue-jump per rule 5)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Verdicts since R8 (5 waves, 5 verdicts)
- W64 injection ablation: USED proxy (direction for prelude; harness-gated W75).
- W65 cache format: USED design (unifies API-cache + Thompson + hot-swap).
- W66 skill-bank priors: USED design+toy (bank = prior, Thompson = updater, cache = store).
- W67 hint versioning: USED design+toy (append-only + tripwire + tombstone + fallback).
- W68 probe budget: USED design + 2 honest-negative toys (threshold rules killed; budget-share adopted).
- No conflicts, no precursors, no SKIPs, no UNRESOLVED. SKIP table unchanged. No 3-of-a-kind → no Anti-Pattern note.

## New cross-wave convergences (4)
1. One-controller doctrine: Thompson-Beta now drives teaching levels (W46), probe selection (W48), eviction (W76 queued), priors (W66), and the probe/teach boundary itself (W68 shares one posterior). Single updater, five jobs.
2. Generational-memory triad: version chain (W67) + cache store (W65) + priors (W66) = memory across generations at hint, record, and belief granularity. Promotion picks who teaches; memory remembers what was learned about teaching.
3. Budgets-terminate doctrine (W68 + W29): "until calibrated" and "more loops" both sound principled and both lose to a fixed budget with a shared posterior. Thresholds describe; budgets decide.
4. Disconfirmation pays: W64 (magnitudes toy-only) and W68 (two killed rules) — the toys that said no shaped more design than the toys that said yes.

## State
- Specs now bench-grade: cache schema (W65), versioning (W67), probe schedule (W68), priors (W66) — all implementable, all gated on bench except toys.
- Watchlist: agreeableness-check 6/6 rounds all-USED-clean (flag if a round ever comes back without a negative or a spawn).
- Conflicts ledger: both historical conflicts resolved, none open. Backlog unchanged (17, head W63 MoR primary). R9 clock RESET 0/5.
