# Cycle-consistency without labels v1.1 (amendment to noveltype-v10; user-ordered 2026-11-22; agent approval: this file)

## What do I want to find out
Can the tutor learn the REVERSE question with NO answer labels, using only
round-trip consistency? "No labels" = no y anywhere; the signal is the cycle:
forward(kf) -> v, reverse(v) -> must return kf (and symmetrically from a
reverse start). The pairs in the input make the constraint; the withheld
answers are never used.

## Design (all answer-free; queries are OURS to choose, not labels)
Per pairs-set P: choose forward key kf (a bound key) and reverse value vr (a
bound value). SOFT chaining (fully differentiable, no sampling):
- pF = soft(model(P+[kf,Q])); pRv = soft(model(P+[4+v,Q])) for v in 0..3.
- L_A = -log SUM_v pF(v)*pRv(kf) (forward-then-back must return kf).
- pR = soft(model(P+[4+vr,Q])); pFk = soft(model(P+[k,Q])) for k in 0..3.
- L_B = -log SUM_k pR(k)*pFk(vr) (reverse-then-forward must return vr).
Loss = L_A + L_B (+ bindLabels aux, which is also answer-free: derived from
x). 10 forwards per pairs-set per step. Backprop through the soft mix
(standard softmax chain rule), Adam 5e-3, 300 steps, batch 8.
ARMS (seeds s0-2): cycle-tutor (from filed 1-hop tutors — forward skill is the
anchor, no new labels), cycle-scratch (from fresh init — can cycles alone
discover both directions?), sup-mixed (WITH labels control: finetuneFrom on
256 mixed worked examples — upper bound).
EVAL: same zero battery (B0/B1/B2/B3+echo) + HELD-OUT B4 long-reverse (5-pair)
+ B5 flip-reverse (query-first reverse). B0 retention is the COLLAPSE TRIPWIRE
(C2): echo satisfies cycles with wrong answers, so B0 must stay >= 0.90.
BARS: C1 cycle-tutor B3 > 0.35, quorum 2/3. C2 B0 >= 0.90, 3/3.
Descriptive: B4/B5 (does learned reverse generalize?); scratch-cycle (expect
collapse: echoRate high, B3 ~0.25); sup-mixed ceiling.

## Expectation
C1 PASS 2/3+ (anchor + cycles teach reverse); C2 PASS 3/3; scratch-cycle
collapses (informative: cycles need the anchor).

## Pre-mortem
Strongest objection: echo-collapse even FROM the tutor (corrupt forward to
echo, satisfy cycles, B0 dies) — answered: C2 tripwires it; a C2 trip is a
finding about cycle-training stability, filed as such.
Most likely failure: cycles teach nothing (B3 stays ~0.25, B0 intact) — clean
null: consistency without answers doesn't move the procedure.

## Nearest-failure
v10 few-shot (differs: worked examples WITH answers helped nobody and hurt at
low K; here answers are withheld entirely and the constraint is structural).

## Cost
9 trains x ~300 steps x 80 forwards (h48) ~ 30-45 min + evals, resume-safe.

## Ledgers
d-cycle-{tutor,scratch,supmix}-s{s}.json (post-train battery + B4/B5),
d-novel-verdict2.json. Driver: novel-driver.js (softCycleTrain, runCycleEval).
