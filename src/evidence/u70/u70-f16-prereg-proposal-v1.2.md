# U70-F16 prereg PROPOSAL v1.2 (NOT licensed — needs battery + re-close + fresh countersign)


> v1.1 patch (battery 6 STANDS / 4 NEEDS-PATCH, 3 gloss groups, no bar/design/compute change): (1) verdict-before-interaction ordering; (2) unfamiliar-math gloss (seeds = disjointness, unfamiliarity = generator params); (3) procedure-identity init logging (fan/scale/first-draw, NOT bit-identical). See `fresh-eyes-u70-f16-v1-results.md`.


> v1.2 micro-patch (re-close 2/2 split: re1/re3 STANDS; re2 symext rejected with derivation; re4 3-point hardening adopted as checkable assertions, no design/bar/compute change).

Track: U70-CTX repair #6 (composition — separate attribution + folded emergence catch).
Base: F14-exact (= F12-exact training hyperparams + F14 TRUE-intervention eval: F11 forward-exact
one-hot + F12 valid ECE/MCE/bins/traces + E1-E4, F4-exact elsewhere: forcing Wc<-z-onehot
train+eval, ctxw 3.0, floor 0.05, repw 0.1, GRU64/Cat4-ST, BPTT-50 carry-over, clip 1.0, 1 restart
init 90000+s, sampling 91000+s, 200 epochs, Adam FLAT 3e-4, argmax eval, TRUE shuffle =
`u70nApplyShuffle` meaning on the metric path T7/T8/T8b-gated). Verified against the current
tree 2026-11-28 (`u70-neural.js` Step `u70nStep:124-176`, eval `u70nEval:743-771`, F14 tests
`u70nF14Tests:597-653`, F15 pool `u70nF15Pool:655-741`).

## Diagnosis (verified in-tree)

1. **Fixes are queued but never composed.** z-recurrence (C5), GRU-128, unfamiliar-context,
ablations, calibration/trace reporting are each owed and each isolated in prior closeouts —
but emergence (synergy or interference) only shows in combination. Testing only-separate misses
stray behaviors; testing only-combined destroys attribution.
2. **What stands.** F14 TRAIN-REPAIRED + HELDOUT-DEGRADES and F15 TRAIN-REGRESSED +
HELDOUT-DEGRADES with-thinning stand as measured-as-run on the TRUE metric. Forward repair,
TRUE-is-metric-path, valid ECE, held-out+hashes, pool schedule+step-count all verified landed.
Nothing here re-litigates them.
3. **Why this shape.** Four training arms (anchor + 2 separates + 1 folded) preserve one-change
attribution while the folded arm catches interactions at identical steps. Eval-only extras run on
frozen anchor + folded weights only (no retrain, weight-hash proof) so training vs eval effects
stay separable and compute stays ~F15-scale (~480 neural rows + 20 oracle rows).

Out of scope for F16 (separately owed, unchanged; v1.1 G2/G3 glosses add no arms/bars): F15 exposure rivals (25-epoch control,
block-vs-interleave, shuffled-order), sharpened F3, Phase-2 novelty-transfer, LR/scale (beyond
H128)/optimizer/curriculum sweeps. F16 changes ONLY the pre-registered flags below; eval core is
F14-exact.

## Change (pre-registered flags — training)

- **A0 anchor (replication):** F14-exact, 20 seeds 0..19, 200 epochs same-pair, init 90000+s.
Config spec MUST equal `u70nF14ConfigSpec()` verbatim (T10a). Expectation: reproduces F14
TRAIN/HELD numbers up to bit-identity (filed CPU Float64 precedent: F12 bit-identical, F14
0 mismatches). Non-identity -> BROKEN (harness moved the base).
- **A1 z-recurrence alone (ONE change):** GRU input becomes `[x (D=7) + z_prev one-hot (Z=4)]`.
`Wz/Wr/Wh` widen to `D+Z` inputs only; all other shapes/losses/heads unchanged. `z_prev` at t=0
is the zero vector (filed boundary); during training `z_prev` is the SAMPLED one-hot (91000+s
stream, call order unchanged); during eval `z_prev` is the argmax one-hot (frozen, no learning).
Inits: same RNG (90000+s) continuing into the widened columns, same `sqrt(1/fan)` scale. Hidden
reset per epoch unchanged; no cycle-index input. Hidden size stays 64.
- **A2 GRU-128 alone (ONE change):** `U70N_H` 64->128 for this arm only; all weight shapes regrow
from the same initBase 90000+s (fresh draws, same scale formula — NOT same births, disclosed;
capacity ruling-out requires regrowth). Everything else (flags, schedule, steps, eval) identical.
- **B-COMB folded (TWO changes, no more):** A1 + A2 together (z-recurrence wiring on GRU-128).
Init 1.0 (quieter x0.5 stays a queued rival, NOT folded — avoids 3-way confound, disclosed).
Same 200 epochs / 1200 chunk passes / flat LR / clip / BPTT-50 / inits 90000+s as every other
training arm. This arm catches stray emergence: synergy (combined fixes what neither separate
fixes) or interference (combined breaks what separates keep).
- **Unit tests T10 (NEW, pre-smoke HALT):** T10a flag isolation (code grep: A0 path contains no
ZREC/H128; A1 contains ZREC only; A2 contains H128 only; B contains both; config specs pairwise
distinct except A0==F14; weight hashes distinct across H sizes); T10b step-count (logged optimizer
steps == 200 AND chunk passes == 1200 for EVERY training seed/arm — mismatch -> BROKEN); T10c
determinism (per-arm 1-epoch double, same-order identical hashes — filed CPU precedent; order
invariance NOT required); T10d unfamiliar disjointness (U(s)=2000+s disjoint from 0..39 and
1000..1159, mapping exact, object isolation); T10e ablation read-only (weight hash identical
before/after z-zero + h-cut evals on same model); T10f retention (every eval row bins sum T,
trace length T). Fail = HALT. T1-T4/T7/T8/T8b/E1-E4/T5/T5a/T6/E4h retained verbatim (core eval
unchanged).

