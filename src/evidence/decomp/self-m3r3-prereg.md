# Self F-check + M3/R3 delta-prereg: fresh-eyes sensor check + carry repair + ignorance-gated outside read (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. NO PUSH. R=3, quorum 2/3,
COMPLETE-gated, twin-matched seed-only streams, paired evals. Pool = sealed reviewer
labor only (never training signal). Corrections append-only.

## Record-search (already-run / nearest prior / what differs)
- F/F2 (CALIBRATED-BUT-HOLLOW → INVERT-FIXED-BUT-HOLLOW): critic |gap| 0.42-0.60 3/3
  (beta=P(wrong) as trained) but blend gain +0.02 mean noise + hv2 chance 9/9 → sensor works,
  actuator doesn't. R2 critic (new, pass2, frozen W6): calGap 0.17/0.24/0.07 gate + 0.15/0.30/0.07
  ctl → WHEN calibrates on pass2 too (smaller, same sign). Licenses critic as don't-know gate.
- M1 NOTEBOOK-DEAD → M2 READS (mass 0.84 3/3, adaptV 0.78-0.81 vs ctl/W6 chance ~0.2, ADAPT
  2/3 +0.165/+0.08/+0.155, STD held 3/3): write-all + mixed diet + frozen W6 converts dead→read.
  Remaining wall: READ≠COMPOSE (Y 0.275-0.375 vs V 0.775-0.81) — pass2 carry from missing-answer
  pass1 poisons compose even with correct vhat (same x2m tokens, different carry cNew).
- R1 RABBITHOLE-DEAD → R2 AVOIDS-HARM (SEL 3/3 +0.075/+0.095/+0.12 by shutting complementary
  pass that hurts -0.075/-0.095/-0.125, vitality inverted 3/3, compose 1/3): different≠useful.
  User redefinitions (Turns 49-51, standing): true rabbithole = don't-know-gated OUTSIDE read
  (notebook supports), not disagree-gated same-input depth; think = critic beta + entropy/margin
  (not disagree alone); second opinion = different context at will under a cap + always-spawn
  control. R3 operationalizes exactly this.
- What differs: F-check = critic-alone on frozen W6 (does sensor survive freezing? load-bearing
  for R3 gate); M3 = zero-carry pass2 on adapt half, EVAL-ONLY on frozen M2-nb (no retrains —
  cheapest repair test); R3 = ignorance-gated M2 notebook (flat-hv vs outside-read blend by
  g(critic,entropy), frozen trunk+notebook, gate+critic learn only).

## Design (frozen bases everywhere: W6 trunk s{seed} + M2-nb notebook s{seed}; twin-matched
init/data/mask/eval/adapt streams as in m2r2-prereg; E frozen)

### F-check — fresh-eyes sensor on frozen trunk (is the critic still working?)
- New params (~49+3, critic Wc 48 + bc + blend gate? No — check is sensor-only + fixed flip blend
  like F2): critic beta=P(pass1 wrong), BCE×0.5 on free label wrong1; blend ensV=(1-beta)*hv1 +
  beta*hv2-verify? No — frozen trunk has no verify readout that works (hv2 chance). F-check does
  NOT retest hv2 (already dead 9/9). It tests: does a critic trained ALONE (frozen trunk, no joint
  damage) still calibrate (|gap| large) AND does its beta predict wrong1 on held-out (AUC-style
  quartile gap)? Arms: f3-critic (learned beta) vs f3-ctl (beta fixed 0.5, same critic training?
  No — ctl has no critic, just hv1 baseline = frozen W6 scr; isolates sensor). Simpler: 1 arm
  (f3-critic) x3 seeds = 3T+3E, bars vs frozen W6 baseline (already filed 0.635/0.61?/0.60? scr
  + 0.63/0.595/0.55 two) + vs F1 magnitude (|gap| 0.42-0.60). Bars: F3-CALIB (quartile gap ≥0.10
  3/3, ownership: critic separates right/wrong on frozen trunk); F3-GAIN descriptive (ensV with
  F2 flip vs hv1 — expected noise, proves sensor≠actuator again if hollow). Verdicts:
  SENSOR-HOLDS / SENSOR-DIED (freezing killed it — blocks R3).
- Staged FIRST (cheapest, load-bearing for R3: if sensor died, R3 gate has no signal).

