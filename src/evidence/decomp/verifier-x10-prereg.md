# Verifier-X v1.0 — cross-regime transfer of the stacked reverse (user-countersigned 2026-11-22; agent approval: this file)

## What do I want to find out
V1 verdict: stacking works on standard reverse. Does anything transfer to
other regimes? Three probes, honest framing (format-fragility precedent: B5
flip chance everywhere, so transfer FAILs are informative bounds, not
disappointments):
- X1 (frontier map, descriptive): distill4x2 replication + extended battery:
  b5 flip (filed), b6 dilution, b7 long (shared H-gens), b8 shift, b9 parity
  (pool-invented 2026-11-22: cycle-shift = retrieve-then-(v+k)%4 with the
  direct value as lure/echo; parity = sum of a key's bound values mod 4 over
  duplicate-key lines with recency lure — the probe11 degenerate regime as
  the task). Zero-shot readout of the stacked verifier across 5 regimes.
- X2 (pin a longer context): verifier with distill on B1-long forward lines
  (A.gen(rng,5)) + standard cycles. Does pinning a longer context shift
  B1/B4? Bar: X2-B1(R2) > X1-B1(R2) quorum 2/3.
- X3 (stacking reaches a pool format?): distill4x2 + parity tracked across
  rounds (b9 at R1 vs R2). Bar: R2-b9 >= R1-b9 quorum 2/3 (transfer
  stacking; likely FAIL per B5 precedent — a miss bounds the verifier to
  its trained question).

## Research check
In-repo + one pool input (gemini-invented shift/parity schemas, elicited
2026-11-22 with a 150-word implementability-constrained prompt; schemas
hand-implemented as ~10-line gens, pool credited here). Proceeding.

## Design
New gens genShift (x = flat+[qkey,k,8], y = ((v-4)+k)%4, echo = v-4),
genParity (duplicate-key lines, x = flat+[qkey,8], y = sum(v-4)%4,
echo = last-bound-value-4); all 4-class, chance 0.25. runExtEval covers
b5..b9 (b5 reuses genFlip lines). X1/X3 ride the standard distill4x2 run;
X2 swaps distill lines to 5-pair.
BARS: X1 descriptive (frontier table, no bars — first contact with 3 new
regimes); X2 main bar above + cross bars (B0 >= 0.90, B3 ±0.10 of V1-R2);
X3 bar above (quorum 2/3).
VERDICT per arm: TRANSFERS / BOUNDED (miss with cross bars held) /
CORRUPT (cross bars miss).

## Expectation (scored at verdict)
X1: flip ~chance (filed), dilution/long moderate (H1 will confirm), shift
above chance (~0.35 — compositional but aligned), parity ~chance (aggregation
is a new operation). X2: PASS (longer pin shifts B1 modestly). X3: FAIL
(format barrier holds; stacking does not cross questions).

## Pre-mortem
Strongest objection: b8/b9 unvalidated gens (a bug looks like a model
failure) — mitigated by validation gate: each new gen must score a
FROM-SCRATCH supervised probe above chance before the verifier runs count
(T.trainModel fresh model on 150 labeled lines, same class as the filed
tutors; the probe shares NO weights, lines, or gradients with the
verifier — it checks task learnability, nothing else. Reviewer-leakage
rebuttal filed: there is no tutor-in-the-loop; "tutor" in earlier notes
means the filed supervised models, and the probe never touches verifier
state, so X1 zero-shot stays zero-shot). If the probe fails, the gen is
broken, not the verifier. Most likely failure: BOUNDED everywhere
(the verifier teaches its question, nothing else — the honest scope bound).

## Nearest-failure
noveltype-v10 few-shot (differs: tutor-vs-scratch on reverse; here stacked
verifier zero-shot + one longer-context pin).

## Cost
X1/X3: 3 seeds × 600 steps (~5 min each) + validation probes (~2 min);
X2: 3 seeds × 600 steps. ~35 min total, resume-safe via COMPLETE-gated
ledgers.

## Ledgers
src/evidence/decomp/d-verX-{x1,x2,x3}-s{s}.json, d-verX-probe.json,
d-verX-verdict.json. Driver: novel-driver.js += genShift/genParity/
runExtEval/runVerifierX.
