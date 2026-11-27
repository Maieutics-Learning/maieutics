# U64e barrage v1.0 reply R4 (verbatim, 2026-11-27)

1. **Verdict**: NEEDS-PATCH.
2. **Technical Critique**: The disjointness argument is fragile. While base 53500/53600 separates the streams, the `surBlind` (108) logic introduces a temporal dependency via the "trailing-8 mean candidate-surprise" trigger. If the "blind window" (K=10) overlaps with the true boundary reset of the oracle arm (107/109) due to the refractory-20 gap or the "blind-drag" (F2), the distinction between "closed-loop detection" and "boundary luck" collapses.
3. **Hardest Falsifier**: The "False Alarm vs. Hit" ratio during a stability-phase (zero rule-switches) with high-variance noise. If `surBlind` triggers on stochastic noise spikes rather than structural rule-changes, the accRec gain is a fluke of the K=10 window size, not a valid closed-loop trigger.
4. **Implementation Risk**: The "no fallback-to-max" constraint in 108 creates a hard floor; if the surprise-spike is a local minimum, the system may blind itself exactly during the critical transition.
