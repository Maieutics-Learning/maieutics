=== R3 [battery/ledger conventions: what would you misfile] ===
1. VERDICT: NEEDS-PATCH

2. FAILURE: The "Verdict Chain" (Step 2) creates a critical ambiguity for a contextless agent. It lists a sequence of closeouts from `Wave 1` through `F10`, where `F4` and `F10` are marked "FIXED" while others "PERSIST." A reader will likely misinterpret "FIXED" as the global state of the U70 project, rather than a specific result for a narrow sub-experiment (F4/F10). This leads to an incorrect verdict on the overall system's stability.

3. FIX: Replace the "Verdict Chain" list with a Summary Table containing three columns: `Experiment`, `Final Verdict`, and `Primary Ledger`. Explicitly label the "FIXED" status as "Symptom Resolved" or "Metric Met" to distinguish it from a global system "FIX."
