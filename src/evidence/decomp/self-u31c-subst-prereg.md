# Self U31c delta-prereg: substitution-bias head on self-mined diet (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. Pool = sealed reviewer labor only (3x generateText implementability reviews, never training signal). R=3, quorum 2/3, COMPLETE-gated, twin-matched streams (except mining rule, pre-registered delta), paired evals. Corrections append-only. NO PUSH without explicit order.

## Record-search (already-run / nearest prior / what differs)
- U31 MONITOR-BLIND: exclusion-side (veto winner + fallback) failed; forced vhat==e.v 1.0 on miner-mined rows — the miner's failures are NOT our failures at vhat stage. Substitution needs rows where OUR primary is wrong.
- What differs vs ALL prior waves: (1) SELF-MINED diet (keep iff OUR forced vhat != e.v AND oracleY correct) — first diet mined against our own errors; (2) SUBSTITUTION mechanism (B&A cPFC-mid-VLPFC structural match): separate bias pathway toward the alternative, SELECTION BETWEEN competitors, never exclusion of the winner. No veto, no fallback, no abstention.
- U24(i) kept/fallback split: fallback without selection did nothing (SELECT-HARD 0-0.03 both subsets). U31c differs: SUB is a TRAINED bias head choosing between competitors on rows where the primary demonstrably fails.
- Appetite/rehearsal (E2, A1/A2): post-hoc replay dead. U31c is not replay — SUB is a forward-path bias active at retrieval time, trained on our-failure rows.

## Design
- Frozen: U28 comp-arm S/C/INH/HF per seed + W6/M2nb/U5head/U22c (same loads). Miner NOT used for mining (only oracle probe + floor checks). Frozen-drift maxAbsDrift==0.0 required.
- Trainable: SUB head only — WS 28->8 silu, bs 8, WO 8->4 linear, bo 4. Input xs=[Eqk(12), summary(8), hv(4), read(4)] (28-dim; includes the comparison substrate summary-vs-hv/read). out sub=WO*a+bo; ens2 = hv+read+HFout+sub; vhat2=argmax(ens2). Init uniform +-0.1, rng 79700+seed*7919+193*131.
- Loss (all batch rows): CE(ens2, e.v) + MSE(f.out, target) with U28-identical targets/weights (teacher-out adapt w0.5 / zeros std w1.0); SUB params only, Adam lr5e-3, clip 1.0. NO retriever backward.
- Diet/streams: 8 std (identical streams to U28: dataRng/cands/sup scheme) + 8 SELF-MINED hard per batch B=16, 800st. Self-mine: dedicated mineRng 65400+seed (fresh, disjoint from 65300 family), keep iff (forced-vhat(our retriever+HF) != e.v) AND oracleY correct, 20-try cap + fallback counting (same discipline). Held-out: self-mined 66400+seed N=200 + std N=200 twin-matched. OOD frozen scale (forced path).
- SUBSTRATE TRIPWIRE (stage-1, before any train): enrichment probe — 500 self-mine tries per seed, report keep-rate. If keep-rate < 0.10 ANY seed: VOID that seed's arm (no substrate: our vhat fails too rarely to train/select on). If 2/3 VOID: file SUBSTRATE-VOID verdict, no trains.
- Arms: ONE arm u31c-sub (code 193). Eval modes: forced (SUB zeroed = U28 verbatim) / biased (SUB on).
- 6T + 6E + OOD + probes (miner floor recorded but not mined on).

## Paper predictions vs bench predictions (divergence-WHY owed)
- Benoit & Anderson 2012 predicts: a SEPARATE pathway biasing retrieval toward the alternative produces trace-level correction where exclusion failed. Bench: expect SUB-FIX + SUB-LIFT on self-mined rows while miner-mined SELECT-HARD stays flat (different substrate by construction — file the dissociation either way).
- Cue-independence (B&A independent-probe forgetting): our read is single-probe; file as interpretation limit and next-cell test (train-cue vs novel-cue substitution), not a bar here.
- Norman #5 (boundary conditions): substitution should help where the primary is weak (our-fail rows) and not hurt where it is strong (std rows) — SUB-NOHARM operationalizes exactly this.
- Pre-registered risk: SUB memorizes self-mine quirks (small effective diet if keep-rate thin) — held-out self-mined eval + STD holder catch it; file WHY if FIX holds on train-distribution only.

## Bars (quorum 2/3 unless noted)
- U31c-SUBSTRATE: stage-1 self-mine keep-rate >= 0.10 3/3 (else VOID per tripwire).
- U31c-FIX: P(vhat2==e.v | vhat_forced!=e.v) on self-mined held-out >= 0.30 2/3 (substitute corrects our failures at 2x the ~0.15 chance-among-remaining... honest bar: beats forced-zero by construction, so require 0.30 absolute).
- U31c-LIFT: hardAdaptV_biased minus hardAdaptV_forced on self-mined held-out >= +0.10 2/3.
- U31c-NOHARM: std scr_biased >= scr_forced minus 0.03 3/3 (strong where primary is strong — Norman boundary).
- U31c-STD: two within +-0.05 of W6 two 2/3. U31c-HARD-STD: miner-mined hardY_biased >= miner-mined hardY_forced minus 0.03 3/3 (no damage off-substrate; evaluated on U28-identical 66300 streams for comparability).
- U31c-FROZEN: maxAbsDrift == 0.0 3/3. U31c-FRESH: battery health 4/4.
- Verdicts: SUBSTITUTION-WORKS (FIX + LIFT hold) / SUBSTITUTION-DECORATIVE (trains, no LIFT) / SUBSTITUTION-HARMS (NOHARM trips) / SUBSTRATE-VOID (tripwire) / VOID.

## Staging + budgets
- Battery on THIS file first (3x sealed) -> v1.1 pins-only. Then grad-check (CE-through-SUB exact; forced==U28 verbatim check; no-touch) + stage-1 (SUBSTRATE probe + mining identical otherwise) + 6T + 6E + verdict d-newai-self-u31c-verdict.json. Transcript extras Turn-137 + CHATLOG + CURRENT_TASK. NO PUSH without explicit order.
- Compute: CPU/in-worker only, 6x800st head-only trains + evals, COMPLETE-gated.

## v1.1 pins (red-team battery 3x, no design change)
- P1 miner-mined FIX/LIFT report (eval-only, reported, non-binding): on the U28-identical miner-mined 66300 streams already evaluated for HARD-STD, additionally report FIX (P(vhat2==e.v | vhat_forced!=e.v)) and LIFT (biased minus forced hardAdaptV). Tests off-substrate generalization: holds = general bias pathway; holds self-mined but fails miner-mined = diet lookup-table signature (revisit random-diet arm only then).
