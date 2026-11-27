# U64d-BOTH (E-NE0e) prereg v1.0 — punishing exam × wired response, verdicts independent

**Track:** U64d (user-ordered 2026-11-27: the "both together" track. Reads U64b exam defs +
U64c detT trunks as ARTIFACTS only. No track's verdict gates on another's — A, B, D each
verdict alone. 20 seeds; log everything).
**Cover:** drafted 2026-11-27 under that order; battery now (pool labor); COMPUTE (20
reads-only re-evals) UNLICENSED pending fresh countersign on this exact version. NO PUSH.
**Lesson encoded:** emergence hides in interactions — a response that looks dead under a
forgiving exam and an exam that looks dead without a response can combine into a live one.
Testing A and B alone CANNOT catch that (both would read DEAD); only the factorial cell
can. This track is that cell, with the joint reading filed separately so the verdicts stay
unconflated (verdict = what D measured; reading = what A×B×D jointly mean).

## Design (reads-only given U64b + U64c artifacts; zero new trains)
- Artifact dependency (NOT verdict dependency): D/W1 re-evaluates the 20 filed U64c detT
  trunks under the U64b exam copied VERBATIM below (pinned to U64b-exam v1.0 values — if
  U64b versions up, THIS prereg versions up too; no dangling refs).
- Exam copy (identical to U64b v1.0): E1 RECOVERY — 50 slots post each filed true boundary,
  diet-mix verbatim, e1Rng `G.makeRng(53100+seed*104729+55+106)` (detT armCode), N=150;
  metric accRec + rec1/2/3. E2 TRANSFER — novel 4th hot set (exclude run's 4 used, adjacent-
  differ vs hotSeq[3], redraw ≤20 else first-remaining), ruleRng continuation, e2Data
  `G.makeRng(53300+seed)` shared, e2Masks 91400+seed, N=200; metric accTra.
- Comparison (reads-only reuse, never recomputed): dice.accRec/accTra from U64b W1 filed
  ledgers (same seeds, same exam — matched comparison).
- Ledger per seed: {arm:detT, seed, accRec, rec1, rec2, rec3, accTra, rule, novelHot,
  stackHash, examHash (=U64b examHash — assert match, else HALT), wallMs}.
- PIN literal on all 20; examHash match asserted per ledger.

## Bars (quorum 15/20)
- BOTH-E1: detT.accRec ≥ dice.accRec+0.03 @quorum (dice from filed U64b ledgers).
- BOTH-E2: detT.accTra ≥ dice.accTra+0.03 @quorum.
- FLOOR: max(detT.accRec, filed dice.accRec) <0.40 on ≥6/20 → INCONCLUSIVE (same exam as
  U64b → same floor 0.40).
- Firewall: verdict reads ONLY {accRec, accTra (detT new + dice filed), stackHash, examHash}.

## Waves (COMPLETE-gated)
- W0: artifact presence (20 detT trunks filed + U64b W1 verdict filed + examHash equality
  on 3 spot seeds) + crash-test. Gate only.
- W1: 20 re-evals + verdict `d-newai-self-u64d-verdict.json`.

## Verdicts (D verdicts alone — joint reading is separate, below)
- BOTH-WORKS (either edge @quorum + floor holds) / BOTH-DEAD (neither, floor holds) /
  INCONCLUSIVE (floor trips) / PIN-FAIL.

## Joint emergence reading (separate doc, after A+B+D verdicts all filed)
- File `self-u64-emergence-analysis.md` (reads-only, doc-only, own barrage-10 + red-close
  battery at that time): per-seed contingency (A-edge? B-edge? D-edge? matched on seed) +
  verdict-level table. EMERGENT iff D@quorum AND NOT A@quorum AND NOT B@quorum, with exact
  binomial chance math for the joint (P(D passes @quorum by chance | A,B fail) — file the
  number, don't gesture). ADDITIVE iff (A or B passes) and D passes. NULL iff D fails or
  any floor trips (floors differ by exam — state which). The reading NEVER retro-gates any
  track's verdict (user-ordered independence); it licenses the NEXT question (learned
  trigger under the winning cell) via its own future prereg + battery + countersign.
## Filed expectations (Hypothesis, not bars)
- D is the most likely cell to pass: it combines the two halves the gaps implicate (timed
  response + scored recovery). An EMERGENT outcome (A-DEAD, B-DEAD, D-WORKS) is the
  highest-value result of the program — it would prove the interaction is the mechanism.
- BOTH-E2 may fail everywhere (frozen trunks + novel rule = stale maps for all arms);
  log the margins either way.
## Falsifiers
- Any exam-number drift vs U64b, any trunk change vs filed U64c, threshold moves post-data →
  new version + battery + countersign.
