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
   Not a detour: at the latest every 3rd wave, research something that solves
   the same problem a different way (the wave-loop default of ONE DIRECT +
   ONE TANGENTIAL per wave already satisfies this when honored), or a
   neighboring field's version of it (even if it looks
   unrelated at first). Direct work optimizes the current path; this slot is
   how a better path gets found.

Most promising: #1. Most exciting: #3. No pressure to finish a topic before
hopping — follow whichever is most alive, hop freely, take as long as needed,
and decide next steps without asking.

Sidenote (user-set 2026-11-08): treat this research as personal experience,
not just facts. Notice how *you* learn while researching — which
scouting/synthesis habits work, where you fool yourself, what you'd teach the
lab's model about learning. We're teaching a model how to learn; the
researcher's own learning counts as data. (Log it ONLY as the `meta`
clause of the Wave-loop step-5 verdict — step 5 is authoritative; this
sidenote states the intent, not a second logging location.)

## Command

User says one of:

- `run rabbithole: <root question>` — no total budget; throttled stream by
  default. Optional `[cap: N waves total for the run]` only if the user sets a hard cap;
  reaching `cap` means checkpoint (wave-loop step 6) + report + await
  extension — the cap is the one budget-like stop that pauses instead of ending.
- `continue rabbithole` (resume latest state — a manual override handle, valid
  but NEVER required: standing permission to resume is assumed YES,
  user-set 2026-11-10, so never ask for it and never wait for it; awaiting
  a continue message is itself a permission gate)
- `stop` / `pause rabbithole` (stop signal — honored on next turn)
- per-turn budget (user-set 2026-11-10): 10,000~20,000 waves per turn, i.e.
  effectively unbounded — a wave is one loop pass (≤2 scouts + ≤2 fetches),
  so this number says "never ration waves to force a check-in", not "do
  twenty thousand tool calls". Mid-run stops (canonical list lives in
  Queue rule step 7): user stop, genuine block, proven-dry. A reached cap
  PAUSES (checkpoint + report + await extension); an unextended cap is a
  user stop. Escalation triggers (irreversible action, or ambiguous vision
  = the state yields no derivable next action) pause for user input; they are not run ends by themselves. Soft rationing (1-2 waves
  then report) is BANNED; a turn ends when the work is done or blocked,
  never to force a check-in.

No root question given = default to the standing topic in the durable working
record (`src/CURRENT_TASK.md`; NEVER `scratch/` alone — scratch is a bin and
may be wiped). If the standing record is empty, default to the most recent
run's `state.json` root. Slug = short kebab-case of the root (lowercase the root,
strip non-alphanumerics to hyphens, ≤6 words — e.g. root "Why do teachers
fight?" → slug `teachers-fight`); `continue` resumes the
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

One wave = one pass through steps 1–8 (at most 2 scouts at ≤100 words each
and at most 2 primary fetches — the cautious defaults; shrink under pressure,
never grow without a hot lead — "hot lead" is defined in step 2). A turn =
everything between two user messages; a response = one message carrying
tools. The per-turn
budget says not to ration, not to be infinite: you will hit context and
tool limits thousands of calls before the 10,000~20,000-wave ceiling, so
the ceiling never binds — if a run ever approaches it, the run design is
wrong; stop and escalate.

1. Read state; honor `STOP`, any optional cap, and any user stop message.
   No state.json (first wave) or corrupt state → initialize from the root:
   branches.open=[root], wavesUsed=0, fresh log — and PERSIST that minimal
   state.json BEFORE launching scouts, so a wave-1 crash still resumes.
   A run's first wave CREATES
   state; it never requires it.
