# F14 confirm dc2

1. **CONSISTENT.** Per-seed early-HALT on the first train-clean replication mismatch is the only logically sound way to enforce $F13$ (0 mismatches). Without a failure limit, any single bit-flip in a deterministic engine is a catastrophic failure of the "exact" claim.

2. **RESIDUAL (Reviewer Error).** The "held-out-void" claim is a reviewer error. If the eval uses train weights, it is a validation check, not a void. The proposal correctly rejects this claim (r6) to maintain the integrity of the intervention.

3. **STANDS.** The proposal is technically sound. It moves the intervention from a helper function to the actual metric path, verified by T7/T8/T8b. This closes the gap between "tested helper" and "executed code."
