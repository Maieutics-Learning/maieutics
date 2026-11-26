# Fresh-eyes battery: U39-DIAG-EXT prereg v1.0 → v1.1 (3x sealed; pool labor, never training signal)

## Battery (verbatim reviewer returns, trimmed to verdict + health + patches)
### R1 (angle: ledger-data honesty) → NEEDS-PATCH
HEALTH: numeric/prefiled PASS; controls PASS; training-free PASS; gray-zone PASS;
deviations FAIL (A1-LIVE→B8 circularity risk); Wave-C PASS.
Flagged A7 as needing unfiled label-level granularity. Patches: P1a replace A7
with slope-variance; P1b add label_pred_matrix to ledgers.
### R2 (angle: probe falsifiability) → NEEDS-PATCH
HEALTH: bars PASS; controls PASS; training-free PASS; gray-zone FAIL (B4
0.021–0.049 INCONCLUSIVE = soft-kill rigging); deviations PASS; halt-safe PASS.
Patches: P1a B4 FAIL >0.02; P1b B6 cross-seed CI; P1c B2 DEAD-wording.
### R3 (angle: scope safety) → IMPLEMENTABLE
HEALTH 6/6 PASS. Patches: P1a FINAL-INCONCLUSIVE wording; P1b explicit A1→B8 link.
Scope safe: 12.5%/50% mismatch is a controlled stressor, no hidden training, no
reviewer-tuning loop.

## Owner adjudication (pins P1a–P1e, applied in prereg v1.1)
- R1-P1a REJECTED: A7 needs no ledger field — diet regen from filed diet spec +
  seed is pure arithmetic (features + labels, no model). Replacing the audit with
  slope-variance would gut the highest-stakes measurement of the program. A7
  clarified with the regen path as the named instrument.
- R1-P1b REJECTED same reason (no ledger change needed).
- R1-HEALTH#5 answered, no change: A1→B8 is one-way gating (A1-FLAT skips B8),
  not circularity — restated explicitly in v1.1 (P1e).
- R2-P1a PARTIAL: B4 bars kept as adjudicated in debate-02 (≤0.02 / ≥0.05); the
  gap concern is met by defining FINAL-INCONCLUSIVE downstream (gated-shut, not
  dead; different-instrument re-probe allowed, same-probe re-sample forbidden).
  Collapsing FAIL to >0.02 rejected — would rewrite the debate adjudication.
- R2-P1b ACCEPTED: B6 per-seed with 2/3 quorum (P1c).
- R2-P1c ACCEPTED: B2 not-met → DEAD wording (P1d).
- R3-P1a ACCEPTED folded into P1b resolution; R3-P1b ACCEPTED (P1e).
Result: v1.0 STANDS with pins → v1.1. AWAITING fresh countersign for Waves A–C.