2. Pick at most 2 next questions (disjoint, serving the root). Step 2 picks
   the QUESTIONS; steps 3–4 execute the searches for them. Default shape
   (mandatory unless a hot lead needs both slots): ONE DIRECT + ONE
   TANGENTIAL (agenda item 6) every wave — shotgun by default. A "hot lead"
   = concrete evidence from the previous wave (named source, quoted number,
   or verified artifact — never a hunch) that a second direct question will
   pay — i.e. will yield a primary source or a verdict; two direct questions
   only then (and only then may the tangential slot sit out that ONE wave —
   the next wave returns to the default), and
   count waves since the last tangential: at 2, this wave MUST include one
   (never more than 2 waves in a row without a tangential one). Bridge-
   or-verdict (U4): a tangential line must produce a verdict or spawn a
   direct follow-up within 2 waves of opening; otherwise log it dry and
   prune it — breadth without verdicts is wandering.
3. Launch at most 2 scouts in ONE page_eval (`Promise.all`, sealed briefs,
   <=100-word replies, return shape enforced) — ONE tool call containing
   all briefs, never one call per scout. Malformed/error tool output =
   failed search: log it and continue (Step 5 treats it as inconclusive).
4. Fetch at most 2 PRIMARY sources (arxiv/repo/docs) via `fetch_url`.
   Failed fetch (404, malformed URL, timeout) = failed search: log URL +
   reason, retry once varied; second failure = dead end for that branch
   (log both attempts + why). Rate-limits/auth-walls are tool-blocks, not search
   verdicts — they don't consume the branch's attempts (route to genuine-block
   accounting; escalate implementation if a new method is needed).
5. Synthesize: per-branch verdict, exact format `Verdict: <useful|dead-end> —
    <finding>. Meta: <one line on what YOU learned about method>` — the `Meta:`
    label is the separator (never blend method into finding); failed search =
   inconclusive (retry once, varied); second failure on the same search =
   dead end; clean empty search = negative evidence. Evidence-vs-verdict: negative
   evidence (empty or refuting content) is an outcome class — its verdict is usually
   `dead-end`; record both (`dead end (negative evidence: ...)`).
6. Checkpoint — runs HERE, after synthesis, before spawning (memory: checkpoint-after-every-wave, incremental). Update
   durable `state.json` (including this wave's verdict + toBringUp deltas —
   the machine copy; the `log.md` verdict line is its prose mirror (a
   human-readable rendering, not a verbatim copy and never the sole copy
   — it follows best-effort
   and may lag a write behind, which is why `state.json` wins)),
   `log.md`, and working-record checkpoint (all under
   `src/`, NEVER `scratch/` alone — a `scratch/` copy is a disposable extra,
   never the checkpoint). Write `state.json` FIRST (it is the resume source
   of truth); `log.md` and the record follow best-effort. A crash between
   writes desyncs the layers — on resume, `state.json` wins. If both are
   present yet contradictory, `state.json` still resumes the run — but the
   contradicted fact itself is UNKNOWN until re-derived (memory Step 3).
   Write results incrementally so an interrupted wave
   resumes from the file, not from scratch; scripts filter `done` on start.
   Order note: this checkpoint covers the FINISHED wave; the step-7 spawns
   then write the next actions; the step-8 summary comes last — so the
   packet (state+log) always precedes any summary text.
   Before any plan/synthesis rewrite, save the verbatim current version +
   log the path (snapshot rule — reconstruction from memory is how drift
   starts). Append-only: never rewrite history; supersede explicitly
   ("X retracted, Y measured instead") — retractions are first-class entries.
