# U70-F2 battery results (CLOSED, STANDS v1.1, 2026-11-27)

Premise: `premise-u70-f2-v1.0.md`. Proposal v1.0 → v1.1 (this file's parent). Verbatims: `f2-battery/r1..r10` (barrage), `f2-battery/re1..re4` (re-close, 4/4 STANDS).

## Barrage round score: 10/10 NEEDS-PATCH (3 accepts, rest rejected with derivations)
- **ACCEPT (1, R1-control):** primary baseline → filed F1a-V3 rows, same-seed paired deltas; V2 to floor reference; no fresh V2 in Phase 1.
- **ACCEPT (2, R2):** ctxAcc bar back to ≥0.85; forcing cost as descriptive paired delta.
- **ACCEPT (3, transfer bars R3/R4/R6/R7/R9 + sequencing R7/R10):** architectural-transfer framing; per-regime paired diff + 95% CI; TRANSFER needs direction-CI in ≥3/4 AND ≥0.70 floor in all 4; N3 denominator clarified (ctx/action gated, rho descriptive); Phase 2 runs IFF probe passes.
- **REJECT (R1-smuggling):** action path is provably z-only in the driver (Wc←z_oh; h→action only via sampled z = the forced path). No bypass exists to smuggle through.
- **REJECT (R8/R10 triviality):** V2 ctxAcc is well-defined (filed 0.928) — "undefined/zero by definition" is false.
- **REJECT (R6 N3):** frozen-head-under-shift is the test itself, not a scope breach.
- **REJECT (R5 don't-retrain):** Wave-1 weights were not persisted; retraining to convergence with paired CI is the only valid baseline — seed luck does not survive 20 paired seeds.

## Patch v1.1 (one pass)
`u70-f2-prereg-proposal-v1.1.md`: F1a-paired primary, 0.85 restored, CI-based transfer bars with no-collapse floor, sequencing lock.
