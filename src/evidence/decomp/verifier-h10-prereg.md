# Verifier-H v1.0 — harder reverse under the verifier (user-countersigned 2026-11-22; agent approval: this file)

## What do I want to find out
V1 verdict: the verifier STACKS on standard reverse (R2 B3 +0.10 mean, B0
~1.00). Is the stacked reverse robust, or does it shatter under interference?
Two harder axes, both unambiguous (4-class scoring, chance 0.25):
- b6 dilution: standard 3-pair reverse + 2 decoy pairs reusing keys; queried
  value unique in the line (resampled), so the answer stays well-defined while
  context lengthens and duplicate keys interfere (the probe11 degenerate
  regime, weaponized).
- b7 long: 6 pairs, keys with replacement, queried value unique (collisions
  rerolled). Longer context + repeat-key interference, unambiguous by
  construction.

## Research check
In-repo only (assoc stack, v11/ver1 machinery). Proceeding.

## Design
Shared extended battery b6/b7 (200 lines each, seeds 14900+s streams — new
function runExtEval, runCycleEval untouched). HELD-OUT patterns (adopted
from fresh-eyes REJECT — train/test same-cadence reads as specialization):
b6x = 4 base + 2 decoys (different cadence from the 3+2 training flats);
b7x = 4-pair unique-query (shorter than the trained-6 flats).
- H1 (baseline, descriptive): distill4x2 replication (same as V1: 600 steps,
  re-anchored) + b6/b6x/b7/b7x readout at R1/R2. No absolute bars (first
  look); bar: battery runs clean on 3/3 (no crash, all formats in [0,1]).
- H2 (train under dilution): identical but cycle flats from
  genCycleSetDist (3 base pairs + 2 reuse-key decoys; internal queries
  reference base pairs) + distill W4. Bars: H2-b6(R2) > H1-b6(R2) quorum
  2/3 (specialization check) AND H2-b6x(R2) > H1-b6x(R2) quorum 2/3
  (true robustness — novel cadence).
- H3 (train long): cycle flats 6-pair (keys with replacement, queries on
  unique-value pairs) + distill W4. Bars: H3-b7(R2) > H1-b7(R2) AND
  H3-b7x(R2) > H1-b7x(R2), quorum 2/3 each.
Cross bars (all arms): B0 >= 0.90 at R2 (constraint must survive new flats),
B3 within ±0.10 of V1-R2 (new flats must not corrupt the standard skill).
VERDICT per arm: ROBUST (cross bars + both bars) / SPECIALIZED (same-cadence
bar only) / FRAGILE (both miss) / CORRUPT (cross bars miss).

## Expectation (scored at verdict)
H1: b6/b7 well above chance but below B3 (~0.35-0.45 — dilution hurts, no
collapse). H2/H3: PASS (training on the regime buys +0.05-0.10 over H1).

## Pre-mortem
Strongest objection: cross-run comparison (H2 vs H1) confounds run noise —
mitigated by 3 seeds + quorum + the ±0.10 B3 cross-bar (a corrupted run is
detectable, not silently counted). Most likely failure: FRAGILE everywhere
(interference beats the verifier — bounds the stacked skill to clean lines).

## Nearest-failure
verifier-v10 (differs: standard flats only; here dilution/long flats in
cycles and battery).

## Cost
3 arms × 3 seeds × 600 steps ≈ 3× V1 ≈ 45 min total, one seed-run per
execute_js call (~5 min each), resume-safe via COMPLETE-gated ledgers.

## Ledgers
src/evidence/decomp/d-verH-{h1,h2,h3}-s{s}.json, d-verH-verdict.json.
Driver: novel-driver.js += genDistract/genLong6/cycle variants + runVerifierH.
