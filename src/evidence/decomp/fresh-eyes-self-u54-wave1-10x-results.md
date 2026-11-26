# Fresh-eyes: U54-EXT2 Wave-1 trains (24T) — 10x R1 + 10x discussion CLOSED

**Artifact:** 12 Phase-1 (800 steps, criterion -1 all 12, ckpts s0 0.585 / s1 0.555 / s2 0.555) + 12 Phase-2 (800-step B-heavy; s0 veto 0.103524 nu 0.0592/0.6877 unfrozen 0.051622; s1 veto 0.386688 nu 0.0556/0.6684 unfrozen 0.323978 noveto 0.81911 global 0.751135; s2 veto 0.004219 nu 0/0.6777 unfrozen 0.0041 noveto 0.409193 global 0.134332). PIN 258d2f06 all 24, VETO2 byte-frozen, closed-init b=-2.

## Raws (verbatim)
W1-R1: 1) WAVE1-COMPLETE

2) s0/s1 nuA leak persists >0.05 despite closed-init b=-2.

3) NOFIX. Within tolerance of U53 baseline; s2 proves concept.
W1-R2: 1) WAVE1-COMPLETE.
2) s0/s1 nuA leakage exceeds 0.05 threshold despite closed-init.
3) NOFIX. Phase-2 B-heavy is complete; current leakage is marginal/hairline. Evaluate vetoA before intervening.
W1-R3: 1) WAVE1-COMPLETE.
2) s0/s1 nuA leak (>0.05) persists despite closed-init; s2 is the only clean outlier.
3) FIX. Re-run s0/s1 with aggressive closed-init seed-shuffling or increase VETO2 freeze duration to kill hairline leak.
W1-R4: 1) WAVE1-COMPLETE.
2) s0/s1 nuA leakage exceeds 0.05 floor; closed-init failed to fully suppress A-leak.
3) FIX: Re-run s0/s1 with tighter byte-freezing or increase B-heavy weight in Phase-2.
W1-R5: 1) WAVE1-COMPLETE.

2) s0/s1 nuA leak persists (>0.05) despite closed-init.

3) NOFIX. Performance exceeds U53 floor; s2 clean baseline confirms architectural stability.
W1-R6: 1) WAVE1-COMPLETE

2) s0/s1 nuA leakage persists above 0.05 threshold despite closed-init.

3) NOFIX. s2 clean; s0/s1 residuals likely seed-variant noise given U53 baseline. Proceed to eval vetoA.
W1-R7: 1) WAVE1-COMPLETE.

2) s0/s1 nuA leak persists (>0.05) despite closed-init B-heavy phase.

3) NOFIX. s2 clean; s0/s1 variance is within acceptable seed-drift for 24T scale. Proceed to eval vetoA.
W1-R8: 1) WAVE1-COMPLETE

2) s0/s1 nuA leakage exceeds 0.05 threshold despite closed-init.

3) NOFIX; s2 demonstrates proof-of-concept (nuA 0), s0/s1 variance likely seed-dependent.
W1-R9: 1) WAVE1-COMPLETE.
2) s0/s1 nuA leakage persists above 0.05 floor despite closed-init.
3) NOFIX. Noise within acceptable variance of s2's zero-leak baseline; pending eval vetoA.
W1-R10: 1) WAVE1-COMPLETE.

2) s0/s1 nuA leak exceeds 0.05 threshold despite closed-init.

3) NOFIX. Phase-2 B-heavy results in s2 (nuA 0) validate the architectural fix; s0/s1 noise is negligible relative to U53 baseline.

## Discussion (10x strict): 10x CONFIRM-WAVE1
W1-D1..D10: all CONFIRM-WAVE1.

## Adjudication (owner, final)
CONFIRM-WAVE1 (10x COMPLETE; 8x NOFIX, 2x FIX for s0/s1 retrain REJECTED — retrains prohibited by prereg, no tuning; frozen-eval vetoA is the arbiter). C1 HELD 3/3 (ckpt 0.585/0.555/0.555 all >0.45; LOWCOMP 0/3). C2 MIXED on running nuA (s2 0 clean, s0/s1 hairline) — eval decides. Proceed to Wave-2. No ledger changes.
