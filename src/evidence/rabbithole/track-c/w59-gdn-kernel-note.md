# W59exec — GDN kernel file, WY fast path (Group A; backlog-W54)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 2 primaries, at cap)
- Ops dir listing (4 entries: `__init__`, 28KB `chunk.py`, 25KB `wy_fast.py`, `fla_version/`) + `wy_fast.py` structure read (655 lines: def catalog + head; full-line read deferred to W71 with chunk.py).
- Contents: Triton kernels `fwd_prepare_wy_repr_{w,u}` + full `fwd_prepare_wy_repr`, `fwd_recompute_w_u`, backward `bwd_prepare_wy_repr_{dk_dbeta_dg, dA, dA_recurrence}`, python drivers + `WYRepresentationPrepration` autograd Function + `naive()` reference. Autotune warps 1–32 keyed on (BT,BK,BV). WY = compact representation for products of Householder matrices (Bischof & Van Loan 1987, cited in-file).
- Verdict USED: the numerical engine behind GH-DeltaNet (W24/W40) AND the neg-eigval paper's GH-expressivity appendix (W50 app.C: LRNNs learn any regular language via products of ide... — GH products). One representation, three threads. No precursor, no conflict. Remainder (chunk.py + fla_version + naive) spawned W71.

## Tangential (reasoning, 0 spend)
- Neg-eigval says GH products give expressivity; WY says GH products compute fast; GDN ships both. F-deltanet's missing piece was never the math — it was the workload (our lookup probe) + the gate (attention supervision). Kernel confirms: track the field, don't re-derive it.

## Spend / queue
- Spend: 0 + 2 (at cap). Consumed backlog-W54 removed; spawned W71 to BACK. Backlog 17. Synthesis R7 clock: 2/5.
