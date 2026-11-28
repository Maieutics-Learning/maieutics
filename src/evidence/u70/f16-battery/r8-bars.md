# F16 v1.0 barrage r8 — bars (STANDS)

1. **Verdict:** STANDS.

2. **Analysis:**
The design successfully isolates causal variables (A1, A2) while accounting for non-linear interaction via the B-COMB folded arm. The "Firewall" is robust: it prohibits cross-arm deltas or descriptive results (unfamiliar/ablation/calibration) from leaking into the binary verdict gates.

Physical and spatial validity is maintained via the T10-f (retention) and T10e (weight-hash) checks, ensuring that "read-only" ablations do not mutate the model state. The use of a disjoint unfamiliar oracle (seeds 2000..2019) prevents data leakage between the held-out and unfamiliar distributions. The step-count (T10b) and config-spec (T10a) constraints enforce a strict replication of the F14 baseline, preventing "stealth" hyperparameter tuning.

3. **Hardest Falsifier:**
A "Pass" on T10e (weight hash identity) that nonetheless shows a delta in z-zero ablation performance. This would prove a leak in the "read-only" implementation (e.g., a hidden state update during evaluation), invalidating the claim that evaluations are non-destructive.
