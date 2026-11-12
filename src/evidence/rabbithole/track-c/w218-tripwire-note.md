# Wave 218 note — backlog-W187 tripwire-world rebuild (sandbox, executed)

STOP RULE: stopped after 3 fit scripts (coarse shared-mu0 [killed by fq floor] + per-difficulty + joint-hard + E-20000 + map math; no dud-mixture / late-onset arms — spawned W204, not built). 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (worker sandbox; w187/w187b/w187c/w187d-tripwire.js). Clock: R33 5/5 FULL. Pre-registered predictions scored: (a) PARTIAL (b) FAILED-number/CONFIRMED-direction (c) CONFIRMED (d) CONFIRMED-ish. All owned below.

## Direct: the world is Gaussian quality with difficulty as baseline noise; E is 10x assumed

World: X_t ~ N(mu_t,1); persistent (mu0-delta always) / transient (delta for D obs, onset 1-or-uniform) / clean; expanding (fire first t>=2 with mean_1..t<theta) vs trailing-W vs fixed (single look at trailing-M). Trial mix pip=.45. Fit to all 9 W157/W178 cells + fixed anchors.
- Round 1 (shared mu0) DIED on the falseQ floor (easy fq .38 vs .03) — the exact death of W178's killed branch, reproduced then diagnosed: one baseline cannot serve fq .03 and fq .70 under one rule. Difficulties MUST differ in baseline noisiness. Second time the ledger learns difficulty=noise (cf. W168 overlap, W184 meter).
- Round 2 (per-difficulty mu0/delta/transients, onset-U): easy EXACT — (2.27/.0022/.0295) vs (2.3/.002/.03) at mu0=2.4, delta=2.7, pit=.1, D=2, onset-U, expanding (score .09!). Med: (2.52/.049/.111) vs (2.7/.04/.115) under expanding. Hard-t5 under expanding: delay 2.61 ✓ fq .437 ✓ esc .0035 vs .09 ✗ (25x miss — THE residual). Expanding beats trailing at every difficulty for t5 cells: adjudication for expanding, decisive on easy/med.
- t55-delay-4.0 anomaly: NO expanding config reaches 4.0 (theta-up fires faster, 2.3-2.7). trail4 in a shared-ish world gives (4.14/0/.7006) vs (4.0/.03/.70) — delay and fq EXACT. So the .55 arm differed STRUCTURALLY (window-4 averaging, not just theta=.55) or "4.0" is the range-upper misassigned by w170 (2.7->t5/4.0->t55 may be a misread of "2.7-4.0"). Both readings recorded; W204 owns the adjudication (dud-mixture + same-spec test).
- (b)/(c) E measured .0126 ± .0008 (n=20000, easy fitted world, fixed-8 single look) — an ORDER OF MAGNITUDE above W198's [0,.002] range. Number FAILED, direction CONFIRMED: E_fixed (.0126) > E_seq (.0022) — 7 looks beat 1 (expanding's "6 extra chances" logic holds; W198's hoped E≤.002 pointed the wrong way). The failed bound stays in the trail (second failed bound this round after W212's patience — report both).
- (d) Map re-derived: easy — seq wins iff d > (-.0104+.0344r)/5.7: at r=1 d*=.0042 (W198 .0054, −22%); at r≤.3 seq wins EVERYWHERE incl. d=0 (fixed's escape penalty dominates) — the d≈0 fixed-corner VANISHES for E>.0022. Bottom line SURVIVES and strengthens: easy decision still E-insensitive in practice (seq dominates or nearly). Med: r* .708→.602 (−15%, map stands with shifted numbers; d-lines move with it). Hard: LEFT ON LEDGER CELLS (fitted esc untrusted — residual) + dud-mixture hypothesis (9% weak persistents) → W204.

Verdict: USED (world rebuilt, 7.5/9 cells matched, rule adjudicated, E measured 10x, bound inverted, map re-derived where the fit is complete). No precursor, no conflict.

## Tangential: fit the rule and the world on separate ledgers (0-spend, reasoning only)

Round 1 failed because it coupled them (shared mu0 forced the rule to compensate). Round 2's structure — per-difficulty worlds, one shared rule, rule adjudicated by SUM of best-fits — separates "what the world is" from "how we watch it." The t55 anomaly then reads cleanly as rule-vs-world ambiguity rather than mush. Generalize: when a replication has N knobs and M rules, fit worlds per-condition and adjudicate rules across conditions; never fit one world-rule pair to everything. (W212's weather-vs-misleading is the same cut: instantiation vs mechanism.)

## Spend / queue

- Spend: 0 + 0 + 4 sandbox scripts (search ~1500 configs x 2000 trials + E-20000 + map; floor). Consumed backlog-W187 removed; spawned W204 to BACK. Backlog 17. Synthesis R33 clock: 5/5 FULL → next R34 synthesis (Wave 219, queue-jump).
- W204 (C, sandbox): hard-escape residual + t55-rule anomaly — dud-mixture (9% weak/zero-shift persistents) for hard esc .09; same-spec test for the .55 arm (shared world, rule-pair fit — already joint-scored; extend with dud fraction + late-onset); range-reading check (was "4.0" ever theta-specific?); close or bound both residuals.
