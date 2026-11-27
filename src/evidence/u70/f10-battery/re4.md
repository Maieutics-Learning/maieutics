# F10 re-close re4 on v1.1 (verbatim)

1. **Verdict-Smuggling:** The "rescue-shape" descriptive is not truly descriptive; it defines a mechanism (variance reduction vs. decorrelated rescue) that allows for post-hoc interpretation of a "PARTIAL" result as a "FIXED" result in future iterations, bypassing the no-upgrade clause.
2. **Logic Gap:** The "replication gate" (max-diff 0.0000) is physically implausible for GRU/Adam training across different members unless weights are frozen or seeds are identical, which contradicts the "independent F4 runs" requirement.
3. **Math Inconsistency:** Proposal cites $M=3$ in "Change" but references $M=5$ in "Design" (ties impossible at $M=5$).
