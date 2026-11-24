# Fresh-eyes battery: self U14 EWC-anchored unfrozen training (3x sealed)

Goal line + self-learning framing carried in every prompt. Parallel via root.generateText (Promise.all).

## R1 — NEEDS-PATCH (Fisher noise + λ scale)
1. N=200 undersampled for 20k params. ADOPT in part: N=400 (same code, ~2x cheap compute); REJECT moving-average Fisher (online EWC = new mechanics → U15).
2. λ=100 napkin. ADOPT as report: penalty/loss ratio logged every 100st (already in design); REJECT grid-search (budget — needs extra arms; U15 if UNPROTECTED/S-TIGHT).
3. Mean-normalization non-standard. REJECT with reason: raw squared-grads span ~1e6 across layers (E vs heads); unnormalized λ is meaningless; mean-norm makes λ interpretable (penalty ≈ λ/2·Σ drifts, self-limiting from zero). Penalty added pre-Adam (adaptive optimizer absorbs absolute scale; ratio report is the guard). Documented, no change.
4. U1 recipe reuse (diet/masks/streams/clip, gate path only). CONFIRMED valid twin-matching.

## R2 — IMPLEMENTABLE (conceptual address + killer measure)
1. EWC creates a stiff landscape (cost to move in Fisher directions); adapt must win explicitly where it conflicts. CONFIRMED as answering the wound.
2. Modularity-by-another-name risk (soft mask conceding shared capacity). Accepted: PROTECTED bars require BOTH skills live — whatever the geometry, joint use is demonstrated, not assumed.
3. Killer gradient-alignment cosine cos(∇L_base, ∇L_adapt) at endpoint. ADOPT as eval report (32+32 episodes, recomputed grads, no steps; eval-only).

## R3 — NEEDS-PATCH (bars/verdicts)
1. VOID-CHECK redundant if gap wide. REJECT removal — cheap sanity against diet drift; guards the whole comparison.
2/3. Missing S-TIGHT (STD holds + ADAPT<0.80 = rigid, not protected). ADOPT as verdict: STD-HELD true but adapt < 0.80 → S-TIGHT (over-constrained; λ too high).
4. Adaptive λ. REJECT (new mechanics; ratio report + U15 sweep cover it).

## Adjudication: 3 NEEDS-PATCH → v1.1 (no design change except noted)
- PINS: Fisher N=400 (not 200); λ=100 fixed + ratio-guarded; mean-norm kept (scale argument); VOID-CHECK kept.
- REPORTS (eval-only): penalty/loss ratio curve; F̂-weighted + unweighted drift; gradient-alignment cosine; Fisher concentration stats.
- VERDICT ADD: S-TIGHT trigger (STD holds, adapt<0.80). Map: PROTECTED / ANCHORED-ONLY / UNPROTECTED / S-TIGHT / VOID.
- STAND: u14-plain vs u14-ewc, gate path only, 800st/B16/lr5e-3, 6T+6E.
