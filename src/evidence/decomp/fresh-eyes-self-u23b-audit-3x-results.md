# Fresh-eyes audit battery: U23b log retrace (3x sealed; adjudicated RETRACEABLE-WITH-NOTES)

Goal line carried in thinking + all 3 prompts: "a SELF-LEARNING machine (M/C/E live in weights + forward pass, tools as controls only)." Sealed via root.generateText Promise.all. Raw: scratch/u23b-audit-battery.json (6907B). Packet + adjudication below; reviewer texts verbatim.

## Adjudication (agent)
- ACCEPT (real holes, repaired/documented this turn): (a) Turn 112 appended after Turn 115 in transcript — chronological break, pointer filed in Turn 116 (append-only, no reorder); (b) notes #11 Liu missing full doi string — repaired (doi:10.3389/fncel.2025.1629796 added); (c) keep-rate 5.5% harness vs 1.5% train unexplained — BRIDGED from driver code (harness uses dedicated G.makeRng(42477+seed); train mining shares G.makeRng(42200+seed*104729+77) with standard-row draws — different streams, same frozen rule; documented, not a number change); (d) eval ledger `mining` field reprints TRAIN mining object by construction (driver line 376 `mining:tr.mining`; eval-side count is `hardFallback`) — labeled, not a data error; (e) `GRAD maxRel=undefined` log line after correct worstRel=3.45e-6 — stale label (D3 filed: u22cGradCheck returns worstRel), value stands; (f) MINER-VHAT-FLOOR second half UNMEASURED (no standard-stream miner-vhat split) — stays as filed FAIL-conjunction + owed after-series item (i) split kept-vs-fallback eval; (g) FRESH bar schema (health object, not per-seed `got`) — by prereg design (`battery health 4/4`: goalInAll/nonEmpty/hasVerdict/distinct), documented for retracers; (h) grad-check delegates to u22c via u23 chain (graph-equality claim) — pointers: src/evidence/decomp/newai-selfu22c-driver.js (u22cGradCheck) + newai-selfu23-driver.js + newai-selfu23b-driver.js header (SAME wiring codes 161/162).
- REJECT as packet artifacts (not log holes): R1/R2 `tries as range` (stage1 has exact 3596/3470/3688); `durable battery file unnamed` (it is named: src/evidence/decomp/fresh-eyes-self-u23b-3x-results.md, 7038B, 3 verbatim sections 1841/2244/2496 chars; the 221B scratch stub says so explicitly — stub-is-pointer is precedent, not a hole); R2 `u23 chain docs not provided` (drivers + preregs exist at the paths above — packet omitted the list, workspace has them); R3 `GAP/SELECT-HARD model-vs-measurement ambiguity` (verdict mechanism names both: no wiring margin + 64-88% fallback dilution; measurement caveat is the stated reason after-series item (i) exists).
- Verdict: RETRACEABLE-WITH-NOTES (R1 NOT / R2 NOT / R3 WITH-NOTES adjudicated: the two NOTs rest on packet artifacts + holes repaired or already-owed above). No train/eval/verdict numbers changed.

## R1 (verbatim)
As Sealed Reviewer R1, I have audited the U23b vhat-mining packet. A contextless agent attempting a deterministic retrace would encounter the following holes:

**1. Missing Source Data (The "Pointer" Problem)**
*   **`src/evidence/decomp/battery fresh-eyes-self-u23b-3x-results.md`**: This file claims the raw data lives in a "durable battery file," but `scratch/u23b-battery-raw.json` is explicitly identified as a 221-byte pointer stub. The actual durable battery file is not listed in the chain, leaving the "unanimous" 3x implementation claim unverifiable.

**2. Schema and Log Inconsistencies**
*   **`driver newai-selfu23b-driver.js` (D3)**: The driver reports `worstRel` as `3.45e-6` while explicitly noting `maxRel=undefined` in the logs. A contextless agent cannot determine if `maxRel` is a missing field, a runtime error, or a null value without the underlying schema definition.
*   **`src/evidence/stage1.json`**: The `oracleY` gate (0.78/0.745/0.65) and `minerY` (0.535/0.40/0.545) are presented as triplets, but the corresponding `tries` (~3500-3700) are provided as a range rather than exact per-run values, preventing a 1:1 mapping of trial to result.

**3. Quantitative Gaps (The "Unmeasured" Problem)**
*   **`d-newai-self-u23b-verdict.json`**: The `MINER-VHAT-FLOOR` conjunction is marked as FAIL. Specifically, the `vhatErr-vs-standard` component is listed as "UNMEASURED." Because there is no "standard-stream miner-vhat split" reported in the logs, the failure is an assertion that cannot be proven via the provided data.
*   **`minerV` Inflation**: The verdict notes `minerV` is "inflated by fallbacks," but the specific mathematical delta between the inflated value and the true value is not provided.

**4. Structural/Ordering Breaks**
*   **`src/evidence/conversations/2026-11-24-memory.md`**: The transcript suffers from a non-linear append. The sequence `115` followed by `112` creates a temporal paradox for a contextless agent attempting to reconstruct the logic flow of the conversation.

