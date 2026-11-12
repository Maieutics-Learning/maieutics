# W58exec — component-level message-effect, per-hint-position (Group A; backlog-W53)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + sandbox toy, floor)
- Protocol (extends W38 swap-Δ): ablate each hint position (zero it), measure accuracy drop vs full; rank positions by drop. Causal slots show large drops, inert slots ~0. Uses EOS-zero convention (W69) for masking.
- Toy (worker, seeded, 200 items, 4 slots, ground-truth causal {0,2}): drops [0.26, 0, 0.26, 0], ranking [0,2,1,3] — recovers the causal set exactly. Direction solid; magnitudes toy.
- Verdict USED (design + toy): the mechanism-hinge instrument (which hint slots carry lookup). Feeds F-mech (NMD-style slot analysis) + F-shortcut (shallow = low-drop slots). Spawned W70 (position×level Thompson matrix). No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- Drop-ranking is gap-MI (W37) in causal form: gap-MI measures dependence, ablation measures consequence. F-new logs both (dependence + consequence per slot).

## Spend / queue
- Spend: 0 + 0 + toy (floor). Consumed backlog-W53 removed; spawned W70 to BACK. Backlog 17. Synthesis R7 clock: 1/5.
