# Twin-writers mini-prereg v0.4 (COUNTERSIGNED 2026-11-18 by user "countersign" — binds this version only; Stage A authorized, Stage B needs its own go after A passes)

## What changes from v0.3 (user direction, not yet countersigned — freely amended)
1. Frozen AND unfrozen writers (user: "definitely want to see unfrozen as well as
   frozen"). 3 backbones x 2 modes = 6 instances, frozen reported first (F-weights axis,
   parallel-arms standing rule — v0.3's unfrozen-only was a waiver, withdrawn).
2. THREE exam cycles for Exp A (user: Write > Swap+Test x3). Same writers, fresh
   sampling per cycle — tests whether convergence holds repeatedly, not once.

## The trap + repair (unchanged from v0.3)
Writer mouths (19-way) have no piles; separate pile heads are incommensurable. ONE
shared pile grader for everything — N-9601 frozen, unchanged. Writers differ (separate
histories x modes); the ruler stays put. All pile talk = this grader's argmax
(pseudo-classes, read-only, never ground truth).

## No-hard-labels clause (binding, unchanged)
Structure lives in the input distribution only (Markov-repeat RHO=0.35 pool 9770,
class-agnostic, identical generator for every line). Targets are the lines themselves.
No correctness, reward, agreement-gradient, or selection anywhere. Agreement stays
thermometer.

## Subjects (fixed pre-run, report all — no shopping)
Backbones 9601/9602/9603 x modes {frozen (head-only Adam), unfrozen (full Adam)} = 6
instances i=0..5 (i = backboneIdx*2 + modeIdx, modeIdx 0=frozen 1=unfrozen).
Mouth build = v0.2 (next-token CE via per-position aux through Lout19, structured pool
9770/400), <=800 steps, batch 8, lr 5e-3, rMode 1. Head-init 9761+backboneIdx (SHARED
across both modes of a backbone — same start, diverge by training). Train-sampling
9780+backboneIdx (same data order within a backbone pair).

## Exp A — convergence (measurement-only, exempt from parallel-arms)
- A1 mouth-agreement (one measurement — writers are static after training): all 6
  writers + blind mouth (random-init 19-way, seed 9699) predict next tokens on 200
  shared fresh structured lines (seed 9771). Pairwise argmax agreement, reported
  per-mode: unfrozen-trio pairs, frozen-trio pairs, cross-mode pairs, each-vs-blind.
  BAR: mean(unfrozen-trio pairwise) minus mean(unfrozen-vs-blind) >= 0.15. Frozen trio
  vs blind is descriptive (expected ~= 0 — the v0.2 "head-only learns nothing" control).
- A2 three exam cycles (c=1,2,3): per cycle, every instance generates 100 lines
  (prefix-3 + ancestral T=1.0, sampling seed = 97600 + c*10 + i, novelty poolHit 0 vs
  9770). Common scorer pile-sorts all 600. Per cycle readouts: per-instance pile profile
  + modal pile; scorer's uniform-pool profile as bias reference. BAR per cycle: same
  modal pile across all 6 instances AND profiles distinct from bias reference.
  STABILITY: same modal pile across all 3 cycles. A2 PASSES iff >=2/3 cycles pass.
- Gate: B runs iff A1 AND A2 both pass.

## Exp B — transmission (schematic; exact student seeds filed at B-countersign)
Per writer (unfrozen trio, or convergers if A splits): exam = writer's cycle-1 100 lines;
labels = common scorer argmax (imitation only); fresh student T1 <=1500 steps (bounded
pilot bound); blind N (fresh random-init 4-way) same exam untaught. BAR per writer:
student-teacher input-driven delta >= 0.20 AND blind within chance +- 0.10 (else void).
CLAIM: >=2/3 writers pass. B needs its own countersign after A.

## Controls / discipline
- No correctness-driven updates anywhere. Fixed seeds throughout (above). Novelty:
  generated exams poolHit 0 vs 9770 or discarded. Report all 6 instances + all 3 cycles,
  passes and fails.

## Doubt instruments
- Expectation: A1 unfrozen-trio beats blind by ~0.15-0.25; frozen ~= blind. A2: modal
  match 2-3/3 cycles (writers emit the same food, scorer fixed) — frozen/unfrozen may
  split by mode (structured vs near-uniform emissions); a mode split is a RESULT.
- Pre-mortem: strongest objection = shared scorer piles everything pile-0-ish regardless
  (v0.2: ~45%) — hence the bias-reference BAR condition. Most likely failure = writers
  diverge by history (different visions) -> A1 fails, B gated off, cheaply (but trainings
  are already spent — ~25-30 min; the gate saves B, not A).
- Nearest-failure: v0.2 dialect mismatch + Step-0 absent 0.90 region (max 0.888) — A2
  concerns profiles, not the 0.90 bar, so Step 0 does not void A2.
- W: A1 unfrozen-trio <= blind+0.05 AND A2 modal mismatch on >=2 cycles -> writers
  neither converge nor share a profile; kill the writer line, fall back to E-lines +
  NARROW N claim.

## Cost
Stage A: 6 writer trainings (~4-5 min each, across calls with per-instance ledgers) +
A1 forwards (seconds) + 3x600 generations + grading. Stage B (gated, separate go):
students + baselines.

## Status
COUNTERSIGNED 2026-11-18. Stage A authorized: train 6 writers (9601/9602/9603 x frozen/unfrozen), A1 mouth-agreement, A2 three exam cycles. Stage B needs its own go after A passes.
## 2026-11-18 — twins Stage A VERDICT: A1 PASS (mouths converge, 0.40 vs blind 0.09), A2 FAIL 1/3 (knife-edge modals, near-bias profiles). B GATED OFF.
- Trainings: pattern holds all backbones — frozen loss pins at chance (2.89-2.92), unfrozen learns (2.26-2.31). 9601 pair reproduces v0.2 bit-identically (determinism check). Blobs scratch/p3-twins-W*.json.
- A1 (scratch/p3-twins-A1.json): unfrozen-trio pairwise 0.404 vs blind 0.094 -> bar +0.310 >= 0.15 PASS, strongly. Frozen trio 0.339 vs blind 0.095 (head-only training converges somewhat — above blind). Cross-mode 0.106 ~= blind: the two modes find ENTIRELY different solutions.
- A2 (scratch/p3-twins-A2c{1,2,3}.json): c1 FAIL (modals 3,0,0,0,3,0 — two flips by ~0.01 margins), c2 FAIL (five 0s, one 3; l1 0.092 < 0.10 anyway), c3 PASS (all modal 0, l1 0.108). 1/3 < 2/3 bar -> FAIL. Nuance filed: pooled profiles nearly identical every cycle (~[0.43,0.22,0,0.34]); modal rule turns 1% wobbles into fails. Uniform-bias reference [0.48,0.17,0.005,0.34] sits within l1 ~0.10 of writer profiles — grader sorts writer lines ~like noise (v0.2 dialect mismatch again). Pile-2 effectively dead everywhere (0.005).
- Gate: A1 PASS + A2 FAIL -> B OFF per prereg. W conjunction (A1<=blind+0.05 AND A2 mismatch>=2) NOT met (A1 passed) -> line NOT killed. Open: A2-bar redesign (profile-distance not modal-match), B-on-A1-strength (amendment + countersign), or E-lines+NARROW track.
