# Phase 1.d.ix meta-probe prereg v1.5 FROZEN COUNTERSIGNED 2026-11-14 ("freeze ix" — NO RUNS YET; v1.4 battery closed + two user-approved executability amendments; changeable only by new version + re-review)

## Objective
Test whether whole brains are legible: a probe reading a brain's full final
weight vector predicts per-line correctness + confidence on HELD-OUT brains.
Mind-reading memorizers (313-like) from thinkers (316-like). The user's volume
bet ("too many numbers to memorize") is tested the only honest way: the probe may
memorize train brains freely; the verdict uses held-out brains exclusively.

## Population (frozen on countersign)
- Arm: instdrop ONLY (rationale: max within-arm fate variance under identical
  protocol — s313 killHd 140/200 vs s318 192/200 — so fate may be legible in
  weights). No arm-mixing (arm would be a trivial cheat feature).
- Seeds: fresh block 5001–5096. Driver asserts zero overlap with every filed
  seed list (311–318, 7, 33/41/42, 7008, 901–918, 4242, MC/diagnostic seeds)
  before the first retrain — HALT on collision, then shift block +1000 and
  re-assert (fallback documented if used).
- Staged: pilot 24 brains (16 probe-train / 8 probe-test) → full 96
  (64 probe-train / 32 probe-test) ONLY if pilot passes. Train/test seed sets
  FILED in the driver; driver asserts test seeds never enter any weight update
  (split enforced by construction, not by discipline).
- New artifact requirement: save INIT + final blobs per brain. Retrain = exact
  1.b instdrop recipe with ONE declared deviation: tutor PINNED to the single
  filed blob scratch/p1a-t0-316.json for every student (pilot and full —
  the teacher is a constant, not a variable). Rationale: tutor of the
  fully-igniting student (s316, killHd 200/200), itself gated 1.00/0.88; 1.b
  paired tutor-seed = student-seed, but no tutor blobs exist for fresh seeds
  and no tutor-minting code survives, so per-seed pairing is unexecutable.
  Fixing the teacher is the cleaner science: all fate variance comes from
  student init + data order only — exactly what the probe tries to read.
  Driver asserts the blob loads and gates 1.00/0.88 before the first retrain.
  Fresh seeds have no filed ev, so no replication gate;
  instead determinism spot-check (seed 5001 retrained twice → bit-exact) +
  per-brain guardrail killA == 1.00 (instdrop filed pattern) or the brain is
  dropped with documentation.

## Probe (primary: mind-reading — frozen architecture)
- Input per point: RAW final weight vector (NO per-brain statistics of any kind —
  no z-scoring, no norms; round-1 leak objection killed structurally) + killHd
  line ints scaled /8.
- Output two heads: P(correct) + predicted loudness. Loss = BCE + 1.0×MSE
  (weights filed; loudness head explicitly auxiliary — no bar reads it).
- Architecture (FROZEN — pilot→full identical; any change = new version +
  re-review): MLP, 1 hidden layer × 64, ReLU, weight decay 1e-4, 30 epochs,
  5 seeded inits, MEDIAN held-out AUC reported with range across the 5
  (round-2 lucky-seed objection answered). COST CORRECTION (pre-freeze
  measurement, user-approved amendment — the v1.4 "probe training is minutes"
  claim was wrong by ~50x): ~10 ms/point-forward measured in-worker at
  128-hidden → slimmed 64-hidden/30-epoch pilot probe ≈ 2 h compute
  (5 seeds × 3200 pts × 30 epochs, fwd+bwd ≈ 3× fwd), epoch-checkpointed,
  resume-safe. Full-stage probe (≈12.8k pts) re-estimated from measured pilot
  timings at gate time (≈8 h at current rate — filed here so the gate sees
  the real number). Probe compute is real compute; the brains were never
  the only cost.
- Train points: train brains × 200 killHd lines (12.8k pilot / 64×200 full).
  Train AUC ≈ 1.00 is EXPECTED (memorization admitted upfront — the user's bet
  is about held-out, not train).
- Doubt score for bars: 1 − P(correct), pooled AUC with ties averaged (same
  statistic as v–vii). WIN-RATE (secondary instrument promoted — kills the
  identity-mapping cheat: a fingerprint→brain-mean lookup scores within-brain
  0.5 and dies here): fraction of held-out brains where probe doubt AUC beats
  own-brain loudness AUC on that brain's 200 lines.

