# U64e barrage v1.0 reply R3 (verbatim, 2026-11-27)

1. **Verdict**: NEEDS-PATCH.
2. **Critique**: The `surBlind` trigger is a numerology trap. `trailing-8` vs `first-8 burn-in` assumes stationary noise floors across rule-switches; if the baseline surprise shifts during the run, the 2x threshold is a post-data tunable, not an a-priori derivation. The `hit-window [b-5, b+15]` is asymmetric and arbitrary; justify why the lag is 10x the lead.
3. **Hardest Falsifier**: The "Closed-Loop" arm must outperform the "Oracle" arm on `accRec` specifically in the 15/20 quorum. If P(surBlind hit) approx P(random spike) over 60 reads, the 2x spike criterion is noise-fitting.
4. **Technical Risk**: K=10 blind steps during a trigger event creates a dead-zone that may mask the actual boundary, rendering the `hit-window` analysis void.
