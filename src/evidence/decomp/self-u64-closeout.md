# U64-RULESWITCH closeout — INCONCLUSIVE (floor miscalibrated; adapt edge real but thin; outcome edge absent)

**Prereg:** `self-u64-ruleswitch-prereg.md` v1.0 STANDS (no amendments). **Cover:** user pre-countersign
(full pipeline). **Reviews:** program battery 10R1+10D (U64 10/10 IMPLEMENTABLE, D vacuous — filed);
Wave-0 10+10 (COMPLETE); Wave-1 10+10 (COMPLETE, 3 confused challenges rejected);
Wave-2 10+10 (COMPLETE, 10 confused challenges rejected with per-seed refutation). Zero adopted
points across all four batteries.

## What ran (all filed, deterministic)
- Driver `newai-selfu64-driver.js`; D-pins D1–D4 + D5 diet-bound correction (zero data).
- Wave-0 COMPLETE: 15/15 twins, rule-identity, diet familiar 0.8672 in D5 gate, ~13.3s/train.
- Wave-1 COMPLETE: 100/100 trains (5 arms × 20 seeds × 800st H48), train PIN 100/100, rule-ID 20/20.
- Wave-2 COMPLETE: 100/100 evals (N=200 stationary, U50 verbatim) + verdict + correction-1.

## Corrected bars (correction-1; verdict file frozen)
- ORACLE-EDGE-outcome: 4/20 (passes s1/s3/s5/s13; per-seed margins filed in Wave-2 review) — FAIL.
- ORACLE-ADAPT: 15/20, quorum MET (orF=1.0 ×20; dice 0.61–0.97) — PASS, margins mostly thin.
- FLOOR: max arm two <0.45 on 11/20 → INCONCLUSIVE (all arms outcome 0.25–0.52).
- TIMING-DIAG: orT−shT mean −0.028, reversed (timing is not the active ingredient — constraint
  recorded for any U66 attempt).
- PIN 20/20 eval + 100/100 train; RULE-IDENTITY 20/20.

## Reading (honest)
1. The cheater recovers faster at quorum but barely: dice already adapts at 0.61–0.97 because the
   75%-familiar diet hands every arm fast recovery. Detection buys adapt-speed, thinly.
2. The cheater does NOT win outcomes (4/20): the stationary final-memory eval washes out
   rule-switch training, and/or floor 0.45 (inherited from stationary U50) is miscalibrated for
   this diet. The kill-gate's AND therefore fails on the outcome half.
3. Timing control is backwards (orT < shT): resets at true boundaries are worth nothing over random
   resets here. Any consumer design (U66) must treat timing as non-ingredient unless a new eval
   shows otherwise.

## Line status
- U64: CLOSED INCONCLUSIVE. No PROCEED, no KILL-LINE (the cheater wins adapt at quorum but loses
  outcomes — neither gate fully resolves; the eval, not just the arms, is suspect).
- U65/U67/U68/U69 compute: UNLICENSED (gated on PROCEED — not met). U66: doubly blocked.
- Next: owner choice among (a) U64b recalibrated prereg (lower floor and/or harder adapt window,
  e.g. first-10-slot rate, less-forgiving familiar fraction), (b) accept outcome-half KILL-LINE
  reading and close the line, (c) novel-rule transfer eval. Each needs a fresh prereg + battery +
  countersign; the old pre-countersign does not cover any new version. NO PUSH without order.
