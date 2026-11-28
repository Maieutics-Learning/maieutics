# F16 v1.0 barrage r5 — ablation (NEEDS-PATCH)

1. **Verdict: NEEDS-PATCH.**

2. **Critique:** The "read-only" claim for ablations (z-zero/h-cut) is logically sound via weight-hash verification (T10e), but the "causal meaning" objective is under-specified. You are treating these as descriptive readouts, yet the premise asks if they "separate h-locus vs z-locus." Without a pre-registered quantitative delta (e.g., Delta_clean-zzero > tau), the "discovery" of a locus is merely qualitative storytelling, not a technical proof.

3. **Hardest Falsifier:** **The Cross-Arm Leak.** Since A1 (z-recurrence) and A2 (GRU-128) are tested against A0 (F14-base), any "synergy" found in arm B (Combined) is confounded if the "unfamiliar-context" eval (which is only run on A0 and B) reveals that the model's ability to generalize to unfamiliar timing is tied to capacity (H128) rather than wiring (z-recurrence). If B generalizes but A2 (capacity only) also generalizes, the "z-recurrence" claim is falsified.
