# Self U38 prereg: state-conditioned gate + low-cue arm (PROPOSED; NO COMPUTE until battery + countersign)

Agent approval: this file. CPU/in-worker only. NO GPU. Pool = sealed reviewer labor only (3x generateText implementability reviews, never training signal). R=3 seeds 0/1/2, quorum noted per bar, COMPLETE-gated, twin-matched seed-only streams, paired evals. Corrections append-only. NO PUSH without explicit order.

## User request (verbatim, binding)

"Ok, lets continue running the next steps then"

Reading (context: U38 proposal STANDS after Turn-164 paper re-read + Turn-165 triple-check battery — 3x IMPLEMENTABLE, 3x SELFSERVED=serves, low-cue arm confirmed mandatory): the next step is drafting the U38 prereg + battery. No wave is licensed beyond what this file states.

## Record-search (why this gate, why now)

- Wall: U35 STRUCTURAL (capacity dead weight) → U36 DIET-ONLY (schedule decorative 0/3) → U37 SCHED-ONLY (learned inh[4] hollow, INH-USE 0/3, gaps widened). Global knobs on the scorer cannot separate overlapping engrams (Kim & Kim). Escalation licensed: gate the retrieved *vector* with the system's own *state*, per Zheng #1 + McNab + Liu boundary.
- Papers: Zheng/Wolf/Ranganath/O'Reilly/McKee #1 (gate on PFC STATE, multiplies retrieved vector, shuts on low qk-similarity/expected harm); McNab 2008 (gate preparatory, set from state, predictivity measurable pre-retrieval); Liu et al. boundary (d-a) (heavy cueing SHRINKS state effects — our evals heavily cued, so a low-cue arm is load-bearing, confirmed by Turn-165 R2); Benoit/Anderson bidirectional loop + Anderson 2016 reactive (sequenced follow-ups, NOT this wave); Henson content verifier (sequenced, NOT this wave); Penolazzi ablation discipline (teeth bars, already convention: GATE-USES).
- Bench: prior gates read head OUTPUTS + CE (U4/U8/U10/U11/U12/U24 lineage, all dead); carry c HELD but never a gate input. U38 gate reads [query embedding | within-row carry state] — the signal the papers name — and multiplies the round-2 context vector. First gate with the right signal, right pressure (mismatch), right regime (low-cue), and teeth (forced-open ablation + shuts + predictivity).

## Design

Pinned U33 stack (stackHash 258d2f06…), NO stack surgery. New driver `newai-selfu38-driver.js` (own hash). H48 via u32FreshStack, identical W6 streams (init 73000+seed*7919+76*131, data 42000+seed*104729+55, masks 91000+seed), 800st B16/lr5e-3/K5, C=6, auxW0.5, lam2.0, boot.

- Gate (21 params: w[20], b; init zeros → g=0.5 start, deterministic, filed L3): input = [E[qk] (12-dim query embedding from M.E) | cNew (8-dim round-1 carry-out)], s = w·inp + b, g = sigmoid(s). Context into round-2: cNew' = g · cNew (elementwise). Round-2 forward runs on (x2m, cNew'). Oracle path gated with its own g (arm-consistent scorer). fwd/base-k0 eval has no round-2, ungated.
- Diet (D1 filed deviation from frozen U36-D1: adds a 12.5% mismatch slice so the gate sees shutting pressure; BOTH arms share it, so COMPOSE still isolates the gate): per element roll = dataRng.int(8): 0-3 (50%) W6 base pick-max; 4-5 (25%) OOD qk!=v filtered pick-max; 6 (12.5%) uniform-pick; 7 (12.5%) MISMATCH — clean round-1 on eA (vhat_A, label y_A) but round-2 context from a donor forward on eB (cNew_B), gate input [E[qk_A] | cNew_B]. c0 trains the same rows with the gate fixed open (robustness control, no gate params).
- c0 control: diverse diet + NO gate (U36-c0 equivalent on the extended diet; g≡1, no gate params).
- c1 primary: diverse diet + learned gate (params in the same Adam, init zeros).
- Evals per seed/arm (`d-newai-self-u38-eval-{arm}-s{seed}-800st.json`): standard N=200 shift rows (srng 52500+seed): scr, two, orc (c1: twoOpen = forced-g=1 re-score on same rows; oracle gated arm-consistently); gate stats (c1 only): gClean mean, gSwap mean (cNews swapped i↔N-1-i, same rows re-scored), predictivity split (median-g halves accuracy gap); low-cue N=200 rows (lowrng 52600+seed: 3rd flat-position pair zeroed → target missing w.p. ~1/3): twoLow (+ split halves gap); base-k0 N=200 fF (frng 52400+seed, ungated).
- Paths: trains `d-newai-self-u38-{arm}-s{seed}-800st.json` (P0/P/Gate0/Gate+stackHash), wave0 `d-newai-self-u38-wave0.json`.

