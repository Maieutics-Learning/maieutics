# W175exec — hedge-probe design (A; backlog-W151)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 2 sandbox designs, floor)
- Killed branch (recorded): 2-arm proxy probe (retrieval vs abstain on N=100 calibration, GO iff spread > .02) over-triggers 4/6 at the selective gate (proxy spreads .025–.075 vs true .006–.035). Calibration noise (SE ≈ .05 with ~4 gated cases) swamps the ±.01 decision — estimating a small spread directly is the wrong probe.
- Replacement: GATE-METER. The probe never runs a treatment — it measures the calibration false-positive rate (N=100 fresh cases, gate only, ~zero cost) and GOs iff fpRate > .05. 18/18 correct across regimes × 6 seeds: selective (t=.65) SKIP 6/6, true spread .006–.035 (mean .015 — correctly skipped: full search would buy ≤.035); mid (t=.50) GO 6/6, true .058–.143; greedy (t=.35) GO 6/6, true .211–.280. Separation is clean (fpRate 0 / .10–.19 / .29–.46 vs threshold .05; closest call 2× margin).
- Why it works: treatment stakes live in false-costs (abstain's −1 vs retrieval/CF's −2 per false; greedy fp ≈ 150 → spread ≈ .25). The gate-meter prices the exact channel that creates stakes — a probe of the cause, not the effect.
- Boundary (documented): selective-tier fpRate is exactly 0 by construction (non-harmed scores cap at .6 < .65). With overlapping score distributions the meter needs a calibrated threshold, not .05 — threshold calibration under overlap spawned W168.
- Verdict USED (18/18 gate-meter + killed proxy + priced boundary). No precursor, no conflict. Gate-meter threshold calibration under overlapping scores (ROC-priced τ; sandbox) spawned W168.

## Tangential (reasoning, 0 spend)
- Probe the cause, not the effect. The 2-arm proxy failed because it re-measured the thing that's expensive to measure; the gate-meter wins because fp-rate is both free and upstream. Cheap tests should sit upstream of expensive decisions — a probe that costs what it gates isn't a probe, it's the thing itself.

## Spend / queue
- Spend: 0 + 0 + 2 sandbox designs (1 scrapped). Consumed backlog-W151 removed; spawned W168 to BACK. Backlog 17. Synthesis R26 clock: 4/5.
