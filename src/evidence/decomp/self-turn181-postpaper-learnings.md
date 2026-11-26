# Post-paper program: what the experiments taught (Turn-174 → Turn-181)

Durable record for a contextless agent. Every claim cites a filed ledger/prereg/brief.
Bench: H48 MLP trunk, 8-dim carry, K=5 heads, 800-step runs, R=3 seeds 0/1/2, quorum 2/3,
COMPLETE-gated, twin-matched seed-only streams, paired evals, stackHash
258d2f060684ce382778e203959ab791abb5df79af174deef19ff568886d4d6e.
Evals: scr = round-1 retrieve vhat; two = round-2 compose from x2m=[9,9,9,9,9,9,qk,k,vhat,8]
with carry fw1.cNew passed. Assoc-recall rows: scattered [k v pairs + query], keys 0-3,
values 4-7, train 1-3 pairs, test 4 hard / 6 xlong.

## 0. Paper base (read first)
- Turn-174 briefs+debates: src/evidence/decomp/papers/brief-{01,02,03,04,05,06,07,08,09,10,11,13}-*.md,
  debate-*.md, synthesis-turn-174.md. Kill-switch (adjudicated): slope<1 + neutralize-collapse
  => architecture track; slope~=1 + no shortcut => kernel theory falsified.
- Appendix E shelves: index.html App.E batch-2/3; notes
  src/evidence/decomp/retrieval-papers-notes.md, inhibition-papers-notes.md.
- Originals: scratch/papers/{mattar-daw-2018,diekmann-2023,abraham-2008,lake-baroni-2023,langcult-2022,irie-lake-2025}.txt
  (~60-100KB each; excerpts only in prompts — never paste whole files).
- Turn-180 recheck: 3x brief fresh-eyes (R1 storage-shelf / R2 mechanisms / R3 U43-still-good) +
  synthesis + 6x original-paper reviewers, full text scratch/fresh-eyes-original-papers.md.

## 1. U39-DIAG-EXT — verdict DIAG-COMPLETE (Wave C HALTED)
- Prereg: src/evidence/decomp/self-u39-diag-ext-prereg.md v1.1 (pins P1a-P1e).
  Battery: 2x NEEDS-PATCH + 1x IMPLEMENTABLE. Driver: newai-selfu39-driver.js.
- Verdict: src/evidence/decomp/d-newai-self-u39-verdict.json. Wave A ledger-arithmetic +
  Wave B 24 frozen probes COMPLETE; Wave C (D5 gate-only trains) NOT RUN — B3 BLIND halt.
- Numbers: B1 NO-SIGNAL 0.474/0.481/0.469. B2 RATIONALLY-OPEN, shut 0/0.015/0.029,
  accClean 0.568/0.533/0.557, accSwap 0.401/0.397/0.393. B3 BLIND-EVEN-ON-ZEROS 3/3
  (gZero 0.7607/0.7056/0.7301 vs gSwap 0.7658/0.7219/0.7319 — gate blind even on zeros).
  B4 FINAL-INCONCLUSIVE x2 + 1 PASS (delta +0.033/+0.044/-0.025). B5 BIASED 3/3
  (entropy 0.8045/0.7745/0.7491 vs bar 1.0863). B6 COMPRESSION 3/3
  (slopes 0.5143/0.6433/0.4179, CI95 all <1). B7 DISSOCIATED 3/3 (rho 0.335/0.346/0.185).
  B8 r=-0.819 n=18 (LP-bandit direction INVERTED: high disagree predicts LOW gain).
  A7 CLEAN (no single-feature leak) + B6 compression = 09 MIXED. D5a/D5b NOT-RUN (B3 halt).
- License table (verdict `license`): 01-irie DEAD, 02-lake-baroni GATED-SHUT,
  03/04-colas-oudeyer ADVANCE, 05-mattar-daw ADVANCE, 06-diekmann ADVANCE, 07-sydnor ADVANCE,
  08-jarvis DEAD, 09-lippl MIXED, 10-andrychowicz ADVANCE, 11-stc DEAD, 13-langcult ADVANCE.
