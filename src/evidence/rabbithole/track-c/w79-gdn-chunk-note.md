# W79exec — chunk.py + naive reference + version-diff resolution (A; backlog-W71)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (2 scouts + 2 primaries, at cap)
- Scout 1: NVlabs/GatedDeltaNet tree (API listing) — root holds Dockerfile/LICENSE/README/cache.py/lit_gpt/pretrain.py/scripts ONLY. No kernel files in the NVlabs fork.
- Scout 2: fla gated_delta_rule dir listing — chunk.py (20KB), chunk_fwd.py, fused_recurrent.py, gate.py, naive.py (5.3KB), wy_fast.py.
- Primary 1: naive.py whole — naive_recurrent (per-step: decay h by exp(g), erase via (h·k) residual × β, write k⊗ṽ, read q·h) + naive_chunk (pad → cumsum-decay L_mask → intra-chunk attn inverse via forward-substitution loop + eye → inter-chunk state S loop → unpad). THE reference for F-deltanet bench parity checks.
- Primary 2: chunk.py structure (fwd/bwd dispatchers + autograd Function + wrapper): bwd RECOMPUTES (w,u) via recompute_w_u_fwd (WY, from wy_fast) instead of storing — the memory/compute tradeoff at the kernel's heart; fwd_h/dv/dhu/o factor across fla.ops.common.
- Version-diff RESOLVED: there is no kernel-level NVlabs↔fla diff to reconcile — NVlabs is model-level code reusing fla kernels (single kernel source). W40's "fork" = usage fork. F-deltanet craft stack now closed: layer (W24) + block (W40) + WY (W59) + GH (W60) + chunk dispatch + naive ref (here).
- Verdict USED source-level. F-deltanet bench ticket (wire all pieces into lookup probe) spawned W88. No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- Recompute-vs-store (bwd) is the kernel's own budget rule (W68/W71): spend compute (recompute w,u) to save memory (don't store). The whole stack, from Triton kernels to fade schedules, runs one economy.

## Spend / queue
- Spend: 2 scouts + 2 primaries (at cap). Consumed backlog-W71 removed; spawned W88 to BACK. Backlog 17. Synthesis R10 clock: 4/5.
