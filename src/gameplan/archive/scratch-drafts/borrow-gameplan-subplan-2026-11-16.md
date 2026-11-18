<!-- provenance (2026-11-18 reorganization, user-ordered): promoted byte-verbatim from scratch/borrow-gameplan-subplan.md (private scratch draft, unpushed by design). Content below this line is untouched. Full borrow-gameplan prose also lives durably in the src/CHATLOG.md 2026-11-16 audit-log entry per the user-ordered full-content rule. -->

# TEMPORARY sub-gameplan — borrow-gameplan breakdown (DRAFT, not countersigned)

Source: chat-filed insertion gameplan ("borrow-gameplan", user-authorized deep dive 2026-11-16, no new compute).
In GitHub: NOT a standalone file — logged only as `src/CHATLOG.md` entry "borrow-gameplan filed" + `src/evidence/conversations/2026-11-16-memory-layer5.md` paragraph, both in commit `0d2ea56` (parent `2d6c9705`).
Status: TEMPORARY working breakdown in `scratch/` (unpushed, not part of the bench). Nothing here amends GAMEPLAN v22 (FROZEN — any real amendment needs DRAFT addendum + countersign first).
 Battery result (2026-11-16, 4 sealed same-model reviewers + outside review as independent anchor; full record src/evidence/synthesis/fresh-import-plan-battery.md): ACTIVE = 1 (kernel-only), 2 (runId/fingerprint only, quiet dropped), 4 (flat-file FIRST, tool only on demonstrated failure), 6 (version-bound decisions — ADOPTED). PARKED = 3 (backlog). STANDING RULE, not insertion = 5. New gates: per-item raw-log failure citation; Zero-UI check on 1 & 4.

Sequence: forensics-first (1 → 2 → 4 → 6; 3 parked; 5 in force throughout). Order matters: gates before discipline before atlas.

## Implementation record (2026-11-16, user-authorized "implement the gameplan")
- Pre-step research check: nothing external — all artifacts in-house (GAMEPLAN, RESULTS_INDEX, ix tools, AAR/Ariadne zips already inspected). Recorded, moved on.
- Item 1 DONE: `src/tools/forensics.js` (registerCheck/runChecks/evaluateGates/recordSignoff, fail-closed, OVERRIDE-needs-note, PASS-over-KILL refused) + self-test 11/11 green in worker + static Zero-UI scan clean. Frozen-driver wiring waits for 2a-v countersign (correct sequencing).
- Item 2 DONE (rule): `src/evidence/addenda/2d-v-run-discipline.DRAFT.md` (runId + fingerprint; quiet dropped). First run under it logs both.
- Item 4 DONE: `src/claims.md` (flat table, rival-or-incomplete rule, hand cross-checked vs RESULTS_INDEX at creation). Tool only on demonstrated failure.
- Item 6 DONE (rule): `src/evidence/addenda/conventions-version-bound-approval.DRAFT.md` + grandfather thought-test → gap CONFIRMED (approvals live in chat prose; nothing mechanical stops v21→v22 grandfathering).
- Item 5: standing rule in force (no file). Item 3: parked (no action). v22 untouched — countersign owed before any GAMEPLAN.md edit.

## 1. Forensics kernel (first)
- Source: Ariadne `app.js` forensics / autoChecks / killGates / signoff (from `scratch/generators/q31ibn1io8/`).
- Target: NEW `src/tools/forensics.js` + GAMEPLAN `2.a.v` / `2.e.iv` gate addenda (DRAFT, countersign before edit).
- Sub-steps: (a) extract minimal kernel (checks registry, kill-gate evaluator, signoff recorder — no UI, no chains); (b) write `src/tools/forensics.js` with header artifact map; (c) draft `2.a.v` (run-gate: forensics signoff required before verdict) and `2.e.iv` (kill-gate semantics) as DRAFT addendum text; (d) wire one existing frozen driver through it read-only as smoke test (no verdict changes).
- Done when: kernel file exists, addendum drafted, smoke test passes without touching frozen verdicts.
- Battery (R1/R2): KEEP narrowed. Motivating failures (raw log): pooled-metric grading of a per-brain effect (ix-signflip expectation error, filed) + B-switch honesty correction (filed). Zero-UI check: no state-manager/UI dependency or REJECT.

## 2. Reduced tribunal — REMOVED as insertion, STANDING RULE instead (battery R1/R3)
- Was: Ariadne `review.js` tribunal → `2.e` config. Ruled a category error (a restraint, not an insertion) + same-model 3-roles-1-model is not independent confirmation.
- Rule in force: borrow checklists only; multi-reviewer steps use genuinely independent reviewers (outside sources / external calls), never 3-roles-1-model. This very battery counted as checklist only (outside review = independent anchor).

## 3. Claim atlas (third) — FLAT FILE FIRST (battery R2)
- Source: insertion plan item (4); synthesis-side.
- Target: `src/claims.md` markdown table (claim → artifact → status + rivals) + synthesis doc. `claim-atlas.js` tool ONLY if the flat file demonstrably fails.
- Sub-steps: (a) flat table from RESULTS_INDEX + verdict docs; (b) synthesis doc lists every open claim with file pointers; (c) hand cross-check table vs RESULTS_INDEX. Zero-UI check: no state-manager/UI dependency or REJECT.
- Motivating failure (raw log): R1-queue reconciliation + stale-record repairs in CHATLOG (demonstrated drift).
- Done when: table matches RESULTS_INDEX on all rows.

## 4. Run discipline (fourth) — runId/fingerprint ONLY (battery R1)
- Source: AI Lab `controller.js` runId / fingerprint / quiet (from `scratch/generators/4ofg5v2mmw/`).
- Target: GAMEPLAN `2.d.v` addendum (DRAFT).
- Sub-steps: (a) runId scheme (date-tag + counter) + fingerprint (input-hash + code-hash logged per run); (b) draft `2.d.v` addendum; (c) apply to next authorized run only. Quiet mode DROPPED (unmotivated).
- Motivating failure (raw log): 3 message-limit kills absorbed via checkpoint resumes during ix waves (CHATLOG 2026-11-16 05:56/10:22) — run-identity discipline is load-bearing.
- Done when: addendum drafted; first run under it logs runId + fingerprint.

## 5. Snapshot hash/merge — PARKED to backlog (battery R1: no corruption event suffered)
- Was: Ariadne `memory.js` snapshots → memory Ops annex. Parked per motivating-failure gate. If revived: SHA-256 (never DJB2) + propagated errors (never empty catches) — reviewer's "fix before use" binds.

## 6. Version-bound decisions (ADOPTED, battery R4 + outside review priority 2)
- Rule (minimal metadata, not a system): an approval binds to the exact evidence/plan version reviewed; new versions need re-verify, no inherited approvals. Distinct from item 4 fingerprinting (execution context vs logical binding).
- Motivating gap (raw log, live): amendment approvals live in chat with no version stamp — a v21 approval can grandfather into a v22 amendment today with no re-verify flag.
- Done when: DRAFT addendum drafted; one grandfather-check (v21 approval → v22 amendment must raise re-verify flag).

## Explicit NON-insertions (do not pull)
lit providers, thesis/autopilot/department, whole chains, decisions module as a whole, tome machinery, LaTeX flow.

## Constraints (binding)
- GAMEPLAN v22 FROZEN: all gameplan changes as DRAFT addenda + user countersign BEFORE editing v22.
- No new `{import:...}` plugin imports.
- U8 (memory carve-out) respected; this file stays in `scratch/` (temp) unless user orders promotion.
- No new compute authorized yet — this is breakdown only, no implementation started.
