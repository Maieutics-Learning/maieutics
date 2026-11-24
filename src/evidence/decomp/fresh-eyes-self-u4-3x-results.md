# Fresh-eyes battery: self U4 modular split (3x sealed, parallel via root.generateText)

Goal line carried in every prompt.

## R1 — NEEDS-PATCH (verbatim, truncated to 1800 chars in scratch raw)
1. LR asymmetry: lr5e-3 on tiny head+gate → gate saturates/oscillates before head converges (winner-take-all, no nuanced blend). 2. Poisoned-carry risk: head on poisoned h2 with no filter — may map poison, mask base health. 3. Quorum ambiguity: VITAL 2/3 per framing underspecified across gate/open arms; HEAD-WORKS underivable if head needs gate suppression. 4. Baseline gap: SEL vs base-flat only; no frozen-trunk+random-head control to attribute gain to modularity vs +params.

## R2 — NEEDS-PATCH (verbatim, truncated to 1800 chars in scratch raw)
1. Poison-mitigation logic: linear WA*h2 projects poison, doesn't filter; need nonlinear gating/subtraction vs clean reference. 2. SNR 50/50: blend forces adapt head to compete with healthy base; gradients dampened; gate favors baseMean2, head goes dormant. 3. Memorization leak: g=1 forced open arm high-variance → head memorizes standard instead of poison delta. 4. Quorum fragility: 2/3 lenient + STD 0.05 → HEAD-WORKS-GATE-BLIND false positive (consistency, not correctness).

## R3 — NEEDS-PATCH (verbatim, truncated to 1800 chars in scratch raw)
1. Poison paradox: blending healthy base with corrupted signal without scrub → contamination, HEAD-FAILS. 2. STD variance collision: any g>0 leaks untrained-head variance → STD 0.05 mathematically improbable during learning. 3. Quorum ambiguity: framing unit undefined (batch vs seeds) — VITAL unverifiable. 4. Verdict gap: HEAD-WORKS→GATE-BLIND is a spectrum; no null-head control to prove gate does work.

## Adjudication: 3 NEEDS-PATCH → v1.1 AMENDMENT (lr split + quantified triggers; no new arms)
- ADOPT (change): two speeds — adapt head WA/ba lr 5e-3, gate+critic RP lr 1e-3 (R1.1: gate must not saturate before head converges). Global clip 1.0 preserved. This is the battery working as designed (hyperparameter fix pre-compute).
- ADOPT (pin): quorum unit = seeds (s0,s1,s2); VITAL = adapt>std ≥2/3 seeds AND wrong>right ≥2/3 seeds (closes R1.3/R3.3).
- ADOPT (pin): HEAD triggers quantitative — HEAD-WORKS = open adaptY ≥0.7 on ≥2/3 seeds (linear suffices on poisoned h2); HEAD-FAILS = open adaptY <0.5 on ≥2/3 (linear insufficient → U5 nonlinear/scrub head). GATE-BLIND spectrum closed: HEAD high + SEL holds + VITAL fails = HEAD-WORKS-GATE-BLIND (head fixes, router blind); open≈gate on adapt + VITAL fails = gate decorative (subcase logged).
- ADOPT (pin): STD stays strict ±0.05 (variance-collision risk IS the test — GATE-HURTS covers it; relaxing the bar would void modularity's meaning). Dormant-head risk (R2.2) covered by HEAD trigger (open must reach ≥0.7 or HEAD-FAILS). Memorization-leak risk (R2.3) checked descriptively: open standard-two reported (if open holds STD too, head memorized base — logged as leak note).
- REJECT: null-head/random-head control, scrub/subtraction head, warmup (U5 follow-ups). Poison-projection doubt (R2.1/R3.1) is exactly what HEAD-FAILS tests — filed as outcome, not pre-compute fix.
- Raw truncated replies in scratch/fresh-eyes-self-u4-3x.json (1800-char slices; filed honestly as truncated).
