# W77exec — variable-length message convention + Batch (A; backlog-W69)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + sandbox toy, floor)
- Convention: messages are (content, length, mask); Batch pads to max with EOS (EGG's gumbel-argmax eval-dump pattern, W56); every logged message carries its mask; per-position ablation (W58) aligns by mask and only ablates positions present (n varies per slot — report n alongside drop).
- Toy (worker, seeded, 200 items, lengths 2..4, causal slots {0,2}): masked ablation recovers exactly {0,2} (drops 0.34/0.51, n=200/133) with non-causal {1,3} at 0.00 (n=200/61). Variable length costs nothing but bookkeeping.
- Verdict USED (convention + toy). Batch collation spec (EOS-pad + mask + eval-dump port) spawned W86. No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- Masks are posteriors' kid brother: both say "which positions count." The day the message mask and the Thompson posterior agree on what matters, the ablation and the teacher are reading the same sentence.

## Spend / queue
- Spend: 0 + 0 + toy (floor). Consumed backlog-W69 removed; spawned W86 to BACK. Backlog 17. Synthesis R10 clock: 2/5.
