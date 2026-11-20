# Premise v1 (frozen 2026-11-20) — Exp-E G0 stillbirth + 10-mouth pool proposal

## Project
Teaching-small-models bench: P4 phase (tutor↔student teaching loop). Current
experiment Exp-E v2 (countersigned): teacher generates 200 lines/generation
(uniform-3 prefix, ancestral sampling); student mouth + pile-ear learn them;
frozen student = next teacher. G0 = seed assembly: fresh mouth (48-hidden
attention net, vocab 19) next-token trained 800 steps (batch 8, Adam 5e-3,
single seed 10300) on structured lag-1 Markov pool (p=0.35, seed 9770,
600 lines, halves short/long), then generates the chain's first 200 lines.

## Verified claims (numbers sacred)
- M0 train loss 3.1838 → 2.9299 over 800 steps; held-out structured loss 2.9389
  = chance floor ln19 ≈ 2.944. Guard (held ≥ 2.7 = stillborn) fired; chain
  stopped, nothing continued. No shopping: no second seed run.
- M0's 200 generations: uniq 200/200, unigram entropy 2.9317 (≈ uniform) —
  certified noise. Frozen pile-tutor E grades them spread [18,56,71,55],
  entropy 1.30 (reads them, doesn't collapse).
- Same-builder precedent: identical pool/recipe reached ≈ 2.63 in 800 steps
  (different init seed, v4.2 TE). Same-recipe stall precedent exists (sharp-
  target distillation stalls on some inits, filed run-7).
- Author's reading: stillbirth is init luck, not recipe failure.

## Proposal under review
10-mouth diagnostic pool: same pool, same recipe, 10 init seeds (10300–10309),
800 steps each. Readout is the DISTRIBUTION of held losses: ≥3/10 below 2.7 =
luck (init lottery); 0/10 = systematic (recipe or pool). NO chain continuation
under this vote — continuation needs a new countersign naming which mouth(s)
and why. Cost ≈ 2h compute. Question each reviewer gets is below (sealed,
disjoint, ≤150 words, numbered verdict + single hardest test/falsifier).
