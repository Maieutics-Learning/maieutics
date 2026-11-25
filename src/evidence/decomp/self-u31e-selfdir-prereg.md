# Self U31e delta-prereg: gate-selected composition training (self-directed loop) (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. Pool = sealed reviewer labor only (3x generateText implementability reviews, never training signal). R=3, quorum 2/3, COMPLETE-gated, twin-matched streams, paired evals. Corrections append-only. NO PUSH without explicit order.

## Record-search (already-run / nearest prior / what differs)
- U31b R2MON-VERIFIES: own gate predicts round-2 failure; abstention buys accuracy. Gate is verified but has never DIRECTED anything.
- U31c SUBSTRATE-VOID: no value failures; substitution untestable. U31d RETRY-DEAD: round-2 errors systematic, not stochastic. Correction around a frozen trunk is exhausted (exclusion 0, abstention +, substitution untestable, resampling 0).
- Structural fact: NO parameter anywhere in program history has ever been trained on composition. Round-2 (trunk M, W6) has been frozen since loadU1W6 in every U-wave; S/C/INH/HF train on value (vhat CE + hinge) only. Everything binds to flat because composition is never priced.
- A1/A2 rehearsal-DEAD: replay of own successes/failures into the SAME frozen modules did nothing. U31e differs: trains the NEVER-TRAINED composition module, directed by the VERIFIED gate (disagreement-selected diet, appetite-style) with a random-diet control for teeth.
- What differs vs ALL prior waves: first wave that trains composition; first wave where a verified intrinsic signal selects the training diet (self-directed learning in the mission sense: own prediction directs own training, living in weights).

## Design
- Frozen: retrieval S/C/INH/HF (U28 per seed) + trunk Mf (W6, never stepped) + R2MON gate (U31b weights, selection only) + miner (floors only).
- Trainable: trunk COPY Mc per (arm, seed), init bit-exact from W6 (copy-fidelity checked). Only Mc stepped. Retrieval never sees Mc (structural no-touch).
- Task: round-2 composition. Input x2m=[9x5,qk,k,vhat_f,8] with vhat_f from FROZEN forced pipeline (deployment-conditioned); label e.y. Loss CE(inMeanLogits(fw2), e.y), Mc params only, Adam lr5e-3, clip 1.0, 800st, B=16, fixedMasks (91000+seed family).
- Diet per batch: 8 hard + 8 std (std = shift rows, round-2 with frozen-std vhat=argmax(hv+read), same as eval accTwo recipe).
  - E-sel: hard rows gate-selected — draw adapt candidates from selMineRng (93400+seed), frozen forward (slots via selSlotRng 94400+seed), keep iff gate p<0.5; 20-try cap + fallback counting (fallback rows kept unselected, dilutes selection — reported).
  - E-rand: hard rows uniform adapt episodes (randRng 93500+seed + slots 94500+seed). Same pool shape, no selection — the teeth for the self-direction claim.
  - E-none: Mc = exact copy, zero steps (copy-fidelity reference + determinism check).
- Eval (paired, held-out): hardAdaptY = miner-mined 66300 rows, round-2 with Mc + frozen vhat_f; stdTwo = shift rows round-2 with Mc; frozen-M references for LIFT/RETENTION; wall N/A structurally (Mc never in retrieval path — stated, not barred).
- SUBSTRATE tripwire (stage-1, before any train): 1000 adapt candidates/seed, report P(p<0.5). If < 0.10 ANY seed: VOID that seed (selection starves). 2/3 VOID -> SELECTION-VOID verdict, no trains.
- 9T + 9E + OOD? No OOD (round-2 module is scale-free by construction; note). + probes (miner floors recorded). Verdict d-newai-self-u31e-verdict.json.

## Paper predictions vs bench predictions (divergence-WHY owed)
- Appetite (E-series): disagreement should select learnable rows. Bench: gate-selected (predicted-fail) rows are where frozen composition fails — the learnable set IF composition is learnable at all. WHY owed if rand >= sel (gate selects nothing useful) or nothing lifts (composition unlearnable by this trunk at this scale).
- Norman #5 boundary: selection helps where the module is weak (round-2, weak) — no NOHARM risk on retrieval (structurally disconnected).

## Bars (quorum 2/3 unless noted)
- U31e-LIFT: hardY_sel minus hardY_frozen >= +0.05 2/3 (N=200 miner-mined held-out).
- U31e-SEL: hardY_sel minus hardY_rand >= +0.03 2/3 (THE self-direction claim: gate diet beats random diet).
- U31e-RET: stdTwo_sel >= stdTwo_frozen minus 0.03 3/3 (no catastrophic forgetting of base skills).
- U31e-NONE: Mc-none numbers EXACTLY equal frozen 3/3 (copy fidelity + harness determinism; VOID on trip).
- U31e-FROZEN: maxAbsDrift of Mf/S/C/INH/HF/gate == 0.0 3/3 (nothing but Mc moved).
- U31e-FRESH: battery health 4/4.
- Verdicts: SELF-DIRECTED (LIFT + SEL hold) / TRAINS-BUT-BLIND (LIFT holds, SEL fails: training works, gate adds nothing) / COMPOSITION-UNLEARNABLE (no LIFT in sel or rand) / SELECTION-VOID (tripwire) / VOID.

## Staging + budgets
- Battery on THIS file first (3x sealed) -> v1.1 pins-only. Then driver (runU31eTrain/Eval) + grad-check (CE-through-Mc exact + copy fidelity) + stage-1 (selection-rate probe) + 9T + 9E + verdict. Transcript extras Turn-141 + CHATLOG + CURRENT_TASK. NO PUSH without explicit order.
- Compute: CPU/in-worker only. Selection probes cost ~5x forwards/keep (filed); 9x800st trunk-copy trains + 9 evals, COMPLETE-gated.

## v1.1 pins (battery 3x: R1/R2 IMPLEMENTABLE + R3 NEEDS-PATCH; adjudicated same session)
- P1a HELD-OUT N=1000 (R3 SEL-noise accepted): miner-mined 66300 rows, mined ONCE per seed (deterministic base -> identical row sets across arms, paired). LIFT (+0.05, frozen constant ref: per-seed FP~=0.03 at N=1000... filed) and SEL (+0.03: diff-SE~=0.0205 at N=1000, 1.46sigma/seed, joint ~=0.015 at quorum) both evaluated at N=1000. Bars stand with this math.
- P1b diet-diversity reporting (R3 confound accepted as reporting): per-arm mineTries/kept/fallback/mean-tries-per-keep + fallback (dilution) rate in every train ledger.
- P1c E-neg 4th arm (R3 killer adopted): diet keep iff gate p>=0.5 (same caps/bases family 93600/94600). Demotion rule WITH TEETH: verdict cannot exceed TRAINS-BUT-BLIND if sel-minus-neg < 0 on 2/3 seeds, even if SEL (vs rand) holds. 12T + 12E total.
- P1d retention cross-check (R1 killer accepted as reporting): stdTwo reported for ALL arms; RET bar stays sel-focused (>= frozen-0.03, 3/3); if sel forgets where rand/neg don't, file overfitting reading.
- P1e interpretation caveat (R1 difficulty-vs-learnability, no patch): SEL + neg controls ARE the test; claim stays mechanistic (gate diet beats random), not cognitive.
- P1f 800st watch (R2 risk, no patch): standard program scale; divergence watched via curve.
