# Fresh-eyes U70-F15 v1.0 results (2026-11-28) — barrage 10, 7 NEEDS-PATCH / 3 STANDS

Premise: `premise-u70-f15-v1.0.md`. Proposal: `u70-f15-prereg-proposal.md` v1.0.
Verbatims: `f15-battery/r1..r10-*.md`. Procedure: 10 parallel stateless `root.generateText`
scarfs, sealed briefs, disjoint angles, <=150 words, verdict + hardest falsifier.

## Scores

- r1 pool-size NEEDS-PATCH (25-exposure underfit-confound, pool-out-vs-held falsifier).
- r2 schedule NEEDS-PATCH (e-mod-8 periodicity, shuffled-pool falsifier).
- r3 eval-meaning NEEDS-PATCH (pool-mean smoothing, single-traj falsifier).
- r4 bars NEEDS-PATCH (re-derive for new surface, cross-pool variance falsifier).
- r5 dual-verdicts NEEDS-PATCH (mean hides per-traj failure).
- r6 disjointness STANDS (P(s) disjoint by construction; cross-seed independence falsifier noted).
- r7 determinism NEEDS-PATCH (permutation-invariance demand + permuted rerun falsifier).
- r8 scope STANDS (steps isolated; step-count audit falsifier).
- r9 halts NEEDS-PATCH (no circuit breaker; 1x25-epoch control falsifier).
- r10 alternative STANDS (block-vs-interleave rival named; variance falsifier).

## Adjudication (owner of verdict: agent, per skill)

- r1 PARTIAL: thinning confound is REAL and already disclosed WITH-THINNING (same honesty as F5
WITH-TAIL). No bar move. ADOPT: pool-min/max spread stays descriptive + queued 25-epoch
single-trajectory control (NOT run this wave). Filed limitation stands.
- r2 REJECT with derivation: hidden state resets to zeros each epoch start (unchanged `u70nEpoch`
behavior), no cycle-index input exists, so the model cannot key on "position in the 8-cycle";
periodicity lives only in the weight-update order, not in inputs. Random-per-epoch permutation
would add an RNG second variable. ADOPT gloss stating the reset fact.
- r3 REJECT demand / ADOPT gloss: single-canonical 0..19 is F14's road, NOT trained in F15
(category error — evaluating F15 on untrained canonical s would be OOD by construction). Pool-mean
IS the TRAIN quantity because the training distribution IS the pool. Pool-min filed alongside
(mean + min, min descriptive).
- r4 REJECT (tuning-to-reviewers, F14-r4 precedent carried): F14 bars reused verbatim; new-surface
variance is reported descriptively (pool spread), never by moving bars. ADOPT variance
descriptive (already present, clarified).
- r5 REJECT smuggle claim (TRAIN-pool and HELDOUT are independent verdicts, no promotion, no
combined PASS). ADOPT: mean + min reporting (already) so averaging cannot hide a grave.
- r6 ACCEPT: disjointness stands. Note: `u70nGenPath/GenObs` use strictly local mulberry32 streams
(70000+s / 72000+s), no global state — cross-seed independence is by construction, T9 asserts it.
- r7 REJECT as unsatisfiable: Adam is order-dependent, so different-order reruns SHOULD differ;
determinism = same-order rerun bit-identical (filed CPU Float64 precedent), not permutation
invariance. ADOPT clarification in T9.
- r8 ACCEPT + FUNCTIONAL ADOPTION: step-count audit becomes T9(d): assert 1200 chunk-updates per
seed (200x6) logged; mismatch -> BROKEN.
- r9 REJECT extra arm as scope: 1x25-epoch control is a new arm (queued rival, not this wave).
HALT table stands by design (FIXED 200 epochs, no early-stop, no convergence loop — firewall).
ADOPT gloss.
- r10 ACCEPT design + REJECT extra arm as scope: block-vs-interleave (8x25 sequential) and
shuffled-order variants are queued rivals, not this wave. ADOPT queued-rivals list + variance
descriptive.

## Patch list (one pass -> v1.1, no bar moves, no new arms)

1. T9(d) step-count assertion (r8 functional).
2. Gloss: hidden-reset kills cycle-index (r2).
3. Gloss: single-canonical TRAIN is a category error in F15 (r3/r5).
4. Gloss: determinism = same-order identical (r7).
5. Queued rivals filed openly: 25-epoch single-traj control, block-vs-interleave, shuffled-order
(r1/r9/r10/r2/r7). WITH-THINNING limitation kept.
6. Pool spread (mean + min/max) clarified descriptive (r1/r4/r5/r10).

No bars moved. No new arms. Next: re-close 4 on v1.1 -> fresh countersign -> execute.
