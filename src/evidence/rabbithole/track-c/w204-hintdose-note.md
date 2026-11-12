# Wave 204 note — backlog-W175 hint-dose response (bench, executed)

STOP RULE: stopped after 54-run grid (dose x sched + fade@.25 completion arm; no fade@.5/late-lowdose — spawned, not built). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (w158 rig + auxW param; paired late/full seeds 7-18). Clock: R31 3/5. Pre-registered predictions scored: (a) REFINED (b) CONFIRMED (c) CONFIRMED+nuance.

## Direct: minimal sufficient hint is .25-const; fading needs headroom

Grid: SeqModel h16 parity6, 400 steps, endpoint hard len10. Dose-const: .1 → .903±.166, 4/6 ignite (lottery losers .59/.83); .25 → .983±.029, 6/6; .5 → .973±.041, 6/6; 1 → .960±.048, 11/12 (n=12). Late-vs-full @1 (paired n=12): diffs +.030/−.014/+.017/+.007/+.047/.000/+.076/+.013/+.160/−.077/.000/+.023, mean +.0235±.017 (paired se), t≈1.4, n.s. Fade-vs-const: @1: .944 (5/6) vs .960 (11/12), −.016±.034, n.s.; @.25: .925 (5/6, lottery .63) vs .983 (6/6), −.058.
- (a) Minimal sufficient = .25-CONST (refines .5 guess — cheaper): .1 partial (lottery), .25 full ignition, more = flat (top non-monotone .25/.5 ≥ 1 within noise; no inverted-U claimed at these n).
- (b) Late-vs-full TIE powered ✓: W184's unclaimed +.014 (n=3) resolves as noise (n=12, p≈.19, |gap|<.03 as predicted). Lottery reshuffle across arms (seed15 +.160 vs seed16 −.077 — opposite-sign draws, cf W193's seed-10) — same data pattern as W193's cut-twin outperforming: the lottery deals fresh hands per arm.
- (c) Fade≈const at full dose ✓ (pennies generalize: −.016), PLUS headroom nuance: fade@minimal-dose resurrects the lottery (5/6 vs 6/6). Minimal is SCHEDULE-dependent (.25 const suffices; .25 fade doesn't). Mechanism guess (unclaimed): fading removes scaffolding the marginal seed still needs; full dose has headroom to spare.
- testIn 1.0 everywhere (one .984) — debt address, one line.

Verdict: USED (minimal dose + powered tie + schedule-dependent minimal). No precursor, no conflict.

## Tangential: report the tie with its reshuffle, not just its p-value (0-spend, reasoning only)

+.024±.017 n.s. alone reads "no difference" — but the paired diffs (+.160/−.077) show the arms disagreeing on WHICH seeds struggle. A tie with reshuffle (lottery re-dealt per arm) differs mechanistically from a tie with agreement (same seeds struggle): the first says arms are interchangeable lotteries, the second says arms are equivalent treatments. Same verdict (tie), different ledger meaning (substitutes vs identical). W193's cut-twin outperformance is the same phenomenon wearing a striking outfit. From here: paired comparisons report the diff VECTOR (or at least its sign split + extremes), never just mean±se.

## Spend / queue

- Spend: 0 + 0 + 1 grid (48 runs) + 1 completion arm (6 runs; floor). Consumed backlog-W175 removed; spawned W192 to BACK. Backlog 17. Synthesis R31 clock: 3/5.
- W192 (A, bench): schedule x dose interaction — fade@{.5} + late@{.25,.5} x 6 seeds (same rig); does headroom close the fade gap; does late-start need headroom too (late = extreme fade predicts worse); completes auxW x sched grid.
