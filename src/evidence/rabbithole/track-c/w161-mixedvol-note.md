# W161exec — mixed-volatility world (A; backlog-W139)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 1 sandbox 2D map, floor)
- Plane (revaluation r × noise q), rules delta/hebb/leaky-λ{0.2,0.5,0.8}, delayed recall of current truth, 200 trials/cell. Three territories + a chaos corner:
  - Noise corner (0, 0.2): averaging wins — hebb 0.933, leak-0.2 0.943 (best), delta 0.799.
  - Revaluation edge (0.2, 0): overwrite wins — delta 0.638 > leak-0.8 0.632 > hebb 0.535.
  - Interior diagonal: THE MIXED RULE WINS OUTRIGHT — leak-0.5 takes (0.2,0.2) at 0.601 (delta 0.586), leak-0.8 takes (0.05,0.05) at 0.776 (delta 0.767). The compromise isn't a compromise; it's the champion of the mixed world.
  - Chaos corner (r,q ≥ ~0.3 jointly): all rules 0.50–0.55 — memory futile, nothing to match. The plane has an edge beyond which the only correct rule is "don't bother".
- λ* pattern: optimal leak rises with r and falls with q — but with level effects ((0.05,0.05)→λ0.8 vs (0.2,0.2)→λ0.5 defies the simple r/(r+q) ratio). The surface needs fitting, not eyeballing.
- W140's typology survives the joint world: pure corners reproduce the pure results; the interior adds the third regime rather than blurring the two. Verdict USED (2D map + interior winner + λ* pattern + chaos corner). No precursor, no conflict. λ*-surface fit (map optimal leak over the plane; test λ*≈r/(r+q); locate chaos edge) spawned W156.

## Tangential (reasoning, 0 spend)
- Purity wins the corners, mixture wins the middle, and chaos wins the far field — the plane grades on a curve with three different teachers. Any debate between two pure rules is a debate about which corner you're standing in; step into the middle and the argument dissolves into a dial.

## Spend / queue
- Spend: 0 + 0 + 1 map (floor). Consumed backlog-W139 removed; spawned W156 to BACK. Backlog 17. Synthesis R24 clock: 2/5.
