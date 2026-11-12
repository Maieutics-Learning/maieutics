# W40exec — NVlabs GatedDeltaNet official impl (Group A; backlog-W38)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 2 primaries, at cap)
- Repo `NVlabs/GatedDeltaNet` root via API (7 entries: Dockerfile/LICENSE/README/cache.py/lit_gpt/pretrain.py/scripts) + README raw 10.6KB read (zones). Dumps in `scratch/track-c/w38-gdn-*`. URLs durable.
- Official PyTorch impl of 2412.06464 (ICLR'25). Exact block spec (FAQ#1, chunk mode): q/k/v/b/a/g projections, ShortConvolution k=4 on q/k/v, FusedRMSNormSwishGate + o_proj. FLA fork documented (FAQ#2, file itself spawned).
- Production adoption (Latest Updates): Qwen3-Next (09/2025), Qwen3.5 (02/2026), Olmo Hybrid (03/2026) — strongest external endorsement of the delta-rule memory line yet; F-deltanet relevance upgraded from experiment to track-the-field.
- Verdict USED: official-impl located + block spec + adoption. No precursor (memory layer, not teaching), no conflict. Kernel source read spawned (W54); W24 FLA-layer read stands.

## Tangential (reasoning, 0 spend)
- Block spec confirms W24's craft read (short-conv crucial, learned beta/gating, norms): the official repo bakes all three in. Locks F-deltanet's spec, no new toy (magnitudes live in repo benchmarks).

## Spend / queue
- Spend: 0 + 2 (at cap). Consumed backlog-W38 removed; spawned W54 to BACK. Backlog 16. Synthesis R4 clock: 1/5.
