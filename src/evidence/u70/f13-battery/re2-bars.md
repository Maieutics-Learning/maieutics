# RE2 — bars + qualifier re-close (F13 v1.1, 2026-11-27)

VERDICT: STANDS

1. **Angle Answered:** Yes. The "ceiling-shift qualifier rule" (Outcomes §) explicitly decouples bar-fairness from bar-adjustment. By reporting the oracle train-vs-heldout delta and appending a `distribution-shift` qualifier if $|shift|>0.05$, the proposal accounts for task-difficulty variance without moving the absolute bars. The bars remain locked (Primary §), ensuring the verdict is based on performance, while the qualifier provides the necessary context for the "fairness" of those bars relative to the oracle ceiling.

2. **Residual/Smuggled Weight:** None detected. The "Descriptive" section explicitly strips weight from the oracle shift, per-seed deltas, and ECE. The "Firewall" prevents v1.1 from retroactively altering filed verdicts. The provenance hashes are purely for auditability and do not influence the grade. All "Generalizes" criteria are absolute pooled bars, mirroring F11.
