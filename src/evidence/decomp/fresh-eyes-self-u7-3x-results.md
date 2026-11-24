# Fresh-eyes battery: self U7 teeth on frozen nonlinear head (3x sealed)

Goal line carried in every prompt.

## R1 — IMPLEMENTABLE (isolation sound; 3 notes)
1. Cross-seed check (already 3 seeds quorum — clarified, no change). 2. Cost-to-open sparsity (REJECT — always-open IS the measured finding via VITAL; changing loss changes the question). 3. 10x-LR sensitivity burst on fail (REJECT — extra compute; park U8).

## R2 — NEEDS-PATCH
1. Tri-arm (MISREAD — 3T+3E already = 3 seeds × 1 arm with seed-quorum; clarified v1.1). 2. Two-phase warmup (REJECT — RP-only on frozen head has no moving target; 800st sufficed U3 RP-only). 3. Symmetry/mirror head (REJECT — new arm; park U8).

## R3 — NEEDS-PATCH
1. Twin-track RP-fresh + RP-wounded (REJECT as new arm — fresh is cleaner since U5 joint RP is always-open-biased; wounded-track parked U8). 2. Random-gate control (REJECT — base-flat + U5-gate joint already the controls). 3. 3×800st + decay (REJECT — budget fixed 800st U-series).

## Adjudication: 1 IMPLEMENTABLE + 2 NEEDS-PATCH(misread/new-arms) → v1.1 CLARIFICATION-ONLY (no design change)
- PIN: 3T+3E = one arm × 3 seeds, quorum across seeds (R2.1 misread closed).
- Keep fresh RP, 800st/B16/lr1e-3, mixed 50/50, no sparsity penalty, no extra arms/bursts.
