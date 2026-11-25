# Self U27 delta-prereg: detached selection-only inhibition (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. Pool = sealed reviewer labor only (3x generateText implementability reviews, never training signal). R=3, quorum 2/3, COMPLETE-gated, twin-matched seed-only streams, paired evals. Corrections append-only. Push after verdict per standing order.
Standing orders in force: (a) push after each model; (b) every paper-divergence gets a filed WHY; (c) log everything for contextless replay.

## Record-search (already-run / nearest prior / what differs)
- U25 (shared-linear scorer + hinge means, margin/weight 1.0): COMPETE strict 0.0 all arms/seeds, margins negative (-0.026 to -0.056), SELECT-HARD 0.025/0.115/0.065. Hinge active (compLossMean ~1.03-1.08) but gap never opens.
- U26 (per-content shared-MLP inhibition subtracted from scores, same hinge): SELECT-HARD 0/3 (0.69/0.13/0.08 — s0 highest selection ever, 1/3 flicker only), COMPETE 0/3 (margins -0.017 to -0.048), INHIB-USE 0/3 (ablation drop 0.0 all six; inhTrueMean~=inhDistMean all seeds: 0.675/0.715, 0.381/0.391, 0.195/0.198). The shared MLP parked at a near-constant offset — nonlinear GLOBAL inhibition, not assembly-specific. CE completion reward (good summary through the linear scorer at constant inhibition) outweighs hinge reward for selectivity: the optimizer ignores the hinge direction.
- Diagnosis filed in U26 verdict: shared weights + joint training = completion washes selection. Two candidate fixes: (B) detach training signals (selection-only plasticity for INH — this spec), (C) query-conditioning (per-episode selectivity via Eqk state — queued U28 if U27 still fails).
- Retrieval bed: Kim #5 heterosynaptic E-to-I is LOCAL (co-activity-driven), not global-error-driven — blocking global CE grad into INH approximates local selection-only plasticity. To #8 / Cohen #9 separable substrates — train separation and completion on separate signals.
- What differs vs U26: IDENTICAL forward (S + C + INH + HF, same inits/code path, same content-only INH, codes 169/170), IDENTICAL diet/streams/hinge (dedicated mine 65300+seed, held-out 66300+seed, margin/weight 1.0, adapt rows only), ONE training-routing delta: CE/MSE-path backward STOPS at INH (stop-gradient — INH frozen on completion path); hinge-path backward flows into S + C + INH unchanged. INH becomes a pure-selection substrate: the only way it moves is by opening the true-vs-distractor gap. No new params, no forward change — isolates TRAINING-ROUTING with architecture and pressure held constant.

## Design
- Frozen: W6-s / M2-nb-s; frozen U17 L* teacher; frozen U5-old head; frozen U21-lowfold miner; frozen U22c-scale OOD. Same loads as U25/U26.
- Trainable: S + C + HF (joint: CE/MSE + hinge) + INH (hinge ONLY). Same inits as U26 (S/C/HF rng 78000/78100/79000-family, INH rng 78500-family with new arm codes 169/170 so streams stay twin-matched and disjoint from U26).
- Forward (codes 169 comp / 170 shuf): IDENTICAL to U26 (slots 250x4, trueIdx [7,41,129,166,203], enc silu 4->8, inh softplus MLP 8->4->1 content-only, scores = linear - inh, soft pool tau 1.0, combiner 56->24->4, ensemble + losses identical).
- Backward routing (the delta):
  - Completion path (CE on ensemble + MSE to teacher): backprop through HF -> summary -> pool weights/scores -> S + C ONLY. INH .g untouched (stop-gradient; implemented as allowINH=false in pool backward for this path).
  - Selection path (hinge on adapt rows only): backprop through scores -> S + C + INH (allowINH=true, identical to U26 contrastive backward).
  - Net effect per step: S/C see CE + hinge (as before); HF sees CE/MSE (as before); INH sees hinge ONLY.
