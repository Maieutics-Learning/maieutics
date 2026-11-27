# F10 re-close re1 on v1.1 (verbatim)

1. **Logical Contradiction:** The "Change" section specifies $M=3$ to prevent ties, but the "Design" and "Driver change" sections explicitly reference $M=5$. This creates a fatal ambiguity in the replication gate and vote-math execution.
2. **Verdict Smuggling:** The "Descriptive ONLY" clause allows "grave-specific un-graving" to be reported. Since the primary verdict depends on `voteGap` (which is derived from the same data), reporting a "decorrelated rescue" via descriptive tables effectively signals a successful "FIXED" result for specific subsets, bypassing the "no-upgrade" constraint via the back door of the descriptive readout.
