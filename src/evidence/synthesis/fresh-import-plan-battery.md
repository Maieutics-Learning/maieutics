# Fresh-eyes battery: borrow-gameplan import plan (2026-11-16)

Battery: 4 sealed reviewers, disjoint briefs (R1 failure-mapping, R2 scope-smuggling, R3 independence-reflexivity, R4 sixth-item trial), <=150 words each, verdict + hardest test/falsifier. Shared prefix-cache-friendly premise: scratch/fresh-import-premise.md. Ran via 4 parallel root.generateText calls (one execute_js).
Caveat (user-ordered, in-premise): reviewers are the SAME model as the plan author — output graded as assumption-hunting/checklist, NOT independent confirmation. The genuinely independent anchor is the outside review (src/evidence/reviews/2026-11-16-aar-ariadne-external-review.docx).

## Raw replies (verbatim)

### R1
1. KILL — No recorded failure in registry/signoff tracking.
2. KILL — No demonstrated run-discipline collision/overlap.
3. KILL — No documented state-corruption event from lack of SHA-256.
4. KEEP — Fixes "artifact drift" (provenance loss in current synthesis).
5. KILL — Reframing is a process change, not a fix for a specific failure.
6. KEEP — Fixes "inherited approval" errors where v.X approval was applied to v.Y.

**Verdict:** Not sound. The plan is "borrowing" for the sake of robustness rather than reacting to evidence. It is a feature-creep exercise disguised as a failure-gate.

**Hardest Falsifier:** If the researcher cannot produce a log of two specific instances where "inherited approvals" (Item 6) led to a scientific error, the entire import is unjustified.

### R2
1. **Verdict**: Bloated. Items 1, 2, and 4 risk importing "organizational ghost-ware" (registry/fingerprint/atlas) that forces Maieutics into a larger administrative framework than its scale requires.

2. **Worst Risk**: Item 4 (Claim Atlas). It smuggles a "provenance/rivals" state-model. This isn't a tool; it's a database schema for a larger organization, risking "administrative overhead" where the researcher spends more time updating the atlas than the science.

3. **Fix**: Replace the "Atlas" with a simple `claims.md` flat-file. Map `Claim -> Artifact -> Status` as a markdown table, not a JS tool.

4. **Hardest Test**: The "Zero-UI" check. If Item 1 (Forensics) or Item 4 (Atlas) requires a specific state-manager or UI component to be functional, it is a framework-smuggle and must be rejected.

### R3
1. **Verdict:** The tribunal→checklist reframe is logically sufficient to remove the *illusion* of independent confirmation, but it does not remove the *shared blind spot* of the model's reasoning.

2. **Residue:** Item 6 (version-bound decisions) and Item 4 (claim atlas) still rely on the model's internal definition of "evidence" and "provenance." If the author and reviewer share a hallucination about what constitutes a "demonstrated failure," the borrow-plan will be approved despite lacking a real-world trigger.

3. **Hardest Exposing Check:** Compare the "demonstrated failure" cited for each item against a raw, un-summarized system log. If the "failure" is described in a narrative summary rather than a specific error trace/stack dump, the agreement is likely a product of shared framing (semantic agreement) rather than empirical evidence.

### R4
1. **Verdict**: ADOPT.
2. **Reasoning**: It addresses a distinct failure mode (decision drift/approval leakage) that run fingerprinting (which tracks execution context, not the logical binding of a decision to a specific evidence set) does not solve. It is minimal as it defines a metadata requirement, not a new system.
3. **Discriminating Check**: Attempt to "grandfather" an approval from Gameplan v21 into a v22 amendment; if the system allows this without a re-verify flag, the failure is demonstrated and the item is necessary.

## Adjudication (assistant owns the verdict)

- R1 KEEP 4 / KEEP 6: ACCEPT. Raw-log grounding: item 4 ← R1-queue reconciliation + stale-record repairs in CHATLOG (demonstrated drift); item 6 ← live process gap, our amendment approvals live in chat with no version stamp (grandfather-check runnable today).
- R1 KILL 1: PARTIAL. Kill too strict: demonstrated near-misses exist in raw log — pooled-metric grading of a per-brain effect (ix-signflip expectation error, filed) + B-switch honesty correction (filed). KEEP 1 narrowed, must cite these traces.
- R1 KILL 2: PARTIAL. Demonstrated operational need in raw log: 3 message-limit kills absorbed via checkpoint resumes during ix waves (CHATLOG 05:56/10:22 entries) — run-identity discipline is load-bearing. KEEP runId/fingerprint; DROP "quiet" (unmotivated).
- R1 KILL 3: PARTIAL → PARK. No corruption event suffered; reviewer rule binds. Item 3 to backlog, not active plan.
- R1 KILL 5: REJECT as kill (category error — 5 is a restraint already in force, not an insertion). Record as standing rule, remove from insertion list.
- R1 verdict ("feature-creep disguised as failure-gate"): PARTIAL — taken as calibration pressure, answered by the keeps/kills/parks above, not by defending the plan wholesale.
- R1 falsifier (2 inherited-approval error instances): REJECT as stated (over-strict — process-gap + 1 live grandfather-check suffices for a metadata rule), logged.
- R2 verdict + atlas fix + Zero-UI check: ACCEPT. Item 4 demoted to flat-file `claims.md` first (JS tool only if flat file demonstrably fails); Zero-UI check adopted as gate for items 1 & 4.
- R3 verdict + residue + raw-log check: ACCEPT. Raw-log citation required per kept item (done above); battery weighted as checklist with outside review as independent anchor.
- R4 ADOPT + reasoning + grandfather-check: ACCEPT in full.

## Net decision (active plan)
- ACTIVE: 4 (flat-file first), 6 (version-bound decisions, minimal metadata rule), 1 (kernel-only + Zero-UI), 2 (runId/fingerprint only).
- PARKED: 3 (backlog). STANDING RULE (not insertion): 5 (checklist + independent-reviewers-only).
- New gates: per-item raw-log failure citation; Zero-UI check on 1 & 4.
- Score: 4 reviewers, ~9 accepts/partials, 2 rejects, 0 reviewer factual errors (all argued from current premise — premise hygiene held).
