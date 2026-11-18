# Agent augment — always read this file first, every session.

> **Always read src/agents-augment.md first, every session.**

This file collects the standing instructions for any AI working in this
repo, extracted verbatim-in-spirit from `src/README.md` (2026-11-18). If
this file and a session's habits conflict, this file wins. If this file
and `src/GAMEPLAN.md` conflict on substance, the gameplan wins and this
file gets amended.

## 1. Orientation (from README l.8-10)

- Step 0 — MANDATORY, every session, before any other reads or work (including status or read-only questions): `read src/tools` (list the folder) + `read src/tools/README.md` (index). A contextless agent that skips this has already failed. State in your first working note which skills are relevant (or "none relevant" with one-line why).
- Start-gate (user-ordered 2026-11-18): Step 0 is BLOCKING. No status answers, no other reads, no work before it. First tool calls every session = list `src/tools` + read `src/tools/README.md`, then first working note states "Step 0 done" + which skills apply. A session that answers before Step 0 logs the miss in CHATLOG the same session.
- Then start here: `src/README.md` (root map — results, layout, reproducibility),
  `src/gameplan/GAMEPLAN.md` (the plan, currently v23 frozen), `src/RESULTS_INDEX.md`
  (every MEASURED claim → artifact → status), `src/CHATLOG.md` (session log,
  newest last).
- Reusable skills live under `src/tools/` (websearch, rabbithole, memory, fresh-eyes, eval-harness, paper-compile, and more). Forgetting that
  folder exists is a known, repeated failure mode — Step 0 exists because an agent
  given the README alone still used none of the tools and re-proposed a run sweep.
- Helpers need an explicit invocation checklist, not assumed initiative.

## 2. Workspace / durability rule (user-set 2026-11-11, from README l.12)

- `scratch/` is a recycling bin, not a sandbox — nothing referenced may
  live there. Assume it can be wiped on reload, compaction, or new chat.
- Run records, review verdicts, working data, evidence, code, docs live
  ONLY under `src/` (evidence under `src/evidence/`).
- Pointers in the paper (`index.html`) and track files (`src/steal/`) aim
  at `src/evidence/`, never at `scratch/`.
- `src/` ships publicly: never put secrets there. Secrets live in the
  vault / with the user, never in chat or files (and PATs never leave the
  browser).

## 3. Memory discipline (from `src/tools/memory/SKILL.md` core)

- Working record: newest timestamped entry wins; keep short, link files.
- Append to `src/CHATLOG.md` once per session (decisions + MEASURED numbers).
- Retractions are struck through, never silently edited; UNKNOWN beats guessing.
- Numbers sacred: quote exactly, with source paths.
- After compaction: re-list workspace, re-read working record, reconcile,
  then continue.

## 4. Honesty rules (from README throughout)

- State emulation/compute costs honestly (the kept rule: emulation costs K×
  tokens, true cost K× FLOPs / 1× tokens — never present one as the other).
- Report negative results and scope limits (chance controls, OOD failures,
  capacity ceilings) with the same prominence as positives.
- Scope labels on anything small-scale (bench h48 is not 3.5B).

## 5. Meta
- This file changes by user order or by amending a rule that changed in a
  session (same-session update, with the reason). Stale augments are worse
  than none.
- Pointer discipline: this line also lives in `src/README.md`,
  `src/CHATLOG.md`, `src/gameplan/GAMEPLAN.md`, and the working record, so a future
  session meets it wherever it enters: **Always read src/agents-augment.md
  first, every session.**

## 6. Handoffs (user-ordered 2026-11-18)

Every handoff note this project writes must do two things, no exceptions:
1. Be written AFTER re-reading this file (note any rule used, changed, or
   added this session — the handoff is where drift gets caught).
2. Quote the line verbatim, so the next session meets it even if it reads
   nothing else first:

**Always read src/agents-augment.md first, every session.**
