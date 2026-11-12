# F-singlegen — MANDATORY experiment spec (resolves the USED-CONFLICT)

Status: SPEC v1.0 (2026-11-12). Pre-registered BEFORE any run.
Resolves: curriculum-fading.md USED-CONFLICT (faded worked examples
are a precursor on the fading IDEA; novelty scoped to GENERATIONAL
MACHINE TEACHING). If the single-student arm ignites, the generational
claim weakens and the paper re-scopes to fading-schedule design.

## Question
Does ignition require FRESH students per generation, or does the same
fade schedule ignite ONE continued student? Isolates the GENERATIONS
variable with tutors, stages, steps, pools, and exams held fixed.

## Design (paired chains, within-seed tutor lock)
Per seed (G-series seeds 201–208):
- Run the G arm (control): fresh student + fresh Adam per generation,
  tutor = previous-gen winner (classic chain, T0 → W1 → W2 ...),
  FAST_FADE (1000/1000/1000 steps, attnKeep 1.0/0.5/0.0, softW 1.0,
  hardW 0), pool seed 7, exams base 7008, eval r=4.
  Record the tutor used at each generation boundary.
- Run the S arm (treatment): ONE student, weights + Adam carried across
  ALL generation boundaries, same tutor sequence as its paired G chain
  (tutor lock — same teacher, same stages, same steps; R4 control).
  Same FAST_FADE, same pool, same exams.
- Third arm S-optfresh (disambiguation, cheap — same run, fork at each
  boundary): carried weights, FRESH Adam per generation. Separates
  weight-persistence from optimizer-state if S ignites.
- Arch fixed: attn h48/m96/d16 (t0.json opts). Ignition gate unchanged:
  killA ≥ 0.60 && killHd ≥ 0.55. Stop rule unchanged: chain rots at 0
  ignitions (S: stop advancing; record rot generation).

## Pre-registered outcomes
- O1 (generational claim HOLDS): G ignites ≥ S by ≥2 generations, or S
  rots while paired G sustains. Paper keeps generational framing;
  USED-CONFLICT stays scoped-resolved.
- O2 (generational claim FALLS): S ignites ≈ G (within 1 generation
  across seeds). Paper re-scopes to fading-schedule design; RW-fading
  becomes the lead, generations demoted to implementation detail.
- O3 (optimizer-state effect): S-optfresh between S and G → weight
  persistence, not optimizer momentum, carries the effect (or reverse).
  Recorded regardless; decides a methods footnote, not the claim.

## Cost + phasing
Full power: 8 seeds × 3 arms × ≤5 gens × ~550 s ≈ 11 h in-page.
Phase 1 (this wave): runner + smoke (1 seed, 1 gen, 150 steps/arm —
mechanics + timing validation only, NO scientific conclusion).
Phase 2: pilot (4 seeds × 3 arms × 3 gens × 600 steps ≈ 45 min,
orchestrated chunks) — effect-size sniff.
Phase 3: full power (multi-session; chunked per-seed chains, results
appended to scratch/f-singlegen-results.json).

## Analysis (cheap logging bundle — same pass post-ignition)
F-lambda: log per-generation on-policyness (fraction unaided) vs
ignition. F-mech: NMD-style mem/gen neuron diff on saved checkpoints
(mem-lean vs ignited). F-new: entropy/TTR gated-vs-ungated (R2 input).
Checkpoints: saveModel blob per (seed, arm, gen) to results file.

## Files
- Runner: scratch/f-singlegen.js (reuses TinyNN.gseries: buildPool,
  buildExams, cacheTutor, trainFaded, evalSuite, ignites, saveModel).
- Results: scratch/f-singlegen-results.json (append-only per chain).
- This spec: src/evidence/synthesis/f-singlegen-spec.md.
