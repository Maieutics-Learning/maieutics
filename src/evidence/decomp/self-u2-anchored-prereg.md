# Self U2 delta-prereg: STD-anchored unfreeze (distill-to-frozen-W6 + two-speed lrs) (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. NO PUSH. R=3, quorum 2/3,
COMPLETE-gated, twin-matched seed-only streams, paired evals. Pool = sealed reviewer
labor only (never training signal). Corrections append-only.

## Record-search (already-run / nearest prior / what differs)
- M3 CARRY-POISON (frozen M2-nb, paired cNew vs zero): zero +0.275/+0.215/+0.28 3/3, V unchanged — frozen compose head never saw missing-flat carries.
- R3 LOOKS-OUTSIDE-BUT-GATE-BLIND (frozen trunk+notebook, gate+critic learn): SEL 2/3, VITAL 1/3+1/3 FAIL, gates ~0.9 b-dominated.
- U1 UNFREEZE-HURTS (compose-fixed-at-cost): same W6+M2-nb checkpoints as init, FULL unfreeze, single lr 5e-3, mixed 50/50, 6T+6E. Gate adaptY 0.99/0.975/0.99 vs flat 0.205/0.185/0.225 (SEL 3/3, FIX 3/3 vs frozen gate +0.62-0.71, GAP 1.0) BUT standard two 0.365/0.405/0.39 vs W6 0.63/0.595/0.55 (STD 0/3 broken) AND think inverted (gWrong<gRight 0/3, wb −1.05/−1.26, wd −1.70/−1.97). Mechanism: adapt gradients dominate shared trunk; 50/50 diet too weak an anchor; single lr thrashes trunk while gate learns on shifting signals.
- What differs (user-ordered program step 1): SAME init/checkpoints/streams as U1, still FULLY unfrozen, but (a) cheapest real protection: distill-to-frozen-W6 teacher on the STANDARD half only (λ~1.0, live matches frozen teacher behavior where base already wins), and (b) two speeds: trunk M slow lr 5e-4, notebook MP + critic/gate RP fast lr 5e-3 (one Adam each, global clip 1.0 preserved). Adapt half loss unchanged (compose + retrieve + critic, no anchor). Tests whether protection keeps U1's compose win while restoring base and giving think a stable floor.

## Design (checkpoints as init; twin-matched streams as U1; E trains)
- Init per seed: M = W6-s{seed} exact; MP = M2-nb-s{seed} exact; WT = frozen W6-s{seed} teacher copy (never trains, same masks/c0 convention). New critic+gate RP fresh per arm/seed via 75000+seed*7919+armCode*131 (armCode 110 gate / 111 flat).
- Diet MIXED 50/50 in one stream (same coin as U1/R3/M2, paired): standard = C=6 pick + 4 random supports, answer in-flat; adapt = genAdaptEpisode true supports + missing-answer query. Masks fixed 91000+seed (5×H48).
- Loss per sample (B=16, auxW=0.5, critic BCE×0.5 as before):
  - base = CE(mean2,y) + auxW*CE(ensV,v) + 0.5*BCE(beta,wrong1) [both halves, identical to U1]
  - anchor (STANDARD half only): λ*( KL(live_hv || teacher_hv) + KL(live_mean2 || teacher_mean2) ), λ=1.0. Teacher forward: fw1T = inSeqForward(WT, e.x, zeros, masks); vhatT = argmax(fw1T.hvLog); x2mT = [...,vhatT,8]; fw2T = inSeqForward(WT, x2mT, fw1T.cNew, masks); teacher_hv = fw1T.hvLog; teacher_mean = mean(fw2T.logitsK). Live counterparts: live_hv = fw1.hvLog (pre-gate trunk readout — anchors base retrieval, not the notebook blend), live_mean = mean(fw2.logitsK). KL direction live||teacher (live matches old brain where old brain wins). Adapt half: NO anchor (let carry be rewritten).
  - flat arm: g forced 0 (same as U1-flat), but anchor + slow/fast still apply (isolates outside-use under protection).
