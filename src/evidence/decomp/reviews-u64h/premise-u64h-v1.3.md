# Premise artifact U64h v1.3 (frozen 2026-11-27; re-close scouts read THIS)

v1.2 premise + red-team rulings (10 claimed kills → 2 adopted, rest rejected with
derivations; details in
`reviews-u64h/fresh-eyes-self-u64h-v3-red-results.md`).

v1.3 changes (2 diagnostics, NO bars/behavior change): (D1) D-graded enrichment
(per-switch latency + per-sensor precision scatter, descriptive). (D2) K6
rival-prediction check (per-sensor precision vs 0.42 chance baseline from
63/150 hit-window coverage). Rejections: burst-untestable (Gate 1 IS the
separation test); disjoint-ambiguity (four verdict combos ARE the attribution
table); guaranteed-control (LOOP-O measured 16/20-class, s9 filed; shared
response MAKES the control); dead-letter (SENSOR-DEAD reachable; common case is
filed ORACLE-ONLY); K6-as-kill (hypothesis can't kill its own test; kept as
D-check); stale streams (round-1 answered); true-zero (no absolute zero exists;
conservative direction; H2/H3 loop covers); blind paradox (pre-pick logging +
passive monitoring); gen-fiction (U64e verdict carries generation:1,
re-verified).

v1.3 design (unchanged in substance): 4 arms (senMax 121; senPick 122; senMargin
123; orTrig 124 positive control) × 20 = 80 reads-only re-evals on shared filed
det trunks; E1-only (53700+armCode; E2 skipped); trailing-4 doubling/min-max on
per-pass burn-in (burst-derived, B0-relative); refractory 20, cap 6, K=10 blind;
TWO-GATE (Gate 1: #{detectRate≥2/3}≥15/20 AND meanFA≤3 on trigger logs; Gate 2:
+0.03@quorum accRec-only); verdicts CLOSED-LOOP-WORKS / SENSOR-ONLY /
ORACLE-ONLY / SENSOR-DEAD(H1: meanTrig≥3 & meanHits<1 > H2: meanTrig<1 > H3) /
INCONCLUSIVE / PIN-FAIL / HALT / LINE-HALT; gen 2 (W0 asserts 2≤6); floor 0.40;
D-graded/D-rec1/D-K6 diagnostics; verdict field is the enforcement.

The ask (focused re-close): Is there anything in v1.3 that makes the experiment
unrunnable, mislabeled, or self-contradictory as FILED? Reply STANDS or
NEEDS-PATCH with at most two concrete findings. <=150 words, numbered. No ELI5.
A repeat of a round-1/round-2/red complaint already answered must say what v1.3
missed, or it is stale.
