# U71-PRED independent review — response to 2026-11-28 handoff (NOT licensed for execution)

Status: review only. No driver edit, no compute. Proposal remains NOT LICENSED until owner countersigns a frozen prereg.

## Overall

Direction is right. The prerequisite framing (representation → inference → use) matches the filed record (U55–U70-F16), and the firewall (no bio-mechanism claims from a computational pass; no ACh/NE inside U71) is correct and should stay.

U71-PRED as written is not yet runnable. Three foundational bugs must be fixed in U71-0 first, then thresholds/power/intervention-validity must be frozen. Details below, keyed to your §5 + §13 questions.

## §5 foundational issues — all three CONFIRMED against current code

All refs to `src/evidence/u70/u70-task-spec.md`, `u70-oracle.js`, `u70-neural.js` as filed at 76d57604.

- **A. Dwell vs oracle — REAL.** Generator (`u70GenPath` / `u70nGenPath`) enforces min-dwell-25 by blocking switches (`t-lastSw>=dwell`). Oracle forward step (`u70-oracle.js:75-84`) predicts with constant `psw` (`pc = 1-psw/psw`) and no dwell age. A constant-hazard filter on a hard-dwell process is misspecified. Fix as proposed: augment hidden state with dwell age (or semi-Markov filter), and unit-test filter-vs-generator agreement. Do not reinterpret neural-vs-oracle gaps until this is closed.
- **B. Path divergence — REAL.** Oracle path gen draws *twice* on a dwell-blocked trial (`u70-oracle.js:35-36`: `if (... && rng()<psw && ...) else if (... && rng()<psw)`), neural draws once (`u70-neural.js:55`). Identical nominal seeds therefore diverge after the first blocked switch. Fix as proposed: one canonical generator, archive actual `ctx/rho/cue/switch` arrays, supply identical archives to every arm, verify array equality (not seed equality).
- **C. Cue lag — REAL.** Spec (§task) and causal diagram both say cues lag one trial after a switch (the high-rho trap). Code generates cue from `path.ctx[t]` at same `t` (oracle `:67-70`, neural `:67-70`). No lag is implemented. Fix as proposed: explicitly define order (context transition → stale cue → action → reward), implement the lag, fix the initial-trial convention, and make cue-prediction score previous-context while reward-prediction scores current-context. This changes the trap trials, so all oracle numbers must be recomputed after the fix.

U71-0 must close A+B+C with unit tests + recomputed oracle identifiability before any neural arm is licensed. Your G0-HALT is the right gate.

## Architecture (§6.1, Q3–Q5, Q14)

- Factorized `z_c` (2) + `z_r` (3) vs shared-6 control (A2) is the right comparison. Keep A2; it tests whether factorization is doing work or just building in the answer.
- Keep `rho`-head independence (heads must not share a shortcut path). State explicitly that `z_r` does not feed the context decision and `z_c` does not feed the reliability decision except through the tested pathways.
- Carry forward two filed requirements: (1) learnable latent→recurrent projections (F16-ZREC used frozen random weights by construction — that arm did not test recurrence, it tested noise injection; U71 must make `z→h` trained); (2) generative grounding for the KL package (free-bits + small rep weight + uniform mixture are undefined without reconstruction/prediction heads — Dreamer lesson, already in lit-lessons v1.1).
- Category counts (2/3) are hypotheses. Prespecify the collapse/merge readouts (usage histograms, KL traces, entropy) and what counts as collapse vs merge vs success.
- Sizes (GRU-64) are fine as a start, but lock them with a capacity argument: why 64 is enough for the oracle-computable filter but small enough to fail if representation is missing. No post-hoc resizing.

Alternative worth prespecifying as a rival, not adding now: single-stream 6-state filter-RNN (your A1+A2 cover this). Do not add attention/episodic machinery in U71.

## Training (§7, Q6–Q7)

