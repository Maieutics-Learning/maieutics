# F14 battery r8 (scope: any second variable smuggled in)

1. **Verdict:** NEEDS-PATCH.

2. **Hardest Falsifier:** The "Replication Sanity" check (Train-Clean vs. Filed F12) is insufficient to prove the absence of smuggled variables if the weights were modified *after* F12 but *before* the F14 run. Since F14 changes the evaluation logic (the "read point") but not the training objective, any "improvement" in results could be attributed to the new metric rather than the intervention. To falsify the claim that training is F12-exact, you must provide a **cryptographic hash (SHA-256) of the model weights** generated immediately after the F12/F13 runs and compare them to the weights used in the F14 evaluation. Without weight-level provenance, "same-engine" is a narrative claim, not a technical constraint.
