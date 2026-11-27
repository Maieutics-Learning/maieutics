# Premise artifact U64h v1.1 (frozen 2026-11-27; round-2 reads THIS)

v1.0 premise + round-1 rulings (10/10 NEEDS-PATCH → 3 adopted, rest rejected with
derivations; details in
`reviews-u64h/fresh-eyes-self-u64h-v1-barrage-results.md`).

v1.1 changes (all gloss/driver-level, NO behavior change): (B1) burst-derivation
gloss — 4 slots = measured burst (1–2 slots post-switch evidence) + minimal
context for the min/max-condition to bite (8 dilutes per U64e measurement; ≤2
cannot host the guard); relativity forced by filed B0 range. H3 remains the
honest loop if the scale is wrong. (B2) flat-line W0 check — constant-m vector
asserts zero fires for all three sensors, else HALT. (B3) verdict-order sentence
(PIN → HALT → floor → Gate 1 → Gate 2; W0/burn-in halts are run aborts, never
verdicts). Rejections: Gate-1 bypass (same-arm conjunction, driver checks Gate 1
first); senPick static-lookup (signal varies with draws, policy-dependence
filed); shared-stream (draws per-arm disjoint, weights shared by design);
quorum-collapse (D-graded never gates; FA-cap move underived; 7/33 fixed by filed
rules); pass-ambiguity (normative prereg defines slots/pre-pick; premise
compression by design; W0 twin+units enforce); count-inflation (hits must
distribute ≥2/3 windows; ±1 jitter can't move a 21-wide window); oracle leak
(sensors-dead + orTrig-alive → ORACLE-ONLY is the correct filed non-win).

v1.1 design (unchanged in substance): 4 arms (senMax 121, senPick 122, senMargin
123, orTrig 124 positive control) × 20 = 80 reads-only re-evals on shared filed
det trunks; E1-only (streams 53700+armCode; E2 skipped); trailing-4
doubling/min-max on per-pass burn-in; refractory 20, cap 6, K=10 blind; TWO-GATE
(Gate 1 trigger-logs; Gate 2 accRec-only); verdicts + H1>H2>H3 + gen 2 + floor
0.40; D-graded/D-rec1 diagnostics; verdict field is the enforcement.

The ask (round-2): fresh eyes only — you have never seen v1.0. Hunt for what v1.1
still gets wrong: unrunnable, mislabeled, or self-contradictory as filed. First
line NEEDS-PATCH or CLEAN. At most two concrete findings. <=150 words. No ELI5.
A repeat of a round-1 complaint must say what v1.1 missed, or it is stale.
Staff auditors: MATH (chance/quorum/detectRate arithmetic), IMPL (can a driver
implement every gate exactly as filed?), RIVAL (bring one rival mechanism that
explains U64e and breaks this design — or certify contained-by-design).
