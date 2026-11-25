# Self U36 prereg: diverse-world + dynamic-scorer (PROPOSED; NO COMPUTE until battery + countersign)

Agent approval: this file. CPU/in-worker only. NO GPU. Pool = sealed reviewer labor only (3x generateText implementability reviews, never training signal). R=3 seeds 0/1/2, quorum noted per bar, COMPLETE-gated, twin-matched seed-only streams, paired evals. Corrections append-only. NO PUSH without explicit order.

## User request (verbatim, binding)

"Well, lets add that diverse world and extra parts in. Double checking this is still on memory right?"

Reading: add the two missing pieces from Turn-159 (diverse world + paper machinery), stepwise so it stays falsifiable and in-memory. Memory check answered in chat (durable record intact + CPU/in-worker RAM only + no push/delete). This wave adds ONE extra part (dynamic scorer) on a diverse diet — not all parts at once. Further parts (preparatory gate, reactive abort, monitor, early per-stream gate) stay sequenced follow-ups, each its own prereg.

## Record-search (why this, why now)

- U35 WALLED-AT-SCALE: H96 lifts retrieval (ABS 2/3 via capacity alone) but compose price adds nothing same-width (COMPOSE 0/3: +0.025/-0.025/+0.015). Wall is STRUCTURAL, not capacity. Licensed next = architecture track (slow state / new binding mechanism) with this receipt.
- Papers (inhibition-papers-notes.md): Norman 2007 oscillating inhibition (HIGH→strengthen target, MODERATE→weaken active competitors; dynamics, not shape); Kim & Kim 2025 assembly-specific > global; McNab 2008 preparatory gate; Anderson 2016 proactive vs reactive; Henson 1999 post-retrieval monitor; Nakajima 2019 early per-stream filter; Benoit & Anderson 2012 substitution circuit + bidirectional reactive loop; Penolazzi 2014 facilitation vs inhibition separable (keep SELECT vs SUMMARY barred apart).
- Bench mapping (same file): our scorer is STATIC global softmax (U25 contrastive + U30c top-k were static attempts — dynamic cell unrun). Every gate was proactive post-hoc; reactive abort unrun; monitor judged selection never content; funnel filtered late.
- Diet: U31f 0/4 survivors — rand learns every single-regime substrate. Diverse mixed diet unrun at trunk scale. U34 priced clean signal on a MONO diet (W6 only). U36 mixes the diet AND makes competition dynamic, with arms split so diet-only vs diet+dynamic separates.
- H48 stays (not H96): U35 showed capacity without mechanism is dead weight for compose; H48 keeps ~4x cheaper trains, comparable to canon, in-memory safe.

## Design

Pinned U33 stack (stackHash 258d2f06…, 11 files), NO stack surgery. New driver `newai-selfu36-driver.js` (own hash, not in PIN set). H48 via `inSeqMakeModelH(rng,48)` (same call as U35 parity — already proven). Recipe otherwise identical: 800st, B16/lr5e-3/K5, C=6 pick-max base, auxW0.5, lam2.0, boot, W6 streams (init 73000+seed*7919+76*131, data 42000+seed*104729+55, masks 91000+seed).

- Diverse diet (same 800-step budget, in-RAM): per-batch 50% W6 base rows (canon streams) + 25% R2 interference-heavy + 25% R4 two-hop. R2/R4 row recipes reuse filed U31f regime code (no new stream IDs, no new storage — sampling mix only, seed-driven so twin-matched).
- c0 control: diverse diet + STATIC scorer (exact current pick-max; diet-only effect).
- c1 primary: diverse diet + DYNAMIC scorer (Norman-style): score_i' = score_i − alpha(t)·mean_active_competitors, alpha(t) = base + amp·sin(2πt/period), base 0.15 / amp 0.10 / period 200 steps (filed constants, no tuning in-wave; no new learned params — schedule only, so gradcheck stays first-order).
- Evals: same paired N=200 shift + 200 base-k0 rows/streams as U34/U35 (`d-newai-self-u36-eval-{arm}-s{seed}-800st.json`). New train paths `d-newai-self-u36-{arm}-s{seed}-800st.json`, P0 + stackHash in every ledger.

## Limitations (pre-registered)

- L1 same-seed only (sweep fragility stands). L2 single schedule point (base/amp/period fixed — schedule-finding is a follow-up, not this wave). L3 diet-mix fixed 50/25/25 (mix-finding dead per U34/U35 discipline — no tuning). L4 H48 only (H96 stays dead per U35 — no rescale). L5 dynamic scorer is parameter-free schedule (learned per-slot inhibition is the sequenced follow-up if schedule moves). L6 cost: 6T+6E ≈ U34 cost (~3 min), in-memory safe (no H96 4x blowup, no new stored corpora).

## Paper predictions vs bench predictions

- Dynamic-competition (own, scoped): diverse diet + oscillating competitor penalty should move two at quorum WITHOUT the U34/U35 pattern (positive-but-under / zero). WHY owed if: c0-diverse alone lifts (diet was the blocker, dynamics decorative) / c1 lifts but gap widens (shortcut at scale, L3-style trip) / nothing moves (static→scheduled dynamics insufficient — file, sequence learned per-slot / gate / monitor next) / scr collapses (reallocation, not learning).

## Bars (quorum 2/3 unless noted)

- U36-PIN: stackHash == 258d2f06… in all 6 ledgers + c0/c1 P0 present. Miss = HALT.
- U36-DIET (diet effect): two_c0-diverse − two_canon(H48) reported, no bar (measurement; tells whether world alone moves).
- U36-COMPOSE (the wall, same-diet): two_c1 − two_c0 ≥ +0.05, 2/3 seeds.
- U36-ABS (wall-movement): two_c1 − two_canon ≥ +0.05, 2/3 (canon = u33-canon scr 0.585/0.58/0.6 two 0.57/0.56/0.49).
- U36-RET: scr_c1 ≥ scr_c0 − 0.03, 2/3 (no reallocation).
- U36-ORACLE-CHECK: (orc − two)_c1 ≤ (orc − two)_c0 + 0.02, 2/3.
- U36-FLOOR: scr ≥ 0.50, two ≥ 0.45, all 6 evals.
- U36-FRESH: battery 3x IMPLEMENTABLE or adjudicated v1.1.
- Verdicts: DYN-WORKS (COMPOSE + ABS + RET + ORACLE-CHECK) / DIET-ONLY (COMPOSE miss but DIET lifts — dynamics decorative, diet was blocker) / DYN-PARTIAL (COMPOSE hit but ABS/RET/ORACLE miss) / WALLED-AGAIN (COMPOSE miss, DIET flat — schedule insufficient, sequence next part with this receipt).

## Staging + budgets

- Battery on THIS file first (3x sealed) -> v1.1 pins-only. Then driver + Wave 0 (gradcheck schedule-term + twins) + Wave 1 (6T: c0/c1 × 3 seeds) + Wave 2 (6E + verdict) + transcript + CHATLOG + CURRENT_TASK. NO PUSH without explicit order.
- Compute: CPU/in-worker only. 6×800st H48 trains + 6 evals (~3 min, U34-measured). NO COMPUTE until battery adjudicated + fresh countersign for Waves 0-2 (this request covers prereg + battery only).
