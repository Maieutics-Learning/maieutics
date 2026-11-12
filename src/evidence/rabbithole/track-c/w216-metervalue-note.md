# Wave 216 note — backlog-W185 meter-value + N-sizing (sandbox, executed)

STOP RULE: stopped after 36-cell grid (cap x t x N x 200 trials + post-hoc tau sweep; no C-variation/stakes-frontier — spawned W202, not built). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (worker sandbox, nested meter subsets = paired across N; w185-metervalue.js). Clock: R33 3/5. Pre-registered predictions scored: (a) HALF-reframed (b) CONFIRMED (c) CONFIRMED.

## Direct: the meter is a tiebreaker, not an engine

Grid: W196 setup verbatim (oracle spread on 400 cases, GO iff > C=.05; meter fpHat on first-N of 400-pool, nested/paired) x cap {.6,.7,.8} x t {.65,.5,.35} x N {50,100,200,400} x 200 trials; tau swept {0..1}; competitors always-GO / always-SKIP always priced.
- W196 replicates EXACTLY: cap.7/t.65 best loss .0087-.0095 (theirs .0093), plateau [.08..1] (theirs flat bottom), always-SKIP .0095 (theirs .0095), always-GO .0217. The calibration world is stable across rebuilds.
- (a) HALF, reframed sharper: where oracleGO=1 (all mid/greedy + cap.8 everywhere), meter ties always-GO at loss 0 and crushes always-SKIP (.065-.30) — it does NOT beat both constants. The meter is UNIQUELY valuable in exactly one world-type: mixed oracle (cap.7/t.65: .0087 vs .0217/.0095) — and there it beats always-GO while tying always-SKIP within .0008 (noise). Three-column audit: the probe wins outright nowhere decisively; it wins by tiebreak.
- (b) VOI flat ✓: cap.7/t.65 min-loss across N50/100/200/400 = .0087/.0089/.0091/.0095 — no rescue by sharper meter (N400's best is never-GO, a noise artifact, owned). The game is marginal, not the meter blurry. N-sizing answer: N=50 suffices; spend nothing on calibration sharpness here.
- (c) Plateau anatomy ✓: width intrinsic (flat bottom persists all N), but plateau TOPS rise with N — cap.6/t.5: .01→.06→.08→.1; cap.8/t.65: .03→.08→.1→.12; cap.7/t.5: .08→.12→.15→.2. Sharper fpHat concentrates near true-fp, so the safe-tau interval extends upward: N buys HEADROOM, not loss. Report plateau tops per N, never points (W196's rule now has its N-derivative).
- Mechanism one-liner: the meter's job is knowing which constant to be — in mixed worlds it splits the difference (fgo≈0, fsk≈.5: it GOes on the clear cases, shrugs at the marginals). Value = P(mixed) × margin, and here both are small.

Verdict: USED (W196 replication + value map + VOI-flat + plateau-tops rule). No precursor, no conflict.

## Tangential: price the tiebreak, fund accordingly (0-spend, reasoning only)

A probe that wins by .0008 over never-search is not a failed probe — it's a correctly-priced one (search cost C=.05 vs expected gain ~.009). The mistake would be funding it like an engine (bigger N, sharper meters, calibration programs). Decision rule: estimate P(mixed)×margin first; if that product is below C, the winning move is a constant, and the meter wave should never have been run. W196's world earned its grid (the product was unknown); W202 maps the product's sign changes so future meters can be triaged by arithmetic. Meters are options on mixed worlds — price the underlying before the option.

## Spend / queue

- Spend: 0 + 0 + 1 grid (36 cells x 200 trials x 800 cases + sweep; floor). Consumed backlog-W185 removed; spawned W202 to BACK. Backlog 17. Synthesis R33 clock: 3/5.
- W202 (C/A, sandbox): search-value frontier — vary search cost C x stakes (spread margin); partition (C, oracleGO-rate, margin) into meter-wins / GO-wins / SKIP-wins; C* boundaries; same worlds + margin control (triage future meters by arithmetic).
