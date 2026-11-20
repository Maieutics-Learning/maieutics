# Exp-E v2.2: 10 separate lineages × 10 generations (COUNTERSIGNED 2026-11-20 —
user-ordered "keep the tutors separate for now (no talking between each other)
and then run them each for 10 generations"; supersedes v2.1 pool-as-diagnostic,
which folds into this: the 10 G0 mouths ARE the pool, distribution readout kept)

## What changed and why
v2.1's pool was diagnostic-only (no continuation). User orders continuation with
a constraint: NO cross-talk — each mouth founds its own independent chain.
Selection problem dissolved: nobody is picked; all ten run. R3's contamination
worry is mooted by design (no selection occurs). R2's n=50 rejected as
infeasible (~21h); the n=10 power caveat is filed openly instead.

## Lineages (lin 0–9, fully disjoint except shared frozen instruments)
- G0 per lineage: M0 = fresh mouth init 10300+lin, trainMouth 800 (train seed
  10301+lin) on structPool 9770/600; held check on 9771/200 (filed, no gate —
  stillborns stay in as their own lineage, trajectory decides); gen 200
  (seed 10310+lin*100), split 150/50; pile labels by E (frozen shared
  instrument — infrastructure, not cross-talk; same frozen E all lineages).
- G1–G9 per lineage: teacher = frozen (mouth_S, pile_S) of previous gen
  (lineage's own blobs); generate 200 (seed 10310+lin*100+g*10); teacher pile
  labels; student mouth (init 10500+lin*100+g, train 10600+lin*100+g, 800) +
  student pile (init 10700+lin*100+g, distill seed +5000 pattern, 800);
  freeze. No line, weight, or seed shared across lineages (ledger-verified).
- L0g0 EXISTS (expE-g0.json + expE-mouth-g0.json, seeds coincide with lin 0) —
  adopted as filed, not rerun.

## Readouts (per lineage per gen, v2 fields kept)
Unigram entropy + uniq; ear fidelity (agree + delta); mouth fidelity
(student vs teacher test loss); E-thermometer (E entropy + E↔pile agreement);
origin vs E. Plus POPULATION readout per generation: counts of lineages in
sharpening / collapsed / drifted / flat states (v2 bars per lineage).

## Verdict rules
- Per lineage: v2 HALTs (uniq <190, constant pile, non-finite) + trajectory
  (sharpen / collapse / drift / flat) after G9 or at halt.
- Population: filed, no gate (this vote buys the trajectories, not a claim).
  Continuation/replication per lineage or global = new countersign on the
  numbers. No cross-lineage selection, ever, under this version.
- Stillborn G0s (like L0: held 2.94) RUN ANYWAY as registered lineages — the
  v2 stillborn guard is lifted by this user order (uniform-noise lineages are
  data: do dead seeds ever resurrect?). Their trajectories are expected
  flat-or-collapse; a resurrection is a finding.

## Cost ledger
10 G0 (~13 min each) + 90 student-gens (~25 min each) ≈ 40h wall, batched
~2 gens/call, resume-safe per (lin, gen) ledgers expE-L{lin}g{g}.json + blobs
expE-mouth/pile-L{lin}g{g}.json (≈700KB each, ~140MB total — within quota,
pushed incrementally). No T10+, no cross-talk, no other version until
countersigned.