## Probe (secondary: fortune-telling — EXPLORATORY DIAGNOSTIC, no kill power)
- Input INIT weights → predict brain's killHd accuracy (regression). SAME frozen
  architecture (input swaps final→init, single output head; no tuning on
  held-out, ever). Reported
  with rank-correlation on held-out brains. U-arm precedent: reported beside
  the verdict, never enters bars, never rescues a fail. Tests born-vs-made.
- GATE FIREWALL (round-3 hole, real): the pilot→full gate reads ONLY the
  primary bars + variance guardrail + determinism check. The secondary is
  computed and reported ONLY alongside final verdicts — never consulted at any
  gate, never used to sanity-check or inform the primary pre-full.
- TEST-DISTRIBUTION DISCLOSURE (round-3): file killHd distributions across
  train/test brains post-hoc; a degenerate test set is noted as a caveat, the
  split is never re-cut (brain type is unknowable pre-training by construction).
  (Round-1 p-hacking charge rejected: single pre-registered correlation,
  reported regardless of outcome.)

## Staged bars
- Pilot (8 held-out brains, 1600 lines): (1) VARIANCE GUARDRAIL: killHd range
  across the 24 pilot brains ≥ 15 lines, else nothing to learn → HALT-redesign,
  no full; (2) SIGNAL BAR (two halves, both required): pooled held-out probe
  doubt AUC ≥ 0.60 AND within-brain win-rate ≥ 5/8 vs loudness (outlier-proof
  half: one 313-like brain cannot carry win-rate). GATE STRINGENCY
  (audit-answered): pooled≥0.60 on ~1600 lines (~300 errors, SE≈0.03) is ~3σ
  alone (chance p≈1e-3); win-rate≥5/8 alone is loose (chance 0.36) — joint
  chance passage ≈2e-4. The pooled half carries stringency, win-rate carries
  robustness. Thresholds frozen here, not tuned to reviewers; (3) determinism
  spot-check holds. Any miss → ix dies at pilot, no full.
- Full (32 held-out brains, 6400 lines): pooled probe doubt AUC beats loudness
  on identical lines by ≥ 0.01 (vii-symmetric) AND within-brain win-rate ≥ 2/3
  vs loudness AND beats the trivial baseline (constant predictor = mean killHd
  accuracy across probe-train brains, so its AUC comes purely from
  between-brain ranking) AND every brain killA perfect. Else the probe is parked as a scoped negative
  and loudness travels; ix closed.
- SHUFFLED-WEIGHTS NULL CONTROL (audit-adopted rival killer): at verdict time,
  re-run the TRAINED probe on within-brain-shuffled weight vectors (spatial
  structure destroyed, zero new brains, zero retraining). Teeth: if shuffled
  also beats loudness, the primary PASS demotes to a "global-stats proxy"
  scoped finding (travels to 1.e labeled as such — brain-quality filter, not
  legibility). If shuffled fails while intact passes, the rival (weight-norm
  leakage) is dead on the record.
- Secondary disclosure (no kill): P(correct) calibration, train-vs-held-out
  gap, per-brain AUC distribution (median + range).

## Doubt instruments (filed pre-run)
- Expectation (mine, numeric): pilot held-out pooled 0.55–0.70 with train ≈
  1.00, win-rate ~50–65%; full similar. Above 0.80 pooled or above 75% win-rate
  would shock me (fate legible in weights — the user's bet paying off big);
  at chance confirms fingerprints-don't-travel.
- Pre-mortem: strongest objection = weight vectors are fingerprints, and
  fingerprints of 64 brains teach nothing about the 65th (train 1.00 /
  held-out chance split). Most likely failure = exactly that split.
- Nearest-failure: vii Laplace≈loudness (second-order machinery on the same
  substrate adds nothing — and the ablation proved it: pooled Spearman 0.9999);
  U-err sharpening (machinery that memorizes the symptom); committee
  shared-mode (one failure shape everywhere).
- W (kill): pilot pooled < 0.60 or win-rate < 5/8 → ix dies, no full; full
  pooled ≤ loudness or win-rate < 2/3 → probe parked, loudness travels,
  post-mortem owed against the four suspects above.

## Feeds, cost
- Feeds 1.e methods (probe outcome either way) + F-new.
- Cost: pilot ≈ 24 × 6 min ≈ 2.5 h brains + ≈ 2 h probe ≈ 4.5 h wall;
  full ≈ 96 × 6 min ≈ 10 h brains + ≈ 8 h probe ≈ 18 h across sessions.
  Resume-safe partials + probe epoch-checkpointing mandatory (60-min window
  discipline from vii). Pool 0.
- Determinism: every seed filed; probe inits seeded ×5; split fixed in driver;
  test-brain blobs never enter any weight update (asserted, not promised).
