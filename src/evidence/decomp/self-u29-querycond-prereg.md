# Self U29 delta-prereg: query-conditioned inhibition (PROPOSED; pre-countersigned, battery next)

Agent approval: this file. Pre-countersignature (user 2026-11-25): this spec + battery (3x sealed) + driver ext + stage-1 + 6T+6E + verdict + up to 2 gap-closing extras under same bars/discipline. CPU/in-worker only. NO GPU. NO PUSH without explicit order. Pool = sealed reviewer labor only (never training signal). R=3 seeds 0,1,2, quorum 2/3, COMPLETE-gated, twin-matched seed-only streams, paired evals. Corrections append-only.
Standing orders in force: (a) push after each model only on order; (b) every paper-divergence gets a filed WHY; (c) log everything for contextless replay.

## Record-search (already-run / nearest prior / what differs)
- SELECT wall: U22a/b/c 0/3, U23 PRESSURE-FAIL, U23b USES-PARTIAL (SELECT-HARD 0/3; kept-only split SELECT 0 — wall NOT dilution), U24 GATE-FAIL (scalar gate ~0.75 constant, USES 0/3), U25 COMPETITION-FAIL (strict 0.0), U26 COMPETITION-FAIL (INH parked constant, ablation 0.0), U27 DETACHED-PARTIAL (SEPARATES 2/3, USE 2/3, SELECT-HARD 0/3 0.355/0.335/0.22, COMPETE 0/3), U28 MAX-PARTIAL (SEPARATES 2/3 +0.681/-0.090/+0.697, USE 2/3 0.155/0.045/0.10, SELECT-HARD 0/3 0.235/0.07/0.36, COMPETE 0/3 margins -0.022 to -0.028 unmoved, SEL 2/3, HARD 3/3, GAP 0/3, STD 3/3).
- Diagnosis filed in U28 verdict: max-pressure installs selective use without competitive exclusion. Means separate but max still wins every row — pressure-shape insufficient. Filed next: query-conditioning or wider encodings.
- Retrieval bed: Kim #5 winner-suppressive E-to-I is input-specific (assembly + query context), not content-only; Zheng #1 gate reads PFC STATE (goal + query-key), not head output; To #8 / Cohen #9 separable substrates kept (SELECT vs SUMMARY barred apart); Liu #11 low-cue boundary carried as interpretation.
- What differs vs U28: IDENTICAL diet/streams/evals/routing/loss-shape (detached CE + max-hinge Lmax margin 1.0 adapt-only, codes 173/174 fresh, train mine 67300+seed, held-out 68300+seed N=200, std N=200 twin-matched, OOD frozen scale, miner/oracle probes, VOID iff oracleY<=0.20 2/3), IDENTICAL S/C/HF family, ONE forward delta: INH becomes query-conditioned. U28 INH input = enc(8) content-only. U29 INH input = [enc(8) | Eqk(12)] (20-dim), MLP 20->8 silu ->1 softplus >=0, init uniform +-0.1 zero-mean. Scores = linear - inh as before, soft pool tau1.0, combiner 56->24->4. No new loss, no diet change — isolates CONDITIONING (content-only vs content+query) with pressure + routing + diet held constant.

## Design
- Frozen: W6-s / M2-nb-s; frozen U17 L* teacher (true-20 linkOut*); frozen U5-old head; frozen U21-lowfold miner head per seed; frozen U22c-scale head per seed (OOD control). Same loads as U26/U27/U28.
- Trainable: S (shared 4->8, same init family, new arm codes 173/174 rng 78000/78100/79000/78510 + seed*7919 + armCode*131) + C (linear w8+b) + INH-Q (MLP 20->8 silu ->1 softplus, init uniform +-0.1 zero-mean) + HF (56->24->4).
- Forward (codes 173 comp / 174 shuf): u26PoolForward verbatim EXCEPT inh branch: for each slot i, x_inh = [enc_i(8) | Eqk(12)] where Eqk = M.E.v[qk*12:(qk+1)*12] (same Eqk as carry convention, query of THIS episode, not label). inh_i = softplus(MLP(x_inh)). scores_i = C(.), scores_i -= inh_i. Rest identical (softmax tau1.0, summary, combiner).
- Contrastive term (adapt rows only): Lmax = max(0, 1.0 - (min_true - max_distractor)), weight 1.0, two-slot dLds (argmin-true -1.0, argmax-dist +1.0 on violation, lowest-index tie-break deterministic logged). Backward routing: CE/MSE-path stops at INH (u27PoolBackwardCE verbatim, extended to INH-Q shapes); max-hinge path to S+C+INH-Q.
- Diet/streams/evals: IDENTICAL to U28 (8 std + 8 vhat-hard per batch B=16, 800st/lr5e-3/clip1.0; mine 67300+seed 20 tries fallback counted; held-out 68300+seed N=200; standard N=200 twin-matched; OOD frozen scale; miner/oracle floor/strain; shuf = shift-by-1 slots; LOW-CUE rows = same held-out episodes with support truncated to first 2 entries, deterministic).
- Arms: u29-comp (true L*) vs u29-shuf (shift-by-1). 6T + 6E + OOD + probes.
- Controls/ablations (eval-only): zero-inh ablation (INHIB-USE); zero-query ablation (Eqk zeros at eval, same rows: tests query-conditioning load); frozen-scale OOD (GAP); miner/oracle probes.

