# F14 re-close re2 (re-close early-HALT: does per-seed ordering stop a bad wave)

**VERDICT: NEEDS-PATCH**

1. **Residual:** The "Independent Recompute" (T8b) is logically sound but the **Early-HALT** mechanism is critically underspecified. You claim per-seed `train -> clean -> check` prevents "bad waves" without adding judgment, yet you provide no formal halting criterion (e.g., a specific threshold of failures before the entire wave is voided). Without a hard-coded failure limit, "HALT" becomes a discretionary judgment call, smuggling a second variable into the execution phase.

2. **Technical Critique:** 
    - **Replication Sanity:** Expecting exactly 0 mismatches on CPU Float64/mulberry32 is sound.
    - **Intervention:** T7/T8b effectively isolate the metric path from the helper. 
    - **Oracle:** Reusing F13's ceiling is acceptable as the intervention is eval-only.
    - **Held-out:** Seeds 20..39 remain valid provided the "no-learning-at-eval" gloss is strictly enforced via the read-point boundary.

**Hardest Falsifier:** A "pass" on T8b that still exhibits a gap $\ge 0.05$ on the TRUE metric would invalidate the C2-partial diagnosis, proving the leak is not just a coding error but a structural model failure.
