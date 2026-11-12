# Wave 286 note (execution; backlog-W243 matrix completion, bench)

STOP RULE: stopped after 7-run completion grid (s11 const@{1,2,3,4} + s7
fade@{.5,1,2}; SeqModel h16 parity6, 400 steps; vendored w209 rig). 1 direct +
1 tangential below. Spend: 0 search, 0 fetch. Clock: R45 1/5. Pre-reg scored:
(a) CONFIRMED (b) CONFIRMED-directionally (c) CONFIRMED-with-exception (d)
CONFIRMED.

## Direct: the matrix closes; one cell has no window

s11-const (a): hard4 @1/.953, @2/.98, @3/.953, @4/.993 — flat-high, no edge
in 1..4 ✓. s11's window under const is everywhere, highest dose best.
s7-fade (b): @.5/1.0, @1/.957, @2/.92 — declining with dose ✓ (same direction
as s11-fade .973→.867; fade@2 ≤ fade@.5 both seeds).
(c): windows nonempty for both new rows (maxes .993/1.0 ✓) — but the
COMPLETED matrix refutes the universal-window hypothesis in its strongest
form: s10-fade flat-fails (.83/.80/.837, no passing dose). Every seed has a
window under CONST (s10 edged, s7 dipped, s11 everywhere); fade grants
windows to s7/s11 (declining) and NONE to s10. Windows differ in EXISTENCE,
not just edge/floor — withdrawal-timing need is a window-denier, not a
window-shifter. (d): in4 = 1.0 all 7 cells ✓ — base intact universally, the
fourth straight wave.

Dose-direction asymmetry (un-pre-regged, owned): under const s11 IMPROVES
with dose (.953→.993 @4 best); under fade both s7/s11 DECLINE (1.0→.92,
.973→.867); s10-const CLIFFS (.977→.737). Same dose axis, three signs —
dose has no direction, only seed×sched cells do.

Verdict: USED-strong (matrix closed + universal-window refuted-with-address
(s10-fade) + dose-direction asymmetry). No precursor, no conflict.

## Tangential: a completed matrix promotes the blanks to findings (0-spend)

Before this wave the claim was "every seed declines-or-cliffs with dose"
with two blanks printed. The blanks are filled and the claim splits three
ways (improve / decline / cliff) — the printed blanks did their job: they
located exactly where the generalization would break. Rule: print blanks
beside every n×m claim AND pre-register which blank would break it hardest
(here: s11-const, the improve-direction cell). W260 audits the mechanism on
saved dep trajectories (late-dependence injury) before any new dose runs.
