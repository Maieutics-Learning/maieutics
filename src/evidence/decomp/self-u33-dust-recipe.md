# Cross-machine float-dust validation — OWED, BLOCKED (needs a second machine)

Status (Turn-186): BLOCKED. This validation requires hardware the agent does not have:
a SECOND machine/engine (different JS engine or device) to run the recipe below.
Same-machine re-runs add nothing (this engine already reproduces exactly).

## Why it matters
U33-FUNC (±0.02) prices Math.exp/tanh last-bit variance across JS engines but was
validated same-machine only (expect exact). BIT-exactness across engines is NOT
assumed; FUNC tolerance is PRICED for it but untested. Until this runs elsewhere,
cross-engine bit-reproducibility is an owed follow-up, never assumed. (Prereg L2;
verdict U33-FUNC note; filed Turn-153.)

## Recipe (for the user or a future session on another device)
1. Take this repo at the same commit (stackHash must be
   258d2f060684ce382778e203959ab791abb5df79af174deef19ff568886d4d6e —
   verify via the audit in src/tools/rebuild.js / REBUILD_FROM_SCRATCH.md Stage 0).
2. Run set B (same seeds 0/1/2, same pinned recipe/stack → d-newai-self-u33-confirm
   expectation: BIT exact) OR set C (fresh seeds 3/4/5 → sweep-loss0 match).
   Entry: newai-selfu33-driver.js runU33Train/runU33Eval (see prereg
   self-u33-canonical-repair-prereg.md §Set B / §Set C).
3. Grade: U33-BIT (exact 0.0 3/3) and U33-FUNC (±0.02 3/3) + loss0 fingerprint.
   - If FUNC holds but BIT breaks: dust CONFIRMED, priced correctly — file the
     engine pair + magnitudes; BIT claims become engine-scoped.
   - If both hold: dust cleared — file engine pair; BIT claim generalizes.
   - If FUNC breaks: file as recipe-band finding (expect direction per SWEEP-FAILs);
     canonical verdict stands (driven by set A), tolerance re-priced.
4. File results as d-newai-self-u33-dust-<engine>.json + note here. Then this item closes.

## Engine record
- Origin engine: this run (single Chromium-family browser worker, Float64).
- Second engine: PENDING (none available in-session).
