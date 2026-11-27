# U64c barrage v1.1 scout 7

## Brief
ANGLE logging-2: detT's response needs trigger logs to be auditable (which slots were explore? what were qkCounts before/after reset?). Does the ledger spec (U64 keys) already carry per-slot traces (curve?) sufficient to reconstruct triggers post-hoc, or is a trigger-log field missing? Name it or COMPLETE.

## Reply (verbatim)
VERDICT: NEEDS-PATCH

1. Trigger logs for detT are missing from the ledger spec. While U64 keys may trace curves, they do not explicitly log the binary trigger event or the specific qkCount state at the boundary reset. Without explicit trigger-log fields, post-hoc reconstruction of the "explore" phase is probabilistic, not deterministic. This violates the auditability requirement for detT’s response.

HARDEST-TEST: Cross-run drift check on twins (1e-7 vs 0.03 margin) to validate reset-inertia.
