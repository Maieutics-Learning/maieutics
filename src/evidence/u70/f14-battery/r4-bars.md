# F14 battery r4 (bars: is gap>=0.05 fair on the TRUE metric, or does pure shuffle demand a re-derived bar)

1. **Verdict: NEEDS-PATCH**

2. **Falsifier:** The "TRUE" metric (pure shuffle) removes the posterior $q$—the very signal the model previously used to "cheat" the partial-shuffle gap. By shifting from a partial to a pure intervention, the baseline difficulty increases. Using the F11 bar ($\ge 0.05$) on the TRUE metric is an apples-to-oranges comparison; the model is now fighting a harder intervention. If the TRUE gap falls to $0.03$ while the partial was $0.06$, the model is not "failing" to learn—it is simply facing a more rigorous metric.

3. **Requirement:** A re-derived bar is mandatory. You cannot use a "partial-leak" benchmark to judge a "zero-leak" intervention. Without a baseline established specifically on the `u70nApplyShuffle` logic, the $\ge 0.05$ bar is an arbitrary number that ignores the mathematical shift in the intervention's severity.
