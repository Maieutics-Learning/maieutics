# Wave 383 (execution; backlog-W324 length-matched clamp, bench) 2026-11-12
STOP RULE: stopped after 12-cell clamp grid (2 slices; receipts held).
1 direct + 1 tangential below. Spend: 0 + 0 + 12 runs. Script
scratch/track-c/w324-clamp.js (w307-pad.js rig 271/271 line-verified, modes
rebuilt: old-clamp verbatim, clampLM appends PADN zeros); grid
scratch/track-c/w324-grid.json.

## Direct: length-matching moves accU by ~.01 — and PADN3 dips in all three seeds

- RECEIPT (three-legged): s7 old-clamp @PADN1 traj bit-identical vs
  w307-grid (the only PADN1 clamp row W307 ran) — verbatim rig confirmed;
  s11/s13 old-clamp finals .778/.769 match the published W307 clamp values
  exactly; clampLM@PADN1 == old-clamp@PADN1 bit-identical all 3 seeds
  (construction entailment — same single zero, same stream, same string).
- (a) PASS: length-matching moves accU ≤.024 everywhere (lm finals s7
  .741/.755/.731, s11 .778/.796/.778, s13 .769/.764/.745 vs old-clamp
  .741/.778/.769) — all finite, nv=0 all 12 cells (0 is in-vocab; no OOV
  poison at any zero-count).
- (b) REFINED (bar missed by .004): zero-count dose range is .024 (s7) /
  .018 (s11) / .024 (s13) — not within the pre-reg'd .02, but an order
  below the fix-vs-control gap. And the miss has a shape: PADN3 < PADN2 in
  ALL three seeds (−.024/−.018/−.019) and ≤ PADN1 in 2/3 + tie. A
  consistent −.02 PADN3 dent, flagged not claimed (n=3 — W341 decides).
- (c) PASS: s7 bit-identical + 3/3 entailment-identical + published-value
  agreement — the bench is the confirmed bench at every PADN.
- (d) PASS trivially: nv=0 in all 12 cells — zeros never poison, at any
  count (the OOV-embedding kill needs a real OOV index, and 0 isn't one).
- Verdict: USED with teeth (w383-clamp-note.md is this file). Triple
  receipt + bounded movement (≤.024) + consistent PADN3 dip flagged +
  zero-count poison ruled out. Spawned W341 (clamp-seed extension, bench:
  clampLM PADN{1,2,3} x seeds{17,19,23} + old-clamp@PADN1 anchors — does
  the PADN3 −.02 dip replicate on fresh seeds (n=6 seed-mean); receipt
  anchors vs W324).

## Tangential: a mover that barely moves is still a mover

- W307's rule said constants replicate by entailment and movers earn the
  grid — clampLM reads PADN and earned its 9 runs, and the grid paid back:
  a ≤.024 envelope with a consistent −.02 dent at the top count. The
  entailment-first discipline doesn't mean movers always move a lot; it
  means the runs are spent where movement is possible. Rule: the receipt
  tells you where NOT to spend (constants); the mover grid tells you how
  much the axis is worth (≈.02 here — priced, not assumed).
