# W68exec — probe-budget schedule (Group B; backlog-W62)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 2 sandbox toys, floor)
- Question from W48: probing calibrates (uncertainty-first beats random), but when do you STOP probing and START teaching?
- Toy v1 (global rule, HONEST NEGATIVE): stop when total posterior variance < 0.35 or marginal gain < cost. Result: cap-hit at 60 probes (1.639→0.715, threshold unreachable) — global-variance thresholds don't scale with N; killed.
- Toy v2 (per-item rule, HONEST NEGATIVE): item resolved when 90% posterior CI width < 0.5. Result: 8/20 resolved at 120 probes — full calibration costs ~11 probes/item (3.29·√(0.25/n)<0.5 → n>10.8). Correct but expensive; killed as a gate.
- Adopted rule (economic, not epistemic): fixed probe SHARE of the interaction budget (default 20%), uncertainty-first order within the share, then teach — Thompson posteriors (W46) keep updating from teaching outcomes, so probing and teaching share one posterior and nothing is wasted. Stop early only if all items resolve first. Probe-share sizing (what fraction; bench-gated) spawned W79.
- Verdict USED (design + two disconfirming toys). No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- The two negatives are the finding: "probe until calibrated" sounds principled and is unaffordable — the same trap as inference-scaling without a budget (W29: more loops ~0 gain). Budgets, not thresholds, terminate information-gathering; the posterior carries the knowledge across the probe/teach boundary.

## Spend / queue
- Spend: 0 + 0 + 2 toys (floor). Consumed backlog-W62 removed; spawned W79 to BACK. Backlog 17. Synthesis R8 clock: 5/5 FULL → R9 next (queue-jump).
