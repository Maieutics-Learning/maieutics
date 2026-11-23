# Batch-3 v10 — harness summit, unity check, delimiter killer, dose bracket (FROZEN for review battery)

Agent approval: this file. User countersign: 2026-11-23 ("countersign batch 3 and 5 rounds of 5 experiments ... run each one multiple times ... each subsequent wave based on questions of the previous wave ... log everything"). Scope authorized: batch 3 (10 units below) + rounds R1–R5 (5 units each, each round specced after the previous verdict). R=3 seeds + quorum 2/3 + frozen seed-matched tests + in-worker CPU-only + NO PUSH unchanged throughout. Every unit runs all 3 seeds (the anti-luck rule).

## Why
Batch-2 verdict (3/4): harness replicates at 0.71 (T5); pressure+information lifts single-model two-pass to best-ever mean (COMBO 0.498, s1 0.63) with length-robustness gratis; 8x buys the answer head not composition and does not generalize length (s2 spread widens = memorization tilt); mixed diet dilutes. Open: (a) strongest-retriever harness (COMBO 0.925-0.935 x T2), (b) unity — one model both passes? (c) R3 rival killer: is AUX pressure format-memorization? (per-line randomized delimiter), (d) dose bracket 2x/12x around 4x (monotone? distortion ceiling?).

## Design (attn h48/m96, 800 steps, batch 16, lr 5e-3, attnAux true; frozen tests 52400/52500/52800/52900+seed; trainSeed 53200+seed*13, data rngs 52200/52300/52600+seed — init/data matched to batch1/2 family)
- E1 T6-HARNESS (zero training): pass-1 = filed COMBO model (d-batch2-cb) scratch readout (posOut[8]) on dummy lines → vhat; pass-2 = filed T2 (d-scratch-t2) on flat+[qk,k,vhat,8] → answer. Predict ~0.88x0.78 ≈ 0.70 (best harness yet: strongest single-model retriever).
- E2 C6-UNITY (zero training): pass-1 = filed COMBO posOut[8] vhat; pass-2 = SAME COMBO model on flat+[qk,k,vhat,8]. COMBO saw both formats in training (50/50 true/dummy), so unity should ≈ its own two-pass. Predict |C6 − cb-two| small.
- E3-5 DL-KILLER (trains, auxW 4.0, AUX4-identical dummy diet): per-line delimiter coin (erng 53600+seed): every token==8 in shift lines mapped to 8 or 7. Fwd lines untouched (no 8s in A.gen lines). Eval rebuilds with same stream (fresh draws, same distribution — tests handling of both delims, not pair-matching). NOTE (openly): 7 collides with flat values (4+v max 7) — this makes DL a STRONG killer (ambiguity + novelty). If pressure learned retrieve, DL holds; if it memorized the 8-format, DL collapses.
- E6-8 D2-DOSE (trains, auxW 2.0, AUX4-identical dummy diet+seeds): completes the dose curve T(1x, filed) / D2(2x) / AUX4(4x, filed) / AUX8(8x, filed) on identical data+init.
- E9-11 D12-DOSE (trains, auxW 12.0, same): distortion ceiling probe. E7 lesson (caution) + AUX8 no-distortion precedent in tension — 12x decides.

Wait — that is 1+1+3+3+3 = 11 units. TRIM to 10 per regime: D12 runs s0/s1/s2 = 3 trains (keep R=3 — anti-luck rule overrides), and C6 folds into E2 as second harness block: counted units = T6, C6, DLx3, D2x3, D12x3 = 11. Regime allows 10. RESOLUTION: D2 drops to the dose curve as analysis-only? No — R=3 required. FINAL: batch3 = T6 + DLx3 + D2x3 + D12x3 = 10 units; C6-UNITY moves to R1 (it needs no training and R1 is 5 units: C6 + LCx3 + FQ). This keeps every train at R=3 and the batch at exactly 10.

