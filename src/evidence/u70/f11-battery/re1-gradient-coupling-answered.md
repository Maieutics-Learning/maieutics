=== RE1 [does v1.1 answer the gradient-coupling object] ===
1. **Verdict: STANDS.**
The manual-coupling fact (backward uses analytic $q$, not forward op) successfully decouples the forward-pass repair from the gradient path, neutralizing the "incomplete patch" objection. T2 as a pre-smoke HALT gate prevents contaminated runs from entering the ledger.

2. **Hardest Falsifier: The "Phantom Convergence" Test.**
If the "REPAIRED" verdict is reached via absolute bars but the paired-retrain "leak-size" is negligible or negative, it proves the original "wins" were not leak-driven but rather stochastic noise or overfit to the specific $q$-implementation. The ultimate failure mode is a result where the repair is logically correct but numerically irrelevant to the performance delta.
