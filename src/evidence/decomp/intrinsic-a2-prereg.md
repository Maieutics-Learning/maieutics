## Intrinsic brain A2 — LOAD-STRESS ownership (prereg v1.2 AMENDED; battery-2-adjudicated 2026-11-23; supersedes v1.1/v1.0 where they differ)

Agent approval: this file. Battery-1: scratch/a2-battery1.json (3 sealed parallel; 1 accepted + 2 partial). Battery-2 (confirmatory on v1.1): scratch/a2-battery2.json (3 sealed parallel; 1 accepted + 2 partial-with-code-fix). Durable battery file: src/evidence/decomp/fresh-eyes-intrinsic-a2-2x-results.md (both rounds + adjudications; scratch raws disposable). Pre-countersignature: user pre-countersign 2026-11-23 (spec + fresh-eyes iterations + run). CPU/in-worker only; NO GPU; NO PUSH without explicit order. Pool boundary (standing): pools supply sealed reviewer labor only, never training signal/labels/items/capacity.

### Owned decision (why A2)
A1 verdict = COMPUTE-ONLY with none-parity: own (0.65/0.66/0.595) tied no-rehearsal (0.65/0.625/0.665, gaps 0/+0.035/−0.07) at N=6. At N=6 the episode fits in the 8-dim carry, so selection is damage control. A2 taxes carry: N=20 observes, same B_reh=2 budget, same 8-dim carry, delayed cue-only query for 1 of 20 uniform. Doing nothing should now fail; disagreement-selection should beat random AND none. If own still ties none under load, closed-loop rehearsal is dead and the program pivots to the representational lane (recurrent trunk / priced intermediates) — filed here as the pre-registered pivot, so a negative result decides something.

### Amendment note (v1.2, battery-2-adjudicated; code fix, no threshold moves)
- Battery-2 R1/R2 accepted the real point: |shuf−rand|<=0.03 sat at ~1 SE under N=200 evals (SE≈sqrt(.25·.75/200)≈0.031), and A1's train streams were arm-confounded (model-init rng and dataRng both depended on the arm tag — twin-matching violated beyond the lesion; evals were already clean via shared testRng/targetRng). Fixes, all filed here rather than as bar moves: (1) eval N=400 for A2 (SE≈0.022 at p=0.5; bar 0.03 ≈ 1.4 SE — still tight, quorum 2/3 decides); precision bump, not a threshold move. (2) Train streams twin-matched in code: init rng G.makeRng(21000+seed*7919+7) and dataRng G.makeRng(22000+seed*104729+99) are seed-only; ONLY selRng carries the arm code (selection lesion); targetRng seed-only (identical targets). A1's confound stands as a filed limitation (A1 ledgers COMPLETE, untouched). (3) Eval selection paired: shared seed-only selRng across arms, so rand-vs-shuf differ by training history only, not eval-sampling noise.
- Battery-2 R2-trunk-conflation rejected (rehearsal = extra 0.3-weighted grad steps on selected items vs 0.1 observes — distinguishable by construction; the "prior" is the mechanism under test). Oracle-conditional rejected as a gate (verdict taxonomy already handles it). R3 oracle-bias rejected with reason (each model trains only on its own policy; oracle is a treatment arm + ceiling reference, never a shared teacher; a random-incorrects oracle variant is scope creep).
- A1-limitation carried: A1 train init+data streams differed across arms (armOff + tag.length); A2 repairs it. Nothing in A1's verdict changes (evals were twin-matched; train-confound adds noise, not direction — filed openly).
- Raw battery-2 (disposable scratch/a2-battery2.json): R1 NEEDS-PATCH (shuf/rand two random mechanisms, noise trips 0.03) / R2 BLOCKED (same-trunk prior + 0.03 trap + oracle collapse) / R3 VULNERABLE (oracle gradient bias + random-incorrects killer). Score: 1 accepted (noise + twin-fix), 2 partial-with-reasons. Amendment is spec + driver-code; bars UNCHANGED.

### Amendment note (v1.1, battery-1-adjudicated)
- R2 accepted: twin-matching enforcement is code, not prose — A2 reuses the A1 driver's arm-independent targetRng (G.makeRng(24000+seed*31337), one int(N) per episode, identical across arms) and seed-only testRng/targetRng in eval; ledger tags arm-s<seed> are the seed map; learned forget = sigmoid gate on h (inForward f/cand/cNew + inBackward carry grads, same file); oracle = incorrect-first then highest head-mean loss (A1 code path, ceiling only).
- R1 partial: load-variance warning kept as reporting (per-seed + range on every ledger; SHUFFLE firing under load is informative COMPUTE-ONLY, not a bug). Rejected FAIL-before-running (A1 selection was perfect enrich 4.0; ranking op scales unchanged to 20). No threshold move on reviewer opinion.
- R3 partial: leakage rival adopted as the filed refutation (cue-only query via inQueryLine distractor-avoidance; leakage predicts none≈own≈rand, so own>none refutes it). Shuffle-symmetry IS the filed shuf bar (no new killer). Floor 0.35 stands (chance+0.10 with VOID guard).
- Raw battery-1 (disposable scratch/a2-battery1.json): R1 FAIL (symmetry collapse, shuffle breaks first); R2 NEEDS-PATCH (twin-matching/seed-provenance/forget/oracle wording); R3 REJECTED (oracle paradox + stochastic leakage + shuffle-symmetry). Score: 1 accepted, 2 partial. Amendment is spec-only.