### M3 — carry repair, eval-only (does clean carry unblock compose?)
- No new params, no retrains. Take frozen M2-nb s{seed} (Wq/Watt/batt) + frozen W6 trunk.
  Eval adapt (N=200, same 61000+seed episodes, paired): condition A = cNew pass2 (M2 default,
  already filed adaptY 0.375/0.275/0.3); condition B = ZERO-carry pass2 (x2m with cOld=zeros,
  same vhat from ensV). All else identical (same vhat, same masks, same episodes — twin-matched
  within eval by reusing arng stream twice? Consume same episodes: generate once, run both
  conditions — paired). Bars: M3-FIX (adaptY_zero − adaptY_cNew ≥ +0.10 quorum 2/3 — carry was
  the blocker); M3-VHELD descriptive (adaptV unchanged, same vhat). Verdicts: CARRY-POISON
  (zero fixes it — next is learnable carry gate) / CARRY-INNOCENT (zero doesn't fix — wall is
  elsewhere, e.g. frozen compose head never saw missing-flat carries).
- No grad-check (no trains), no battery beyond this file (eval-only probe, not a new mechanism).

### R3 — ignorance-gated outside read (true rabbithole: don't-know → look outside)
- Frozen: W6 trunk + M2-nb notebook (Wq/Watt/batt) per seed (both s{seed}, same E — compatible
  by construction). New params (~53): critic Wc 48 + bc (pass1 h, P(wrong1), BCE×0.5, bias-0) +
  gate we (entropy weight) + wb (beta weight) + wd (disagree weight, kept for ablation — prereg
  predicts wb/we dominate, wd ~0; filed) + b. Don't-know scalar: k = we*H + wb*beta + wd*dis,
  g=σ(k+b), H = normalized entropy of hv1 probs (0..1, (H-log(1/4))/log(4)? Or raw entropy/ log4 —
  file exact in driver: H/log(4)), beta from critic, dis vote-disagree. Retrieve: ensV = hv1 +
  g*readLogits (gated outside; g=0 → flat-only = W6, g=1 → full M2-nb). Compose via cNew pass2
  (same as M2; carry-poison applies equally — paired, so delta stays honest; M3 result tells us
  how much of R3's ceiling is carry).
- Diet MIXED 50/50 (same coin stream as M2, paired): standard (random supports, flat has answer —
  should stay shut) + adapt (true supports, flat missing — should open). Loss = W6 recipe
  (retrieve ensV auxW0.5 + compose mean2 + bootstraps; trunk+notebook frozen, opt steps
  gate+critic only).
- Arms: r3-gate (learned g) vs r3-ctl-flat (g forced 0, same gate+critic training? Critic trains
  identically, gate forced — isolates USE of outside when ignorant; mirrors F-ctl/R-ctl logic) +
  descriptive r3-ctl-open (g forced 1 = M2-nb, already filed, no retrain). 2 new arms (gate +
  flat-ctl) x3 = 6T+6E.
- Bars: R3-SEL (adaptY gate − flat-ctl ≥ +0.10 quorum 2/3 — outside when ignorant pays; same big
  bar as M2-ADAPT); R3-VITAL (mean g on adapt-missing > on standard-present 3/3 AND mean g on
  wrong1 > on right1 3/3 — think opens when don't-know, both framings); R3-STD (standard two
  gate within ±0.05 of W6 3/3 — gating doesn't break base). Verdicts: LOOKS-OUTSIDE (true
  rabbithole) / SHUTS-OUTSIDE (gate closes, recovers flat — R2 avoidance again) / GATE-BLIND
  (g adapt≈standard — think carries no signal).

## Staging + budgets
- Battery on THIS file (F-check + M3 + R3, 3x sealed, goal line) → v1.1 pins-only if needed.
- Stage 1: F-check (3T+3E, critic-only, frozen trunk) + M3 eval-only (3E x2 conditions, no trains)
  in parallel (both cheap, both load-bearing for R3). Stage 2: R3 (6T+6E) iff F-check SENSOR-HOLDS
  (else R3 gate has no signal — file BLOCKED openly, do not run).
- New driver newai-selfm3r3-driver.js (F3 critic + R3 gate; M3 as eval-mode flag in M2 eval path)
  with grad-checks (F3 critic graph; R3 gate+critic with frozen trunk+notebook, decoupled carry,
  vhat-stability skip) before trains. M3 needs no grad-check (no trains).
- Ledgers d-newai-self-{f3-critic,r3-gate,r3-ctl-flat}-s{seed}-800st.json + evals (+calGap/mass/
  gates/entropy) + M3 evals d-newai-self-eval-m2-nb-s{seed}-800st-zero.json (paired) + verdict
  d-newai-self-m3r3-verdict.json. Transcript + CHATLOG + CURRENT_TASK. NO PUSH.
