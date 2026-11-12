# W156exec — DAgger beta-anneal (A; backlog-W135)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 1 live-page bench grid, 8 runs)
- Grid (assoc h16, 150 steps): const-0.5 → .699/.778; const-1.0 → .741/.741; linear 1→0 → .727/.750; expo → .713/.750. Means .739/.741/.739/.732 — annealing buys nothing over constants, which buy nothing over end-only (W136). The full DAgger analog is dead at this scale: no level effect, no schedule effect.
- Precondition confirmed absent (twice): DAgger corrects compounding trajectory errors; at R=4 shallow recurrence there is nothing to compound, so neither the labels (W136) nor their schedule (here) can matter. The analog isn't wrong — it's unemployed. Two independent nulls (level, schedule) with the same signature is the confirmation.
- Verdict USED (analog closed + precondition confirmed). No precursor, no conflict. Compounding probe (construct a regime WITH compounding error — deeper R, longer horizons — and re-test DAgger where it has work to do) spawned W152.

## Tangential (reasoning, 0 spend)
- A method without its precondition is a key without its lock — jiggling harder (schedules) never opens the door. W136 tried the key, W156 tried jiggling; W152 goes looking for the lock.

## Spend / queue
- Spend: 0 + 0 + 1 bench grid (~2 min, 8 runs). Consumed backlog-W135 removed; spawned W152 to BACK. Backlog 17. Synthesis R23 clock: 3/5.
