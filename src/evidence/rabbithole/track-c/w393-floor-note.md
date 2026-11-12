# Wave 393 (execution; backlog-W332 floor-generality, sandbox) 2026-11-12
STOP RULE: stopped after 32-cell floor grid (8-value receipt exact).
1 direct + 1 tangential below. Spend: 0 + 0 + run. Script
scratch/track-c/w332-floor.js (rig 50/50 line-verified from w315-taufloor.js,
runCellFloor branches verbatim); grid scratch/track-c/w332-grid.json.

## Direct: the floor is free where combo is valid, and fixes where it isn't — one priced corner

- RECEIPT: M45/match.05 combo+flrB FA+DET (8 values) exact vs w315-grid —
  the generality probe extends the paired design, doesn't rebuild it.
- (a) PASS: flrB FA ≤.05 in all 8 cells (.033/0/.037/.01/.023/.037/.013/
  .01) — everywhere combo was valid, and twice where it wasn't (combo FA
  .093→.033 and .073→0 at M45/match.05 — the floor REPAIRS invalid combo,
  not just preserves valid combo).
- (b) REFINED (missed by .003): DET dent 0 in 7/8 pairs — and .053 in the
  N2 corner (M45/match.05: .103→.05). The single dent sits exactly where
  combo was most invalid (FA .093): the floor charges .053 DET for fixing
  a broken FA. Dent-free where valid, priced where repairing — the bar
  missed by a hair, the story gained a clause.
- (c) PASS: M2880 all-8 identical (|Δ| = 0 to three decimals) — at 1/2880
  the max() never binds, the completion ships literally free. Generality
  holds at both ends of the M ladder (binds-and-fixes at 45, no-op at
  2880) and never binds wrongly at match.15 (4/4 identical — eh clears 1/M
  on its own there).
- Cheapest completion ships (with the N2 price owned): flrB = max(eh,1/M),
  no new tuning, zero dent where combo was valid, .053 where combo was
  broken. The form is whole.
- Verdict: USED with teeth (w393-floor-note.md is this file). Exact receipt
  + FA-fix twice + 7/8 zero dent + M2880 no-op + priced N2 corner.
  Spawned W349 (dent-corner pricing, sandbox: N{2,4,8,16} x M45/match.05 —
  where does the .053 N2 dent decay (dent-vs-N curve); does the FA-fix
  persist at every N; receipt vs W332).

## Tangential: repairs have prices, preservations don't

- The floor does two jobs and they price differently: where combo was
  valid the floor is invisible (dent exactly 0, seven times); where combo
  was broken the floor is a repair crew charging .053. Rule: never average
  the repair bill into the preservation audit — report "free where valid,
  priced where broken" as two lines, because the second line is the one
  that decides whether the completion ships (it does — .053 on a broken
  .093 is a bargain, and N80's identical repair was literally free).
