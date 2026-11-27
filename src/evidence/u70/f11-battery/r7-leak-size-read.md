=== R7 [leak-size read: descriptive vs verdict w] ===
1. **Verdict: NEEDS-PATCH**.
The "firewall" is porous. The proposal claims to isolate "posterior leak-through" via paired retrains, but this is a descriptive analysis, not a binary verdict. By allowing a "QUALIFIED" or "REPAIRED" status based on a "leak-size read," the author is smuggling a qualitative interpretation into a quantitative validation. If the "repair" only marginally shifts the probe, the "leak" was either negligible or the repair was ineffective—the current framework allows the researcher to claim victory (REPAIRED) even if the delta is statistically insignificant.

2. **Hardest Falsifier**: 
Perform a **Permutation Null Test**. Swap the "repaired" and "leaky" weights across the 20 paired trajectories. If the "leak-size read" cannot distinguish the repaired model from the leaky one at $p < 0.01$ across the seed distribution, the repair is cosmically irrelevant and the "win" was an artifact of training noise.
