# Wave 408 (execution; backlog-W345 notch-travel + edge-fill, bench) 2026-11-12
STOP RULE: stopped after 10-cell grid (slices [0,5],[5,10]; receipts + dup
exact). 1 direct + 1 tangential below. Spend: 0 + 0 + 10 cells-worth
(10x400-step arms, 2 page_eval slices). Script
scratch/track-c/w345-notch.js (rig 83/83 line-verified from w328-edge.js;
driver appends 10-cell list; header said 9 — owned: 6+2+anchor+dup = 10);
grid scratch/track-c/w345-grid.json. WIND-DOWN: no spawn (backlog drains
6->5).

## Direct: the 1.5-notch does not travel — it is seed-local geometry

- RECEIPT: s10@1.5 anchor {1,1,1,1} bit-identical vs w328-grid.json row
  (all 4 readouts); same-eval dup bit-identical. The bench is the bench.
- (a) FAIL: s7 shows a left-shoulder dip (.95 @1.25, 1.0 @1.5, .993 @1.75)
  — clean point present but the right side never gets sick; s11 is flat
  healthy everywhere (.997 @1.25, .997 @1.5, 1.0 @1.75) — no notch at all.
  The clean-at-1.5 point exists on 2/3 seeds but the notch SHAPE (sick
  both sides) exists on 0/3. Travel refuted; s11's flat ladder is the
  refutation, not a null.
- (b) FAIL-half: s10 @1.375 = .883 (sick, interior probe doesn't reach
  clean) but @1.625 = 1.0 (clean). The s10 clean region is a PLATEAU
  [1.5,1.625], not a point — combined with W328 (sick @1.75), the notch
  on s10 is ≥.125 wide on the right and <0.25 (clean @1.625, sick @1.75).
- (c) PASS: easy ceiling — in1/in4 = 1.0 in all 10 cells (hidden-sick
  pattern holds across seeds: sickness only ever on hard).
- (e) PASS: determinism — dup bit-identical (travel was the only
  replicate; same-seed reruns carry no information, confirmed by
  construction of the design).
- Verdict: USED with teeth. Notch-locality established (s10 plateau,
  s7 left-dip-only, s11 flat) + receipt + dup + ceiling. NO SPAWN
  (wind-down).

## Tangential: one-sided dips are sliding addresses, not points (0-spend)

s7's dip is left-only (.95 @1.25, .993 @1.75): had we probed only
{1.25, 1.5} we would have named a notch at 1.5 on s7; the right-side
fill dissolves it into a shoulder. Rule: travel-needs-two — a clean
point on one seed is geography until a SECOND seed shows the same
shape, and every shape claim ships both sides filled (a one-sided dip
is a sliding address). Boundary note, owned: pre-reg (a) demanded
hard1 < .95 and s7@1.25 read exactly .950 — a strict-inequality miss
by .000. Thresholds that bite exactly at round numbers should be
priced as ≤ with margin, not <: the boundary is where the biology
lives. (Receipt family: s11's flat ladder is the receipt for what
didn't travel.)
