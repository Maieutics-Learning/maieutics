# Scratch extras-2 v10 — harness-compose of learned subskills (post-verdict extra 2/5)

Agent approval: this file. Countersign: scratch-v10 program (post-verdict extras ≤5; T2 was 1/5, this is 2/5).

## Why
d-scratchx-verdict (ADD-LEARNABLE + RETRIEVE-WALLED): T2 oracle 0.74-0.86 (add learnable given v) but retrieve-into-scratch atrophies under teacher-forcing (copying shortcut). Meanwhile S1 retrieves at 0.78-0.865 on forward queries. Both subskills are LEARNED; no single model holds them in one pass. This extra composes them in the harness with ZERO training: pass-1 = S1 model forward-query (flat+[qk,8]) → v̂; pass-2 = T2 model (flat+[qk,k,v̂,8]) → answer. Filed S1 + T2 params, frozen S1-nested shift tests (52500+seed).

## Bars (quorum 2/3; verdict d-scratchx2-verdict.json)
- HARNESS-COMPOSES: T3 composed >= 0.60 (beats best single 0.585).
- PRODUCT-CHECK (descriptive): composed ≈ retrieve × oracle per seed (independent-subskills model).

## Expectation (filed open)
Composed ~0.6 (0.8 × 0.78 ≈ 0.62): first grade above the 0.585 ceiling — via harness composition of learned parts, not learned composition. PRODUCT-CHECK holds within noise.

## Cost
0 trains + 3 evals (filed models only). Driver: runHarnessCompose. NO PUSH.
