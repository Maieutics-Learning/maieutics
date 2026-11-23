# Batch-1 v10 — retrieve-into-scratch, four ways (FROZEN for review battery)

Agent approval: this file. User countersign: 2026-11-23 rolling-batches order ("for every 10 experiments you complete, stop reassess and find 10 more"; prior per-track extras budgets retired by the same order; battery/prereg/R=3/CPU-only/NO-PUSH unchanged).

## Why
Scratch verdicts decomposed the ceiling: retrieve-into-scratch-position ~0.4-0.55 (the wall) + add-given-v ~0.78 (learnable) + harness product 0.47-0.645 (s1 0.645 first-over-ceiling). Four untried attacks on the retrieve wall, one batch (10 experiments = 9 trains + 1 zero-train harness):

- E1-3 AUX4 (arm a4): scratch-dummy training with auxW 4.0 (4x scratch pressure; same data/seeds 52200/52300/52600+seed, same trainSeed 53200+seed*13). Tests the weak-aux hypothesis (filed aux scaled 1/(B*len)).
- E4-6 FWD3 (arm f3): forward-only on 3-pair flats (new rng 53400+seed, 150 lines), 800 steps. Clean retriever for the harness; tests whether 3-pair-only forward retrieves its own flats better than mixed-training does.
- E7-9 DROPOUT (arm dp): 50/50 true/dummy scr per line (coin rng 53500+seed; same base data), T labels, 800 steps. Keeps retrieve alive (dummy half) while learning the add (true half).
- E10 T4-HARNESS (arm t4, zero training): pass-1 = FWD3 model forward-query (flat+[qk,8]) → v̂; pass-2 = filed T2 model (flat+[qk,k,v̂,8]) → answer. Same frozen shift tests (52500+seed). Predicts ~0.8×0.78 ≈ 0.62 with a CLEAN retriever.

## Evals (frozen, seed-matched)
- a4/dp: scratch battery (fwd + scratch/one/two/oracle + len two-pass; test rngs 52400/52500/52800/52900+seed).
- f3: forward on standard 1..3 (52400+seed) AND on shift-test flats as forward queries (52500+seed draws → flat+[qk,8]).
- t4: composed + retrieve on shift tests; byK + product-check vs FWD3-retrieve × T2-oracle.

## Bars (quorum 2/3; verdict d-batch1-verdict.json; T refs: two 0.265/0.265/0.295, scratch 0.41/0.675/0.45, oracle 0.325/0.255/0.26)

## Amendment v10.1 (pre-compute; blind-battery adjudication 2026-11-23)
- Battery: 3 sealed (R1 FAIL joint-bars → ADOPTED primary/secondary split: one delta decides, floors + secondaries reported; R2 IMPLEMENTABLE → no patch, reviewer dropout wording corrected: mask is on the scr INPUT token at data-build, deterministic at test; R3 noise-rival UNVERIFIED-as-specced → PARTIAL: train-time input masking has no test-time variance knob, but the filed 4-metric battery already decomposes pathways vs noise — adopted as explicit verdict-time analysis). Raw: fresh-eyes-batch1-v10-3x-results.md (this file's battery). No train/eval changes (analysis-only amendment).
- AUX4-HELPS (v10.1: primary/secondary per battery R1): PRIMARY a4 scratch − T scratch ≥ +0.10 (2/3 decides); SECONDARY a4 two-pass/oracle reported descriptively (no bar — scratch/two-pass can anti-correlate under over-specialization).
- FWD3-RETRIEVES: f3 forward-on-shift-flats ≥ 0.80 (clean-retriever quality on exactly the harness flats).
- DROPOUT-BOTH (v10.1: primary/floor per battery R1+R3): PRIMARY dp two-pass − T two-pass ≥ +0.10 (2/3 decides); FLOOR dp fwd ≥ 0.75 (safety, nearly free); PATHWAY-DECOMPOSITION reported (dp scratch − T scratch and dp oracle − T oracle descriptively: pathways-alive predicts both up; pure-noise predicts oracle-only).
- T4-HARNESS: t4 composed ≥ 0.60 (second grade over the ceiling, first with a clean retriever).

## Expectation (filed open)
AUX4 HIT-or-near (pressure was the named weakness; 4x may overshoot into aux-distortion — watch fwd); FWD3 HIT (~0.85 on own flats); DROPOUT HIT (~0.55 two-pass: both pathways alive); T4 HIT (~0.62, product of clean parts).

## Nearest-failure
- T scratch 0.41-0.675 at auxW 1.0 (differs: 4x pressure).
- S1 fwd 0.78-0.865 on mixed 1..3 (differs: 3-pair-only diet on shift flats).
- T2 copying shortcut (differs: dropout forces both pathways every batch).
- T3 0.575/0.645/0.47 (differs: clean FWD3 retriever instead of mixed S1).

## Cost
9 trains (~2 min each) + 15 evals (standard+len; t4 eval-only), COMPLETE-gated. Driver: runAuxTrain/runFwd3Train/runDropoutTrain + runFwd3Eval + runHarnessT4 (reuses scratch evals for a4/dp). NO PUSH.
