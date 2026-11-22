# Verifier-R v1.0 — round 3 and the verifier's half-life (user-countersigned 2026-11-22; agent approval: this file)

## What do I want to find out
V1 verdict: round 2 STACKS under persistent W4 pressure. What is the
verifier's half-life? Round 3 variants (all = recompute R1+R2 then a 300-step
round 3 with a second re-anchor at 600; endpoints are never persisted, so
every variant pays 900 steps/seed):
- R-a (pressure on): round 3 identical (cycles + distill W4, fresh 17000+s
  streams). Does it climb, hold, or decay?
- R-b (pressure drop): round 3 cycles only (W=0). Is round-3 gain
  self-sustaining, or does the skill need persistent pinning?
- R-c (constraint alone): round 3 distill W4 only (no cycles). Separates
  hold (constraint keeps B0/B3) from teaching (cycles needed for any climb).

## Research check
In-repo only (ver1 machinery). Proceeding.

## Design
PARAMS PERSIST (adopted from fresh-eyes REJECT — recompute confound: R2
must be the SAME state for all variants, not a retraced trajectory):
every run saves full params at each checkpoint in its ledger (filed
convention fix; h48 model ≈ tens of KB). R-a runs full 900 steps. R-b/R-c
RESTORE R-a's filed 600-step params (same seed) + fresh Adam, then run
their 300-step round-3 protocol. Variant differences are therefore the
protocol, never the trajectory. R-a seeds must complete before R-b/R-c.
Driver runVerifierR(fs,log,s,variant): halves [R1(15000s), R2(16000s),
R3(17000s streams)] with per-half {cycles on/off, W}; evals at 300/600/900
via runCycleEval+modelOpt. Ledgers carry r1/r2/r3 evals + params at each
checkpoint (r3 params optional — saved for the next program).
BARS:
- Hard bar (all variants): R3 B0 >= 0.90, 3/3 (constraint integrity is
  non-negotiable; a miss = DECAYS regardless of B3).
- R-a: B3 direction recorded, no directional bar (first look at the
  half-life; verdict from shape: climb/hold/decay).
- R-b vs R-a: descriptive comparison (if R-b collapses while R-a holds,
  pressure is necessary; if both hold, round-3 is self-sustaining).
- R-c: B3 recorded (distill-only cannot teach by construction — filed v11
  rationale — so any R-c climb is a red flag for harness error).
VERDICT: HALF-LIFE MAPPED (shape per variant + pressure-necessity read).

## Expectation (scored at verdict)
R-a HOLDS (B3 ≈ R2 ± 0.05 — ceiling logic again); R-b holds B0, B3 slips
slightly (pressure helps but skill persists one round); R-c holds B0, B3
flat (constraint keeps, nothing teaches).

## Pre-mortem
Strongest objection: 900-step runs drift (optimizer pathologies at long
horizons misread as verifier decay) — mitigated by R1/R2 checkpoints inside
every run (P1-style replication check per variant: R2 must match V1-R2
within ±0.10 or the seed is void). Most likely failure: universal DECAYS
(the verifier has a two-round half-life — still a bound, still publishable).

## Nearest-failure
verifier-v10 (differs: stops at round 2; here a third re-anchored round
with pressure variants).

## Cost
3 variants × 3 seeds × 900 steps ≈ 70-80 min total, one seed-run per
execute_js call (~8 min each), resume-safe via COMPLETE-gated ledgers.

## Ledgers
src/evidence/decomp/d-verR-{a,b,c}-s{s}.json, d-verR-verdict.json.
Driver: novel-driver.js += runVerifierR (per-half weight + cycles toggle).
