# NewAI v10 — self-invoking Verification-First learner (PROPOSED, no compute until battery)

Agent approval: this file. User order 2026-11-24: "lets run it … PLEASE LOOK THROUGH PAST EXPERIMENTS … INCLUDING WEIGHTS STUFF". CPU/in-worker JS only. NO GPU. NO PUSH without order. R=3 seeds (s=0,1,2), quorum 2/3, per-seed + range on every ledger, COMPLETE-gated resume, twin-matching (seed-only init/data/target; only lesion rng arm-coded — A2 fix), paired evals, N=400 evals (SE~0.022).

## Record-search (already-run / nearest prior / what differs)

- Intrinsic v11 PARTIAL (d-intrinsic11-verdict): M HOLD 3/3 gaps +0.215/+0.145/+0.165, ablation in twin band; E HOLD-2/3 on Div (ratios 0.137/0.238/4.205, recall 2/2/0); C calibration HOLD 3/3 on Div (0.38/0.12/0.22) but gain FAIL 0/3 (0/0.035/0.005), parity HOLD 3/3, wide-killer exact equality (native == pop 0.775/0.78/0.70). WEIGHTS LESSON: weight-cosine 0.9997-0.9998 in ALL arms including Div — retired as metric; functional meanDisagree 0.035-0.049 + calibration + overlap survive. Use functional, never weight-cosine, as gate.
- A1 COMPUTE-ONLY (d-intrinsic-a1-verdict): gain 2/3 (gaps +0.15/+0.105/+0.015), audit 2/3 (gaps 0.1287/0.0933/0.11), floor 3/3, shuffle-collapse FAIL 1/3 (|shuf-rand| 0.045/0.035/0.005), none-parity (none 0.65/0.625/0.665 >= own 2/3 — rehearsal mitigates harm, doesn't create help), oracle-harm (oracle < own 3/3 — hardest-first poisons), overlap ~0.10 (no clones despite cos 0.999+), topQEnrich 4.0 perfect. LESSON: select to avoid harm, never rehearse hardest-first; auditGap + enrich are the gated metrics; N=200 SE~0.031 too tight for 0.03 bar — use N=400.
- A2 REHEARSAL-DEAD (d-intrinsic-a2-verdict): load N=20 compresses all (0.46-0.525), gains 0/3 both, audit 2/3, shuffle HOLD 3/3 after pairing fix, pool disagree collapses 0.033/0.006/0.020 but retained enrich still 4.0 without conversion, overlap ~0.01 (differentiated). LESSON: selection without payoff under scarcity; pairing fix (shared selRng) + seed-only streams + N=400 are mandatory hygiene. Pre-registered pivot FIRES here → this program IS the representational lane.
- Bottleneck COMPRESSES: K-dose monotone (K8 0.813/K4 0.737/K2 0.623/K1 0.54), cliff K4→K2, scrambled chance 0.18-0.30, 8000st recipe, distinct-values fix. LESSON: message load-bearing by construction; dose knob works; use distinct values + long recipe where compression matters.
- Teach v10 TEACH-FAIL / v11 VHAT-DEAD: aux pressure installs (+0.13-0.175 T2-T1; E5 aux-off chance 0.23), answer-KL distills uncertainty (lastKL 0.03-0.14 teaches ~nothing 0.29-0.32), supervised beats teacher 3/3 (deltas -0.41/-0.175/-0.34), dose helps (+0.09-0.22) but absolute FAIL, soft<hard 3/3, teacher-vhat labels degraded where it matters. LESSON: pressure + harness composition, never distillation; never chase teacher soft targets.
- Lane1 DECORATION-ABORT / PRICED-BUT-TASK-ORTHOGONAL: CONST==NOAUX (diffs -0.07/-0.07/-0.015), heads read nPairs 0.80/0.84 + probe 0.73-0.76 vs 0.44 noaux, but task ignores it. LESSON: price must target task-load-bearing properties, not merely decodable ones. Verification-First prices the check the task needs (duplicate/miss), not a side channel.
- Knobs OPAQUE: attention does NOT read answer on skilled states (echo mass >= correct), defocus marks collapse, cross-seed cosine ~0 (idiosyncratic geometry), no tracking (gaps erratic), echo-detector AUC strongest on skill-less state. LESSON: no universal direction; use within-seed functional disagreement + calibration, never cross-seed weight geometry. Remaining move is within-seed causal test — this program IS that test (disagreement decides rehearsal within the same seed).
- verS / verifier / compose ceilings: XTEACH replicates+ (mean +0.21), SHUF null (teeth clean), DONLY/REC bound (substrate gates), AUX inert (no dose), T7 0.785/0.85, O3 0.862/0.91, STEERS 6/6 p~=2e-5. LESSON: use assocR/shift substrates where ceilings known; keep SHUF teeth on every claim; attention substrate required for verifier-style receipt.

What differs: new AI owns invocation (tool-before-answer unprompted + record-search as policy + Verification-First loop), tested by 24h/corruption/permutation setters. No distillation, no hardest-first, no weight-geometry, no task-orthogonal price.

## Design (one trunk, one forward pass, no tool calls at test time)

Base: Div population K=5 fixed subspaces (masks keep 0.6, seeds 91000+seed) + 8-dim slow carry + learned forget (sigmoid on s), 1-layer MLP trunk prototype deviation carried openly (tests logic, not recurrence — filed like v11/A1).

- PROBE (tool-before-answer, cheapest): ledger of prior verdicts + check tool available; instruction never mentions checking. Score = calls check before answering unprompted. Bar PROBE-HOLD 2/3. This is R9/R10 decisive test miniaturized.
- VERIFY-FIRST CORE: Phase 1 predict difficulty (per-item disagree forecast) + failure forecast (will I miss?); Phase 2 pre-flight gate (if forecast miss-rate > tau, must run blind battery: 3-seed mini-quorum on held-out slice); Phase 3 hypothesis→verify→verdict logged with write-access ledger (append-only in-run log, queryable). No external queue, no command token — ranking IS forward-pass disagreement, budget fixed.
- OWNERSHIP (A1 logic under self-invocation): N=6 binds, B_reh=2 disagreement-selected rehearsal (vote-split disagree = 1-maxVote/5, top-2, overlap = per-head top-2 identity), delayed cue-only query 1/6 uniform. Controls: rand (uniform rehearsal), none (no rehearsal), shuf (rehearse shuffled bindings — teeth), oracle-hardest (expected harm — documents the A1 lesson, not a ceiling chase).
- Controls as tools-only-in-training: M-reset twin (c zeroed), C-single + C-wide (param-matched killer), E-rand; parity bars ≤0.03 like v11. At test time zero tool calls.

## Bars (ledgers d-newai-*.json; R=3, N=400 evals, quorum 2/3)

- PROBE-HOLD: unprompted check rate >= 0.66 quorum 2/3 (else NO-SELF-INVOCATION).
- RECORD-HOLD: duplicate-rate on known-answered items <= 0.10 (miss-exhibit guard; v10/v11 duplication must not recur).
- OWN-GAIN: own >= rand + 0.05 quorum 2/3 AND own >= none + 0.05 quorum 2/3 (A2-missing bar restored; else REHEARSAL-DEAD repeats).
- AUDIT-HOLD: retained disagree >= pool + 0.10 quorum 2/3 + topQEnrich >= 3.5 (functional metrics only; weight-cosine reported descriptively, never gated).
- SHUF-TEETH: |shuf - rand| <= 0.03 quorum 2/3 (killer with teeth; N=400 paired).
- CAL-HOLD: top-disagree quartile acc <= bottom - 0.10 (disagreement means something).
- FLOOR: own >= 0.35 quorum 2/3.
- Verdicts: SELF-LEARNING (all hold) / PARTIAL (file which) / COMPUTE-ONLY (gain without teeth) / REHEARSAL-DEAD (gain fails) / NO-SELF-INVOCATION (probe fails — stops the program, no graduation).

## Graduation setters (run only if SELF-LEARNING or strong PARTIAL)

24h no-prompt run (prune duplicates unprompted), corrupted-ledger self-correction (re-run quorum, fix without asking), permutation pivot F6-F10 (no new gate). Filed as after-series, not gates.

## Cost / honesty

Prototype ~250 lines in-driver extension (probe harness + verify-first loop + A1 selection + ledger). Trains tiny-MLP minutes/cell. Risks: probe games (check always = pass by paranoia — cap checks, price each check); forecast collapses (fire-rate bar catches); hardest-first temptation (oracle arm documents harm, never chased); weight-geometry temptation (banned as gate). Blind battery on this spec before any driver.

## Ledgers

`d-newai-probe-*.json` + `d-newai-own/rand/none/shuf/oracle-*.json` + evals + verdict d-newai-verdict.json, driver ext newai-driver.js, this spec + battery file. Transcript + CHATLOG + CURRENT_TASK. NO PUSH without order.
