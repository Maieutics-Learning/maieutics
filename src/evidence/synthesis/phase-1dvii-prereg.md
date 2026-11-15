# Phase 1.d.vii prereg v1.0 (2026-11-14 — COUNTERSIGNED FROZEN; user said "freeze and run it")

## Objective
Test whether a last-layer Laplace posterior doubt readout beats point-estimate
loudness (1−top1) on the filed killA+killHd exams. Eval-only: no new training
design, MAPs = exact 1.b-recipe retrains (replication-gated like iii).

## Method (frozen on countersign)
- Subjects: same 8 dump subjects (311/314/315/316-staged, 312/317-constant,
  313/318-instdrop). Retrain via dump-driver recipe; replication gate on filed
  ev (bit-exact required) or the subject is dropped from vii (no override).
- Capture: penultimate features + logits per line on filed killA+killHd (7008).
- Posterior: last-layer only (4×48 W + 4 b = 196 params). GGN of hard-label
  cross-entropy NLL summed over the 1000-line train pool (buildPool(7)) at MAP,
  plus λI. (Pre-registered likelihood choice: task ground-truth NLL, not the
  soft-transmission objective the MAP trained on — that mismatch is post-mortem
  candidate (d) territory if vii fails.)
- Prior precision: grid λ ∈ {1e-3, 1e-2, 1e-1, 1, 10, 100}; select by min mean
  predictive NLL on 200 validation lines = first 200 of buildPool(4242)
  (disjoint from every filed/registered seed: 7, 33/41/42, 7008, 901–918).
  Tie → larger λ. λ scales covariance only; MAP never refit.
- Predictive: linearized probit primary (deterministic); seeded K=32 MC fallback
  (seed 6000+subjectSeed) only if probit is degenerate — fallback declared in
  the verdict either way. Doubt score primary = 1−top1 of mean predictive
  (apples-to-apples vs loudness); predictive entropy secondary.
- Comparison: AUC for error prediction on identical lines (Mann-Whitney, ties
  averaged — same statistic as v/vi).

## Staged bars
- Pilot (s313 only, 400 lines): Laplace-AUC ≥ 0.85 AND killA acc == 1.00 AND
  killHd acc ≥ 138/200 (frozen 140/200; ≤2-line regression). Any miss → vii
  dies at pilot, post-mortem owed, no full run.
- Full (8 subjects, 3200 lines): pooled Laplace-AUC exceeds loudness 0.9293 by
  ≥ 0.01 AND every subject killA perfect AND every killHd within 2 lines of
  frozen. Else loudness travels, Laplace parked as scoped negative.

## Doubt instruments (filed pre-run)
- Expectation (mine, numeric): s313 Laplace-AUC 0.78–0.88. Energy hit 0.83 on
  s313; a linear-Gaussian on a memorize-lean MAP should land near it or below —
  above 0.88 would surprise me (suggests curvature genuinely separates confident
  errors), below 0.78 would confirm the bad-peak story early.
- Pre-mortem: strongest objection = Gaussian around a memorize-lean MAP just
  re-describes the sharp peak (curvature of a bad optimum is still the wrong
  shape); most likely failure = λ grid collapses to an endpoint (huge λ ≈ MAP,
  tiny λ = garbage spread), no middle wins.
- Nearest-failure: U-err sharpening (extra machinery on a bad MAP sharpens,
  never calibrates); committee shared-mode (one Gaussian can't diversify a
  failure all models share).
- W (kill): pilot AUC < 0.85 or killA < 1.00 → vii dies + post-mortem owed;
  full AUC ≤ 0.9293 → no replacement, loudness travels.

## Feeds, cost
- Feeds F-new + L0/L1 + 1.e.iii Laplace line (pass or fail).
- Cost: pilot = 1 retrain (~8 min) + capture + 196×196 algebra (minutes);
  full = 8 retrains (~50 min, resume-safe partial) + captures. Pool 0.
- Determinism: seeded everything; same engine; bit-exact retrains verified by
  replication gate. Seeded MC (if used) recorded with seed.

## Research arm (quarantined diagnostic, authorized at freeze — never confirmatory)
- At the user's "half frozen brains and half little bit unfrozen brains" request:
  pilot runs TWO s313 brains: (1) frozen MAP per above (confirmatory, owns the
  bars); (2) slightly-unfrozen clone: +10 hard-label steps on the subject's own
  killHd error lines (mirrors the 50-step U-err recipe, "little bit" = 10 steps;
  batch 16, lr 5e-3, seed 9500+313, attnKeep 0) then the SAME Laplace pipeline
  (own GGN at the unfrozen point, same λ grid + same validation selection).
- Arm (2) is diagnostic-only: reported beside the verdict, never enters bars,
  never rescues a failed pilot, never enters confirmatory ledgers. Rationale
  (research): test whether a small move off the memorize-lean MAP changes the
  curvature story (suspect (a) probe) and whether doubt survives a few
  correction steps, given the earlier 50-step diagnostic showed corrections
  sharpen remaining errors louder.
