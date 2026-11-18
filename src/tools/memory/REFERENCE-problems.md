# Memory REFERENCE — known problems, amendments, assessment (split from SKILL.md 2026-11-18, wording untouched)

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
- U8 SKILL-SCALE COMPLEXITY. External toolset review 2026-11-13 (Memory
  4.5/5) corroborates the accretion worry: procedures grow faster than the
  core shrinks. Proposed 3-layer split (Core/Ops/Governance) DEFERRED to
  the post-Phase-2 physical-split vehicle with rabbithole U1 (single-file
  locality beats split-file drift for now). Meanwhile: no new mandatory
  procedure without retiring or folding one. DECIDED 2026-11-13: user picks
  deferral (option b).
  Second corroboration 2026-11-13: scientific review exhibits the Track C
  391-wave wind-down (stopped via the user-stop rule — done right, but not
  native) as stopping-done-right-but-not-native. Feeds the continuation-policy
  user decision, not this skill.

AMENDMENT 2026-11-16 (user-ordered, carves out of the U8 no-accretion rule):
layer 5 (verbatim transcript) added. Cost accepted: transcripts grow
unbounded, no pruning/size discipline on layer 5.

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
