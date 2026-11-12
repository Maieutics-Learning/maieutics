# W48exec — adaptive probe testing (Group B; backlog-W45)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + sandbox toy, floor)
- Next-item rule: probe the item with max posterior uncertainty (Thompson arms nearest α≈β), subject to difficulty match (don't probe far above/below estimated ability — IRT discipline, W31). Stop probing an item when its posterior concentrates; stop the probe phase when marginal calibration gain < teaching gain (budget schedule spawned W62).
- Toy (worker, seeded): 30 items, 60 probes: uncertainty-first err 0.0 vs random 0.067. Direction solid; magnitudes toy.
- Verdict USED (design + toy): one controller (W46) drives teaching levels AND probe selection. No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- Probe-then-teach is the eval twin of draft-then-verify (W29): spend a little inference to pick the highest-value next step, then commit. Same controller, same math, both phases.

## Spend / queue
- Spend: 0 + 0 + toy (floor). Consumed backlog-W45 removed; spawned W62 to BACK. Backlog 17. Synthesis R5 clock: 3/5.
