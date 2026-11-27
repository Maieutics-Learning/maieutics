# U70-F1 battery results (CLOSED, STANDS v1.1, 2026-11-27)

Premise: `premise-u70-f1-v1.0.md`. Proposal v1.0 → v1.1 (this file's parent). Verbatims: `f1-battery/r1..r10` (barrage), `f1-battery/re1..re4` (re-close, 4/4 STANDS).

## Barrage round score: 10/10 NEEDS-PATCH (ONE coherent finding, all 10 converge)
- **ACCEPT (core, unanimous): disguised sweep.** The 0→0.3 rep-weight anneal is a time-varying structural change, not a number; paired deltas vs Wave 1 (fixed 0.1) cannot attribute to the floor. Fix filed: anneal DELETED; F1 = floor 0.25→0.05 ONLY, repw fixed 0.1. Interpolation/determinism objections (R5) moot. (R2/R4/R6/R8/R9/R10/R1/R3 all reduce to this; counted once.)
- **ACCEPT (verdict boundaries, R7/R9/R10):** PARTIAL vs PERSISTS vs uninterpretable corner now locked in v1.1 (probe-fail = PERSISTS regardless of gap; near-miss bars don't move).
- **ACCEPT (clarifications):** V4-within-run validity vs cross-floor comparability separated (R9); sub-0.05-KL outcome pre-classified as PERSISTS-with-mechanism (R2).
- **REJECT (R7 circularity):** probe/gap bars are outcome bars, not floor-calibrated artifacts; they stand unchanged across floors by design. No change.

## Patch v1.1 (one pass)
`u70-f1-prereg-proposal-v1.1.md`: floor-only change, fixed 0.1, locked verdict boundaries, dual-floor KL reporting, near-miss discipline.
