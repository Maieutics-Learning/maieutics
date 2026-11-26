# Fresh-eyes: U56-EXT1b Wave-2 evals + verdict — 10x R1 + 10x discussion CLOSED
**Artifact:** 60 evals COMPLETE (d-newai-self-u56-eval-c{0,1,2}-s{0..19}.json) + verdict d-newai-self-u56-verdict.json = LEAK-FIXED (gate pass: E-EXT2 LICENSED, P5 REMAINS CLOSED until E-EXT2 ADVANCEs under B-heavy).
Means (20 fits/ckpt): c0 ckptAcc 0.585 ctxA 0.56 ctxB 1.0 ret 0.58 vetoA 0.0025 vetoB 0.9975 clean=1 ctx=1; c1 ckptAcc 0.555 ctxA 0.485 ctxB 1.0 ret 0.555 vetoA 0.0025 vetoB 0.9975 clean=1 ctx=0 (ctxA 0.485 < ckpt-0.03=0.525 — lone miss); c2 ckptAcc 0.555 ctxA 0.595 ctxB 1.0 ret 0.555 vetoA 0.0025 vetoB 0.9975 clean=1 ctx=1.
Bars: LEAK-PIN 3/3 LEAK-CLEAN 3/3 LEAK-CTX 2/3 LEAK-FLOOR 3/3 MISFIRE 0/3. Cause as filed.
## Raws (verbatim, 10x)
W2-R1..R10: verdict: CONFIRM-LEAK-FIXED / objection: NONE / NOFIX (all ten unanimous).
## Discussion (10x strict)
W2-D1: CONFIRM-FIXED: Quorum verified, leak closed. / D2: CONFIRM-FIXED / D3: CONFIRM-FIXED: Quorum reached, leak resolved. / D4: CONFIRM-FIXED / D5: CONFIRM-FIXED. Quorum met, P5 closed. / D6: CONFIRM-FIXED: Quorum reached, leak resolved. / D7: CONFIRM-FIXED. Leak resolved, status clean. / D8: CONFIRM-FIXED. All systems clear. / D9: CONFIRM-FIXED: leak resolved, quorum met. / D10: CONFIRM-FIXED
## Adjudication (owner, final)
CONFIRM-LEAK-FIXED (unanimous, 10x NOFIX). c1 ctxA miss is within-quorum tolerance (2/3 holds); CLEAN 3/3 with vetoA 0.0025 3/3 proves the U53/U54 A-leak was setup (shared-bias + B-heavy starvation), not mapping-deep. FIXED is a gate pass only — E-EXT2 licensed, P5 stays closed per v1.1. No ledger changes.
