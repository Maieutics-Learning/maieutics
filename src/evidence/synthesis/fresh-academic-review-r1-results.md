# External academic review R1 — adjudication (2026-11-16, filed no-new-compute)

Source: `scratch/message-attachments/Maieutics_Academic_Review.docx` (raw text: `scratch/review-ext.txt`, 31,589 chars).
Reviewer: external, static inspection of a full-workspace ZIP (`maieutics-main(3).zip`), no code executed.
Standing: this review is conceptual challenge (fresh-eyes class), NOT empirical replication — per the three-level
taxonomy it asks for (criticism / re-analysis / reproduction), it is level 1. Graded below per claim.

## Verdicts on the review

- Overall verdict (Promising / Substantial / Good-foundations / Not-established / Unproven / Further-work + Continue-narrow-reproduce): **ACCEPT**. Matches our own scoreboard: Phase 1 exit unmet, 2.a/2.e open, claims regime-bound.
- P1 reproduce-35/40-first: **ACCEPT** (== gameplan 2.a i–iii; G-series re-ledger unbuilt; bit-exact gates certify pipelines, not the G chain). Already planned, no new design needed.
- P2 mechanism controls + single-student-fading: **STALE** — F-singlegen already ran at full power (8 seeds × G/S × 5 gens; G 28/32, S 29/31; O2 holds; claim re-scoped to schedule design; draft §8.6). The reviewer's central "what if one student suffices" is answered. Remaining: 1.a arms (attn-only / constant-combined / instant-drop). Action queued: surface O2 in abstract/§5 (reviewer read v0.15 and still wrote P2 as unrun — our surfacing failed, not their reading).
- P3 one genuine cross-family experiment: **ACCEPT** (== 1.c parity pilot→full). Already planned.
- P4 split Research A / Research B papers: **PARTIAL** — agree the threads have different evidential requirements (already our detector/challenger/interpreter split, §4.4). REJECT split-now: venue decision for 2.e; single draft with §4.4 marked is defensible for preprint. Queued as 2.e call for the user.
- P5 doc sync + status index + AI provenance + licensing: **ACCEPT** with one correction — `scratch/CURRENT_TASK.md` is private scratch (never ships with the generator; reviewer saw it only because the ZIP was a full workspace export). Durable record is `src/CHATLOG.md` + GAMEPLAN + verdict files. Rest stands.
- P6 external-review manuscript: **ACCEPT** (== 2.d/2.e). Already planned.
- P7 tool freeze + core set + license audit: **ACCEPT as policy** (matches sunset discipline). Core-set selection is a user call. License audit is real work, queued.
- Exp A H2 PROSE-ONLY: **ACCEPT** as classification (already in RESULTS_INDEX.md; covered by 2.a iv re-ledger-or-cut + 1.a). No new action.
- Exp C best-student selection hides variability: **ACCEPT with pointer** — partially mitigated (tutor-descendant analysis, inversion seeds 206–208, F-singlegen). Queued: one paper sentence in §7 limits.
- §4.7 evidence taxonomy (measured / recoverable / proposed): **ACCEPT** — RESULTS_INDEX.md already classifies (measured / PROSE-ONLY / superseded); queued: surface it in the paper (§7 or banner).
- §4.8 "past G3 is roadmap" vs reported G4–G5: **ACCEPT, verified live in v0.15 abstract** — real catch, survived our full run. Queued one-line paper patch.
- §2.3b tools index (4 listed vs ~24 dirs): **ACCEPT, verified** (4 index rows; 24 subdirs + 3 ix-*.js). Queued fix.
- §2.3c "Unlisted upstream" licenses (beautiful-prose, benchmark SKILL.md): **ACCEPT, verified verbatim**. Queued audit.
- §2.3d AI-criticism ≠ replication: **ACCEPT** (already our position). Queued: write the three-level taxonomy into fresh-eyes SKILL + §7.
- §3.4 per-experiment AI-provenance (asked/proposed/built/checked/verdict): **PARTIAL** — preregs already carry expectation + pre-mortem + nearest-failure, verdicts score them; the gap is logging which AI suggestions influenced decisions and their accept/reject. Queued as a cheap CHATLOG convention.
- Historical transcripts reconstructed: **ACCEPT as disclosed limitation** (already in memory-SKILL honest limits). Nothing to fix retroactively.

## Queued actions (NOT started — user said no new work yet)
1. Paper one-liner: fix "past G3" roadmap sentence (verified stale in v0.15).
2. Paper surfacing: O2 + three-level criticism taxonomy + evidence taxonomy + selection-variability sentence (§5/§7/banner).
3. Tools: license audit (starting with the two flagged files), index completion, core-set decision (user).
4. Conventions: AI-suggestion provenance logging (cheap).
5. 2.e decision: one draft vs A/B split (user call).
6. Reply to reviewer: point at §8.6 for P2; note scratch-vs-durable record correction.

## Cost
0 compute. Adjudication + CHATLOG entry + working-record note only.
