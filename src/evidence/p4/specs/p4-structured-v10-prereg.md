# Path 1 (S-P4): structured-pool P4 variant v1.0 (PRE-COUNTERSIGNED 2026-11-21 — user: "consider everything pre-countersigned"; agent approval: this file)

## What do I want to find out
Whether the v1.0 tailoring machinery (mapping table + transform + WITHHELD/SHUFFLED
controls + responsiveness/direction exit bars) PASSES when the carrier is strong.
v1.0 died at calibration on uniform noise (train-agree 0.31/0.26, effect ~1 SE).
Structured Markov lines are the proven-strong carrier (mouths: tutor easy 2.6 vs
chance 2.94; students 0.9+ on spelled). If selection still fails here, the failure
is in the interface, not the carrier.

## Research check (standing rule)
Nothing external saves compute: stack, step costs, and carrier strengths are all
measured in-repo (v1.1 amendment, Exp-E ledgers). No searches. Proceeding.

## Design (two stages; stage B runs only if stage A passes)
STAGE A (S-P4a calibration, cheap): E pile (frozen d1a blob, same as v1.0) grades
fresh STRUCTURED pools (structPool recipe, Markov p=0.35, vocab19). Fresh students
(AttnModel, P2 combined recipe) train at 300 / 600 steps on Pool A lines.
Gate (same as v1.1): train-agree-E >= 0.50 AND fresh-B delta >= 0.15 at 300 or 600.
Pre-guard (new): E label spread on Pool A — all 4 classes >= 5% of lines AND pile
entropy >= 1.0, else ABORT as E-REGIME-VOID (E's noise-grown partition does not
transfer to structured lines; informative negative, loop does not run).
STAGE B (S-P4b loop, only on STAGE A pass): v1.0 ENTIRE design unchanged (mapping
table 4 rows, transform TARGET=0.30/FLOOR=0.05, 8 cells, WITHHELD uniform,
SHUFFLED permuted, operator R22, direction delta=0.10, anchor 0.95, attribution),
with ONLY these substitutions: noise pools -> structured pools (fresh seeds
below), STEPS = stage-A value. Everything else (arms, seeds-per-arm, bars,
quorum 3/3) = v1.0.

## Seeds/pools (fresh, disjoint from P2/P3/Exp-E/v1.0 by construction; 12xxx block
is unused — Exp-E touched 10300-11409 sparsely, v1.0 used 102xx)
- Pool A adapt: structPool(12000, 1000: 500 short 10/15/20 + 500 long 50)
- Pool B held-out direction: structPool(12060, 400: 200 + 200)
- Pool C anchor: structPool(12070, 400: 200 + 200)
- Stage A: pool A subset, student seed 12001
- Stage B students: E-arm 12001/2/3, N2-arm 12011/2/3 (fresh inits round 2 = selection effect, v1.0 semantics)

## Bars
- Stage A: v1.1 gate (both criteria, 300 or 600; neither -> LOOP-KILLED-BY-GATE again, file + stop, S-P4b mouth-loss port becomes a follow-up candidate, NOT covered here).
- Stage B: v1.0 exit bars verbatim (responsiveness 3/3 + WITHHELD |shift|<=0.05 + direction 3/3 at delta=0.10 with sensitivity triple + anchor + attribution). Pass both checks -> P5 opens on FRESH seeds/brains (no-bleed list in ledger).

## Expectation (scored at verdict)
Stage A PASSES at 600 (structured precedent: students 0.9+ on spelled; risk: E's
partition is noise-grown and structured lines are OOD for E — the spread guard
prices exactly this). Stage B: operator 3/3, WITHHELD clean 3/3, system gain
+0.03-0.10, direction 2/3 (thin-margin risk carried over from v1.0), attribution
HOLDS (E vs N2 mappings differ on structured lines too).

## Pre-mortem
Strongest objection: swapping pools while keeping E changes TWO things (carrier
learnability + E-regime transfer), so a pass doesn't isolate which mattered —
answered: stage-A gate + spread guard separate them (spread = transfer, gate =
learnability). Most likely failure: E-REGIME-VOID (E arbitrary on structured
lines) — filed as the informative negative it is.

## Nearest-failure
v1.1 calibration (differs in exactly one priced way: structured carrier lines vs
uniform noise; gate, recipe, tutor identical).

## Cost
Stage A ~11 min (2 trains + evals). Stage B: 18 trains x ~7 min (600-step) ~2.2h
across resume-safe calls (skip-if-COMPLETE per ledger).

## Ledgers
src/evidence/p4/s-cal-300.json, s-cal-600.json, s-toy-{E,N2}-s{0,1,2}-r{1,2}.json,
s-p4-verdict.json. Driver: extend p4-toy.js (runP4Struct) — same stack, structPool
already in P4ExpEInit.
