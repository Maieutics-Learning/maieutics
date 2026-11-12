# W47exec — hot-swappable hint indices without retraining (Group B; backlog-W44)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries, floor — design wave)
- Record: `{id, levels[K], source: api|local|distilled, posterior: {alpha[K], beta[K]}, skill_sig, version}`. Index key = skill/mistake signature (W22) so the reader retrieves by failing shape, not item id.
- Swap = re-point the reader's hint pointer (config/URL/pointer-swap); weights untouched, zero retraining. Version every swap; rollback = re-point to previous version. Quarantine: posterior mass below bar → hints excluded from sampling (Thompson, W46exec, does this automatically).
- Unifies three threads: API cache (W44exec rented→owned), Thompson posteriors (W46exec selection), skill-bank keys (W22 retrieval). Hints are data; promotion is selection; nothing to retrain.
- Verdict USED (design). No precursor, no conflict. Versioning/rollback detail spawned W61.

## Tangential (reasoning, 0 spend)
- This is RAG's hot-swap (W30) applied to pedagogy: swap the index (docs→hints), keep the parametric reader. ParaRAG's offline-LoRA lesson ports too: precompute per-skill hint packs (adapters' third vote, W17/W28/W30).

## Spend / queue
- Spend: 0 + 0 (floor). Consumed backlog-W44 removed; spawned W61 to BACK. Backlog 17. Synthesis R5 clock: 2/5.
