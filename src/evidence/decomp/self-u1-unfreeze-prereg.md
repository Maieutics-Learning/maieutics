# Self U1 delta-prereg: checkpoints-not-freezers (unfreeze-all from same frozen brain) (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. NO PUSH. R=3, quorum 2/3,
COMPLETE-gated, twin-matched seed-only streams, paired evals. Pool = sealed reviewer
labor only (never training signal). Corrections append-only.

## Record-search (already-run / nearest prior / what differs)
- W6 trunk s{seed} (C6+auxW0.5+800st+lam2, frozen): best mean 0.592, scr ceilings ~0.63-0.64.
  All self-track bases freeze this exact checkpoint (init + data + mask streams twin-matched).
- M1 NOTEBOOK-DEAD (frozen trunk, write-gate+read learn only): adapt 0/3, vitality blind.
  M2 READS (same frozen trunk, write-all + mixed 50/50 + frozen W6 init): mass 0.84 3/3,
  adaptV 0.81/0.775/0.775, adaptY 0.375/0.275/0.3 vs ctl 0.21/0.195/0.145 (+0.165/+0.08/+0.155 2/3 HOLD),
  STD held 3/3. Compose lags Y 0.3 vs V 0.8.
- M3 CARRY-POISON (eval-only on frozen M2-nb, same 61000+seed episodes paired):
  zero-carry 0.65/0.49/0.58 vs cNew 0.375/0.275/0.3 (+0.275/+0.215/+0.28 HOLD 3/3, V unchanged).
  Frozen compose head never saw missing-flat carries; zero unblocks to 0.58 but still below V 0.8.
- R3 LOOKS-OUTSIDE-BUT-GATE-BLIND (frozen trunk+notebook, gate+critic learn only, mixed diet):
  gate adaptY 0.37/0.27/0.3 == M2-nb vs flat 0.22/0.175/0.16 (+0.15/+0.095/+0.14 SEL 2/3 HOLD);
  gates 0.87-0.90 everywhere, b +1.32/+1.37 dominates, wb/we positive but weak, wd negative;
  VITAL 1/3+1/3 FAIL; STD filed. Compose uses cNew so R3 inherits carry cap.
- What differs (user order, Turn-55): SAME frozen brains as CHECKPOINTS (init only), then
  UNFREEZE ALWAYS during tests. I.e. load W6-s{seed} + M2-nb-s{seed} as init per seed,
  then allow ALL params (trunk E/W1/b1/Wf/bf/Wc/bc/Wh/bh/Hv/bv + notebook Wq/Watt/batt +
  critic Wc/bc + gate we/wb/wd/b) to train. Tests whether joint tuning learns
  (a) clean-carry compose (missing-flat carries become in-distribution) and
  (b) selective ignorance gate (without b-dominance), without breaking STD.

## Design (checkpoints as init; twin-matched init/data/mask/eval/adapt streams; E trains too)
- Init per seed: M = W6-s{seed} exact weights; MP = M2-nb-s{seed} exact weights.
  New params (critic+gate ~53, same as R3) fresh per arm/seed via
  G.makeRng(75000 + seed*7919 + armCode*131) — same scheme as R3 for comparability.
- Diet MIXED 50/50 (same coin stream as M2/R3, paired): standard (random supports, flat has
  answer) + adapt (true supports, flat missing). Loss = W6 recipe (retrieve ensV auxW0.5 +
  compose mean2 + bootstraps + critic BCE*0.5). Opt steps ALL params (Adam lr5e-3, clip 1.0).
- Arms (2 new x3 seeds = 6T+6E):
  - u1-unf-gate (learned g, all unfrozen): tests joint compose+gate learning.
  - u1-unf-flat (g forced 0, all else unfrozen): isolates USE of outside when ignorant under
    unfreeze (mirrors R3-ctl-flat logic; critic still trains; trunk+notebook+compose train).
  - Descriptive re-use (no retrain): r3-gate frozen (0.37/0.27/0.3) + r3-ctl-flat frozen
    (0.22/0.175/0.16) + M2-nb cNew/zero (0.375/0.275/0.3 vs 0.65/0.49/0.58) as filed baselines.
- Eval (paired, N=200 standard + N=200 adapt, same 52500/52501/61000+seed streams as R3):
  standard scr/two, adapt adaptY/adaptV, gates gAdapt/gStd/gWrong/gRight, weights we/wb/wd/b.
  Compose uses cNew pass2 (same as M2/R3 — if unfreeze works, cNew stops being poison).

## Bars (quorum 2/3 unless noted)
- U1-SEL: adaptY unf-gate − unf-flat >= +0.10 (outside pays under unfreeze; same big bar as M2/R3).
- U1-FIX: adaptY unf-gate − frozen r3-gate >= +0.10 (unfreeze beats frozen gate; carry repaired +
  gate sharpened jointly). Descriptive (frozen baseline filed, no new train).
- U1-VITAL: mean g adapt-missing > standard-present 3/3 AND wrong1 > right1 3/3
  (think opens when don't-know; the teeth test b-dominance must break).
- U1-STD: standard two unf-gate within ±0.05 of frozen W6 (0.63/0.595/0.55) 3/3
  (unfreeze must not break base; ABORT-if-broken note).
- U1-GAP descriptive: adaptY/adaptV ratio (frozen gate ~0.46/0.35/0.52; M3-zero ~0.80/0.63/0.75);
  unfrozen should move toward 1.0 if compose truly learns.
- Verdicts: CHECKPOINT-WORKS (SEL+HOLD with VITAL 2/3+ and STD held — joint tuning learns
  clean carry + selective gate) / UNFREEZE-HURTS (STD broken or SEL 0/3 — joint tuning
  destroys base or overfits) / STILL-BLIND (SEL holds via always-open like R3 but VITAL 0-1/3 —
  unfreeze fixes compose only, not think) / COMPOSE-ONLY (FIX holds, VITAL fails — stack needs
  separate teeth work).

## Staging + budgets
- Battery on THIS file (3x sealed, goal line) → v1.1 pins-only if needed.
- Then 6T+6E (800st/B16/lr5e-3) + grad-check (unfrozen full-graph: trunk+notebook+gate+critic,
  decoupled-carry scope + vhat-stability skips as in R3) before trains.
- Ledgers d-newai-self-{u1-unf-gate,u1-unf-flat}-s{seed}-800st.json + evals
  d-newai-self-eval-{same}.json (+gates/weights/calGap/mass) + verdict d-newai-self-u1-verdict.json.
  Transcript + CHATLOG + CURRENT_TASK. NO PUSH.
