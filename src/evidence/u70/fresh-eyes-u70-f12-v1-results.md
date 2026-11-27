# Fresh-eyes U70-F12 v1 battery results (2026-11-27)

Tally: 4 STANDS (oracle-phase, firewall-verdict, second-variable, scope-creep) / 6 NEEDS-PATCH.
Adjudication: ACCEPT 4 (empty-bin gloss; per-trial retention upgrade; E4 bin-sum wording; precision 6-decimal ECE/MCE + tolerance) + 2 glosses on rejects (CPU-only determinism filed fact vs cuDNN import; E2 is a change-detector not a validator).
Rejected with derivation: E4-vacuous (already requires bin-sum; wording clarified only); determinism (hand-rolled CPU Float64 JS, no GPU; filed precedent F5-k0 maxDiff 0.0000, F10 0/1080); E2-scope (single point proves formula change, not calibration shape — E1 + reporting do that).
Patched to v1.1 (no new arms, no new bars): empty bins contribute 0; rows carry calTrace per-trial [conf,hit] arrays (rounded 4dp) alongside bins; E4 checks bin-sum == T exactly + trace length T; ECE/MCE ledgered 6dp, bin acc/conf 4dp, recompute tolerance 1e-3.
