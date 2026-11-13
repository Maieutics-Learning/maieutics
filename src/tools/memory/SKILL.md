<!-- ORIGIN: built in-repo (Teaching Small Models lab, 2026-11-08/09). Not stolen. License: repo-internal. -->

---
name: memory
description: Continuity across compactions and sessions. This skill should be used when long work must survive context loss — via working record, run/wall logs, verbatim snapshots, and durable log layers with snapshot, newest-wins, and append-only rules.
---

# Memory skill — continuity across compactions and sessions

## Dependencies

None — this is the foundational skill. `fresh-eyes` and `rabbithole`
both log through it (results files, durable log, working record). Steal
this one first; the others assume it exists.

Purpose: survive context loss. Long projects outlive any single context
window (compaction), tab, or day. This skill is the layer stack + rules
that let a future session — or a contextless you — reconstruct state and
keep working without re-deriving everything. Battle-tested across weeks
of bench-science sessions with dozens of compactions.

## The stack (four layers, cheapest first)

1. **Working record** (`src/CURRENT_TASK.md`). The live notebook: what
   the task is, what's done, what's queued, key decisions, pointers to
   run records. Rule: newest timestamped entry wins conflicts (newest =
   latest timestamp value, not file position). After any
   compaction or disconnect, run the Reconcile-after-compaction procedure
   below (steps, order, and output location are specified there — follow it
   exactly) before continuing. Timestamps REQUIRED, format `YYYY-MM-DD HH:MM`;
   identical timestamps → later-in-file breaks the tie (same rule as
   Reconcile step 2), UNLESS the two same-timestamp entries contradict each
   other — contradictory content is unorderable even with timestamps, so it
   is UNKNOWN; undated entries cannot win — mark them
   `[UNKNOWN: description]` (a lone undated entry with no dated competitor
   stands as-is, noted undated). Grows unbounded — keep entries short,
   link files not prose (paths here may point to `scratch/` working copies,
   but mark them (tmp): only `src/` paths are durable).
2. **Run/wall logs** (`src/evidence/rabbithole/<slug>/log.md`, `state.json`).
   Append-only wave logs: question → finding → verdict. The wall log is
   the mirror for the main research line. State files hold machine-
   readable status (open/dead/backlog branches, findings, caps). (Trail
   lives under `src/` per the 2026-11-11 durability global — never
   `scratch/` alone.)
3. **Verbatim snapshots** (`src/gameplan-snapshots/<date>-<label>.md`).
   Exact copies, no paraphrase (see the gap below for why). MANDATORY
   before any gameplan rewrite or critique round; log the snapshot path
   in the working record. Reconstruction from memory is how drift starts;
   snapshots are how you prove it didn't.
4. **Durable log** (`src/CHATLOG.md`, shipped + git-pushed). Append-only,
    one dated entry per session: decisions, MEASURED numbers (numbers
    sacred — wall time, accuracy, loss, never "feels faster"), failures
   and why. This + git is the only layer that survives everything. "Link"
   means a relative file path from the repo root (e.g.
   `src/tinynn/gseries.js`), never a bare filename or URL — in ALL layers.
   DURABILITY POLICY (canonical — every other mention points here; revised
   2026-11-11, external review 2026-11-13 confirmed the old text was stale):
   `scratch/` is a recycling bin, NOT storage — anything there may be wiped
   on reload, compaction, or a new chat, and no durable document links to a
   `scratch/` path. Layers 1–3 live under `src/` as working copies;
   `scratch/` holds only re-fetchable/regenerable intermediates (fetch
   dumps, unzip temp, caches, sandboxes). If `scratch/` content is cited,
   the durable log must carry the source URL or a deterministic
   regenerate-from-`src/` recipe instead — a bare `scratch/` link is a link
   into a cache: caches get wiped.

