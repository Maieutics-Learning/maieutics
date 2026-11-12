# Track-C rabbithole — canonical rules (the "skill itself")

Single source of truth for how this rabbithole runs. Parent skill (generic procedure):
`src/tools/rabbithole/SKILL.md`. Track shelf/history: `src/steal/papers.md`.
state.json / log.md / scratch/CURRENT_TASK.md point HERE; they do not duplicate. If they disagree with this file, this file wins.
(Durable home: src/evidence survives reloads, handoffs, compaction. NOTE: src/ is PUBLIC —
this file contains operating rules only, no secrets, so that is fine.)

## 1. Stop rule (opens every wave)

Stop only when justified by user request or out of leads (no waves left).
Out-of-leads = ALL of: (a) backlog empty, (b) zero new spawns from cleared waves, (c) standing
tangential slot dead, (d) lookups closed or parked with user sign-off. Otherwise report, don't vanish.
Finishing the original shelf, verdict counts, synthesis rounds, failed waves, and per-wave budget
pressure are NEVER stop conditions.

## 2. Turn rule (anti-habit)

A message with NO tool call ends the turn and is legal ONLY under the stop rule, as labeled BLOCKED,
or under an explicit user hold for the current turn. Wave-boundary reports, question answers,
summaries, and explanations NEVER end a turn by themselves — they ride in the same turn as the next
wave's tool calls. Turn-close checklist before any tool-call-free message: (1) user stop? (2) all-four
out-of-leads? (3) genuine block (same tool failing after 2 varied retries, or missing user-only input
such as a URL, password, or decision)? If none: keep working.
BLOCKED format: "BLOCKED: <reason> | tried: <...> | need: <...>".
A bare "continuing next" with no tool calls in the turn is a rule violation — say so and resume.

## 3. Scope

Sections 1–2 apply ONLY during rabbithole runs (Track C, or any track that adopts this file).
Normal conversation — answers, explanations, questions back to the user, planning chats — is
unaffected and may end turns freely.

## 4. Wave budget (standing)

Per wave: 1 direct + 1 tangential; at most 2 search-scouts (≤100 words each) + 2 primary fetches.
Mine existing dumps before fetching. At floor (0+0) is allowed and recorded; at cap stops the wave.

## 5. Verdicts

USED / USED-CONFLICT (resolved by scoping) / SKIMMED / UNRESOLVED / SKIPPED-with-teeth /
covered-by-reference. Novelty is NOT required: non-novel items stay in play as improvement targets;
precursor tags exist for paper scoping only. Verdict bar (including SKIPPED) is the agent's call.
Every verdict lands in state.json (verdicts[]) and the wave note, with a findings[] entry.

## 6. Spawning (breadth-first, no cap)

Every cleared wave spawns ≥1 follow-up wave from its open questions (more allowed). Spawns append
to the BACK of state.json backlog[]; consumed entries are removed at execution. No queue cap.
The rabbithole ends at user stop or genuine out-of-leads — unlikely by design.

## 7. Synthesis cadence

Synthesis round every 5 new verdicts (R1 = W20, R2 clock runs 0–5 then fires, queue-jumping
logged). Each round: verdict counts, SKIP-tag table, 3-of-a-kind anti-pattern check, conflict
ledger. Conflicts filed as USED-CONFLICT with resolution, never left open silently.

## 8. Trail conventions

Durable trail: src/evidence/rabbithole/track-c/ (state.json + log.md + notes). Fetch dumps go to
scratch bin (scratch/track-c/); URLs are the durable reference and are logged. STOP RULE line opens
every wave note and log entry. scratch/CURRENT_TASK.md is the working scratch record only — it must
never hold anything that isn't also derivable from this file + state.json + log.md.
