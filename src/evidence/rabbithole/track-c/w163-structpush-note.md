# W163exec — structural cliff push (A; backlog-W141)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 2 live-page bench arms)
- Arm attention-parity (AttnModel h16, len10, 400 steps): 0.48/0.495 — chance. The length-agnostic lookup architecture does no better than recurrence; the cliff isn't recurrence-specific.
- Arm R-depth (RecModel h24, R=8 vs R=4, len10 ×1000): 0.48/0.53 — chance. Doubling depth recurrence buys nothing; the cliff isn't depth-starved either.
- Tally of failed crossings: time ×1.5, curriculum, attention-arch, depth ×2 — four structural directions, all chance. Remaining untested: h48 width (expensive, deferred), and hint-fading (the program's own thesis — teach len10 hinted, then fade; needs parity hint machinery that doesn't exist yet).
- The cliff survives everything except the method the program was built on — which hasn't been tried on it. That asymmetry is now the finding: all generic-capacity pushes fail; the only untested move is the teaching move. Verdict USED (two structural nulls + remaining-moves map). No precursor, no conflict. Hint-fade on len10 (build parity hints + fade schedule; thesis applied to the cliff) spawned W158.

## Tangential (reasoning, 0 spend)
- Four nulls in four directions triangulate: the cliff is not about time, order, architecture, or depth — it's about the absence of teaching. Every failed push sharpens the same silhouette: nobody told the model the rule. Generic capacity keeps failing because the binding constraint was never capacity.

## Spend / queue
- Spend: 0 + 0 + 2 bench arms (~8 min). Consumed backlog-W141 removed; spawned W158 to BACK. Backlog 17. Synthesis R24 clock: 4/5.
