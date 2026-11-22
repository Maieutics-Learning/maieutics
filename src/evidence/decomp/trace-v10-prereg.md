# Trace v1.0: white-box attention battery (user-countersigned 2026-11-22; agent approval: this file)

## What do I want to find out
Probe-v11 leaves one open channel: hop-2 (read the source pair) is identified,
hop-1 (select the named chain without consuming the naming pair) is not. The
AttnModel makes its decision in ONE depth step (steps[L], r=1) attending over
all positions right before the readout. Dump that step (+ the query position's
pass): WHERE does the read land on base vs naming-pair-removed lines?

## Research check
In-repo only (reuses v10 tutors; fw.cache.steps[L].att.w + posOut; R=3 rolls
baked in). Proceeding.

## Design
LINES: hard-line generator with pair structure (genProbeLine). ARMS: filed
v10 tutors (b/ab x s0-2; A-arm omitted — all-chance, nothing to trace; filed
reason). R=3 rolls/arm/seed (streams 17200+s+r*500), N=200 lines/condition/roll.
CONDITIONS: base (query a) / occStep1 (remove (a,m), query a).
TRACE per line: depth pStar = argmax(steps[Ltot].att.w), wStar, entropy;
role(pStar) in {srcVal (4+e token), srcKey (m-as-key), query, Qmark,
trueOther ((a,m) tokens), decoy, other}; correct?; query-position pass focus
(argmax of steps[posQuery].att) role.
BARS (on roll-means, preregistered):
- W1: B P(pStar in srcPair | base, correct) >= 0.60, quorum 2/3 seeds.
  (The decision step reads the answer region.)
- W2: B P(pStar in srcPair | occStep1, correct) >= 0.50, quorum 2/3.
  (The read lands on the source even with the naming pair gone — selection
  key is elsewhere; the channel question becomes WHERE ELSE with data.)
Descriptive: W3 = query-pass focus contrast (does the query position attend
the true pair? B vs AB); entropy correct-vs-wrong; Qmark-focus rate
(fallback-to-null signature); correct-conditioned role histograms.
VERDICT: READS-SOURCE (W1+W2) / SCATTERED (W1 fail — decision read lands
elsewhere; readout location rethink) / FRAGILE (W1 pass + W2 fail — naming
pair needed for the READ though not the ANSWER; dissociation filed as such).

## Expectation (scored at verdict)
W1 PASS (~0.7 — the read must come from somewhere and C1 says the source is
necessary). W2 PASS (~0.6 — C2 says the answer survives; the read should too).
→ READS-SOURCE, 60%. The PAYOFF is not the bars but the W3 histograms: they
name the fallback focus (uniform? Qmark? decoy-split?) — the channel speaks.

## Pre-mortem
Strongest objection: attention lies (weight != causation; the read could be
epiphenomenal while the gate/L1 path decides) — answered: filed openly;
W1/W2 tie focus to CORRECTNESS (conditioned on correct lines), and any
SCATTERED/FRAGILE outcome is read as "focus location underdetermines the
answer", not as mechanism.
Most likely failure: diffuse depth (entropy ~max, pStar uniform over pairs) on
BOTH conditions — the decision is distributed, single-focus tracing is the
wrong lens (filed as SCATTERED with the entropy numbers as the finding).

## Nearest-failure
probe-v11 (differs: black-box occlusion graded answers; here the model's own
decision step is dumped on the same conditions).

## Cost
6 (arm x seed) x 3 rolls x 400 lines x 1 forward + cache reads (h48) ~ 15 min,
resume-safe.

## Ledgers
src/evidence/decomp/d-trace-{b,ab}-s{s}.json (reps + means), d-trace-verdict.json.
Driver: assembly-driver.js (runTraceEval).
