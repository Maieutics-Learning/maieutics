# B1-repair micro-spec (user-ordered repair, owed since verifier-x10; agent approval: this file)

## What do I want to find out
Close the filed methods debt: `A.gen(rng,5)` emits undefined query tokens (~20% of B1 lines: `ks` has 4 keys, `qi = rng.int(5)` can be 4 → `ks[4] = undefined` → NaN → counted miss). Quantify the absolute understatement on real stacked models and lock in the safe convention. Filed `A.gen` is NOT touched (would invalidate every filed ledger).

## Design
- Wrapper `genSafe5(rng, A)`: identical to `A.gen(rng,5)` except `qi = rng.int(4)` clamped to valid keys (same shuffle, same values; only the query index is repaired). New code uses it; old ledgers stand.
- Calibration (eval-only, no training): restore filed R-a R2 params (d-verR-a-s{s}.json `cks[1].params`, seeds 0,1,2) + filed H1 R2 params (d-verH-h1-s{s}.json `cks[1].params`), run B0/B1/B3 with buggy gen vs safe wrapper, same streams.
- Bars: (i) B0/B3 identical to filed values (±0.0 — wrapper touches only B1 lines); (ii) B1-safe ≥ B1-buggy every seed (understatement confirmed + quantified); (iii) rank order across the 6 models unchanged (relatives stand — the filed claim).
- Verdict: REPAIRED (all three) / RANK-SHIFT (any reorder — escalates: filed relative claims get re-examined).

## Cost
6 eval-only restores × 600 lines. Minutes. Resume-safe via COMPLETE-gated ledger.

## Ledgers
src/evidence/decomp/d-b1repair-calib-s{s}.json. Driver: novel-driver.js += genSafe5 + runB1RepairCalib.
