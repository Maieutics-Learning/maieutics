# W70exec — MoR primary 2507.10524 (Group C; backlog-W63)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 2 primaries, at cap)
- Abs confirmed: Mixture-of-Recursions, Learning Dynamic Recursive Depths for Adaptive Token-Level Computation. PDF 1.69MB → 112KB text (37 blocks, own extractor).
- Router: lightweight, trained from scratch, per-token recursion depth over a SHARED weight-tied block (compute beyond physical depth, params constant). Expert-choice + auxiliary loss wins: selected/unselected outputs separate perfectly (peaks at 1.0/0.0); auxiliary loss beats auxiliary router; linear router + softmax best; z-loss load-bearing; dead-token ratio / MaxVio / sampling-accuracy as router metrics; loss-free balancing via router bias works.
- Caching: recursion-wise KV caching (two strategies); prefill runs FIRST recursion only (Cycle strategy; 1M+ token prompts); depth-wise batching boosts throughput. Scale 135M–1.7B, new Pareto frontier vs vanilla + recursive baselines.
- Lineage locked: early-exit halting → token-choice/expert-choice routing → MoR over tied blocks; Middle-Cycle (W49 guide) now primary-backed; prelude/core/coda = fourth convergence point.
- Verdict USED strong. Same family as our routers (learned depth), different job (allocate compute, not teach) — no precursor, no conflict. Spawned W80 (expert-choice static-budget ↔ fade-budget; loss-free bias balancing for hint allocation).

## Tangential (reasoning, 0 spend)
- Router outputs are CRISP (bimodal 1.0/0.0), not graded — validates hard decisions over soft ones: our tripwire quarantine (W67) and probe/teach boundary (W68) are on the right side; Thompson posteriors can stay soft inside, hard at the gate.

## Spend / queue
- Spend: 0 + 2 (at cap). Consumed backlog-W63 removed; spawned W80 to BACK. Backlog 17. Synthesis R9 clock: 1/5.
