# F16 v1.0 barrage r9 — confound (NEEDS-PATCH)

1. **Verdict: NEEDS-PATCH.**
2. **Critical Failure:** The premise for A2 (GRU-128) and B-COMB (Folded) relies on "regrowth from the same bases... NOT same births." This is a fundamental capacity confound. By using different weight initializations for the widened columns (even with the same RNG stream), you introduce a variance shift that is indistinguishable from a capacity gain. You cannot claim to isolate "wiring" vs "capacity" if the weight distribution of the 128-unit layer is not a strict superset of the 64-unit layer's initialization.
3. **Hardest Falsifier:** **Symmetry-Break Test.** Initialize a GRU-64 and GRU-128 using the exact same seed; the first 64 units of the GRU-128 must be bit-identical to the GRU-64. If the "regrowth" process disrupts this identity, the A2/B-COMB results are noise, not capacity/wiring signals.
