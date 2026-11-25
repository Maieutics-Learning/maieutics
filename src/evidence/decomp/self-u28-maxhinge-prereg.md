# Self U28 delta-prereg: max-hinge on detached INH (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. Pool = sealed reviewer labor only (3x generateText implementability reviews, never training signal). R=3, quorum 2/3, COMPLETE-gated, twin-matched seed-only streams, paired evals. Corrections append-only. Push after verdict per standing order.
Standing orders in force: (a) push after each model; (b) every paper-divergence gets a filed WHY; (c) log everything for contextless replay.

## Record-search (already-run / nearest prior / what differs)
- SELECT wall, all attempts: U22a/b/c 0/3, U23 PRESSURE-FAIL (minerY-wrong mined trunk-bound hop-2, oracle 0.02-0.06), U23b USES-PARTIAL (HARD 3/3, SELECT-HARD 0/3; kept-only split Turn-118: KEPT hardY=hardV=oracle=1.0 yet SELECT-HARD 0-0.03 in BOTH subsets — wall NOT dilution), U24 GATE-FAIL (gate ~0.75 constant, USES 0/3), U25 COMPETITION-FAIL (hinge-means active but strict 0.0 margins negative), U26 COMPETITION-FAIL (shared-MLP INH parked constant, ablation 0.0 all six, gaps <=0.04), U27 DETACHED-PARTIAL (detached INH moves: SEPARATES 2/3 +0.505/+0.057/+0.593, USE 2/3, but SELECT-HARD 0/3 0.355/0.335/0.22, COMPETE 0/3 strict margins -0.019/-0.076/-0.034, SEL 2/3, HARD 3/3, GAP 0/3, STD 3/3).
- Nearest prior U27 (detached selection-only INH + hinge-on-MEANS): identical forward (S+C+INH+HF, slots 250x4 true [7,41,129,166,203], enc silu 4->8, inh softplus MLP 8->4->1 content-only, scores=linear-inh, soft pool tau1.0, combiner 56->24->4), identical diet/streams (8 std + 8 vhat-hard B16 800st lr5e-3 clip1.0, mine 65300+seed, held-out 66300+seed N=200, std N=200 twin-matched, OOD frozen scale, miner/oracle probes, VOID iff oracleY<=0.20 2/3). Detached routing proven (ceZero=true, worstCE 1.09e-5 vs frozen-inh numeric, worstHinge 1.57e-7; full-loss mismatch ~1e-3 BY DESIGN is the stop-gradient — do NOT chase it, U27 D1).
- Diagnosis filed in U27 verdict: means separate but max still wins every row — hinge-on-MEANS (mean(true)-mean(top8), margin 1.0) under-constrains max distractor. To/Cohen: detached selection is teacher-independent (shuf sel 0.34/1.0/0.185) without task-binding. Wall relocalized to means-vs-max + binding.
- Retrieval bed: Kim #5 heterosynaptic E-to-I is winner-suppressive (max-driven), not mean-driven; To #8 / Cohen #9 separable substrates kept (SELECT vs SUMMARY barred apart); Liu #11 boundary carried as interpretation only.
- What differs vs U27: IDENTICAL forward (S+C+INH+HF same inits/code path family, same content-only INH, codes 171 comp / 172 shuf fresh so streams twin-matched and disjoint from U26/U27), IDENTICAL diet/streams/evals, IDENTICAL detached routing (CE/MSE-path stops at INH via u27PoolBackwardCE verbatim; hinge-path flows to S+C+INH), ONE loss delta: hinge-on-MEANS replaced by hinge-on-MAX: Lmax = max(0, margin - (min_true - max_distractor)), margin 1.0, weight 1.0, adapt rows only. Gradients flow to the two extremal slots only (sparsest pressure; S/C/INH all see same two-slot signal on hinge path). No new params, no forward change — isolates PRESSURE-SHAPE (means vs max) with architecture + routing + diet held constant.

