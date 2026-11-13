# Fresh-eyes battery v1: evo-vs-fade conclusion (2026-11-13)

Premise (frozen): `src/evidence/synthesis/evo-fade-premise-v1.md` v1.0.
Raw replies (tmp): `scratch/fresh-eyes-evo-fade-v1-raw.json` (regenerable: 10 sealed briefs in one page_eval Promise.all; re-run recipe in working record).
Free pack (tmp): `scratch/evo-fade-search-pack.json` (10 agent-side DDG queries, 40 sources, shared with all 10).
Method: 6 support (verify) + 4 red-team (kill-shots), each ran 2 OWN superFetch DDG searches + 1 primary read, then generateText verdict (<=150 words). All 10 reported; all own-searches returned 3 hits, 0 errors.

## Tally
- Support: 6/6 HOLDS (ids 1-6).
- Red-team: 4/4 BREAKS (ids 7-10).
- Score: 6 HOLDS / 4 BREAKS. No unanimous steelman; not barren (4 adoptions) → patch once, re-run battery on v2 later.

## Adjudication (owner's ruling; rejects are data)
1. Id1 support HOLDS + zero-hint baseline (fixed-mix, no fading; if S ignites >4/8, schedule claim breaks). Ruling: ACCEPT test (queued-a). Note: reviewer mislabels C-arm as "weight-mutation" — C was bridge-training, not mutation (premise hygiene fix in v2).
2. Id2 support HOLDS + same-budget mutation-vs-fade duel. Ruling: ACCEPT (queued-b; from-scratch evolution already ruled out, but explicit same-CPU duel is the fair receipt).
3. Id3 support HOLDS + cold-start transfer on a novel rule-set. Ruling: ACCEPT (queued-c, merged with 6/10).
4. Id4 support HOLDS + mutation-only 50k-param duel. Ruling: PARTIAL, merged into queued-b.
5. Id5 support HOLDS + frozen single-tutor ablation (is the diverse bench needed?). Ruling: ACCEPT (queued-d — sharpest support-side test).
6. Id6 support HOLDS + zero-shot novel key-pair mutation-vs-fade. Ruling: PARTIAL, merged into queued-c.
7. Id7 red BREAKS (ES wins sparse-reward MuJoCo; fading = reward shaping). Ruling: REJECT as break — different regime (no tutor, no gradients, sparse reward). Claim is regime-bound to supervised tiny assoc-recall with a working T0. Grain ACCEPTED: where no tutor/gradients exist, ES is the right tool — state scope explicitly in v2.
8. Id8 red BREAKS (G~=S implicates schedule not method; CMA-ES on fade params, weights frozen). Ruling: PARTIAL — actually agrees with conclusion; proposed experiment IS the queued outer-loop. ACCEPT experiment (queued-e), reclassify as support.
9. Id9 red BREAKS (PBT evolves weights+hparams jointly; tiny task may not generalize; PBT-lite: pop 10, exploit top-2, explore weights+fade). Ruling: PARTIAL — ACCEPT PBT-lite (queued-f) as the fair joint test at CPU scale; blind weight-mutation alone stays ruled out.
10. Id10 red BREAKS (chains = simplicity-bias collapse; cross-chain swap on novel complex rules). Ruling: ACCEPT test (merged into queued-c); warning logged — inversion seeds 206-208 (S beats G, same tutor) already hint chains can degrade. Sharpens conclusion toward single-learner + bench.

## Patch applied to conclusion (v1 → v2)
Core HOLDS (6/6 support, 2/4 red reclassified as support/partial): don't evolve weight dials; teach fixed-mix + fading hints; single learner; diverse bench; outer-loop evolution only.
Changes: (i) scope sentence added — regime-bound (dense gradients + working tutor); ES/PBT correct where no tutor/gradients/sparse reward; (ii) queued cheap CPU tests: (a) zero-hint fixed-mix baseline, (b) same-budget mutation duel, (c) novel-rule transfer probe (cold-start + cross-chain swap), (d) frozen single-tutor ablation, (e) CMA-ES on fade params (weights frozen), (f) PBT-lite pop-10; (iii) bias-amplification warning (chains can degrade → prefer single learner).
Adoptions: 4 rounds' worth in one battery (tests a/c/d/e/f + scope fix). Next: run queued tests cheapest-first (d, a), then re-run battery on v2.
