# Wave 191 note — backlog-W164 early-ignition predictor (bench, executed)

STOP RULE: stopped after 3 share-level campaigns (96 seeds x 600 steps) + pipeline build (no 4th arm; substrate hunt spawned, not chased). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (in-page bench; same train stream across shares via dedicated aux-coin rng — shares comparable seed-for-seed). Clock: R29 2/5.

## Direct: the lottery didn't show up (three nulls + a ready pipeline)

Protocol (built, durable: scratch/track-c/w164-ignpred.js): SeqModel h16 parity6 + prefix aux, 600 steps, seeds 7-38 (W150's 32); per-seed logs at {50,100,200,600} (trainAcc/trainLoss/hard/testIn/prefix-probe); ignited = hard@600 >= 0.85 (W170's split, precommitted); minority-class gate (<4 -> no LDA fit, report degenerate); LDA LOO-CV AUC at K={50,100,200} + kill-bottom-half routing pricer (compute saved vs ignitions lost vs oracle vs random).

Results:
- Share 1.0: 31/32 ignite (lone lottery: seed 15, .737). LDA gated (minority 1). AUC meaningless (degenerate fit scored the lottery seed above all ignited — reported, not interpreted).
- Share 0.5 (adjustment 1, same train stream): 30/32 (seeds 7 .847, 10 .803). Gated.
- Share 0.25 (adjustment 2, W113's ledger default): 32/32, min .950, twenty 1.000s. Gated.
- Early means (share-0.25, all ignited): K=50 trainAcc .507/hard .487; K=100 .525/.498; K=200 .628/.847 — everyone groks ~150-300. Nothing to route: uniform success is unroutable.

Against-interest observation (kept, not chased): LESS aux raises the floor (mins .737 -> .803 -> .950). Full aux slightly HURTS ignition reliability here — opposite lean to W150's +0.091 for share 1.0. Not a conflict (W150's substrate/task unknown; my share-0 arm unrun) — recorded as non-monotonicity + folded into W181 (share-0 arm doubles as the W150-direction check on this substrate).

Verdict: USED-with-teeth boundary — W150's 53/47 lottery is substrate-specific; on parity6-h16-prefix-600s ignition is ~universal across shares, scoping W150's generality. The predictor pipeline is built, gated, and priced; it waits for a lottery substrate. No precursor, no conflict.

## Tangential: routability requires spread (0-spend, reasoning only)

A predictor is a variance tax: you only get to route compute if the world deals spread. This wave failed because the substrate is too kind — same shape as W190's flat top (identification error free where the landscape is flat) and W185's lottery (early-cut variance IS the signal). Unify: routing value = spread x earliness x stakes; all three waves measured one factor each (W185: stakes/lottery, W190: sharp-vs-flat landscapes, W191: spread absence). The routing ledger now wants a substrate WITH spread — that is W181's whole job.

## Spend / queue

- Spend: 0 + 0 + 3 bench campaigns (floor x3 — justified: each share level reuses the identical train stream; the question needed a lottery and each level was a principled candidate, not fishing).
- Consumed backlog-W164 removed; spawned W181 to BACK. Backlog 17. Synthesis R29 clock: 2/5.
- W181 (A, bench): lottery-substrate hunt + predictor — share-0 arm on parity6-h16 (W150-direction check on this substrate); h8/small-net + harder-task variants until ignite in 30-70%; then run w164-ignpred.js unchanged (SHARE + threshold only). Same seeds 7-38.
