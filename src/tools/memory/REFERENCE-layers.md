# Memory REFERENCE — layers, durability, secrets (split from SKILL.md 2026-11-18, wording untouched)

## The stack (five layers, cheapest first)

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
5. **Verbatim transcript** (`src/evidence/conversations/<YYYY-MM-DD>-<label>.md`,
   format defined in that directory's README). The full user↔assistant
   conversation of each session, verbatim, plus any thinking-record blocks
   the assistant explicitly writes into it. The largest layer, checked
   LAST (see Reconcile Step 1): the bottom source of truth. When layers
   1–4 conflict about what was decided, asked, or promised, layer 5
   decides what was actually said. MEASURED numbers still come from
   artifacts (chat numbers are provisional until filed), but disputes
   about intent, wording, and decisions end at the transcript.
   HONEST LIMITS (read before relying on this layer): (a) private
   reasoning is NOT auto-captured — only what the assistant writes into
   the transcript file counts; anything unwritten is lost like any other
   unfiled thought; (b) history before 2026-11-16 is reconstructed from
   layers 1–4, marked as such, never presented as verbatim; (c) secrets
   are redacted on filing (`[REDACTED: secret-pattern]`, marker stays —
   a transcript containing a live token is a leak, and the SECRET
   HANDLING rule below applies to layer 5 with no exceptions);
   (d) attachments are referenced by path, never embedded.
   UPDATE RULE (user-ordered 2026-11-16): layer 5 is updated every session, pretty much always — append the session's turns (verbatim where available, marked reconstructed where not) before the session ends, at the same checkpoint as the layer-4 CHATLOG entry. An un-updated transcript is a gap, not a backlog: file it with the session, push it with the session.
   One file per session (part-files only if a session ever approaches the
   platform's 100MB/file ceiling under `src/` — no other size limit applies
   per user decision 2026-11-16).
   DURABILITY POLICY (canonical — every other mention points here; revised
   2026-11-11, external review 2026-11-13 confirmed the old text was stale):
   `scratch/` is a recycling bin, NOT storage — anything there may be wiped
   on reload, compaction, or a new chat, and no durable document links to a
   `scratch/` path. Layers 1–3 and 5 live under `src/` as working copies;
   `scratch/` holds only re-fetchable/regenerable intermediates (fetch
   dumps, unzip temp, caches, sandboxes). If `scratch/` content is cited,
   the durable log must carry the source URL or a deterministic
   regenerate-from-`src/` recipe instead — a bare `scratch/` link is a link
   into a cache: caches get wiped.

Durability order (weakest → strongest — survivability, not conflict
precedence): unpushed `src/` working layers < shipped files + git pushes
(survive everything — ONCE PUSHED; until
then they are only the best local candidates, and the push gap is the
central risk Step 4 exists to track). Decisions and MEASURED numbers
must climb to layer 4; the session's transcript must climb to layer 5.
The climb needs a push token (PAT) — an
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
