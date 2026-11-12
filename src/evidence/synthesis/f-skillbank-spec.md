# F-skillbank — spec v1.0 (SGSD recipe → nursery mistake bank)

Status: SPEC 2026-11-12 (implements sgsd-sdft.md placement).
SGSD repo fetched at spec time: pipeline confirmed —
generate memories → extract candidates → hierarchical merge →
retrieve/format → online dyn_### updates (scratch/sgsd-skill-readme.md).
Adaptation below (no LLM, no natural language: our "skills" are
mistake-profile records over probe outcomes).

## Pipeline (per generation, per seed → merged)
1. MEMORY records: raw eval trajectories → normalized success/failure
   records. Input: killA/killHd/killDa/killHu per-example outcomes +
   swap-audit fails + attention-entropy + loss. Output JSON per
   (seed, gen, student): {miss sets per family, error class}.
2. Error classes (closed set, our named shapes): killA-collapse,
   memorize-lean (Hd≪A), severance-collapse, position-heuristic
   (swap-oldY), diffuse-attention (entropy gap), success.
3. MERGE across seeds: cluster recurring modes → compact bank
   {mode, frequency, example ids, first-seen gen}. Dedup by miss-set
   overlap (Jaccard ≥ 0.5 merges). File: src/evidence/synthesis/
   skillbank-g{gen}.json (rebuild per generation; bank is versioned,
   never overwritten — append-only per memory rules).
4. RETRIEVE (two uses):
   a. Tutor selection by mistake-profile COMPLEMENTARITY: score
      candidate tutors by coverage of the current student's miss set
      (not just Hd rank). Winner-promotion stays the default; complement
      tutors become the challenger arm (complement-vs-best ablation =
      the test).
   b. Gated disagreement weighting: weight stage training examples by
      tutor–student output disagreement (SGSD gate analog at probe
      level; medium-gap examples up-weighted, extreme-gap clipped —
      mirrors the bounded gate).
5. ONLINE update: dyn_### records appended when a new mode appears
   (novelty = miss-set Jaccard < 0.3 vs all banked modes); triggers
   re-retrieval for the next generation's tutor choice.

## Tests (pre-registered)
- T1: complement-tutor arm vs best-Hd arm — does coverage beat rank?
- T2: disagreement-weighted stages vs uniform — faster ignition?
- T3: bank growth across generations — do modes die (learned) or
  persist (structural)? Persistent modes → curriculum redesign input.

## Cost
Post-hoc build from saved blobs + evals (no new training for v1 bank:
g1–g5 blobs on disk). T1/T2 need training → Phase 3 batch.