- Exposure match (1×200 vs 8×25 = 200 presentations) is correct and directly answers F15-thinning. Keep model-run as the independent unit; trajectories/trials are nested.
- Add the two controls you already list as questions: block-vs-interleave and a shuffled-order control. Without them a multi-traj win is confounded with curriculum/order.
- Freeze before training: optimizer, LR, init scheme, loss coefficients, schedule, restarts/selection rule (best-by-train-loss is selection — prespecify it), power justification for n=20. No eval-driven early stopping, no post-hoc hypers.
- A4 (supervised factorized) as positive reference is correct. The most informative outcome is A4-passes / A3-fails under matched capacity and exposure — that localizes the failure to predictive identification, not capacity.

## Evaluation (§8, Q10–Q11)

- G0-HALT first is right. G1–G5 as written are constructs without numbers. That is fine for a proposal, not for a prereg: after U71-0, generate oracle distributions for every planned condition, measure oracle-vs-reactive gaps, run power sims with model-run as unit, then freeze absolute floors, oracle-relative margins, calibration limits, and minimum causal effects. Archive and countersign the threshold table before training.
- Report per-model results + paired arm differences + CIs + effect sizes + raw + oracle-relative + calibration + every planned condition including failures. Your §10 already says this — keep it as a firewall clause.

## Interventions (§9, Q8–Q9)

Your OOD worry is the strongest point in the handoff and it is correct: zero/shuffle can push the net off-manifold, so a drop does not by itself prove natural use.

Minimum valid set:
1. Matched perturbations (same-magnitude random directions; shuffled-from-prior vs shuffled-across-time).
2. Conditional resampling (replace `z` with a prior draw conditioned on `h`, not zeros).
3. Pathway separation (intervene at readout only vs recurrent update only — prespecify both).
4. Double dissociation (your G4): `z_c` damage hits context-behavior selectively, `z_r` damage hits reliability-behavior selectively; joint damage both. Single dissociation is not enough.
5. Positive control: inject oracle-state (or A4-posterior) into A3's decision path — if behavior does not improve, the readout is broken and negative intervention results are uninterpretable.

Strongest causal test: matched-perturbation-controlled, pathway-specific, doubly-dissociated effect with a positive-control-passed readout. Prespecify minimum effect sizes in U71-0, not after seeing data.

## Statistics (Q10–Q11)

- 20 runs is plausible but unjustified until the power sim is done (use oracle-vs-reactive gaps + F14–F16 variances as inputs; model-run as unit). Freeze the sim with the thresholds.
- Smallest falsifier: (a) A4 passes + A3 fails with matched exposure/capacity (predictive identification fails); or (b) A1 recurrent-only matches A3 on G1–G5 (factorization adds nothing). Either kills the central hypothesis without needing the full battery.

## Biology (§11, Q13)

Firewall stands. Passing U71 would show predictive hidden-state representation + causal use, not hippocampal / PFC-MD / ACh / NE implementation. Keep neuromodulation in U71-3 and only if G1–G5 pass. Nothing missing except making the negative explicit in the prereg: list the bio claims U71 does *not* license, so a later reader cannot upgrade them.

## Execution order (§12)

Agree: U71-0 (correction + oracle recompute, no neural training) → U71-1 (A1–A4 + U70-reference, prespecified exposure) → U71-2 (interventions/transfer) → U71-3 (bio control, gated). Nothing in U71-1 licenses execution until U71-0 passes G0 and the threshold table is countersigned.

## What I need back from the other side

1. Corrected generator + dwell-aware filter diff with unit tests (A/B/C closed) + recomputed oracle table.
2. Frozen threshold/power table (gates with numbers, not names).
3. Intervention-validity controls adopted (matched perturbations + conditional resampling + pathway separation + positive control).
4. Exposure controls (block/interleave/shuffle) either in or explicitly deferred with a reason.
5. Explicit non-license list (bio claims not licensed by a U71 pass).

No execution until those five are in one countersigned document.
