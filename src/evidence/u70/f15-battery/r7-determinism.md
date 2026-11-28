# F15 barrage r7 — determinism (verbatim, 2026-11-28)

Angle: determinism/replication: what replaces F14 bit-identical sanity now that training moved

1. **Technical Analysis**: F14's bit-identical sanity relied on a static `(path, obs)` pair per seed. Moving to a round-robin schedule of 8 trajectories introduces state-dependency on the sequence of batches. To maintain F12-level rigor, the "sanity" must shift from *input-identity* to *trajectory-permutation invariance*. If the model is truly learning the context-inference root cause and not the specific sequence of the round-robin, shuffling the 8 trajectories within $\text{P(s)}$ must yield bit-identical convergence (given fixed seed/Float64). If results diverge, the "distribution effect" is actually a "sequence-order effect."

2. **Verdict**: **NEEDS-PATCH**.

3. **Hardest Falsifier**: The **Permutation Test**. Run two identical retrains per seed: one with the standard round-robin and one with a randomly shuffled sequence of the same 8 trajectories. If the $\text{HELDOUT-DEGRADES}$ gap closes in one but not the other, the effect is a curriculum artifact, not a distribution property.