## Paper predictions vs bench predictions (divergence-WHY owed)
- Kim #5 + Zheng #1 predict: query-conditioned inhibition should open strict rows where content-only max-hinge did not (U28 COMPETE 0.0 strict, margins -0.022..-0.028; SELECT-HARD 0/3). Bench prediction: U29 COMPETE strict fraction and margins rise vs U28 AND SELECT-HARD rises. IF SELECT rises but COMPETE stays 0: file WHY (conditioning helps ranking but not exclusion — distractor manifold multimodal, needs top-k-max U29b). IF COMPETE rises but SELECT stays 0: file WHY (exclusion without ranking — pool tau or combiner at fault, not INH).
- To/Cohen: SELECT vs SUMMARY barred apart; conditioning may move both or neither — file dissociation as observed.
- Overfit risk pre-registered: Eqk is episode-specific; content-only SEL tripwire unchanged (hard-shuf gap catches position cheating); zero-query ablation must hurt on HARD (else conditioning decorative like U24 gate). IF zero-query drop ~0: file WHY (INH ignores query — capacity or pressure at fault).
- Sparsity carried: two-slot hinge signal sparse (CE path unchanged, STD/HARD protected). IF HARD drops vs U28 (0.855/0.685/0.72): file WHY (conditioning tax vs gain trade).

## Bars (quorum 2/3 unless noted)
- U29-SELECT-HARD: top-2 hit-rate on vhat-hard-heldout >= 0.80 2/3 (THE wall bar).
- U29-COMPETE: strict row fraction (distractor-max < true-min) >= 0.50 2/3.
- U29-INHIB-USE: zero-inh ablation drop on HARD >= 0.05 2/3.
- U29-Q-USE: zero-query ablation drop on HARD >= 0.05 2/3 (conditioning load-bearing).
- U29-INHIB-SEPARATES: inhDistMean minus inhTrueMean on hard rows >= +0.10 2/3.
- U29-SEL: hard minus shuf >= +0.05 2/3.
- U29-HARD: adaptY-hard-heldout >= 0.60 2/3.
- U29-GAP: comp minus frozen-U22c-scale >= 0.15 2/3.
- U29-SUMMARY-HARD: zero-summary drop >= 0.05 2/3.
- U29-STD: two within +-0.05 of W6 two 2/3.
- U29-FRESH: battery health 4/4 (goalInAll, nonEmpty, hasVerdict, distinct).
- Verdicts: Q-COMPETES (SELECT-HARD + COMPETE hold) / Q-PARTIAL (USE + SEPARATES + Q-USE hold without SELECT-HARD, or COMPETE holds without SELECT-HARD) / Q-FAIL (wall stands past conditioning, WHY owed: encoding-capacity or top-k next) / VOID.

## Staging + budgets
- Battery on THIS file first (3x sealed, health checks) -> v1.1 pins-only.
- Then grad-check (detached routing preserved: CE-path INH-Q zero, max-hinge path S/C/INH-Q exact incl. tie-break; query branch numeric included) + stage-1 (harness det + oracle floor) + 6T + 6E + verdict d-newai-self-u29-verdict.json. Transcript + CHATLOG + CURRENT_TASK. PUSH only on explicit order.
- Compute: CPU/in-worker only, ~6x800st trains + evals, resume-safe COMPLETE-gated ledgers.
- Extras pre-countersigned (max 2, same discipline, mini-prereg + battery before compute): U29b top-k-max hinge (if max chases one mode while another wins); U29c low-cue-only diet (if Liu boundary holds and cued rows mask the gain).
