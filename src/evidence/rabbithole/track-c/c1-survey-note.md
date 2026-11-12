# C1 verdict — Looped-LM survey (Azizi et al., preprints 202610.1404, Oct 2026 snapshot)

Source: https://arminazizi98.github.io/looped-lm-survey/looped-lm-survey.pdf (1.2MB, fetched 2026-11-11)
+ repo https://github.com/ArminAzizi98/looped-lm-survey (data/scripts/paper).
 Corpus: 557 core papers screened from 7,323; 822 verified claims by regime; claims ledger released.

Status: USED (frame + regimes + checklist). No precursor found for staged hint fading.

## What it says that matters to us

1. **Comparison regimes (Table 2 / §15).** Every claim sorted by what is held fixed
   (iso-param / iso-depth / iso-infer-FLOP / iso-train-FLOP / iso-data / unmatched).
   Most apparent contradictions in the field are regime differences, not result
   differences. Only 19% of verified claims are compute-matched; 31% shown at ≥1B params.
2. **r ≈ 0.46 (§15.3).** One recurrence ≈ 0.46 fresh blocks in unique-parameter terms;
   looping hurts when it replaces unique params at fixed compute, helps when params
   are the constraint (memory budget, limited data, sparse experts).
3. **Test-time depth saturates at training depth (LM scale, §7.2).** No help from extra
   loops beyond training; randomized-depth training moves the saturation point.
4. **No knowledge storage at small scale; reasoning edge only for sparse models (§7.3).**
5. **Puzzle results are protocol-dominated (§11.2).** TRM Sudoku reproduced 66.8–87.9;
   per-task embeddings are "the only channel" (blank → 0%); +10.75 pts from voting
   over 1000 augmentations; a feedforward 18M vision Transformer beats HRM/TRM ARC
   scores (54.5 pass@2 vs 40.3/44.6) — recursion not required. Benchmarks in this
   family measure protocol as much as architecture.
6. **Reporting checklist (App. B, items 1–8).** Template instance, params, FLOPs
   (train+infer, with convention), KV bytes + sharing, gradient method, matched
   quantities per baseline + same-data?, loop-count sweep below/at/beyond training,
   wall-clock on stated hardware, seeds + spread (esp. puzzle benchmarks).
7. **Minimal agenda P13.** Report regime+FLOPs+KV+wall-clock for every result (P1);
   measure r′ at ~10B dense+sparse (P2). Directly adoptable.

## Novelty deltas (C5 form)

- **Staged hint fading (G1→G5 transmission).** Survey vocabulary has no
  teacher→student generational-transmission category (text grep: no teacher/student/
  transmission/curriculum/fade; "distillation" = intra-loop self-distillation only,
  "post-training/RL/distillation" = 6-paper LM category). Their corpus compares
  ARCHITECTURES; our thesis is TRANSMISSION of a capability across brains.
  Different question → no precursor, no downgrade. (Stronger check queued: grep
  the released machine-readable claims ledger for transmission-family claims.)
- **r-curves (r=1 vs r=4 gains, r=16 collapse).** Consistent with the survey's
  regime reading (dense, matched compute, small scale). Our paper should label
  its comparisons in their regime terms — ours are matched-everything by
  construction (same arch, same pool, same fade), which is rarer than it sounds.
- **Assoc-recall lookup claim.** Consistent with "no knowledge storage, reasoning
  only sparse": we claim rule-lookup transmission, not storage. Position it there.
- **Benchmark hygiene.** Our evals (fixed 200ex, no augmentation voting, no
  per-task embedding) are cleaner than the §11.2 horror cases — say so explicitly,
  and adopt the checklist (loop-count sweeps, seeds+spread, wall-clock).

## Verdict

USED. Frame adopted (regimes + r≈0.46 + checklist + protocol warning). No
CONFLICT, no USED-CONFLICT. Precursor risk for transmission thesis: not found.

## Follow-ups queued (do not batch)

- F1: grep the released claims ledger (repo data/) for transmission/teacher/student
  rows — the machine-readable version of the precursor check.
- F2: adopt App. B checklist items 5–8 for our paper (matched quantities, loop
  sweeps, wall-clock, seeds+spread) — concrete Related-Works/methods patch.
- F3: label G-series comparisons in regime terms in §8.
- F4: fetch repo data/ scripts (corpus pipeline) — reuse pattern for Track C corpus
  if we ever build one.

## Extraction note (tooling, for later waves)

CDN imports fail in both execute_js and the live page here (esm.sh + jsdelivr
unreachable from page; pdfjs specifier failed). Working path: fetch PDF to
scratch/bin → byte-level stream parse (latin1 decode CORRUPTS binary — use raw
bytes) → pako (cdnjs, works in execute_js) → kerning-aware TJ join (space iff
TJ number < −120) → octal escapes + control-char ligature map (001b=ff,
001c=fi, 001e=ffi, 001d=fl, 001f=ff, 0010/0011=quotes, 0015=fi/-, 0019=ğ).
Survey PDF: 416 streams inflated, 289KB clean text. Reuse per C-wave.
