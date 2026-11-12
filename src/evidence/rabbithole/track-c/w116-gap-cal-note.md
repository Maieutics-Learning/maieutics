# W116exec — gap-threshold calibration (C; backlog-W102)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + sandbox toy, floor)
- Table (head 0.95/0.8/0.65 × abs-0.15/rel-20%, 20 eroding + 20 healthy each): abs vs rel nearly identical everywhere (2.8/3.5, 4.9/5.0, 6.8/6.7); zero false alarms. Threshold FORM doesn't matter — head difficulty dominates (easy alarms gen ~3, hard ~7).
- Rule: keep absolute 0.15 (simpler, equal); stratify EXPECTATIONS by task difficulty instead of tuning the number (easy: expect ~3; hard: expect ~7). Don't tune the dial; calibrate the watch.
- Verdict USED (table + keep-simple rule). Difficulty-stratified alarm windows spawned W119. No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- The calibration that says "stop calibrating" is the best kind: abs-vs-rel was a distinction without a difference, and the table proves it. Tuning a number that doesn't matter is the quietest way to waste precision.

## Spend / queue
- Spend: 0 + 0 + toy (floor). Consumed backlog-W102 removed; spawned W119 to BACK. Backlog 17. Synthesis R16 clock: 5/5 FULL → R17 next (queue-jump).
