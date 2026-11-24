# Fresh-eyes battery: self U10 split-router (3x sealed)

Goal line + self-learning framing carried in every prompt.

## R1 — NEEDS-PATCH
1. Beta leak: blend grads flow through beta into RPret unless detached (contradiction in spec). Fix: hard beta.detach() for g_cmp; RPret ← retrieval losses only. 2. Beta viability: log beta mean/std (RPcmp starves if RPret noisy). 3. Ablate tests two things (no wm/wa + U7 insufficiency) — accepted as structural (that's the point: U7 features for blend).

## R2 — NEEDS-PATCH
1. Same beta leak → hard detach (unanimous 3/3). 2. Beta read-only scalar for RPcmp (same fix). 3. Cache split's vhat/beta into ablate (REJECT — breaks arm independence; twin-matched streams already equate retrieval; RET-BLEND-CONFOUND verdict prices it).

## R3 — NEEDS-PATCH
1. Same beta leak → hard detach (unanimous). 2. Saliency check + 15% split-vs-ablate gap to claim comparison drives (ADOPT as report; verdicts already encode ablate-fails-while-cmp-holds). 3. RPcmp nonlinearity (REJECT — linear+sigmoid is the consistent stack; → U11).

## Adjudication: 3 NEEDS-PATCH → v1.1 PINS
- ADOPT (architectural, unanimous): beta detached (read-only scalar) into g_cmp; RPret updated ONLY by 0.5*CE(ens,v)+0.5*BCE(beta,wrong1); blend CE → RPcmp only (base/head frozen).
- ADOPT (eval-only): beta mean/std + saliency Δ + saturation + corr(m,g)|disagree + 15% split-vs-ablate gap report.
- REJECT to U11: cross-arm vhat caching, RPcmp nonlinearity, dynamic weighting.
