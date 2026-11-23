# Batch-2 v10 — pressure × information, dose ceiling, length-robustness (FROZEN for review battery)

Agent approval: this file. User countersign: 2026-11-23 rolling-batches order (batch of 10 = 9 trains + 1 zero-train harness; battery/prereg/R=3/CPU-only/NO-PUSH unchanged).

## Why
Batch-1 verdict (4/4): retrieve wall broken by pressure (AUX4 scratch 0.81-0.92) but length-fragile; add learnable (T2 oracle 0.78); clean retriever 0.97 (FWD3); harness composes at 0.76 mean (T4 0.815 new ceiling). Open: (a) pressure AND information in one model (AUX4 has pressure w/o info; T2 has info w/o pressure; dp has info-mix @1x), (b) aux dose monotonicity 1x→4x→8x, (c) length-robust retrieve (AUX4 collapses off-3p), (d) best-harness with the strongest retriever (AUX4 0.88).

## Design (10 experiments; attn h48/m96, 800 steps, batch 16, lr 5e-3, attnAux true; frozen tests 52400/52500/52800/52900+seed)
- E1 T5-HARNESS (arm t5, zero training): pass-1 = filed AUX4 model scratch readout (posOut[8]) on dummy lines → v̂; pass-2 = filed T2 model (flat+[qk,k,v̂,8]) → answer. Predict ~0.88×0.78 ≈ 0.69.
- E2-4 COMBO (arm cb): dp-identical data (coin 53500+seed 50/50 true/dummy; drng 52200+seed, frng 52300+seed, sh 52600+seed; T labels) + auxW 4.0; same trainSeed 53200+seed*13 (init identical to dp/T2/AUX4/T — data matches dp exactly, only auxW differs).
- E5-7 AUX8 (arm a8): dummy data (AUX4-identical streams) + auxW 8.0; same trainSeed. Dose monotonicity 1x→4x→8x.
- E8-10 LENMIX (arm lm): dummy scr; shift diet 50×2p + 50×3p + 50×4p (sequential draws from drng 52200+seed) + 150 fwd; T labels, auxW 1.0; same trainSeed (init matched, diet differs by design).

## Evals (seed-matched; new fns read d-batch2-*, reuse battery shape)
- cb/a8/lm: scratch battery (fwd + scratch/one/two/oracle on 3p tests) + len two-pass (2p/4p).
- t5: composed + retrieve + byK + product-check vs AUX4-scratch × T2-oracle.

## Bars (quorum 2/3; verdict d-batch2-verdict.json; T refs: two 0.265/0.265/0.295, scratch 0.41/0.675/0.45)
- T5-HARNESS: t5 composed ≥ 0.60 (2/3). SECONDARY product-check + t5−T4 (cleaner retriever? AUX4 0.88 < FWD3 0.97 — informative either way).
- COMBO-TWO (primary): cb two-pass − T two-pass ≥ +0.15 (2/3 decides); FLOOR cb fwd ≥ 0.75; SECONDARIES cb scratch/oracle/one + pathway decomposition (scratchΔ/oracleΔ vs T and vs dp: pressure+information predicts both up vs dp).
- AUX8-SCRATCH (primary): a8 scratch − T scratch ≥ +0.10 (2/3); SECONDARIES fwd/one/two/oracle + distortion watch (fwd < 0.75 flagged, not gated — E7 lesson).
- LENMIX-SPREAD (primary): max-min({2p,3p,4p} two-pass) ≤ 0.20 (2/3); FLOOR lm two-pass-3p ≥ 0.35 (above T mean, safety).

## Amendment v10.1 (pre-compute; blind-battery adjudication 2026-11-23)
- Battery: R1 REJECT (4 math objections) → 1 partial (T5 bar reframed as replication floor; T5−T4 stays descriptive) + 3 rejects-with-math (COMBO target coherent vs dp/AUX4 precedents; spread+floor cover decay+hold jointly; paired init+data removes seed variance as error term). R2 ENFORCEABLE → no patch. R3 rival (format-memorization) → PARTIAL: novel-delimiter killer out-of-scope (batch-3 material); adopted verdict-time AUX8-vs-AUX4 len-spread comparison as memorization-vs-pressure lens.
- T5-HARNESS (v10.1 framing): ≥0.60 is a replication floor (hold vs collapse), not a delta-vs-0.585 discovery claim.
- Analysis-only amendment: AUX8-vs-AUX4 len-spread comparison at verdict time (wider collapse under 8x → memorization; narrower → pressure generalizes). Zero train/eval changes.

## Expectation (filed open)
T5 HIT (~0.65); COMBO HIT (~0.6 two-pass: pass-1 dummy is trained via dummy half, pass-2 add via true half); AUX8 HIT-or-distort (scratch higher still, watch fwd); LENMIX HIT (spread ~0.1, 3p ~0.45).

## Nearest-failure
- T4 0.735/0.815/0.73 (differs: AUX4 retriever 0.88 < FWD3 0.97 — T5 may underperform T4; bar is absolute 0.60, comparison descriptive).
- dp two-pass 0.445/0.4/0.285 @auxW1 (differs: COMBO=dp data @auxW4 — pure auxW isolation).
- AUX4 scratch 0.92/0.915/0.81 @auxW4 dummy (differs: AUX8 8x dose; LENMIX mixed diet @1x).
- T2 copying shortcut (differs: COMBO/LENMIX dummy halves keep retrieve alive; T5 avoids single-model retrieve entirely).

## Cost
9 trains (~2 min each) + 21 evals (standard+len for 3 arms; t5 eval-only), COMPLETE-gated. Driver: runComboTrain/runAux8Train/runLenmixTrain + runBatch2Eval/runBatch2Len + runHarnessT5. NO PUSH.
