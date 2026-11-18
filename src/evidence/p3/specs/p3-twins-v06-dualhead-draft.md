# Twins dual-head mini-prereg DRAFT v0.6 (UNCOUNTERSIGNED — binds nothing; no build until countersigned)

## Direction (user 2026-11-18)
Recreate the current mouth/ear split inside ONE net, so the teacher's mouth
and ear are on the same page. No compute until countersigned.

## What changes from v0.4/v0.5
- Today: writers = trunk + mouth only (19-way next-token, no piles);
  grader = N-9601 frozen ear only (4-way whole-line, never speaks).
  Separate objects by construction.
- v0.6: each teacher = ONE trunk + TWO heads (mouth h→19 per-position,
  pile h→4 whole-line r=1). Same E/attention/cell, two Linear readouts.
  New model class (DualAttn), grad-checked before any training.

## E vs N parallel (user correction 2026-11-18)
- Yes: P3 ran E vs N as parallel tutor candidates (E-build 4/4 banked,
  N-build 0/4 absent → N-recal/top-up/pilots; P2-run-7 E-cool + N-solidify).
- Twins narrowed to ONE shared ear (N-9601 frozen) for commensurability —
  that was a narrowing for the writer-convergence test, not the end of E.
- v0.6 keeps the parallel: each arm becomes its own speaker-listener
  (mouth + ear on the SAME trunk).
- Arm N (this draft, fully specified): twins backbones 9601/9602/9603
  unfrozen-trio recipe — Phase M mouth replay + Phase E ear attach below.
- Arm E (same-page counterpart, same spec shape): trunk = d1a educated
  blob (frozen, SHA ce8b97cf checked on load), mouth = NEW h→19 trained
  with the identical v0.2 recipe (9770/400, <=800, 9780-slot sampling),
  ear = its own educated 4-way head frozen unchanged. So E speaks with
  its educated trunk and sorts with its educated ear — same page, educated
  version. Needs only mouth training (ear already exists).
- Both arms use identical exams/bars below; E vs N compared side-by-side,
  no shopping (report both even if one voids).

## Build (two phases, frozen-first where it matters)
- Phase M (mouth, exact v0.4 replay): trunk + mouth trained as v0.4
  unfrozen (structured pool 9770/400, <=800 steps, batch 8, lr 5e-3,
  rMode 1, head-init 9761+idx, train-sampling 9780+idx). Bit-replay of
  convergers expected (loss 2.26–2.31, A1 ~0.40). Filed check: 9601u
  reproduces v0.4 loss bit-identically or HALT (determinism gate).
- Phase E (ear attach): freeze trunk + mouth, train ONLY LoutPile
  (fresh init 9761+idx, same per-backbone start) to distill frozen
  N-9601 soft targets (T1 cache rows, same cacheTutor row-array form)
  on 500 structured (9770) + 500 uniform-noise lines, <=1500 steps,
  batch 8, lr 5e-3, rMode 1, seeds 9790+idx. Ear never sees writer exams.
- Controls: no hard labels anywhere (mouth copies inputs, ear copies
  N-9601 softs); fixed seeds above; novelty poolHit 0 vs 9770 on exams.

## Exams (same page test)
- Each unified teacher generates 100 lines via OWN mouth
  (prefix-3 + ancestral T=1.0, sampling 97600+3*10+i — cycle-3 slot,
  novelty gated), then grades with OWN ear (r=1 argmax).
- Readouts per teacher: self-sort profile + modal; cross-sort (teacher i
  lines × teacher j ear); N-9601 re-sort of same lines (bridge to v0.4/v0.5).
- Bars (filed): U1 mouth-agreement replays A1 (>= blind+0.15 or build
  regressed, HALT); U2 self-vs-N agreement >= 0.80 (ear lives on same
  page as mouth — below = attach failed, not a transmission claim);
  U3 cross-ear modal match 3/3 AND mean cross-ear agreement minus
  blind-ear agreement >= 0.15. Claim needs U1+U2+U3 (quorum inside
  one spec, no shopping).
- Students (gated on U1–U3, separate countersign): distill each
  teacher's OWN ear on its OWN exam; blind = fresh 4-way on same exam,
  void band 0.25±0.10 carried over. Bar delta >= 0.20, 2/3 quorum.

## Doubt instruments
- Expectation: U1 replays (~0.40), U2 high (~0.85+ — ear distilled on
  same trunk family), U3 passes if trunk-shared ears align (the bet).
- Pre-mortem: strongest = ear just copies N-9601 bias (pile-0-ish), so
  U3 modal match is bias again — answered by blind-ear gap + N-bridge
  (if self==N==blind, void, not pass). Most likely = Phase E underfits
  (frozen trunk lacks pile-linear features) → U2 fails, cheaply.
- W: U1 fails AND U2 < 0.60 → unified trunk cannot host both jobs;
  kill dual-head, fall back to split + E-lines/NARROW N.
- Cost: 3 × (800 mouth + 1500 ear) + forwards. No B until U passes.

## Status
DRAFT 2026-11-18. Needs user countersign (version-bound approval)
before ANY code or compute. No silent extension of v0.4/v0.5.
