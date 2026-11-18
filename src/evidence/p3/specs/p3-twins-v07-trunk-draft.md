# Twins joint-trunk v0.7 DRAFT (2026-11-18) — UNCOUNTERSIGNED, no compute
— Binds this version only once countersigned. Head-only graft failed (v0.6 U2
N 0.008/0.02/0.03, E 0.16, bar 0.80), so the trunk must move. This spec trains
mouth+ear TOGETHER on one shared trunk with a mouth anchor.

## Direction
- N-arm (3 writers): keep-worthy = writer mouth trunk. Start trunk+mouth from
  filed writer blobs 9601u/9602u/9603u, new pile head on the same trunk,
  then train TRUNK+MOUTH+EAR jointly.
- E-arm (1): keep-worthy = d1a trunk+ear. Start trunk from d1a blob
  (SHA ce8b97cf check, mismatch=HALT), new mouth head + new pile head
  (distilling ORIGINAL d1a ear), then train jointly.
- F-arm: done (mush transmits 1/3). No F compute in v0.7.

## Shared-trunk construction + joint update (filed openly)
- TinyNN has one Lout per model, so "one trunk two heads" = two model objects
  (mouthModel 19-way, pileModel 4-way) with trunk values kept in lockstep:
  init via copyTrunk(writer/d1a → both models), then every joint step:
  (1) mouth backward on mouthModel (next-token aux, as in v0.6 trainMouth),
  (2) ear backward on pileModel (soft CE vs tutor T1 cache, as in v0.6
  trainPileHeadOnly but grads kept, not stepped), (3) trunk grad =
  (mouthTrunkGrad + earTrunkGrad)/2, write back to BOTH models, (4) Adam step:
  trunk once + mouth head on mouthModel + pile head on pileModel.
- Adam lr 5e-3 (same as v0.6 for comparability), batch 8, joint steps 1000.
- Loss per example = mouthLoss + LAMBDA*earLoss, LAMBDA=1.0 (both ~1-2 nats,
  no weighting games; one value, filed here).

## Data (same pools, no new shopping)
- Train mix per arm: 500 structured-recon (Markov-repeat p=0.35, seed 9770)
  + 500 noise (seed 9810 mixed 10/15/20+50), same as v0.6.
- Tutor caches T1 r=1: N-arm tutor = frozen N-9601 (original random ear);
  E-arm tutor = ORIGINAL d1a ear (frozen, loaded from src/evidence/d1a).
- Sampling seeds: N joint 9821/9822/9823 (idx 0/1/2 for 9601u/9602u/9603u);
  E joint 9829. Head-inits: N pile 9831+idx; E mouth 9839, E pile 9840.
  Report all; no reseed on failure (HALT, don't shop).

## Gates (halt = halt, not retune)
- Mouth anchor: eval mouthLoss on 100 structured every 200 steps; if >2.6
  at any check → HALT arm (trunk collapsed to ear mush, mouth lost).
  E mouth range precedent 2.2–2.4 noted; joint bar is wider (≤2.6) because
  the trunk now serves two jobs — filed here, not moved later.
- NaN / integrity: same as v0.5 FIX-2 (finite cache rows/loss, nUniq checks
  on exams). Violation → ABORT arm.
- U1 (mouth agreement, same 200-line 9771 pool): gap ≥0.15 or build
  regressed → HALT before students.
- U2 attach fidelity (SAME bar 0.80, not lowered): self pile-ear vs original
  tutor-ear agreement on own 100-line exam (own joint mouth, ancestral
  prefix-3 + T=1.0, rng outside loop; N cycle-3 slots 97601/97603/97605
  reused? NO — new exam seeds 97621/97622/97623 + E 97629, filed here to
  avoid exam-reuse bias; novelty poolHit vs 9770 reported descriptively).
  Below 0.80 = attach failed, B-dual stays OFF for that arm.
- U3 cross-ear carried (needs U1+U2).
- B-dual gated on U2 per arm (N quorum 2/3, E single as-is; same
  delta≥0.20 + blind 0.25±0.10 void rule, students 9790-9792/9610-9612
  carried for N, 9793/9613 for E — reuse mapping, no new seeds).
- W (kills joint line): mouth anchor trips AND U2 <0.60 on ≥2 N writers →
  one trunk cannot host both jobs; fall back to split + E-lines/NARROW N.

## Cost / order
Joint 1000 full-trunk steps ~6–8 min per writer (3 N + 1 E) → U1/U2 forwards
(seconds) → students only where U2 passes. Resume-safe ledgers per unit
(scratch/p3-joint-*.json); no silent extension. Implementation needs a new
harness helper (joint step with trunk-grad averaging) — new file
scratch/p3-twins-joint.js, does not modify v0.6 harness.

## What countersign approves
LAMBDA=1.0, 1000 steps, lr 5e-3, anchor ≤2.6, new exam/student seeds above,
same U2 bar 0.80, per-arm gating. Any change = new version.
