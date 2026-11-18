# Memory REFERENCE — rules (split from SKILL.md 2026-11-18, wording untouched)

## Rules

- **Snapshot rule.** Before rewriting a plan or running a critique round,
  save the verbatim current version + log the path + byte count (a later
  re-read verifies the bytes) — no exceptions for
  substance-changing rewrites (the one skipped time is what created the
  rule). Typo/format-only touches skip the copy but log the touch in the
  working record (snapshot bloat breeds stale-copy confusion — U7).
- **Newest wins.** After compaction, read all layers; on conflict, the
  newest timestamped entry wins. Mark anything unresolvable UNKNOWN and
  re-derive it with one wave rather than guessing. ("Wave" throughout this
  skill = one execution/test cycle: one run, one probe, one review round.)
- **Grounding rule.** A task-state claim (a value, number, decision, or file
  content drawn from memory of the task) must cite the artifact + timestamp it
  came from (the Step-1 read-set) — one cite per artifact per paragraph
  (each claim-group sharing an artifact gets its own cite: a paragraph
  drawing on three artifacts needs three cites, not one per sentence); a bare report-level bibliography is not
  grounding. General knowledge and in-message arithmetic need no cite. Live
  output of the current session cites as `(this session)` and must be filed at
  the next checkpoint — provisional until filed (filed = written into a
  timestamped layer entry at that checkpoint). If it isn't (or can't be) in
  the current read-set, mark it UNKNOWN and re-derive with one wave
  (see Step 3) — never
  answer from bare model memory. (U4's audit trail is the receipt; this rule
  is the gate.)
- **Epistemic labels.** Every claim filed in a layer carries one:
  Observed (directly in a source, artifact, or execution result), Verified
  (independently checked or reproduced), Inferred (supported but not
  directly established), Hypothesis (plausible, untested), Retracted
  (superseded with pointer — retractions stay first-class, never silent).
  Labels travel with claims when copied into summaries, handoffs, or
  review briefs; a claim that loses its label on copy is UNKNOWN until
  re-grounded. (Review 2026-11-13.)
- **Checkpoint after every wave.** Results files (under `src/`) are written incrementally
  (every run appends + saves), so an interrupted run resumes from the
  file, not from scratch. Scripts filter `done` from the results file on
  start. Proven: an 8-seed wave interrupted mid-run resumed cleanly.
- **Promote-or-recipe.** (Method-preservation, not run-promotion: the rabbithole skill's "promote" branches a tangent into its own run — different "promote".) A script that produces a MEASURED number is data,
  not scaffolding: it must live in a tracked path (`src/`, committed +
  pushed), or its full recipe (exact config, seeds, and every method delta
  vs checked-in code) must sit in the results file beside the numbers.
  Numbers whose script is gone are hearsay — flag them as such and never
  build on them silently. (This rule exists because the D-wave scripts
  lived only in `scratch/` and did not survive a wipe: the numbers
  survived, the method didn't, and the G series had to be rebuilt from
  prose. `src/tinynn/gseries.js` is the first compliant rebuild.)
- **Append-only logs.** Never rewrite history; supersede explicitly
  ("X retracted, Y measured instead") with a pointer. Retractions are
  first-class entries — the log must show the error AND the correction.
- **Living vs record.** Living docs get renamed/corrected freely
  (vocabulary upgrades); run records and attributed quotes keep original
  wording. Say which is which when you touch them. A vocabulary upgrade in
  a living doc must log one line in the working record — `<old> → <new>
  (<date>)` — so a later reader meeting the old wording in a run record
  resolves it instead of concluding two mechanisms exist.
- **Handoff notes.** When context is about to drop, leave a note with:
  Goal / Current state / Files (one per line: `src/x.js (1234B)` for durable
  paths, `(tmp) scratch/y.md (567B)` for working pointers — marker (`src/`
  durable or `(tmp)` working) first, bytes always; `src/` only, never bare
  `scratch/` — this governs file links, not the record path named below) /
  Adjacent reality /
  Next steps — specific enough to continue with zero prior context ("Adjacent reality" = real
  things outside the active thread: other tracks, tools, pools, pending
  user interests, generator renames (storage partitions shift)). Name the authoritative working record for this task
  (`src/CURRENT_TASK.md` unless the task keeps its own — two-record
  tasks name theirs; see U2).
  `Stand alone` = content complete enough to continue with zero prior
  context, assuming the live workspace (files present) but zero memory of the
  thread — it does not replace the filesystem. Durability comes from filing:
  file as an entry in the working record (that entry IS the durable copy)
  first, then deliver as the chat message — a drop between send and filing
  loses the durable copy.
  If no working record exists yet, create it and file the note now — the chat
  message carries it alone only if the write fails; file it at the next
  opportunity (the next session's first record write). If both note and
  record are lost, Step 0 NOTE-MISSING applies (the live listing is the
  truth; log NOTE-MISSING, never stall). Optionally mirror verbatim to `scratch/HANDOFF.md`
  for the next session's convenience; the mirror is NOT the reference.
