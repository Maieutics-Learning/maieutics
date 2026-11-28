# F16 v1.1 re-close re4 (NEEDS-PATCH — implementability)

**Verdict: NEEDS-PATCH**

**Blocking Issues:**
1. **Non-Enforceable "Procedure-Identity":** G3 and Section 6(c) claim "same inits" via RNG seeds (90000+s), but explicitly state H128 is "NOT bit-identical" to H64. A reviewer cannot verify "procedure-identity" via driver logs if the resulting weight hashes are expected to differ. This is an assertion, not a checkable constraint.
2. **Unfamiliar Oracle Dependency:** The "unfamiliar-context" eval relies on a new oracle (d-u70-oracle-f16-unfam.json). The proposal does not specify the verification method for this oracle's ground truth, making the UNFAM-GENERALIZES verdict uncheckable by an external reviewer.
3. **Ablation Proof Gap:** T10e asserts weight hashes are identical pre/post ablation. However, "z-zero" and "h-cut" are described as "read-only branches." If these are implemented as runtime masks/overrides rather than weight modifications, the hash check is trivial/redundant and does not prove the weights remained frozen.

**Implementability:**
- **Enforceable:** Flag isolation (grep), per-arm config specs, T10b (step-count), T10f (retention).
- **Non-Enforceable:** G3 "procedure-identity" (since bit-identity is explicitly waived).
