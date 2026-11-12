# Wave 358 (execution; backlog-W303 ridge-top continuity, sandbox) 2026-11-12
STOP RULE: stopped after 192-world seam grid (caps{.97,.98,.99,1.0} x MS x
pT{.7,.8} x t x seeds; receipt cap1.0 exact vs w286). 1 direct + 1 tangential
below. Spend: 0 + 0 + run. Script scratch/track-c/w303-seam.js (w286 rig
verbatim); grids scratch/track-c/w303-grid.json, w303-summ.json.

## Direct: the seam is (.95,.97] — the diagonal dies in a 0.02 gap, and the price flips sign

- RECEIPT: cap1.0 cells EXACT vs w286-grid (net/nab/kstar, all arms).
- (a) REJECTED: ridgeM = 1.0 at .97/.98/.99 both pT — no diagonal to extend.
  The ladder lacks .97–.99 rungs, but that is not the reason: even m.95
  (nearest live rung) loses everywhere in the seam (diffs −.010→−.025,
  0/24 wins). The diagonal doesn't continue past .95 — it ends there.
- (b) REFINED-earlier: last live win is cap.95 (m.95: 8/24 +12/24 wins,
  diff +.0004/+.0015 — the thinnest live win on record), forfeit from .97
  (0/24 everywhere, both pT, all four seam caps). The seam is (.95,.97],
  found BELOW the swept range, not inside it. Full live-win ladder: 20/24
  (.85) → 12–20/24 (.9) → 8–12/24 (.95) → 0/24 (.97+) — wins decay to the
  seam, then stop.
- (c) REFINED (letter holds, spirit breaks): kMed-at-ridge is monotone
  non-decreasing into the seam (pT.7 .24→null; pT.8 −.38→+.52→null) — but
  it CLIFFS, not glides. Off-ridge m.95 kMed flips sign across the seam
  (pT.8 −.38→+.52; pT.7 +.24→+.57): the meter goes from paid-to-play to
  paying-to-lose exactly where winning stops. The price curve terminates
  in forfeit (null = free-by-tie), it doesn't converge. Mechanism of the
  seam, priced.
- Verdict: USED with teeth (w358-seam-note.md is this file). Seam
  localized to a 0.02 gap BELOW the sweep + price-sign-flip mechanism +
  diagonal scoped (ends .95); pre-regs corrected with better addresses.
  Spawned W320 (seam-bisection {.955,.96,.965}: gradual or step death).

## Tangential: sweep the gap the ladder implies, not just the range chartered (0-spend)

The charter swept .97–1.0 (above the last KNOWN live cap .95) and found
uniform forfeit — the finding was one rung below the sweep, in the gap
between .95 (last known live) and .97 (first swept). A sweep that starts
above the boundary can only confirm one side. Rule: when bracketing a
transition, the first cells go in the GAP between the last live and first
dead addresses (.955–.965 here), not beyond the dead one; the seam lives
between evidences, never past the last one. W320 bisects (.95,.97).
