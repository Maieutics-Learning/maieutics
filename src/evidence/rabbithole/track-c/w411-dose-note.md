# Wave 411 (execution; backlog-W347 dose-fine + seed-split, bench) 2026-11-12
STOP RULE: stopped after 5-cell dose grid (4 new + 1 anchor, 3 slices;
receipt exact). 1 direct + 1 tangential below. Spend: 0 + 0 + 5 cells-worth
(5x1000-step arms, 3 page_eval slices). Script
scratch/track-c/w347-dose.js (rig 98/98 line-verified from w330-crater.js);
grid scratch/track-c/w347-grid.json (receipt re-checked field-by-field in
the rebuild — a naive whole-object stringify said FAIL on key order
alone; owned: compare fields, never serializations). WIND-DOWN: no spawn
(backlog drains 4->3). Clock R66: 1/5.

## Direct: no healthy ladder dose exists in {4,6,8,10,12,14,16} — the hunt closes 0/7

- RECEIPT: (24,8,15,0) all-fields bit-identical vs w313-grid (t1000=1,
  l24=.9767, traj all 1.0). RIG CHECK ONLY — free by determinism, owned
  in the pre-reg; it confirms the instrument, and the seed-15 heal stands
  exactly where W313 left it (which is why the hunt below stays on
  seed 10, where the crater lives).
- (a) FAIL = finding: l24 across new doses {.577, .647, .610, .647} —
  none ≥.95 (nearest miss .647, a full .30 short). Folded with W330's
  {8:.513ish, 12:.5133, 16:.6267}: the full seven-dose ladder reads
  {.577, .647, .55, .610, .513, .647, .627}-class — cratered everywhere.
  Healthy-dose hunt closes 0/7. The charter question ("ANY healthy dose
  below/above") answers NO with the denominator attached.
- (b) PASS: every dose splits — t1000−l24 = {.420, .293, .350, .307},
  all ≥.25. Split width is non-monotone in dose (widest at 4, dip at 6,
  peak at 12 per W330) — dose does not price the split.
- (d) PASS: rescue-order holds — t1000 (.9967/.94/.96/.9533) ≥ l24 at
  every new dose. t1000-first survives even where t1000 itself craters.
- Verdict: USED with teeth. Closed hunt (0/7) + universal split + order
  + receipt. NO SPAWN (wind-down).

## Tangential: t1000 has its own dose-response, bottoming at the crater dose (0-spend)

t1000 across dose {4:.9967, 6:.94, 8:.8367, 10:.96, 12:.9133, 14:.9533,
16:.9967} is U-shaped with its minimum exactly at aw8 — the dose worst
for the ladder is worst for t1000 too. The mechanisms split recovery
order (rescue-order rule) but SHARE a worst dose. Rule:
full-set-denominator — a hunt ends with the count over the whole probed
set (0/7 here), never with the nearest miss; and worst-dose-agreement
(shared minimum) ships alongside split-order, not instead of it — two
curves, one x-axis, same bottom. (Owned: aw6 t1000=.94 means t1000-first
is not t1000-immune — the hierarchy's top rung craters too, just
shallower and narrower.)
