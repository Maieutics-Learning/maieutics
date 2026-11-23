# Rung-2 adaptation v10 — mixed-question base -> held-out reverse (countersigned)

Agent approval: this file. User countersign: 2026-11-23 ("Countersigned and go ahead and create and run 5 more experiments").

## Why
Noveltype-v10 barB (filed FAIL: tutor==scratch at K64/256, interference at K16) trained the base ONLY on forward. The filed next step (PROPOSED NOT RUN) was mixed-question training incl. reverse. Rung-2 extends it: base NEVER sees the target operation (forward+flip only), then adapts to held-out reverse. Cleaner transfer test + speed metric (no precedent for steps-to-bar).

## Design
- BASE (s in {0,1,2}): attn h48/m96/d16, 500 forward (assocR 1..3 pairs) + 500 flip (query-first) mixed, 1200 steps, B16, lr5e-3, attnAux + bindLabels aux (decomp recipe). GATE: mixed in-dist acc >= 0.60 else ABORT seed.
- ADAPT: finetune BASE 200 steps (B8, Adam 5e-3, bindLabels aux, NO attnAux — noveltype filed choice) on K=64 worked reverse examples vs SCRATCH-init identical protocol. Same worked set per seed (rng 14400+s scheme). Eval fresh 200 reverse lines (distinct-values? NO — uses noveltype genReverse with-replacement to stay comparable to barB baseline; ambiguity is shared across arms).
- STEPS-TO-BAR (descriptive, new): record acc at {25,50,100,200} steps by checkpoint-eval (replay finetune rng; cheap eval-only). Bar uses final 200-step acc; speed curve is descriptive.

## Bars (R=3 seeds s=0,1,2, quorum 2/3)
- ADAPTS: tutor-final >= 0.80 AND scratch <= 0.50 (noveltype barB thresholds, kept comparable).
- NO-ADVANTAGE: |tutor-scratch| <= 0.05 or both fail bar (replicates barB).
- INTERFERENCE: tutor < scratch by >= 0.05 in 2/3 seeds (K16 effect; demotion rule: if interference, rung-2 does NOT license rung-3 scale-up).

## Expectation (scored at verdict)
NO-ADVANTAGE (prior barB: ties at K64/256; mixed base adds format robustness but no reason to expect reverse transfer; interference possible but K=64 is the safe regime).

## Nearest-failure
Noveltype-v10 barB (differs: forward-only base + fixed 200 steps; here mixed base + speed curve + cleaner holdout). P4-mini (distinguished: no weight learning there).

## Cost
3 mixed bases (~2 min each) + 6 finetunes (~1 min) + checkpoint evals (eval-only). Resume-safe COMPLETE-gated.

## Ledgers
`d-adapt-base-s{s}.json`, `d-adapt-few-K64-s{s}-{tutor,scratch}.json` (+ `-ckpt25/50/100` evals), `d-adapt-verdict.json`. Driver: `learn-driver.js` (runAdaptBase/runAdaptFew). Transcript + CHATLOG + CURRENT_TASK. NO PUSH without order.
