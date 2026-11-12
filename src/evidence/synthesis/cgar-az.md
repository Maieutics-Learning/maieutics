# CGAR (JAIR) + AlphaZero/MuZero verifier lesson — verdict: USED + USED (shape-steal + capstone)

AI-facing context: two same-shelf items with opposite jobs. CGAR is the
closest EXPLICIT-decay analog to our fade (exponential supervision
weights, gradient-matched) — steal the SHAPE for the continuous-fade
branch. AlphaZero is the capstone witness: the fifth independent
convergence on the grounded-gate principle (self-improvement compounds
only with an ungameable signal). Prior note:
src/evidence/rabbithole/track-c/c4-cgar-az-note.md. Sources:
scratch/track-c/w15-cgar.txt (67KB) + Chuang "tabula rasa" review via
the C4 note (paraphrase level; the lesson is review-consensus, not a
disputed claim).

## CGAR — Curriculum Guided Adaptive Recursion (Qasim & Zhang, JAIR)
Curriculum on architectural depth (not data ordering) for tiny recursive
models: Progressive Depth Curriculum (2,1)→(4,2)→(6,3) by normalized
progress + Hierarchical Supervision Weighting (exponential decay on
supervision steps, gradient-matched). Sudoku-Extreme 423k puzzles: 1.71×
speedup, −42% cost, 100% halting, 11% fewer inference steps.
Quotes (w15-cgar.txt):
- "Progressive Depth Curriculum implements a three-stage schedule that
  transitions from shallow (2,1) through medium (4,2) to full depth
  (6,3) configurations based on normalized training progress, providing
  41.4% FLOPs reduction while preventing early-stage overfitting."
- "Hierarchical Supervision Weighting applies principled exponential
  decay w_t = λ^{t-1}/Z_λ to supervision steps, achieving 40% gradient
  variance reduction and accelerated convergence through improved
  signal-to-noise ratio in stochastic gradients."
- Rationale: "aligning loss weighting with observed gradient magnitude
  decay."
- Inference dividend: "100% halting accuracy and 11% fewer reasoning
  steps compared to baseline."
- Framing: "treating architectural depth as a curriculum-scheduled
  training parameter rather than a fixed constant."
Novelty delta: they [schedule depth + decay supervision exponentially]
under [tiny recursive models, speed goal]; we [fade hints across
generations] under [lookup curriculum, teaching goal]; claim holds —
goal is training speed, not teaching; no generations, no ignition. No
precursor, no conflict. So-what: steal the EXPONENTIAL shape —
gradient-matched decay is the upgrade hypothesis over our linear-ish
stages for the continuous-fade branch.

## AlphaZero/MuZero (via Chuang review + Silver 2017) — USED (capstone)
Setup f_θ(s)=(p,v), pure self-play, no gating (continuous
latest-checkpoint play — contrast our winner-promotion); 700k steps;
80k vs 70M pos/sec yet 28W-72D-0L vs Stockfish; identical hyperparams
across 3 games. Review's asterisks: perfect world model + infinite
cheap experience + crisp verifiable reward — remove one and the recipe
breaks; sparse/non-zero-sum self-play can collapse to degenerate
equilibria; knowledge locked in weights, unexplainable.
Deepest lesson: self-improvement compounds ONLY with an ungameable
ground-truth signal; post-2017 history = the search for verifiers
outside board games. This is the FIFTH independent convergence on our
grounded-gate principle (W3 quality-filter, W7 grounded rewards, W8
hierarchy, W12 distribution-gap, W15 verifier). Contrasts: no-gating
continuous play vs our promotion; unexplainable weights vs our
behavioral probes (a point FOR path-probing, R4).

## Stacks
- Grounded-gate quintet (W3 + W7 + W8 + W12 + W15): five literatures,
  one principle — lead the §8 argument with the count.
- CGAR exponential ↔ Coconut one-at-a-time ↔ GKD λ-annealing ↔
  LoopThink 95%-gate: four shapes for "gradual," all compatible —
  the continuous-fade branch tests exponential against linear.
- AlphaZero no-gating vs our promotion: the contrast justifies gates as
  the load-bearing difference between collapse-prone self-play and
  sustained teaching.

## Placement (branch upgrade + capstone cite)
- NURSERY: continuous-fade branch adopts exponential-decay hypothesis
  (gradient-matched, per CGAR) as the primary shape to test against
  linear stages.
- PAPER: verifier-lesson capstone (RW-AZ) + CGAR same-family cite
  (RW-CGAR); quintet count leads §8.
- WORKSPACE: neither.

## Follow-ups
- Continuous-fade branch design: exponential vs linear fade shapes.
- No further fetches: CGAR full text on disk; AZ via review sufficient
  for the capstone role (no disputed claims depend on primaries).
