# F10 re-close re2 on v1.1 (verbatim)

1. **Verdict Smuggling:** The "descriptive only" rescue-shape table is functionally a gated metric. By correlating "un-graving" with "healthy vote-mean ≥ member-mean," you've created a hidden success criterion. If this "descriptive" check fails, the result is effectively downgraded regardless of the primary bars.

2. **Replication Gate Logic:** The $\text{max-diff } 0.0000$ requirement is physically implausible for floating-point GRU outputs across different members unless weights are identical (which contradicts "no weight sharing"). This renders the gate a deterministic HALT.

3. **Vote-Math Inconsistency:** $M=3$ is cited as "minimum odd" to avoid ties, yet the text still references $M=5$ in the "Ties impossible" clause.
