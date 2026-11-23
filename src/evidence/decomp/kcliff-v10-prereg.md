# K-cliff mapping v10 (E2, countersigned)

Agent approval: this file. User countersign: 2026-11-23.

## Why
Bottleneck found a sharp K=4->K=2 drop at sigma=0.5 (0.737 -> 0.623) but K=3/5/6 unmapped. Locates the cliff precisely; distinguishes gradual squeeze from threshold.

## Design
Frozen tutor s0, recipe filed. Fixed sigma=0.5. K in {3,6} (K=5 skipped for budget; 3 nails the cliff side, 6 nails the plateau side). R=3 seeds each => 6 trains + 6 evals + scrambles.

## Bars
- CLIFF-AT-3: K3 mean < 0.65 AND K6 mean >= 0.70 (sharp between 3 and 4).
- GRADUAL: monotone K2<K3<K4<K6<K8 with steps <= 0.08 (squeeze, no cliff).
- FLAT: K3 ~= K4 (cliff is K2-specific).
Quorum 2/3 descriptive; verdict picks best-supported shape + numbers.

## Expectation
CLIFF-AT-3 or FLAT (prior: K4 0.737, K2 0.623; K3 should sit near K2 if threshold is 4 dims).

## Cost
6 trains + 6 evals. Reuses bottleneck driver.

## Ledgers
`d-bottleneck-train-K{3,6}-sig0p5-*` + evals, `d-kcliff-verdict.json`. Transcript + CHATLOG. NO PUSH.
