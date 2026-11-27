# U70-prereg battery results (CLOSED, STANDS v1.1, 2026-11-27)

Premise: `premise-u70-prereg-v1.0.md` (reads proposal + arch + causal diagram). Verbatims: `prereg-battery/r1..r10` (barrage), `prereg-battery/re1..re4` (re-close).

## Barrage round score: 10/10 NEEDS-PATCH (5 patch groups, all adopted into v1.1)
- **ACCEPT (R1 training + R7 selection):** whole-run batch + best-by-train-loss (mini-sweep). Fix: truncated BPTT-50 with carry-over, grad-clip 1.0, ONE restart per seed-path (init = path seed), all selection banned.
- **ACCEPT (R3 metrology):** censor/grace tangle. Fix: FTD category (never-reached-0.75 within dwell), slow detections penalized by both delay and FA by design, FA sensitivity @5/15.
- **ACCEPT (R4/R6/R8/R10 causality, 4 scouts converge):** V4 as separate variant unpairs the test; rho-bypass unattributed; forced-use undefined. Fix: V4 = frozen-V3 test-time z-shuffle (paired, same 20 seeds); G4 gap = V3 − max(cue, V4) ≥ 0.05 with paired differences + CI; V5 reported for attribution; rho-head stays off-z (independence by design).
- **ACCEPT (R5/R9 collapse):** soft-collapse via h-bypass + z-null-op G4. Fix: G5 is prerequisite for G4; added z-only probe p(c|z) ≥ 0.70; G5 fail → representation failure regardless of actionAcc. β-change rejected (would fight Dreamer-verified 0.1 weighting).
- **REJECT (R2 N=60 / bar 0.10):** program N=20 standard matches oracle ledger; paired-difference + CI is the powered analysis, not pooled means. No change.

## Re-close round score: 4/4 STANDS → battery CLOSED, prereg STANDS v1.1
Re-close scouts (training-discipline, paired-causality, collapse-guard, metrology-FTD): all STANDS, no new flaws.

## Status
Proposal v1.1 is reviewed and standing. Neural execution needs a FRESH countersign on exact v1.1 (the owner's earlier "countersign the test plan" predates the v1.1 patches and is recorded as review authorization, not execution authorization). NO COMPUTE until then. NO PUSH without explicit order + PAT.
