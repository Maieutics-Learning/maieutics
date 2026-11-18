# Twins joint-trunk v0.7 COUNTERSIGNED (2026-11-18, user "countersugn")
— Binds this version only. Draft was scratch/p3-twins-v07-trunk-draft.md; body
unchanged, this file is the binding one. No compute beyond it without a new
countersign.

## Direction
- N-arm (3 writers): keep-worthy = writer mouth trunk. Start trunk+mouth from
  filed writer blobs 9601u/9602u/9603u, new pile head on the same trunk,
  then train TRUNK+MOUTH+EAR jointly.
- E-arm (1): keep-worthy = d1a trunk+ear. Start trunk from d1a blob
  (opts/param-count check on load, mismatch=HALT; first-param checksum filed
  in ledger for audit), new mouth head + new pile head (distilling ORIGINAL
  d1a ear), then train jointly.
- F-arm: done (mush transmits 1/3). No F compute in v0.7.

## Shared-trunk construction + joint update (filed openly)
- TinyNN has one Lout per model, so "one trunk two heads" = two model objects
  (mouthModel 19-way, pileModel 4-way) sharing the SAME trunk param objects
  by reference (pile.E/Wq/Wk/Wv/Wa/Lz/L1/L2 ARE mouth's objects, not copies).
  N-arm: mouth = filed writer blob (in-memory copy; blob files untouched),
  pile = fresh head sharing mouth's trunk. E-arm: mouth = fresh head-init on
  trunk values copied from d1a (d1a object untouched), pile = fresh head
  sharing mouth's trunk objects.
- Every joint step: (1) mouth backward (next-token aux, v0.6 recipe),
  (2) ear backward (soft CE vs tutor T1 cache, v0.6 recipe, grads kept),
  (3) trunk grad ×0.5 (average of the two accumulated grads),
  (4) ONE Adam step over trunk + both heads.
- Adam lr 5e-3, batch 8, joint steps 1000.
- Loss per example = mouthLoss + LAMBDA*earLoss, LAMBDA=1.0 (filed, no tuning).

## Data (same pools, no new shopping)
- Train mix per arm: 500 structured-recon (Markov-repeat p=0.35, seed 9770)
  + 500 noise (seed 9810 mixed 10/15/20+50), same as v0.6.
- Tutor caches T1 r=1: N-arm tutor = frozen N-9601 (original random ear);
  E-arm tutor = ORIGINAL d1a ear (frozen).
- Sampling seeds: N joint 9821/9822/9823 (9601u/9602u/9603u); E joint 9829.
  Head-inits: N pile 9831+idx; E mouth 9839, E pile 9840. Report all; no
  reseed on failure (HALT, don't shop).

## Gates (halt = halt, not retune)
- Mouth anchor: eval mouthLoss on 100 structured every 200 steps; if >2.6
  at any check → HALT arm. Joint bar wider than E-mouth 2.2–2.4 because the
  trunk serves two jobs — filed here, not moved later.
- NaN / integrity: finite cache rows/loss, nUniq checks on exams; violation
  → ABORT arm.
- U1 (mouth agreement, 200-line 9771 pool, per-position next-token argmax):
  gap ≥0.15 or build regressed → HALT before students.
- U2 attach fidelity (SAME bar 0.80, not lowered): self pile-ear vs original
  tutor-ear modal agreement on own 100-line exam (own joint mouth, ancestral
  prefix-3 + T=1.0, rng outside loop; new exam seeds 97621/97622/97623 + E
  97629; novelty poolHit vs 9770 reported descriptively). Below 0.80 =
  attach failed, B-dual stays OFF for that arm.
- U3 cross-ear carried (needs U1+U2).
- B-dual gated on U2 per arm (N quorum 2/3, E single as-is; same
  delta≥0.20 + blind 0.25±0.10 void rule, students 9790-9792/9610-9612 for N,
  9793/9613 for E).
- W (kills joint line): mouth anchor trips AND U2 <0.60 on ≥2 N writers →
  one trunk cannot host both jobs; fall back to split + E-lines/NARROW N.

## Cost / order
Joint 1000 full-trunk steps per writer (3 N + 1 E) → U1/U2 forwards →
students only where U2 passes. Resume-safe ledgers per unit
(scratch/p3-joint-*.json); no silent extension. Harness:
scratch/p3-twins-joint.js (new file, v0.6 harness untouched).

## What this countersign approves
LAMBDA=1.0, 1000 steps, lr 5e-3, anchor ≤2.6, exam/student seeds above,
same U2 bar 0.80, per-arm gating. Any change = new version.
