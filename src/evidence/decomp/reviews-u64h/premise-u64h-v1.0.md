# Premise artifact U64h v1.0 (frozen 2026-11-27; barrage reads THIS)

**Numbers with sources (all from filed ledgers, not prose):** U64e verdict
`d-newai-self-u64e-verdict.json`: LOOP 4/20 dead, RESET-VALUE 16/20 met (mean
+0.092), RAND 11/20, floor 20/20, surBlind 0 triggers in 3000 slots, blind-drag
+0.0197. U64e ledger aggregates (recomputed reads-only 2026-11-27): window-mean
surprise w1 1.048 / w2 1.068 / w3 0.998 (flat); B0 range 0.755–1.266 (20 seeds);
orBlind blindHit 0.73–1.0 mean 0.86; rule overlaps 7 full (0 shared keys) / 33
partial (1 shared) of 40 switches; orReset m2 −0.06..+0.44, m3 −0.40..+0.48.
U64b W1 dice: filed reuse (accRec + rec1–3). Chance reference: 15/20 @p=0.5 ≈
0.0207 (filed U64 method); U64h has four Gate-2 paths (3 sensors + orTrig) — the
win condition requires Gate 1 AND Gate 2 on the same arm, and Gate-1-first
ordering is filed, so no either-gate inflation; orTrig LOOP-O is a control, never
a win (stated).

**v1.0 design:** 4 arms (senMax 121 burst-elevation; senPick 122 choice-surprise;
senMargin 123 margin-collapse; orTrig 124 oracle positive control) × 20 seeds =
80 reads-only re-evals on shared filed det trunks; E1-only (fresh disjoint
streams base 53700; E2 skipped — ceiling, filed); trailing-4 doubling/min-max
rules on per-pass burn-in (burst scale derived from U64e's measured 1–2 slot
jump; absolutes forbidden by filed B0 range); refractory 20, cap 6, K=10 blind
(weight-blind, no fallback); TWO-GATE verdict (Gate 1 sensor-validity:
#{detectRate≥2/3}≥15/20 + mean FA≤3 — reads trigger logs by definition; Gate 2
+0.03@quorum reads accRec only); verdicts CLOSED-LOOP-WORKS / SENSOR-ONLY /
ORACLE-ONLY / SENSOR-DEAD(H1>H2>H3) / INCONCLUSIVE / PIN-FAIL / HALT / LINE-HALT;
downstream success can never promote past ORACLE-ONLY without a valid sensor
(enforcement = verdict field); gen 2 (W0 asserts 2≤6); floor 0.40 + sensitivity;
D-graded (7 full vs 33 partial, diagnostic — too thin for quorum) + D-rec1
diagnostics; no randTiming arm (U64e RAND 11/20 bounds timing already).

**The ask (barrage):** Attack this premise. One load-bearing weakness per scout:
the single claim most likely to be false, overstated, or un-runnable as filed +
the cheapest fix or killer test. <=150 words, numbered. No ELI5. A repeat of a
U64e-settled point must say what v1.0 missed, or it is stale.
