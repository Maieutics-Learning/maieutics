# RE3 — halt + determinism re-close (F13 v1.1, 2026-11-27)

VERDICT: STANDS

1. **Angle Answered:** Yes.
   - **HALT table:** Exhaustive. The proposal defines a closed-loop set of triggers (T5/T5a/T6/E4, non-finite loss, oracle non-determinism, and replication sanity delta $\neq 0$) that map to either `HALT`, `INVALID`, or `BROKEN`. No hidden exit conditions.
   - **Determinism:** Scope is correctly constrained to "same-engine exact-0." By explicitly excluding cross-engine bit-identity and grounding the "replication sanity" check on the same engine (s0 retrain $\rightarrow$ same hashes), the proposal avoids the "floating-point drift" trap.

2. **Residual/Smuggled Weight:** None. The "ceiling-shift qualifier" is correctly implemented as a descriptive reporting rule rather than a bar-move or a verdict-shifter. The "gap-bar derivation" is a gloss on existing logic, not a new variable. Provenance via hashes is a verification layer, not a performance metric.
