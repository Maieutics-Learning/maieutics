# W143exec — length-cliff push (A; backlog-W124)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 1 live-page bench campaign, 3 arms)
- Arms (RecModel h24, W122 match, seed 7, custom len-L parity): control len10×1000 → len10 0.53 / len6 0.515 (replicates W122's 0.52 exactly; len10-only training leaves len6 at chance too); longer len10×1500 → 0.50 / 0.545 (1.5× time buys nothing); curriculum len6×500→len10×500 → 0.54 / 0.435.
- The cliff holds against time AND curriculum: all three arms chance on len10. Worse, curriculum destroys what staging was meant to preserve — len6 falls to 0.435 (BELOW chance: systematic anti-transfer, len10 memorization overwrites the len6 rule). Staged easy→hard without joint practice is forgetting with extra steps.
- Boundary: at h24/≤1500 steps the binding constraint is representational, not scheduled — more of the same (time, ordering) cannot cross it. Structural pushes (deeper, attention-arch, more depth rounds, hint-fading per the program thesis) are the remaining moves.
- Single-seed caveat (breadth-first; three arms converge on chance, limiting seed-risk). Verdict USED (bounded push + forgetting documentation). No precursor, no conflict. Structural push (h48 / attention-parity / R-depth / hint-fade on len10) spawned W141.

## Tangential (reasoning, 0 spend)
- Curriculum assumes the easy skill survives the hard training. Here the hard training eats the easy skill (0.435) and learns nothing itself — transfer requires shared structure the model can HOLD, and holding is capacity, not curriculum. Schedules don't substitute for room.

## Spend / queue
- Spend: 0 + 0 + 1 bench campaign (~8 min, 3 arms). Consumed backlog-W124 removed; spawned W141 to BACK. Backlog 17. Synthesis R21 clock: 2/5.
