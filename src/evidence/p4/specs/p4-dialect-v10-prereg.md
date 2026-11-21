# Path 2 (D-P4): dialect-substrate curriculum v1.0 (PRE-COUNTERSIGNED 2026-11-21 — user: "consider everything pre-countersigned"; agent approval: this file)

## What do I want to find out
Can score-driven selection steer a curriculum when the materials are PROVEN
transmissible lines? F3 showed L2g9 dialect lines transmit in ONE step
(mouth 2.00, fid +0.64, origin +0.16) independent of chain history. This path
tests tailoring where the carrier is known-strong, with dialects of graded
difficulty as the selection substrate.

## Research check (standing rule)
Nothing external: dialect stats (F3/F7 numbers), blob paths, gen seeds are all
filed in-repo. No searches. Proceeding.

## Design (level (a), same semantics as v1.0: tutor static, harness selects)
TUTOR: frozen L2g9 teacher mouth (blob src/evidence/p4/expE-mouth-L2g9.json;
teacher-test 1.2303 deterministic, F3-verified).
MATERIALS (regenerated deterministically from stored blobs + filed seeds; zero
training cost; NO chain history involved):
- D-strong: L2g9 mouth blob -> genLines(12100, 300) = narrowed sticky dialect (uni ~2.6)
- D-detached: L5g9 mouth blob (expE-mouth-L5g9.json) -> genLines(12110, 300) = anti-structure (origin-decoupled)
- D-base: fresh structPool(12120, 300) = un-narrowed Markov baseline
ROUND 1: fresh mouth students (Exp-E 800-step recipe, UNTOUCHED carrier) train on
uniform mix (100 lines from each pool), K=3 seeds (12101/2/3). Score vector: 6
cells (3 pools x 2 bands short<=20/long) — gap[c,b] = studentTestLoss - tutorLoss
(tutor = L2g9 mouth evaluated on that cell's lines; gap = student shortfall).
Pre-round-2 gate: max gap - min gap >= 0.20 nats else ABORT as UNINFORMATIVE
(uniform mix taught everything equally — no signal to select on; filed, not failed).
ROUND 2: transform need[c,b] = max(0, gap[c,b] - GAP_OK), GAP_OK = 0.30 nats
(cells within 0.3 of tutor need no extra teaching), raw = need + FLOOR 0.05,
w = raw/Ssum. Fresh lines per arm from the same three sources (new gen seeds
12130/40/50 — round-1 lines never reused) in proportions w (300 lines). Arms:
true-weighted / uniform-WITHHELD / shuffled-SHUFFLED. Round-2 students FRESH
inits (seed+100 per arm; selection effect, not accumulation).

## Attribution contrast (R18)
N2-system: same harness x different tutor — fresh structured-trained mouth
(train 800 steps on structPool(12155), seed 12150) as tutor in place of L2g9.
Prices: does the SPECIFIC dialect matter, or does any structured tutor do?

## Bars (R10 conjunction)
1. RESPONSIVENESS 3/3: operator (same R22 shape — mass shift from uniform predicted
   by TRUE gaps above SHUFFLED baseline); WITHHELD |shift| <= 0.05.
2. DIRECTION 3/3 at delta: held-out fresh D-strong lines (gen seed 12160, never
   trained on) — margin = agree(S2pile,Tpile) - agree(S2pile,S1pile) >= 0.10,
   Tpile = L2g9 stored pile blob (expE-pile-L2g9.json). Sensitivity at 0.05/0.20.
   Descriptive: mouth-loss gain S1-S2 on held-out (>= 0.20 nats hoped), bigram-L1
   distance Tutor-vs-S2 < Tutor-vs-S1.
3. ATTRIBUTION: system gain (true minus WITHHELD on held-out loss) + nonzero tutor
   variance |gain_L2g9 - gain_N2| >= 0.10 nats. Both or the line passes harness-only.

## Expectation (scored at verdict)
Operator 3/3 (deterministic function — calibrates code). Pre-round-2 gate PASSES
(D-detached gap >> D-strong gap: proven by L5 mouth-at-chance vs L2 2.10).
System gain +0.10-0.30 nats (strong carrier). Direction 2/3 (pile margin on
mouth-trained students is the thin leg — owned). Attribution HOLDS (specific
narrowed dialect teaches differently than generic structured).

## Pre-mortem
Strongest objection: with a proven-strong carrier ANY reweighting lifts, so the
true-vs-uniform gap may just measure "more of the good pool" — answered: that's
LITERALLY the tailoring claim (scores found the good pool); SHUFFLED kills
"reacts to anything". Most likely failure: round-1 gaps FLAT (800 steps learns
all three pools) — guarded by the pre-round-2 gate.

## Nearest-failure
F3 transplant (differs in the priced way: F3 showed one-step transmission EXISTS;
D-P4 tests whether SCORES can steer toward it across rounds).

## Cost
Per seed: r1 (1 train) + r2 (3 arms) = 4 mouth trains x ~15 min ~1h/seed.
3 seeds + N2 arm (2 trains) ~3.5h across resume-safe calls.

## Ledgers
src/evidence/p4/d-r1-s{0,1,2}.json, d-r2-{true,unif,shuf}-s{0,1,2}.json,
d-n2-r{1,2}.json, d-p4-verdict.json. Driver: extend p4-toy.js (runP4Dialect) —
P4ExpEInit machinery (trainMouth/mouthLoss/genLines/gradePile all exist).
