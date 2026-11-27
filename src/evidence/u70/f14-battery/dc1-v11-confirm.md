# F14 confirm dc1

1. **STANDS.** The demand for $z \perp q$ at every trajectory step is a **category error** given the stated architecture. 

2. **RATIONALE.** The proposal explicitly defines a "read-point boundary" intervention. By design, the recurrence carries $q$ forward to maintain state consistency; the intervention occurs strictly at the output read. Demanding $z \perp q$ *during* the trajectory would necessitate a "trajectory-rewrite" (which was explicitly rejected in the proposal). 

3. **CONSISTENCY.** The validity of the intervention is verified by the T7/T8b gates, which assert that the **metric-path head inputs** (the read point) are clean-z and independent of $q$. Since the "leak" is tested and negated at the point of measurement, the internal carrying of $q$ is irrelevant to the claim.
