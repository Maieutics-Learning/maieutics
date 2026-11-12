# Wave 260 note (execution; backlog-W222 pad-cliff edge hunt, bench)

STOP RULE: stopped after 72-run grid (PADN{0,1,2,3} x {control,nativepad(+recovery),
truemask} x seeds 7-12, h16 300 steps + 100-step unpadded recovery on all 18
collapsed nativepad models; live-page TinyNN assocR rig). 1 direct + 1 tangential
below. Spend: 0 search, 0 fetch (vendored w205 at charter h16 + recovery probe).
Clock: R40 5/5 FULL. Pre-reg scored: (a) CONFIRMED-stronger (b) REJECTED-collapse
(c) CONFIRMED (d) CONFIRMED.

## Direct: one pad is fatal; the corpse doesn't revive

Edge (a): PADN=1 nativepad accU = .264 EXACTLY, all 6 seeds (HU .245, X .164 —
identical to P2/P3 to 3 decimals). The cliff edge is at ONE pad, and the floor is
a fixed point: every seed, every load ≥1 collapses to the same constant
(.264/.245/.164). Pre-reg said ≤.45; the cliff said chance, immediately.

Mechanism (b): recovery adjudicates COLLAPSE, unanimously — 18/18 collapsed
models read .264 at +25/+50/+100 unpadded steps (54 checkpoints, zero movement:
not .265 anywhere). A pad-dependent circuit would re-route within 100 steps at
train LR; these weights are destroyed, not misdirected. Attention-theft
REJECTED as the mechanism (the probe it deserved got built in its place —
attention-mass via mask-aware forward is infeasible: pads are excluded from the
attention map by construction, mass identically 0; owned substitution).
Exact-flatness is the evidence it is stuck, not slow: no gradient signal moves
any of 18 models off chance in 100 steps.

Receipts: (d) P0 all-modes bit-equal per seed (floor holds); control accU
bit-identical across all 4 PADN batches per seed (no train drift); (c) truemask
≈ control at every load (.772/.756/.763 vs .764 — the W240 mild-help bonus
persists at P1 +.008, 4th sighting, still a flag).

The .264 fixed point: constant-output attractor (all seeds converge to it, no
variance at all — collapse erases seed identity). Micro-cause (dead vs
saturated vs gradientless) unopened — W239 owns it.

Verdict: USED-strong (edge at 1 + unanimous mechanism + receipts + fixed-point
characterization). No precursor, no conflict.

## Tangential: build the probe the question deserves, not the one it names (0-spend, reasoning)

The charter asked for attention-mass; the rig made that number identically zero
by construction. Running it anyway would have printed 18 zeroes and called it
evidence. When the named diagnostic is structurally blind, substitute the
decisive version of the same question (pad-dependent circuit vs destroyed
weights) and record the substitution with its reason — a blind diagnostic run
for completeness is worse than no diagnostic, because zeroes look like data.
Spawned W239 accordingly (frozen-point autopsy + one unstick attempt).

## Spend / queue

- Spend: 0 + 0 + 72 runs + 18 recoveries (floor). Consumed backlog-W222 removed;
  spawned W239 to BACK. Backlog 17. Synthesis R40 clock: 5/5 FULL.
- W239 (A, bench): frozen-point autopsy — logit-margin + gradient-norm +
  weight-norm diagnostics on collapsed nativepad vs control at 300 (constant
  output? saturated gates? dead gradients?) + one unstick attempt (LR×10, +100
  unpadded): what first breaks .264, and does the breaker restore accuracy or
  just leave chance differently.
