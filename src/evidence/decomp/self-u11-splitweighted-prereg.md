# Self U11 delta-prereg: U10-split + adapt-weighted blend (wY 2.0 retest, order fixed) (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. NO PUSH of this file alone — push rides after verdict per user order (push after each model).

## Record-search (already-run / nearest prior / what differs)
- U9 ORDER-FAILS: wY 2.0 confounded by vhat_base (adapt floor both arms) — weighting never fairly tested.
- U10 SPLIT-HEALS-LEVELS/COMPARISON-DECORATIVE: gated vhat restores levels (adaptY 0.53/0.565/0.435, SEL 3/3); VITAL fail (adapt>std 1/3, wrong>right 2/3); wm<0 0/3 (shrunk −0.08/−0.10/−0.25); STD 2/3; cmp==ablate exactly (beta ~0.51 chance starves confidence feature).
- What differs (user order: working unfrozen model + push after each model): EXACT U10-split graph (g_ret → gated vhat → head → g_cmp comparative, beta detached, rest frozen) with wY = isAdapt?2:1 on blend CE, BOTH arms (equal weighting isolates comparison, per U9 v1.1). Tests whether adapt-weight flips wm sign and buys VITAL margin now that the compose pass sees a gated vhat. WEIGHT-TAXES-BASE verdict prices overpay (U10 STD was 2/3 boundary — watch s1).

## Design
- Init per seed: same frozen (W6-s, M2-nb-s, HD=U5-nl-open-s{seed}); RPret fresh + RPcmp fresh RP8 / RP6 ablate (same rng scheme +127/+128 arm codes).
- Forward/loss identical to U10 except blend term wY*CE(blend,y). RPret ← retrieval losses only (detach kept).
- Arms (2×3 = 6T+6E): u11-cmp vs u11-ablate (structural RP6, same wY).
- Evals identical N=200+200 + full U10 report set.

## Bars (quorum 2/3)
- U11-VITAL: g_cmp adapt>std ≥2/3 margin ≥0.05 AND wrong>right ≥2/3.
- U11-SEL: adaptY cmp − base-flat ≥ +0.10.
- U11-STD: two cmp within ±0.05 of W6 3/3 (WEIGHT-TAXES-BASE if SEL holds + STD breaks).
- U11-SIGN: wm > 0 ≥2/3.
- U11-ABLATE: cmp holds while ablate fails (gap ≥0.05 adaptY).
- Verdicts: COMPARATIVE-HOLDS (all — WORKING router; graduate to leak-plug/K-head) / SIGN-FIXED-BLIND (wm>0 but VITAL fails — magnitude short) / STILL-SHUT (wm<0 — weighting insufficient) / WEIGHT-TAXES-BASE (SEL holds, STD breaks).

## Staging + budgets
- Battery on THIS file (3x sealed) → v1.1 pins-only.
- v1.1 CLARIFICATION-ONLY (3x NEEDS-PATCH): s1 = seed 1 note; bars strict ±0.05 unchanged; equal-wY both arms; hard detach kept. REJECTED to U12: bar relaxation, capped constraint, scheduled-detach, RP warmup, neutral-weight ablate.
- Then grad-check + 6T+6E. Ledgers d-newai-self-{u11-cmp,u11-ablate}-s{seed}-800st.json + evals + verdict d-newai-self-u11-verdict.json. Transcript + CHATLOG + CURRENT_TASK. PUSH after verdict per user standing order (push after each model).
