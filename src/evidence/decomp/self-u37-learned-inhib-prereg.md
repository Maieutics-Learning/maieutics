# Self U37 prereg: learned per-class inhibition (PROPOSED; NO COMPUTE until battery + countersign)

Agent approval: this file. CPU/in-worker only. NO GPU. Pool = sealed reviewer labor only (3x generateText implementability reviews, never training signal). R=3 seeds 0/1/2, quorum noted per bar, COMPLETE-gated, twin-matched seed-only streams, paired evals. Corrections append-only. NO PUSH without explicit order.

## User request (verbatim, binding)

"go ahead"

Reading (context: U36 DIET-ONLY closed; assistant named the sequenced next parts — learned per-slot inhibition, preparatory gate, monitor — each its own prereg): proceed with the next single part. This prereg IS that step: learned inhibition, diet held constant. No wave is licensed beyond what this file states.

## Record-search (why learned inhibition, why now)

- U36 DIET-ONLY: diverse diet shuffles the wall (dDiet +0.025/-0.055/+0.055, no quorum direction); scheduled dynamics decorative same-diet (COMPOSE 0/3: -0.02/+0.01/+0.03); gaps shrank (ORACLE 3/3) with retention held (RET 3/3). Schedule without learning is dead weight — the licensed escalation is LEARNING the competition weights on the same diet.
- Papers: Norman 2007 dynamics (HIGH sharpens, MODERATE weakens competitors) + Kim & Kim 2025 assembly-specific > global + Penolazzi 2014 facilitation vs inhibition separable (ablation discipline = the teeth test). U36 built the schedule slot; U37 puts learnable weights in it (4 params, per-class), with a forced-zero ablation bar so a hollow mechanism cannot pass.
- Bench lineage: U25/U30c static attempts failed; U36 scheduled attempt failed at quorum; U26/U27/U28 INH work showed selection needs teeth bars (USE/ablation). U37 is the trunk-scale version: same diverse diet both arms, one variable (scheduled vs learned scorer).
- Sequenced follow-ups stay OUT: preparatory gate (McNab), reactive abort (Anderson 2016), monitor (Henson), early per-stream filter (Nakajima). Each its own prereg if U37 walls.

## Design

Pinned U33 stack (stackHash 258d2f06…), NO stack surgery. New driver `newai-selfu37-driver.js` (own hash). H48 via u32FreshStack, identical W6 streams (init 73000+seed*7919+76*131, data 42000+seed*104729+55, masks 91000+seed), 800st B16/lr5e-3/K5, C=6, auxW0.5, lam2.0, boot. Diverse diet = U36 D1 standard (50% W6 pick-max / 25% OOD qk!=v filtered pick-max / 25% uniform-pick; labels standard y/v; same-seed diet sequences identical across arms).

- Learned weights: inh[4], init 0.15 each (the U36 eval time-average — learning starts where schedule ended). Stored as a 5th param block alongside P (ledger fields Inh0/Inh, own Adam updates via the same opt.step(params) call — params list extended, no optimizer change).
- c0 control: diverse diet + SCHEDULED scorer (U36-c1 recipe verbatim: alpha(t)=0.15+0.10*sin(2πt/200) train, eval alpha=BASE 0.15).
- c1 primary: diverse diet + LEARNED scorer: adjusted_o = mean_o − inh[o]·(K−cnt_o)/K (cnt from head argmax votes, stop-gradient on cnt; inh trained through the CE grad). Eval uses learned inh; ablation pass re-scores the same rows with inh zeroed (no retrain).
- Evals: same paired N=200 shift + 200 base-k0 rows/streams (`d-newai-self-u37-eval-{arm}-s{seed}-800st.json`), each reporting accTwo + accTwoAbl (inh-zeroed; c0 ablation = scheduled-vs-zero, informational only — bar applies to c1).
- Paths: trains `d-newai-self-u37-{arm}-s{seed}-800st.json` (P0+P+Inh0+Inh+stackHash), wave0 `d-newai-self-u37-wave0.json`.

## Limitations (pre-registered)

- L1 same-seed only (sweep fragility stands). L2 4-param per-class only (no per-head/per-slot/learned-schedule — sequenced if this moves). L3 inh init 0.15 fixed (no init grid — anti-tuning). L4 diet fixed to U36 D1 (no diet-finding). L5 H48 only (H96 stays dead per U35). L6 cost = 6T+6E ≈ U36 (~3 min, in-memory safe; ablation is a re-score pass inside eval, no extra trains).

## Paper predictions vs bench predictions

- Learned-competition (own, scoped): learnable per-class suppression on a diverse diet should move two at quorum where the fixed schedule could not. WHY owed if: c1 lifts but ablation does NOT drop (hollow — diet or drift carries it, not inh) / nothing moves (4-param competition insufficient — file, sequence gate/monitor) / scr collapses (reallocation) / gap widens (shortcut).

## Bars (quorum 2/3 unless noted)

- U37-PIN: stackHash == 258d2f06… in all 6 ledgers + P0/P/Inh0 present. Miss = HALT.
- U37-COMPOSE (the wall, same diet): two_c1 − two_c0 ≥ +0.05, 2/3 seeds.
- U37-ABS: two_c1 − two_canon ≥ +0.05, 2/3 (canon = u33-canon evals 0.585/0.58/0.6 scr, 0.57/0.56/0.49 two).
- U37-RET: scr_c1 ≥ scr_c0 − 0.03, 2/3.
- U37-ORACLE-CHECK: (orc − two)_c1 ≤ (orc − two)_c0 + 0.02, 2/3.
- U37-INH-USE (teeth, load-bearing): c1 accTwo − accTwoAbl ≥ +0.03, 2/3 (learned weights carry the effect; forced-zero ablation on the same rows).
- U37-FLOOR: scr ≥ 0.50, two ≥ 0.45, all 6 evals.
- U37-FRESH: battery 3x IMPLEMENTABLE or adjudicated v1.1.
- Verdicts: LEARN-WORKS (COMPOSE + ABS + RET + ORACLE-CHECK + INH-USE) / LEARN-PARTIAL (COMPOSE hit but ABS/RET/ORACLE/INH-USE miss — finding, not win) / SCHED-ONLY (COMPOSE miss — learned 4-param insufficient, sequence next part with this receipt).

## Staging + budgets

- Battery on THIS file first (3x sealed) -> v1.1 pins-only. Then driver + Wave 0 (isolated learned-term gradcheck + twins incl. Inh) + Wave 1 (6T: c0/c1 × 3 seeds) + Wave 2 (6E with ablation + verdict) + transcript + CHATLOG + CURRENT_TASK. NO PUSH without explicit order.
- Compute: CPU/in-worker only. 6×800st H48 trains + 6 evals ≈ U36 (~3 min). NO COMPUTE until battery adjudicated + fresh countersign for Waves 0-2 (this request covers prereg + battery only).
