# gameplan/ — the plan lives here (user-ordered 2026-11-18)

- `GAMEPLAN.md` — THE standing plan (v23, COUNTERSIGNED FROZEN 2026-11-17):
  Conventions + P1–P6 + approval trail, extracted byte-verbatim from the old
  `src/GAMEPLAN.md`. THIS is the file to follow. Rules: no compute on
  uncountersigned text (version-bound approval); snapshot to
  `src/gameplan-snapshots/` before any rewrite; report frozen arm first
  (parallel arms, no sequencing).
- `archive/` — everything else. All SUPERSEDED, none binding:
  - `v22-frozen-2026-11-15.md` — v22 paper-first plan (Phases 1–3) + Detour D1
    (DRAFT, uncountersigned) + Detour D2 (SUPERSEDED). Record only; zero spend.
  - `v04-gameplan-archive.md` — v4, moved verbatim (old path
    `src/GAMEPLAN_ARCHIVE.md` deleted after byte-verify).
  - `scratch-drafts/` — `next-gameplan-2026-11-16.md` +
    `borrow-gameplan-subplan-2026-11-16.md`, promoted byte-verbatim from
    private scratch (provenance headers inside; scratch originals deleted).
    Borrow-gameplan full prose also lives in the 2026-11-16 CHATLOG entry.
- Snapshots stay in `src/gameplan-snapshots/` (many references). Pre-move
  snapshot `2026-11-18-pre-gameplan-folder.md` (79682B, byte-identical to the
  old `src/GAMEPLAN.md`).
- Stale-path notes: version-pinned fleet drivers
  (`src/tools/fresh-eyes/gameplan-v*-fleet.js`) read `src/GAMEPLAN.md` by
  path — they now get the stub; their premises (v7–v10) are frozen records,
  rerun only against `archive/` text if ever needed. CHATLOG history keeps old
  paths verbatim (append-only rule); live pointers were updated 2026-11-18
  (`src/README.md`, `agents-augment.md`, `src/meta/root-README.md`,
  `src/docs/TESTING_PROTOCOL.md`, `src/tools/d1a-smoke.js`).
