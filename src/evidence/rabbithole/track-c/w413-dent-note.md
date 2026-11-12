# Wave 413 (execution; backlog-W349 dent-corner pricing, sandbox) 2026-11-12
STOP RULE: stopped after 16-cell dent grid (8-value N=2 receipt exact).
1 direct + 1 tangential below. Spend: 0 + 0 + run. Script
scratch/track-c/w349-dent.js (rig 50/50 line-verified from w332-floor.js,
re-verified post-driver-append); grid scratch/track-c/w349-grid.json
(written by driver; receipt field 0). WIND-DOWN: no spawn (backlog drains
2->1). Clock R66: 3/5.

## Direct: the dent decays to zero by N8, and the FA-fix holds at every N

- RECEIPT: N=2 M45 both regimes combo+flrB FA+DET (8 values) exact vs
  w332-grid (recMax 0 — paired seeds, pure threshold effects).
- (a) PASS: dent-vs-N at M45/match.05 reads .053/.050/0/0 across N{2,4,8,
  16} — non-increasing from the priced corner, ≤.02 at N16 (exactly 0).
  The decay is a step between N4 and N8, not a glide. match.15 dents 0
  at all N (no repair needed, none charged).
- (b) PASS: FA-fix persists — flrB FA {.033,.030,.027,.020} (match.05)
  and {.023,.027,.030,.027} (match.15), all ≤.05 at every N. The floor
  repairs wherever combo is invalid, at any N.
- (d) PASS: repair-bill shrinks — dent@N16 (0) ≤ dent@N2 (.053). Corner
  pricing confirmed: the fee exists only in the small-N corner.
- Verdict: USED with teeth. Decaying dent + persistent fix + receipt.
  NO SPAWN (wind-down).

## Tangential: the breakage grows while the repair stays flat (0-spend)

Combo FA in match.05 reads .093/.113/.123/.120 — combo's invalidity
DEEPENS with N (tighter se, lower bar, more false fires) — while flrB
FA reads .033/.030/.027/.020, flat-to-improving, and the dent goes
.053→0. The repair doesn't track the breakage: worst breakage (N16,
.120) ships with zero dent. Rule: price-repair-not-breakage — quote the
repair curve and the breakage curve as separate lines; a flat repair
against growing breakage is the completion's best advertisement, and
averaging them would hide exactly the contrast that sells the form.
(Receipt family: the N=2 anchors are the receipt for the corner; the
N16 zeros are the receipt for the flat.)
