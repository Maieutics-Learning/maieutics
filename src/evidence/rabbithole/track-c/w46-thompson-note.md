# W46exec — Thompson-sampling per-item adaptive hint controller (Group B; backlog-W43)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + sandbox toy, floor)
- Controller: per item, K hint levels as Beta arms (α=β=1 start). Each round: sample each arm, play argmax, observe solve/fail, α++/β++. Ports EESD's Thompson-Beta draft-count controller (W29) from draft-count to hint-level — the executable difficulty-gated fade (continuous-fade design's mastery gate H).
- Toy (worker, seeded): 20 items, 4 levels, 200 rounds: Thompson 3521 vs uniform 1865 rewards, lift +0.414. Direction solid; magnitudes toy (true p 0.9/0.3 assumed).
- Verdict USED (design + toy). No precursor, no conflict. Priors upgrade spawned W60 (seed α/β from skill-bank mistake records, W22 — cold-start fix).

## Tangential (reasoning, 0 spend)
- Mastery gate H (continuous-fade design) now has an algorithm, not just a threshold: play the sampled-best hint level per item, promote on posterior. Same posterior also drives adaptive probe testing (W45 next-item selection) — one controller, two uses.

## Spend / queue
- Spend: 0 + 0 + sandbox toy (floor). Consumed backlog-W43 removed; spawned W60 to BACK. Backlog 17. Synthesis R5 clock: 1/5.
