# R3 v10 — retriever denoise: k3 diet, dual fallback, per-delim competence (FROZEN for review battery)

Agent approval: this file. User countersign: 2026-11-23 (batch3 + 5x5, R=3, adaptive). Scope: R3 = 5 units (K3Rx3 trains + ENS block + DLR block). R2 routing FIRED retriever (gaps +0.37-0.45, 3/3). CPU-only; NO PUSH.

## Why (R2 questions)
Retriever disagreement decides correctness; k3 weakest 2/3; errors 44-64% off-by-one (systematic). DL cost 0.18-0.38 unexplained per-delimiter. Open: does k3-targeted diet repair the weak bin? Does a second retriever rescue disagreements? Is DL's cost symmetric across delimiters?

## Design (attn h48/m96, 800 steps, batch 16, lr 5e-3; frozen tests 52400/52500+seed; trainSeed 53200+seed*13, rngs 52200/52300/52600+seed)
- E1-3 K3R (trains, AUX4-identical dummy diet + auxW 4.0, ONE delta): first 75 of 150 shift lines force k=3 (override: k'=3, y'=(v+3)%4, x'=flat+[qk,3,0,8]; v/qk/flat from the drawn line), remaining 75 random k. +150 fwd, shuffle via sh. k3-heavy retriever diet.
- E4 ENS-FALLBACK (zero training): pass-1a cb vhat_a, pass-1b a4 vhat_b on dummy; if agree → t2 on flat+[qk,k,vhat_a,8]; if disagree → t2 on flat+[qk,k,vhat_b,8] (a4's second opinion). Report composed + disagree-rescue-rate (P(correct | disagree, fallback)) + ENS − T6.
- E5 DLR-SPLITS (zero training, filed DL d-batch3-dl): scratch accuracy on delim-8-only lines vs delim-7-only lines (200 each, erng-split streams: 8-lines via mapped-8 build, 7-lines via mapped-7 build; same srng shift lines). Report acc8, acc7, |gap|.

## Evals
- K3R: standard battery + len + per-k oracle readout (true-v flat lines → per-k acc, same K3P construction) → k3-lift vs K3P baselines (t2-k3 0.693/0.871/0.610; a4 scratch? use filed a4 per-k? K3P has no a4 — compare k3-scratch vs AUX4 scratch 0.92/0.915/0.81 + k3-oracle vs t2-k3).
- ENS: composed + rescue-rate + ENS−T6 (T6 refs 0.70/0.825/0.585).
- DLR: acc8, acc7, gap (per seed).

## Bars (quorum 2/3; verdict d-r3-verdict.json)
- K3R-REPAIR (primary): k3r k3-oracle − t2 k3-oracle ≥ +0.05 (2/3). SECONDARY k3-scratch vs AUX4 scratch (report, no bar).
- ENS-FALLBACK (primary): ens.composed − t6.composed ≥ +0.02 (2/3). SECONDARY rescue-rate reported.
- DLR-SYMMETRY (descriptive + decision): |acc8 − acc7| ≤ 0.10 (2/3) → SYMMETRIC (cost is format-general) else ASYMMETRIC (cost lives in the 7-collision → R4 = collision-free delimiter training, e.g. dedicated marker value outside 0-7 range... vocab-capped: note as architectural).

## Expectation (filed open)
K3R k3-lift HIT (+0.05-0.10, 2/3); ENS small HIT (+0.02-0.04, 2/3 — disagreements are where a4 beats cb); DLR ASYMMETRIC (7 worse by ~0.15: collision cost).

## Nearest-failure
- K3P t2-k3 0.693/0.871/0.610 (differs: K3R diet-shifts k3 volume 25%→~62%).
- T6 0.70/0.825/0.585 (differs: ENS only differs on disagree lines 11-33%).
- DL scratch 0.54/0.635/0.635 (differs: DLR splits the coin — same weights, per-delim competence).

## Cost
3 trains + 9 K3R evals (std+len+perk) + 2 blocks (ENS, DLR), COMPLETE-gated. Driver: runK3RTrain + runR3Eval/runR3Len/runR3Perk (d-r3-*) + runHarnessENS + runDLR. R4 (5 units) specced after verdict (pool: AL8, delimiter-robust-full, add-side round-2, paper). NO PUSH.

## Amendment v10.1 (pre-compute; blind battery 2026-11-23 — R1 CONDITIONAL→lens+paired / R2 CONDITIONAL→pinned / R3 ENFORCEABLE)
- K3R read lens (R1a adopted, no new trains): repair = k3-lift MINUS mean(k1,k2-lift). General-dose lifts all bins; true repair concentrates on k3. (k2-control arm declined: over budget.)
- ENS correlation (R1b) noted openly: a4/cb same family → correlated errors push rescue toward 0; a ~0 result IS the answer (second opinions don't help). No change.
- DLR PAIRED (R1c adopted): same 200 shift lines, delim forced all-8 vs all-7 via post-generation mapping. Same content both ways.
- Build pins: override = static subset (first 75 shift draws forced k=3) BEFORE concat+shuffle; x' = composeGenShiftScr layout, k→3, y recomputed, slot/marker untouched; per-k oracle = K3P construction (n=200 total); ENS disagree = single line, vhat_b only; DLR = paired post-generation mapping.
- Recorded blind predictions: K3R +0.07; ENS +0.03; DLR gap ~0.15 ASYMMETRIC.
