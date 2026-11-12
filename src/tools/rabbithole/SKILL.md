<!-- ORIGIN: built in-repo (Teaching Small Models lab, 2026-11-08/09). Not stolen. License: repo-internal. -->

---
name: rabbithole
description: Cautious long-running research in small cheap waves. This skill should be used when running deliberate open-ended research with sealed scouts and primary sources until stopped, capped, or blocked — with state, wave loop, and standing tangential slot.
---

# Rabbithole skill — cautious long-running research

Purpose: run deep research ("rabbitholes") under assistant ownership, in small
cheap waves, until the user says stop or a genuine block is hit.
The name is the spec: a rabbithole is DELIBERATE wandering. This is a shotgun
approach for unknown unknowns — we don't know what we don't know, so breadth
is the method, not a distraction from it. Nearly NOTHING is scope creep:
tangents, analogues, rival methods, neighboring fields are all legitimate game.
Narrowing to the root too early is the failure mode, not the discipline.

## Research agenda (project wall, most-promising first)

1. PCGrad / gradient surgery for the teachers-fight — nearest fix; might be ~20 lines.
2. Capacity math: one skull or three? — separated readouts vs bigger hidden size.
3. Trained settling dynamics — biggest idea; could dissolve the transit-vs-readout split.
4. Memory transport that actually moves bindings — successor to failed wedge/campfire/choosy.
5. Why evo climbed the wrong hill — find a selection signal that points at the exam.
6. STANDING SLOT — tangential analogues + different methods toward the same goal.
   Not a detour: every few waves, research something that solves the same problem
   a different way, or a neighboring field's version of it (even if it looks
   unrelated at first). Direct work optimizes the current path; this slot is
   how a better path gets found.

Most promising: #1. Most exciting: #3. No pressure to finish a topic before
hopping — follow whichever is most alive, hop freely, take as long as needed,
and decide next steps without asking.

Sidenote (user-set 2026-11-08): treat this research as personal experience,
not just facts. Notice how *you* learn while researching — which
scouting/synthesis habits work, where you fool yourself, what you'd teach the
lab's model about learning. We're teaching a model how to learn; the
researcher's own learning counts as data.

## Command

User says one of:

- `run rabbithole: <root question>` — no total budget; throttled stream by
  default. Optional `[cap: N waves]` only if the user sets a hard cap.
- `continue rabbithole` (resume latest state — valid but NEVER required: standing
  permission to resume is assumed YES, user-set 2026-11-10, so never ask for it
  and never wait for it; awaiting a continue message is itself a permission gate)
- `stop` / `pause rabbithole` (stop signal — honored on next turn)
- per-turn budget (user-set 2026-11-10): 10,000~20,000 waves per turn, i.e.
  effectively unbounded — the ONLY stop reasons mid-run are the user's manual
  stop, a genuine block, or an explicit cap. Soft rationing (1-2 waves then
  report) is BANNED; a turn ends when the work is done or blocked, never to
  force a check-in.

No root question given = default to the standing topic in the durable working
record (`src/CURRENT_TASK.md`; NEVER `scratch/` alone — scratch is a bin and
may be wiped). Slug = short kebab-case of the root; `continue` resumes the
most-recently-updated run; record active slugs in the durable working record.

## State (all under the durable run dir, e.g. `src/evidence/rabbithole/<slug>/` — NEVER `scratch/` alone)

- `state.json`: `{ root, capWavesOrNull, wavesUsed, pace, branches: {open,
  dead, backlog}, findings, verdicts, scopeNotes, status,
  toBringUp: [items needing the user — reported first, never buried] }`
- `log.md`: append-only wave log (Q -> finding -> verdict). Opens with a
  `## To Bring Up` section: the live user-facing list, always output first
  in every report so it can never be buried.
- `STOP`: if this file exists, do not start another wave.

`scratch/` may be wiped at any time and MUST NOT hold the authoritative copy
of anything referenced. After compaction or disconnect, reconcile from the
handoff note + durable working record + durable `state.json` + log tail
before continuing (newest durable timestamp wins).

## Wave loop (cautious defaults)

