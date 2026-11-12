# W92exec — family-misdiagnosis cost (C/A; backlog-W82)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + sandbox toy, floor)
- Confusion matrix (300 items, classifier weakest on leaned): overall fix 0.497 vs oracle 0.700 vs random-family ~0.34 (W72). Diagnosis pays even noisy.
- Key asymmetry: leaned→retrieval fixes at 0.11 — BELOW generic mismatch (0.25). Feeding facts to a confidently-wrong student entrenches the lean; it harms. leaned→distractor 0.20, shaky→counterfactual 0.26 (neutral-ish).
- Rule: under leaned/scattered uncertainty, default to COUNTERFACTUAL (challenging a scattered student still helps; feeding a leaned one harms). Safe-default direction is asymmetric — errors have a cheap side and an expensive side.
- Verdict USED (matrix + asymmetry + safe-default rule). Safe-default audit (counterfactual-as-default harm check) spawned W99. No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- Hippocratic teaching: first, do not entrench. The router's worst failure isn't a wasted question — it's a question that makes the student MORE wrong. Every teaching policy needs its harm audit, not just its help audit.

## Spend / queue
- Spend: 0 + 0 + toy (floor). Consumed backlog-W82 removed; spawned W99 to BACK. Backlog 17. Synthesis R12 clock: 5/5 FULL → R13 next (queue-jump).