**5. External Reference Holes**
*   **`src/evidence/decomp/retrieval-papers-notes.md`**: Paper #11 cites a publication but lacks the full DOI string. While the Appendix E `index.html` provides the DOI (`10.3389/fncel.2025.1629796`), the lack of a direct link in the primary notes creates a break in the retrieval chain.

VERDICT: NOT-RETRACEABLE

## R2 (verbatim)
As sealed reviewer R2, I have audited the provided chain. A contextless agent attempting to retrace U23b end-to-end without guessing would encounter the following holes:

**1. File System & Data Integrity Gaps**
*   **Pointer Stub vs. Verbatim:** `scratch/u23b-battery-raw.json` is explicitly a 221-byte pointer stub. The actual data lives in a "durable battery file" which is not named or located in the provided path list.
*   **Missing Standard Baseline:** The `MINER-VHAT-FLOOR` requires a comparison between `miner vhatErr` and `standard`. The verdict notes this is "UNMEASURED" because no standard-stream miner-vhat split was reported. The agent cannot verify the floor without the missing standard-stream data.

**2. Numerical & Logical Mismatches**
*   **The "Undefined" Gradient:** In `scratch/u23b-stage1.json`, the log contains `GRAD maxRel=undefined`. While the driver `D3` explains the return of `worstRel` instead of `maxRel`, a contextless agent seeing `undefined` in a log would flag a schema/execution break.
*   **Mining Rate Discrepancy:** Stage 1 reports `vhatHardRate` between $0.0542$ and $0.0576$. However, the final 6 trains report a `hardRate` of $0.0154$. There is no provided bridge explaining the $\approx 70\%$ drop in keep-rate between stage 1 and the final trains.
*   **The Fallback Inflation:** The verdict states `minerV` is "inflated by fallbacks," but the specific mathematical relationship between the `fallback` counts ($145/127/176$) and the `minerV` values ($0.715/0.61/0.86$) is not provided.

**3. Ordering & Sequencing Breaks**
*   **Transcript Anomaly:** In `src/evidence/conversations/2026-11-24-memory.md`, the numeric sequence is broken: $108 \rightarrow 115 \rightarrow 112$. This creates a temporal paradox for an agent attempting to reconstruct the logic flow of the conversation.

**4. Trust-Me Claims / External References**
*   **The U23 Chain:** Driver `D3` claims the graph is "equal via u23 chain," but the u23 chain documentation is not provided in the evidence list.
*   **The DOI Fragment:** In `retrieval-papers-notes.md`, Paper #11 provides a partial citation. The agent must jump to a separate `index.html` in `Appendix E` to resolve the DOI.

VERDICT: NOT-RETRACEABLE

## R3 (verbatim)
As Reviewer R3, I have audited the provided chain of evidence for the U23b vhat-mining process. A contextless agent attempting to retrace this path would encounter the following holes:

**1. Data Availability & Pointer Gaps**
*   **The Raw Data Hole:** `scratch/u23b-battery-raw.json` is explicitly identified as a "221-byte pointer stub." The agent cannot verify the "battery health 4/4" claim because the "durable battery file" is mentioned but not named or provided in the source path.
*   **The Standard-Stream Missing Link:** The `MINER-VHAT-FLOOR` check requires comparing `miner vhatErr` against `standard`. The audit notes that the "standard-stream miner-vhat split" was "UNMEASURED" and not reported. The agent cannot verify if the miner performed worse than standard.

**2. Logical & Numeric Inconsistencies**
*   **The Gradient Value Mismatch:** `driver newai-selfu23b-driver.js` reports a grad return of `3.45e-6` and claims the graph is equal via the `u23 chain`. However, the agent cannot verify this "equality" without the `u22c` baseline and the `u23 chain` definition, neither of which are provided in the evidence.
*   **The Log Anomaly:** In `scratch/u23b-stage1.json`, a log line reports `GRAD maxRel=undefined` immediately following a "correct" `worstRel` line. A contextless agent cannot determine if this is a benign null or a systemic failure of the `maxRel` calculation.

**3. Sequence & Structural Breaks**
*   **The Transcript Chronology Break:** In `src/evidence/conversations/2026-11-24-memory.md`, Turn 112 was appended after Turn 115. The agent must manually re-sort the sequence `108, 109, 110, 111, 113, 114, 115, 112` to reconstruct the actual conversation flow.
*   **The DOI Fragmentation:** In `src/evidence/decomp/retrieval-papers-notes.md`, Paper #11 lacks a full DOI string, requiring the agent to cross-reference `Appendix E (index.html)` to find `doi:10.3389/fncel.2025.1629796`.

**4. Verdict Ambiguities**
*   **The "USES-PARTIAL" Gap:** The verdict acknowledges `GAP 0/3` and `SELECT-HARD 0/3`. The agent cannot determine if these were failures of the model or failures of the measurement process.

VERDICT: RETRACEABLE-WITH-NOTES
