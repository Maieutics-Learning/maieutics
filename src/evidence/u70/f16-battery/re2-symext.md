# F16 v1.1 re-close re2 (NEEDS-PATCH — symmetric extension demand)

1. **Verdict: NEEDS-PATCH.**
2. **Blocking flaw:** The "Procedure-Identity" gloss (G3) admits a critical failure in the A2 (GRU-128) and B (Combined) arms. By stating they are "NOT bit-identical" to the baseline (H64) because they are "fresh draws" from the same RNG base, you have introduced a confounding variable: **Initialization Variance**.
3. **Technical failure:** To isolate the effect of capacity (H128) vs. wiring (ZREC), the weights must be derived from a deterministic mapping (e.g., padding the H64 tensor with zeros or specific constants) rather than fresh stochastic draws. As currently designed, any delta in A2 or B cannot be uniquely attributed to architecture; it is entangled with the specific random seed's interaction with the larger weight matrix.
4. **Cheapest forced patch:** Implement **Symmetric Extension** for H128. Define W_128 as [W_64 | constant/zero] or a deterministic expansion of the F14 seed. This ensures the 64-unit subspace is identical across arms, isolating the "extra" capacity as the sole variable.