- Diet/streams/evals: IDENTICAL to U26 (8 standard + 8 vhat-hard per batch B=16, 800st/lr5e-3/clip1.0; train mine 65300+seed; held-out 66300+seed N=200; standard N=200 twin-matched; OOD frozen scale; miner/oracle probes; VOID iff oracleY <= 0.20 2/3).
- Arms: u27-comp (true L*) vs u27-shuf (shift-by-1). 6T + 6E + OOD + probes.
- Controls/ablations (eval-only): zero-inh ablation (INHIB-USE — now expected to be LOAD-BEARING); frozen-scale OOD (GAP); miner/oracle floor/strain.

## Paper predictions vs bench predictions (divergence-WHY owed)
- Interference hypothesis (To/Cohen + U26 diagnosis): CE completion gradient is what parked INH at constant. Bench prediction: detached INH MUST move off constant (inhTrueMean != inhDistMean by a clear margin, ablation drop > 0) because its only gradient source rewards gap-opening. IF INH still parks at constant with zero ablation effect under hinge-only training: file WHY — (i) content overlap is truly inseparable at 8-dim shared encodings (matched-noise distractors indistinguishable; needs query-conditioning U28 or wider encodings), (ii) hinge-on-means under-constrains max (needs max-based pressure), (iii) lr/wd regime wrong for 41-param subnet (needs per-subnet lr — file as repair candidate, not silent fix).
- Kim #5: predicts selection-only plasticity should produce feature-selective suppression (inhDist > inhTrue on hard rows). Bench prediction: COMPETE strict fraction and margins rise vs U26 (which had strict 0.0, margins -0.017 to -0.048). IF SELECT rises but COMPETE stays 0: file WHY (means-hinge insufficient — top-8 mean moves while max distractor still wins; licenses max-based hinge U28).
- SEL tripwire unchanged: content-only INH cannot index-memorize; hard-shuf gap catches position cheating.

## Bars (quorum 2/3 unless noted)
- U27-SELECT-HARD: top-2 hit-rate on vhat-hard-heldout >= 0.80 2/3 (THE wall bar).
- U27-COMPETE: strict row fraction >= 0.50 2/3.
- U27-INHIB-USE: zero-inh ablation drop on HARD >= 0.05 2/3 (NOW EXPECTED TO HOLD — detachment makes INH load-bearing or exposes inseparability).
- U27-INHIB-SEPARATES: inhDistMean minus inhTrueMean on hard rows >= +0.10 2/3 (selective suppression, the Kim signature).
- U27-SEL: hard minus shuf >= +0.05 2/3.
- U27-HARD: adaptY-hard-heldout >= 0.60 2/3.
- U27-GAP: comp minus frozen-U22c-scale >= 0.15 2/3.
- U27-SUMMARY-HARD: zero-summary drop >= 0.05 2/3.
- U27-STD: two within +-0.05 of W6 two 2/3.
- U27-FRESH: battery health 4/4.
- Verdicts: DETACHED-COMPETES (SELECT-HARD + COMPETE hold) / DETACHED-PARTIAL (INHIB-USE + INHIB-SEPARATES hold without SELECT-HARD — plasticity proven, pressure insufficient) / DETACHED-FAIL (INHIB-USE fails again — inseparability or regime, WHY owed) / VOID.

## Staging + budgets
- Battery on THIS file first (3x sealed, health checks) -> v1.1 pins-only.
- Then grad-check (detached routing: INH grads hinge-only, S/C/HF full) + stage-1 (harness det + oracle floor; mining identical to U26) + 6T + 6E + verdict d-newai-self-u27-verdict.json. Transcript + CHATLOG + CURRENT_TASK. PUSH after verdict per standing order.
- Compute: CPU/in-worker only, ~6x800st trains + evals, resume-safe COMPLETE-gated ledgers.