Durability order (weakest → strongest — survivability, not conflict
precedence): unpushed `src/` working layers < shipped files + git pushes
(survive everything — ONCE PUSHED; until
then they are only the best local candidates, and the push gap is the
central risk Step 4 exists to track). Anything that
matters must climb to layer 4. The climb needs a push token (PAT) — an
unpushed session is a session at risk; say so in the log.
SECRET HANDLING (no exceptions): the AI NEVER stores, or echoes a
PAT — not in `src/`, not in `scratch/`, not in chat quotes. The user holds
the token and provides it. The AI's job ends at preparing the exact
payload + the unpushed list + push when asked. "Ask for it" means: state what is ready to push and
then push with the token reminding the user to rotate it. If the user pastes a
token into chat anyway it is now in chat history, push then rotate it.
- The PAT comes from the user: ask for it, never invent it, never hold it for long
  (see SECRET HANDLING above). Without it,
  pushes are blocked — log what's unpushed every session so the risk is
  visible.

## Rules

- **Snapshot rule.** Before rewriting a plan or running a critique round,
  save the verbatim current version + log the path — no exceptions for
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
   the newest readable among log tail + record, and rebuild state). Missing/empty artifact = noted and
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

## Known problems (posted 2026-11-12 — amend, never delete; move to Solved with date when fixed)

Solved:
- S1 reconstruction drift → snapshot rule (a plan rebuilt from memory came
  back substance-right/wording-wrong; user adjudicated REAL; rule created).
- S2 method loss (D-wave scripts died in scratch/) → promote-or-recipe.
- S3 stale record + missing entries (2026-11-10 memory audit: CURRENT_TASK
  stale, CHATLOG gaps, skipped pre-edit snapshot, steal files in scratch) →
  audit fixed all four; evacuation policy (nothing DURABLE lives ONLY in
  scratch/ — working copies may live there, every referenced item needs
  its `src/` twin).
- S4 forgotten invocation → stateless subprocesses (this session):
  src/tools/memory/search.js (scan-workspace-return-pointers) +
  src/tools/memory/log.js (placement+format logger); "bootstrap" = paste
  this 3-line loader into an execute_js call (AsyncFunction = the async
  equivalent of `new Function`; `fs`/`tools` are the worker's built-in
  file and tool handles, no import needed):
    // 1. load the script source from the durable path
    const src = await fs.readTextFile("src/tools/memory/search.js");
    // 2. build an async runner with named inputs (fs, tools, args)
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
    const run = new AsyncFunction("fs", "tools", "args", src);
    // 3. call it: query in, pointers out (nothing else enters your context)
    return await run(fs, tools, {query: "your question", limit: 8});
  STATUS EXPERIMENTAL: searcher ranking v3 live (6-case gold harness passing
  P2-5), logger v2 live (5-case E2E passing P2-6) — sanity-check outputs exist
  before acting on them. Both scripts live in `src/tools/memory/`:
  durable tooling under the same policy, not logs.

- S5 write-only memory (R2 2026-11-12, R3 cross-linked): reconcile Step 0
  (re-list workspace top levels, diff vs handoff Files — the map, not
  memory, is the terrain) + handoff "Adjacent reality" section + verbatim
  filing. Retrieval is now a procedure, not a hope. (Retires U1, U3.)
- S6 search ranking (P2-4/P2-5 2026-11-12): v2 let single-term-repeat files
  outrank multi-term-relevant ones; harmonic-only fix still diverged
  (H(10) = 2.9 > 2 distinct terms — 9/10 reviewers caught it with numbers).
  v3: harmonic occurrence decay with per-term cap 2.0 (case-insensitive
  substring hits over full text; path bonus + length norm + coverage
  multiplier unchanged) — any file matching 2+ distinct terms content-wise
  outranks any single-term file. Pure `rankTerms` core + 6-case gold harness
  (diversity, 15x crossover, spam-margin, frequency, path-priority,
  symmetry-tie) all passing; case-insensitive extension filter fixed.
- S7 logger placement (P2-6 2026-11-12): record default pointed at the synthesis
  file instead of the working record (10/10 reviewers caught it) → default
  CURRENT_TASK.md + file/stamp overrides (U2 two-record world, backfill);
  chatlog missing-file crash → empty-file fallback; same-day title-merge →
  title-aware sections (one entry per session, matching CHATLOG convention).
  5-case E2E passing (record-stamp, chatlog new/append/split, failures).

