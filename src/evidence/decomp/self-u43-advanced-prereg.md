# U43-ADVANCED program prereg v1.1 — six licensed arms (from U39 license table)
Battery: R1/R2 NEEDS-PATCH + R3 IMPLEMENTABLE → pins P1a–P1b (clarifications, no
bar changes). Full battery in src/evidence/decomp/fresh-eyes-self-u43-advanced-3x-results.md.
P1a: U in M1 is the UNIFORM control (not an "upper arm"); L/H/U stays; house
quorum 2/3 stands. P1b: M4 LINDEC / M3 same-diet RI / M5 FLAT-B baseline already
exist — text clarified, no control-set expansion. Rejected: flip-potential
redefine (budget hard-capped), local-variance add-on (vague), 3/3 quorum (breaks
comparability with 50+ verdicts).

Scope: the six ADVANCE arms from d-newai-self-u39-verdict.json license table.
Shared standing rules for ALL modules: frozen-trunk + random/uniform controls
mandatory; quorum 2/3 (R=3 seeds); COMPLETE-gated per module (a module's trains
all COMPLETE or the module is VOID); no tuning to reviewer or cross-arm
outputs; each module verdict ADVANCE (draft next-step prereg) / DEAD / INCONCLUSIVE.
Shared eval instrument: scr/two/oracle/fwd (+ module-specific extras). Baseline
controls reuse filed numbers (u34/u36) only where prereg says; fresh controls
run inside the module otherwise. CPU/in-worker. NO PUSH. Execution order
cheap-first: M2 → M1 → M5 → M3 → M4 → M6 (later modules may start only after
earlier verdicts file; no cross-module tuning regardless).

## M1 — 03/04 inverted LP-bandit (U36-D1 diet; H48)
B8 r=−0.819: high disagree predicts LOW gain → sample LOW-disagreement first.
Arms (800st, R=3): L (pick-max low-disagree), H (pick-max high-disagree),
U (uniform control). 9 trains + 9 evals.
Bar: L ≥ U + 0.03 COMPOSE(two) at quorum → direction CONFIRMED (advance LP
program); if H ≥ L → sign hypothesis wrong, file INVERTED-INVERTED (dead);
if L ≈ U ≈ H → bandit family DEAD.

## M2 — 05 Gain×Need replay (U36-D1; H48)
Reserve 10% of 800 steps for replay from a filed-so-far row store.
Arms: G (top Gain×Need: flip-potential × recurrence), S (top |PE| surprise),
R (random). 9 trains + 9 evals.
Bar: G ≥ S + 0.03 COMPOSE at quorum → ADVANCE replay program; else DEAD
(GAIN==SURPRISE confirmed).

## M3 — 06 SFMA heterogeneous diet (H48)
Diet 90/5/5 (contrast) + arms: SFMA (strength×similarity×IoR, reverse/default
TD-mode), RI (random + IoR-only), NR (no replay). 9 trains + 9 evals.
Bar: SFMA > RI at quorum → ADVANCE; RI ≈ SFMA → selection vars dead weight
(DEAD); SFMA ≈ NR → substrate cannot use replay (DEAD).

## M4 — 07 staged plasticity (H48, U36-D1)
Arms: STAGED (steps 0–400 trunk LR 1.0/scorer 0.1 → 400–800 trunk 0/scorer 1.0),
JOINT (U34-style all 1.0), LINDEC (linear decay all params). 9 trains + 9 evals.
Bar: STAGED > JOINT AND STAGED > LINDEC at quorum → ADVANCE; LINDEC ≥ STAGED →
critical-period narrative REJECTED (DEAD); JOINT ≥ STAGED → staging useless (DEAD).

## M5 — 10 trajectory-ramp aux + cross-diet transfer (H48)
Arms: RAMP (late-step CE ≫ early-step), FLAT. Train on diet A (U36-D1), transfer
test on diet B (disjoint mapping family, no retraining): 6 trains + 6 standard
evals + 6 transfer evals.
Bar: RAMP > FLAT at quorum AND transfer holds (RAMP-B ≥ FLAT-B) → ADVANCE;
RAMP wins A but fails B → family-specific heuristic (DEAD); no A win → DEAD.

## M6 — 13 productive goals (H48; new machinery — biggest build, runs last)
Goal-token vocabulary {bind, retrieve} (2 ids) prepended as discrete switch
routing round-2 path. Arms: P (trunk must emit token before acting),
E (tokens provided at train, omitted at eval), B (baseline, no tokens).
9 trains + 9 evals + wrong-token-breaks-action test (force wrong token at eval:
action must break ≥80% of rows or token is decorative → arm DEAD regardless
of score deltas).
Bar: P > E > B at quorum AND break-test passes → ADVANCE; P ≈ E → decorative
(DEAD); E ≈ B → discrete space not the lever (DEAD).

## Verdicts
Per-module verdict ledgers d-newai-self-u43-m{1..6}-verdict.json + program
rollup d-newai-self-u43-verdict.json mapping each arm to ADVANCE/DEAD/
INCONCLUSIVE with exact gate numbers cited.
