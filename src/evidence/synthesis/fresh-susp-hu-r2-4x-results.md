# Fresh-eyes R2: suspicion-killHu prereg v1.1 → v1.2 check (2026-11-16, 4x re-review)

Premise: `src/evidence/synthesis/fresh-susp-hu-premise-v2.md` (frozen v2).
Artifact: `src/evidence/synthesis/phase-1dsusp-hu-prereg.md` v1.1.
Ran: 4 sequential root.generateText calls sharing premise prefix (generalist / math / implementation / rival-containment), <=150 words each. Fresh calls (never reuse reviewers across versions — satisfied; all calls new).

## Raw replies (verbatim)

### R1 generalist re-check
1-6 all Fixed (N≥10/fill-14; mid-zone out-of-medians + frozen bins; p+CI; line-hash + seed + loader-agreement; recipe hash + exclusion; diagnostic + downgrade). Verdict: VALID. Hardest falsifier: lucky seed distribution with 0.5–0.6 mid-zone densest miscalibrated confident errors inflating rho despite quarantine.

### R2 math re-check
1-6 all Fixed. Verdict: sound for screening; loader-agreement closes hash-leak loophole. Hardest falsifier: brain-bias downgrade is non-gating — model could pass rho while high-suspicion everywhere (predict-error-for-noise). Stat fix: minimum-entropy requirement on raw softmax (pre-suspicion) so model isn't collapsing to global mean.

### R3 implementation re-check
1-6 all Fixed. Verdict: PASS, protocol mathematically closed; accuracy→loader-agreement removes lucky-noise pass on corrupted loader. Ambiguity: brain-bias downgrade rule qualitatively described; exact downgrade-vs-halt threshold not quantified. Hardest falsifier: lucky seed skewing pooled rho (mitigated by ≥3/regime + CI, single outlier still possible without strict downgrade handling).

### R4 rival-containment re-check
1-6 all Fixed. Verdict: compliant. Hardest falsifier: distributional shift — rho holds but Δmean(suspicion) negligible between bins makes ranking functionally void. Containment: PARTIAL — diagnostic flags offset bias but not suspicion↔difficulty covariance within a brain; systemic under-calibration could pass gates + diagnostic. Cheapest killer: corr(suspicion, error) pooled; if not positive, metric is noise.

## Adjudication (assistant owns verdict)

- 6/6 fixes CONFIRMED across all 4 reviewers (24/24 fixed). No v1.0 complaint survives.
- R1 lucky-mid-zone inflating rho: NOTED, no patch (mid-zone is IN rho by design so density is visible; CI disclosure + joint rho+medians gate already handle it; train-until-filled bounds sampling luck).
- R2 minimum-entropy gate: REJECT as gate (new mandatory procedure without retiring one — violates U8 no-accretion rule; mini-prereg screening stays lean). PARTIAL as disclosure: report mean raw-softmax entropy per regime alongside diagnostic (report-only, no bar).
- R3 downgrade threshold unquantified: ACCEPT. Patch v1.2: downgrade triggers iff median over lost-regime brains of Δ = mean_susp(incorrect) − mean_susp(correct) ≤ 0.02 (rank without separation = bias, not detection). Still non-gating finding with teeth (PASS demotes to scoped brain-bias finding), not a HALT.
- R4 pooled corr(suspicion, error): REJECT as gate (reintroduces pooled grading the sign-flip lesson retired; within-brain rank IS per-brain AUC already). Under-calibration-leak worry behind it: covered by the now-quantified Δ diagnostic (R3 patch).
- Score: 4 reviewers, 1 accept (R3 threshold), 1 partial (R2 disclosure), 2 noted/rejected with reason. Round is near-barren (no kills, refinements only) — one v1.2 touch-up, then verification round for the stop rule.