### Design (same trunk, same forward pass, scarcity from N)
- Base: Div population (K=5 fixed per-head subspaces from G.makeRng(91000+seed), keep masks 0.6) + 8-dim slow carry with learned forget, same MLP-trunk prototype deviation as v11/A1 (1-layer trunk on flat+carry, 1-episode; filed openly — tests population/carry/selection logic, not recurrence).
- Episode (all arms, twin-matched): Phase 1 observe N=20 bindings sequentially (carry updates each). Phase 2 rank all 20 by current-model functional vote-disagree (1 − maxVote/5 from the same forward pass) and rehearse B_reh=2 through the SAME trunk (extra passes, carry updates via learned forget). Phase 3 delayed query: cue-only query for one target uniformly drawn among the 20, unknown at rehearsal time.
- Arms (same steps/B/lr/seeds, twin-matching: shared init/LR/steps/rng-offsets except the lesion; target sequence identical across arms via seed-only targetRng):
  - A2own: deterministic top-2 by vote-disagree.
  - A2rand: same ranking computed then discarded, uniform random 2 (same compute, selection destroyed).
  - A2none: no rehearsal passes (floor: does rehearsal matter at all under load).
  - A2oracle: incorrect-first then highest head-mean loss (true-difficulty ceiling; A1 showed hardest-first can harm — filed as rival, never a bar).
  - A2shuf: ranking computed then random 2 (same ranking compute + same writes, selection unlinked). Killer control with teeth.
- Inbuilt status: ranking IS the forward-pass output; top-2 is a deterministic harness budget (v11.1 clarification), not a controller, call, or tool. No pool LLM/signal/labels/capacity anywhere in train or test.

### Metrics (functional only)
Vote-split disagree + calibration-style audit only. Weight mean-cos retired (v11: 0.9997 everywhere; A1: 0.999+ everywhere) — reported descriptively, never gated. Overlap audit kept: per-head top-2 identity (Jaccard/identical coverage; ~100% = functional clones → bootstraps repair owed). A1 overlap was ~0.10 everywhere (heads differ); A2 re-checks under load.

### Bars (ledgers d-intrinsic-a2-*.json; R=3 seeds 0/1/2, quorum 2/3; trains 3000st/B16/lr5e-3 Adam; evals N=400; per-seed values + range on every ledger; SE≈0.022 at p=0.5 so SHUFFLE 0.03 ≈ 1.4 SE — tight by design, quorum decides)
- LOAD-GAIN-RAND (primary): delayed-query acc own >= rand + 0.05 quorum 2/3.
- LOAD-GAIN-NONE (primary, the A1-missing bar): own >= none + 0.05 quorum 2/3. If this fails while RAND holds, rehearsal mitigates poison but adds nothing — REHEARSAL-DEAD signal.
- SELECTION-AUDIT (primary): mean disagree(retained top-2) >= mean disagree(pool of 20) + 0.10 quorum 2/3, AND top-quartile enrichment reported descriptively (threshold = sortedD[floor(20/4)], tie-soft noted in A1 seedmap).
- SHUFFLE-COLLAPSE (killer, teeth): |shuf acc − rand acc| <= 0.03 quorum 2/3. Holds + gains hold but shuffle fails → COMPUTE-ONLY.
- FLOOR (validity): own acc >= 0.35 (chance 0.25 + 0.10) quorum 2/3, else VOID (load too hard/easy — no ownership claim either way).
- ORACLE-CEILING: reported, never a bar. A1 precedent (oracle < own 3/3) filed as the harm rival.
- Verdicts: OWNED-UNDER-LOAD (rand + none + audit + shuffle + floor all hold) / EDGE (rand holds, none fails — selection helps vs poison, still adds nothing: A1-repeat) / COMPUTE-ONLY (gains hold, shuffle fails) / MISSELECT (audit fails) / CLONE (overlap ~100%) / REHEARSAL-DEAD (none >= own — pivot to representational lane) / VOID / FLAT-FAIL.

### Cost / honesty
- ~2.5x A1 per cell (23 forwards + backward chain vs 9). Same 3000st/B16/lr5e-3/Adam. Risks: load too hard (all arms floor → VOID, still decides the pivot); oracle destabilizes again (lossN ~2.0 precedent — expected, not a bug); ties inflate enrich (filed A1 note, descriptives only). No threshold moves on reviewer opinion alone (standing rule).
- Pool-use boundary: reviewer labor only. Any spec change adding parameters, data, or outside compute to chase the bar is rejected as panacea-by-resources.

## Ledgers
`d-intrinsic-a2-train-<arm>-s<seed>-3000st.json` + `d-intrinsic-a2-eval-*` (spec tag intrinsic-a2.2, N_OBS=20, B_REH=2, N=400, sharedEvalSel) + verdict + seedmap + driver ext (opts nObs/bReh/nEval/prefix/specTag/sharedEvalSel) + this spec + battery file(s). Transcript + CHATLOG + CURRENT_TASK as usual. NO PUSH without order.