- Learning: gate input is blind (B3) but rationally open (B2); compression without an
  identified single leak (B6+A7) forced the U42 neutralize arm; LP signal exists but inverted
  (B8) so M1 must test LOW-disagree first; surprise/gain dissociated (B7) so M2 must test
  Gain×Need vs |PE| 3-way, not assume surprise works.

## 2. U40-GATE-AUDIT — verdict INTEGRATION-BUG (no training)
- Prereg v1.1 (pins P1a-P1c) + battery CLOSED Turn-177. Driver: newai-selfu40-driver.js.
- Verdict: src/evidence/decomp/d-newai-self-u40-verdict.json.
- Numbers: U2 GRAD-DEAD 3/3 — analytic/FD ratios 0.0653/0.0941/0.0710
  (batch FD; single-row FD exact 1.0000). U1 CONNECTED 3/3 (influence 0.942/0.911/0.889).
  U3 LIVE-INPUT 3/3 (sRange 2.0999/2.2025/3.3539). U4 MOVED.
- Cause (localized): filed u38 step divided by B twice on carry+gate paths → gate/round-2
  carry grads ~13x underweight. Effect: U38 train verdicts SUSPECT-STEP (magnitudes only);
  B2/B3 forward numbers stand. Next: corrected-step prereg (became U41). D5 stays halted.

## 3. U41-FIXSTEP — verdict FIX-VERIFIED/GATE-INPUT-SIDE
- Prereg v1.1 + battery 3x IMPLEMENTABLE + driver newai-selfu41-driver.js (single /B fix).
- Verdict: src/evidence/decomp/d-newai-self-u41-verdict.json.
- Numbers: W0 analytic/FD R0 = 1.000 3/3, twin exact 0.0. 6T+6E COMPLETE (loss0 twin-matched
  to u38). c1: two 0.58/0.545/0.585, gate g ~0.70-0.76 still open, shut-rate 0/0/0.025.
  Displacement 0.86x.
- D-g (owner adjudication, filed in verdict deviations): displacement bar >=1.2x RETIRED as
  misconceived (my error, owned) — Adam is scale-invariant + norm clip 1.0, so 16x grads
  correctly take ~same-sized steps; R2/R3 had flagged the bar auto-pass and I wrongly
  tightened it. W0 is the real step verification and it PASSED.
- Learning: weak grads do NOT explain never-shuts — gate with TRUE grads still never shuts.
  Cause = pressure-ratio (D3: 87.5% clean rows drown 12.5% mismatch) + input-signal
  (B1: gate input carries no mismatch signature; U39-B1 separability 0.47 AND corrected-step
  convergence to the same open gate). D5 un-halt criterion (shut>0.2) FAILS → D5 stays halted.
  U38 behavioral claim (never-shuts) rehabilitated as robust; all u38 magnitudes stay suspect.
  Licensed next: gate-INPUT redesign prereg (explicit mismatch features) or loud-mismatch
  diet under corrected step — neither run yet.

## 4. U42-ARMB — verdict FALSIFIED (Lippl decider, measurement only)
- Prereg v1.1 (pins P1a difficulty-guard, P1b c0-divergence veto, P1c family-grace two-trunk
  rule) + battery 3x NEEDS-PATCH. No training, forward reads only (neutralize qk==k vs qk!=k,
  y-balanced 250x4 O + 250x4 N per trunk; trunks T1=u34-c2-s0, T2=best-accTwo u34-c1, C0=u34-c0-s0).
- Verdict: src/evidence/decomp/d-newai-self-u42-verdict.json. 9/9 probes COMPLETE:
  D (accO-accN) = t1: -0.011/-0.028/-0.041(GRAY); t2: -0.025/-0.026/-0.016;
  c0: -0.021/-0.019/-0.007. 8x IRRELEVANT (|D|<=0.03) + 1x GRAY. Difficulty guard
  |scrO-scrN|>0.05 never fired. All D negative (wrong direction for a leak).
