# F16 v1.0 barrage r7 — steps (NEEDS-PATCH)

1. **Verdict:** NEEDS-PATCH.

2. **Critique:** The isolation mechanism is logically sound but computationally fragile. While T10b/c attempt to enforce determinism and step-counts, the "folded" arm (B) introduces a capacity/wiring confound that is only descriptively handled. You are claiming "one-change attribution" while simultaneously running a combined arm that lacks a proper ablation baseline *during training* (only during eval). If B outperforms A1/A2, you cannot distinguish between additive linear gains and non-linear synergy without a training-time ablation of the interaction term.

3. **Hardest Falsifier:** **The Seed-Cross Hash.**
Since A2 (GRU-128) requires "fresh draws" from the same initBase, you must provide a bit-identical mapping of where A0's weights reside within A2's expanded matrix. If you cannot prove the A0-submatrix in A2 is bit-identical to the standalone A0 weights across all 20 seeds, your "single change" is actually a "global weight redistribution," invalidating the attribution.