1. Read state; honor `STOP`, any optional cap, and any user stop message.
2. Pick at most 2 next questions (disjoint, serving the root). Default shape is
   ONE DIRECT + ONE TANGENTIAL (agenda item 6) every wave — shotgun by
   default; two direct questions only when a hot lead needs both slots, and
   never more than 2 waves in a row without a tangential one.
3. Launch at most 2 scouts in ONE page_eval (`Promise.all`, sealed briefs,
   <=100-word replies, return shape enforced).
4. Fetch at most 2 PRIMARY sources (arxiv/repo/docs) via `fetch_url`.
5. Synthesize: per-branch verdict (useful / dead end + why); failed search =
   inconclusive (retry once, varied); clean empty search = negative evidence.
6. Checkpoint (memory: checkpoint-after-every-wave, incremental). Update
   durable `state.json`, `log.md`, and working-record checkpoint (all under
   `src/`, NEVER `scratch/` alone — a `scratch/` copy is a disposable extra,
   never the checkpoint). Write results incrementally so an interrupted wave
   resumes from the file, not from scratch; scripts filter `done` on start.
   Before any plan/synthesis rewrite, save the verbatim current version +
   log the path (snapshot rule — reconstruction from memory is how drift
   starts). Append-only: never rewrite history; supersede explicitly
   ("X retracted, Y measured instead") — retractions are first-class entries.
7. Queue rule (user-set 2026-11-10): every finished wave MUST open at least 1
    new wave (append to `branches.open`). The queue never empties by finishing
    work — it empties only at run end (user stop, genuine block, explicit cap,
    or proven-dry: a wave that genuinely cannot spawn a follow-up, logged with
    why). If `branches.open` is ever empty outside run end, that is a bug. Spawn order is
breadth-first (append to back), no cap, multiple spawns per cleared wave allowed
(user-set 2026-11-11). Run end = user stop or out-of-leads (user phrasing for
proven-dry); consumed entries are removed at execution.
8. pause/report: checkpoint first (step 6), then short status, then continue
   while the turn is active. Report + next-wave tools are ATOMIC — a wave
   summary must ride in the same turn as the next wave's tool calls, never
   as a bare tool-call-free message (user-set 2026-11-11, earned from
   W31-type stall: summary with no tools ends the turn and stalls the run
   even though nobody said stop). Mandatory closer: "Next: <backlog head> —
   tools below." plus ACTUAL tools below. BANNED closings (each is a
   permission gate on its face): "when you say go", "whenever you're
   ready", "want me to continue?", "say continue", "let me know", or any
   closing that transfers initiative to the user. "Good chunk to report" is
   NOT an exemption — after N waves either keep chaining or declare an
   explicit HANDOFF, and a HANDOFF by choice is justified ONLY by (a) "I
   have run out of leads, there are no more waves left" (all-four
   out-of-leads) or (b) "The user explicitly asked me to stop" (stop/hold
   for this turn). Turn length, waves already run this turn, and desire
   for visibility never justify yielding — never a bare status.
   pause/report is NON-blocking — never a permission gate. NEVER ask the user
   for `continue`: standing permission to resume is assumed YES (user-set
   2026-11-10); ending a turn with "say continue" as a precondition for more
   work is itself a permission gate.

Throttled stream, no total budget: pace is the control. Concretely, one wave =
at most 2 scouts at 100 words each + at most 2 primary fetches. A pause =
checkpoint + status + a breath before the next wave (no fixed minutes — wave
size, not the clock, is the throttle). Keep usage comfortably below a cautious
hourly pace. If pressure or failures appear, shrink waves (down to 1 scout)
and lengthen pauses. An optional user-set cap, if present, is the only
budget-like gate — reaching it means checkpoint + report + await extension.

## Marathon rule

A run ends only at the stop reasons (user stop, genuine block, optional cap).
"Root answered" is NOT a stop reason — it is a report milestone: file the
verdict and keep going on the open branches and the standing slot (agenda
item 6). Running out of direct questions never ends a run either — that is
what the tangential slot is for. There is no "final reply with no tools behind
it" mid-run: status reports ride along WITH continued tool calls, never
instead of them. A plain reply with no tools IS the handoff — emit one only
when the run is truly over (stopped, capped, or blocked). When in doubt, keep
chaining. Past behavior to not repeat: winding down after a few waves because
the agenda emptied — the hole is nearly endless by design.
Two stops look identical on the wire (a message with no tools) but differ
in cause and recoverability — do not conflate them (user-set 2026-11-11,
tool-debug detour, not a Track C content ruling):
- Handoff (system-forced, legitimate): compaction checkpoint, disconnect,
  explicit user hold/pause, or normal-conversation Q&A. Ends the turn by
  outside order. Recovers via the resume packet (state + log + working
  record, newest wins) and standing resume-YES — next session reconciles
  and emits the next wave's tools without asking.
