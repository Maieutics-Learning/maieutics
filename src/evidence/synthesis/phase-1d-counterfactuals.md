# Counterfactual note (QUARANTINED — frozen vii verdicts stand regardless; answers "would it have saved us?")

## Provenance
User asked for retrospective iterations on recently closed items without
touching frozen verdicts. Format-10 fresh-eyes debate (sealed red+steel, one
rebuttal each, owner-adjudicated) amended the plan before running: (G) kept as
mechanism check with expectation of convergence (red: "hunting +0.01 in a dead
signal" — accepted as reframe, not block); (D) expanded from single 3-step to
{1,3}-step dose-response completing filed {10,50} curve (red's "blind search"
accepted as improvement); (ablation) adopted zero-compute ledger analysis of
the "loudness proxy" charge. Raw debate not filed (verbal round); amendments
and adjudication here.

## Arm G: extended λ grid on s313 (ledger `scratch/counter.json`)
| λ | valNLL | lapAUC |
|---|---|---|
| 1e-3 | 1.281733 | 0.934461 |
| 1e-2 | 1.081514 | 0.931863 |
| 1e-1 | 0.640073 | 0.924755 |
| 1 | 0.152375 | 0.910479 |
| 10 | 0.013340 | 0.898303 |
| 100 | 0.001981 | 0.891618 |
| 1e3 | 0.001245 | 0.891618 |
| 1e4 | 0.001179 | 0.891520 |
| 1e5 | 0.001173 | 0.891520 (= loudness) |
- valNLL strictly decreasing across the whole extended grid; AUC converges to
  loudness from above. The grid edge hid NO selectable win: the only higher-AUC
  points (loose end) are ones the frozen selector must reject (valNLL 1.28 ≈
  near-chance confidence), and they are s313-only. Observation filed (not a
  claim): ranking-vs-calibration dissociation — loose posteriors rank, tight
  ones calibrate.
- WOULD IT HAVE SAVED US: no. Frozen FULL-FAIL stands; mechanism suspect (a)
  (Gaussian re-describes a bad peak) strengthened — the posterior wants to be
  the MAP all the way down.

## Arm D: correction dose-response on s313 (killA / killHd / killHd-loudAUC)
- 1-step: killA 184/200 (ALREADY BROKEN), killHd 160/200, loudAUC 0.800.
- 3-step: killA 155/200, killHd 151/200, loudAUC 0.925.
- Filed: 10-step killA 82/200; 50-step pattern (usually breaks killA).
- WOULD IT HAVE SAVED US: no. No safe dose exists in {1,3,10,50} — a SINGLE
  correction step damages the easy exam (200→184). The "gentler correction"
  hope is dead on s313; the methods bound ("just fine-tune the errors is not a
  fix") hardens from 10 steps down to 1.

## Ledger ablation: is Laplace just a loudness proxy? (zero compute, filed `scratch/vii-full.json`)
- Pooled doubt-score Spearman Laplace-vs-loudness: 0.9999 (Pearson 0.9988,
  n=3200). Near-perfect rank preservation — the proxy charge CONFIRMED from
  filed data alone (as theory predicts: tiny-variance probit ≈ monotone map).
- Where they disagree most (top decile |lap−loud|), Laplace is usually WORSE:
  s313 0.258, 314 0.436, 315 0.325 (311 0.975 on 1 error; 312 0.615; 317 0.851).
  The residual carries no independent signal — where Laplace differs from
  loudness it is anti-informative. Suspect (a) confirmed a third way.

## Bottom line
Neither retrospective saves anything; both harden the filed verdicts.
vii stays FULL-FAIL (loudness travels), U-bound hardens to "1 step breaks it",
and the proxy ablation is now a number (Spearman 0.9999), not an argument.
