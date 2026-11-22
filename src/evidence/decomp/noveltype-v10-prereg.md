# Novel-type figuring-out v1.0 (user-ordered 2026-11-22; agent approval: this file)

## What do I want to find out
A tutor meets a problem type it never trained on. Does it figure out what the
problem is ASKING (zero-shot), and with a few worked examples does it rewire
faster than starting from scratch? Solving a lot is NOT required; the measures
are recognition (error profile) and adaptation speed (tutor-vs-scratch).

## Research check
In-repo only (assoc stack, G.Adam/G.softmaxCE for driver-side finetune).
Proceeding.

## Design
TUTOR (s in {0,1,2}): 1-hop assocR attn h48/m96/d16, 500 ex, 1200 steps,
batch 16, attnAux + bindLabels aux (decomp recipe). GATE: fresh 1-hop acc >=
0.60 else ABORT seed.
ZERO-SHOT BATTERY (200 fresh lines each, forward r=1):
- B0 control: assoc 1..3 pairs (expect ~1.0; sanity, not a bar).
- B1 long regime: 5 pairs (same type, new regime).
- B2 format-flip: query-first [q, Q, pairs...] (same skill, new format).
- B3 STAR reverse-lookup: [pairs..., 4+vj, Q], answer kj (same materials,
  INVERTED question: which key holds this value). Chance 0.25.
ERROR TYPES on B3: echoRate = P(output == j) (j = queried value's identity):
the old forward procedure reads the query as the answer, so systematic echo
(>> 0.25) means "applies the old procedure to the new problem" (does NOT
figure out); uniform errors = confused; accuracy = figures out.
FEW-SHOT (K in {16, 64, 256} worked B3 examples): finetune TUTOR 200 steps
(batch 8, Adam 5e-3, final-loss + bindLabels aux; NO attnAux — supervision
assumes key-queries, filed implementation choice) vs SCRATCH-init identical
protocol. Eval fresh 200 B3 lines.
BARS (preregistered):
- A (zero-shot figuring): B3 acc > 0.35, quorum 2/3.
- B (fast figuring): at K=64, tutor >= 0.80 AND scratch <= 0.50, quorum 2/3.
Descriptive: B1/B2 degradation; echoRate 3/3; full K curves both arms.

## Expectation (scored at verdict)
A FAIL (systematic echo — prior: decomp query-blindness says the tutor reuses
the old procedure on new inputs); B PASS (1-hop features rewire fast; prior
transfers).

## Pre-mortem
Strongest objection: finetune may fail FROM the tutor (stuck in the forward
basin) while scratch learns it — inverted B, informative about interference,
priced as a real outcome (old knowledge can block figuring out).
Most likely failure: B2 breaks everything (format >> skill) — scope note, not
fatal; B3 is the star regardless.

## Nearest-failure
Decomp v10 (differs: there the puzzle was harder-but-same-type and the tutor
never resolved step 1; here the MATERIALS are identical and only the QUESTION
flips, isolating recognition from difficulty).

## Cost
3 tutors (~2 min each) + 18 finetunes (~1-2 min) + evals ~ 1h, resume-safe.

## Ledgers
src/evidence/decomp/d-novel-tutor-s{s}.json, d-novel-zero-s{s}.json,
d-novel-few-K{K}-s{s}-{tutor,scratch}.json, d-novel-verdict.json.
Driver: src/evidence/decomp/novel-driver.js (own stack init; finetune loop
via G.Adam/G.softmaxCE).
