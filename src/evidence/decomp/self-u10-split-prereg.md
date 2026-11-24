# Self U10 delta-prereg: split-router (g_ret for retrieval, g_cmp comparative for blend) (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. NO PUSH. R=3, quorum 2/3,
COMPLETE-gated, twin-matched seed-only streams, paired evals. Pool = sealed reviewer
labor only. Corrections append-only.

## Record-search (already-run / nearest prior / what differs)
- U5 HEAD-WORKS-GATE-BLIND: nonlinear head adaptY 0.715/0.73/0.595 (HEAD 2/3); joint single gate always-open ~0.71 (one gate does retrieval + blend, retrieval openness leaks into blend).
- U7 THINK-WALL: RP-only on clean head blind (H/beta/dis insufficient for blend, but retrieval worked open).
- U8 COMPARE-USED-WRONG-SIGN: RP8 comparative selective-shut (corr -0.97), STD holds 3/3, wm<0 (STD pressure teaches shut).
- U9 ORDER-FAILS: vhat0=argmax(hvLog) base guess wrong on adapt → f2/head wrong → adapt floor both arms (0.205/0.165/0.145); wm<0 persists; no weight-tax. Circular dependency: compose needs gated vhat, comparison needs head.
- What differs (user order: working unfrozen model): SPLIT the router. g_ret (RP6/U7 features, pass-1 only) routes retrieval ens=hvLog+g_ret*read → gated vhat (U5 order, openness harmless for retrieval) → f2/head/baseMean → g_cmp (RP8 comparative H/beta/dis+m+a) routes blend ONLY. Each gate's inputs support its job; no gate-free vhat anywhere. wY back to 1.0/1.0 (U9 proved 2.0 neither flips sign nor taxes; drop it to isolate the order fix).

## Design
- Init per seed: M=W6-s, MP=M2-nb-s, HD=U5-nl-open-s{seed} frozen; RPret fresh (rng +125), RPcmp fresh RP8 (rng +126) / RP6 ablate twin (rng +126 same draws, fewer params).
- Forward: f1 → g_ret → ens → vhat → f2 → baseMean + ad → m,a → g_cmp → blend. Loss = CE(blend,y) + 0.5*CE(ens,v) + 0.5*BCE(beta,wrong1) (beta from RPret critic? Use ONE critic on RPret (retrieval-side wrong1); RPcmp has no critic (pure router). RPret = Wc/bc/we/wb/wd/b (53); RPcmp = we/wb/wd/wm/wa/b + tiny Wc? No — RPcmp needs no critic: inputs H/beta/dis (beta from RPret critic, frozen value, no grad into RPret from blend path? Allow grad: beta is a scalar feature; blend gate grads flow into RPcmp only, not back into RPret critic (stop-grad on beta for cmp path — document).
- Arms (2×3 = 6T+6E): u10-split (RPret + RPcmp) vs u10-ablate (RPret + RP6-blend, U7 features, no wm/wa — same retrieval, tests comparison info for blend).
- Evals identical N=200+200 + wm/wa/corr/logit/agree/saliency (U8/U9 set) for g_cmp + g_ret means.

## Bars (quorum 2/3)
- U10-VITAL: g_cmp adapt-missing > standard ≥2/3 with margin ≥0.05 AND wrong1 > right1 ≥2/3 (blend router selective, right sign).
- U10-SEL: adaptY split − base-flat ≥ +0.10.
- U10-STD: two split within ±0.05 of W6 3/3.
- U10-SIGN: wm > 0 ≥2/3 (opens on confident-disagree — the U8/U9 inversion fixed).
- U10-ABLATE: split VITAL holds while ablate fails (comparison is the signal, both with working retrieval).
- Verdicts: COMPARATIVE-HOLDS (VITAL+SEL+STD+SIGN — WORKING unfrozen-free router; proceed U11 leak-plug / K-head) / SIGN-FIXED-BLIND (wm>0 but VITAL fails) / STILL-SHUT (wm<0 again — comparison insufficient even ordered) / RET-BLEND-CONFOUND (ablate also holds — retrieval openness, not comparison, drives gain).

## Staging + budgets
- Battery on THIS file (3x sealed) → v1.1 pins-only.
- v1.1 PINS (3x NEEDS-PATCH, beta-detach unanimous): beta read-only into g_cmp (hard detach); RPret ← retrieval losses only; blend CE → RPcmp only. Reports: beta dist, saliency, saturation, corr, 15% gap. REJECTED to U11: cross-arm caching, RPcmp nonlinearity, dynamic weighting.
- Then grad-check (split graph: RPret + RPcmp, beta detached) + 6T+6E. Ledgers d-newai-self-{u10-split,u10-ablate}-s{seed}-800st.json + evals + verdict d-newai-self-u10-verdict.json. Transcript + CHATLOG + CURRENT_TASK. NO PUSH.
