# Wave 342 (execution; backlog-W290 fix-generality bench) 2026-11-12
STOP RULE: stopped after 9-train fix-generality grid (seeds {7,11,13} x
{control,clamp,trunc} x 150 steps; s7 triple bit-identical vs w273).
1 direct + 1 tangential below. Spend: 0 + 0 + 9 runs. Script
scratch/track-c/w290-fix.js (w273 rig verbatim, acc logic kept exact for
receipt); grid scratch/track-c/w290-grid.json (saved post-hoc).

## Direct: the fix generalizes upward — s7 was the worst seed, not the lucky one

- RECEIPT: s7 triple bit-identical vs w273-grid.json (control .264/3772,
  clamp .741, trunc .745) — the verbatim-acc preservation (NaN-logit argmax
  quirk included) held; the bench is the confirmed bench.
- (a) CONFIRMED-UPWARD: s11 clamp .778 / trunc .782, s13 .769 / .769 — all
  finite, all ≥.7, all BEAT s7 (.741/.745). The fix doesn't just hold off
  seed 7; seed 7 was the floor. Generality with headroom, not borderline.
- (b) CONFIRMED: trunc-vs-clamp parity holds both seeds — Δ.004 (s11),
  Δ.000 (s13), Δ.004 (s7). The two fixes are interchangeable to ±.004
  everywhere measured: clamp (pad→0 keeps length, kills lookup) ≡ truncate
  (drops pads, shortens length). Mechanism corroborated: what matters is
  removing the OOV forward path, not how.
- (c) CONFIRMED-WITH-SPECK: control NaN onset step-1 all seeds (nv>0 at
  step 1 everywhere; accU frozen .264 all steps all seeds — W260's .264
  fixed point again). Speck owned: s13 step-1 nv=3756 vs 3772 (16 clean,
  converges to 3772 by step 25). Onset universal, count converges — one
  tensor's worth of seed-lottery in the first step, gone by 25.
- Verdict: USED-strong (w342-fix-note.md is this file). 3/3 pre-reg (one
  upward, one with speck) + receipt. The one-line fix ships off-seed.
  Spawned W307 (pad-length generality: PADN{2,3} x seeds — does the fix hold
  when pads dominate the window).

## Tangential: test the fix where it should be weakest, report where it's strongest (0-spend)

W290 went looking for the seed where the fix breaks and found the fix is
better everywhere else — s7 (the discovery seed) is the minimum. Discovery
seeds are often minima (discoveries happen where the effect screams) or
maxima (lottery); either way the discovery value is the least informative
number in the table. Rule: generality probes report the DISCOVERY seed's rank
among tested seeds, not just pass/fail — s7-ranks-last upgrades ".741 holds"
to ".741 is the floor." W307 probes the axis where the fix plausibly thins
(pad count: PADN 2–3, pads-as-majority).
