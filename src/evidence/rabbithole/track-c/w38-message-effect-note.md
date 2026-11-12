# W38exec — message-effect operationalization (Group A; backlog-W37)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries, floor — design wave, precedent W20/W26)
- Operationalization: message-effect = causal influence of the message channel on the answer. Protocol: (1) full-swap: replace student's message with another item's message, measure Δ accuracy (clean − swapped); (2) per-position ablation: zero each hint position, rank causal positions (mechanism hinge); (3) shuffle-control: shuffle positions to separate content-cause from position-memorization.
- Corrected toy (worker, numpy only): 8 keys, ground-truth key→value map. Compositional (message=key): swap-drop 1.0 — message causes answer. Memorizer (message=fixed, answer from position): swap-drop 0.0 — message ignored. Fixes the W23 mis-specification (which intervened on the decoder, not the channel).
- Logging ports EGG `Interaction` (sender_input/message/receiver_output, W52 hook): log clean + swapped + ablated triples per item; report Δaccuracy + Δlogit-margin (W25 audit rule).
- Verdict USED (own-design): F-new upgraded (message-effect executable), F-shortcut upgraded (shallow-audit = low-effect positions). No precursor (new probe), no conflict.

## Tangential (reasoning, 0 spend)
- Swap-drop is the behavioral twin of W24's erase-then-write (delta 1.000/−0.228): both prove the channel carries the cause by removing it. Spawned W53 (per-position ablation → which hint slots carry lookup).

## Spend / queue
- Spend: 0 + 0 (floor, recorded). Consumed backlog-W37 removed; spawned W53 to BACK. Backlog 16. Synthesis R3 clock: 5/5 FULL → synthesis R4 jumps queue next per rule 5.
