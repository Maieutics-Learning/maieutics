# F16 v1.0 barrage r6 — calibtrace (STANDS)

1. **Verdict: STANDS.**
The composition successfully isolates attribution (A1, A2) and interaction (B) without scope creep. The use of a "folded" arm for emergence, paired with frozen-weight evaluations for ablations/unfamiliar distributions, prevents the training of the "extra" variables from contaminating the core verdict.

2. **Hardest Falsifier: T10b/T10c (Step-Count & Determinism).**
The entire validity of the "separate attribution" claim rests on the assumption that A0, A1, A2, B are identical in every dimension except the flagged flags. If the optimizer step count deviates by +-1 or the weight-hash of A0 diverges from the F14 baseline, the "single-variable" claim is falsified. Any drift in A0 renders the comparative deltas between A1, A2, B mathematically meaningless.
