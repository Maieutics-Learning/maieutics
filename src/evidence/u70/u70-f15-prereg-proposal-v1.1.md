# U70-F15 prereg PROPOSAL v1.1 (NOT licensed — needs re-close + fresh countersign)

> v1.1 patch (battery 7 NEEDS-PATCH / 3 STANDS, 1 functional + 4 glosses, queued rivals filed):
> T9(d) step-count assertion 1200 chunk-updates/seed (r8) + glosses — hidden-reset kills
> cycle-index (r2), single-canonical TRAIN is a category error in F15 (r3/r5), determinism =
> same-order identical not permutation invariance (r7); queued rivals filed openly (25-epoch
> single-traj control, block-vs-interleave, shuffled-order — r1/r9/r10/r2/r7). No bar moves, no
> new arms. WITH-THINNING limitation kept.

Track: U70-CTX repair #5 (multi-trajectory training — single-trajectory root cause finally tested).
Base: F14-exact (= F12-exact training hyperparams + F14 TRUE-intervention eval: F11 forward-exact
one-hot + F12 valid ECE/MCE/bins/traces + E1-E4, F4-exact elsewhere: forcing Wc<-z-onehot train+eval,
ctxw 3.0, floor 0.05, repw 0.1, GRU64/Cat4-ST, BPTT-50 carry-over, clip 1.0, 1 restart init 90000+s,
sampling 91000+s, 200 epochs total, Adam FLAT 3e-4, argmax eval, TRUE shuffle = `u70nApplyShuffle`
meaning on the metric path T7/T8/T8b-gated). Verified against the current tree 2026-11-27
(u70-neural.js:926-927 single-trajectory pair, :937-938 200-epoch same-pair loop, :610-623 TRUE
branch, :392-408 helper pure; F14 closeout + `f14-analysis.json`).

## Diagnosis (verified in-tree)

1. **Every retrain trains on one road.** `runU70Neural` builds `path=u70nGenPath(s)` +
`obs=u70nGenObs(s,path)` ONCE per seed and loops 200 epochs on that same pair. F14 kept this
exactly (training F12-exact) and proved memorization: TRAIN TRUE probe 0.7183 / gap 0.1468 /
ctx 0.8783 vs HELD TRUE probe 0.6227 / gap 0.0274 FAIL / ctx 0.7777 (deltas exclude 0; leak-size
~0 both). The newest review and the F14 closeout converge: single-trajectory training is the
named root cause; multi-trajectory training is the agreed next priority.
2. **What stands.** F14 TRAIN-REPAIRED + HELDOUT-DEGRADES (collapse) stand as measured-as-run on
the TRUE metric. Forward repair, TRUE-is-metric-path, valid ECE, held-out+hashes all verified
landed. Nothing here re-litigates them.
3. **Why K=8 round-robin.** Total gradient steps stay IDENTICAL to F14 (200 epochs x 6 BPTT chunks
per seed = 1200 chunk-updates). Spreading 200 epochs over K trajectories gives 200/K exposures
each: K=20 -> 10 exposures (underfit-confound risk flagged in advance); K=4 -> 50 exposures
(weak diversity test). K=8 -> 25 exposures each is the filed compromise: diverse enough to break
single-path memorization, thick enough to learn. Disclosed openly as WITH-THINNING (same honesty
as F5 WITH-TAIL): a HELDOUT miss under thinning reads PERSISTS-with-thinning, never a mechanism
kill. No extra arm (owner "keep it simple" precedent from F5).

Out of scope for F15 (separately owed, unchanged): z_{t-1} recurrence wiring (C5), unfamiliar-context
probe, causal ablations, calibration bar, sharpened F3, GRU-128, trace study, Phase-2. F15 changes
ONLY the training distribution; eval is F14-exact.

## Change (ONE training-distribution edit — eval identical)

