# W154exec — rescue-threshold tuning (C/A; backlog-W133)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 1 sandbox frontier, floor)
- Sweep (rebuilt W133 toy, 400 cases): margin τ ∈ {0.2, 0.35, 0.5} × {margin-only, combined} × rescue-yield {0.45, 0.7}. Nets (yield .45): margin .5425/.5225/.4625 (recall .53/.63/.78, false 0/13/46); combined .5375/.5350/.5050 (recall .41/.47/.50, false 0/3/15).
- Selectivity beats rescue quality 4–8×: lowering τ 0.5→0.2 gains ≈0.08 net; raising yield 0.45→0.7 gains ≈0.01–0.02 everywhere. False rescues (lost benefitters) dominate the economics, not missed harm — the residual is expensive to touch, cheap to leave.
- Conjunction re-scoped: at well-chosen low τ, margin-alone already has ZERO false rescues — the AND buys nothing (0.5425 vs 0.5375). The conjunction is a high-τ safety (τ=0.5: 0.505 vs 0.4625), not a universal upgrade. W133's lesson stands, bounded: combine when greedy, skip when selective.
- Best cell: margin-only τ=0.2, net 0.5425 (yield .45) / 0.5625 (yield .7) vs always-default ≈0.478. Verdict USED (frontier + selectivity rule + conjunction bound). No precursor, no conflict. Rescue-action design (WHAT rescues better than retrieval — raise yield structurally, not parametrically) spawned W150.

## Tangential (reasoning, 0 spend)
- The most selective rule wins by doing the least: rescue 0 false, catch half the harm, bank +0.06. Restraint scales; enthusiasm hemorrhages benefitters. Every intervention budget should be spent on thresholds first, treatments second — targeting dominates dosing here 4-to-1.

## Spend / queue
- Spend: 0 + 0 + 1 frontier (floor). Consumed backlog-W133 removed; spawned W150 to BACK. Backlog 17. Synthesis R23 clock: 1/5.
