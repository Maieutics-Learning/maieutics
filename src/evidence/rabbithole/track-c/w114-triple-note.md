# W114exec — tie-fraction reporter (A; backlog-W100)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + sandbox toy, floor)
- F-new logging format (executable spec): every topsim claim reports {N, tieFracMsg, tieFracMean, rhoMid, pPerm(B=199), verdict} with verdict rule — compositional iff p<0.05 and rho>0.5; lean iff p<0.05 and rho≤0.5; holistic/absent iff p≥0.05.
- Demo (seeded, N=40): {40, 0.88, 0.88, 0.929, 0.005} → "compositional". The row is the claim; anything less is a rumor.
- Verdict-threshold calibration (0.5 rho boundary) spawned W117.
- Verdict USED (format + executable demo). No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- The trail's evidentiary standards are now a stack: permutation default (W73), tie triple (W94/W114), masked loss (W97), capacity-before-optimization (W80), stratify-by-sign (W101). Five rules that all say the same thing — distrust the number until the meter has been audited.

## Spend / queue
- Spend: 0 + 0 + toy (floor). Consumed backlog-W100 removed; spawned W117 to BACK. Backlog 17. Synthesis R16 clock: 3/5.
