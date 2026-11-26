# Fresh-eyes battery: U40-GATE-AUDIT prereg v1.0 → v1.1 (3x sealed)
## R1 (probe validity) → IMPLEMENTABLE
HEALTH: bars PASS; halt PASS; frozen PASS; FD FAIL (perturb-without-restore drift
not captured by FROZEN-EXACT); consequences PASS. P1a: U1-pass + U3-starved ->
WIRING-FAILURE not INPUT-STARVED. P1b: clear grad buffers after U2 FD.
## R2 (halt/sequence) → NEEDS-PATCH
HEALTH: halt PASS; frozen PASS; FD FAIL (B=16 noisy, 0.1-10x too permissive);
consequences PASS; compute-savings PASS. Critique: blind to gradient SCALING
anomalies (poisoned-but-consistent grads pass U4+U2). P1a: U0 symmetry/variance
check Vs 1e-8/1e2 baselines. P1b: tighten FD to 0.01-1.1x.
## R3 (consequence safety) → IMPLEMENTABLE
SUSPECT-STEP marking correct + necessary; BUG never auto-licenses re-run (fresh
prereg mandatory). HEALTH 5/5 PASS. P1a: link INPUT-STARVED to SUSPECT-STEP in
metadata header. P1b: NONE.
## Owner adjudication → v1.1 pins P1a-P1c
- R1-P1a REJECTED as mislabeled: tree already separates connected (U1) from
  varies (U3); connected-but-constant IS input-starvation, handled correctly.
- R1-P1b + HEALTH#4 ACCEPTED: U2 restores gate.b bitwise + asserts (P1a).
- R2-P1a PARTIAL: no variance baseline exists; arbitrary gates rejected.
  Substance kept as grad-norm-vs-displacement cross-check OPT-NOT-DELIVERING (P1b).
- R2-P1b MODIFIED: 0.01-1.1x false-BUGs at B=16 batch noise; window 0.25-4x (P1c).
- R3-P1a REJECTED: INPUT-STARVED is not a bug; suspect-marking valid history is
  overreach. SUSPECT-STEP fires on INTEGRATION-BUG only.
Result: v1.0 STANDS with pins → v1.1. AWAITING fresh countersign for U1-U4.
