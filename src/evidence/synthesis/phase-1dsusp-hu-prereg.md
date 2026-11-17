# Suspicion killHu boundary — mini-prereg v1.2 COUNTERSIGNED (user countersign 2026-11-16, binds v1.2; run 2026-11-16-02 filed FAIL-regimes-unfilled)

Status: DRAFT 2026-11-16 (v1.2). Quarantined confirmatory spec. No kill power over any frozen verdict (ix PILOT-FAIL, Run B/C, sign-flip all stand regardless). Changes vs v1.1: downgrade threshold quantified (R3) + raw-entropy disclosure report-only (R2 partial, per U8 no new gates). Bins + bars frozen here before any fresh run (R5).

## Observation being tested (from current 15, seen brains 5002–5016 × killHu 200)

- Pooled suspicion (1 − top1) AUC 0.5572 on W1 lines exactly (`src/evidence/synthesis/ix-susp-hu.json`, re-audited bit-identical 2026-11-16).
- Per-brain pattern: anti-predicts where brains are systematically wrong (5002 0.41/148err, 5005 0.43/170err, 5006 0.37/120err, 5014 0.32/129err); ranks where competent (5007–5016: 0.63–0.81, 5011 acc 1.00 null).
- All previously filed suspicion wins (0.86–0.93) were killHd/killA; killHu unmeasured until now. Current n=15 is small and fully seen — confirmatory runs on FRESH brains (different seeds, never 5001–5024).

## Confirmatory design (fresh brains × killHu)

- Brains: >=10 fresh seeds outside 5001–5024, train-until-filled up to 14 total to reach ≥3 per regime else FAIL (regime bins pre-defined below, fixed before any fresh run). Trained with the frozen 1.b-recipe retrain path (same as Run B brains, not the ix-pilot brains); hyperparams + seeds filed in the run ledger. Seed exclusion enforced by range filter + filed seed log (no 5001–5024 reuse).
- KillHu lines: `G.buildExams(7008).killHu` (200/brain, same constructor for comparability). Exam identity = exactly these 200 lines/brain; line-hash + seed list logged in the ledger.
- Readout: suspicion = 1 − top1 softmax via `G.loadModel` + EVAL_R argmax, exact recipe `src/tools/ix-susp-hu.js` (eval-only, ~200 tiny forwards/brain, no probe nets, no retraining; recipe hash logged, read-only).
- Validation gate: exam identity check (200 lines/brain from 7008) + forward loader-agreement self-check on one brain vs filed loader (argmax equals filed-loader argmax on all 200 — a stability/loader check, NOT accuracy), else HALT.

## Bars (pre-registered; bins frozen pre-data)

- Regimes (fixed before fresh seeds): lost acc < 0.5, competent acc >= 0.6. Mid-zone 0.5–0.6: INCLUDED in rho, EXCLUDED from medians (stated so empty-middle is visible, not hidden).
- Primary (per-brain, not pooled — sign-flip lesson: pooled mixes incompatible scales): Spearman rho between brain accuracy and per-brain suspicion AUC ≥ 0.6 across fresh brains, with ≥3 brains in each regime, else the boundary account FAILS. Report exact p + 95% CI for rho alongside the bar (disclosure; bar stays ≥0.6 screening-level at this N).
- Secondary (regime direction, joint with primary — both must pass): competent-regime median per-brain suspAUC > 0.6 AND lost-regime median < 0.5, else the inversion half FAILS.
- Pooled AUC reported without a bar (mixing regimes makes pooled uninterpretable; filed for the record only).
- Exploratory non-gating diagnostic (R4 rival: brain-level calibration bias): mean suspicion on correct vs incorrect lines per brain per regime, plus mean raw-softmax entropy per regime (report-only, no bar — R2 partial). Downgrade rule (quantified, R3): median over lost-regime brains of Δ = mean_susp(incorrect) − mean_susp(correct) ≤ 0.02 triggers DOWNGRADE to scoped brain-bias finding even if gates pass — filed with its true label, not a clean PASS.
- Paper-claim rule: no killHu suspicion number enters the paper until this prereg is countersigned AND its bars run on fresh brains. Until then the 0.5572 stays a quarantined observation.

## Cost

Eval-only, CPU minutes. Needs fresh-brain blobs (future training, not current scratch; train-until-filled bounded at 14 brains). Nothing in current scratch blobs is needed after this file: re-running the observation uses the frozen recipe; the confirmatory uses new brains.
