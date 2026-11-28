# F16 v1.0 barrage r10 — ledger (STANDS)

1. **Verdict: STANDS.**
The composition successfully isolates attribution (A1, A2) while capturing non-linear interactions (B) without scope creep. The "eval-only" restriction on extras (A0, B) using weight-hash verification prevents training-phase contamination.

2. **Hardest Falsifier: T10b (Step-Count Determinism).**
Because the "folded" arm (B) involves two architectural changes (z-recurrence + H128), any implicit change in compute overhead or gradient stepping—even by a single batch—would break the "identical steps" requirement. If B shows improvement, but T10b reveals a discrepancy in chunk passes or optimizer steps compared to A1/A2, the "synergy" claim is falsified as a confounding variable of compute/duration.

3. **Technical Note:** The reuse of F13/F14 bars for the "unfamiliar" distribution is valid only because it's labeled descriptive; since the oracle is different (d-u70-oracle-f16-unfam.json), the resulting "GENERALIZES" tag is a relative metric, not an absolute one.