- Learning (license09): kernel/shortcut theory FALSIFIED for this bench on all 3 trunks.
  Failure = binding-dynamics (U37-style), not overlap shortcut. No architecture-track pivot;
  incentive family (03/04, 05, 06, 07, 10, 13) keeps licenses; six advanced arms keep licenses.

## 5. U43-ADVANCED — preregged + battery-closed, NOT RUN
- Prereg: src/evidence/decomp/self-u43-advanced-prereg.md v1.1 (pins P1a U=uniform control,
  P1b controls exist; no bar changes). Battery: R1/R2 NEEDS-PATCH + R3 IMPLEMENTABLE
  → v1.1 STANDS. Verdict paths (not yet created): d-newai-self-u43-m{1..6}-verdict.json + rollup.
- Modules (all frozen-trunk/random controls, quorum 2/3, COMPLETE-gated per module):
  M1 03/04 inverted LP-bandit L/H/U 9T+9E, bar L≥U+0.03 (B8 r=-0.819 direction);
  M2 05 Gain×Need G/S/R 9T+9E (10% replay), bar G≥S+0.03;
  M3 06 SFMA 90/5/5 SFMA/RI/NR 9T+9E; M4 07 staged STAGED/JOINT/LINDEC 9T+9E;
  M5 10 ramp RAMP/FLAT 6T+6E+6 transfer (diet A→B); M6 13 productive P/E/B 9T+9E +
  80%-wrong-token-break test (token decorative → DEAD regardless of deltas).
- Filed execution order (cheap-first): M2→M1→M5→M3→M4→M6 (~51 trains). Status: NO COMPUTE —
  awaiting fresh countersign (standing rule). Turn-180 amendment PROPOSED but NOT preregged:
  M1-first (M1→M2→M3→M4→M5→M6, causality: U41 signal-drowning first) + M4 gate-saturation
  baseline. Default until amended+countersigned: RUN-AS-FILED.

## 6. Turn-180 recheck — leftover audit (no compute)
- R1 storage-shelf / R2 mechanisms / R3 U43-still-good + synthesis + 6 original-paper
  reviewers (scratch/fresh-eyes-original-papers.md). Adjudication: REAL leftovers NOT in U43:
  (a) weak-tag + PRP within ~30 steps, (b) BCM sliding threshold (fixed lam=2.0 suspect),
  (c) per-episode RULE randomization (U36 varied mix, never the rule),
  (d) astrocyte second-store bias, (e) sparse subgraph-engram growth, (f) hop-count routing
  (route-not-widen). Decorative/covered: precision-guard (U41), mutual-exclusivity scorer
  (redundant under remap). Original-paper reviewers found nothing new (all pointed back to
  M2/M3/M5/M6; their SLOPED/WRONG labels = grading bench-mapping as paper claims — record
  this so a future self does not re-litigate).

## 7. Net learnings (standing)
1. The wall is USE-WITHOUT-EXCLUSION and structural at this scale (U35 WALLED-AT-SCALE).
2. The gate is blind (B3) yet rationally open (B2); true grads don't shut it (U41) → next
   fix is INPUT-side (mismatch signature) and pressure-ratio (diet), not step scale.
3. Overlap-shortcut is dead (U42); compression is real (B6) but leak-less (A7) → binding
   dynamics, not cheating.
4. LP signal is inverted (B8); surprise≠gain (B7); entropy biased (B5) → M1/M2 controls
   must test the inverted/3-way forms, not the naive ones (preregged as such).
5. Staged/developmental, trajectory, and productive-goal arms are licensed but unrun (U43).
6. Tag/BCM, rule-remap, second-store/subgraph legs are the post-U43 queue — prereg each
   separately; never fold into U43 (no cross-arm tuning rule).
7. Discipline that caught real errors: batch-vs-single-row FD (U40), difficulty guard (U42),
   twin-matched streams, frozen-trunk/random controls, COMPLETE-gating, no tuning to
   reviewers, pool = sealed labor only. Keep all of it.

