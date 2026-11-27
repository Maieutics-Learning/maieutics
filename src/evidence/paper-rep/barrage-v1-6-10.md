# Paper-rep battery 1 verbatims R6-R10 (verbatim, 2026-11-27)

--- R6 ---
1. **P1 (Arch-sufficiency):** Claim: Supervision content is the only residual signal. Evidence: None. Contradiction: U58 (underpowered) and U60 (manip-fail) suggest the contextual substrate is inadequate. Conclusion depends on the assumption that the architecture is "sufficient" to capture the signal, which U58 explicitly denies. **Fix:** Recast P1 as a hypothesis, not a fact.

2. **P2 (§8 Nursery):** Claim: The system creates a full model that learns from scratch. Evidence: U64b (floor met). Contradiction: U64d (emergence NULL) and U64e (Oracle-only). The "learning" only occurs under Oracle guidance, not autonomous "scratch" creation. **Fix:** Qualify P2 as "Oracle-dependent."

3. **P4/P5 (§7 TBDs):** Claim: Implied functional validity of the track. Evidence: Missing. Contradiction: Challenger track/interpreter unbuilt. Conclusion: P5's "replication" claim is a distraction if the core test loop (P4) was never run. **Fix:** Move P4 items to "Future Work."

--- R7 ---
1. **Claim:** Arch-sufficiency (P1). **Evidence:** None. **Contradiction:** U58 (underpowered/inadequate substrate) and U59 (floor-fail). **Assumption:** That "residual signal" can be isolated without a functional baseline. **Verdict:** Overstated. **Fix:** Downgrade to "architectural hypothesis" until U58/U59 are resolved.

2. **Claim:** The "Nursery" (P2). **Evidence:** U64b (edge-case success). **Contradiction:** U64d (emergence NULL), U64e/h (oracle-dependency). **Assumption:** That oracle-led resets equal autonomous learning. **Verdict:** False/Unearned. **Fix:** Qualify as "Oracle-guided initialization," not "creates from scratch."

3. **Claim:** Result-free mapping (P3). **Evidence:** Paper structure. **Contradiction:** P2 makes a definitive functional claim about the nursery's output. **Verdict:** Coherence failure. **Fix:** Move P2 claims into a "Proposed" section.

4. **Claim:** Measured evidence (P6). **Evidence:** `RESULTS_INDEX.md`. **Contradiction:** U60 (DEAD), U55 (invalid proxies). **Assumption:** That a "recorded" result is a "validated" one. **Verdict:** Misleading. **Fix:** Explicitly link U-verdicts to P-claims to show the "dead" results.

5. **Claim:** Non-replication as criticism (P5). **Evidence:** None. **Contradiction:** U64h (3rd replication works). **Verdict:** Logic loop. **Fix:** Delete; it masks the lack of robust replication.

--- R8 ---
1. **Claim: Arch-sufficiency (P1).** Evidence: U64b (EDGE-E1 20/20). Contradiction: U58 (UNDERPOWERED) and U60 (MANIP-FAIL), suggesting the substrate is inadequate for emergent learning without an oracle. Assumption: Edge-case success equals general architectural sufficiency. Fix: Downgrade P1 to "potential for sufficiency under oracle conditions."

2. **Claim: The Learning Nursery (P2).** Evidence: U64e/h (ORACLE-ONLY). Contradiction: U64d (BOTH-DEAD), where emergence is NULL. The "model that learns" currently requires an external oracle to trigger the loop (LOOP-O 17/20). Assumption: Oracle-guided success is a proxy for autonomous "from scratch" learning. Fix: Clarify that "learning" is currently oracle-dependent, not autonomous.

3. **Claim: Evidence Integrity (P6).** Evidence: `RESULTS_INDEX.md`. Conflict: U55-U60 are failures/invalid, yet P1 and P2 maintain a narrative of progress. Assumption: Negative results in ledgers don't invalidate the prose's structural claims. Fix: Explicitly link U60's "DEAD" status to the limitations of the "road" mapped in §8.

--- R9 ---
1. **P1 (§5) vs U58/U60**: Claim: "arch-sufficiency is established." Evidence: None. U58 (UNDERPOWERED) and U60 (DEAD/MANIP-FAIL) explicitly invalidate the contextual substrate. **Verdict:** Overstated. **Fix:** Reclassify as "hypothesized" or "insufficient."

2. **P2 (§8) vs U64b-h**: Claim: "creates from scratch a full model that learns." Evidence: U64b (floor 20/20) and U64h (LOOP-O 17/20) show functional resets/loops, but U64e/h confirm ORACLE-ONLY dependence. **Verdict:** False; the "nursery" is a puppet, not a creator. **Fix:** Qualify as "oracle-guided emergence."

3. **P4 (§7) vs U-ledgers**: Claim: Implicitly suggests a complete evidence chain for interpretations. Evidence: Challenger tracks and interpreter disambiguation are "unbuilt" or "quarantined." **Verdict: Un-runnable.** Fix: Move all TBDs to a "Future Work" appendix.

4. **P6 (§5) vs U-ledgers**: Claim: "Evidence grades for every MEASURED claim live in `RESULTS_INDEX.md`." Evidence: U-ledgers (U55-U64) show the actual terrain is a graveyard of "FLOOR-FAIL" and "DEAD" results not mirrored in prose. **Verdict:** Coherence failure. **Fix:** Hard-link U-verdicts to specific §5-8 claims.

--- R10 ---
1. **P1 (Arch-sufficiency):** Overstated. U58 (UNDERPOWERED) and U59 (FLOOR-FAIL) indicate the contextual substrate is inadequate to manufacture competence. The "residual" is not signal; it is noise. **Fix:** Downgrade from "established" to "hypothesized" pending U64-level stability.

2. **P2 (§8 Nursery):** False. U64e/h show the model is "ORACLE-ONLY." It cannot "create from scratch" if it requires external triggers (RESET-VALUE) or oracle guidance to function. **Killer Test:** Run U64-series without oracle prompts; if floor remains 10/20, the nursery is a mirror, not a creator.

3. **P4 (§7 TBDs):** Un-runnable. Causal readouts depend on the "interpreter disambiguation" which is "designed-but-unbuilt." Any claim of insight into the internal representation is currently prose-only. **Fix:** Explicitly label §7 as "Proposed" or "Theoretical."

4. **P6 (Evidence Mapping):** Coherence break. P6 claims evidence for "every MEASURED claim," but U60/60b/60c are "DEAD" (MANIP-FAIL). The gap between "measured" and "confirmed" is being bridged by prose. **Fix:** Sync `RESULTS_INDEX.md` to explicitly mark U60 as "INVALID" rather than just "UNDERPOWERED."
