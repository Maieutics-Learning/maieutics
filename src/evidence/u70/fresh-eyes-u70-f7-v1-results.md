# U70-F7 battery barrage results (10/10 NEEDS-PATCH, 2026-11-27)

Premise: `premise-u70-f7-v1.0.md`. Verbatims: `f7-battery/r1..r10`.

## Convergent charges
1. **Trajectory-purity (all 10):** warmup changes Adam (m,v), so epoch-21 state differs — "different trajectory, not calmed path; endpoint-identical is false."
2. **Arbitrary ramp (r1/r2/r6/r7/r10):** 20 epochs unjustified, no counterfactual.
3. **Smoke-timing (r5/r7/r8):** post-battery smoke could leak into tuning.
4. **Verdict tension (r3/r5/r7/r9/r10):** pooled pass vs un-flip counts can disagree; no powered un-flip rule.
5. **Survivor-mining (r3p1):** same-seeds = mining for recovery.

## Adjudication (for owner arbitration)
- REJECT trajectory-purity with derivation: the proposal STATES Adam state differs — that IS the treatment, disclosed, not smuggled. Any intervention alters trajectory; demanding trajectory-identity forbids every experiment including the ones this battery's predecessors approved (F1/F2/F4 all changed trajectories — that was the point). The program's comparability standard — same seeds/inits/streams, ONE pre-registered change, paired deltas — is met exactly. Unsatisfiable demands are not flaws.
- REJECT ramp-counterfactual: demanding 10-vs-30 IS demanding the sweep they claim to oppose. Pre-registered single standard value (10%, literature-standard) + no tuning = the control. Adopt a one-line justification gloss (standard warmup fraction), not a sweep.
- REJECT survivor-mining: paired same-seed comparison is the program standard since Wave 1 (F1a-vs-Wave1, F2-vs-F1a, F4-vs-F2 all paired same-seed). It is the opposite of mining — it holds everything constant except the road.
- ADOPT smoke-lock: smoke output filed verbatim; abort-on-implementation-bug ONLY; zero design tweaks permitted on smoke basis (closes r5/r7/r8 process hole).
- ADOPT reading rule (reporting, not a bar): FIXED reads "stabilized" iff catastrophe count (probe<0.50) drops F4(8)→F7; pooled-pass WITHOUT catastrophe-drop files as FIXED-WITHOUT-STABILIZATION and names F8. Pooled verdict boundaries themselves do not move (answers r3/r5/r7/r9/r10 tension without a new bar).

v1.1 = v1.0 + justification gloss + smoke-lock + reading rule. Re-close needed, then countersign, then execute.
