# Self U8 delta-prereg: comparative gate (head first, gate sees head-base disagreement) (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. NO PUSH. R=3, quorum 2/3,
COMPLETE-gated, twin-matched seed-only streams, paired evals. Pool = sealed reviewer
labor only. Corrections append-only.

## Record-search (already-run / nearest prior / what differs)
- U5 HEAD-WORKS-GATE-BLIND: nonlinear open head adaptY 0.715/0.73/0.595 (2/3 ≥0.7), adaptV intact; joint gate always-open ~0.71, VITAL fail.
- U7 THINK-WALL: RP-only on frozen clean head still always-open ~0.73, VITAL fail (adapt>std by ~0.001 noise, wrong<right 0/3). H/beta/dis are all pass-1-internal pre-head — gate never sees whether head and base disagree.
- What differs (user order: get unfrozen brains to work): compute order swap. Run frozen baseMean AND frozen U5 head FIRST (both frozen, no grads through them for routing), then compute comparative features: head-base top-1 agreement (0/1), head-base margin gap (headTopLogit − baseTopLogit), head entropy, base entropy. Gate RP8 (Wc/bc + we/wb/wd/wm/wa/b = 56 params: adds wm margin-weight + wa agree-weight) routes on comparison, not on pass-1 alone. Head stays frozen U5-nl-open-s{seed} exact; only RP8 learns (teeth-style, then joint if teeth holds).

## Design
- Init per seed: M=W6-s, MP=M2-nb-s, HD=U5-nl-open-s{seed} frozen, RP8 fresh (rng +121). RP8 inputs: H (pass-1 entropy), beta (critic), dis (vote-disagree), m = headTop − baseTop margin, a = agree 0/1 (headTop==baseTop ? 1 : 0). g = σ(we*H + wb*beta + wd*dis + wm*m + wa*a + b).
- Diet MIXED 50/50 same streams; loss = W6 recipe on blend (same as U5). RP8-only trains (head/base frozen), lr1e-3, 800st/B16.
- Arms (2×3 = 6T+6E): u8-cmp-gate (learned comparative) vs u8-ablate (comparative inputs zeroed m=0/a=0.5 — same RP8 size, tests whether comparison carries signal vs extra params).
- Evals identical N=200+200 + weights wm/wa reported.

## Bars (quorum 2/3)
- U8-VITAL: g adapt-missing > standard ≥2/3 with margin ≥0.05 (not ~0.001 noise) AND wrong1 > right1 ≥2/3.
- U8-SEL: adaptY cmp-gate − base-flat ≥ +0.10.
- U8-STD: two cmp-gate within ±0.05 of W6 3/3.
- U8-ABLATE: cmp-gate VITAL holds while ablate fails (comparison is the signal, not params).
- Verdicts: COMPARATIVE-HOLDS (VITAL+SEL+STD — unfrozen-free working router) / COMPARE-HELPS-BLIND (VITAL margin but wrong<right — comparison narrows, think still partial) / STILL-WALL (VITAL fails both arms — routing needs more than head-base comparison).

## Staging + budgets
- Battery on THIS file (3x sealed) → v1.1 pins-only.
- v1.1 PINS (2 IMPLEMENTABLE + 1 NEEDS-PATCH): u8-ablate STRUCTURAL RP6 (U7 features only, no wm/wa); reports corr(m,g)|a=0 + margin-segmented VITAL + logit saturation + head-base agreement rate (eval-only). REJECTED to U9: signal-only arm, extra steps.
- Then grad-check (RP8 comparative graph) + 6T+6E. Ledgers d-newai-self-{u8-cmp-gate,u8-ablate}-s{seed}-800st.json + evals + verdict d-newai-self-u8-verdict.json. Transcript + CHATLOG + CURRENT_TASK. NO PUSH.
