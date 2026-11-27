# F14 battery r9 (halts: what stops a bad run)

1. **Verdict:** NEEDS-PATCH.

2. **Hardest Falsifier:** The "Replication Sanity" check. You claim `train-clean` eval vs filed F12 must be bit-identical (delta = 0). However, F14 changes the `u70nEval` logic (replacing inline shuffle with a helper call). If the `train-clean` path (where `zShuffle` is false) is truly decoupled from the shuffle branch, it passes. But if any shared state or global flag in `u70nEval` is touched by the new T7/T8 logic or the refactored helper, bit-identity fails. More critically, if the "partial" vs "TRUE" distinction relies on a subtle floating-point difference in how `zoh` is assembled, the "0 mismatch" claim is a fragile proxy for training identity.

3. **Halt Logic:** The T7/T8 gates are a necessary but insufficient stop. A "bad run" (e.g., subtle weight drift during the 20 retrains) would pass T7/T8 but fail replication sanity, triggering a BROKEN state. The system lacks a "mid-wave" halt; it's all-or-nothing, risking 80 evals on corrupted weights.