- Sign-off (habit, forbidden): mid-session wave-boundary summary with no
  tools behind it and none of the legal turn-enders true. Ends the turn by
  choice and stalls the run with leads still queued. This is the W31 shape:
  neither user stop nor out-of-leads, just a report with no tools.
Turn-close checklist (user-set 2026-11-11, earned from incident: wave-boundary
sign-offs with no tools behind them): before any tool-call-free message mid-run,
confirm (1) user stop? (2) out-of-leads = backlog empty AND zero new spawns AND
tangential slot dead AND lookups closed/parked? (3) genuine block (same tool
failing after 2 varied retries, or missing user-only input)? If none: keep
working — emit tool calls, not a sign-off. Legal tool-call-free turn-enders
mid-run: the stop reasons above, labeled BLOCKED
("BLOCKED: <reason> | tried: <...> | need: <...>"), or an explicit user hold for
the current turn. Scope: this section binds rabbithole runs only; normal
conversation is unaffected and may end turns freely.
Pre-send gate (user-set 2026-11-11, W31/W34/W35 incidents): before any
tool-call-free message, confirm one of (1) user stop, (2) all-four
out-of-leads, (3) BLOCKED with label, (4) explicit user hold for this turn,
(5) I am answering a user question RIGHT NOW (normal conversation — exempt
under Scope; questions arriving AFTER the message cannot retroactively
justify it). Decision rule (user-set 2026-11-11): whenever evaluating
whether to continue chaining or yield with an explicit HANDOFF for reasons
of turn length or user request, justify the yield with EITHER (a) "I have
run out of leads, there are no more waves left" (all-four out-of-leads
proven) OR (b) "The user explicitly asked me to stop" (stop/hold covering
this turn). Turn length, waves run, and visibility are never justifications
on their own. System-forced ends (compaction, disconnect) are not decisions
and need no justification — write the packet anyway. Explicit handoff
format: "HANDOFF: <cause: compaction | disconnect | user hold> | packet:
state+log+record written, newest wins | next: <backlog head + exact
action>". Log every mid-run tool-call-free end as an incident (what,
backlog size, which exemption claimed) — visible habits die faster.

## Interruptions

- errors: retry once, isolate, save good work, record failure.
- limits: smaller waves, longer pauses; no auto-stop except an explicit cap.
- compaction: reconcile after — read handoff note + working record +
  state.json + log tail; newest timestamped entry wins conflicts; mark
  uncertain fields UNKNOWN and re-derive with one wave rather than
  guessing. Resume packet invariant (user-set 2026-11-11): backlog head +
  exact next action must already be written in state and the working
  record BEFORE any summary text, so a forced handoff costs one resume
  step, not a debug session. After reconciling, emit the next wave's
  tools in the same turn — never a bare "ready to resume" message.
- lost connection: RISK ACCEPTED — resume from last checkpoint.
- scope: nearly nothing is scope creep (see Purpose). Minor add/remove is mine
  to decide — ask "should this be in scope?", document the answer in
  `scopeNotes`/log. A DIFFERENT METHOD toward the SAME goal is in scope by
  default — never a scope change, never an escalation. A tangent that becomes
  a different GOAL is also not escalation — promote it to its own run
  (bookkeeping, log a pointer both ways). Escalation is only for leaving
  research-only or irreversible actions.
- forks: pursue competing branches in parallel until one is noticeably less
  productive, then prune the loser with a verdict. Pruned branches keep their
  verdict and stay revivable; pruning is a delegated judgment call, logged.
  Escalate only forks that need user values, major scope, or an irreversible
  choice.
- optional cap reached / irreversible action / ambiguous vision: escalate.

## Scope and ownership