7. Queue rule (user-set 2026-11-10): every finished wave MUST open at least 1
    new wave (append to `branches.open`). The queue empties ONLY at run end.
    Run end = exactly one of: user stop (including a cap left unextended),
    genuine block, or proven-dry (a wave that genuinely cannot spawn a
    follow-up, logged with why). Answering the root question is a report milestone, never run
    end; "out-of-leads" is user phrasing for proven-dry across all four
    checks (backlog empty AND zero new spawns AND tangential slot dead AND
    lookups closed/parked). Until a run end is declared and logged, every
    finished wave MUST open at least 1 new wave. If `branches.open` is empty
    AFTER the wave's spawn-persistence step and before a logged run end, that
    is a bug (transient emptiness between consume and persist is not). A wave that finds no
    follow-up IS the proven-dry wave: log which checks produced nothing,
    declare run end, no spawn owed — the MUST binds every finished wave
    except the one that proves dryness (no follow-up found, `branches.open`
    EMPTY, standing slot checked). Before declaring dryness,
   check the standing slot (agenda item 6): an unworked tangential angle is
   a lead, not dryness. Dryness requires branches.open EMPTY (every entry
   consumed or verifiably dead) — leftover open branches veto the declaration.
   A wave whose verdicts are all dead-ends but with
   open branches remaining still owes its spawn — the spawn works the
   remaining branches. Spawn order is
    breadth-first (append to back), no cap, multiple spawns per cleared wave
    allowed (user-set 2026-11-11) — except a hot lead's direct follow-ups, which
    prepend to the front (hot lane): urgency outranks breadth for proven leads.
    Consumed entries are removed at execution.
    Persist the updated `branches.open` to `state.json` HERE, in step 7 —
    spawns are not real until written (removals and appends persist together
    in the one step-7 write — never half a queue).
8. pause/report: checkpoint first (step 6), then short status, then continue
   while the turn is active. Report text and next-wave tool calls go in the
   same message — a wave summary must ride WITH the next wave's tool calls,
   never as a text-only message (every mid-run message carries tools — a
 report never substitutes for them): while the run is live, NO message without
   tools. The only legal tool-free messages are the BLOCKED label, an
   escalation pause, and the end-of-run HANDOFF — nothing else
   (normal user Q&A is exempt — see Scope; user-set 2026-11-11, earned from
   W31-type stall: summary with no tools ends the turn and stalls the run
   even though nobody said stop). Mandatory closer: "Next: <backlog head> —
   tools below." plus ACTUAL tools below. BANNED closings (each is a
   permission gate on its face): "when you say go", "whenever you're
   ready", "want me to continue?", "say continue", "let me know",
   "ready to resume", or any
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

A run ends only at the stop reasons (user stop — including unextended cap,
genuine block, proven-dry). "Root answered" is a milestone, NOT a
stop reason — file the verdict and
keep chaining the open branches and the standing slot (agenda
item 6). Running out of direct leads never ends a run either — that is
what the tangential slot (agenda item 6 — the standing unworked angle) is for. There is no "final reply with no tools behind
it" mid-run: status reports ride along WITH continued tool calls, never
instead of them. A plain reply with no tools IS the handoff — emit one only
when the run is truly over (stopped, capped, or blocked). When in doubt, keep
chaining. Past behavior to not repeat: winding down after a few waves because
the agenda emptied — the hole is nearly endless by design.
A legitimate handoff and a forbidden sign-off look identical on the wire (a message with no tools) but differ
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
sign-offs with no tools behind them): three questions, binary answers, in
order — STOP? (did the user say stop) / DRY? (backlog empty AND zero new
spawns AND tangential slot dead AND lookups closed/parked) / BLOCKED?
(same tool failing after 2 varied retries, or missing user-only input — a tool
that does not exist is missing implementation → escalate, not BLOCKED)?
A single failed tool call is NOT a block: report it WITH its retry in the same
message; it becomes a BLOCKED tool-free message only after 2 varied retries.
If none: keep working — emit tool calls, not a sign-off. This checklist
and the pre-send gate are the SAME check under two names — do it once,
not twice. Legal tool-call-free turn-enders
mid-run: the stop reasons above, labeled BLOCKED
("BLOCKED: <reason> | tried: <...> | need: <...>"), or an explicit user hold for
the current turn. Scope: this section binds rabbithole runs only; normal
conversation is unaffected and may end turns freely.
Pre-send gate (user-set 2026-11-11, W31/W34/W35 incidents): before any
tool-call-free message, confirm one of (1) user stop, (2) all-four
out-of-leads, (3) BLOCKED with label, (4) explicit user hold for this turn,
(5) I am answering a user question RIGHT NOW (normal conversation only —
mid-run answers ride WITH the next wave's tools and need no exemption; exempt
under Scope; questions arriving AFTER the message cannot retroactively
justify it). A summary is not a question — (5) needs a real user
question asked in this turn; answering one never ends the run, so put the
answer WITH the next wave's tools, never with a sign-off. The gate fires
only on tool-free messages — a summary or answer riding WITH the next wave's
tools is compliant (the required shape), never a violation. (6) I am escalating to the user (missing tool, forbidden permission, or irreversible action), need stated — the run resumes on their reply. Decision rule (user-set 2026-11-11): whenever evaluating
whether to continue chaining or yield with an explicit HANDOFF for reasons
of turn length or user request, justify the yield with EITHER (a) "I have
run out of leads, there are no more waves left" (all-four out-of-leads
proven) OR (b) "The user explicitly asked me to stop" (stop/hold covering
this turn). Turn length, waves run, and visibility are never justifications
on their own. System-forced ends (compaction, disconnect) are not decisions
and need no justification — write the packet anyway. Explicit handoff
format: "HANDOFF: <cause: compaction | disconnect | user hold> | packet:
state+log+record written, newest wins | next: <backlog head + exact
action>". Log every mid-run tool-call-free end as an incident in `log.md`
under a `## Incidents` section (what, backlog size, which exemption claimed) —
operational incidents, not learning-meta (learning goes in verdicts) —
visible habits die faster.

