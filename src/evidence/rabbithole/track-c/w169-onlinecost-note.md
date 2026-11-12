# W169exec — online cost learning (B; backlog-W146)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 2 sandbox cost-worlds, floor)
- v1 (full shifts) died of easiness: misses ≈ 0, bills never teach, R̂ frozen — the world must be hard enough to bill. v2 (partial shifts s=0.3, R: 1→30 at t=1000, b=0.15): fixed (k3, 0.03) totals 9249 (pre 303, post 8946 — drift carnage); adaptive (table lookup on online R̂ + b̂, re-fit every 100 windows) totals 2531 — 3.7× cheaper. R̂ tracks 1.0 → 28.2 (true 30 ✓).
- Nuance (against interest): the winning move was the FIRST switch (k3→k1, for the world-type: partial shifts need sensitivity at any R), not the drift response — post-drift config stays k1 (corner solution, already max-sensitive). Drift tracking verified in R̂; the argmin didn't need to move. Fixed bled both ways: deaf by default (miss 0.66 at k3) and blind to the drift.
- Echo: miss 0.66 for partial shifts at the W128 default — the majority-vote wall (W148) reappears as threshold-deafness here. Partial shifts are the regime where every default goes deaf.
- Verdict USED (online learning 3.7× cheaper + R̂ tracks + corner nuance). No precursor, no conflict. Config-space coverage (richer space so drift moves the argmin interiorly; continuous-k; verify drift-response in config, not just R̂) spawned W163.

## Tangential (reasoning, 0 spend)
- v1's frozen R̂ is the experiment's own lesson: learning needs bills, bills need mistakes, mistakes need a world hard enough to make them. Too-easy evaluations don't just flatter — they freeze every adaptive mechanism and then get cited as "robust". Difficulty is the tuition; pay it.

## Spend / queue
- Spend: 0 + 0 + 2 cost-worlds (floor; v1 killed by easiness). Consumed backlog-W146 removed; spawned W163 to BACK. Backlog 17. Synthesis R25 clock: 4/5.
