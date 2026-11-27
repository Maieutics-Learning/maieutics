# U70-F12 prereg PROPOSAL v1.0 (NOT licensed — needs battery + re-close + fresh countersign)

Track: U70-CTX repair #2 (review-required order item 3: valid ECE + per-trial confidence
retention). Base: F11-corrected EXACT (forward-exact one-hot, pure-shuffle read, F4-exact
elsewhere: forcing Wc<-z-onehot train+eval, ctxw 3.0, floor 0.05, repw 0.1, GRU64/Cat4-ST,
BPTT-50 carry-over, clip 1.0, 1 restart init 90000+s, 200 epochs, Adam FLAT 3e-4, argmax
eval). Verified against the current tree 2026-11-27 (neural ECE u70-neural.js:596-598
`ece += n*|k/n - 0.95|`; oracle ECE u70-oracle.js:114-115 `|k/n - 1 + 0.05|` = same fixed
reference; standard rows log only aggregate `ece`, no confidences).

## Diagnosis (verified in-tree, see `latest-review-reconciliation-2026-11-27.md` C3)

1. **Both ECEs compare bin accuracy against fixed 0.95, not bin confidence.** Standard
   expected calibration error is sum_b (n_b/N)·|acc_b − conf_b| over equal-width confidence
   bins. As-run, neither quantity is calibration: G1's `ECE<=0.12` gate is uninterpretable
   as calibration, and every filed `ece` value (oracle 0.0614 pooled; neural per-seed `ece`
   fields) is a fixed-reference deviation score, not ECE.
2. **Per-trial confidences are not retained.** Standard rows log only the aggregate `ece`;
   `pTrueTrace`/trace modes exist in-memory but are not ledgered, so filed ledgers cannot be
   recomputed into valid ECE — a re-eval (reads-only for oracle; retrain for neural, since
   weights are not saved) is owed before any calibration claim is cited again.
3. Context-accuracy lanes are untouched by this repair (guess/accuracy path unchanged).

Out of scope for F12 (separate owed tracks, unchanged): held-out trajectories, z_{t-1}
recurrence wiring, unfamiliar-context probe, causal ablations. F12 changes ONLY the ECE
computation + retention below; training, eval decisions, and all other metrics stay
F11-exact so the wave isolates the calibration read.

## Change (coupled edits, one track)

- **(a) Valid ECE (both drivers):** 10 equal-width bins on max-prob confidence
  `conf = max(pc)` (neural) / `max(pC)` (oracle); per bin record (n, acc, mean-conf);
  `ECE = sum_b (n_b/N)·|acc_b − conf_b|`; additionally report MCE = max_b |acc_b − conf_b|,
  mean confidence, and the full 10-bin table per seed. The old fixed-0.95 field is REMOVED
  from new ledgers (not kept alongside — two fields named `ece` with different meanings is
  how the next audit fails); filed ledgers keep their values as measured-as-run with the
  fixed-reference gloss.
- **(b) Retention:** every ledger row carries `calBins` (10×[n, acc, meanConf]), `mce`,
  `meanConf`, and N; neural rows additionally carry epoch-loss (F11 field, kept). No
  per-trial 300-float trace in the default ledger (bins are sufficient for ECE/MCE/diagram;
  full `pTrueTrace` only in smoke artifacts to bound ledger size).
- **(c) Unit tests** (run pre-smoke, must all pass or HALT; filed beside the driver):
  E1 zero-on-perfect: synthetic bins with acc==conf in every non-empty bin → ECE==0, MCE==0.
  E2 fixed-reference detector: synthetic all-correct-at-conf-0.6 bins → valid ECE==0.4 while
  the OLD formula reports |1−0.95|==0.05 — proves the new code is not the old metric.
  E3 oracle determinism: recomputed oracle valid-ECE pooled equals a direct second run to
  4 decimals. E4 retention presence: every wave row parses with 10 bins summing to T and
  meanConf in [0,1].

## Design

- Phase A (reads-only, same countersign, runs first): oracle driver edit (a) + E1–E3, recompute
  oracle identifiability (same 20 seeds, exact filter — no training, deterministic). Filed
  oracle `ece` 0.0614 stays as measured-as-run; the new valid-oracle-ECE is the number future
  calibration bars are set from. HALT if E1–E3 fail.
- Smoke (locked, bugs-only): 1 seed (s0) neural F11-exact + (a)+(b): E4 pass logged, loss
  finite, valid ECE + bins present. Filed, no tweaks.
- Wave: retrain F11-exact + (a)+(b) on the SAME 20 seeds (same inits 90000+s, same
  streams/draws). N=20. Exclusions/stopping/firewall: F4 v1.1 verbatim (Adam/clip unchanged,
  INVALID on non-finite, no selection, 1 restart). No sweep, no retune.
- Driver change (post-battery, pre-countersign): ECE formula swap in both drivers + retention
  fields + E1–E4 block. Nothing else (no LR/rescale/reward — second variables stay out).

## Outcomes (no calibration bar in this wave — descriptive by design)

- FIREWALL: this wave does NOT pass/fail calibration and does NOT retroactively move any
  filed verdict. Valid ECE/MCE/bins are reported; the G1 `ECE<=0.12` gate stays
  uninterpretable for filed waves. A future wave may propose a new calibration bar FROM the
  recomputed oracle valid ECE — that bar is not set here.
- Primary (implementation, locked): E1–E4 pass + oracle valid ECE recomputed + 20/20 neural
  rows valid with retention present and bins summing to T.
- Verdicts locked: F12-VERIFIED (primary met — calibration is now measurable; no claim about
  being calibrated) / F12-BROKEN (any E-test fail, non-finite, retention absent, or bins not
  summing — the repair did not land). Near-miss does not apply (no threshold). No Phase-2.
- Descriptive (no verdict weight): valid ECE pooled/per-seed (neural + oracle), MCE,
  reliability-bin tables, valid-vs-filed-fixed-reference delta per seed (shows what the old
  number meant), paired F12-vs-F11 accuracy/probe/gap deltas (training identical except ECE
  logging — expect ~0; reported as sanity, not evidence).

## Reporting

Per-seed ledger (20 neural rows + 20 oracle rows) with `calBins`/`mce`/`meanConf` + E1–E4 logs
+ smoke artifacts (with `pTrueTrace`) + configs + hashes, verdict. Whatever the verdict, F12
re-labels every filed `ece` in one place (fixed-reference deviation, not calibration) without
rewriting history.