- **Training pool (NEW, pre-registered):** for model seed s in 0..19, P(s) = {1000 + s*8 + k |
k=0..7} (160 seeds total). All pool seeds distinct and disjoint from 0..39 (train-canonical +
held-out reservation) — asserted by new T9 below (code + ledger grep). No sampling at train time.
- **Schedule (NEW, deterministic):** epoch e in 0..199 uses trajectory P(s)[e mod 8]
(round-robin; epoch 0->k0 ... epoch 7->k7, epoch 8->k0, ...). Hidden state resets to zeros at
each epoch start (unchanged `u70nEpoch` behavior — the model receives NO cycle-index input, so
it cannot key on "position in the 8-cycle"; periodicity lives only in update order, gloss r2).
Adam m/v + weights persist across epochs (unchanged). Total chunk-updates per seed = 200*6 =
1200, identical to F14 — same compute, same LR schedule (flat), same BPTT-50, same clip, same
inits (90000+s), same sampling RNG (91000+s per model; per-trial sampling draws continue in call
order). Documented boundary: trajectories interleave at epoch granularity only (no within-epoch
mixing, no curriculum ordering beyond fixed round-robin, no convergence loop — FIXED 200 epochs).
- **Unit tests** (run pre-smoke, must all pass or HALT; F11 T1-T4 + F12 E1-E4 + F13 T5/T6/E4h +
F14 T7/T8/T8b retained verbatim EXCEPT T5/T5a updated for the new reservation):
  - T9 pool-disjointness + schedule + step-count (NEW, HALT GATE): (a) code grep: `1000 + s*8`
  formula present, no `u70nGenPath(s)`/`u70nGenObs(s` single-pair call remains on the training
  path; (b) ledger grep over all 20x200 epoch-training records (logged pool index per epoch):
  every epoch's pool seed in P(s), 160 pool seeds pairwise distinct, zero overlap with 0..39;
  (c) schedule check: logged pool indices for epochs 0..15 equal [0,1,2,3,4,5,6,7,0,1,2,3,4,5,6,7]
  for every seed; (d) step-count (r8 adoption, re1 hardening): logged optimizer steps per seed == 200
  (one Adam step per epoch, grads accumulated across chunks) AND chunk forward/backward passes per
  seed == 1200 (200x6) — both must match F14 exactly; mismatch -> BROKEN. Determinism gloss (r7): same-order rerun bit-identical is the claim (filed
  CPU Float64 precedent); different-order invariance is NOT required (Adam is order-dependent).
  Fail = HALT.
  - T5 updated (disjointness): training pool P(s) disjoint from held-out s+20 for all s; held-out
  path is `u70nGenPath(s+20)` (same F13 mapping). T5a updated (freshness): code+ledger grep asserts
  no path seeds appear outside {P(s) for all s} U {20..39 held-out}; canonical 0..19 MUST NOT appear
  as training paths in F15 (they are F14's roads, not F15's — single-canonical TRAIN would be OOD
  for F15 by construction, gloss r3/r5). T6/E4h retained (hashes + retention on every eval row).
  T1-T4/T7/T8/T8b/E1-E4 retained verbatim (eval unchanged).
- **Driver change (post-battery, pre-countersign):** training-loop edit (pool build + e-mod-8
schedule + per-epoch pool-index logging) + T9 block + T5/T5a reservation update. Nothing else (no
LR/epochs/steps/scale/recurrence/shuffle-semantics beyond the training pool, no retune).

## Design

- Smoke (locked, bugs-only): 1 seed (s0, 8-pool schedule): T1-T4 + T7/T8/T8b + T5/T5a(new)/T6/E4
pass logged, pool-index log 0..15 checks, step-count 1200 check, loss finite, all 18 evals present
(8 pool-clean + 8 pool-TRUE + held-s20 clean + held-s20 TRUE) with valid retention. Filed, no tweaks.
- Wave: retrain on the 20 pool-sets P(0)..P(19) (same inits 90000+s, same Adam/BPTT/clip/sampling
as F14). N=20 models. Then eval each trained model 18 ways (all with F12 valid ECE/MCE/bins/traces
retention): (i-viii) pool-clean on each of the 8 P(s) trajectories, (ix-xvi) pool-TRUE-shuffled on
each of the 8, (xvii) heldout-clean (paired fresh s+20, F13 mapping), (xviii) heldout-TRUE-shuffled.
Per-seed TRAIN-pool metrics = mean over the 8 pool trajectories (clean and TRUE separately;
pool-min/max filed alongside, min descriptive); per-seed HELDOUT metrics = single s+20 eval
(F14-exact). Oracle Phase-A NOT rerun (reuse filed F13 held-out ceiling: ctx 0.9537 / ECE 0.0237 /
MCE 0.2352 / oAct-cue +0.237, cite `d-u70-oracle-f13.json`). Exclusions/stopping/firewall: F4 v1.1
verbatim (Adam/clip unchanged, INVALID on non-finite, no selection, 1 restart). Training FIXED 200
epochs total — no convergence loop. No sweep.
- HALT table (exhaustive, no silent judgment): T1-T4/T7/T8/T8b/T5(new)/T5a(new)/T6/E4 fail -> HALT
pre-smoke; pool-index log absent/mismatch or step-count != 200-optimizer/1200-chunk -> BROKEN; non-finite loss ->
INVALID row, wave continues; retention/hash fields absent -> BROKEN; anything else -> runs to
completion, grades by locked verdicts below. NO F12-bit-identical replication sanity (training
moved by design — expect non-zero; determinism is proven instead by T9 schedule + same-engine
rerun of s0 epochs 0..1 bit-identical, logged in smoke).
- F12-comparability note (descriptive, no verdict weight): F14-vs-F15 training surfaces differ, so
paired per-seed F15-minus-F14 deltas are DESCRIPTIVE (distribution effect + thinning confound),
never a gate. Verdict weight comes ONLY from absolute bars below.

