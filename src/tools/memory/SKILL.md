<!-- ORIGIN: built in-repo (Teaching Small Models lab, 2026-11-08/09). Not stolen. License: repo-internal. -->

---
name: memory
description: Continuity across compactions and sessions. This skill should be used when long work must survive context loss — via working record, run/wall logs, verbatim snapshots, durable log, and verbatim conversation-transcript layers with snapshot, newest-wins, and append-only rules.
---

# Memory skill — bootstrap (read this first; detail lives in REFERENCE-*.md beside it)

Small by user order 2026-11-18: this file is the checklist + pointers. Wording
of the moved rules is untouched in the REFERENCE files. If this file and a
REFERENCE file conflict, the REFERENCE file wins until this file is amended.

## Always read (in order, every session)

1. `agents-augment.md` (repo root) — standing orders.
2. This file — the checklist below.
3. `REFERENCE-layers.md` (beside this file) — read IN FULL every session, no skimming; it defines the layers, durability order, and secret handling the checklist enforces.
4. `REFERENCE-rules.md` (beside this file) — read IN FULL every session, no skimming; snapshot, newest-wins, grounding, epistemic labels, and filing rules.
5. After every compaction: read `REFERENCE-reconcile.md` IN FULL and run it (steps 0–4) before continuing work — re-list, re-read, reconcile, one wave per UNKNOWN, push check.
6. The task working record (newest timestamped entry wins; keep short, link
   files). Which file is authoritative is named in the handoff note —
   currently `scratch/CURRENT_TASK.md` (note: `src/CURRENT_TASK.md` is a
   retired Track-A pointer, not a competitor).
7. `src/CHATLOG.md` tail (last ~10 entries): decisions + MEASURED numbers.
8. Wording disputes only: newest `src/evidence/conversations/` tail, checked
   LAST — it decides what was said, never what was measured.

## Core (the whole skill in a hurry)

1. Working record: newest timestamped entry wins; keep short, link files.
2. Snapshot `src/gameplan-snapshots/` BEFORE any gameplan rewrite or critique round.
3. Append to `src/CHATLOG.md` once per session (decisions + MEASURED numbers).
4. Transcript: append the session's turns to `src/evidence/conversations/<YYYY-MM-DD>-<label>.md` every session (verbatim where available, marked reconstructed where not). A skipped transcript is a gap, not backlog.
5. Retractions are struck through, never silently edited; UNKNOWN beats guessing.
6. Unpushed `src/` files are sessions at risk: track the list, push by ~20 files / 3 sessions.
7. `scratch/` is a recycling bin (private, deletable); durability lives in `src/` + git.
8. Numbers sacred: quote exactly, with source paths.
9. Secrets live in the vault, never in chat/files; PAT never leaves the browser.
10. After compaction: re-list workspace, re-read working record, reconcile, then continue.

## Session-end checklist (do all five before ending — this is what closed the 11-17/18 gap)

1. Working record: one timestamped line.
2. CHATLOG: one entry (decisions + MEASURED numbers).
3. Transcript: this session's turns appended (rule 4 above).
4. Unpushed list: updated in the working record; over-listing is safe.
5. Push: if the standing list exceeds ~20 files or spans 3 sessions, request a push first.

## Detail (read when the checklist points here)

- `REFERENCE-layers.md` — the five layers, durability order, secret handling.
- `REFERENCE-rules.md` — snapshot, newest-wins, grounding, epistemic labels,
  checkpointing, promote-or-recipe, append-only, living-vs-record, handoffs.
- `REFERENCE-reconcile.md` — reconcile-after-compaction, steps 0–4.
- `REFERENCE-problems.md` — known/solved problems, amendments, honest assessment, costs.
- Tools: `src/tools/memory/search.js` + `log.js` (3-line bootstrap in REFERENCE-problems.md, solved S4).
