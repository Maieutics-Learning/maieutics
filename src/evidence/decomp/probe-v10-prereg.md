# Circuit probe v1.0 (user-countersigned 2026-11-22; agent approval: this file)

## What do I want to find out
v11 promoted B's flat circuit to "compiled query-conditional 2-hop" — but B's
own profile (sub1 at chance, sens 0.31-0.43, direct 0.47) also fits a cheaper
thing: query-BLIND second-hop readout (output e from pair (m,4+e) without ever
resolving a->m; the doubled token + salience picks m, the query is decoration).
What does the flat actually CONTAIN? Occlusion + counterfactuals decide.

## Research check
In-repo only (REUSES v10 train ledgers; new eval battery on hard v11 lines).
Proceeding.

## Design
LINES: v11 hard lines (true (a->m,m->4+e) + 2 decoy chains + 50% plain).
ARMS: filed v10 tutors (a/b/ab x s0-2). N=240 fresh/seed (rng 17000+s).
BATTERY (per line; all single forwards fwd(flat',q), P(output==target)):
- BASE: fwd(flat,a)==e (have from v11; recompute in-run for pairing).
- OCC-SRC: remove pair (m,4+e), query a, P==e. Sanity: answer source gone.
- OCC-STEP1: remove pair (a,m), query a, P==e. CRUX: if B chains through
  step-1, this dies; if B reads (m,4+e) blind, it survives.
- OCC-DECOY: remove decoy1 chain [(c1,d1),(d1,4+f1)], query a, P==e.
  Descriptive (do decoys compete?).
- SWAP-CHAIN: m->m' in BOTH true pairs [(a,m'),(m',4+e)], m'=(m+2)%4
  (collisions accepted as symmetric noise), query a, P==e. Abstract following?
- DECOY-QUERY: unmodified line, query c1, P==f1. Query-conditionality proper:
  full 2-hop scores ~= BASE; constant-e readout scores chance.
BARS (preregistered):
- C1 (battery sane): OCC-SRC <= 0.35, all arms, quorum 2/3.
- C2 (step-1 irrelevance for B): |B OCC-STEP1 − B BASE| <= 0.10, quorum 2/3.
- C3 (conditionality gap): AB DECOY-QUERY > B DECOY-QUERY + 0.10, quorum 2/3.
VERDICT: READOUT (C1+C2+C3: B = blind second-hop readout, AB conditions) /
  FULL-2HOP (B DECOY-QUERY ~= B BASE within 0.10: B is real 2-hop, promote with
  honors) / BATTERY-BROKEN (C1 fail).

## Expectation (scored at verdict)
C1 PASS; C2 PASS (B never resolved a->m, its answer can't depend on the pair);
C3 PASS (AB sens 0.53-0.60 already says AB conditions). → READOUT. Honest 60%:
DECOY-QUERY is the first correctness-graded decoy test and could surprise.

## Pre-mortem
Strongest objection: OCC-STEP1 kills B anyway (removing a pair shifts
positional/length distribution OOD — death by distribution shift, not by
causation) — answered: OCC-DECOY is the shift control (removes MORE tokens: a
whole chain); C2 reads B-OCC-STEP1 against B-BASE, and if OCC-DECOY craters
everything equally the shift confound is filed and C2 is voided, not passed.
Most likely failure: FULL-2HOP (B decoy-query ~= 0.47 — the flat was real all
along; v10's sens ~0.27 was the misleading metric, correctness the true one).

## Nearest-failure
assembly-v11 (differs: graded only true-query correctness; here occlusion
assigns causal responsibility per pair, and decoy-query grades conditionality).

## Cost
9 batteries x 240 lines x ~7 forwards (h48) ~ minutes, resume-safe.

## Ledgers
src/evidence/decomp/d-probe-{a,b,ab}-s{s}.json, d-probe-verdict.json.
Driver: assembly-driver.js (runProbeEval).
