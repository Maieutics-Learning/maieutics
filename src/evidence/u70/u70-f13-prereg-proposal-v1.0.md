# U70-F13 prereg PROPOSAL v1.0 (NOT licensed — needs battery + re-close + fresh countersign)

Track: U70-CTX repair #3 (required order item 4: independent train/test trajectories + weight + config hashes). Base: F12-exact (F11 forward-exact one-hot + pure-shuffle read + T1-T4, F12 valid ECE/MCE/bins/traces + E1-E4, F4-exact elsewhere: forcing Wc<-z-onehot train+eval, ctxw 3.0, floor 0.05, repw 0.1, GRU64/Cat4-ST, BPTT-50 carry-over, clip 1.0, 1 restart init 90000+s, 200 epochs, Adam FLAT 3e-4, argmax eval). Verified against the current tree 2026-11-27 (neural train/eval same path+obs per seed, u70-neural.js:778/794-800; seeds 0..19 everywhere, U70N_SEEDS 0..19; held-out seeds 20..39 never used as paths in any filed wave).

## Diagnosis (verified in-tree, see `latest-review-reconciliation-2026-11-27.md` C4)

1. **Train/eval share trajectories.** `runU70Neural` generates one path+obs per seed (u70-neural.js:778) and uses it for all 200 epochs AND all evals (:794-800). Every filed neural verdict (Wave 1 through F12) is therefore training-trajectory performance; generalization is untested.
2. **No weight/config provenance.** Filed ledgers carry no weight hash or config hash, so a future auditor cannot verify which weights produced which row or that two rows came from the same code.
3. **Held-out replication was gated, correctly unrun.** Base prereg v1.0/v1.1 line 7 reserves seeds 20..39 for a held-out replication if PROCEED, which never fired — correctly unrun, still owed before any generalization claim. F13 spends that reservation now (PROCEED never fired, but C4 makes held-out the most pressing owed test; this spends the reserved seeds, it does not claim PROCEED).

Out of scope for F13 (separate owed tracks, unchanged): z_{t-1} recurrence wiring, unfamiliar-context probe, causal ablations, calibration bar (valid ECE_h reported descriptively; no bar set here), sharpened F3, GRU-128, trace study, Phase-2.

## Change (one track: eval trajectories change, training identical)

- **(a) Paired held-out eval:** train F12-exact on seeds 0..19 (same inits 90000+s, same streams/draws/path+obs as filed F12). Freeze weights. Eval each trained model TWICE: (i) train-trajectory eval (same path+obs, F12-exact — replication sanity, expect bit-identical to filed F12 per determinism note); (ii) held-out eval on paired fresh path+obs seed 20+s (never trained, never evaled in any filed wave). All metrics computed identically on both evals: ctxAcc, z-only probe, actionAcc/cueActAcc/shuffledAcc + gap, valid ECE/MCE/bins/traces (F12 retention), delays/FA where defined. N=20 paired units (seed is the unit; no pooling across seeds for gates).
- **(b) Provenance:** every ledger row carries `weightHash` (deterministic hash over all Float64 params, hex, recomputable from saved weights) + `configHash` (hash over the frozen spec string: variants/epochs/LR/clip/window/floor/ctxw/initBase/seed mapping). Smoke verifies determinism: retrain s0 → same hashes (filed precedent F5-k0 maxDiff 0.0000, F10 0/1080).
- **(c) Unit tests** (run pre-smoke, must all pass or HALT; filed beside the driver):
  T5 disjointness: train seed set {0..19} ∩ eval seed set {20..39} = ∅; every wave row's evalSeed == trainSeed+20; no path/obs object reused across the boundary (reference check).
  T6 hash presence + determinism: every row parses with 64-hex weightHash + 64-hex configHash; s0 retrain reproduces both exactly.
  E4 retention integrity (F12 verbatim): every held-out row parses with 10 bins summing to T exactly, calTrace length T, meanConf in [0,1].
- Determinism note (filed fact, not a claim): hand-rolled CPU Float64 JS, mulberry32 streams, no GPU/cuDNN. Same-seed retrains bit-identical by filed precedent. Paired F13-train-vs-F12 deltas are therefore an exact replication sanity read (expect 0).

## Design

- Phase A (reads-only, same countersign, runs first): oracle recompute on held-out seeds 20..39 (same filter as filed oracle, deterministic). Establishes the held-out ceiling; filed oracle seeds 0..19 stay as measured-as-run. HALT if oracle recompute non-deterministic.
- Smoke (locked, bugs-only): 1 seed (s0 train → eval s0 + eval s20): T5+T6+E4 pass logged, loss finite, held-out metrics present. Filed, no tweaks.
- Wave: 20 train seeds (F12-exact) + 20 paired held-out evals + 20 train evals (replication sanity). N=20. Exclusions/stopping/firewall: F4 v1.1 verbatim (Adam/clip unchanged, INVALID on non-finite, no selection, 1 restart). No sweep, no retune.
- Driver change (post-battery, pre-countersign): held-out eval path (train s → eval 20+s) + weight/config hash logging + T5/T6 block. Nothing else (no LR/rescale/reward — second variables stay out).

## Outcomes

- FIREWALL: this wave does NOT move any filed verdict and does NOT claim PROCEED. Train-eval replication sanity is reported (expect 0 delta); verdict weight comes ONLY from held-out absolute bars below. Valid ECE_h is descriptive (no calibration bar here). Paired train-minus-heldout gaps are descriptive (generalization cost read, not verdict-moving).
- Primary (held-out absolute bars, locked — mirrors F11 corrected bars on new trajectories):
  held-out probe pooled ≥ 0.70 AND held-out gap pooled > 0 (per-seed counts reported alongside, same convention as F4/F11) AND held-out ctxAcc pooled ≥ 0.85.
- Verdicts locked: F13-GENERALIZES (all three held-out bars met — filed wins survive new trajectories) / F13-DEGRADES (any held-out bar missed — training-trajectory wins do not generalize; subclass per causal diagram: collapse if probe fails with KL at floor, integration if ctx passes but gap fails, behavioral otherwise) / F13-BROKEN (any T/E-test fail, non-finite, retention absent, hashes absent/non-deterministic, or replication sanity delta ≠ 0 — the harness did not land). Near-miss does not apply (no threshold tuning). No Phase-2.
- Descriptive (no verdict weight): oracle held-out ceiling vs filed oracle (distribution shift read), per-seed train-minus-heldout deltas + CI, valid-vs-filed ECE on held-out, weight/config hashes, epoch-loss (F11 field, kept).

## Reporting

Per-seed ledger (20 train-eval rows + 20 held-out rows + 20 oracle held-out rows) with calBins/calTrace/mce/meanConf + T5/T6/E4 logs + smoke artifacts + configs + hashes, verdict. Whatever the verdict, F13 spends the reserved seeds 20..39 openly (no second held-out left in the base reservation — any further generalization claim needs a new reservation with justification).
