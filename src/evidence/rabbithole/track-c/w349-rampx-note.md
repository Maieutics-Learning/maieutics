# Wave 349 (execution; backlog-W296 ramp-timing + extreme-dose, bench) 2026-11-12
STOP RULE: stopped after 7-cell bench (2 receipts + 5 new: (16,1,10) ramp
{100,250,1000} + aw8 x (16,10)/(24,10); masked-attn parity6, 1000 steps).
1 direct + 1 tangential below. Spend: 0 + 0 + bench. Script
scratch/track-c/w296-rampx.js; grid scratch/track-c/w296-grid.json.

## Direct: any ramp heals (window under 100 steps); aw8 splits by group (W vs U-then-down)

- RECEIPT: 2 overlap cells bit-EXACT vs w279-grid.json (every field incl
  traj + b10) — the bench extends the validated rig, doesn't rebuild it.
- (a) REJECTED-inverted: ramp SHORTER heals MORE — ramp100 t1000 1.0
  (traj 1.0/1.0/1.0, edges all-pass) > ramp250 .9833 > ramp500 .99 ~~
  ramp1000 .9933 (t1000 recovers but the traj craters .49/.36 early, and
  mid-ladder stays damaged l14 .61/l16 .60). Even a 100-step ramp heals
  fully vs constant-dose .83: the injury needs full dose from ~step 1, and
  ANY delay suffices. Injury window localized to the first ~100 steps
  (micro-ladder W313 goes below).
- (b) SPLIT by group: (16,8,10) t1000 1.0, edges all-pass — aw8 HEALS the
  aw4 hole (.85/<10). Dose sequence aw.25-8: 1.0/1.0/.83/1.0/.85/1.0 =
  down-up-down-up, a W (TWO holes: aw1 + aw4, healed between and after).
  (24,8,10) t1000 .8367, edge <10 (l10 .82) — aw8 RE-INJURES massively
  (aw4 was .9967/edge-16). U-then-down confirmed: the late force is real
  at (24,10) and steep (.9967 -> .84).
- (c) Follows (b): the two-force stretch is dead in BOTH groups — neither
  is U-then-flat. (24,10) wants a third late-acting force (healer loses
  again past aw4); (16,10) wants two superimposed injuries (or an
  oscillator) — a W is not a U with noise, it is two holes. Both
  force-fits must be rebuilt, separately per (h,seed) address.
- Verdict: USED with teeth (w349-rampx-note.md is this file). Receipts +
  ramp inversion (window <100 steps) + group-split aw8 (W vs late-force) +
  two-force stretch killed twice; pre-regs (a) inverted, (b) split, (d)
  held — both corrections are the finding. Spawned W313 (ramp-micro +
  late-force trace). Clock R55: 5/5 FULL — synthesis R56 due.

## Tangential: a sweep that heals twice is two sweeps (0-spend)

(16,10) visits 1.0 three times (aw.25/.5, aw2, aw8) with holes at aw1 and
aw4 — fitting one U through a W averages two injuries into one wide blur
and misprices both (the "hole dose" is bimodal: 1 AND 4). Rule: count the
minima before fitting the forces (one minimum = two forces; two minima =
three forces or an oscillator); a second hole past the first healing is
never the same injury returning, it is a second mechanism until proven
otherwise. W313 prices both (ramp-micro for injury #1's window, aw16 for
whether the W oscillates a third time).
