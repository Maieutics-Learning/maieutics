# W174exec — rescue-action design (C/A; backlog-W150)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 2 sandbox builds, floor)
- Killed branch (recorded): v1 (w150-rescueaction.js) built actions with baked-in profiles (hint defined with zero false-cost AND higher yield — defined to win, proved nothing) and missed the base anchor (.87 vs .478: margin gated clarity, but most low-clarity cases are still benefitters). Tautology + anchor miss → scrapped, mechanics rebuilt.
- v2 (w150b-routed.js): transparent mechanics (HARM=1.5 documented; gate FIXED at W154 best profile — 53% of harmed, 0 false — identical across arms; harmed carry W72 shape types scattered .5/leaned .3/shaky .2). Arms, means over 6 seeds: base .4925; retrieval .5467; uniform-CF .5363/.5488/.5498/.5529/.5581 (yields .4–.7); uniform-abstain .5481/.5444/.5389/.5296 (κ 0–.5); routed (scattered→retrieval, leaned→CF, shaky→abstain) .5409/.5481/.5481/.5492/.5502 across CF-yields @κ=0; κ-sensitivity ≈ −.002 per .25.
- Structural results: (1) at the selective gate ALL treatments tie within ±.005 — selectivity caps treatment stakes (W154 confirmed one level up: targeting dominates treatment; substitutes, not additives). (2) Routing ≈ uniform and loses to a dominant uniform treatment (routed-CF.7 .5502 vs uniform-CF.7 .5581 — abstain-on-shaky + retrieval-on-scattered drag the average when CF yield is high). Routing only helps when treatments are correctly matched AND no treatment dominates. (3) Break-even map: abstain beats retrieval iff κ ≲ .2; CF beats retrieval iff yield gap ≳ +.1 (linear in the gap, as the arithmetic demands — paired routed−retrieval deltas +.0063/+.0074/+.0025/−.0012/−.0037/−.0025, mean +.0015, sign 3–3).
- Verdict USED (substitutes result + matching boundary + priced break-evens). No precursor, no conflict. Loose-gate treatment test (treatment stakes under greedy gates; false-cost dominance) spawned W167.

## Tangential (reasoning, 0 spend)
- A selective gate is a stakes-destroyer: every case it correctly excludes is a treatment comparison that no longer matters. The treatment debate is downstream of the gate — argue thresholds first, treatments only with what the gate leaves behind.

## Spend / queue
- Spend: 0 + 0 + 2 sandbox builds (1 scrapped). Consumed backlog-W150 removed; spawned W167 to BACK. Backlog 17. Synthesis R26 clock: 3/5.
