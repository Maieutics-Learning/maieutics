# W97exec — Batch collation spec (A; backlog-W86)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + sandbox toy, floor)
- Spec (ports EGG dump_interactions, W56): collate pads variable-length messages with EOS + binary mask; decollate mask-filters; eval-dump rows are JSONL {interaction, message, mask, outcome}. Toy (50 msgs, lengths 2..5): round-trip bit-exact, dump reparse exact.
- Teeth: the spec MANDATES masked loss (pads excluded from CE) — this fixes half of W92's dead-pad-weights quirk at the spec level (mask the loss; the backward scatter fix rides separately). Unmasked loss on padded batches trains on garbage; the spec forbids it.
- Verdict USED (spec + exact toy). Masked-loss bench patch spawned W103. No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- Collation is where variable-length theory meets fixed-width hardware: the mask is the receipt proving every padded position was accounted for. No mask, no claim — same evidentiary standard as permutation p (W73) and tie fractions (W94).

## Spend / queue
- Spend: 0 + 0 + toy (floor). Consumed backlog-W86 removed; spawned W103 to BACK. Backlog 17. Synthesis R13 clock: 4/5.
