<!-- provenance (2026-11-18 reorganization, user-ordered): promoted byte-verbatim from scratch/next-gameplan.md (private scratch draft, unpushed by design). Content below this line is untouched. Full borrow-gameplan prose also lives durably in the src/CHATLOG.md 2026-11-16 audit-log entry per the user-ordered full-content rule. -->

# TEMPORARY next-gameplan — science frontier after machinery close-out (DRAFT, not countersigned)

Status: TEMPORARY working breakdown in `scratch/` (unpushed, not part of the bench). Nothing here amends GAMEPLAN v22 (FROZEN — amendments only as DRAFT addenda + countersign first). No implementation started; no compute authorized.
Handoff: this file + CHATLOG 2026-11-16 entry "temp next-gameplan + handoff" + transcript tail = full context for the next session. Start there.

## Where we stand (2026-11-16, commit ec122da)
- Machinery DONE: forensics kernel (`src/tools/forensics.js`, self-test 11/11), `src/claims.md`, 3 rules live in GAMEPLAN (2.a.v, 2.d.v, version-bound Conventions), first gated run 2026-11-16-01 PASS.
- Science DONE: ix chapter closed (PILOT-FAIL 0.4936 + W1/W3 diagnostics + Runs B/C + sign-flip + susp-hu, all filed, mostly CONFIRMED).
- Live thread: suspicion-killHu boundary (pooled 0.5572; 0.63–0.81 where brains competent, 0.32–0.43 where systematically wrong) — quarantined observation, paper claims BLOCKED until confirmatory data (prereg v1.0 DRAFT: `src/evidence/synthesis/phase-1dsusp-hu-prereg.md`).

## Objective
Confirm or kill the suspicion-killHu boundary on fresh brains under the new rules (first live gated run with unknown outcome: 2.d.v runId+fingerprint from birth, 2.a.v gate on live data, version-bound approvals throughout).

## Recommended path (needs user: countersign + compute call)
1. Countersign `phase-1dsusp-hu-prereg.md` v1.0 (or amend → re-review). Blocks everything below.
2. Decide brain-training budget: fresh brains outside 5001–5024 (prereg specifies N; training = afternoon-scale cost). Authorize explicitly.
3. Train fresh brains (same killHu constructor + frozen ix-susp-hu recipe — no new design).
4. Run under 2.d.v (runId + fingerprint in ledger + CHATLOG) through 2.a.v gate (register: validation-gate, values-intact, grain-present, rule-vs-verdict checks) → verdict + signoff record.
5. Verdict handling: PASS → paper claim unquarantined (bounded: competence-regime only); KILL/INCONCLUSIVE → filed as-is (negative results are results); either way claims.md row + RESULTS_INDEX update.
6. Push (gate applies to the push pile too: signoff over the filed verdict before next push per 2.a.v).

## Alternatives (ranked, with verdicts)
- A. Embed forensics checks into frozen drivers now (authorized, code-only, no compute). Verdict: good quiet-day work, zero discovery — do only if blocked on the recommended path.
- B. Paper 2.e advance past current state. Verdict: REFUSED until confirmatory data lands (killHu quarantined; writing around the hole violates paper-claim rule in prereg).
- C. Unpark item 3 (snapshot annex) / x-ablation W2. Verdict: REFUSED without new evidence (parked for demonstrated lack of need; unparking = sprawl the gates were built to refuse).

## Gates on this gameplan
- Per-item motivating-failure rule (standing): each step must cite the failure it fixes or be dropped. Here: quarantined paper claim (blocked §4.4 row) + unaudited-approval risk on new data.
- No GAMEPLAN.md edit without separate countersign (this temp plan is not an amendment vehicle).
- First run under new rules is also the rules' first meaningful test — if 2.a.v/2.d.v chafe on live data, file the friction, don't silently bypass (OVERRIDE with note or amend the rule, both need countersign).

## Decisions owed by user (checklist)
- [ ] Countersign killHu prereg v1.0 (as-is or amended)
- [ ] Fresh-brain compute budget (N brains outside 5001–5024)
- [ ] Confirm recommended path, or pick alternative A (or redirect)
