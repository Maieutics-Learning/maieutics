# Paper-rep battery 1 verbatims R1-R5 (verbatim, 2026-11-27)

--- R1 ---
1. **P1 (Arch-Sufficiency):** Claims architecture is sufficient and only supervision content remains. **Verdict:** False/Overstated. U58 (Underpowered) explicitly concludes the contextual substrate is inadequate. **Fix:** Reclassify arch-sufficiency as "hypothesized" or "incomplete" per U58.

2. **P2 (The Nursery):** Claims the system creates a full learning model from scratch. **Verdict:** Unverified/False. U60-U64d are "DEAD" or "INCONCLUSIVE." Only U64e/h show functional resets under *oracle* conditions, not autonomous creation. **Fix:** Limit claim to "Oracle-guided functional reset."

3. **P4 (§7 TBDs):** Claims functional readouts. **Verdict:** Un-runnable. Challenger tracks and interpreter disambiguation are "designed-but-unbuilt." **Fix:** Move these from "Results" to "Proposed Architecture."

4. **P6 (Evidence Mapping):** Claims all measured claims are graded in `RESULTS_INDEX.md`. **Verdict:** Coherent, provided the U-verdicts (specifically the "DEAD" results) are mapped to the prose. **Fix:** Explicit cross-link U60-U64 failure modes to §8.

--- R2 ---
1. **Arch-Sufficiency (P1):** Claims architecture is sufficient and only supervision content remains. **Contradicted by:** U58 (underpowered/inadequate substrate) and U59 (gate cannot manufacture competence). **Fix:** Downgrade "established" to "hypothesized"; run substrate-scaling test.

2. **The Nursery (P2):** Claims a system that creates models from scratch. **Contradicted by:** U64b-e. Only "Oracle-only" (F4) functionality exists; biological/autonomous emergence is NULL. **Fix:** Qualify "creates from scratch" as "requires oracle-guided reset."

3. **The Road (P3/P4):** Claims §8 is a map, not results. **Weakness:** P4 reveals the "map" leads to unbuilt interpreters and quarantined inversions. The road is a cliff. **Fix:** Explicitly list "unbuilt" components as "Future Work," not "Mapped Road."

4. **Evidence Integrity (P5/P6):** Claims measured evidence in `RESULTS_INDEX.md`. **Gap:** U60/64 series shows widespread "DEAD" or "INCONCLUSIVE" verdicts. The paper claims a path that the ledgers refute. **Fix:** Sync §5-8 prose to reflect U-verdicts.

--- R3 ---
1. **P1 (§5) vs. U58/U59**: Claim—*arch-sufficiency is established*. Evidence—None. Contradiction—U58 (UNDERPOWERED) and U59 (FLOOR-FAIL) explicitly state the contextual substrate is inadequate and the gate cannot manufacture competence. Assumption: Residual signal equals supervision content. **Verdict: Overstated.** Fix: Downgrade "established" to "hypothesized."

2. **P2 (§8) vs. U60/U64**: Claim—*nursery creates full model that learns*. Evidence—U64b/e (partial floor/reset). Contradiction—U60 (DEAD), U64d (NULL), and U64h (ORACLE-ONLY). The "learning" is an oracle artifact, not an autonomous emergence. Assumption: Reset-value success equals model-level learning. **Verdict: False.** Fix: Specify "oracle-dependent functionality."

3. **P4 (§7) vs. Results**: Claim—*various functional readouts (challenger/interpreter)*. Evidence—None. Contradiction—Directly stated as "never run" or "unbuilt." **Verdict: Un-runnable.** Fix: Move claims to "Proposed" section.

4. **P6 (§5) vs. U-ledgers**: Claim—*Evidence grades for every measured claim*. Evidence—U-ledgers. Contradiction—The paper (prose) ignores the U-verdicts (data). **Verdict: Coherence failure.** Fix: Sync §5-8 with `src/evidence/decomp` verdicts.

--- R4 ---
1. **Claim: Arch-sufficiency (P1).** Evidence: U64b (20/20). Contradiction: U58 (Underpowered) and U59 (Floor-fail). Assumption: Substrate adequacy is binary. Dependency: P1 depends on U64b, but ignores U58/U59's failure to manufacture competence without external prompts. **Fix: Reclassify as "conditional sufficiency."**

2. **Claim: Autonomous Nursery (P2).** Evidence: U64e/h (Oracle-only). Contradiction: Sensor 0 triggers (U64e) and zero-triggers in senMax/senPick (U64h). Assumption: Oracle-guided success equals "from scratch" learning. Dependency: P2 depends on the assumption that oracle-prompted weights equal self-generated curriculum. **Fix: Qualify "from scratch" as "oracle-dependent."**

3. **Claim: Measured Evidence (P6).** Evidence: `RESULTS_INDEX.md`. Contradiction: P4 (§7 TBDs) confirms challenger tracks and interpreters are unbuilt/unrun. Assumption: P6 covers all claims, but P4 admits gaps in the "measured" chain. Dependency: The validity of §7 depends on the missing "causal readout." **Fix: Explicitly list P4's TBDs as "unmeasured."**

--- R5 ---
1. **Claim: Arch-sufficiency (P1).** Evidence: U64b (EDGE-E1 20/20). Conflict: U58 (Underpowered) and U59 (Floor-fail) suggest the substrate cannot manufacture competence without an oracle. Assumption: Success in isolated EDGE-E1 generalizes to "sufficiency." Fix: Recast as "conditional sufficiency" given an external signal.

2. **Claim: The Nursery/Self-Learning (P2).** Evidence: U64e (Reset functional) and U64h (Loop-O 17/20). Conflict: U64h is "ORACLE-ONLY"; the model learns *when told*, not from the "open world." Assumption: Oracle-guided recovery equals autonomous learning. Killer test: Remove the oracle; if U64e/h collapse to U64d (Both-dead), the nursery is a puppet, not a creator.

3. **Claim: Evidence Integrity (P6).** Evidence: `RESULTS_INDEX.md`. Conflict: P4 reveals critical components (challenger track, interpreter) are "un-runnable" or "unbuilt." Assumption: P6's "measured claims" cover the gaps in P4. Fix: Explicitly label P4 gaps as "Hypothesized" rather than "Measured."
