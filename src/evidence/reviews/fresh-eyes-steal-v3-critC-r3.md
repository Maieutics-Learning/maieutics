--- C3-R1 ---
1. **Verdict:** The subpoints are logically sequenced. Starting with the survey (C1) provides the necessary taxonomy to categorize the "closest work" (C2) and "tangential" theory (C3), preventing the "rabbithole" from becoming a directionless wander.

2. **Biggest Risk:** The "Novelty-Claim Risk." If the Looped-LM survey or the "Old 2.5 list" contains a direct precursor to the "staged hint fading" or "G5 student-teaching" architecture, the paper's core claim shifts from *invention* to *implementation*. There is currently no explicit trigger for an immediate "Pivot/Rewrite" of the draft if a "killer" paper is found.

3. **Improvement:** Add a "Novelty Conflict" flag to the USED/SKIPPED verdict. If a paper is marked `USED-CONFLICT`, it must trigger an immediate update to the draft’s Related Works section to pre-empt the reviewer, rather than waiting for v0.14.
--- C3-R2 ---
**Goal:** Execute "the steal" across three tracks: (A) porting Perchance/agent tools, (B) mapping free-tier GPU/LLM quotas to a "consult-coin" router, and (C) an aggressive literature sweep to refine the paper’s novelty claims.
**First Actions:** 
1. Fetch Perchance plugins directory.
2. Compare two GPU quota pages to pin numbers.
3. Retrieve the Looped-LM survey and Model Collapse paper.

**Ambiguities/Blockers:**
1. **"Consult-coin" exchange rate:** It is unclear how a "token" from Gemini is weighted against a "token" from Groq within the coin system.
2. **The "Laptop" Baseline:** Since the h48 CPU bench is "host-variable," the baseline for "beating a laptop" is a moving target.
3. **v0.13 vs v0.14:** The transition from "draft" to "extended with findings" implies a rewrite of the novelty section, but the specific "novelty claims" being protected aren't listed.

***

**Track C Critique**
1. **Verdict:** The subpoints are logically sequenced (Broad $\rightarrow$ Narrow $\rightarrow$ Contrast), ensuring the "Looped-LM" survey provides the necessary taxonomical frame before diving into specific papers.
2. **Biggest Risk:** "Novelty-claim risk." If C1 or C2 reveals a direct overlap with the "staged hint fading" or "generations of students" method, the paper's core contribution could be downgraded from "novel" to "incremental" without a clear pivot.
3. **Improvement:** Add a "Novelty Delta" column to the `papers.md` file. Instead of just `USED/SKIPPED`, explicitly record: *"Paper X does [A], but our method does [B], therefore our claim [Y] still holds."* This prevents the "rabbithole" from becoming a passive reading exercise.
--- C3-R3 ---
1. **Verdict:** Subpoints C1–C5 are logically sequenced. Moving from a broad survey (C1) to specific competitors (C2) and then to theoretical tensions (C3) ensures the "novelty" claim is stress-tested before the final sweep (C4). The USED/SKIPPED binary is a necessary operational constraint.

2. **Biggest Risk:** "Novelty Erasure." There is a high risk that C2 or C3 contains a method that mirrors "staged hint fading" or "student-teaching-students" under a different name (e.g., "recursive bootstrapping"). If found, the paper draft v0.13 must pivot from *claiming* novelty to *positioning* the work as a verification of those theories.

3. **Improvement:** In C3, explicitly create a "Conflict Table" comparing the predicted decay of "Model Collapse" against the observed stability of G5. This turns a potential blocker into a primary contribution of the paper.