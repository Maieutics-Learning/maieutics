# Self U31 delta-prereg: post-retrieval monitor with veto+fallback (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. Pool = sealed reviewer labor only (3x generateText implementability reviews, never training signal). R=3, quorum 2/3, COMPLETE-gated, twin-matched streams, paired evals. Corrections append-only. NO PUSH without explicit order.

## Record-search (already-run / nearest prior / what differs)
- Wall: SELECT-HARD 0/3 x9 (U24-U30 + 6 extras), COMPETE 0/3 x9, GAP 0/3 x9. USE without EXCLUSION everywhere.
- Nearest prior U28 (MAX-PARTIAL, verdict d-newai-self-u28-verdict.json): max-hinge on detached INH. INHIB-USE 2/3 (0.155/0.045/0.10), INHIB-SEPARATES 2/3 (+0.681/-0.090/+0.697), but SELECT-HARD 0/3 (0.235/0.07/0.36), COMPETE 0/3 margins -0.022..-0.028, SEL 2/3, HARD 3/3 (0.855/0.685/0.72), STD 3/3. WHY filed: single max chases one distractor mode while another wins; means-vs-max necessary not sufficient.
- Gate saga (U4 HEAD-FAILS+GATE-HURTS, U8 decorative, U10 split-heals, U12 hard-always-picks, U24 GATE-FAIL gate~0.75 constant Q-USE 0/3, U29 Q-FAIL Q-USE decorative, E2b frozen==zero): every gate read head OUTPUTS post-hoc and was constant or decorative. U31 differs: the monitor does NOT gate blending — retrieval runs untouched, monitor only VETOES the winner and triggers a fallback re-read. Retrieval and verification are separate substrates (Henson #8).
- Critic saga (U12 REPORTS-ONLY, F-check HOLLOW, hv blends): critics judged head SELECTION, never verified retrieved CONTENT vs query. U31 differs: input is [winnerEnc(8), Eqk(12)], label is winner-in-TRUE — content-vs-query verification, not head-choice.
- Appetite saga (E2 APPETITE-FAIL m saturates, E2b CONTROLS-FLAT, E2c SURPRISE-FAIL degenerate mFinal 0/0/0): U31 has NO appetite/momentum — single-pass veto, no dynamics to saturate or degenerate.
- Fallback precedent: U24 after-series (i) kept/fallback split (kept-only SELECT-HARD 0-0.03 both subsets — fallback alone does not fix ranking). U31 differs: fallback is SELECTIVE (veto-gated by monitor), not blanket; SELECTIVE bar (mon vs always-veto) isolates the monitor's contribution.
- Retrieval bed: Henson 1999 (#8: dorsal/right monitoring separate from ventral/right retrieval); Benoit & Anderson 2012 Neuron (PMC3480638, full read: bidirectional reactive loop HC<->DLPFC, substitution = cPFC-midVLPFC retrieval bias, cue-independent trace weakening); Anderson & Hanslmayr 2014 (direct suppression vs substitution, intrusions trigger control); Depue 2012 (three hypotheses/three pathways).

## Design
- Frozen: U28 comp-arm S+C+INH+HF per seed (loads d-newai-self-u28-comp-s{seed}-800st.json, verified COMPLETE). Frozen W6-s / M2-nb-s / U17 teacher / U5-old head / U21 miner / U22c OOD (same loads as U28). Frozen-drift check: retriever params bitwise-identical post-train (maxAbsDrift == 0.0 required, else VOID the seed).
- Trainable: MONITOR head M only — W1 20->8 silu, b1 8, W2 8->1, b2 1, sigmoid out. Init uniform +-0.1 zero-mean, rng 79500+seed*7919+191*131 (fresh family, disjoint).
- Forward (train + eval, codes 191): IDENTICAL retrieval to U28 (u26PoolForward on row slots) then: w1 = argmax(scores); encW = pf.enc[w1*8..+8]; x = [encW(8), Eqk(12)]; p = sigmoid(M(x)). Label y = 1[w1 in TRUE={7,41,129,166,203}].
- Loss (all batch rows, adapt+std): BCE(p, y), M params only, Adam lr5e-3, clip 1.0. NO retriever backward (no grads computed for S/C/INH/HF at all — stronger than stop-gradient: no-touch).
- Diet/streams: IDENTICAL to U28 (8 std + 8 vhat-hard mined per batch B=16, 800st/lr5e-3; train mine 65300+seed 20 tries fallback counted; held-out 66300+seed N=200; std N=200; slot rng 72000+seed*1000+i; OOD frozen scale; miner/oracle probes) so every row is twin-matched to U28 same-seed.
- Arms: ONE arm u31-mon (monitor trained). Eval modes per row: forced (never veto = U28 verbatim), monitor (veto iff p<0.5 -> fallback), always-veto (always fallback). Fallback = recompute softmax/summary/out with w1 excluded (weights renormalized over remaining 249), then vhat->round-2 unchanged.
- 6T (monitor trains) + 6E (3 modes each) + OOD + probes.

## Paper predictions vs bench predictions (divergence-WHY owed)
- Henson #8 predicts DISSOCIATION: monitor discriminates lures (CATCH holds) while retrieval proper is unchanged (SELECT-HARD identical to U28 by construction — verify exact). IF CATCH holds but LIFT fails: file WHY (fallback re-read ranks wrong too — verification without correction, decorative like U12; next: substitution-bias head instead of exclusion-fallback).
- Benoit & Anderson 2012 predicts the reactive loop needs the INWARD leg (HC->DLPFC intrusion signal). Our monitor input (encW + Eqk) has NO explicit intrusion/mismatch feature. Pre-registered risk: MONITOR-BLIND (CATCH fails like Q-USE 0/3) because winner-enc alone carries no lure signal at 8-dim shared encodings. IF BLIND: file WHY (needs mismatch/uncertainty feature — e.g. score-gap, entropy, or HC-analog prediction error — next cell, not a patch here).
- Substitution (B&A cPFC-midVLPFC, A&H 2014): veto+fallback is EXCLUSION-side, not substitution-side; pre-register that even a CATCH+LIFT hold leaves the substitution circuit unbuilt.

## Bars (quorum 2/3 unless noted)
- U31-CATCH: P(veto | top1 notin TRUE) minus P(veto | top1 in TRUE) on hard rows >= +0.20 2/3 (monitor discriminates lures; Henson operationalized).
- U31-LIFT: hardAdaptV_monitor minus hardAdaptV_forced >= +0.05 2/3 (veto corrects answers, not just detects).
- U31-SELMON: hardAdaptV_monitor minus hardAdaptV_alwaysVeto >= +0.03 2/3 (veto is selective; fallback alone is not the mechanism — U24(i) precedent).
- U31-NOHARM-Y: hardAdaptY_monitor >= hardAdaptY_forced(U28 same-seed) minus 0.03 3/3 (round-2 path does not break).
- U31-WALL: hardSelectHit_monitor EXACTLY equals U28 same-seed hardSelectHit 3/3 (sanity: monitor rides on identical retrieval; any mismatch = harness bug, VOID).
- U31-HARD: hardAdaptY_monitor >= 0.60 2/3. U31-STD: two within +-0.05 of W6 two 2/3. U31-SUMMARY-HARD: zero-summary drop >= 0.05 2/3.
- U31-FROZEN: maxAbsDrift of S/C/INH/HF == 0.0 3/3 (no-touch proof). U31-FRESH: battery health 4/4.
- Verdicts: MONITOR-VERIFIES (CATCH + LIFT hold) / MONITOR-DECORATIVE (CATCH holds, LIFT fails) / MONITOR-BLIND (CATCH fails — WHY owed: missing inward/mismatch signal) / VOID (WALL or FROZEN trip).

## Staging + budgets
- Battery on THIS file first (3x sealed, health checks) -> v1.1 pins-only.
- Then grad-check (monitor BCE exact incl. sigmoid; retriever no-touch: grads absent) + stage-1 (u28 harness det + mining identical) + 6T + 6E + verdict d-newai-self-u31-verdict.json. Transcript extras Turn-136 + CHATLOG + CURRENT_TASK. NO PUSH without explicit order.
- Compute: CPU/in-worker only, 6x800st monitor-only trains + evals, resume-safe COMPLETE-gated ledgers.
