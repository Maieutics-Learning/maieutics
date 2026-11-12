# Loop guides (yjkim-stat review + Locsic industry guide + Aha/aiwiki) — verdict: USED ×2 / SKIMMED / UNRESOLVED

AI-facing context: secondary sources on looped transformers — reviews
and industry guides, not methods papers. Their job in the synthesis is
corroboration, not discovery: training-recipe numbers that match our
bench observations from independent directions, plus industry state for
Related Work. Prior note:
src/evidence/rabbithole/track-c/c2-guides-note.md (full verdicts — this
note adds verbatim quotes where primaries exist). Sources:
scratch/track-c/w5-yjkim.txt (8.6KB) + w5-locsic.txt (30KB) + w6-aha
(1.6KB text) + aiwiki searches (unresolved).

## yjkim-stat: Huginn review (Geiping et al. 2502.05171) — USED
Architecture (prelude → recurrent core R times → coda), training craft,
plateau behavior, latent trajectory taxonomy.
Quotes (w5-yjkim.txt):
- Recipe: "the depth per training step is sampled from a
  Poisson-log-normal distribution with mean 32, and backpropagation is
  truncated to the last 8 recurrence passes to bound memory and
  compute."
- Plateau: "gains from further recurrence plateau or mildly decline
  (tested out to R ≈ 128–256)" — corroborates latent-overthinking from
  the LoopThink side (w4), at frontier scale.
- Latent behavior: "Orbits — rotating, cyclic trajectories on tasks
  with an iterative structure. Sliders — progressive, monotonic movement
  through latent space on counting-like tasks. Fixed-point convergence —
  the latent state settling into a stable point."
- Self-correction: "a genuine self-correction behavior: on some
  examples, the model detects and revises an earlier wrong intermediate
  value during later recurrence steps — computation that happens
  entirely in latent space, never surfacing as a visible, correctable
  chain-of-thought token."
So-what: recipe numbers + plateau corroboration + "latent refinement is
real but insufficient" framing (supports explicit-scaffolding-first).

## Locsic industry guide — USED (state + craft + tempering)
Thesis: recurrent depth = second axis for test-time compute; production-
ready as efficiency, unproven as CoT replacement. Industry state (Astra,
Nanbeige 4.2-3B production open recurrent, Ouro retrofit GSM8K 78.92%,
Loopie 20B-A2B MoE).
Quotes (w5-locsic.txt):
- Stability theory: "a 318M-parameter naive recurrent model degrades at
  3 to 6 loops and collapses at 9" (Fu et al. 2026) + "residual-norm
  growth worsens from Θ(√N) to Θ(N); the standard 1/√N residual scaling
  fails and must be pressed down to 1/N" + "the optimal learning rate
  depends only on the number of distinct layers, not on the loop count."
- Recipe: "sample the loop count randomly at every forward pass ...
  backpropagate only through the most recent iterations."
- Open failures: "hidden states collapsing into the same representation
  along the token dimension, and the model learning to ignore the
  injected input ... Both were rescued only by combined adjustments to
  normalization structure, injection scheme, and adapters" — craft, not
  architecture.
- Tempering (Raschka): "The net gain of recurrence shows up only in a
  matched-compute comparison" + "as a capacity multiplier, recurrent
  depth can enter production now; as a full replacement for chain of
  thought, the evidence is not there yet."
So-what: (1) craft-corroboration of our seed/init sensitivity
(different failure, same lesson: craft dominates); (2) tempering
supports behavioral-probes-over-lens (survey.md §11.2 line); (3) hybrid
verdict (recurrence × CoT) matches our scaffolding-first design.

## Aha atlas — SKIMMED (tag: no-fit)
Interactive atlas, 1.6KB extractable text (nav + abstract + links);
substance = the Geiping paper already covered via primaries + yjkim.
Links confirm canonical paper/code/weights locations. Nothing new.

## aiwiki guide — UNRESOLVED (tag: can't-locate)
Two varied searches, no indexed guide resolvable. If the user has the
URL, one fetch closes it; not worth further scouts. No verdict pending
on it — the guides' corroboration job is already done by yjkim + Locsic.

## Novelty delta (C5 form, both USED guides)
They [review / survey looped systems] under [frontier pretraining /
industry]; we [fade hints across generations] under [tiny lookup
curriculum]; claim unaffected; goal impact: none; so-what:
craft-corroboration + production-state + tempering cites.

## Placement (paper color, no builds)
- PAPER: production-state sentence (RW state: Nanbeige/Ouro/Astra —
  loops are production now) + craft-dominates cite + Raschka tempering.
- NURSERY/WORKSPACE: neither.
