# U64e barrage v1.0 reply R6 (verbatim, 2026-11-27)

1. **Verdict:** NEEDS-PATCH.
2. **Critique:** The "firewall" is porous. Allowing the verdict to read `triggers` and `stackHash` introduces a leakage vector where the driver can implicitly signal boundary crossings via trigger frequency or hash-state transitions, bypassing the `accRec` constraint. Furthermore, the `surBlind` trigger relies on a "trailing-8 mean" versus "first-8 burn-in"; in a rule-switch diet of only 3 changes per run, the sample size is insufficient to establish a stable baseline, risking high false-alarm rates that pollute the `detectRate` metric.
3. **Hardest Falsifier:** Run 100 seeds with a "jitter-boundary" (stochastic switch point). If `surBlind` triggers on noise spikes rather than true boundaries, and the firewall fails to isolate the `detectRate` from the `accRec` verdict, the "CLOSED-LOOP-WORKS" claim is a false positive driven by lucky seed-clustering.