Unsolved:
- U2 TWO WORKING RECORDS. src/CURRENT_TASK.md (bench waves) vs
  scratch/SYNTHESIS_TASK.md (synthesis; pre-durability-rule working copy —
  promote to src/ on next touch) — different tasks, newest-wins
  cannot apply across tasks. Proposed: task-identity check before
  newest-wins; handoff names the authoritative record.
  FIX P2-4 2026-11-12: Step 2 scopes newest-wins to the authoritative
  record (other tasks' records never override); handoff names it. Stays
  open until observed holding.
- U4 ANSWER-FROM-MEMORY HABIT. No protocol prevents confident ungrounded
  answers; mitigation is auditability (search receipts in the record), not
  prevention.
  PARTIAL FIX P2-4 2026-11-12: Grounding rule above (cite artifact +
  timestamp, else UNKNOWN) is now the gate; receipts remain the audit
  trail. Stays open until observed holding.
- U5 NO FORCING FUNCTION. Nothing in this harness compels invocation — no
  hooks, no daemons, no scheduler that fires on its own. Invocation happens
  ONLY inside gated checklists (this skill's Reconcile step 0, wave-loop
  checkpoint steps, handoff rule) and turn routines; if it isn't a checklist
  step, it doesn't happen. Mitigation stack: attach calls to those
  checklists, keep friction near-zero (3-line bootstrap), emit CHECKABLE
  receipts — search receipts carry query + hit paths + one verbatim snippet
  each (re-run the query to audit); file-write receipts carry path + bytes
  (re-read to audit). A bare `ran search, N hits` with no checkable payload
  is hearsay, not a receipt. Receipts are self-reported text: fabrication is
  caught at audit, never prevented at write — a future session spot-checks.
  (S5's Step 0 is one such checklist step — the compulsion is procedural and
  therefore partial: it binds only a reader who reaches the checklist.)
- U7 STALE-PREMISE ACTS. Two recorded incidents of reviewers briefed on
  outdated frozen copies (fresh-eyes premise-artifact hygiene). PARTIAL FIX
  R3 2026-11-12: Reconcile Step 1 now requires a timestamp check on every
  artifact (frozen copy older than the log tail = stale, re-read live).
  Remaining: no check at other use sites (reviewer briefing, wave-loop reads).

## Has this helped? (honest assessment)

Yes — with receipts:
- **Compaction survival.** Multiple sessions continued across context
  checkpoints using handoff note + working record alone. The current
  session is one: the D-rate/D-slow waves were specified two checkpoints
  ago and executed exactly as specified.
- **Interruption resume.** A long wave killed mid-run lost nothing: the
  results file held 4/8 seeds, the script resumed the rest. Checkpointing
  turned a lost hour into a lost minute.
- **Retread prevention.** A "quick retest" request was checked against
  the log first and turned out to be genuinely new ground (prior runs
  were a different regime) — the log answered in seconds what re-running
  would have cost minutes.
- **Retraction chain.** A published mechanism ("global is noise") was
  measured wrong, then corrected in the log with the exact numbers that
  killed it. Without the append-only record, the wrong version would
  still be load-bearing.
- **The gap it caught.** Once, a plan was reconstructed from memory and
  came back substance-right but wording-wrong. A user hypothesis ("was
  that a memory gap?") adjudicated it as REAL — and that verdict created
  the snapshot rule. The system diagnosed its own failure mode.

Costs and limits (don't steal the skill without these):
- `scratch/` is private and temporary. Only shipped + pushed survives.
  Treat everything else as a cache with a good hit rate, not storage.
- Logs grow. The working record needs pruning discipline (short entries,
  pointers not prose) or it becomes a second context window.
- Newest-wins needs timestamps. Undated entries are unorderable — date
  everything.
- The PAT bottleneck: durability depends on pushes, pushes need the
  user's token. Log what's unpushed every session so the risk is visible.
