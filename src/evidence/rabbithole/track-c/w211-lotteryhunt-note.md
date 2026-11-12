# Wave 211 note — backlog-W181 lottery-substrate hunt + predictor (bench, executed)

STOP RULE: stopped after 3-arm hunt (96 runs x 600 steps) + pipeline on the found substrate (hunt capped at 3 per pre-reg; no n=64/cliff-refinement — spawned W198, not built). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (page bench; same train stream across shares via dedicated aux-coin). Clock: R32 4/5. Pre-registered predictions scored: (a) CONFIRMED (b) CONFIRMED (c) CONFIRMED-with-nuance.

## Direct: the cliff lives between share 0 and .1; K50 sees ignition coming

Hunt (SeqModel h16 parity6, 600 steps, seeds 7-38, ignite = hard@600 ≥ .85):
- Arm 1, share-0 (W150-direction check): 6/32 ignite (19%). W150's direction CONFIRMED massively — share-1.0's 31/32 collapses to 6/32 with no aux (this substrate needs the tutor more than W150's did; the 53/47 rate itself is substrate-specific, the DIRECTION is not).
- Arm 2, share-0.1: 26/32 (81%) — overshoot. Arm 3, share-0.05: 21/32 (66%) — IN the 30-70% window. Hunt closed in 3 (cap respected).
- Dose map: 0→19%, .05→66%, .1→81%, .25→100%, .5→94%, 1.0→97%. The cliff is steep and low: everything happens between 0 and .1; above .1 aux is saturated (and .25's 100% vs 1.0's 97% re-sights W191's less-aux-raises-the-floor).
- Spec deviation owned: the spawn said "h8/small-net + harder-task variants." Data vetoed it — at 19% the hunt needed EASIER (more dose/capacity), not harder. h8 would have gone colder. Revised toward the data, recorded here.
- Pipeline on share-.05 (gate passes: minority 11 ≥ 4; 231 LOO pairs): K50 AUC .654 (weak-but-real; weights prefix +17.1 leads, testIn +3.5; trainAcc −23.9 — igniters train WORSE at K50, slow-starter signature, n=32-noisy so flagged not trumpeted); K100 .554 (chance); K200 .429 (anti-signal — owned: direction noise at this n, the grok window ~150-300 leaves only a K50 shadow).
- Routing priced (first non-degenerate numbers): K50 kill-bottom-half saves 45.8% compute, keeps 13/21 ignitions (kills 8 vs random 10.5 vs oracle 0). Spread x earliness x stakes (W191's formula) finally has all three measured: spread 21/11, earliness K50-only, stakes 46%-for-8.

Verdict: USED (substrate found in-cap; dose cliff mapped; predictor's first honest run — weak early signal, priced routing, owned decay). No precursor, no conflict.

## Tangential: hunt toward the data, not the plan (0-spend, reasoning only)

The spawn's hunt order assumed share-0 would overshoot (it was written when W150's 53%-with-aux suggested this substrate ignites easily). One arm of data (19%) falsified the assumption, and the hunt turned around. Pre-registered hunt orders should name their REVERSAL condition ("if arm 1 < 30%, hunt easier") alongside the cap — a cap without a reversal rule is a plan to walk off the cliff efficiently. Rule adopted forward.

## Spend / queue

- Spend: 0 + 0 + 3 bench campaigns (96 runs x 600 steps; floor x3 — same justification as W191: each arm was a principled candidate, identical train streams). Consumed backlog-W181 removed; spawned W198 to BACK. Backlog 17. Synthesis R32 clock: 4/5.
- W198 (A, bench): cliff-map + predictor-power — share {.02,.035,.065,.08} x 32 seeds to map the ignition cliff precisely; pipeline at n=64+ on share-.05 (seeds 39-70) for stable K50 weights (is trainAcc-negative real?); prefix-only meter vs full LDA.