## Design (eval — core F14-exact + bounded extras)

- Smoke (locked, bugs-only): s0 per training arm (A0/A1/A2/B): T1-T4 + T7/T8/T8b + T10a-f pass
logged, step-count check, loss finite, core 4 evals present (train-clean + train-TRUE +
held-s20 clean + held-s20 TRUE) with valid retention. Unfamiliar + ablations smoke on A0-s0
only (6 extra evals present, hashes stable). Filed, no tweaks.
- Wave training: 80 retrains (4 arms x 20 seeds 0..19), FIXED 200 epochs, same Adam/BPTT/clip/
sampling as F14. N=20 per arm. No sweep, no convergence loop.
- Wave eval core (ALL training arms, F14-exact): per seed 4 evals (train-clean, train-TRUE,
held-clean s+20 F13 mapping, held-TRUE) with F12 valid ECE/MCE/bins/traces + hashes + E4
retention. Oracle held ceiling reused (`d-u70-oracle-f13.json`, no recompute).
- Wave eval extras (A0 + B-COMB ONLY, frozen weights, read-only): per seed (i) unfamiliar-clean
U(s)=2000+s with dwell-12 timing distribution (pre-registered: T=300, dwell 12, psw 0.05,
prho 0.06, pay 0.8, rhoVals unchanged — timing-unfamiliar only, values familiar), (ii)
unfamiliar-TRUE, (iii) z-zero ablation (ctx-head z input zeroed, clean), (iv) h-cut ablation
(h=0 each step, feedforward-only, clean). Weight hash asserted identical pre/post extras (T10e).
Unfamiliar oracle: 20 fresh oracle rows on seeds 2000..2019, same unfamiliar distribution
(same generator parameters), filed as `d-u70-oracle-f16-unfam.json` — ceiling for unfamiliar
only, never mixed with held ceiling.
- Trace + calibration (reporting-only, NO bar): every eval row carries klMean + mean entropy +
calTrace (existing) ; unfamiliar + held valid-ECE tabled per arm (descriptive input to the future
calibration-bar proposal). No gate reads them.
- HALT table (exhaustive; v1.1 G1 ordering; v1.2 G4/T10e hardening): per-arm verdicts assigned BEFORE interaction table;  T1-T4/T7/T8/T8b/T10/E1-E4/T5/T5a/T6/E4 fail -> HALT pre-smoke;
step-count != 200/1200 any training seed -> BROKEN; A0 spec != F14 spec -> BROKEN; ablation
changes weight hash -> BROKEN; non-finite loss -> INVALID row, wave continues; retention/hash
fields absent -> BROKEN; anything else -> runs to completion, grades by locked verdicts below.
- F12-comparability note (descriptive): training surfaces differ by design, so cross-arm paired
deltas are DESCRIPTIVE (effect + capacity/wiring confound), never a gate. Verdict weight comes
ONLY from absolute bars below.

## Outcomes

- FIREWALL (standing): per-arm verdicts read ONLY the absolute bars below (F14 bars verbatim).
Cross-arm deltas, unfamiliar/ablation/calibration/trace tables, loss paths, and the
combined-vs-separates interaction readout are STRICTLY descriptive and can NEVER move a
separate arm's verdict. No variance gate, no extra arm, no bar move.
- Primary TRAIN per training arm (locked — F14 TRAIN bars on TRUE metric): detached probe >=
0.70 AND TRUE-shuffled gap >= 0.05 -> TRAIN-REPAIRED; probe pass + gap fail -> TRAIN-QUALIFIED;
else TRAIN-REGRESSED (F14 naming). A0 must REPAIRED (replication); A1/A2/B judged independently.
- Primary HELDOUT per training arm (locked — F14 triple on TRUE metric): held probe >= 0.70 AND
held TRUE-gap >= 0.05 AND held ctx >= 0.85 -> HELDOUT-GENERALIZES; else HELDOUT-DEGRADES.
Ceiling-shift qualifier reused from F13/F14 v1.1 (report filed train oracle vs F13 held oracle
delta; |ctx shift| > 0.05 appends `distribution-shift` — bars stand). Unfamiliar gets the same
triple shape computed against the UNFAMILIAR oracle, reported as UNFAM-GENERALIZES/DEGRADES
(descriptive companion, same bars, different ceiling — never mixed with held verdict).
- Interaction readout (DESCRIPTIVE, the emergence catch): folded-vs-separates table per seed
(B minus A1, B minus A2, B minus max(A1,A2)) + stray-emergence flag (combined fixes a grave
both separates miss = synergy; combined breaks what both separates keep = interference; else
additive). Flag is descriptive — it motivates the next prereg, never upgrades/downgrades a
separate verdict.
- Ablation readout (DESCRIPTIVE): z-zero vs clean and h-cut vs clean gaps on A0 + B (does use
live in h, z, or both; does folded move the locus). Trace/split readout descriptive (KL/entropy/
V4-gap vs graves; split-rate stays non-sensor per F10 unless the table says otherwise with CIs).

## Provenance

Driver change (post-battery, pre-countersign): composable flags (ZREC widen + H128 size switch +
U(s) unfamiliar generator params + z-zero/h-cut read-only branches + KL/entropy trace fields) +
T10 block + per-arm config specs. Nothing else (no LR/epochs/steps/optimizer/curriculum/ctxw/
floor/repw beyond the flagged arms, no retune).
