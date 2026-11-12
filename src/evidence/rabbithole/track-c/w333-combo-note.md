# Wave 333 (execution; backlog-W282 combo guard, sandbox) 2026-11-12
STOP RULE: stopped after 18-run combo grid (hybrid + dm700 receipts clean +
combo700 new x seeds{11..66}; w265 online2 verbatim + combo branch).
1 direct + 1 tangential below. Spend: 0 + 0 + run. Script
scratch/track-c/w282-combo.js; grid scratch/track-c/w282-grid.json.

## Direct: the gate spends more than it earns — scheduled wins alone

- RECEIPT: hybrid bit-identical to w231-grid (all 9 fields x6) and dm700 to
  w265-grid — the combo substrate is the confirmed substrate.
- (a) MISSES: combo exA2 ≤ dm700 on 3/6 (s11/s44/s55 tie; s22 .46>.29, s33
  .33>.29, s66 .40>.22 lose). The gate never improves A2 — at best ties.
- (b) MISSES: s66 exB 8.25 vs 8.25 — the boundary blowup is UNRESCUED. The
  gate's extra reset fires at 1900 (mid-A2, after the damage) and makes A2
  worse (.22→.40). The backfire is a scheduled-reset artifact the trigger
  cannot see: boundary-phased amnesia corrupts the B estimate, and no
  post-hoc alarm uncorrupts it.
- (c) HOLDS-AT-BAR: combo total ≤ dm700 on 4/6 (s22 wins 3.53<3.88; s33/s66
  lose; rest tie). The one earn is s22@500: a PRE-drift reset flushing stale A1
  estimates (same amnesia mechanism as W312's dm400 B-help). The two losses are
  IN-drift resets (s33@1100 B 3.37→3.7; s66@1900 A2 .22→.40).
- (d) MISSES-WIDE: combo alarms (2–3) < hybrid alarms (1–2) on 0/6 — the combo
  is the union, always ≥ both parents. Five triggered extras, one earn.
- DIRECTION (the wave's yield): reset value is PHASE-dependent — pre-boundary
  resets help (s22@500, dm400's B-help), mid-drift resets hurt (s33@1100,
  s66-boundary, s66@1900). The schedule fires blind to phase; the gate fires on
  symptoms, which lag into the drift — both mistime for opposite reasons. The
  s66 fix must be in the schedule (phase offset off the D1 boundary), not the
  gate. W312's price tag (+1 scheduled A1 reset buys −1.9 A2 excess) stands;
  the gate's tag is worse: +1 triggered reset buys ≈0 total, signed either way
  by phase luck.
- Verdict: USED with teeth (w333-combo-note.md is this file). Pure dm700 keeps
  the crown; the combo is shelved. Spawned W299 (schedule-phase probe).

## Tangential: unions of detectors inherit false alarms, not sensitivity (0-spend, reasoning)

OR-ing two detectors can only add fires; it earns its keep iff the added fires
land where the base detector is blind AND the blindness is fixable post-hoc.
Here the base (schedule) is blind by phase (boundary), and the blindness is
NOT post-hoc-fixable (B estimate already corrupted) — so the union adds cost
with no addressable gain. Rule: before OR-ing detectors, name the base's blind
cell and check the blindness is still live when the second detector fires; a
gate that fires after the damage is a meter, not a guard. W299 moves the
schedule instead (phase offset ±50/±100: is the valley K=700 wide in phase).
