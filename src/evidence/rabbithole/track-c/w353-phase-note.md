# Wave 353 (execution; backlog-W299 schedule-phase probe, sandbox) 2026-11-12
STOP RULE: stopped after 30-run phase grid (dm700 off=0 receipt 9 fields x6
+ off{-100,-50,+50,+100} x 6 seeds; pure phase shift, 2 resets each; w265
online2 verbatim + one phased-deadman line). 1 direct + 1 tangential below.
Spend: 0 + 0 + run. Script scratch/track-c/w299-phase.js; grid
scratch/track-c/w299-grid.json.

## Direct: pre-boundary resets kill s66-B; sub-grid offsets are phantoms

- RECEIPT: dm700 off=0 9 fields x6 vs w265-grid, all exact.
- (a) REFINED (direction matters): s66-B 8.25 -> -100: 0.45 (killed, -95%)
  vs +100: 3.1 (halved, not killed). Pre-boundary reset (600, clean A1
  window, enters D1 with fresh in-phase estimates) beats post-boundary
  (800, pays 100 steps of stale-config drift first). The reset should LEAD
  the boundary, not chase it. W333's "s66 fix = schedule-phase" CONFIRMED
  with direction.
- Sub-grid offsets are PHANTOMS (owned rig finding): off=-50 bit-identical
  to off=0 on every bill field (all 6 seeds), off=+50 bit-identical to
  +100. Resets at 650/750 fall in audit-tick shadows (no tick in
  (650,700)/(750,800)) — the state reconverges before the next tick, so
  the extra reset is literally invisible. The schedule's phase granularity
  IS the audit grid (100): offsets below it are no-ops, not small effects.
  Charter {-100,-50,+50,+100} effectively tested {-100,0,+100} x2.
- (b) HOLDS: valley survives — meanTot base 4.165, -100: 3.23 (-22%,
  IMPROVES), +100: 3.968 (-5%). K=700 valley is phase-wide on the pre side.
- (c) REJECTED-inverted: total(+100)=3.968 > total(-100)=3.23 — pre beats
  post; no D2-echo penalty (-100's 1300 reset is fine). Boundary asymmetry
  instead: at D1-onset lead<chase<straddle (0.45/3.1/8.25), at D2-offset the
  order flips toward straddle-best (A2: base-1400 0.465 < -100-1300 0.85 <
  +100-1500 0.91 — re-learning a FAMILIAR regime favors the straddle,
  entering a NEW regime favors the lead).
- (d) HOLDS-technically: +off arms log 0 A1 resets with exA1 = base
  exactly (0.255) — the needless A1 reset costs ~0 in A1 (no drift to
  mistime); skipping it buys nothing either. All phase action is B/A2.
- Verdict: USED with teeth (w353-phase-note.md is this file). s66 killed
  prospectively by pre-phase (-95%, valley improved) + inversion (pre>post)
  + phantom-offsets (granularity = audit grid) + boundary-type split.
  Spawned W316 (phase-response map {-200..+200} + onset/offset split).

## Tangential: a schedule's phase resolution is its finest sampling grid (0-spend)

A reset between two audit ticks changes no learning state the next tick
can see — it spends an alarm and buys nothing, bit-exactly. Rule: phase
arguments must resolve ABOVE the rig's sampling grid (here: offsets in
multiples of auditEvery=100) or they test the grid, not the phase; and a
"small effect" that is bit-EXACTLY zero is a structural no-op, not a weak
signal — check shadows before averaging. W316 stays on-grid ({-200,-100,
0,+100,+200}) and prices onset-vs-offset separately.
