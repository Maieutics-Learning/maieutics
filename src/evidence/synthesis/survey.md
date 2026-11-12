# Looped-LM survey (Azizi et al., 2026, 557 papers / 822 claims) — verdict: USED (frame + regimes + checklist)

AI-facing context: the field map. A PRISMA-style survey that screened
7,323 papers down to 557 core ones and verified 822 empirical claims,
each sorted by COMPARISON REGIME (what was held fixed: parameters,
depth, inference FLOPs, training FLOPs, data — or nothing). Its central
finding: most apparent contradictions in the looped-model literature are
regime differences, not result differences. For us it does three jobs:
(1) gives us the vocabulary to label our own comparisons (matched-
everything by construction); (2) certifies no transmission-category
precursor exists in the corpus; (3) supplies a reporting checklist we
adopt. Prior note: src/evidence/rabbithole/track-c/c1-survey-note.md
(full read — this note adds verbatim quotes). Source:
scratch/track-c/w2-survey.txt (289KB).

## What it is
Corpus + extraction records with verbatim evidence per number + claims
ledger (machine-readable, released with the paper) + reporting checklist
(App. B) + research agenda from measured gaps (robustness, alignment,
privacy unstudied).

## Load-bearing quotes (w2-survey.txt)
- Regime thesis: "most apparent contradictions about whether 'a
  recurrence is worth a layer' come from comparing parameter-matched
  with compute-matched results. The evidence fits one reading, in which
  a recurrence is worth less than a fresh block of parameters. Looping
  therefore helps when parameters are the limiting resource and hurts
  when it replaces them at fixed compute."
- The number: "one recurrence is worth r^0.46 in unique-parameter
  terms" + "replacing unique blocks with shared recurrences raises
  validation loss."
- Compute matching is rare: "Only 19% of the empirical claims we
  verified are matched on compute, and 31% are shown at a billion
  [params scale]."
- Depth saturation: "At language-model scale, running more loops than
  were used in training does not help. Gains saturate at or before the
  training depth."
- Small-scale bound: "In small-scale controlled studies, looping does
  not add knowledge storage. A reasoning advantage at matched compute
  has been shown only for sparse models."
- Protocol warning: "Puzzle results of small recursive models depend
  heavily on the evaluation protocol" + per-task embedding is "the only
  channel — with a blank or random one gives 0%, and voting over 1000
  augmentations adds 10.75 points" + "TRM's reported Sudoku-Extreme
  accuracy of 87.4 has been reproduced at values from 66.8 to 87.9
  across papers."
- Release: "We release the corpus, the extraction records with verbatim
  evidence for every number, and the claims ledger."

## Novelty delta (C5 form)
They [map 557 looped-model papers by regime] under [architecture-
comparison literature]; we [transmit a capability across generations by
fading hints] under [tiny lookup curriculum]; claim [staged fading
ignites lookup] holds — different question (their corpus compares
ARCHITECTURES; our thesis is TRANSMISSION across brains; survey
vocabulary has no teacher→student generational-transmission category —
"distillation" in their corpus means intra-loop self-distillation
only). Precursor check: not found at text level; machine-readable
ledger grep (F1) queued as the stronger check. So-what: (1) label our
G-series comparisons in regime terms (§8 — matched-everything, rarer
than it sounds); (2) position lookup as rule-transmission, consistent
with "no knowledge storage, reasoning only sparse"; (3) adopt the
checklist (loop sweeps, seeds+spread, wall-clock).

## Stacks
- WITH LoopThink: survey's regime lens explains WHY LoopThink's controls
  matter (iso-FLOP vanilla comparisons, seed tables) — LoopThink is the
  worked example of the checklist; cite together as method standard.
- WITH Coconut/Huginn: r≈0.46 quantifies the price of recurrence both
  papers pay; our fade pays no recurrence price (variation axis is
  hints, not depth) — complementary, state it.
- WITH our eval hygiene: our fixed-200ex, no-augmentation-voting, no
  per-task-embedding evals are cleaner than the §11.2 horror cases — say
  so explicitly in methods.
- WITH F1 ledger grep: the machine-readable precursor check that closes
  the loop on "no transmission category."

## Placement (both — paper frame + method adoption)
- PAPER: regime vocabulary for §8 comparisons (F3); protocol-warning
  cite for our eval-hygiene paragraph; checklist adoption (F2: matched
  quantities, loop sweeps, wall-clock, seeds+spread).
- NURSERY: adopt checklist items for all future bench waves (seeds +
  spread already norm; add wall-clock + matched-quantity labels).
- WORKSPACE: neither.

## Follow-ups
- F1: grep released claims ledger (repo data/) for transmission-family
  rows — machine-readable precursor check. Queued.
  → CLOSED 2026-11-12 (see src/evidence/rabbithole/track-c/f1-ledger-note.md):
  1987 rows grepped, 90 hits, zero generational-teaching precursors
  ("transmission" = 1 irrelevant Mem-DeepSC row; "fad*/scaffold*/pedagog*/taught" = 0).
  Confirms hand-read with independent evidence. (Also surfaced CGAR lead → cgar-az.md.)
- F2/F3: checklist adoption + regime labeling, batched with the RW patch
  batch.
- F4: corpus pipeline reuse pattern if Track C ever gets its own corpus.