## Limitations (pre-registered)

- L1 same-seed only (sweep fragility stands). L2 scalar gate only (21 params; no per-head/per-slot — sequenced if scalar moves). L3 gate init zeros (no init grid — anti-tuning). L4 diet extends U36-D1 with 12.5% mismatch (D1, both arms — COMPOSE still single-variable). L5 H48 only (H96 dead per U35). L6 eval ~2x U36 cost (re-score passes, no extra trains) — in-memory safe (~5 min total).

## Paper predictions vs bench predictions

- State-gate (own, scoped): context gating from the system's own query+state should move two at quorum where global scorer knobs (schedule, learned inh) could not — AND the gate should shut on mismatch, predict success pre-retrieval, and show most under low cue (Liu). WHY owed if: c1 lifts but USES misses (lift rides diet/drift, gate decorative — hollow again) / SHUTS misses (gate never learned mismatch — pressure insufficient) / PREDICTIVITY misses (gate fires but knows nothing — McNab fails) / LOWCUE misses while standard hits (Liu boundary confirmed in our own stack — file it, it reframes U4–U37) / everything misses (scalar state-gating insufficient — file, sequence reactive/content-verifier).

## Bars (quorum 2/3 unless noted)

- U38-PIN: stackHash == 258d2f06… in all 6 ledgers + P0/P/Gate0 present (c1 Gate trained; c0 Gate0=Gate=zeros filed). Miss = HALT.
- U38-COMPOSE (the wall, same diet): two_c1 − two_c0 ≥ +0.05, 2/3 seeds (standard eval).
- U38-ABS: two_c1 − two_canon ≥ +0.05, 2/3 (canon = u33-canon evals scr 0.585/0.58/0.6 two 0.57/0.56/0.49).
- U38-RET: scr_c1 ≥ scr_c0 − 0.03, 2/3.
- U38-ORACLE-CHECK: (orc − two)_c1 ≤ (orc − two)_c0 + 0.02, 2/3.
- U38-GATE-USES (teeth): two_c1 − twoOpen_c1 ≥ +0.02, 2/3 (forced-open ablation, same rows — the gate's shutting carries the effect).
- U38-GATE-SHUTS: gSwap ≤ gClean − 0.20, 2/3 (mismatch rows, means over N=200).
- U38-PREDICTIVITY (McNab): acc(two | g>median) − acc(two | g≤median) ≥ +0.10, standard eval, 2/3.
- U38-LOWCUE: splitLow ≥ +0.05 AND two_c1_low ≥ two_c0_low − 0.03, 2/3 (Liu regime: predictivity must hold where cues are weak, without collapse).
- U38-FLOOR: scr ≥ 0.50, two ≥ 0.45, all 6 standard evals.
- U38-FRESH: battery 3x IMPLEMENTABLE or adjudicated v1.1.
- Verdicts: GATE-WORKS (COMPOSE + ABS + RET + ORACLE-CHECK + USES + SHUTS + PREDICTIVITY + LOWCUE) / GATE-PARTIAL (COMPOSE hit but any other miss — finding, not win) / GATE-DEAD (COMPOSE miss — scalar state-gating insufficient, sequence reactive/content-verifier with this receipt).

## Staging + budgets

- Battery on THIS file first (3x sealed) -> v1.1 pins-only. Then driver + Wave 0 (isolated gate gradcheck absolute + twins incl. gate) + Wave 1 (6T: c0/c1 × 3 seeds) + Wave 2 (6E with re-scores + verdict) + transcript + CHATLOG + CURRENT_TASK. NO PUSH without explicit order.
- Compute: CPU/in-worker only. 6×800st H48 trains + 6 evals (~5 min with re-score passes). NO COMPUTE until battery adjudicated + fresh countersign for Waves 0-2 (this request covers prereg + battery only).