## Interruptions

- errors: retry once, isolate, save good work, record failure.
- limits: smaller waves, longer pauses; no auto-stop except an explicit cap.
- compaction: reconcile after — read handoff note (filed per memory skill: the
  working-record entry IS the durable copy, `scratch/HANDOFF.md` an
  optional mirror) + working record +
  state.json + log tail. Verify `state.json` parses before the first
  resume tool call; if corrupt, fall back to log tail + record (newest
  wins) and rebuild state. Newest timestamped entry wins conflicts
  (tie-break detail: memory-skill Reconcile Step 2 — later-in-file breaks
  ties only in the SAME file, identical timestamps across files →
  UNKNOWN); mark uncertain fields UNKNOWN and re-derive with one wave
  rather than guessing. A parsing `state.json` is the resume base, not a
  conflict candidate — newest-wins applies AMONG log tail + record, and to
  verdicts the state lacks (step 6 machine-copy rule). Resume packet invariant (user-set 2026-11-11): backlog head +
  exact next action must already be written in state and the working
  record BEFORE any summary text. The packet IS those two files' content
  (state.json `branches.open[0]` + log tail) — no separate packet file exists;
  that is what makes a forced handoff cost one resume step, not a debug session. Quote
  the head: the summary's stated next action must be a verbatim quote of the
  just-written backlog head (`state.json` branches.open[0]) — a summary claiming
  an unwritten action violates the invariant even if some head was written
  earlier. After reconciling, emit the next wave's
  tools in the same turn — never a bare "ready to resume" message.
- lost connection: RISK ACCEPTED — resume from last checkpoint.
- scope: nearly nothing is scope creep (see Purpose). Minor add/remove is mine
  to decide — ask "should this be in scope?", document the answer in
  `scopeNotes`/log. A DIFFERENT METHOD toward the SAME goal is in scope by
  default — never a scope change, never an escalation. (Concept vs
  implementation: an in-scope method whose implementation needs a missing
  tool, a forbidden permission, or an irreversible action escalates the
  IMPLEMENTATION — the idea stays in scope.) A tangent that becomes
  a different GOAL is also not escalation — promote it to its own run
  (promote = new `<slug>/` dir + `state.json` root + pointer lines in both
  logs; bookkeeping, not escalation). (Not to be confused with
  promote-or-recipe, the method-preservation rule — different "promote".)
  Escalation is only for leaving
  research-only or irreversible actions.
