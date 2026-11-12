# Wave 391 (execution; backlog-W331 sub-.05 bisection, sandbox) 2026-11-12
STOP RULE: stopped after 12-cell fine-w grid (2 anchor receipts exact).
1 direct + 1 tangential below. Spend: 0 + 0 + run. Script
scratch/track-c/w331-break.js (rig 109/109 line-verified from w314-break.js);
grid scratch/track-c/w331-grid.json.

## Direct: no interior address — the "break" is a bar crossing a smooth grade

- RECEIPT: w=0 both policies exact vs w280 + w=.05 both policies exact vs
  w314-grid (all 7 fields x4) — the bisection extends the confirmed break
  grid, doesn't rebuild it.
- obf claimRate: .0131 / .0132 / .0141 / .0163 / .0181 / .0197 — monotone
  grade (+.8/+8/+24/+38/+50% over null). fut: .0106 / .0103 / .011 / .0127 /
  .0137 / .0155 — monotone (+46% at .05, never reaches the bar). The first
  +50% crossing sits AT .05 (the edge), not inside (0,.05).
- (a) REJECTED: no break address interior — the rise is smooth across the
  whole interval (increments +.0001/+.0009/+.0022/+.0018/+.0016, no jump).
  W314's "breaks at .05" is the +50% bar crossing a grade, not a structural
  address — the bar made the break, not the mixture.
- (b) PASS: w=.01 holds (obf +.8%, fut −3% — within 15% of null both).
  The grade starts flat, then steepens — concave-up onset, not instant.
- (c) PASS: canary holds for both policies (both rise monotone; obf leads
  fut at every w>0, same order as at .05). Headroom-canary confirmed at
  fine w — the bar-setter rises first and stays ahead throughout.
- Verdict: USED with teeth (w391-break-note.md is this file). Dual-anchor
  receipt + smooth grade (no address) + flat .01 onset + canary leads both
  policies. Spawned W348 (canary-specificity + grade-smoothness, sandbox:
  tax-I12 x w{.01,.02,.03,.04,.05} both policies — non-canary flat while
  canary grades; ladder-I12 obf2dir x w{.015,.025,.035} — smooth between
  probes or stepped; receipts vs w280 + W331).

## Tangential: a threshold is not an address until the curve earns it

- "+50% at .05" printed as "breaks at .05" — then the fine grid showed the
  curve crossing the bar the way a ramp crosses a contour line: no kink,
  no jump, just arrival. Rule: a break claim needs a SHAPE (jump, kink,
  acceleration past the bar), not a crossing — any monotone grade crosses
  every bar somewhere, and that somewhere is the bar's address, not the
  system's. Quote the grade with the crossing, never the crossing alone.
