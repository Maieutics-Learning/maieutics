# Curriculum Extraction (ICLR 2025) + faded worked examples — verdicts: USED / USED-CONFLICT

AI-facing context: the note where the synthesis grows teeth. Curriculum
Extraction is clean corroboration (progressive supervision from teacher
internals, same family as our attnAuxW fade). Faded worked examples
(Renkl & Atkinson, ed-psych 2000–2004) is the ONE genuine precursor on
the fading idea — guidance withdrawal is old — so this note scopes the
paper's novelty claim to GENERATIONAL MACHINE TEACHING and queues the
C5-required experiment F-singlegen that could weaken it. Primary sources
walled (RG 403, APA login); characterization at scout level, flagged —
but the precursor judgment rests on textbook-standard method knowledge,
not on disputed claims. Prior note:
src/evidence/rabbithole/track-c/c4-curriculum-fading-note.md. Sources:
scratch/track-c/w10-curriculum.txt (119KB) + w10-fading-search/rg/apa
html (walled primaries).

## Curriculum Extraction (Gupta & Karmalkar, 2503.17494) — USED
Progressive distillation normally needs teacher CHECKPOINTS as implicit
curriculum (costly). Their scheme extracts the curriculum from the
fully-trained teacher alone.
Quotes (w10-curriculum.txt):
- "using intermediate checkpoints from the teacher's training process
  as an implicit 'curriculum' for progressive distillation can
  significantly speed up training. However, such schemes require storing
  these checkpoints, and often require careful selection."
- "a curriculum can be extracted from just the fully trained teacher
  network, and ... use a random projection of the hidden representations
  of the teacher network to progressively train the student network,
  before training using the output of the full network."
- "intermediate checkpoints ... act as an implicit curriculum ... with
  earlier checkpoints emphasizing simpler patterns (e.g., local syntax),
  and later checkpoints capturing complex abstractions (e.g.,
  long-range semantics)."
- Result: "significantly outperforms one-shot distillation" on sparse
  parity (2-layer nets, transformers, LM tasks).
Novelty delta: they [extract progressive supervision from a frozen
teacher's internals] under [efficiency distillation]; we [fade live
auxiliary supervision across generations] under [lookup curriculum];
claim holds — same family (internal-signal curricula), different
realization (random projections of frozen teacher vs decaying attnAuxW
weight from a live tutor), no generational loop, no fading schedule. No
precursor, no conflict. So-what: corroboration + vocabulary.

## Faded worked examples (Renkl & Atkinson) — USED-CONFLICT (scoped)
Conflict: backward fading (worked example → completion problems with
LAST steps blanked first → independent solving) is textbook-standard
ed-psych since 2000–2004; mechanism = cognitive-load management. The
fading IDEA is not ours. Resolution (scoped novelty, five points):
(i) the LEARNER is gradient-trained, not human; (ii) GENERATIONAL —
distinct student models with tutor selection (cultural transmission,
closer to iterated learning than classroom fading); (iii)
ignition-from-zero of an impossible-at-start capability, not test-score
gains; (iv) behavioral gate + promotion machinery; (v) cheap/in-browser.
Related Work MUST cite faded worked examples as the intellectual
ancestor (RW-fading) — the paper's novelty claim scopes to generational
machine teaching, not fading itself.
C5-required follow-up: F-singlegen — same fade schedule, ONE continued
student vs fresh student per generation. If single-student self-fading
also ignites, the generational claim weakens and the paper re-scopes to
fading-schedule design. This experiment is MANDATORY for the CONFLICT
tag, not optional. Round-2 input (R4): spec must control for
architecture — same-arch students with vs without unaided exposure, so a
null result reads as exposure-driven, not architecture-driven.

## Stacks
- Fading lineage (classroom → SDFT gap → curriculum extraction →
  Coconut stages → CGAR decay → our generational fade): six
  independent derivations of "withdraw guidance gradually," ours the
  only generational one. The lineage IS the Related Work section's
  spine — cite the ancestors, claim the generation axis.
- USED-CONFLICT is the only CONFLICT verdict in the synthesis so far;
  its honesty upgrades the paper's credibility (reviewers know Renkl).

## Placement (paper honesty + one mandatory experiment)
- PAPER: RW-fading — cite faded worked examples as intellectual
  ancestor FIRST, then scope novelty to the five generational points.
  Non-negotiable for reviewer trust.
- NURSERY: F-singlegen (mandatory) — single continued student, same
  fade schedule, tests whether GENERATIONS drive ignition.
- WORKSPACE: neither (classroom method, no tooling).
