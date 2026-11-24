# Self U3 delta-prereg: teeth two-stage (freeze U2 trunk+notebook, gate+critic learn only) (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. NO PUSH. R=3, quorum 2/3,
COMPLETE-gated, twin-matched seed-only streams, paired evals. Pool = sealed reviewer
labor only (never training signal). Corrections append-only.

## Record-search (already-run / nearest prior / what differs)
- R3 LOOKS-OUTSIDE-BUT-GATE-BLIND (frozen W6+M2-nb, gate+critic learn): SEL 2/3, VITAL 0-1/3, b-dominated ~0.9.
- U1 UNFREEZE-HURTS (full unfreeze, single lr): adaptY 0.99 (GAP 1.0) BUT STD 0/3 broken + think inverted (wb/wd negative, wrong<right 0/3) — gate learned on shifting trunk.
- U2 ANCHOR-FAILED (protected unfreeze, λ=1.0 distill + slow/fast): adaptY 0.85-0.96 (FIX holds, GAP ≥0.88), STD still 0/3 (−0.13-0.19), VITAL still 0/3 inverted (wb −0.65/−1.00, wd −1.75/−2.10, gates ~0.5) — anchor slowed bleed, blend still shifts standard, think still trains on drift.
- What differs (user-ordered program step 2): TWO-STAGE isolation. Stage A done (U2 trunk+notebook per seed, protected-tuned, compose-capable). Stage B (this file): FREEZE U2-anch-gate trunk M + notebook MP per seed as the new base, train ONLY gate+critic RP (same ~53 params as R3: Wc/bc + we/wb/wd/b) on the same mixed 50/50 diet with the W6 recipe. Separates "gate can't learn" (signal absent) from "gate learns on sand" (signal moves). If VITAL holds on a frozen U2 trunk, U1/U2 inversion was drift; if it still fails, think needs a different signal, not more tuning.

## Design (frozen base = U2-anch-gate-s{seed}; twin-matched streams; E frozen)
- Init per seed: M = U2-anch-gate-s{seed} trunk exact (E/W1/b1/Wf/bf/Wc/bc/Wh/bh/Hv/bv); MP = same ledger notebook exact (Wq/Watt/batt); WT not needed (no anchor — trunk frozen, nothing to leash). New RP fresh per arm/seed via 75000+seed*7919+armCode*131 (armCode 112 gate / 113 flat-ctl).
- Diet MIXED 50/50 identical to U2/U1/R3 (same coin stream 42000+seed*104729+55, C=6 pick standard half, genAdaptEpisode adapt half); masks 91000+seed; loss = W6 recipe (retrieve ensV auxW0.5 + compose mean2 + bootstraps + critic BCE×0.5); opt steps RP only (Adam lr5e-3, clip 1.0).
- Arms (2 ×3 = 6T+6E): u3-t2-gate (learned g on frozen U2 base) vs u3-t2-flat (g=0, critic still trains — isolates outside-use on the U2 base, mirrors R3-ctl/U1-flat logic).
- Evals identical (N=200+200, streams 52500/52501/61000+seed): scr/two/adaptY/adaptV + gates both framings + weights.

## Bars (quorum 2/3)
- U3-SEL: adaptY t2-gate − t2-flat >= +0.10 (outside pays on the U2 base).
- U3-VITAL: mean g adapt-missing > standard-present 3/3 AND wrong1 > right1 3/3 (THE teeth test on stable signals).
- U3-STD: standard two t2-gate within ±0.05 of U2-anch-gate two (0.44/0.455/0.425) 3/3 AND descriptive vs W6 (do no further harm; U2 base already wounded).
- U3-GATE descriptive: weights (does b-dominance return ~0.9 like R3, stay mid ~0.5 like U1/U2, or go selective?); wd sign (does inversion persist on frozen base?).
- Verdicts: TEETH-HOLD (SEL+VITAL with STD-held-on-U2-base — inversion was drift; proceed to modular split for W6-STD) / STILL-BLIND (SEL holds via always-open, VITAL 0-1/3 — signal absent on this trunk too) / GATE-HURTS (STD worse than U2 base — gate damages even frozen compose) / NO-OUTSIDE (SEL 0/3 — U2 base already internalized adapt, nothing left for gate to add).

## Staging + budgets
- Battery on THIS file (3x sealed, goal line) → v1.1 pins-only if needed.
- v1.1 (adopted 3x NEEDS-PATCH; no new arms, no diet/lr changes): flat control STANDS (comparability; forced-open parked); STD dual (primary vs U2 base ±0.05 + descriptive vs W6); VITAL quorum 2/3 per framing (wounded-base concession; TEETH-HOLD=SEL∧VITAL, STILL-BLIND=SEL∧¬VITAL); GATE-HURTS = two >0.05 worse than U2 base ≥2/3; NO-OUTSIDE = SEL 0/3 ∧ VITAL ≤1/3 (U2 internalized adapt); GATE quantitative sign-checks (wb>0, we>0 predicted; wd reported; |b| vs R3/U1/U2); baked-in risk acknowledged as a finding, not a flaw.
- Then grad-check (frozen-base gate+critic graph; decoupled-carry + vhat-stability skips as R3) before trains.
- Then 6T+6E (800st/B16/lr5e-3). Ledgers d-newai-self-{u3-t2-gate,u3-t2-flat}-s{seed}-800st.json + evals + verdict d-newai-self-u3-verdict.json. Transcript + CHATLOG + CURRENT_TASK. NO PUSH.
