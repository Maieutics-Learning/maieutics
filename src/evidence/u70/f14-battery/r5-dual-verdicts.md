# F14 battery r5 (dual verdicts: can TRAIN/HELDOUT split hide or smuggle a win)

1. **Verdict: NEEDS-PATCH.**
The "replication sanity" (expect-0) is a red herring. While it proves training identity, it does not prevent the dual-verdict split from smuggling a win. Specifically, the "leak-size read" is labeled descriptive, but the "Primary" verdicts rely on absolute bars ($\ge 0.05$ gap) that were calibrated against *partial* shuffle data (F11/F13). If the TRUE intervention is significantly harder, a "pass" on the partial metric but a "fail" on the TRUE metric—or vice versa—creates a valuation gap that the current prereg doesn't resolve.

2. **Hardest Falsifier:**
A "Symmetry Collapse" test: Run the same model on a trajectory where the shuffle is inverted. If the TRUE-shuffled gap is $\ge 0.05$ but the inverted-shuffle gap is $\approx 0$, the "win" is a result of specific latent-coding artifacts rather than a generalizable context-inference mechanism.
