# U60-DET3 (E-NE2) prereg v1.0 — regime-trained substrate (answers U58 carry-null)

**Track:** U60-DET3 (detector line; U58 v1.5 localized the residue to substrate/mapping: carry null
0/20 at 4x precision, cross fails 18/20 — no further N licensed as power retry).
**Cover:** user 2026-11-26 "write the new-substrate prereg" = this prereg + 10x battery ONLY
(driver + compute NOT covered — needs fresh countersign after battery). NO PUSH without order.
**Lesson encoded:** B'' asks the canon trunk carry to mark regime switches, but the canon trunk was
trained on static pick-max rows — nothing in its objective ever required regime marking, and the
carry (the only cross-row state) carries no quarter context. v1.5 proved the ruler is fine (gap_ROT
0/3 → 14/20 at 4x N); the null channel is the substrate. This prereg applies regime pressure during
training (diet-only change, NO stack surgery — pinned 11 files untouched) and re-runs DET2 probes
verbatim. Either the carry learns to mark regime (HEALTHY in reach) or it cannot even under pressure
(substrate line dead — file, don't tune).

**Design:**
- Trunks: 20 FRESH regime trunks s0-19 (new ledger family
  `d-newai-self-u60-regime-s{seed}-800st.json` with P0 + stackHash; never overwrites canon).
  Recipe identical to W6/U33-canon (800st, B16/lr5e-3/K5/H48, C=6 pick-max auxW0.5 lam2.0 boot,
  init 73000+seed*7919+76*131, data 42000+seed*104729+55, masks 91000+seed) EXCEPT the row sampler:
  training rows are generated in 32 blocks of 400 rows (800 steps × B16 = 12,800 rows); per block j
  (block rng `62000+seed*1000+j`, disjoint from probe rngs) jittered boundaries bj =
  [100±U{0..20}, 200±U{0..20}, 300±U{0..20}] and rotating hot schedule HOT =
  [[0,1],[2,3],[0,1],[2,3]] per quarter (same geometry as DET2 probes). Row n in block: quarter q
  from bj; base row drawn by the EXACT W6 two-branch call
  (`ub ? inSeqGenShift(dataRng, 0) : inSeqGenShift(dataRng, null)`); then if dataRng.int(10) < 7,
  rejection-sample qk into HOT[q] (tries ≤ 50, else accept) — the 0.7/0.3 mixture matches probes
  (train-test matched); labels y/v as generated, NEVER relabeled in training. Pick-max C=6 by
  vote-disagree + all gradient terms verbatim from u32TrainOneStep. Deterministic per seed (twin-safe).
- Freeze + probe: DET2 v1.5 probe machinery verbatim on frozen regime trunks (4 cells × 80 streams,
  N=400, same operators, same per-trunk statistics).
**Bars (quorum 15/20; same DET2 operators/thresholds as v1.5 — 2SE, 0.25 fixed POWER, 0.5 ratio,
|r|<0.7; POWER trip 6+ trunks):**
- DET3-NONDEGEN / DET3-DISSOCIATE (4/5 subs) / DET3-INDEPEND / DET3-PIN: same definitions as DET2.
- REGIME-MANIP (guard, PIN-like): per trunk, carry quarter-variance qv on clean-rot streams
  (variance of quarter-mean carry across 4 probe quarters, averaged over streams) must exceed the
  canon-trunk qv band (computed from filed v1.5 clean-rot ledgers in Wave-0, same metric) on 15/20
  trunks. If the guard fails, pressure never installed — file MANIP-FAIL, do NOT interpret DET3 bars.
**Waves:** 0 (load-check + twin determinism of regime sampler + reuse-N/A (fresh trunks) + canon-band
qv computation + dry-run + timing/projection, COMPLETE-gated); 1 (20 regime trains COMPLETE-gated);
2 (6400 probes + verdict).
**Verdicts:** DET3-HEALTHY (NONDEGEN + DISSOCIATE 4/5 at quorum + INDEPEND + MANIP guard => regime
pressure installs carry marking; licenses E-NE1 consumers); DET3-ENTANGLED (fires but no dissociation
=> single-scalar stands); DET3-COLLAPSED (precise nulls with MANIP passing => carry cannot mark
regime even under pressure — substrate line dead); UNDERPOWERED (same fixed-tolerance rule);
MANIP-FAIL / PIN-FAIL guards.
**Filed expectation (not a bar):** qv elevated on 15+/20; spike_ROT significant-positive with STAT
silence (the v1.5-inverted pattern: canon failed exactly here). Expectation guides reading, never gating.
**Falsifiers:** hot-schedule variants ([0,1]-only, shuffled quarters) need their own preregs; threshold
changes after Wave 0 need a new version + battery + countersign.