## Outcomes

- FIREWALL (standing): verdicts read ONLY the absolute bars below (pool-mean TRAIN + single-seed
HELDOUT, both on the TRUE metric). Paired F15-minus-F14 deltas, pool-spread (min/max across the 8),
loss paths, and thinning diagnostics are STRICTLY descriptive and can NEVER move a verdict. No
permutation gate, no variance gate, no extra arm.
- Primary TRAIN-pool (locked — F14 bars on pool-mean TRUE metric): pool-mean detached probe >=
0.70 AND pool-mean TRUE-shuffled gap >= 0.05 (per-seed pool-means + per-seed pool-min alongside,
F4/F11 convention; pool-min descriptive).
- Primary HELD-OUT (locked — F14 triple on TRUE metric, same fresh trajectories): held-out probe
pooled >= 0.70 AND held-out TRUE-shuffled gap pooled >= 0.05 AND held-out ctxAcc pooled >= 0.85
(F13 triple, now under multi-trajectory training). Ceiling-shift qualifier reused from F13/F14 v1.1
(report filed train oracle vs F13 held-out oracle delta; |ctx shift| > 0.05 appends
`distribution-shift` qualifier — bars stand).
- Thinning read (DESCRIPTIVE, the filed limitation): per-seed pool-min vs pool-mean spread + epochs-
per-trajectory (25) filed alongside; a HELDOUT miss with collapsed pool-min reads as
PERSISTS-with-thinning (under-exposure rival NOT excluded), never a mechanism kill.
- Verdicts locked (two independent verdicts, no matrix smuggling):
  - TRAIN-pool: F15-TRAIN-REPAIRED (both pool-mean TRUE bars met — multi-trajectory training
  preserves the read on seen roads) / F15-TRAIN-QUALIFIED (probe passes AND gap fails) /
  F15-TRAIN-REGRESSED (probe fail — thinning or capacity, subclass filed descriptively).
  - HELD-OUT: F15-HELDOUT-GENERALIZES (all three TRUE bars met — distribution fixes the collapse) /
  F15-HELDOUT-DEGRADES (any missed — subclass per causal diagram + thinning flag: collapse if probe
  fails with KL at floor, integration if ctx passes but gap fails, behavioral otherwise; append
  `-with-thinning` when pool-min also fails) / F15-BROKEN (any T/E fail, non-finite, retention/hash
  absent, schedule/step-count mismatch).
  Near-miss does not move. No Phase-2 in this wave.
- Gap-bar derivation (F13 gloss carried): cue-following scores gap ~= 0, so GENERALIZES/REPAIRED
cannot be met by global bias.

## Adjudicated glosses (r2/r3/r5/r7/r8 — meaning only, no design change beyond T9(d))

- Cycle-index (r2): hidden resets each epoch start kill the slot-memory rival; round-robin stays
for determinism/simplicity (random perm would add RNG).
- Single-canonical (r3/r5): F14's road is not F15's road; pool-mean is the TRAIN quantity by
construction, pool-min alongside stops mean-hiding.
- Bar direction (r4): new-surface variance reported via pool spread; bars stay F14 verbatim
(tuning-to-reviewers refused, F14-r4 precedent).
- Determinism (r7): same-order identical is the claim; permutation invariance is unsatisfiable
and not required.
- Step-count (r8): 1200 chunk-updates/seed asserted in T9(d).
- Queued rivals (r1/r9/r10/r2/r7): 25-epoch single-traj control, block-vs-interleave (8x25
sequential), shuffled-order — all queued tracks, not this wave.

## Reporting

Per-seed ledger (20 x 18 eval rows + 20x200 pool-index logs + step-counts) with
calBins/calTrace/mce/meanConf + T1-T4/T7/T8/T8b + T5(new)/T5a(new)/T6/E4 logs + smoke artifacts +
configs + weight/config hashes, both verdicts. Whatever the verdicts, F15 keeps F4-F14 numbers
untouched (measured-as-run) and files the distribution effect (pool-mean vs F14-train, held-out vs
F14-held) descriptively.
