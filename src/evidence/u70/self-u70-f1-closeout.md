# U70-F1 Wave 1 closeout — verdict F1-PERSISTS (both arms, 2026-11-27)

Execution: owner "execute it (both with and without the anneal)" = execution on F1 v1.1 (F1a, gated) + owner-arbitrated exploratory F1b (v1.0 floor+anneal, descriptive only — arbitration recorded: battery's attributability objection stands for the gated verdict, F1b answers the owner's emergence question separately). Driver `u70-neural.js` (floor/anneal opts, linear interpolation locked: repw(e)=0.3·min(e+1,100)/100). 40/40 rows, 0 invalid. Ledgers: `d-u70-neural-f1a-wave1.json`, `d-u70-neural-f1b-wave1.json`.

## F1a (floor 0.05 only, GATED): F1-PERSISTS
ctx 0.927 / delay-med 6 / probe **0.621** (7/20 ≥0.70) / gap **0.0015** (0/20 ≥0.05) / KL raw **0.021** (0/20 above 0.25 AND 0/20 above 0.05). Probe fail → PERSISTS per locked boundaries.

## F1b (floor 0.05 + anneal, EXPLORATORY): same shape, no emergence
ctx 0.927 / probe 0.628 (8/20) / gap 0.0012 (0/20) / KL raw 0.021. Arms identical to each other and to Wave-1 V3 (0.927/0.616/0.0017/0.11).

## Reading
The owner's emergence hypothesis is answered, negatively and cleanly: the combo arm behaves EXACTLY like the single-variable arm. No hidden interaction — because there is nothing to interact with: raw KL (0.02) sits under even the lowered 0.05 floor, so KL gradients are still ~zero in both arms. The posterior collapses onto the prior (q≈p, tiny KL) while usage stays high — the model uses all four categories across time but believes nothing per trial beyond what h already says. Opening the gate wider did nothing because no pressure is pushing through it: with repw 0.1–0.3 against head-driven q, the KL terms are spectators. The flaw is not the floor value — it is that nothing in the objective rewards q≠p. That is F2's territory (force the policy to read z-only), as pre-classified.
