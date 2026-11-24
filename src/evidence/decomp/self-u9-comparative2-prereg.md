# Self U9 delta-prereg: read-restored comparative gate with adapt-weighted objective (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. NO PUSH. R=3, quorum 2/3,
COMPLETE-gated, twin-matched seed-only streams, paired evals. Pool = sealed reviewer
labor only. Corrections append-only.

## Record-search (already-run / nearest prior / what differs)
- U5 HEAD-WORKS-GATE-BLIND: nonlinear head adaptY 0.715/0.73/0.595 (HEAD 2/3); joint gate always-open ~0.71 (STD pressure, VITAL fail).
- U7 THINK-WALL: RP-only on clean head still blind (H/beta/dis insufficient even frozen-in).
- U8 COMPARE-USED-WRONG-SIGN: RP8 comparative first selective gate (corr(m,g)|disagree ≈ -0.97 3/3, shuts ~0.3-0.5, STD HOLDS 3/3 first time) but wm<0 3/3 shuts on confident-disagree (backwards); ablate matches cmp on outcomes. DEVIATION: U8 dropped m2Read retrieval vote (adapt ~0.2 no-retrieval floor, not comparable).
- What differs (user order: continue toward self-learning machine that pulls multiple skills unprompted): (a) RESTORE read: retrieval ens = hvLog + g*readLogits (U5/U7 scoring) so adapt levels compare again; (b) ADAPT-WEIGHTED objective: ce2 weight 2.0 on adapt / 1.0 on standard (same both arms) so confident-disagree on adapt pays to open — directly counters the STD-pressure that taught U8 to shut; (c) ORDER documented: x2m vhat = argmax(hvLog) base guess (frozen, no gate) so head/base compute before gate (gate-after-head requires a gate-free vhat; U5 used gated vhat — this is the honest price of comparison, logged); (d) FRAMING for unprompted multi-skill: this binary router (base + 1 head) is the 2-skill pull mechanism; K-head + self-triggered spawn/prune loop is queued U10, tested unprompted by S4 24h.

## Design
- Init per seed: M=W6-s, MP=M2-nb-s, HD=U5-nl-open-s{seed} frozen, RP8 fresh (rng +123) vs RP6 ablate (structural, U7 features only). Only RP trains (teeth-style), lr1e-3, 800st/B16, mixed 50/50 same streams.
- Forward (both arms): f1 → base vhat0=argmax(hvLog) → f2/baseMean + head ad → m=htTop-btTop, a=agree → g=σ(RP8 cmp) → ens=hvLog+g*read → blend=(1-g)*baseMean+g*ad. Loss = wY*CE(blend,y) + 0.5*CE(ens,v) + 0.5*BCE(beta,wrong1), wY = isAdapt?2:1.
- Arms (2×3 = 6T+6E): u9-cmp vs u9-ablate (structural RP6, same wY — isolates comparison info, not weighting).
- Evals identical N=200+200 + wm/wa/corr/logit/agree reports (U8 set).

## Bars (quorum 2/3)
- U9-VITAL: g adapt-missing > standard ≥2/3 with margin ≥0.05 AND wrong1 > right1 ≥2/3.
- U9-SEL: adaptY cmp − base-flat ≥ +0.10.
- U9-STD: two cmp within ±0.05 of W6 3/3.
- U9-ABLATE: cmp VITAL holds while ablate fails (comparison is the signal).
- U9-SIGN: wm > 0 ≥2/3 (opens on confident-disagree — the U8 inversion fixed).
- Verdicts: COMPARATIVE-HOLDS (VITAL+SEL+STD+SIGN — unfrozen-free working router; proceed U10 K-head + self-trigger) / SIGN-FIXED-BLIND (wm>0 but VITAL fails — direction fixed, magnitude short) / STILL-SHUT (wm<0 again — weighting insufficient, need asymmetric gate bonus) / WEIGHT-TAXES-BASE (SEL holds but STD breaks — 2.0 overpays).

## Staging + budgets
- Battery on THIS file (3x sealed) → v1.1 pins-only.
- v1.1 CLARIFICATION-ONLY (3x NEEDS-PATCH): both arms share wY (delta isolates comparison); RP sees scalars only (no vhat identity); saliency Δ + saturation + corr logged eval-only. REJECTED to U10: dynamic weighting, stochastic base, cross-matrix arms. WEIGHT-TAXES-BASE verdict prices overpay.
- Then grad-check + 6T+6E. Ledgers d-newai-self-{u9-cmp,u9-ablate}-s{seed}-800st.json + evals + verdict d-newai-self-u9-verdict.json. Transcript + CHATLOG + CURRENT_TASK. NO PUSH.
