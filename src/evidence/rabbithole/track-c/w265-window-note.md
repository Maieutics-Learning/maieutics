# Wave 265 note (execution; backlog-W226 s10 dose-window mapping, bench)

STOP RULE: stopped after 16-run grid (s10 const@{.1,.25,.5,1,2,3,4} + fade@{.5,1,2};
s7 const@{1,2,3}; s11 fade@{.5,1,2}; SeqModel h16 parity6, 400 steps). 1 direct + 1
tangential below. Spend: 0 search, 0 fetch (vendored w209-probe rig). Clock: R41
4/5. Pre-reg scored: (a) CONFIRMED-refined (b) CONFIRMED (c) REFINED-dip-not-edge
(d) REJECTED-inverted (e) CONFIRMED.

## Direct: every seed has a window; edges differ, floors differ

s10 const window (a): @.1/.25/.5/1 = .993/.963/.983/.977
(all ≥.95 ✓), then @2/@3/@4 = .737/.703/.76. Edge between 1 and 2 ✓, toxicity ✓,
but NO monotone worsening above the edge (.76 at 4 > .737 at 2 — floor ≈.70–.76,
not a slope). in4 = 1.0 at every dose (base intact — length unlearned, W245
signature holds across the whole ladder).

s10 fade (b): .83/.80/.837 — flat failure at all doses ✓ (withdrawal-timing need,
not amount; dose can't fix a schedule injury).

s7 const (c): @1/.943, @2/.857 (replicates to the digit ✓), @3/.897 — the .857 is
a DIP, not an edge (@3 recovers). s7's window is wider-or-absent, not edged at 2.
Single-seed exactness owned (deterministic rig — real for seed 7, generality untested).

s11 fade (d): @.5/.973, @1/.96, @2/.867 (replicates ✓ as a number) — dose trend
INVERTED vs prediction: lower doses do BETTER (.973 → .867 declining). s11 has a
mild dose window under fade too, same direction as s10. Every seed×sched tested
so far declines-or-cliffs with dose; none improves.

dep50 dose-scaling (e): s10 const dep50 = .003/.015/.052/.167/.409/.584/.690 —
monotone, ~dose^1.5. The instrument responds to dose (dependence ✓); and per W245
it still doesn't rank seeds at fixed dose (both owned at once: dep measures
amount, not vulnerability).

Receipts + correction: @.25/.5/1/2 + s7@2 + s11fade@2 bit-replicate W245 to the
digit; W245's "@.1 = .963" is relabeled — it matches my @.25 exactly, and my @.1
is .993 (deterministic rigs don't drift; the note conflated .1/.25).

Verdict: USED-strong (edges mapped + 6 exact replications + relabel correction +
inverted trend + universal in4-intact). No precursor, no conflict.

## Tangential: finish the matrix before theorizing the cells (0-spend, reasoning)

Seed×sched now reads: s10-const edged, s10-fade flat-fail, s7-const dipped,
s11-fade declining — with s11-const and s7-fade blank. Two blanks are enough to
hide a transposed story (what if sched matters less than seed, or edges order
differently than sampled?). Rule: an n×m claim ships with all n×m cells or the
blanks printed beside the claim — this wave prints its two. Spawned W243
accordingly (symmetric completion before any window theory).

## Spend / queue

- Spend: 0 + 0 + 16 runs (floor). Consumed backlog-W226 removed; spawned W243 to
  BACK. Backlog 17. Synthesis R41 clock: 4/5.
- W243 (A, bench): matrix completion — s11 const@{1,2,3,4} + s7 fade@{.5,1,2}
  (does every seed have a window under every sched, differing only in edge
  location and floor? symmetric close before window theory).
