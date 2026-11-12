# Wave 250 note — backlog-W213 burn-in economizer (sandbox, executed)

STOP RULE: stopped after (M,k) frequency grid (5 M × 6 k + oracle + fixed, 4 matched cells × p{0,.1}, 300 trials per-trial burn-in) + single-deployment D-blocks (100 ehats × 100 trials × 12 cells). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (vendored w196 rig). Clock: R39 1/5. Pre-reg scored: (a) partial-2x (b) CONFIRMED-in-ratio-form (c) CONFIRMED-steep.

## Direct: the burn-in economizes 2x, not 8x — margins can't substitute for data

- k*(M) = min k with maxFA≤.05 over 4 matched cells: M60 none≤8 (k8 still .070); M120 k=4; M240 k=3; M480 k=2.5; M960 k=2.5. Variance law CONFIRMED in ratio form: k*·sqrt(M/12N) ≈ 3–5 across all M (N=20) — the guard holds when the margin covers ehat-noise by ~4x in SD units. Floor/censoring owned: M960's true k* is below the grid floor, M60's above the ceiling.
- Economy (a) partial: (480,2.5) matches (960,2.5) within noise (maxFA .043 vs .027, maxDetLoss .020 vs .093 — both ±noise) → halve the burn-in for free. Below that, nothing holds both bars: (240,3) buys validity (.037) but pays detection (−.21 max, N20/.15 det .553 vs .71); (120,4) pays −.43. The exchange is brutal because the margin that covers ehat-noise also covers the signal — validity is cheap, detection pays. M≤240 uneconomizable at any k≤8 (M60 fails validity outright; M120/240 fail detection).
- Deployment curve (c): P(FA>.05|M) — M60: .20–.44; M240: .14–.28; M960: .01–.12 (med FA .01 everywhere — the typical deployment is fine, the tail is the risk; worst cell N20/match.05@960: .12 with p90 .06). Falls ~3x per 4x burn-in. Print beside every frequency FA per W229's rule — done here, not deferred.
- Anchors behave: oracle det 1.0/.71/.997/.74 across cells; fixed.15 sirens match.15 (FA .43–.50) and blinds match.05 (det .17) — the adaptive arm at (480+,2.5) beats fixed everywhere except luck-of-level corners (standing result, reproduced).

Verdict: USED with teeth (2x economy with noise-owned equivalence + variance law + brutal-exchange + deployment curve). No precursor, no conflict.

## Tangential: fit the rule, then test the rule (0-spend, reasoning only)

k*(M) came from a grid (fitted); the variance law gives a RULE (k = 4·sqrt(12N/M)) that predicts off-grid. A fitted threshold that never predicts is a summary, not a finding — the wave that fits k* owes the wave that tests k(M) prospectively. W230 is that wave (off-grid M {180,360,720}, fixed rule, no refit). Rules generalize, grids don't — promote on purpose.

## Spend / queue

- Spend: 0 + 0 + 2 grids (frequency + deployment blocks; floor). Consumed backlog-W213 removed; spawned W230 to BACK. Backlog 17. Synthesis R39 clock: 1/5.
- W230 (B, sandbox): adaptive-k(M) rule test — k(M)=4·sqrt(12N/M) at off-grid M {180,360,720} × N {5,20} × match {.05,.15}: holds maxFA≤.05 with minimal det loss vs fixed k=2.5 at same M; rule-vs-grid prospective test, zero refit.
