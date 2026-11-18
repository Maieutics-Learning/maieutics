# Memory REFERENCE — reconcile-after-compaction (split from SKILL.md 2026-11-18, wording untouched)

## Reconcile-after-compaction procedure

0. Re-list the workspace top levels by reading the `src/` and `scratch/`
   directory listings, then diff the names against the handoff note's
   Files section (S5: retrieval is a procedure, not a
   hope). No special tool needed — the directory listing IS the map.
   Anything present-but-unlisted gets
   flagged BEFORE any other work — the map, not memory, is the terrain.
   Fallbacks: no handoff note, or note without a Files section → the live
   listing IS the truth; log NOTE-MISSING and continue (never stall on a
   missing note). Note lists files that no longer exist → flag each as
   LOST (deleted/renamed since the note), do not silently drop them — if the
   reconcile needs the lost file's content, note it as UNKNOWN for Step 3. Listed
   files whose size differs from the note's recorded bytes are flagged CHANGED
   (rewritten since the note — re-read as suspect, never trust the note's
   description of them). Check bytes lazily — name-diff everything, byte-diff
   only files you are about to read — so the CHANGED flag fires during the
   Step-1 read, not during the Step-0 name-diff. Existence is Step 0's job; content-freshness
   for read-set artifacts is Step 1's (frozen-older-than-log-tail = STALE).
1. Read available artifacts: handoff note + working record + newest log
   tails (last 10 entries per log) + newest snapshot + machine-readable
   state files if the task keeps them (e.g. rabbithole `state.json` —
   verify it parses (at minimum JSON-parse; against the task's known shape
   if it has one) before trusting it: an unparseable file is not a
   candidate (parseability precedes newest-wins). If corrupt, fall back to
   the newest readable among log tail + record, and rebuild state). LAST,
   read the newest layer-5 transcript tail (last session's file): it is
   checked last and settles disputes about what was said, decided, asked,
   or promised — never the first thing read, always the final word on
   wording. Missing/empty artifact = noted and
   skipped, never fatal (first sessions have no snapshot yet).
   Check each artifact's timestamp as you read it: a frozen
   copy (e.g. a snapshot) older than the log tail is STALE — re-read the
   live file, never act
   on the frozen one (U7). Timestampless artifacts skip the STALE check —
   they enter Step 2 as undated (undated entries cannot win).
2. Newest timestamped entry wins ACROSS all layers of the task's authoritative record (timestamps REQUIRED,
   format `YYYY-MM-DD HH:MM`. Contradiction beats position: the later-in-file
   rule breaks ties ONLY between identical timestamps in the SAME file with
   compatible content — never over a newer timestamp, never across files,
   and never between contradictions. Same-timestamp entries with contradictory
   content are unorderable → UNKNOWN, in the same file or in different files
   (`10:00 go` vs `10:00 stop` = UNKNOWN, not later-line-wins). Mark a conflict
   `[UNKNOWN: description]` as new lines at the end of the working record,
   citing both sources, ONLY when
   entries are unorderable (missing timestamps, or identical timestamps yet
   contradictory content) — differing timestamps are not a conflict, the
   newest simply wins. Scope: the authoritative record is the one named in
   the handoff note (see Handoff notes); entries in any other task's record
   are out of scope and never override, however new (task-identity check
   precedes newest-wins — U2).
3. One wave to re-derive each UNKNOWN (never guess) — one wave per UNKNOWN
   per reconcile, no repeats. "Re-derive" = recompute or retest the
   missing/conflicting value (size the wave to the UNKNOWN — one lookup or
   one full recompute); if the artifact is destroyed and no recomputation
   can recover it, log PERMANENT-LOSS (format: `[PERMANENT-LOSS: what was
   lost | last-known value if any]`) instead of guessing. If the wave leaves
   the value still UNKNOWN, do not open a second re-derive wave: log
   PERMANENT-LOSS (reason: unrecoverable-in-one-wave) or re-scope it as
   deliberate investigation work (a filed task, not reconcile). Log the
   reconciliation as one timestamped line in the working record: what was
   reconciled, from which layers.
4. Push check: the AI knows what IT wrote this session under `src/` — list
   those files as the unpushed set (no shell needed; the session's own
   writes are the journal — best-effort per session, the standing list
   carries it across sessions). Keep a standing "unpushed:" list in the working
   record, updated as you write — in the SAME message as each `src/` write,
   never deferred. When in doubt, list it: over-listing is safe (re-push is
   harmless), under-listing loses data. If no PAT is on hand, log "push blocked:
   no PAT — <files> ready, user to run push." An unpushed session is a
   session at risk — say so. If the standing list exceeds ~20 files or spans
   3 sessions without a push, stop writing new `src/` files and request a push
   first — don't deepen the hole.
