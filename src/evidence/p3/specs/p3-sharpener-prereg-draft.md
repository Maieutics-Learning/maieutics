# Sharpener mini-prereg v0.1 (COUNTERSIGNED 2026-11-18 by user "Go ahead countersign the sharpener" — binds this version only; build + Stage 1 authorized, Stage 2 needs its own go)

## Objective
Move N's ceiling (~0.85, surveyed) to ≥0.90 via self-supervised masked-value
pretraining on noise — no labels, no agreement use. Spec-sanctioned P2/P3 tutor
UPGRADE ("glasses, not hearing", GAMEPLAN P2 sharpening block): it sharpens
pattern vision, never touches a student score, needs no P4 interface.

## Method (tutor upgrade, not a student)
- Subject: fresh h48 brain(s), same arch OPTS (vocab19/classes4/h48/m96/d16/attn).
- Objective: masked-value prediction on uniform noise lines (P2-spec vocab19,
  matched length bands, fresh seeds ledger-listed): mask ~15% of positions,
  predict the masked token ids. Imitation-free (no teacher), correctness-free
  (noise has no labels; the target is the line itself, not a judgment).
- Head: masked-prediction head is NEW weights on the tutor side (allowed: tutor
  upgrade, same as candidate-(b) conditional head precedent). Architecture +
  loss filed exactly in the build script before running.
- Budget (proposed): ≤3000 steps/stage-equivalent per brain, batch 8/16, lr 5e-3
  (same optimizer family as all P2/P3 training; any deviation filed as amendment).

## Bar (two stages)
- STAGE 1 (climbability survey, cheap): 8 fresh h48 seeds, sharpened, then the
  SAME climbability probe as the naive survey (5 starts × 100 evals toward best
  class). PASS iff ≥3/8 seeds reach ≥0.90 (vs 0/8 naive). Else FAIL → sharpener
  dead, fall back to recalibrated-N (filed gap) or redesign pick.
- STAGE 2 (full rebuild, only if stage 1 passes): candidate-(a) search at the
  FULL 0.90 gate on all 4 classes (same code, same gates incl. novelty/entropy/
  non-triviality/diversity/chi2, same quorum ≥3/4). Sharpened-vs-unsharpened
  reported as an ARM, never a silent default.

## Controls / discipline
- No correctness-driven updates anywhere (masked-value target is the input
  itself, not an agreement score — same standing as all P2/P3 work).
- No seed shopping: the 8 survey seeds fixed pre-run; stage-2 rebuild uses the
  filed search seeds, not the best survey seeds.
- Novelty/pool guards identical to run-1a (pool-exact rejected, poolHit must be 0).

## Doubt instruments
- Expectation (numeric): stage-1 2–4/8 seeds reach ≥0.90 (ceiling moves but not
  everywhere); stage-2 3–4/4 classes pass at 0.90 (quorum met, round unblocked).
- Pre-mortem: strongest objection = masked-value on uniform noise teaches
  local co-occurrence statistics, not the class-boundary sharpness the 0.90 bar
  needs (different skill; ceiling doesn't move). Most likely failure = objective
  too weak to change climbability at all (survey 0–1/8, looks exactly like naive).
- Nearest-failure: h24-9602 raw-max 0.874 noted-not-used (seed-shopping guard);
  this prereg must not become retroactive justification for picking lucky seeds.
- W (what would prove this wrong): stage-1 survey ≤1/8 AND stage-2 <3/4 after
  one retry → sharpening cannot move the ceiling; kill the sharpener, do not
  extend budget silently.

## Cost
Stage 1 ≈ 8 short pretrainings + 40 climb probes (minutes). Stage 2 = same as
run-1a build (~15k evals/class). Ledger: scratch/p3-sharp-*.json (private until
gates pass; graduates to src/evidence/p3/ only on quorum).

## Status
COUNTERSIGNED 2026-11-18. Build script does not exist yet — next: build + Stage 1 only.
