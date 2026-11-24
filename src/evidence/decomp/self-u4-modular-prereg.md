# Self U4 delta-prereg: modular split (frozen base + learnable adapt-compose head + gate routes) (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. NO PUSH. R=3, quorum 2/3,
COMPLETE-gated, twin-matched seed-only streams, paired evals. Pool = sealed reviewer
labor only. Corrections append-only.

## Record-search (already-run / nearest prior / what differs)
- M3 CARRY-POISON: frozen shared compose head never saw missing-flat carries (zero +0.28 3/3, still below V).
- U1 UNFREEZE-HURTS: full unfreeze learns compose (0.99) but breaks base (two 0.37-0.41) + inverts think.
- U2 ANCHOR-FAILED: λ=1.0 + slow/fast keeps GAP ≥0.88, STD still 0/3, VITAL 0/3 inverted.
- U3 STILL-BLIND (teeth two-stage on frozen U2 base): SEL 3/3, STD-held-on-U2, VITAL 0/3 both framings (quorum 2/3), wb/wd negative again — drift exonerated, signal absent.
- What differs (user program step 3): MODULARITY. Freeze everything shared (W6 trunk + M2-nb notebook + W6 base compose heads). Add the missing piece as its own module: adapt-compose head (WA 4×48 + ba, on pass2 hidden h2 which contains the poisoned carry) that ONLY has to learn missing-flat composition. Gate (same RP 53: critic + we/wb/wd/b) routes per-sample: blended = (1−g)*baseMean2 + g*adaptHead. Base can only break via gate leakage (g>0 on standard), never via head weights. This is R3 + the adapt head R3 lacked.

## Design (frozen W6+M2-nb healthy base; new adapt head + RP learn; E frozen)
- Init per seed: M = W6-s{seed} exact; MP = M2-nb-s{seed} exact (healthy: two 0.63/0.595/0.55, adaptV 0.81). New: WA/ba fresh (rng 75000+seed*7919+armCode*131, armCode 114 gate / 115 open) + RP same scheme.
- Diet MIXED 50/50 (same coin/masks/streams as U1-U3/R3). Loss = W6 recipe on BLEND: CE(blend,y) + auxW0.5*CE(ensV,v) + 0.5*BCE(beta,wrong1). Teacher forcing: none (gate learns end-to-end). Opt: single Adam lr5e-3 (all-new-params same speed — no split needed, trunk frozen so no thrash), clip 1.0.
- Arms (2×3 = 6T+6E): u4-mod-gate (learned g) vs u4-mod-open (g forced 1, adapt head always — tests head alone; critic still trains). Descriptive re-use: R3-ctl-flat base (0.22/0.175/0.16), W6 two, M2-nb.
- Evals identical (N=200+200): scr/two/adaptY/adaptV + gates + weights + HEAD-ONLY descriptive (adaptY with g forced 1 post-hoc on gate arm? No — open arm IS the head-only measure; keep evals identical for pairing).

## Bars (quorum 2/3)
- U4-SEL: adaptY mod-gate − filed base-flat (0.22/0.175/0.16) >= +0.10 (modular outside pays).
- U4-STD: standard two mod-gate within ±0.05 of W6 3/3 (modularity holds base iff gate shuts on standard).
- U4-VITAL: mean g adapt-missing > standard-present ≥2/3 AND wrong1 > right1 ≥2/3 (quorum per U3 v1.1).
- U4-HEAD: adaptY mod-open descriptive (does the head alone solve poisoned compose? expect ~0.9 per U1/U2; proves head=fix, gate=router).
- Verdicts: MODULAR-HOLDS (SEL+STD+VITAL — live answer: shared slow trunk, owned heads) / HEAD-WORKS-GATE-BLIND (HEAD high + SEL holds + VITAL fails — compose solved, think absent) / HEAD-FAILS (open low — adapt head cannot learn poisoned carry either; wall is representational) / GATE-HURTS (STD broken — blend leaks on standard).

## Staging + budgets
- Battery on THIS file (3x sealed, goal line) → v1.1 pins-only if needed.
- v1.1 AMENDMENT (adopted 3x NEEDS-PATCH): head lr 5e-3 / RP lr 1e-3 (gate must not saturate first); quorum unit = seeds; HEAD-WORKS = open adaptY ≥0.7 ≥2/3 / HEAD-FAILS = open <0.5 ≥2/3; STD stays ±0.05 strict (GATE-HURTS covers leak); open standard-two reported as leak-note; null-head/scrub/warmup parked U5.
- Then grad-check (adapt-head + gate graph, frozen base; decoupled-carry + vhat-stability skips) before trains.
- Then 6T+6E (800st/B16/lr5e-3). Ledgers d-newai-self-{u4-mod-gate,u4-mod-open}-s{seed}-800st.json + evals + verdict d-newai-self-u4-verdict.json. Transcript + CHATLOG + CURRENT_TASK. NO PUSH.
