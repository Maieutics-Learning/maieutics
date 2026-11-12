# Wave 264 note (execution; backlog-W225 LR x rescue map, sandbox)

STOP RULE: stopped after 36-cell grid (LR{.01,.05,.2} x {sgd,adam,signsgd} x
{natural,pow1.5,pow2,pow3} x 20 seeds, same toy+seeds, 1500 steps). 1 direct + 1
tangential below. Spend: 0 search, 0 fetch (vendored w208 + LR param). Clock: R41
3/5. Pre-reg scored: (a) CONFIRMED-refined (b) REJECTED (c) CONFIRMED-twist (d)
CONFIRMED. Receipt: lr.05 column replicates W244 cell-for-cell (sgd-pow2 strand
20, adam-pow3 .6/70/420, signsgd all-flip medFlip 20).

## Direct: LR moves the strand boundary; rescue has casualties; Adam strands too

(a) SGD-pow2 rescued at LR.2: flip 0→1.0, medFlip 10 (jump-over-zero ✓) — but the
settle cost is DIVERGENCE, not slowness: 2/20 strand + NaN finals (meanFinal NaN —
runs flip THEN blow up). Rescue with casualties. SGD-pow3@.2 only .25 flip
(4 strands + NaNs) — pow3's trap survives even big steps.

(b) REJECTED: LR.01 does NOT strand SGD-pow1.5 (flip 1.0, medFlip 60 — just
slower). The zero-trap needs k>1 AND an exact landing; small steps cross pow1.5
gradually without ever landing on 0. No strand boundary in LR for pow1.5 at
.01 (strand=0).

(c) Adam-pow3 cliff is LR-dependent with a twist: LR.01 strands it ENTIRELY
(0 flip, 20/20 exact-0) — Adam CAN die in the zero-trap when it arrives gently
(normalization doesn't save a slow arrival). LR.05 partial (.6, 8 strands);
LR.2 flips 1.0 (medFlip 10, settle 50, meanFinal -.771, 2 strands). Strand
boundary in LR for Adam-pow3: {.01: dead, .05: partial, .2: alive}. Adam-pow2@.01
barely crawls (medFlip 1050/1260 — alive but on the edge).

(d) signsgd flips 1.0 in all 12 cells ✓, but settle is destroyed by LR: .01
settles 220–380; .05 pow3 never settles (-1); .2 three modes never settle
(medSettle -1) while meanFinals sit ≈-1.05 — fixed ±.2 steps dither across the
.1 band forever. Flip-rate 1.0 with settle-rate 0: magnitude-blindness buys the
flip and sells the landing.

Strand map (exact-0 finals): sgd strands pow2 @.01/.05 (20/20), pow3 @.01/.05
(20/20); adam strands ONLY pow3 (20/8/2 across LR); signsgd never strands.
The zero-trap is an (optimizer × LR × k) cell property, not a geometry property —
same pow2 geometry: SGD dies (.01/.05), Adam flips, signSGD flips, SGD jumps (.2).

Verdict: USED-strong (36-cell map + receipt + rescue-with-casualties +
Adam-strands + dither mechanism). No precursor, no conflict.

## Tangential: the trap is about arrival speed, not depth (0-spend, reasoning)

Fast arrival (LR.2) jumps over zero; slow arrival (LR.01) dies in it — across
OPTIMIZERS (SGD-pow2 rescued by speed; Adam-pow3 killed by gentleness). The
zero-grad trap reads like a depth ("vanishing gradient") but behaves like a
speed gate: what matters is the step size at the crossing, not the gradient
magnitude far away. Spawned W242 accordingly (fate decomposition + approach
trajectories: is there a critical approach speed?).

## Spend / queue

- Spend: 0 + 0 + 720 runs (floor). Consumed backlog-W225 removed; spawned W242
  to BACK. Backlog 17. Synthesis R41 clock: 3/5.
- W242 (C, sandbox): strand-mechanics — SGD-pow2@.2 fate split (flip-then-diverge
  vs never-flip: NaN-onset distribution, grad-clip rescue?); Adam-pow3@.01
  creep-into-trap trajectories (step size at approach); critical-approach-speed
  test (does crossing survive iff step-at-zero > trap width?).
