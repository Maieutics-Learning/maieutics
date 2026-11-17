# Fresh-eyes R1: suspicion-killHu prereg v1.0 (2026-11-16, 6x barrage)

Premise: `src/evidence/synthesis/fresh-susp-hu-premise-v1.md` (frozen v1).
Artifact: `src/evidence/synthesis/phase-1dsusp-hu-prereg.md` v1.0 DRAFT.
Ran: 6 sequential root.generateText calls sharing premise prefix, role-specific TASK suffix (generalist / math / implementation / rival / scope / blind-spot), <=150 words each. Same-model caveat applies (checklist, not independent confirmation).

## Raw replies (verbatim, truncated to 12000 chars total at capture)

### R1 generalist
High risk overfit n=15; sample bias seen->fresh; Spearman rho>=0.6 low bar, noise inflates; suspicion may track entropy/variance not error awareness; assumes top1 gap linearly maps. Hardest falsifier: 20+ fresh seeds, rho<0.6 or lost median>=0.5 kills claim; cheapest: correlate suspicion with output variance same input across seeds.

### R2 math/stat
rho>=0.6 at n=8 weak (p~0.2, barely escapes noise). Regime gap 0.5-0.6 leak (0.55 discarded, biases medians/rho). Pooled-no-bar correct (sign-flip lesson, vanity metric otherwise). Medians fragile at n=2/regime, one outlier flips. Verdict: underpowered. Fix: n>=20 or Bayesian CI for rho.

### R3 implementation
Enforceable (gate binary, recipe hash-check, seed range filter). Ambiguities: exam identity undefined (hash? metadata? brain ID?); 200/200 self-check ambiguous (zero variance vs equals ground truth); training path frozen or eval-only? Fix: exam identity as crypto hash of weights/config; else fresh-seed unverifiable, silent 5001-5024 leakage possible.

### R4 rival
Weak (correlation conflates knowing-when-wrong with being stable). Rival: confidence calibration bias — competent brains peaked regardless of correctness, lost brains flat regardless; 0.32-0.43 anti-prediction is brain-level bias not error detection. Killer: fixed-confidence probe — suspicion on correct samples per brain; if lost brains high-suspicion when correct, effect is bias. Contained? No — rho aggregates across brain, ignores correct-baseline.

### R5 scope/quarantine
Quarantining results != quarantining hypotheses; rho>=0.6 tuned to pilot (p-hack risk). Comparability sound if 7008 frozen + recipe read-only. Sampling risk high (n>=2 floor not significance; one weird brain tanks/inflates rho). Fix: pre-define accuracy bins before fresh seeds; post-hoc regime = circular.

### R6 blind-spot
Range-restriction accidental success: bimodal broken-vs-competent + empty mid-regime => spurious rho from extreme noise. Medians >0.6/<0.5 too loose, one acc=1.0 outlier drags median. Guardrail: min N>=4 per bucket before rho; too-small lost bucket = seed fluke not property.

## Adjudication (assistant owns verdict)

- R1 sample-bias (seen sets bar for fresh): REJECT as stated (prereg confirmatory is fresh-only by design; seen only motivates). Seen->fresh leakage concern behind it: ACCEPT as implementation requirement (seed exclusion + log, see R3 fix).
- R1 rho>=0.6 low/noise + R2 power (p~0.2 at n=8): ACCEPT. v1.0 bar is screening-level, not proof. Patch: keep rho>=0.6 bar but add exact p + 95% CI disclosure; raise N to >=10 (≥3/regime) so rho>=0.6 starts to mean something; mid-zone rule explicit.
- R1 entropy-proxy + R4 calibration-bias rival + fixed-confidence probe: ACCEPT (rival with teeth). Patch: add non-gating exploratory diagnostic (mean suspicion correct vs incorrect per brain per regime); gate stays rho+medians. If lost brains high-suspicion even when correct, boundary account downgrades to brain-bias.
- R1 linear-mapping assumption: REJECT (reviewer error — bar is rank-based Spearman, not linear).
- R2 regime gap 0.5-0.6 leak: ACCEPT. Patch: mid-zone 0.5-0.6 included in rho, excluded from medians (stated explicitly); bins fixed before fresh data (see R5).
- R2 pooled-no-bar correct: AGREE (no patch, confirms design).
- R2/R6 medians fragile at n=2, N>=4 demand: ACCEPT in spirit, PARTIAL in number. n>=20 / N>=4 per bucket = unaffordable for a mini-prereg screening run. Patch: >=3/regime (total >=10), train-until-filled up to N=14 max else FAIL; medians + rho must BOTH pass (joint gate already).
- R3 exam-identity ambiguity: ACCEPT. Patch: identity = G.buildExams(7008).killHu exactly 200 lines/brain + line-hash logged + seed list logged; fresh = outside 5001-5024 enforced by range filter + filed seed log.
- R3 200/200 self-check ambiguity: ACCEPT. Patch: self-check = loader/forward agreement (argmax equals filed-loader argmax on all 200), NOT accuracy; mismatch => HALT.
- R3 training-path frozen?: ACCEPT. Patch: training path frozen (1.b-recipe retrain, hyperparams + seeds filed); eval recipe read-only (`src/tools/ix-susp-hu.js` hash logged).
- R3 crypto-hash-of-weights fix: PARTIAL. Weights hash is overkill for the threat (threat is seed reuse, covered by seed log + range filter); adopt exam-line hash + seed log, not weight hash.
- R5 p-hack/tuned-to-pilot: PARTIAL. Thresholds were set from the pilot pattern — that is what a confirmatory prereg does — but risk is real. Patch: bins + bars frozen here (v1.1) before any fresh run; no post-hoc moves.
- R5 comparability sound-if-frozen: AGREE (patch freezes it).
- R5 post-hoc regime circular: ACCEPT. Patch: bins pre-defined (lost <0.5, competent >=0.6) before fresh seeds; mid-zone handling stated.
- R6 range-restriction/bimodal-gaming: ACCEPT (same fix as power: >=3/regime, joint rho+medians gate, mid-zone included in rho so empty-middle is visible, not hidden).
- Score: 6 reviewers, 11 accepts/partials, 3 rejects (1 reviewer error, 1 over-strict, 1 misread), 0 stale-number errors (premise hygiene held).

## Patch list (→ v1.1, one pass)
1. N >=10 fresh brains (was >=8), ≥3 per regime, train-until-filled up to 14 else FAIL.
2. Mid-zone 0.5–0.6: in rho, out of medians; bins frozen pre-data.
3. Stats: report exact p + 95% CI for rho alongside bar (bar stays ≥0.6 screening).
4. Validation gate explicit: exam identity (200 lines, 7008, line-hash + seed log) + loader-agreement 200/200 (not accuracy) else HALT.
5. Freeze training path (1.b-recipe + hyperparams + seeds filed) + eval recipe hash logged + seed exclusion 5001–5024 enforced.
6. Add non-gating fixed-confidence diagnostic (R4): mean suspicion correct vs incorrect per brain; brain-bias downgrade rule.
