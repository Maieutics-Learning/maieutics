# Self U6 delta-prereg: wound-repair (tell-it-wrong from wounded init) (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. NO PUSH. R=3, quorum 2/3,
COMPLETE-gated, twin-matched seed-only streams, paired evals. Pool = sealed reviewer
labor only. Corrections append-only.

## Record-search (already-run / nearest prior / what differs)
- U1 UNFREEZE-HURTS: same W6+M2-nb init, unfreeze-all 800st: adaptY 0.99/0.975/0.99 FIX 3/3 GAP 1.0 but STD two 0.365/0.405/0.39 vs W6 0.63/0.595/0.55 FAIL 0/3 (−0.265/−0.19/−0.16); VITAL inverted wrong<right 0/3, wb −1.06/−1.26 wd −1.70/−1.97.
- U2 ANCHOR-FAILED: λ=1.0 distill + slow/fast slows bleed (−0.19/−0.14/−0.125) but STD 0/3, VITAL 0/3 same inversion. Anchor-during-drift insufficient.
- U3 STILL-BLIND: freeze U2 base, RP-only: gate == base exactly, STD-held-on-U2 3/3, VITAL 0/3. Drift exonerated, signal absent.
- U4 HEAD-FAILS+GATE-HURTS: frozen healthy base + adapt head + gate: SEL 3/3, STD 1/3 (best since frozen), VITAL 0/3 BUT wb +0.45 3/3 first sign-flip; open head 0.47/0.57/0.45 linear insufficient.
- What differs (user question Turn-66): start from WOUNDED init (U1-unf-gate-s{seed} exact weights, trunk+notebook+compose+RP all wounded) and test whether standard-only repair + explicit wrong-supervision (critic BCE on wrong1, told every step it was wrong/right on pass-1) gets back to right. Reverse order of U3: U3 froze trunk / trained gate; U6 freezes gate (g=0, no outside) / repairs trunk. Gate-live arm controls for leak-during-repair (same test U2 failed, but from wounded start with standard-only diet).

## Design (wounded init; gate-frozen vs gate-live; standard-only + tell-it-wrong; E trains too)
- Init per seed: M+MP+RP = d-newai-self-u1-unf-gate-s{seed}-800st.json exact (wounded: STD ~0.37-0.41, adaptY ~0.99, wb/wd negative). No fresh params: repair starts where U1 ended. RNG for data/mask streams twin-matched to U1-U4 (same 52500/52501/61000+seed episode streams, same coin logic but diet forced standard-only).
- Diet STANDARD-ONLY (random supports, flat HAS answer, N/A adapt): every step tells pass-1 wrong/right via critic BCE*0.5 (same W6 recipe weight; critic + trunk + notebook + compose train on it). Loss = W6 recipe on standard: CE(scr,y) + auxW0.5*CE(ensV,v) + 0.5*BCE(beta,wrong1). No adapt episodes during repair (adapt appears only at eval, paired N=200+200).
- Opt: Adam lr5e-3 all-trainable (same as U1; trunk wounded so full speed, no slow/fast — anchor question is settled, this tests supervision not speed), clip 1.0, 800st/B16.
- Arms (2×3 = 6T+6E):
  - u6-rep-frozen (gate forced g=0, critic still trains): tests trunk repair without outside confound. If STD recovers, wound is reversible when gate leaks nothing.
  - u6-rep-live (gate learns, same standard-only diet): controls for gate-leak-during-repair. If frozen recovers but live does not, gate leakage alone re-wounds even on clean diet (U2 mechanism from wounded start).
  - Descriptive re-use (no retrain): W6 two (0.63/0.595/0.55), wounded U1-unf-gate STD + adaptY, U1-unf-flat.
- Evals identical paired (N=200 standard + N=200 adapt, same streams as U1-U4): standard scr/two, adapt adaptY/adaptV (gate arm evaluated as-trained; frozen arm evaluated g=0 AND descriptively g=1-open to see if repaired trunk composes without head), gates gAdapt/gStd/gWrong/gRight, weights we/wb/wd/b, critic wrong1-acc (TELL measure), calGap.

## Bars (quorum 2/3 seeds)
- U6-REC: standard two rep-frozen within ±0.05 of W6 (0.63/0.595/0.55) 3/3 (got back to right; strict because modularity taught us ±0.05 is the meaning of holds).
- U6-TELL: critic wrong1-acc on standard ≥0.65 ≥2/3 (telling-it-wrong installed; below = critic did not learn even with explicit supervision on clean diet).
- U6-LIVE (descriptive comparison): rep-live STD vs rep-frozen STD (does live gate re-wound on standard-only? gap ≥0.05 = leak-during-repair).
- U6-RETAIN descriptive: adaptY rep-frozen vs wounded 0.99 (repair cost on compose; expect drop on standard-only — logged as price of getting back to right, motivates U7 gate re-learn).
- Verdicts: RECOVERED (REC 3/3 + TELL 2/3 — wound reversible, proceed to U7 gate re-learn on repaired trunk) / STILL-WOUNDED (REC 0-1/3 — standard-only + explicit wrong insufficient; wound sticky, need scrub/re-init not repair) / REPAIR-TAXES-COMPOSE (REC holds but adaptY collapses vs wounded — back to right costs compose; next is joint not sequential) / GATE-REWOUNDS (frozen holds + live fails by ≥0.05 — leakage alone re-wounds, gate must stay frozen during any trunk repair).

## Staging + budgets
- Battery on THIS file (3x sealed, goal line) → v1.1 pins-only if needed.
- v1.1 PINS (adopted 3x NEEDS-PATCH): full optimizer reset (fresh Adam from wounded weights); twin-match preserved (sample adapt, forward-only zero-grads, RNG advances + first-100 hash logged); critic warmup 50st critic-only at 1.0 then joint BCE*0.5; live-arm dual-LR trunk 5e-3 / RP 1e-3 (same split as U4); gate-symmetry eval (live arm also evaluated g forced 0 post-hoc); standard-only enforced (adapt mask force-zero train, eval-only adapt). REJECTED to U7: random-BCE null arm, hash-abort, ≥0.70 critic gate.
- Then grad-check (wounded-init repair graph: trunk+notebook+compose+critic, gate-frozen vs gate-live paths; H/dis detached + vhat-stability skips as in U1-U4) before trains.
- Then 6T+6E (50 warmup + 800st/B16/lr5e-3 trunk, RP 1e-3 live). Ledgers d-newai-self-{u6-rep-frozen,u6-rep-live}-s{seed}-800st.json + evals d-newai-self-eval-{same}.json + verdict d-newai-self-u6-verdict.json. Transcript + CHATLOG + CURRENT_TASK. NO PUSH.