Research + docs only. Read-only toward the lab/generator/repo: may write
disposable scratch notes plus durable task records, CHATLOG lines, and
research docs (durable = under `src/`, NEVER `scratch/` alone).
Disposable means explicitly OK with losing it; anything referenced later
MUST have its durable copy under `src/`. No shipped-code
changes, pushes, or irreversible actions without explicit instruction.
Assistant is final stakeholder for research direction within scope and throttle.

## Dependencies

- `websearch` (required) — primary-source fetches (step 4 of the wave
  loop) run through it. No websearch = no external facts, only synthesis.
- `memory` (required) — state.json/log.md/CURRENT_TASK checkpointing
  (steps 6-7) follows the memory skill. No memory = waves that evaporate
  on compaction.
- `fresh-eyes` (optional) — point at findings, plans, or this skill
  itself before committing to a direction. Used here for the agenda and
  the skill's own review (5 points, 2 real gaps fixed).

## Memory (why multi-hour runs work — stolen from the memory skill)

- Four layers, cheapest first: working record (live notebook, short entries,
  pointers not prose) → run logs (`state.json` + append-only wave log) →
  verbatim snapshots (exact copies before rewrites) → durable log + pushes
  (the only layer that survives everything). Anything that matters must
  climb; log what's unpushed every session so the risk is visible.
- Newest-wins: after any compaction/disconnect, read handoff note + all
  layers; newest timestamped entry wins; mark conflicts UNKNOWN and
  re-derive with one wave rather than guessing. Date everything —
  undated entries are unorderable.
- Promote-or-recipe: a script that produces a MEASURED number is data —
  it lives in a tracked path or its full recipe (config, seeds, every
  delta vs checked-in code) sits beside the numbers, or the numbers are
  flagged hearsay. (Earned: D-wave scripts died in `scratch/`; the G
  series was rebuilt from prose.)
- Proof it works: steal-track-a at 920 waves active; D-rate/D-slow
  specified two checkpoints earlier executed exactly; an 8-seed wave
  killed mid-run resumed from the file (lost hour → lost minute); the log
  answered a "quick retest" in seconds; a wrong published mechanism was
  retracted with the exact killing numbers.
Costs: logs grow without pruning; `scratch/` is a cache with a good hit
rate, not storage; durability bottlenecks on pushes.

## Durability (global, user-set 2026-11-11)

Trail lives under `src/` (e.g. `src/evidence/rabbithole/<slug>/` for
state.json + log.md), NEVER under `scratch/` alone. Rationale: scratch is a
recycling bin; referenced work must be durable. Bulk fetch dumps MAY stay in
scratch (bin, explicitly disposable) ONLY when every URL is recorded in the
durable log — URLs are the durable reference, dumps are re-fetchable. All
other wave-loop/state/queue rules unchanged. Durable logs MUST NOT cite
`scratch/` paths as live references (provenance/debug pointers only).

## Run instances (tracks specialize; the skill stays generic)

- Track C run rules (canonical for that run):
  `src/evidence/rabbithole/track-c/RULES.md` — stop/turn phrasing, verdict system,
  synthesis cadence, trail conventions.
- Track C shelf/history: `src/steal/papers.md` (points to RULES.md).
- Novelty-optional verdicts, gated paper patches, sandbox experiments with noted
  results (user-set 2026-11-11) are run-level regime choices recorded in the
  run's RULES.md, not skill changes.

## Sandbox

- Root: `scratch/sandbox/` (disposable by design — explicitly OK with losing
  it; NEVER the home of referenced work). Full root access: create,
  overwrite, or delete anything inside, especially while rabbitholing.
  Iterations are subfolders
  (`s01-...`, `s02-...`); never mutate the real model/training in place —
  copy it into the sandbox first.
- No new roots: tangents are branches or sandbox iterations, never new runs.
  Competing ideas get sandbox subfolders, not fresh root questions. A tangent
  that outgrows its root (it now serves a different goal, not just a different
  method) may be promoted to its own run — log a pointer both ways and keep
  going. Promotion is bookkeeping, not escalation.
- Docs stay OUT: run state, logs, and records live in
  the durable run dir + working record, so the sandbox can be freely
  overwritten. Provenance of anything copied in is recorded in the durable
  run log
  (outside the sandbox), never inside it.