## Evals (seed-matched; new fns read d-batch3-*, reuse battery shape)
- T6: composed + retrieve + oracle + product + byK + T6−T5 + T6−T4 (descriptive).
- DL/D2/D12: scratch battery (fwd + scratch/one/two/oracle on 3p) + len two-pass (2p/4p) + dose-curve slot (D2/D12 scratch appended to {T,D2,AUX4,AUX8,D12} curve at verdict).

## Bars (quorum 2/3; verdict d-batch3-verdict.json)
- T6-HARNESS: composed ≥ 0.60 (2/3 floor); SECONDARIES T6−T5 / T6−T4 (stronger retriever?).
- DL-FORMAT (killer, primary): scratch ≥ 0.60 (2/3) → INVARIANT (pressure learned retrieve); else MEMORIZED (report DL−AUX4 gap; adapter: if MEMORIZED, R2+ prioritizes delimiter-robustness work).
- D2-DOSE (primary): monotone bracket per seed — D2 scratch ≥ T scratch AND AUX4 scratch ≥ D2 scratch − 0.05 (2/3); report full curve.
- D12-DOSE (primary): D12 scratch − T scratch ≥ +0.10 (2/3); distortion watch fwd < 0.75 flagged (not gated — E7 rule).
- T refs: two 0.265/0.265/0.295, scratch 0.41/0.675/0.45, oracle 0.325/0.255/0.26. AUX4 scratch 0.92/0.915/0.81. AUX8 scratch 0.935/0.975/0.98, fwd 0.965/0.985/0.975.

## Expectation (filed open)
T6 HIT (~0.70, best harness); DL BREAKS (lean MEMORIZED: scratch <0.60 on 2/3 — ambiguity+novelty is harsh; would-be surprise: holds); D2 monotone HIT (~0.6-0.8 between T and AUX4); D12 HIT-or-distorts (lean HIT, fwd holds like 8x).

## Nearest-failure
- T5 0.705/0.815/0.62 (differs: T6 retriever cb 0.925-0.935 ≈ AUX4 0.81-0.92 on s0/s1, weaker s2 0.775 — T6 may not beat T5 everywhere).
- AUX4/AUX8 dose points (differ: DL changes format not dose — clean isolation; D2/D12 change dose not format).
- LENMIX flat-at-floor (differs: DL keeps clean 3p diet — dilution not in play).

## Cost
9 trains (~15-60s each, in-worker) + 18 standard/len evals + 1 harness block, COMPLETE-gated. Driver: runDLTrain/runD2Train/runD12Train + runBatch3Eval/runBatch3Len + runHarnessT6. R1 queued (C6 + LCx3 + FQ, 5 units) specced after this verdict; R2–R5 adaptively after each wave. NO PUSH.

## Amendment v10.1 (pre-compute clarifications; zero train/eval changes — blind battery adjudication 2026-11-23)
- Battery: R1 CONDITIONAL (rival: retriever-chain framing + DL fairness + dose-hump lens) → 1 partial (T6 floor framing) + 1 reject-with-mechanism (positional shift impossible: value-only mapping preserves lengths/positions; eval fresh-draw distribution-matched) + 1 partial (report loss curves per dose arm; divergent D12 loss = instability not optimum). R2 CONDITIONAL → MUST-FIXes downgraded to pins (driver precedent governs): build order 150 shift via drng → 150 fwd via frng → shuffle via sh; erng (53600+seed) drawn once per shift line at build, before shuffle; mapping = per-line coin 8→{8,7} applied to shift-line tokens ONLY (dummy x in train; x/x2/xo constructions in eval); fwd lines untouched; eval draws FRESH from same stream (distribution-matched, not pair-matched); posOut[8] = forward cache index (as runBatch2Eval); len scrIdx = x.length−2 (as runBatch1Len); 7-collision allowed as part of the killer. R3 CONDITIONAL → rules stand; verdict reports DL−AUX4 gap + full dose curve {T,D2,AUX4,AUX8,D12}.
- Final count CONFIRMED: T6 + DLx3 + D2x3 + D12x3 = 10 units. C6 deferred to R1 with full eval spec there.
- Recorded blind predictions: T6 0.70, DL scratch 0.45, D2 scratch 0.75, D12 scratch 0.85 / fwd 0.95.
