# Twins dual-head v0.6 COUNTERSIGNED + Fresh-mush arm F (2026-11-18, user "ok, lets do that then" + "Consider it countersigned")
— binds this version only. No further compute without a new countersign.

## Direction (user)
- N arm: writer trunks + new ear grafted on the same trunk.
- E arm: educated trunk stays, new mouth, its own ear stays on the same page.
- PLUS: completely fresh N growing trunk, ear and mouth from scratch on
  fresh noise outputting mush — can nothing teach students to output the
  same mush it outputs (tested with tests it writes)?

## Asymmetry note (why N and E are treated differently — user asked)
N's keep-worthy part is the mouth trunk (unfrozen writers learned structure
2.26–2.31); N-9601's trunk is random. E's keep-worthy part is trunk+ear
together (d1a educated sorter, killA 0.965); it never had a mouth.
Rule both arms: freeze what's good, train only what's missing.
- N arm: NO mouth retraining (reuse filed writer blobs 9601u/9602u/9603u
  as trunk+mouth frozen). Train ONLY new LoutPile (h→4) to distill
  frozen N-9601 softs. Trunk never moves → mouth and ear share the exact
  writer trunk values by construction.
- E arm: trunk moves (must — frozen head-only mouths sit at chance
  2.89–2.92, filed v0.2). So: start from d1a trunk, train mouth+trunk
  UNFROZEN full (same v0.2 recipe shape), then freeze the RESULT trunk
  and train a NEW pile head distilling the ORIGINAL d1a ear. Final E ear
  is a distilled copy on the new trunk (filed openly — original head
  cannot survive a trunk move). Same page by construction (both heads on
  the final trunk).
- Pool reconstruction (filed openly): the 9770 builder script was
  ephemeral (never saved). Reconstructed as Markov-repeat: x0 uniform
  0..18, each next = prev with p=0.35 else uniform 0..18. Justification:
  yields optimum ~2.44 nats = filed true-Markov optimum ~2.45. Lengths
  mixed 10/15/20 + 50 (same as P2 noisePool). No bit-replay claim;
  determinism gate replaced by range gate (mouth loss 2.2–2.4).

## Arm F — fresh mush (user's addition, fully specified here)
No tutor training (0 steps — true nothing; training on noise is void per
sharpener halt). 3 fresh inits F=9701/9702/9703:
- Per F: mouthModel = AttnModel(vocab19/classes19, seed F) random;
  pileModel = AttnModel(vocab19/classes4, seed F) random, then OVERWRITE
  its trunk with mouthModel's trunk (copy once) → one random trunk, two
  random heads. Frozen thereafter. This IS the teacher.
- Exam: own mouth ancestral (prefix-3 uniform + T=1.0, exam rng outside
  loop — twins-gen procedure), 100 lines, seeds 97700+F_idx (97701/2/3).
  Grade with OWN pile ear r=1. Novelty vs 9770 pool not required (mush
  control — report poolHit descriptively).
- Students: fresh 4-way distill own-ear softs (T1 cache, 1500 steps,
  batch 8, lr 5e-3, rMode1), seeds 9795/9796/9797. Blinds: fresh 4-way
  untaught, seeds 9615/9616/9617. Same delta≥0.20 / blind-chance±0.10
  readouts, but F claim is DESCRIPTIVE (control): does mush transmit?
  Expectation: students copy (high obs/delta), blinds tell whether the
  exam discriminates (void = same page as B, pass/fail reported as-is).

## Fixed seeds (no shopping, report all)
- N-arm ears: trunks 9601u/9602u/9603u (filed blobs), pile head-init
  9761+idx (0/1/2), ear-train sampling 9785+idx, 1500 steps, batch 8,
  lr 5e-3, rMode 1, train = 500 structured-recon (seed 9770) + 500 noise
  (seed 9810 mixed). Tutor = N-9601 frozen, T1 cache rows.
- E-arm mouth: init trunk d1a (SHA ce8b97cf check on load, mismatch=HALT),
  LoutMouth head-init 9761, train sampling 9786, structured 9770/400,
  ≤800 steps, batch 8, lr 5e-3, rMode 1, next-token aux (labs[t]=x[t+1],
  last null, head-full unfrozen). Range gate 2.2–2.4 or HALT (pool
  reconstruction check).
- E-arm ear: freeze result trunk, new pile head-init 9762, distill
  ORIGINAL d1a ear T1 rows on same 500+500 mix, 1500 steps, seed 9794.
- Exams (N+E): own-mouth 100 lines, sampling 97600+3*10+i cycle-3 slot
  (N: i=1/3/5 for 9601u/9602u/9603u; E: 97609), novelty poolHit 0 vs 9770
  or discard+reseed-once (filed).
- Students (N+E): N: 9790/9791/9792 + blinds 9610/9611/9612 (v0.5 mapping
  carried); E: student 9793 + blind 9613. T1/1500/batch8/lr5e-3/rMode1.
  Bar delta≥0.20 + blind in 0.25±0.10 else VOID. N quorum 2/3; E single
  reported as-is; F descriptive.

## Bars
- U1 mouth-agreement replays A1 (unfrozen N trio + E mouth + blind 9699
  on 200 shared structured lines seed 9771): mean(writer-writer) −
  mean(writer-blind) ≥ 0.15 or build regressed → HALT.
- U2 attach fidelity: self-ear vs original-ear agreement on own exam
  ≥ 0.80 (N: vs N-9601; E: vs original d1a). Below = attach failed, not
  a transmission claim.
- U3 cross-ear: all N+E ears' modal match on each exam + mean cross-ear
  agreement − blind-ear ≥ 0.15. Needs U1+U2.
- B-dual (gated on U1–U3, same run if gates pass): N quorum 2/3,
  E single, F descriptive. Same void rule throughout.
- W (kills dual line): U1 fails AND U2 < 0.60 on ≥2 N writers →
  one trunk cannot host both jobs; fall back to split + E-lines/NARROW N.

## Cost / order
Ears (3×1500 head-only, ~2–3 min each) → U1/U2/U3 forwards (seconds) →
E mouth (800 full, ~5 min) + E ear (1500 head-only) → students
(N 3 + E 1 + F 3 × 1500, ~5 min each) + blinds. Resume-safe ledgers per
unit; no silent extension.
