# Wave 298 (execution; backlog-W253 tau-coarseness ladder, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).

- DIRECT: hetero-cap C=.1 coarseness ladder (w219b mechanics verbatim, same seeds; script
  scratch/track-c/w253-coarse.js; grid w253-grid.json). Harness replicates W277/W219b EXACTLY
  (pooled-constant .0132 GO, oracle .0032, price .01, pooled-tau .0094 @tau.15 capture .386) — (d) HOLDS.
- LADDER (capture of the .01 price): per-dep (40 knobs) .0032 / 1.001 — (a) HOLDS, tauCounts
  {0:31, 1:8, .04:1} bit-replicating W277 (cap.6 SKIP, rest GO, one d9 at .04); per-QUINTILE
  (5 knobs, cap levels) .0032 / 1.001 — (b) HOLDS, FULL capture with 5 knobs, taus
  {.6:1, .65:.04, .7:0, .75:0, .8:0} preserving the GO/SKIP switch per level; per-HALF
  (2 knobs, d<20 vs d>=20) .0077 / .556 — (c) HOLDS, breaks as predicted, lo-bin compromises
  at tau .2 between SKIP-optimal cap.6 and GO-optimal cap.65/.7 deps.
- PRICE OF COARSENESS per step: 40->5 knobs FREE (1.001->1.001); 5->2 costs .0045
  (capture 1.001->.556); 2->1 (pooled tau) costs .0017 more; 1 tau->0 (constant) .0038 more.
  The level-shift needs exactly one knob per dirt level — 5, not 40, not 2. (Whether the .65:.04
  is distinct from 0 or grid noise decides 5-vs-fewer; W270 asks.)
- Verdict: USED-strong (w298-coarse-note.md is this file). Spawned W270 (minimal-knob set).
- TANGENTIAL (reasoning, 0 spend): the ladder's shape is the finding, not just its top —
  FREE then CLIFF (40->5 nothing, 5->2 halves capture) means the knob count is set by the
  WORLD's level count (5 dirt levels), not by statistics: coarseness is safe down to the
  world's own joints, fatal one step past. Rule: coarsen along the world's levels (cap here),
  never across them (index halves cut through .7 and paid .0045 for it); the right bins are
  ontological, not statistical. W252's warning composes: a pooled tau that "works" (capture
  .386) is not capturing — it is averaging; capture .556 at 2 bins is the same averaging with
  better PR.
- Spend: 0 + 0. Clock: R47 2/5.