- forks: pursue competing branches in parallel until one is noticeably less
  productive, then prune the loser with a verdict (prune only on a verdict —
 dead-end or dominated with numbers — never on slowness alone; slow branches
 are scheduled, not killed). Pruned branches keep their
  verdict and stay revivable; pruning is a delegated judgment call, logged.
  Escalate only forks that need user values, major scope, or an irreversible
  choice.
- optional cap reached / irreversible action / ambiguous vision / missing
 user-only input: escalate. (Irreversible = outside the run's own durable dir
 and scratch: pushes, shipped-code changes, external side effects — writes
 inside `src/evidence/<slug>/`, the working record, and CHATLOG lines are the
 job, never escalation.)

## Scope and ownership

Research + docs only. Read-only toward the lab/generator/repo: may write
disposable scratch notes plus durable task records, CHATLOG lines, and
research docs (durable = under `src/` — a `scratch/` working copy may also
exist, but NEVER `scratch/` alone).
Disposable means explicitly OK with losing it; anything referenced later
MUST have its durable copy under `src/`. No shipped-code
changes, pushes, or irreversible actions without explicit instruction.
Assistant decides day-to-day research direction within scope and throttle (pacing) — the user still overrides via stop, scope, or explicit instruction.
Precedence (collision order, validated P2-7 2026-11-12): stop reasons > scope
> wave loop > throttle. A stop (user stop, unextended cap, proven-dry, genuine
block) beats any mandate to continue; scope (what is in-bounds) beats
wave-loop defaults (which questions, how many); the wave loop beats throttle
(pace never overrides a MUST — a skill mandate). When two MUSTs collide, the DRY?/BLOCKED?
checklist is the tie-break.

## Known problems (posted 2026-11-12 — amend, never delete; move to Solved with date when fixed)
Codes: S = solved (mechanism already in-skill — reviewers test the fix, not
re-find the bug); U = unsolved (fix proposed but untested, or no fix yet).

Solved (mechanism already in-skill; listed so reviewers test the fix, not re-find the bug):
- S1 mid-run sign-off stall (W31 shape: summary with no tools ends the turn)
  → wave-loop step 8 atomic report+tools + BANNED closings + pre-send gate.
- S2 early wind-down (agendas emptying after a few waves) → marathon rule +
  queue rule (every wave spawns ≥1; empties only at run end).
- S3 evaporating waves on compaction → memory dependency + durable run dir
  + resume-packet invariant (backlog head + exact next action written BEFORE
  any summary text).
- S4 method loss (D-wave scripts in scratch/) → promote-or-recipe (shared
  with memory skill).
- S5 error-path hardening (P2 batteries 2026-11-12): state-init fallback
  (wave 1 persists minimal state before scouts), one-call scouts +
  malformed-output rule, fetch-failure path, state.json-first write order,
  tangential recovery count, single-failure-vs-BLOCKED, dry-wave
  all-branches check, hot-lead one-wave waiver, resume integrity verify,
  ambiguous-vision defined, step-7 immediate persist, method-vs-
  implementation escalation split, "ready to resume" banned.
- S6 precedence ladder (P2-7 2026-11-12): collision order stop reasons > scope
  > wave loop > throttle, posted as the Precedence rule in Scope. 10/10
  reviewers applied it to three collisions (breadth-vs-dryness, hold-vs-
  resume-YES, mandate-vs-dead-branch) with no contradiction to intent.

Unsolved:
- U1 NAIVE-READER BURDEN. ~300 lines, layered user-set patches, incident-
  earned rules (W31/W34/W35). Untested whether a first-time AI reader can
  operate it without misreading precedence (what overrides what when rules
  collide). This battery program (clarity rounds → refinement rounds) is
  the fix vehicle.
  PARTIAL FIX P2-5 2026-11-12: tangential bridge-or-verdict rule (verdict or
  bridge-back spawn within 2 waves, else dry + prune); fork prune gated on
  verdict, never slowness; escalation covers missing user-only input. Stays open.
  AUDIT P2-6 2026-11-12: unanimous 10/10 core-cut — Purpose + Agenda +
  Command + State + Wave loop stay core; marathon + interruptions + scope /
  deps / memory / durability / instances / sandbox / known-problems move to
  references/. Load-bearing lines already in core (durable-dir rule,
  deliberate-wandering). Physical split deferred to post-Phase-2
  (frozen-line stability for remaining battery rounds).
