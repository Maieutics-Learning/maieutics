# Suspicion killHu boundary — mini-prereg v1.0 DRAFT (pending countersign, no runs)

Status: DRAFT 2026-11-16. Quarantined confirmatory spec. No kill power over any frozen verdict (ix PILOT-FAIL, Run B/C, sign-flip all stand regardless).

## Observation being tested (from current 15, seen brains 5002–5016 × killHu 200)

- Pooled suspicion (1 − top1) AUC 0.5572 on W1 lines exactly (`src/evidence/synthesis/ix-susp-hu.json`, re-audited bit-identical 2026-11-16).
- Per-brain pattern: anti-predicts where brains are systematically wrong (5002 0.41/148err, 5005 0.43/170err, 5006 0.37/120err, 5014 0.32/129err); ranks where competent (5007–5016: 0.63–0.81, 5011 acc 1.00 null).
- All previously filed suspicion wins (0.86–0.93) were killHd/killA; killHu unmeasured until now. Current n=15 is small and fully seen — confirmatory runs on FRESH brains (different seeds, never 5001–5024).

## Confirmatory design (fresh brains × killHu)

- Brains: ≥8 fresh seeds outside 5001–5024, trained with the frozen 1.b-recipe retrain path (same as Run B brains, not the ix-pilot brains). KillHu lines: `G.buildExams(7008).killHu` (200/brain, same constructor for comparability).
- Readout: suspicion = 1 − top1 softmax via `G.loadModel` + EVAL_R argmax, exact recipe `src/tools/ix-susp-hu.js` (eval-only, ~200 tiny forwards/brain, no probe nets, no retraining).
- Validation gate: exam identity (200 killHu lines/brain) + forward self-check on one brain vs filed loader (argmax agreement 200/200), else HALT.

## Bars (pre-registered)

- Primary (per-brain, not pooled — sign-flip lesson: pooled mixes incompatible scales): Spearman rho between brain accuracy and per-brain suspicion AUC ≥ 0.6 across ≥8 fresh brains, with ≥2 brains in each regime (acc < 0.5 lost, acc ≥ 0.6 competent), else the boundary account FAILS.
- Secondary (regime direction): competent-regime median per-brain suspAUC > 0.6 AND lost-regime median < 0.5, else the inversion half FAILS.
- Pooled AUC reported without a bar (mixing regimes makes pooled uninterpretable; filed for the record only).
- Paper-claim rule: no killHu suspicion number enters the paper until this prereg is countersigned AND its bars run on fresh brains. Until then the 0.5572 stays a quarantined observation.

## Cost

Eval-only, CPU minutes. Needs fresh-brain blobs (future training, not current scratch). Nothing in current scratch blobs is needed after this file: re-running the observation uses the frozen recipe; the confirmatory uses new brains.
