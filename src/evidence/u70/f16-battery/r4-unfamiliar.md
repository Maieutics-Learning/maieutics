# F16 v1.0 barrage r4 — unfamiliar (NEEDS-PATCH)

1. **Verdict: NEEDS-PATCH.**
2. **Hardest Falsifier:** The "Unfamiliar" distribution oracle.
3. **Technical Critique:**
    - **Distribution Leak:** You define the unfamiliar distribution as U(s)=2000+s, which is spatially disjoint from training (0..39 and 1000..1159). However, you fail to specify if the *timing-unfamiliar* nature is purely a shift in s (scalar offset) or a change in the stochastic process of s itself. If it is a simple linear shift, the model may simply extrapolate the s trend, rendering the "unfamiliar" label a trivial shift rather than a distribution test.
    - **Oracle Validity:** You provide a 20-row oracle for seeds 2000..2019. This is a statistically insignificant sample size to establish a "ceiling" for a distribution intended to test generalization.
    - **Symmetry:** The "B-COMB" arm introduces two variables (ZREC + H128). Without a 2x2 factorial design (including a "neither" and "each" arm), the "interaction readout" is purely anecdotal, not statistical.

**Patch required:** Define the exact mathematical transformation of s for the unfamiliar set to prove it isn't a trivial linear extrapolation.
