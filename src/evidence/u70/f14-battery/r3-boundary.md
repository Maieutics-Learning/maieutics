# F14 battery r3 (boundary: is clean-history read-point the right claim, or is trajectory-rewrite owed)

1. **Verdict:** NEEDS-PATCH.

2. **Hardest Falsifier:** The "Clean-History" claim is a logical ghost. Because the intervention occurs at the *read-point* (`u70nEval`) and not during the *trajectory-generation* (`u70nStep`), the model is being tested on its ability to ignore a corrupted latent state while relying on a history that was generated *without* that corruption. 

If the model utilizes any form of implicit state-tracking or "shadow" memory of the latent trajectory, the "clean-history" is not a control; it is a leak. To falsify the "read-point" claim, you must run a **Trajectory-Rewrite** arm: force the shuffle at every step of the trajectory generation. If the "read-point" intervention (F14) shows a gap but the "trajectory-rewrite" (Symmetry) collapses the gap to zero, the model wasn't "inferring the hidden state"—it was merely detecting the presence/absence of a specific mutation at the final read. Without the rewrite arm, you cannot distinguish between "latent inference" and "mutation detection."
