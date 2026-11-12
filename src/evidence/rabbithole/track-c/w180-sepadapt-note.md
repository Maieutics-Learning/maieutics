# W180exec — separation-adaptive telemetry (A/B; backlog-W155)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 3 sandbox builds, floor)
- Killed branch (recorded): v1 with FREE false fires let adaptive win by firing constantly (abl 10–20/trial, lag ~1–4 by luck — alarm that never stops is never late). Pricing the missing cost (REF_COST=5 blind pulls per fire) + confirm-2 flipped the ranking: the v1 "win" was pure cost-externalization.
- Priced result (3 regimes × 7 policies × 500 trials): fixed minimax (0.4,5) still rules mean — adaptive k=2 matches nowhere on mean (−.003 to −.009) but buys lag (narrow 18 vs 25.3) and miss rate (.022 vs .036, no blowups). k-sweep maps the strictness tradeoff exactly as theory predicts: k=3 best-in-wide (.7579, abl .254) but collapses in narrow (miss .156); k=2.5 is the minimax adaptive — never worse than −.003 on mean, best-in-narrow (.7445 vs .7428), lag 22.5 vs 25.3, abl .53 vs .614.
- W160's predicted flip replicated AND routed around: fixed-long (0.4,10) in narrow has lag 43.5 + miss .21 (the flip toward long windows fails by missing); adaptive grows its own window instead of precommitting to one. The adaptive premium stays small because priced ablations punish its extra looks — without alpha-spending (backlog-W161's item) it cannot pull away. Noted, not built.
- Verdict USED (priced tradeoff + k-map + flip replicated-and-routed; adaptive adopted iff lag is priced — default stays fixed minimax). No precursor, no conflict. Lag-price elicitation (price detection lag vs mean; under what lag price adaptive clears fixed) spawned W172.

## Tangential (reasoning, 0 spend)
- The v1/v2 flip is the round's cleanest demonstration of why costs must live INSIDE the toy, not beside it: with free alarms, the optimal policy is a siren. Every unpriced sandbox metric is a siren subsidy — mean-without-ablation-cost will always vote for the policy that fires most.

## Spend / queue
- Spend: 0 + 0 + 3 sandbox builds (1 killed by pricing). Consumed backlog-W155 removed; spawned W172 to BACK. Backlog 17. Synthesis R27 clock: 3/5.