## Design
- Frozen: W6-s / M2-nb-s; frozen U17 L* teacher; frozen U5-old head; frozen U21-lowfold miner; frozen U22c-scale OOD. Same loads as U25/U26/U27.
- Trainable: S (shared 4->8) + C (linear w8+b) + INH (MLP 8->4 silu ->1 softplus >=0, init uniform +-0.1 zero-mean) + HF (56->24->4). Same init rng family as U26/U27 but new arm codes 171/172 (rng 78000/78100/79000/78500 + seed*7919 + armCode*131) so streams disjoint.
- Forward (codes 171 comp / 172 shuf): IDENTICAL to U26/U27 (u26PoolForward verbatim).
- Contrastive term (adapt rows only): Lmax = max(0, 1.0 - (min_{i in TRUE} scores_i - max_{j not in TRUE} scores_j)), weight 1.0. dLds: -1.0 on argmin-true, +1.0 on argmax-distractor when violated, else 0. Ties broken by lowest index (deterministic; logged).
- Backward routing: completion path u27PoolBackwardCE (INH untouched); selection path u28ContrastiveBackward (S+C+INH, same code shape as u26ContrastiveBackward but two-slot dLds). Net: S/C see CE+max-hinge; HF sees CE/MSE; INH sees max-hinge ONLY.
- Diet/streams/evals: IDENTICAL to U26/U27 (8 standard + 8 vhat-hard per batch B=16, 800st/lr5e-3/clip1.0; train mine 65300+seed 20 tries fallback counted; held-out 66300+seed N=200; standard N=200 twin-matched; OOD frozen scale; miner/oracle floor/strain; shuf = shift-by-1 slots).
- Arms: u28-comp (true L*) vs u28-shuf (shift-by-1). 6T + 6E + OOD + probes.
- Controls/ablations (eval-only): zero-inh ablation (INHIB-USE); frozen-scale OOD (GAP); miner/oracle probes.

## Paper predictions vs bench predictions (divergence-WHY owed)
- Kim #5 predicts: max-driven suppression should produce competitive exclusion (strict rows open) where means-pressure only separated means. Bench prediction: U28 COMPETE strict fraction and margins rise vs U27 (which had strict 0.0, margins -0.019/-0.076/-0.034) AND SELECT-HARD rises (top-2 follows max-suppression). IF SELECT rises but COMPETE stays 0: file WHY (max-hinge still insufficient — distractor manifold multimodal, single max chases one mode while another wins; needs top-k-max or query-conditioning U28b).
- To #8 / Cohen #9: SELECT vs SUMMARY stay barred apart; max-pressure may move both or neither — file dissociation as observed.
- Sparsity risk pre-registered: two-slot hinge signal is sparser than 13-slot means signal (5 true + 8 dist); S/C may learn slower on hinge path (CE path unchanged, so STD/HARD protected). IF HARD drops vs U27 (0.855/0.685/0.72): file WHY (sparsity tax vs gain trade).
- SEL tripwire unchanged: content-only INH cannot index-memorize; hard-shuf gap catches position cheating.

## Bars (quorum 2/3 unless noted)
- U28-SELECT-HARD: top-2 hit-rate on vhat-hard-heldout >= 0.80 2/3 (THE wall bar).
- U28-COMPETE: strict row fraction (distractor-max < true-min) >= 0.50 2/3 (Kim operationalized, now directly optimized).
- U28-INHIB-USE: zero-inh ablation drop on HARD >= 0.05 2/3 (load-bearing; U27 was 2/3).
- U28-INHIB-SEPARATES: inhDistMean minus inhTrueMean on hard rows >= +0.10 2/3 (Kim signature; U27 was 2/3).
- U28-SEL: hard minus shuf >= +0.05 2/3.
- U28-HARD: adaptY-hard-heldout >= 0.60 2/3.
- U28-GAP: comp minus frozen-U22c-scale >= 0.15 2/3.
- U28-SUMMARY-HARD: zero-summary drop >= 0.05 2/3.
- U28-STD: two within +-0.05 of W6 two 2/3.
- U28-FRESH: battery health 4/4 (goalInAll, nonEmpty, hasVerdict, distinct).
- Verdicts: MAX-COMPETES (SELECT-HARD + COMPETE hold) / MAX-PARTIAL (INHIB-USE + INHIB-SEPARATES hold without SELECT-HARD, or COMPETE holds without SELECT-HARD — pressure proved, binding still open) / MAX-FAIL (SELECT-HARD + COMPETE fail — wall stands past means-vs-max, WHY owed: query-conditioning or encoding-capacity next) / VOID.

## Staging + budgets
- Battery on THIS file first (3x sealed, health checks) -> v1.1 pins-only.
- Then grad-check (detached routing preserved: CE-path INH zero, max-hinge path S/C/INH exact incl. argmin/argmax tie-break) + stage-1 (harness det + oracle floor; mining identical to U26/U27) + 6T + 6E + verdict d-newai-self-u28-verdict.json. Transcript Turn-123 + CHATLOG + CURRENT_TASK. PUSH after verdict per standing order.
- Compute: CPU/in-worker only, ~6x800st trains + evals, resume-safe COMPLETE-gated ledgers.
