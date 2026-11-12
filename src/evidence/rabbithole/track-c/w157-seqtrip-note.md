# W157exec — sequential tripwire spec (C; backlog-W136)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 1 sandbox frontier, floor)
- Spec: fire at first t≥2 with running-mean < θ; max-wait {8,8,16} per difficulty (W137 rule); θ=0.5 (+θ=0.55 arm on hard); vs fixed-window reference; 2000 trials/cell.
- Delay collapses: easy 2.3 (vs 8), med 2.7 (vs 8), hard 2.7–4.0 (vs 16). Escapes fall: easy 0.002, med 0.04 (vs 0.115), hard 0.03–0.09 (vs 0.282). Sequential dominates fixed on everything except the one thing fixed was buying: false quarantines — easy 0.03 (vs 0), med 0.11–0.12 (vs 0.009), hard 0.40–0.70 (vs 0.064).
- The exchange rate (hard, θ=0.5): −0.19 escapes for +0.33 false quarantines — each escape avoided costs ~1.7 false quarantines; θ=0.55 pushes to −0.25 escapes for +0.64 falseQ. Whether the trade clears depends on the falseQ-vs-escape cost ratio, which is UNPRICED — the θ knob slides along a frontier the costs must pick from (W149's lesson, re-applied).
- Adopted spec: sequential evaluation + per-difficulty max-wait backstop, θ=0.5 default, θ per difficulty left open pending cost ratios. Verdict USED (frontier + priced tradeoff + conditional adoption). No precursor, no conflict. Cost elicitation (false-quarantine vs escape prices; set θ per difficulty) spawned W153.

## Tangential (reasoning, 0 spend)
- Speed is never free; it just bills a different account. Sequential evaluation pays for its 4× faster alarms in false quarantines at exactly the rate the noise dictates — the frontier is physics, the operating point is economics. Waves that report one without the other are advertising.

## Spend / queue
- Spend: 0 + 0 + 1 frontier (floor). Consumed backlog-W136 removed; spawned W153 to BACK. Backlog 17. Synthesis R23 clock: 4/5.
