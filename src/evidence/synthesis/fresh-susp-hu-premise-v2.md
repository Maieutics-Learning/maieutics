# Fresh-eyes premise v2 — suspicion-killHu prereg v1.1 (2026-11-16)

Project: Teaching Small Models to Learn — bench-scale associative recall (h48 recurrent nets, CPU, hand-rolled tinynn). Claim under test: doubt readout `suspicion = 1 - top1` ranks errors within-regime. Artifact under review: `src/evidence/synthesis/phase-1dsusp-hu-prereg.md` v1.1 (patched after R1 6x; BINS + BARS FROZEN before any fresh run).

What changed v1.0 → v1.1 (R1 patch list, verify each is actually fixed):
1. N >=10 fresh brains (was >=8), ≥3 per regime, train-until-filled up to 14 else FAIL.
2. Mid-zone 0.5–0.6: in rho, out of medians; bins (lost <0.5, competent >=0.6) frozen pre-data.
3. Stats: exact p + 95% CI for rho disclosed alongside ≥0.6 bar.
4. Validation gate defined: exam identity = 200 lines/brain from G.buildExams(7008) + line-hash + seed log; loader-agreement 200/200 = argmax equals filed loader (NOT accuracy) else HALT.
5. Training path frozen (1.b-recipe + hyperparams + seeds filed) + eval recipe hash logged + seed exclusion 5001–5024 enforced.
6. Non-gating fixed-confidence diagnostic (mean suspicion correct vs incorrect per brain; brain-bias downgrade rule even if gates pass).

Still true: pooled 0.5572 quarantined (seen 5002-5016 x 200, per-brain 0.32-0.81); prior wins 0.86-0.93 were killHd/killA; confirmatory is fresh-only; pooled filed with no bar; paper-claim rule blocks killHu numbers until countersign + fresh run.

ASK: Re-review the PATCHED prereg. For each v1.0 complaint above: fixed / partially / still-open (one line each, numbered). Then verdict + single hardest remaining test/falsifier. <=150 words total, numbered. Blunt, terse, technical. No ELI5.
Caveat: reviewers share one model family as the author — checklist, NOT independent confirmation.