- Opt: two Adams — optSlow 5e-4 steps inSeqParams(M); optFast 5e-3 steps [MP.Wq,MP.Watt,MP.batt,RP.*]. Global grad-clip norm 1.0 across ALL params before stepping both (preserves U1 clip semantics).
- Backward (unfrozen full-graph as U1): u1SeqBackwardFull both passes (carry→h included), u1ReadBackward WITH E grads, u1CriticHBackward beta→h, gate-input H/dis detached (same filed scope), vhat/wrong fixed labels per sample (stability scope). Anchor adds: dKL_hv into fw1 hv path + dKL_mean into fw2 mean path (teacher constants, standard half only). Teacher gets ZERO grad (never in param list, no backward into WT).
- Arms (2 new ×3 seeds = 6T+6E): u2-anch-gate (learned g, protected unfreeze) vs u2-anch-flat (g=0, protected unfreeze). Descriptive re-use (no retrain): U1-unf-gate/flat, R3-gate/flat, M2-nb cNew/zero, W6 two.
- Evals identical to U1/R3 (N=200 standard + N=200 adapt, streams 52500/52501/61000+seed, gates/weights/scr/two/adaptY/adaptV).

## Bars (quorum 2/3)
- U2-SEL: adaptY anch-gate − anch-flat >= +0.10 (outside pays under protection).
- U2-FIX: adaptY anch-gate − frozen r3-gate >= +0.10 (protected unfreeze still beats frozen gate; expect smaller than U1's +0.6 — predict +0.3).
- U2-STD: standard two anch-gate within ±0.05 of frozen W6 3/3 (THE protection test; U1 scored 0/3).
- U2-VITAL: mean g adapt-missing > standard-present 3/3 AND wrong1 > right1 3/3 (first fair shot on stable signals; U1 2/3 + 0/3 inverted).
- U2-GAP descriptive: adaptY/adaptV (U1 closed to 1.0; protection should keep ≥0.8 while holding STD).
- Verdicts: PROTECTED-HOLDS (SEL+FIX with STD held + VITAL 2/3+ — go to teeth two-stage) / ANCHORED-BUT-BLIND (SEL+STD hold, VITAL 0-1/3 — compose protected, think still blind → teeth repair next) / ANCHOR-FAILED (STD still 0-1/3 — λ=1.0 or distill target wrong → modular split next) / PROTECTION-KILLS-GAIN (STD holds but SEL/FIX 0/3 — anchor too strong, λ must drop).

## Staging + budgets
- Battery on THIS file (3x sealed, goal line) → v1.1 pins-only if needed.
- v1.1 PINS (adopted 3x NEEDS-PATCH as clarifications, no train/eval changes): teacher vhatT0 fixed from teacher forward + live vhat0 fixed from live forward (KL static); live counterpart = pre-gate fw1.hvLog by design (gate cannot zero it; blend-anchoring rejected); λ=1.0 STANDS (over-anchor covered by PROTECTION-KILLS-GAIN; decay parked U3); global clip 1.0 STANDS (U1 comparability; stutter is watch item); bars→verdicts hard map: PROTECTED-HOLDS=SEL∧FIX∧STD∧VITAL / ANCHORED-BUT-BLIND=SEL∧STD∧¬VITAL / ANCHOR-FAILED=¬STD / PROTECTION-KILLS-GAIN=STD∧¬(SEL∨FIX); GAP refs U1 1.0 / M3-zero 0.63-0.80 / frozen 0.35-0.52, keep ≥0.8 descriptive.
- Then grad-check (U2 anchor grads: dKL paths + split-opt bookkeeping; detached H/dis + fixed vhat scope as U1) before trains.
- Then 6T+6E (800st/B16, slow 5e-4 / fast 5e-3, λ=1.0). Ledgers d-newai-self-{u2-anch-gate,u2-anch-flat}-s{seed}-800st.json (+FULL weight save as U1) + evals + verdict d-newai-self-u2-verdict.json. Transcript + CHATLOG + CURRENT_TASK. NO PUSH.
