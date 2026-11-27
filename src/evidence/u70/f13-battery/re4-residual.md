# RE4 — residual hunt re-close (F13 v1.1, 2026-11-27)

VERDICT: STANDS

1. **Findings Answered**: Yes.
   - T5a (freshness): Explicitly adopted as a HALT gate via codebase/ledger grep.
   - Ceiling-shift: Implemented as a reporting rule (qualifier) rather than a bar move.
   - HALT table: Explicitly defined (T5/T5a/T6/E4 + non-determinism).
   - Determinism/Hash/Gap-bar: Addressed via scoping glosses (same-engine limit) and derivation logic.
   - PRNG-independence: Stated as assumption with oracle-shift empirical check.
   - Swap-PRNG: Correctly moved to "queued" status, removing it from current scope.

2. **Residuals/Smuggling**: None. The proposal strictly maintains the F11/F12 absolute bars. No new variables were introduced into the verdict logic; the "ceiling-shift" is a descriptive qualifier, not a weight-bearing metric. No bar moves were performed. The use of seeds 20..39 is a direct spend of the existing reservation, not a new variable.
