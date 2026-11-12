# Wave 373 (execution; backlog-W316 phase-response map, sandbox) 2026-11-12
STOP RULE: stopped after 30-cell offset grid (dm700 off{-200,-100,0,100,200}
x 6 seeds; receipt clean vs w265). 1 direct + 1 tangential below. Spend:
0 + 0 + run. Script scratch/track-c/w316-phase.js (rig 170/170 line-verified
from w299-phase.js); grid scratch/track-c/w316-grid.json.

## Direct: -100 wins pooled, scatters per seed — the valley is an average, not an address

- RECEIPT: off=0, 9 fields x6 exact vs w265-grid — the map extends the
  validated rig, doesn't rebuild it.
- Pooled (meanTot): -200: 8.36 / -100: 3.23 / 0: 4.165 / +100: 3.968 /
  +200: 5.933. A1: .512/.332/.255/.255/.255 (far-lead pays pre-drift
  alarms). B: 6.01/2.05/3.45/2.80/4.72. A2: 1.84/.85/.465/.91/.96.
- (a) PASS-pooled, REFINED-per-seed: -100 is the pooled min (3.23; -200
  overshoots catastrophically to 8.36 — earlier lead pays 200 steps of
  stale-config drift). But per-seed tot-best scatters: -100 on 3/6 (s33,
  s55 tied, s66), 0 on 2/6 (s11, s44), +100 on 1/6 (s22). The -100 optimum
  is a pooling artifact (fourth instance of the pooled-misleading family:
  W310's inversion, W311's mean-tie, W308's stream-wobble) — it wins the
  average while losing 2-3 seeds outright.
- (b) PASS with a flip: asymmetry persists at both distances (pre ≤ post
  mirror: 3.23<3.97 and 8.36>5.93 — hmm, far-lead WORSE than far-chase).
  The lead-side overshoot penalty (stale drift before the boundary) exceeds
  the chase-side penalty (stale drift after it): -200 explodes via B
  (6.01, s11-B 14.13) while +200 degrades evenly. Asymmetry holds, magnitude
  doesn't mirror — lead errors compound, chase errors add.
- (c) MIXED: D2-offset straddle-best holds 4/6 (s22/s33/s55/s66; dissents:
  s11 lead, s44 chase-far); D1-onset lead-best holds only 3/6 (s33/s55/s66;
  dissents: s11/s44 straddle, s22 chase). The W353 split survives as a
  pooled tendency with per-seed dissent on BOTH sides — onset is the weaker
  half (3/6), not the stronger.
- s66 (the spawn seed): -200 nearly matches -100 on B (1.25 vs 0.45) then
  loses on A2 (2.07 vs 0.66) — far-lead's 1900 reset misconfigures the
  return. Tot 3.35 vs 1.14.
- Verdict: USED with teeth (w373-phase-note.md is this file). Pooled optimum
  confirmed + per-seed scatter priced + asymmetry with unmirrored magnitude +
  onset/offsplit scored 3/6 + 4/6. Spawned W333 (far-lead autopsy, zero new
  sims: s11-B@-200 = 14.13 — stale-config drift 500→700 priced via settleB/
  alarmT; which seeds share the far-lead penalty; pre-drift drift vs
  post-reset misconfig).

## Tangential:score the pooled winner per seed before crowning it (0-spend)

-100 "wins" 3/6 seeds and ties a fourth — a plurality, not a law. Rule:
  every pooled optimum ships its per-seed argmin table (who wins where, by
  how much); an optimum that loses 2-3/6 outright is a recommendation with
  a roster, not a setting. (Fifth instance of slice-before-pool: the habit
  now covers optima, not just comparisons.) W333 inherits the habit
  (far-lead penalty per seed, not pooled).
