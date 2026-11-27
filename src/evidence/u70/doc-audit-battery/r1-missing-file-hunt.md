=== R1 [missing-file hunt: which step's artifact pointer is weakest] ===
1. VERDICT: NEEDS-PATCH

2. FAILURE: Step 6 (U70 prereg battery) points to `prereg-battery/` and `fresh-eyes-u70-prereg-v1-results.md` without specifying the file-naming convention for the "barrage" (individual reviewer files). A contextless agent will find the directory but fail to locate the specific verbatims/briefs required to verify the "5 patch groups" mentioned in the verdict, as no regex or naming pattern is provided for the contents of `prereg-battery/`.

3. FIX: Append a naming pattern for battery files in the "Battery / premise / ledger conventions" section (e.g., "Battery files follow `r[1-10]-verdict.md` pattern").
