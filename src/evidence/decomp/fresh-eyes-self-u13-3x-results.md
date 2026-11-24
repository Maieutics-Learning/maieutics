# Fresh-eyes battery: self U13 pass-2-confidence routing (3x sealed)

Goal line + self-learning framing carried in every prompt. Parallel via root.generateText (Promise.all).

## R1 — NEEDS-PATCH (numerics + ledger + baseline)
1. Flat-logit denominator. ADOPT as pin: mN=(top1−top2)/(max−min+1e-9); flat → 0, defined. Already in design — pinned, no change.
2. Z-score/softmax before margin. REJECT — mN's range-division IS the scale-fairing; raw-gap/softmax-prob are scale-bound, which is the defect mN fixes. Scale report guards.
3. Zero-param COMPLETE ledger. ADOPT: flag `"params":"none-fixed-rule"` in mrule train ledgers — absence of gradients explicit, not masked.
4. Baseline validity (U12 ledgers, no rerun). ADOPT as check: eval streams are pure functions of seed (srng=52500+seed, arng=61000+seed — no train-state leakage); head/base-only accuracies recomputed in-run. Same-seed cross-run comparison valid.

## R2 — NEEDS-PATCH (diet-trap rival)
1. Rule = always-head in disguise (head is adapt specialist). CONFIRMED as the live rival — bars already price it (SELECTIVE needs std-diet flip; USEFUL needs beating best-single). Pin interpretation: pickHead≈1 both diets → head-bias, maps to SEALED-SHUT with mechanism note.
2. Cross-symmetry test (make trunk the specialist for a subset). PARKED to U14 (new diet, needs own prereg) — not blocking U13.
3. KL(head||trunk) as disagreement signal. ADOPT as eval report (KL + agreement-with-margin-pick; eval-only, no mechanics).
4. Random-symmetry baseline. REJECT as redundant — always-head/always-base bars subsume it.

## R3 — NEEDS-PATCH (bars/verdicts)
1. "Collapse to head, 0.03 is noise." Prediction, not patch — bars price exactly this (SELECTIVE + USEFUL fail → SEALED-SHUT). No change.
2. STAGNANT-OSCILLATION (flip-flop on margin noise). ADOPT as interpretation note: high entropyPick + pickAcc ≤ best-single = flipping on noise (fixed rule can't training-oscillate; p2learn covered by U12 STABILITY-FAIL trigger). No new verdict.
3. Hard-sigmoid + temperature annealing. REJECT to post-signal (U12 proved hardness-without-signal quantizes; ROUTER-OPENS graduates to hardness).
4. Symmetry-break penalty (>95% open → cut head LR). REJECT as training mechanics (parked U14+); pick-rate + entropy bars already detect defaulting.

## Adjudication: 3 NEEDS-PATCH → v1.1 REPORTS + PINS (no design change)
- PINS: eps=1e-9 in mN; mrule ledgers flagged zero-param; eval-stream purity (seed-pure, no leakage); diet-trap interpretation (both-diets-1 → head-bias → SEALED-SHUT).
- REPORTS (eval-only): scale ranges; KL(head||trunk) + margin-pick agreement; stagnant-flip note; cross-symmetry parked U14.
- STAND: mrule (fixed normalized-margin pick) + p2learn (soft gate on 8 pass-2 features + beta/dis) + all bars + 4-verdict map.