## 8. Turn-184 correction (eval typo, filed, history not rewritten)
- u34:173 orc line missed `.logitsK` (u41:302 and u34:178-fwd have it; u36 uses scoreTwo).
  inMeanLogits(fw) reads fw.logitsK: given {logitsK: fwObj} it read .length=undefined and
  returned zeros, so orc always predicted class 0 (= y==0 rate per seed: 0.26/0.295/0.305).
  Blast radius: U34 ORACLE-CHECK VACUOUS (headline WALLED-AGAIN stands, two/scr-based);
  U36/U41/U39-U42 unaffected; u43 first-issue orc retracted, evals re-run corrected.
- M2 corrected orc healthy (0.61-0.725). M1-L orc collapsed with its two (circuit damage).

## 9. Where to continue (updated Turn-184)
- DONE: U43 M2 ADVANCE (replay program licensed next step), M1 INCONCLUSIVE (pure low-disagree diet damages; owed: mixed-proportion bandit prereg, never pure arms).
- Awaiting: (a) countersign for U43 M5 → M3 → M4 → M6 (filed cheap-first order after M2/M1);
  (b) gate-input redesign prereg order; (c) cross-machine float-dust validation (filed
  Turn-153, still owed). PUSH GATE tripped — NO PUSH without explicit user order + PAT.
  Unpushed backlog rides next push (see scratch/CURRENT_TASK.md).

## 10. Turn-185 U43-M5/M3/M4/M6 verdicts (all COMPLETE-gated, pin 258d2f06 6/6)
- M5 ADVANCE: late-weighted trajectory aux beats flat at quorum (s1/s2) with relative transfer hold (s0/s1). Absolute transfer absent (twoB ~chance) — the remap test as built measures map-lock, not rule-learning; absolute transfer needs a gentler family distance (next prereg).
- M3 DEAD: full SFMA (strength x similarity x IoR + reverse/default TD-switch on a genuinely skewed 95/5 hetero diet) is indistinguishable from no-replay. Replay as a mechanism is unusable on this substrate at this scale — converges with M2's lesson (only gain×need selection, not replay itself, earned the ADVANCE).
- M4 INCONCLUSIVE: freezing the trunk mid-run (phase-B brake) destroys the round-2 circuit (oracle collapses with two). Staged plasticity as built = damage, not development. Directional JOINT/LINDEC>=STAGED 3/3 would be DEAD above floor.
- M6 DEAD: goal tokens are decorative twice over (P~=E + break test 0.19-0.35 vs 0.80). Discrete goal-conditioning does not route this circuit; the round-2 path ignores the token slot.
- Net: the licensed forward paths are M2-style selection (pick WHAT to train on) and M5-style trajectory pricing (price WHEN losses matter). Substrate/replay/staging/token levers are exhausted on this bench. Remaining queue: mixed-proportion bandit, gate-input redesign, cross-machine dust check.

## 11. Turn-186 U44/U45 verdicts (both COMPLETE-gated, pin 258d2f06)
- U44 DEAD-INVERTED: at 75/25 mixtures the inverted direction holds HIGH>=LOW 3/3 with wide gaps (+0.12..+0.175) while LOW sits at/below floor. M1's collapse was not diet pathology — low-disagree rows are genuinely the WORST training signal and high-disagree the best. The bench rewards seeking disagreement, not resolving uncertainty (B8 r=-0.819 robust). LP-selection is dead in both directions-conceived forms; the surviving lesson is M2's (select by gainxneed, which correlates with disagreement here, not by LP theory).
- U45 DEAD: the gate received perfect mismatch features with verified flowing gradients and still output g~0.72-0.90 identically on clean and donor rows (gap 0.004). Combined with U41 (true grads) this closes all three candidate causes except pressure: the loss simply never rewards shutting (87.5% clean). Any future gate work must change the pressure ratio first (loud-mismatch diet) — input-side work is exhausted.
- Net: two independent lines (LP-curiosity, state-gating) are now fully dead with mechanism-level cause assigned (inverted-signal, pressure-ratio). Remaining live levers: M2 selection, M5 trajectory pricing, loud-mismatch pressure redesign.

