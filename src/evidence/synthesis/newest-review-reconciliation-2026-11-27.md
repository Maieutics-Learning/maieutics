# Newest-review reconciliation (2026-11-27) — repository-review transcript intake

Source: `src/evidence/synthesis/newest-review-transcript-2026-11-27.docx` (+ `-extract.txt`,
47 paragraphs, software-parsed `w:t` runs; organized transcript, not byte-for-byte chat export —
its own fidelity note says numbers must be checked against ledgers before use as ground truth).
Status: ADJUDICATED, UNPUSHED. No code changed by this memo; every owed experiment still needs
its own prereg + battery + countersign per standing rules.

## Verification (agent-checked against the current tree + filed ledgers, 2026-11-27)

- **U70 numbers — VERIFIED exactly** (`f14-analysis.json`, `d-u70-oracle-f13.json`): train ctx
  0.8783 / probe 0.7183 / TRUE gap 0.1468; held ctx 0.7777 / probe 0.6227 / TRUE gap 0.0274;
  deltas +0.1007 / +0.0957 / +0.1195; oracle held 0.9537; TRUE-vs-partial train +0.0108 CI
  [-0.0005,+0.0222], held +0.0050 CI [-0.0046,+0.0146]. Every quoted figure matches.
- **Four fixes — VERIFIED landed**: ST forward-exact one-hot (u70nStep, T1-guarded); TRUE shuffle
  IS the metric path (F14 branch = `u70nApplyShuffle` call, T7/T8/T8b-gated); valid ECE
  (F12 swap + retention, E1–E4); held-out split with weight/config hashes (F13 T5/T6, F14 repCheck).
- **C5 arch caveat — VERIFIED still open**: recurrence candidate uses x + h only (no z input);
  z enters encoder/readouts, never the next state. The "recurrent net with categorical readout"
  reading stands; z-recurrence remains owed (matches required order).
- **Single-trajectory training — VERIFIED**: `runU70Neural` trains each seed on one fixed
  path+obs × 200 epochs (F4 v1.1 firewall). The review's "next experimental priority"
  (train across many trajectories) converges with the F15 proposal already named in chat.
- **"Four implementation problems" — compression noted, not an error**: the prior audit
  adjudicated 8 claims (C1–C8); the four fixed are C1/C2/C3/C4. C5 (arch) is carried as open
  in this review; C6 (citation form adopted) / C7 (ledger-grounded) / C8 (process) stand filed.
- **U64h section — CONSISTENT with filed record** (not re-measured): senMax/senPick 0 triggers
  in 3000 slots each; LOOP-O 17/20 MET; U65–U69 unlicensed; no PROCEED. Matches `self-u70` record
  and CURRENT_TASK (U64h ORACLE-ONLY).
- **P3 / P4 / decomp sections — NOT independently re-verified** (outside current tracks, no
  ledger paths cited in the transcript): no contradiction found with the filed record; P3
  ledgers exist under `src/evidence/p3/`. Treat these sections as review-reported, not
  ledger-confirmed, until a track owner re-checks them.
- **Process praise (F11 correction, real-path tests, preserved negatives, gated follow-ups) —
  ACCEPTED as accurate**: correction memo + T7/T8/T8b + append-only discipline are filed.

## Corrections to the review (one stale, from timing)

- **Push staleness: the review predates push `af36550` (2026-11-27).** "U70's README says
  F11–F14 are unpushed" was true of the reviewed archive; F12–F14 content (waves, batteries,
  ledgers, Step 22/22 README) is now on the public branch. Residual lag (local-only): the
  push-section sentence + CHATLOG PUSHED receipt (the standing "receipt" backlog). Nothing
  substantive remains unpushed.
- **Root README staleness: CONFIRMED and still true.** Root `README.md` "Current state
  (2026-11-16)" is paper-era (no U-program); `src/README.md` fronts frozen GAMEPLAN v23 with
  Phase 0–5 as archived context. The unified-status / README-alignment recommendation is
  recorded as OWED docs work (needs owner order; not started — no unilateral restructure).

## Recommendations disposition (all converge with the filed order)

- U70 multi-trajectory training → F15 candidate (highest priority, agreed). z-recurrence second
  (matched data + controls) → queued per audit order. Ablations (no-latent / randomized /
  full-shuffle / recurrent-only) → owed item 4. Unfamiliar-context LAST → agreed (recognition
  test only after competence). U64 stays gated → agreed. P4 conditional-preservation → no
  objection. Each needs own prereg + battery + countersign; nothing licensed by this memo.
