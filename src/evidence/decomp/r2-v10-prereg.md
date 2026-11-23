# R2 v10 — attack the add side (FROZEN for review battery)

Agent approval: this file. User countersign: 2026-11-23 (batch3 + 5x5 rounds, R=3, adaptive). Scope: R2 = 5 units (ADD4x3 trains + R2H block + K3P block). Every unit R=3 seeds; quorum 2/3; CPU-only; NO PUSH.

## Why (R1 verdict questions)
Add binds everywhere: P(correct|vhat ok) only 0.44-0.66; T4/T5/T6 tier ~0.70 = oracle ceiling (0.74-0.86). Unity is strict pipeline (no re-derivation). Open: does add-dose lift (ADD4)? Where exactly does add fail (K3P)? Is residual error retriever-noise or add-noise (R2H decides R3 direction)?

## Design (attn h48/m96, 800 steps, batch 16, lr 5e-3; frozen tests 52400/52500+seed; trainSeed 53200+seed*13, rngs 52200/52300/52600+seed)
- E1-3 ADD4 (trains): T2-identical data (150 TRUE-flat flat+[qk,k,v,8] via drng + 150 fwd via frng, shuffled via sh) + prefixLabels scratchLabelsT + auxW 4.0 (only delta vs filed T2 @1x). Pure add-dose isolation.
- E4 R2H-CONSENSUS (zero training): pass-1a = filed cb (d-batch2-cb) posOut[8] vhat_a on dummy; pass-1b = filed a4 (d-batch1-a4) posOut[8] vhat_b on same lines; agree-rate; pass-2 = filed t2 on flat+[qk,k,vhat_a,8] (cb's). Report agree-rate, comp|agree, comp|disagree, gap = comp|agree − comp|disagree.
- E5 K3P-PROFILE (zero training): filed t2 (d-scratch-t2) + filed cb (d-batch2-cb, oracle/true-v pass) on 200 true-flat tests (srng 52500+seed): per-k accuracy + confusion (for each true k, distribution of wrong answers) + t2-vs-cboracle gap per k.

## Evals
- ADD4: oracle-3p (one-pass on true-flat lines; the add skill itself) + fwd-3p (distortion watch) + len? No (add lines are length-fixed; skip len — state openly).
- R2H: agree-rate + comp|agree + comp|disagree + gap (per seed).
- K3P: per-k acc (t2, cb-oracle) + confusion rows + worst-k (per seed).

## Bars (quorum 2/3; verdict d-r2-verdict.json; refs t2-oracle 0.75/0.86/0.74, t2-fwd? filed d-scratch-eval-t2 fwd — read at verdict)
- ADD4-DOSE (primary): add4.oracle − t2.oracle ≥ +0.05 (2/3); WATCH fwd < 0.75 flagged (T2 fwd baseline read from filed d-scratch-eval-t2 at verdict time).
- R2H-ROUTING (decision, pre-registered): gap = comp|agree − comp|disagree ≥ +0.15 (2/3) → R3 = RETRIEVER work (denoise vhat: delimiter-robustness, k3-repair on retriever); else (gap < 0.15 2/3) → R3 = ADD work (add diet/architectural). Either way a ROUTE, not a FAIL — report which.
- K3P (descriptive): worst-k + confusion pattern (feeds R3 add-work design if routed there).

## Expectation (filed open)
ADD4 small lift or flat (+0.0-0.05, 1-2/3 → lean MISS — T2 converged already); R2H gap LARGE (+0.2, retriever-noise binds at least s2 → lean RETRIEVER route); K3P k3 worst (as all byKs so far).

## Nearest-failure
- T2 oracle 0.75/0.86/0.74 (differs: ADD4 = same data @4x — pure dose).
- T6 byK k3 weakest 2/3 (differs: K3P profiles the ADD models directly, not harness composites).
- C6 P(correct|vhat wrong) 0.13-0.15 (differs: R2H tests whether a SECOND retriever disagrees where the first errs).

## Cost
3 trains + 6 ADD4 evals (oracle+fwd) + 2 harness blocks (R2H, K3P), COMPLETE-gated. Driver: runADD4Train + runR2Eval (d-r2-*) + runHarnessR2H + runK3P. R3 (5 units) specced after verdict per the routing. NO PUSH.

## Amendment v10.1 (pre-compute pins; blind battery 2026-11-23 — R1 ENFORCEABLE / R2 CONDITIONAL→pinned / R3 ENFORCEABLE)
- ADD4 recipe = runScratchTF-identical (same arch/steps/batch/lr/optimizer/data build incl. shuffle; ONLY auxW 1.0→4.0; arm name add4, ledger d-r2-add4).
- oracle-3p = byte-identical to T5-oracle construction (true-v flat+[qk,k,v,8], srng 52500+seed, same 200 lines).
- T2 baselines (oracle 0.75/0.86/0.74; fwd = accFwd from filed d-scratch-eval-t2-s{seed}.json, read at verdict).
- R2H pass-2 ALWAYS vhat_a (cb's) regardless of agreement — no vhat_b leakage.
- K3P: n=200 total; confusion = Count(pred j | true i) over the 200; read lens = off-by-one share vs random-collapse (R1c adopted).
- Recorded blind predictions: ADD4 lift <0.05 (1/3 pass); R2H gap ≈+0.20 (3/3); K3P k3 worst.