- U3 TURN-CLOSE CHECKLIST LOAD. The checklist is consulted at the highest-
  pressure moment (pre-send); a tired reader skips it — same forgetting
  class as memory-skill U5. Proposed: shrink to 3 questions, exact wording.
  FIX P2-4 2026-11-12: exact 3-question wording shipped (STOP?/DRY?/BLOCKED?);
  checklist and pre-send gate declared the SAME check; summary-is-not-a-
  question guard added to exemption (5). Stays open until observed holding.
- U4 SCOPE-BREADTH PARADOX. "Nearly nothing is scope creep" + shotgun
  default vs finite waves: naive readers either wander without verdicts or
  narrow immediately. The wave-loop verdict requirement is the counterweight;
  whether it holds for new readers is untested.

## Dependencies

- `websearch` (required) — primary-source fetches (step 4 of the wave
  loop) run through it. No websearch = no external facts, only synthesis.
- `memory` (required) — state.json/log.md/CURRENT_TASK checkpointing
  (steps 6-7) follows the memory skill. No memory = waves that evaporate
  on compaction (context loss — see the memory skill).
- `fresh-eyes` (optional) — point at findings, plans, or this skill
  itself before committing to a direction. Used here for the agenda and
  the skill's own review (5 points, 2 real gaps fixed).
- Absence rule: a missing required dependency stops every wave that needs it
  — no external-fact waves without `websearch`, no multi-wave runs without
  `memory`. (`fresh-eyes` is optional: proceed without it.)

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
  it lives in a tracked path or its full recipe sits beside the numbers.
  "Recipe" = the exact config + seeds + every method delta vs checked-in
  code, written so a stranger can rerun it. Numbers whose script is gone
  AND whose recipe is missing are hearsay — flag them, never build on them
  silently. (Earned: D-wave scripts died in `scratch/`; the G series was
  rebuilt from prose.)
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
durable log — URLs are the durable reference, dumps are re-fetchable. If both a dump and its URLs die, numbers derived
from it are demoted to hearsay (no method, no numbers — promote-or-recipe):
the exception is a calculated risk, not a guarantee. All
other wave-loop/state/queue rules unchanged. Durable logs MUST NOT cite
`scratch/` paths as live references (provenance/debug pointers only).

## Run instances (tracks specialize; the skill stays generic)

- Track C run rules (canonical for that run):
  `src/evidence/rabbithole/track-c/RULES.md` — stop/turn phrasing, verdict system,
  synthesis cadence, trail conventions.
- Track C shelf/history: `src/steal/papers.md` (Track C's name for its own shelf; points to RULES.md).
- Novelty-optional verdicts, gated paper patches, sandbox experiments with noted
  results (user-set 2026-11-11) are run-level regime choices recorded in the
  run's RULES.md, not skill changes (these are Track C's entries — defined in its RULES.md).
- Precedence: a track's RULES.md is canonical for that run within the
  dimensions above (phrasing, verdict system, cadence, conventions, regime
  choices) — it does not waive skill mandates (MUST/NEVER/stop rules still
  bind). A track with no RULES.md yet runs on the skill's generic defaults (this text as written);
  each RULES.md binds only its own run.

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
  method) MUST be promoted to its own run (or logged dead with why) — log a pointer
  both ways and keep going. Promotion is bookkeeping, not escalation.
- Docs stay OUT: run state, logs, and records live in
  the durable run dir + working record, so the sandbox can be freely
  overwritten. Provenance of anything copied in is recorded in the durable
  run log
  (outside the sandbox), never inside it: source URL + version/commit +
  hash where available (`used public weights` alone is a description, not
  provenance).
