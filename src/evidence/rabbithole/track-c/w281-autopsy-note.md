# Wave 281 note (execution; backlog-W239 frozen-point autopsy, bench)

STOP RULE: stopped after 4-run autopsy (nativepad PADN=1 vs control, seeds
7/10, h16 300 steps; full diagnostics at 300 + LRx10 +100 unpadded unstick
with +25/+50/+100 evals + final diagnostics). 1 direct + 1 tangential below.
Spend: 0 search, 0 fetch (vendored w222 core + diagnose()). Clock: R44 2/5.
Pre-reg scored: (a) REJECTED, REFINED (b) CONFIRMED-stronger (c) REJECTED.

## Direct: the corpse is 100% NaN; NaN is absorbing under Adam

Diagnostics at 300 — nativepad (both seeds, identical): accU .264; 100% NaN
weights (nanWFrac = 1.0, weightNorm = 0.0); 100% NaN logits; 3768 NaN grads;
predDist [0,0,0,0] (no class predicted — argmax-over-NaN determinism, not a
constant circuit). Control (s7/s10): accU .722/.769; predDist spread
[46,59,41,70]/[66,66,28,56]; margin 2.11/2.35; gradNorm 2.2/2.28; weightNorm
9.9/9.8; zero NaN anywhere.

(a) REJECTED: outputs are not constant-class — every logit is NaN. The .264
"fixed point" is argmax() over all-NaN returning index 0 deterministically
landing on the class prior. Constant-output, saturated-gates, dead-gradient
theories all die to the same count: there is no circuit left to diagnose.
(b) CONFIRMED-stronger: no usable gradient — 3768/3768 grads NaN both seeds.
Owned artifact: the .1768 finite gradNorm is probe fiction (my sm() scrubbed
NaN logits to 0 before backward); the live training signal is entirely NaN.

Unstick (c) REJECTED: LRx10 +100 unpadded moves NOTHING — accU .264 at
+25/+50/+100 both seeds, diag400 bit-identical to diag300 (gradNorm .1768,
nanGrads 3768, to the digit). NaN is an absorbing fixed point under Adam at
any LR (NaN momentum stays NaN). "What first breaks .264": nothing here
breaks it — the breaker cannot be a learning-rate; it must come from
outside the optimizer (re-init, clipping before onset). The recovery probe
(W222: 18/18 flat) is now explained, not just recorded.

Verdict: USED-strong (total-NaN autopsy with counts + absorbing-fixed-point
kill + artifact owned). No precursor, no conflict.

## Tangential: diagnose the corpse before resuscitating it (0-spend)

Two waves tried to revive .264 (W222 recovery, this wave's unstick) and both
printed zeroes — but only the autopsy explains WHY zeroes were the only
possible output (nothing to resuscitate: no weights, no grads, no logits).
Resuscitation attempts without a cause-of-death are slot-machine pulls; with
one, a single attempt suffices to close the door. Rule: no second rescue
wave without a first autopsy wave — and the autopsy's child is prevention,
not a bigger rescue (W256: NaN-onset timing + grad-clip prevention).
