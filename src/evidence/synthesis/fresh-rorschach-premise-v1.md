# Fresh-eyes premise v1 — Detour D2 Rorschach (2026-11-17)

Project: Teaching Small Models to Learn — bench associative recall (h48 tinynn, CPU). New detour D2 (GAMEPLAN DRAFT 2026-11-17, UNCOUNTERSIGNED, v22 frozen untouched): unsupervised pattern-transmission. User rule: NO right/wrong answers anywhere — noise only in, agreement judged but never fed back.

Design: tutor outputs on 1000 uniform-noise lines (vocab 19, matched short/long lengths, seeds frozen) = found patterns. Fresh student distills outputs (imitation, no correctness). Fresh noise → independent labels → agreement vs 3 baselines (chance 0.25, random-init twins = architectural floor, different-noise student = generalization). Matrix: D2-E educated tutor (spelled blob killA 0.96/held 0.96) vs D2-N never-educated tutor (fresh random-init — pure priors). Frozen-first per Conventions: frozen cells fully specified; unfrozen continues same brains (student test-time adaptation named; tutor-side unfrozen needs masked-value self-supervised loss — prerequisite build, out of scope).

Gates pre-frozen: tutor label entropy ≥1.0 bit (max 2.0) else VOID (degenerate = no test, not fail); permuted-pairing control must sit at marginals-chance (else agreement is bias). Bar: input-driven agreement (observed minus permuted) ≥0.20 else no-transmission. E-vs-N contrast is the point.

Context numbers: D1a filed 11 lost/1 mid/0 comp (rho 0.31); tutor generalizes 0.96 held; students shorts 0.78-0.85, longs collapse; swap≈acc (context-following); run-02 FAIL-regimes-unfilled (rho 0.53). Standing: frozen-first convention filed 2026-11-17 (Conventions); snapshot src/gameplan-snapshots/2026-11-17-d1-included-pre-d2.md (26218B; D1 detour added WITHOUT pre-snapshot — rule breach logged, repair = snapshot now before D2).

ASK (barrage): Hammer D2. Verdict + single hardest test/falsifier. <=150 words, numbered. Blunt, terse, technical. No ELI5. Points wanted: degeneracy handling, baseline adequacy (are 3 enough?), bar 0.20 justification, entropy 1.0 threshold, frozen/unfrozen split honesty (is student test-time adaptation really separable?), no-feedback enforceability (what stops leakage from judgment into training across waves?), cheapest next check. Name claims, evidence, missing/contradictory evidence, unverified assumptions.
Caveat: reviewers share one model family as author — checklist, NOT independent confirmation.
