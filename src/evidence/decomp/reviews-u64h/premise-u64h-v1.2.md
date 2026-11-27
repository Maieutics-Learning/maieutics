# Premise artifact U64h v1.2 (frozen 2026-11-27; red-team reads THIS)

v1.1 premise + round-2 rulings (10 fresh barrage + 3 staff audit → 4 adopted,
rest rejected with derivations; details in
`reviews-u64h/fresh-eyes-self-u64h-v2-plus-audit-results.md`).

v1.2 changes (all minor clarifications, NO behavior change): (C1) W0-vs-runtime
phase gloss — W0 checks run on canned constants, run-time burn-in on live slots,
cannot interact. (C2) HALT/PIN-FAIL recording gloss — run-abort outcomes live in
the wave log + CHATLOG; verdict file written only on completion. (C3) H1
exactness — mean hits <1 (was "~0"). (C4) orTrig unit-check scope — no signal
function, positional trigger, twin + crash cover it. Rejections: W0/burn-in
interaction (answered); refractory-vs-cap (min-gap vs max-total, 20«150);
leaky-bucket rival (same guard, unobservable); Gate-1 laxity (bar move
underived); passive-logger (SENSOR-VALID IS the rule); burn-in contamination
(transient decays 1–2 slots, conservative direction, inherited placement);
quorum collision (per-seed vs across-seeds category error); weight-drift rival
(frozen weights can't drift); window-slippage (distributed-hits kills it);
invented-structure audit (filed inequalities are the mapping).

v1.2 design (unchanged in substance): 4 arms × 20 = 80 reads-only re-evals;
E1-only (53700+armCode; E2 skipped); trailing-4 doubling/min-max on per-pass
burn-in (burst-derived, B0-relative); refractory 20, cap 6, K=10 blind;
TWO-GATE (Gate 1 trigger-logs + filed rules; Gate 2 accRec-only + filed dice);
verdicts + H1(meanTrig≥3 & meanHits<1)>H2(meanTrig<1)>H3 + gen 2 + floor 0.40;
D-graded/D-rec1 diagnostics; verdict field is the enforcement.

The ask (red-team): Kill this premise. One kill-shot per scout: the single
load-bearing claim most likely to be false + the cheapest run/derivation that
would prove it. <=150 words, numbered. No ELI5. A repeat of a round-1/round-2
complaint already answered must say what v1.2 missed, or it is stale.
