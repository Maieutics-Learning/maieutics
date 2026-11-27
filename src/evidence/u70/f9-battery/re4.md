# F9 re-close re4 on v1.1 (verbatim)

1. **The Ignition Gate is a Verdict Smugglers' Crate.** By requiring `gap ≥0.05` for a "valid" read, you have created a hidden selection bias. If the "louder" arm causes instability that collapses the gap, the arm is voided rather than marked as a failure. You aren't testing if volume causes catastrophes; you are testing if volume causes catastrophes *without also breaking the model's basic ability to learn*.

2. **Matrix Logic Circularity.** The "Both void → NO-TEST" clause masks total failure as a null result. If both arms void, the experiment didn't "fail to conclude"—it proved the system is hyper-sensitive to scale, yet the matrix treats this as a non-event.

3. **Missing Lock: Seed-Pairing.** You specify "same 20 seeds," but fail to lock the *stochastic stream index*. Without an explicit seed-offset lock, "same seed" across different scales can drift, invalidating the paired-diff logic.
