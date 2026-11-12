# Wave 399 (execution; backlog-W337 seam-pT split, sandbox) 2026-11-12
STOP RULE: stopped after 96-world split grid + 48-world receipt anchor
(receipt exact). 1 direct + 1 tangential below. Spend: 0 + 0 + run. Script
scratch/track-c/w337-seam.js (rig 42/42 line-verified from w320-seam.js);
grids scratch/track-c/w337-grid.json, w337-summ.json. WIND-DOWN: no spawn
(backlog drains 14->13).

## Direct: the seam is a razor — pT.7 flips H2, pT.8 flips H3, adjacent .0025 halves

- RECEIPT: 48 .955 worlds exact vs w320-grid (net/nab/kstar, all arms).
  The split extends the validated seam grid, doesn't rebuild it.
- (a) PASS: pT.7 splits across the pin — ridge .95 live at .9525, degenerate
  1.0 at .955. Flip half: H2 = (.9525,.955]. Hairline detail: ridgeD at
  .9525 is exactly .0000 — the live ridge wins on a tie (MS order), so the
  flip happens ON the pin, not past it.
- (b) REJECTED (informative): pT.8 does NOT survive .9575 — ridge
  degenerate 1.0 (diff 0), flip half H3 = (.955,.9575]. The step dies within
  .0025 above the last live readout; the midpoint guess was one half-step
  too generous.
- (c) PASS: shifted step confirmed with adjacent halves — H7=2 < H8=3. The
  seam is not a cap and not a shared step: each pT carries its own .0025
  flip-half, ordered by pT. Two halves, no overlap, no gap.
- (e) PASS: pT.8 m.95 kMed(.9575) = .12, strictly interior between −.005
  (.955) and +.4133 (.96). The median crosses monotonically through the
  step — the interior holds no jump past both neighbors.
- Verdict: USED with teeth. Adjacent-half pins (H2/H3) + tie-on-the-pin +
  interior median + exact receipt. NO SPAWN (wind-down).

## Tangential: a boundary this thin is a schedule, not a setting (0-spend)

Both flips pin to adjacent .0025 halves with a tie exactly on one pin —
there is no cap value to "choose" here, only an order in which pTs fall.
Rule: when the flip-half width reaches the grid resolution, stop bisecting
and schedule (which pT falls in which half); further halves measure the
ruler, not the seam. (Resolution-habit family: W322's floor-not-feature —
the room above the readout runs out again.)
