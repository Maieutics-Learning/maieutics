# W49exec — MoR /raw fetch + verdict (Group C; backlog-W46, aiwiki-linked)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 1 primary, under budget)
- Fetched `aiwiki.ai/wiki/mixture_of_recursions/raw` (200, 13.5KB markdown, CC BY 4.0, read whole). Dump in `scratch/track-c/w46-mor-raw.md`. URL durable.
- MoR (Bae et al., arXiv 2507.10524, NeurIPS 2025): shared recursion block (Nr 2–4) + learned per-token router (linear proj, trained jointly from scratch) + recursion-aware KV cache (recursion-wise vs recursive-sharing). Routing: expert-choice (top-k per depth, fixed budget, causal-leak fix needed) vs token-choice (up-front argmax depth, no leak, needs balancing loss). Mapping strategies: Middle-Cycle best (unique first/last, tied middle). Results 135M–1.7B: Pareto frontier at equal FLOPs, ~half unique params (167M vs 315M), ~25% fewer train FLOPs, up to 2.06x inference throughput via depth-wise batching.
- Verdict USED (guide-level): router = learned per-token depth (our Thompson mastery gate as pretraining, W43/W46); caching = missing-KV solution (W29/W30); Middle-Cycle = third prelude/core/coda convergence (Huginn 2-4-2, our triplet, MoR middle-tied). Primary paper spawned (W63: router training + balancing + caching). No precursor for generational fading, no conflict.

## Tangential (reasoning, 0 spend)
- Lineage check: UT (Dehghani 2018) + ACT (Graves 2016) cited as roots — both are backlog-W47. MoD (Raposo 2024) + CALM (Schuster 2022) + Relaxed-LoRA (Bae 2024) complete the adaptive-compute family. Read W47 next, then primary.

## Spend / queue
- Spend: 0 + 1 (under budget). Consumed backlog-W46 removed; spawned W63 to BACK. Backlog 17. Synthesis R5 clock: 4/5.
