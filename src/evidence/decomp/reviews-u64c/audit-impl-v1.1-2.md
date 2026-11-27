# U64c audit-impl v1.1 scout 2

## Brief
ROLE IMPLEMENTATION-AUDITOR: list every W0/W1/W2 assertion the driver must check (PIN, twin p0/step1, rule-ID, FP note, K slots, trigger slots, explore RNG stream, exam verbatim). Flag any silent-judgment step. If all mechanical, ENFORCEABLE + weakest check.

## Reply (verbatim)
VERDICT: IMPLEMENTABLE

1. W0: Verify `stackHash` and `UNLICENSED` compute status.
2. W1: Validate 20 trains vs 20 evals; verify `K=10` against coupon-collector derivation; confirm `detT` armCode 106 trigger logic.
3. W2: Check `two` and `adapt` margins against `dice` baseline; verify quorum 15/20; confirm `FP-DRIFT` < 1e-7 for twins.
4. PIN: Match `exam verbatim` streams (52500/52400) and masks (91000) + seed.
5. Twin Audit: Compare `detT` vs `det` (reset-disabled) to isolate `reset` effect.
6. RNG: Audit `UNIFORM explore` stream for K-slots.

Silent-judgment: Interpretation of `FP-DRIFT` margins (0.03/0.10) vs cross-run drift is subjective if not strictly bounded by `stackHash`.

HARDEST-TEST: `FP-DRIFT` twin cross-run stability (~1e-7).
