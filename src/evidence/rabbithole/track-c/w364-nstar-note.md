# Wave 364 (execution; backlog-W308 N*-ladder across seeds, sandbox) 2026-11-12
STOP RULE: stopped after full N* table (4 kinks x s0–s3 bisection; double
receipt EXACT; 2 cells >8000 unmeasured). 1 direct + 1 tangential below.
Spend: 0 + 0 + run. Script scratch/track-c/w308-nstar.js (rig 102/102
line-verified; driver mine, arbitrated by receipts); grid
scratch/track-c/w308-grid.json.

## Direct: the budget breaks — two cells run past 8000 off the measured map

- RECEIPTS (double, exact): 48/48 ladders bit-identical vs w274 res (pA +
  zone — tapegen, order, and body stream all confirmed); s3 bisection
  10188/500/15516/3958 EXACT vs w291 bisect3 (bootstrap stream replay
  confirmed — the ext-loop replay was load-bearing: first attempt failed at
  mid.0034 9977-vs-10188 with the ext prefix skipped, passed with it).
- Table (mid.0034 / mid.0071 / narrow.0009 / narrow.0025): s0
  5540/5130/6008/6712; s1 7298/1409/>8000/1615; s2 2727/>8000/5921/4573; s3
  10188/500/15516/3958 (receipt).
- (a) CONFIRMED-decisively: N* is (kink × stream)-addressed. Spread within
  every kink (mid.0071: 500→>8000, ≥16×; narrow.0025: 1615→6712;
  mid.0034: 2727→10188); no uniform stream offset (s1 fast on narrow.0025,
  blind on narrow.0009; s2 fast on mid.0034, blind on mid.0071). Streams
  scatter, never shift.
- (b) REJECTED as stated: max-N* 15516 does NOT stand as the 4-stream
  resolving budget — s1 narrow.0009 and s2 mid.0071 both exceed 8000
  (unmeasured above the s0–s2 tape range). The budget is 15516 + two
  unknowns. The dissenter kink is slow on TWO streams (s3 15516, s1 >8000).
- (c) REFRAMED-to-pending: cheapest sufficient budget = table max, and the
  table has holes. s0's max-kink flipped across bootstrap streams (W323:
  mid.0071 6155; here: narrow.0025 6712 — point values wobble, the max is
  stream-drawn), so the budget must cover streams too, not just kinks.
- Verdict: USED with teeth (w364-nstar-note.md is this file). Addressing
  confirmed, budget broken with two priced holes, stream-wobble owned.
  Spawned W325 (s1/s2 tape extension to 16000 + bisection of the two >8000
  cells + receipt: do they die ≤16000; where does the 4-stream budget land).

## Tangential: a failed receipt that passes on retry is a finding about stream prefixes (0-spend)

First run failed ONLY the second receipt (ladder exact, s3 bisection off by
211 on one kink) — the signature of a stream-prefix skip, not a rig bug: the
ext loop's 64M draws were load-bearing state. Rule: when a pipeline shares
one bootstrap stream across phases, every phase's receipt must replay the
PREFIX (all prior phases' draws in order), not just its own phase — a
phase-local replay is a different stream wearing the same seed. Seeds name
streams only together with their full consumption history. (Second instance
of W306's window moral: state, like extrema, is positional.)
