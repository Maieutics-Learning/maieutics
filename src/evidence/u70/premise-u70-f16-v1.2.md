# Premise U70-F16 v1.2 (frozen for confirm — NOT licensed; needs battery + re-close + fresh countersign)


> v1.1 patch (battery 6 STANDS / 4 NEEDS-PATCH, 3 gloss groups, no bar/design/compute change): (1) verdict-before-interaction ordering; (2) unfamiliar-math gloss (seeds = disjointness, unfamiliarity = generator params); (3) procedure-identity init logging (fan/scale/first-draw, NOT bit-identical). See `fresh-eyes-u70-f16-v1-results.md`.

## 1. Project (3 lines)

U70 is context-inference: GRU + 4-way stochastic latent over 300-trial trajectories; Bayesian
oracle bounds what any neural model may be penalized for missing. F14 proved filed wins survive
TRUE full-latent intervention on the training road (probe 0.7183 / TRUE-gap 0.1468 / ctx 0.8783,
TRAIN-REPAIRED) but collapse on held-out (0.6227 / 0.0274 FAIL / 0.7777, HELDOUT-DEGRADES);
leak-size ~0 both. F15 proved 8-road round-robin at identical steps thins the read (pool probe
0.6288 FAIL / gap 0.0626 vs F14 0.7183 / 0.1468; held 0.5957 / 0.0163 FAIL) — distribution is not
the fix. F16 tests the queued architecture fixes the same way every prior wave was tested:
separately for attribution, plus ONE folded arm to catch stray emergence (synergy or interference).

## 2. Scope agreement

Ability, not drive: agent proposes/runs/grades; owner countersigns exact versions and arbitrates.
What accumulates is method + preserved negatives, never cherry-picked winners. Not a goal:
touching LR/optimizer/schedule/ctxw/floor/repw (second variables), re-litigating F15 rivals
(25-epoch control, block-vs-interleave, shuffled-order — separately owed), claiming PROCEED or
Phase-2, moving filed numbers (F4–F15 stand), or moving bars (F14 bars reused verbatim per
F14-r4 precedent). One track: composable training flags (z-recurrence, GRU-128) each alone plus
both together; eval-only extras (unfamiliar-context, 2 ablations, calibration + trace reporting)
on anchor + folded weights only, to bound compute. Sharpened F3, Phase-2, exposure rivals stay
queued — named, not smuggled.

## 3. Verified claims (numbers sacred)

- C5 arch caveat open since F11 (`u70-minimal-arch.md:10` vs `u70-neural.js:128-157,165,401-404`):
recurrence is `x+h` only; `z` is readout-only, never fed back; F11/F14 boundary is read-point only.
- Capacity not ruled out: GRU-64 only; GRU-128 queued since F8, never run.
- Held collapse repeats 3x: F13/F14/F15 HELDOUT-DEGRADES (held probe 0.6227/0.6227/0.5957, held
TRUE-gap 0.0224/0.0274/0.0163 FAIL, ctx 0.7777/0.7777/0.7667). Cue floor 0.7503; model +0.027 over
cues vs oracle +0.237 (`d-u70-oracle-f13.json` reused).
- Split-rate is NOT the sensor (F10 disagreement NEGATIVE: splits lower on graves 0.069 than
healthy 0.143). Replacement sensor (per-trial KL/entropy/V4-gap trace) never logged.
- Calibration input filed: held valid-ECE path exists (F12 neural 0.245974/MCE 0.286; F13 held
descriptive). No calibration bar exists — F16 reports, does not gate.

## 4. Done / Next

Done: F15 TRAIN-REGRESSED + HELDOUT-DEGRADES with-thinning (380 rows, 0 invalid, WITH-THINNING
filed openly). Next if licensed: F16 smoke (per-arm 1-epoch determinism + T10) -> 80 retrains
(4 training arms x 20) -> ~400 eval rows + 20 oracle unfamiliar rows -> per-arm TRAIN + HELDOUT
verdicts (F14 bars) + descriptive interaction + descriptive unfamiliar/ablation/calibration/trace.
Queued behind: F15 rivals, sharpened F3, Phase-2, U65–U69.

## 5. The ask (barrage)

Review v1.0 only: does the composition isolate causes AND catch interactions without new scope?
Verdict (STANDS / NEEDS-PATCH) + what still blocks. <=150 words, numbered. Angles: (1) one-change-
per-separate-arm; (2) combined-arm interaction descriptive vs verdict weight; (3) eval-only extras
bounded to 2 arms; (4) unfamiliar distribution pre-registered, not a sweep; (5) ablations read-only
(weight-hash proof); (6) calibration/trace reporting-only; (7) step-count identical all training
arms; (8) bars unchanged (F14 verbatim).

## 6. Anti-bias packet

Central claims: (a) base is F14-exact for every training arm except the ONE flagged change (A1,
A2) or TWO (B combined); (b) eval is F14-exact for the 4 core evals; extras are eval-only on
frozen weights; (c) 20 seeds 0..19, same inits 90000+s, same 200/1200 steps, same TRUE path
T7/T8/T8b. Missing: no z-recurrence run, no GRU-128 run, no unfamiliar run, no ablation run
exists yet. Assumptions: F13 held oracle reusable for held; unfamiliar needs its own 20-row
oracle (same unfamiliar distribution, seeds 2000..2019). If any training arm differs in steps,
T10b HALTs the wave (BROKEN) — isolation is enforced, not asserted.


> v1.2 micro-patch (re-close 2/2 split: re1/re3 STANDS; re2 symext rejected with derivation; re4 3-point hardening adopted as checkable assertions, no design/bar/compute change).

## v1.1 glosses (no design change)

- G1 ordering: per-arm verdicts are assigned from absolute bars BEFORE the combined-vs-separates interaction table is generated (order logged in wave output); the interaction readout can never retroactively change a separate verdict.
- G2 unfamiliar math: seeds 2000+s provide disjointness only; the unfamiliarity itself is the pre-registered generator-parameter shift (T=300, dwell 12, psw 0.05, prho 0.06, pay 0.8, rhoVals unchanged) with its own 20-row oracle (2000..2019), never mixed with the held ceiling.
- G3 init procedure-identity: each arm logs fan/scale/first-draw per matrix (procedure-identical from same bases 90000+s); H128 is explicitly NOT bit-identical to H64 (scale differs by construction) — disclosed, not hidden.

## v1.2 micro-glosses (checkable assertions only)

- G4 procedure-identity: per-matrix RNG draw-index + fan + scale + first-draw logged per arm/seed; A2/B hashes MUST differ from A0 (equality = bug); construction is single-RNG-stream (grep).
- Unfamiliar oracle explicit: SAME oracle script with unfamiliar P params; ledger `d-u70-oracle-f16-unfam.json` with identical report fields; T5-disjointness + retention on unfamiliar seeds.
- T10e hardened: weight-hash equality pre/post extras AND grep (no optimizer step, no M.params write in ablation branches) AND hidden reset to zeros per eval start, no carry.