## 12. Turn-187→194 U46-U50 verdicts (all COMPLETE-gated, pin 258d2f06; selection-only claims)
- U46 ADVANCE-PROT (Turn-188): Rolls STOCH T0.5 beats DET 2/3 (s1 +0.035, s2 +0.095; s0 -0.05 fail); Battaglini RES sigma0.3 beats DET 1/3 only. Probabilistic picking helps memory combine; additive blur mostly decorates stationary. Licenses temperature follow-up; U47/U48 owed.
- U47 DEAD-COMBO (Turn-190): STOCH≥BOTH 2/3 (s0 -0.075, s1 -0.105 hold; s2 +0.105 lone BOTH win, two 0.555 best single score but 1/3 = no license). Dice+smudge (total std ~0.71) overshoots — extra static hurts at quorum. Stacking dead at these doses; joint sigma×T grid licensed to test s2 pocket.
- U48 SHELVED (Turn-192, user order): percentage-blur never executed. No verdict, no ledgers.
- U49 DEAD (Turn-193): margin-gated stacking dGS -0.02/-0.09/+0.05, gateRate ~0.19-0.20 healthy yet changes nothing at quorum (s2 GATE 0.5 beats both parents, loses quorum). Fixed/percentage/smart stacking now 0/3 families. Dice-alone (U46 STOCH) stands as only noise win.
- U50 ADVANCE-DRIFT (Turn-194): rotating menu {0,1}/{2,3} quarters; both beat DET, tiebreak RES mean margin 0.22 > STOCH 0.155 (s0 +0.14/+0.09, s1 +0.08/+0.065, s2 +0.00/+0.025; floorBad 0). Same blur dose that lost stationary wins under drift; dice also beats DET. First conditional breach: stationary → dice rules; rotating → blur rules. D1: first-issue hot sets {4,5}/{6,7} never occur (qk domain {0,1,2,3} probe-verified); fixed to alternates + force flag; wave0+9T force-overwritten (filed precedent).
- Review-protocol lesson (Turn-193/194): LONG pasted-review discussion prompts trigger fiction-drift (U49W0 D2/D3, U47W2 pattern); SHORT verdict-only 4-line prompts run clean. Fiction rounds discarded as reviewer failure, redone strict; verdicts stand on owner arithmetic vs filed JSONs.

## 12a. CORRECTION (filed Turn-196, wording-only, verdicts stand)
- U50 "mean margin 0.22>0.155" is a mislabel: mRD/mSD are SUMS of qualifying margins per driver L234-235 (dRD qualifying [0.14,0.08] sum 0.22; dSD qualifying [0.09,0.065] sum 0.155; s2 margins +0.00/+0.025 excluded as below 0.03). ADVANCE-DRIFT (mRD>=mSD) stands; verdict JSON frozen with the same wording, corrected here. Fresh-eyes log audit (fresh-eyes-log-audit-3x-results.md): 3x independent flagged mostly reviewer errors (dGS-sum, pin/quorum confusion, 185/186 "missing", U48-no-ledger, P1-P5/M2-M1 "missing"); discussion unanimous CONFIRM with the sum-not-mean correction as the single real issue.
- Turn-180 gap filed honestly: 3x brief raw texts never separately filed; adjudication (§6) stands on owner read.
- scratch/CURRENT_TASK.md never ships (private working record); Turn-195's "+ this file rides push" corrected — durable state is CHATLOG + extras + this doc.
- Net: live levers are M2 selection, M5 trajectory pricing, drift-conditional blur (dose grid UNDER DRIFT + GATE-under-drift re-test), loud-mismatch pressure redesign. Queued pre-countersigned: STOCH-replay, loud-mismatch+STOCH, trajectory+replay, U47b RAND-DET, U51 split/resting, dust (blocked, needs second machine).
