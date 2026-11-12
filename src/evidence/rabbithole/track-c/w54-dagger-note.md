# W54exec — DAgger original (Group A; backlog-W50, OPD second root)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 2 good primaries + 3 varied attempts, attempts over budget noted)
- Wrong ID from memory (1106.0671 = Domain Filtering) + abs verify → correct 1011.0686 (Ross/Gordon/Bagnell, CMU); v1/v4 ar5iv both 404 (old paper, no HTML) → PDF 551KB → local extract.js → 33.8KB text, 9 blocks, zones read. Dumps in `scratch/track-c/w50-dagger*`. PDF URL + abs URL durable.
- Algorithm: iterate — expert rollouts → mimic on trajectories → learner rollouts under its own induced distribution → aggregate into dataset → re-mimic on whole set. Stationary deterministic policy; no-regret guarantees under self-induced state distribution; beats SMILe/SEARN (Mario + Handwriting/sequence labeling); rapidly-mixing MDP condition.
- Verdict USED: completes the OPD root pair (scheduled sampling W36 = train/inference mixing; DAgger = expert/learner distribution mixing + aggregation). Never-replace whole-dataset aggregation = Gerstgrasser accumulate (W36) = quality-filter keep (W3): three arrivals, one move. No precursor, no conflict.
- Beta-mixing schedule (expert-vs-learner weight per iteration) = exact analog of fade schedule → spawned W67 (map β-schedule ↔ fade/threshold-curriculum, F-new).

## Tangential (reasoning, 0 spend)
- DAgger's guarantee is under the *self-induced* distribution — the same bar as our severance metric (hint-free ignition, not hinted accuracy). Train where you will be tested; aggregate, never replace.

## Spend / queue
- Spend: 0 scouts + 2 good (abs-verify + PDF-full) + 3 failed attempts (wrong-ID, 2× no-ar5iv 404; logged, precedent W36). Consumed backlog-W50 removed; spawned W67 to BACK. Backlog 17. Synthesis R6 clock: 3/5.
