# Self U5 delta-prereg: nonlinear/scrub adapt head + same gate (frozen healthy base) (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. NO PUSH. R=3, quorum 2/3,
COMPLETE-gated, twin-matched seed-only streams, paired evals. Pool = sealed reviewer
labor only. Corrections append-only.

## Record-search (already-run / nearest prior / what differs)
- U4 MODULAR: frozen W6+M2-nb + linear adapt head (WA 4×48 on poisoned h2) + gate: SEL 3/3, STD 1/3 (best since frozen), VITAL 0/3 BUT wb +0.45 3/3 first sign-flip; open head 0.47/0.57/0.45 = linear insufficient (reviewers predicted empirically).
- U1 UNFREEZE: full unfreeze learns compose 0.99 but wounds base (STD 0.37-0.41) + inverts think.
- U6 REPAIR: wounded-init + standard-only + tell-it-wrong partial (+0.2) but TAXES compose (adaptY 0.99→0.25), TELL 1/3, still wounded.
- What differs (user order: get unfrozen brains to work): DON'T unfreeze trunk at all. Keep everything shared frozen (W6 trunk + M2-nb + base compose). Put the missing piece in its own nonlinear module: 2-layer MLP (48→24 silu →4) on poisoned h2 that must learn to scrub poison into clean adapt logits. Same RP gate (53 params) routes per-sample. If linear could not (U4 HEAD 0.47-0.57), nonlinearity + hidden filtering is the prescribed fix (U4 verdict next-branch).

## Design (frozen healthy base; nonlinear head + RP learn)
- Init per seed: M=W6-s exact; MP=M2-nb-s exact (healthy). New: head W1 24×48 + b1 24 + W2 4×24 + b2 4 (∼1276 params, still tiny) fresh rng 75000+seed*7919+armCode*131 (armCode 118 gate / 119 open); RP same scheme.
- Diet MIXED 50/50 (same coin/masks/streams as U1-U6). Loss = W6 recipe on BLEND: CE(blend,y) + auxW0.5*CE(ensV,v) + 0.5*BCE(beta,wrong1). Teacher forcing: none.
- Opt: head lr5e-3 / RP lr1e-3 (U4 v1.1 split kept — gate must not saturate before head converges), clip 1.0, 800st/B16.
- Arms (2×3 = 6T+6E): u5-nl-gate (learned g) vs u5-nl-open (g forced 1, head-always). Descriptive re-use: base-flat, W6 two, U4-linear-open (0.47/0.57/0.45) as linear baseline.
- Evals identical N=200+200: scr/two/adaptY/adaptV + gates + weights + HEAD-ONLY (open arm).

## Bars (quorum 2/3 seeds)
- U5-SEL: adaptY nl-gate − base-flat ≥ +0.10.
- U5-STD: standard two nl-gate within ±0.05 of W6 3/3.
- U5-VITAL: mean g adapt-missing > standard-present ≥2/3 AND wrong1 > right1 ≥2/3.
- U5-HEAD: open adaptY ≥0.7 ≥2/3 = NONLINEAR-SUFFICES; <0.5 ≥2/3 = HEAD-FAILS (wall is representational even nonlinear → U5b explicit-scrub).
- Verdicts: NONLINEAR-HOLDS (SEL+STD+VITAL — modular nonlinear is the unfrozen-free answer) / HEAD-WORKS-GATE-BLIND (HEAD high + SEL holds + VITAL fails) / HEAD-FAILS (open low — need explicit scrub/subtraction) / GATE-HURTS (STD broken — blend leaks).

## Staging + budgets
- Battery on THIS file (3x sealed, goal line) → v1.1 pins-only if needed.
- v1.1 PINS (adopted 3x NEEDS-PATCH): head warmup 100st (gate lr 0, head-only mixed diet) then joint 800st head 5e-3 / RP 1e-3; HEAD band ≥0.7 suffices / <0.5 fails / 0.5-0.7 PARTIAL-SCRUB; baseline-symmetry vs U4-linear-open (eval-only). REJECTED to U5b: steps increase, decay, weight-decay, LayerNorm, probes.
- Then grad-check (nonlinear head + gate graph, frozen base) before trains.
- Then 6T+6E (100 warmup + 800st/B16). Ledgers d-newai-self-{u5-nl-gate,u5-nl-open}-s{seed}-800st.json + evals + verdict d-newai-self-u5-verdict.json. Transcript + CHATLOG + CURRENT_TASK. NO PUSH.
