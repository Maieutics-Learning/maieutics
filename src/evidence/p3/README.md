# P3 twins-transmission record (moved from scratch/ 2026-11-18, byte-verified)

Path rule: every `scratch/p3-*` path in old records (CHATLOG, CURRENT_TASK,
specs) now lives at `src/evidence/p3/<phase>/` below with the SAME filename.
Frozen history was not rewritten — apply the prefix rule when reading.

## Layout (mirrors p2/'s flat run files, grouped: 120 files, ~14MB)

- run-1a/ — E-build/N-recal/top-up, pilots v1+v2 (VOID-as-contrast),
  (b)-pilot v0.1+v0.2 (W-tripped, target absent), sharpener Stage-1 interim
  (void objective, halted), survey/recal scripts + ledgers.
- stage-a/ — 6 writer blobs (W9601/2/3 × f/u), A1 ledger, filed A2 profiles
  (A2c1/2/3 + c3-rerun), A2 REBUILD with persisted lines (A2r-c1/2/3 +
  18 line files, 100/100 unique each).
- stage-b/ — B ledgers. `p3-twins-B.json` = POISONED (NaN-cache bug), VOID,
  do not cite. `B-INTEGRITY-FAIL.json` = the all-pile-1 regen artifact (kept
  as the crisis exhibit). `Br*.json` = the valid rebuild (0/3, all-void).
- dual-v06/ — N pile grafts, E mouth + E pile, F mush exams/control,
  U/U1-U3, exams, verdict (B-dual gated OFF, F 1/3).
- joint-v07/ — N joint mouths/piles/ledgers/exams, halted E joint, B
  students + blobs, generalize ledger, U matrix, verdict (1/3, quorum unmet).
- specs/ — all prereg drafts + countersigned v0.6/v0.7. v0.8 curriculum
  (v2, raw-lines-only) is the only live proposal.
- drivers/ — harnesses: gen (A2 rebuild), stageB (B rebuild), dual (v0.6),
  joint (v0.7). Historical load paths inside them still say `scratch/` —
  future runs must pass the new paths (v0.8 run: update at build time).

## Standing verdicts (see CHATLOG 2026-11-18 + verdict files)

A1 PASS (+0.31) → A2 rebuild 0/3 → B rebuild 0/3 all-void → v0.6 U2 FAIL
(head-only) → v0.7 joint: N U2 obs 0.95/0.85/0.82, E HALTED, B-dual 1/3.
Moral: students always copy; exams/blinds decide; joint trunk fixes attach.

## Method preservation (promote-or-recipe)

Drivers above are the exact scripts behind every MEASURED number (deterministic
seeds inside). Blobs are gseries-1 (`T.gseries.loadModel`). Pools: structured
Markov-repeat p=0.35 (recon of ephemeral 9770) + uniform noise; recipes in
drivers, not prose.
