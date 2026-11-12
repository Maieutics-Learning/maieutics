# W187exec — group-sequential design (B; backlog-W161)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 1 sandbox grid: 6 policies × 3 effects × 2000 trials)
- Validity (null FPR): fixed .056 ✓, naive .153 (inflated — ban stands, magnitude scenario-dependent vs W167's .341), cons28 .024, pocock4 .052, obf2 .046, obf4 .044. All textbook boundaries hold ≈.05 in-sim.
- Power/efficiency (small δ=.4): fixed .799 @100n; OBF-2 .801 @88.7 (FULL power, −11n); OBF-4 .797 @80.9 (−19n); Pocock-4 .712 @71.7 (cheaper, −.09 power); cons28 .610 @75.3 (valid but weak). OBF is the efficiency winner: it preserves fixed-n power while banking 12–19% samples.
- Early stopping (large δ=.8, all power 1.0): E[n] naive 24.8 < cons 32.8 < pocock 34.1 < obf4 50.4 < obf2 55.7 < fixed 100 — OBF pays for its small-effect power with late large-effect stops (conservative early by construction).
- Look-cost regime map: looks free → Pocock-4 cheapest valid (small 143.4); looks cheap → OBF-2 preserves power cheapest-ish (180.8); looks expensive → K=2 over K=4 everywhere (null 219 vs 239; small 195 vs 194 tie) and FIXED wins under null (210 — looks are pure cost when nothing's there). Schedule guidance: pricey looks ⇒ fewer looks; unlikely effects ⇒ don't peek at all.
- Adoption upgrade (scoped to normal-data sandbox): OBF-2 becomes the DEFAULT sequential (dominates W167's cons28 on every metric: power .801 vs .610, looks 1.77 vs 6.54, cost better at all c); Pocock-4 = cost-first variant; cons28 DEMOTED to legacy fallback (for when pre-set looks are impossible — every-10 peeking needs no schedule). W167's ban (naive) re-confirmed.
- Verdict USED (validity table + power/efficiency map + cost-regime guidance + default upgrade). No precursor, no conflict. OBF-2 field test on the W177 tax replication (live interim looks) spawned W178.

## Tangential (reasoning, 0 spend)
- Every-10 peeking is the siren again: cons28's 8.87 looks per null trial cost 88.7 look-dollars at c=10 to buy FPR .024 — validity purchased at look-prices nobody budgeted. Pre-set looks (K=2) aren't just tidier statistics; they're cheaper ones. The schedule is part of the price.

## Spend / queue
- Spend: 0 + 0 + 1 grid (floor). Consumed backlog-W161 removed; spawned W178 to BACK. Backlog 17. Synthesis R28 clock: 4/5.
