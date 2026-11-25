# Self U31b delta-prereg: round-2 monitor with gated responding (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. Pool = sealed reviewer labor only (3x generateText implementability reviews, never training signal). R=3, quorum 2/3, COMPLETE-gated, twin-matched streams, paired evals. Corrections append-only. NO PUSH without explicit order.

## Record-search (already-run / nearest prior / what differs)
- U31 MONITOR-BLIND (verdict d-newai-self-u31-verdict.json): slot-stage monitor ([winnerEnc, Eqk] -> veto+fallback). CATCH 1/3, LIFT 0/3. WHY filed: (1) collapsed to constant veto s0/s1; (2) verified the WRONG stage — forced vhat==e.v 1.0 all seeds on mined diet while round-2 fails 15-30%; SELECT decoratively detached from answers.
- What differs vs U31: monitor moves to ROUND-2 (Henson-faithful: gate the response, not retrieval). Input x2=[summary(8), hv(4), read(4), vhatOH(4), Eqk(12)] (32-dim, includes an explicit comparison substrate: summary-vs-vhat consistency is checkable by the head). Label y2 = round-2-correct with forced vhat. Action = ABSTAIN (gated responding), never re-retrieval. No slot fallback anywhere.
- Critic saga (U12, F-check): judged head selection, never predicted failure. U31b differs: predicts a MEASURED downstream failure (round-2 error exists 15-30% on this diet — the label is non-degenerate by construction).
- Appetite saga: no dynamics, single-pass gate. Abstention collapse risk (abstain-all) held by COV bar.

## Design
- Frozen: U28 comp-arm S/C/INH/HF per seed + W6/M2nb/U5head/U21miner/U22c (same loads as U28/U31). Frozen-drift check maxAbsDrift==0.0 required (VOID on trip).
- Trainable: R2MON head only — W1 32->8 silu, b1 8, W2 8->1, b2 1, sigmoid. Init uniform +-0.1, rng 79600+seed*7919+192*131.
- Forward (train + eval, codes 192): IDENTICAL retrieval to U28 (u26PoolForward) -> ens=hv+read+HFout -> vhat_f. vhatOH one-hot(4). x2=[summary,hv,read,vhatOH,Eqk]. p=R2MON(x2). Round-2 label: x2m=[9x6,qk,k,vhat_f,8] through frozen M -> y2=1[argmax==e.y] (eval-only forward, no trunk grads).
- Loss (all batch rows, adapt+std): BCE(p, y2), R2MON params only, Adam lr5e-3, clip 1.0. NO retriever/trunk backward.
- Diet/streams: IDENTICAL to U28/U31 (8 std + 8 vhat-hard mined B=16, 800st; mine 65300+seed; held-out 66300+seed N=200; std N=200; slot rngs identical) — twin-matched to U28/U31 same-seed.
- Arms: ONE arm u31b-r2mon. Eval modes: forced (answer all, = U28 verbatim) / gated (answer iff p>=0.5 else abstain).
- 6T + 6E (round-2 per row per mode) + OOD forced + probes.

## Paper predictions vs bench predictions (divergence-WHY owed)
- Henson #8 predicts: monitoring dissociates from retrieval — expect CATCH2 holds while SELECT-HARD identical (by construction) AND round-2 accuracy on answered subset rises. IF CATCH2 holds but SELACC fails: file WHY (failures compositionally opaque at 32-dim inputs; needs trunk-internal features next — but those break the intrinsic-readout discipline, file explicitly).
- Benoit & Anderson 2012 (inward leg): x2 contains summary+hv+read+vhatOH+Eqk so a mismatch feature (summary-vs-vhat/hv inconsistency) is LEARNABLE by the head, unlike U31's winnerEnc-only input. Pre-registered risk: if round-2 failure is trunk-composition noise with no readout signature, R2MON-BLIND repeats U31 — file WHY (inward signal must come from trunk internals, current discipline can't see it).
- vhatOH near-constant (vhat==e.v ~always on hard diet): state it. The head must use the other 28 dims; a head that keys on vhatOH alone scores CATCH2=0.

## Bars (quorum 2/3 unless noted)
- U31b-CATCH2: P(shut | round2-fail) minus P(shut | round2-ok) on hard rows >= +0.20 2/3.
- U31b-SELACC: acc(answered) minus acc(forced-all, round-2) >= +0.05 2/3 with coverage >= 0.50 3/3 (must be one bar: gated responding buys accuracy without collapsing to silence).
- U31b-WALL: hardSelectHit EXACTLY equals U28 same-seed 3/3 (sanity; retrieval untouched).
- U31b-HARD: forced hardAdaptY >= 0.60 2/3 (= U28 values). U31b-STD: two within +-0.05 of W6 two 2/3. U31b-SUMMARY: zero-summary drop >= 0.05 2/3.
- U31b-FROZEN: maxAbsDrift == 0.0 3/3. U31b-FRESH: battery health 4/4.
- Verdicts: R2MON-VERIFIES (CATCH2 + SELACC hold) / R2MON-CALIBRATED-BUT-USELESS (CATCH2 holds, SELACC fails) / R2MON-BLIND (CATCH2 fails) / VOID (WALL or FROZEN trip).

## Staging + budgets
- Battery on THIS file first (3x sealed) -> v1.1 pins-only. Then grad-check (BCE exact incl. sigmoid + round-2 label plumbing det; retriever/trunk no-touch) + stage-1 (mining identical) + 6T + 6E + verdict d-newai-self-u31b-verdict.json. Transcript extras Turn-137 + CHATLOG + CURRENT_TASK. NO PUSH without explicit order.
- Compute: CPU/in-worker only, 6x800st head-only trains + evals, COMPLETE-gated.

## v1.1 pins (red-team battery 3x, no design change)
- P1 permutation probe (eval-only, reported, non-binding): re-run CATCH2 with x2 features jointly shuffled across rows (one fixed permutation per seed, applied identically to all eval rows). If CATCH2 survives shuffling, the head keys on bias/base-rate, not signal — strengthens any BLIND reading; if it collapses, discrimination is input-dependent.
