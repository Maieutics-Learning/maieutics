# Fresh-eyes premise v1 — suspicion-killHu prereg (2026-11-16)

Project: Teaching Small Models to Learn — bench-scale associative recall (h48 recurrent nets, CPU, hand-rolled tinynn). Claim under test: doubt readout `suspicion = 1 - top1` ranks errors within-regime. Artifact under review: `src/evidence/synthesis/phase-1dsusp-hu-prereg.md` v1.0 DRAFT (confirmatory spec, no runs yet).

Scope (user-confirmed): ability-not-drive; paper claims need ledgered artifacts; quarantined observations never enter paper before confirmatory prereg + fresh data; pooled metrics blind to per-brain effects (sign-flip lesson) so interpreter claims grade per-brain.

Verified claims with NUMBERS (regime-bound, h48, one task family):
- suspicion pooled AUC 0.86-0.93 on killHd/killA (filed, CONFIRMED rows in RESULTS_INDEX).
- killHu follow-up on seen brains 5002-5016 x 200 lines (`src/evidence/synthesis/ix-susp-hu.json`, bit-identical re-audit): pooled 0.5572; competent brains 0.63-0.81 (5007 0.69/34err, 5013 0.70/56err, 5016 0.81/28err); systematically-wrong brains anti-predict 0.32-0.43 (5002 0.41/148err, 5005 0.43/170err, 5006 0.37/120err, 5014 0.32/129err); 5011 acc 1.00 null.
- All prior suspicion wins were killHd/killA; killHu never measured until now. Current n=15, fully seen — quarantined observation only.

Done: run C latching DEMONSTRATED (zero-line 0.7585 ~= W1 0.763, zero-B 0.5465 covers chance), sign-flip mirror-axis confirmed per-brain ~0.73 but pooled 0.4824, Run B lines-dead. Next: confirmatory prereg proposes >=8 fresh seeds outside 5001-5024, frozen `src/tools/ix-susp-hu.js` recipe (eval-only ~200 forwards/brain), validation gate (exam identity + 200/200 argmax self-check else HALT); primary bar Spearman rho(acc, per-brain suspAUC) >= 0.6 with >=2 brains per regime (lost acc<0.5, competent acc>=0.6); secondary competent-median >0.6 AND lost-median <0.5; pooled filed with no bar; paper-claim rule blocks any killHu number until countersign + fresh-brain run.

ASK (barrage): Hammer this prereg. Verdict + single hardest test/falsifier. <=150 words, numbered. Be blunt, terse, technical. No ELI5, no padding. Points wanted: confounds, numbers that don't prove what author thinks, missing controls, cheapest next check. Name central claims, evidence for each, missing/contradictory evidence, unverified assumptions, which conclusions depend on which assumptions.
Caveat: all reviewers share one model family as the plan author — output is assumption-hunting/checklist, NOT independent confirmation.
