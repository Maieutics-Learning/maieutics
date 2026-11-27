# Paper-rep battery 3 results (RED-TEAM 10x on v1.2, 2026-11-27) — BARREN, LOOP CLOSED

Premise: `premise-paper-rep-v1.2.md`. Verbatims: `barrage-v3-1-5.md`, `barrage-v3-6-10.md`.
Round score: 10 reds, 0 adoptable findings. **Barren red → loop CLOSED per the
loop-closure convention. Paper stays v1.2.**

## Why barren (per-point rulings)

- **"Semantic vacuum / floating goal" (R1/R6/R7/R10): REJECT — attacks the
  firewall, not a finding.** The paper's measured transmission results (M4 1.00,
  G-series 35/40, transfer 6/6 on igniters) remain anchored to their regime;
  v1.2 stops those anchors from being borrowed by the representation story.
  That is the firewall working. "Goal-not-result" restates P3 ("maps the road"),
  agreed premise since v1.0 — not a retraction trigger.
- **"Post-hoc rescue / redefining failure as boundary" (R2/R8): REJECT —
  misdated.** The transmission scope follows the §4 evidence (hinted regime
  throughout); U58 tested a different substrate. The boundary is evidential,
  not post-hoc.
- **"U64h PROCEED / U64b leakage" (R6/R7/R9): REJECT — reviewer factual
  errors.** R6 cites a "U64h PROCEED verdict" — filed verdict is ORACLE-ONLY,
  never PROCEED (premise states it twice). R7/R9 tie U64b's PROCEED (recovery
  exam: info-vs-guessing) to the nursery endpoint it never claimed. Logged as
  premise-hygiene data point: verdict labels in ALL CAPS did not prevent
  misreading; future premises restate the verdict table verbatim.
- **"Oracle removed → collapse" tests (R2/R4/R5/R10): PARTIAL, already
  logged.** Non-oracle transfer tests are queued U60 task-spec inputs (battery-2
  ruling stands). They propose compute, not prose defects. No paper change.
- **"Move Integrated to appendix / relabel oracle-dependent" (R2): REJECT.**
  The paper makes no integrated-representation claim (P6 tags + v1.2 scope
  sentence explicitly withhold it). Nothing to move.

## Loop record
Battery 1: 10/10 (1 accept + 1 partial + 3 rejects) → patch v1.1 (§8 scope
sentence). Battery 2: 10/10 (1 refined accept + partials) → patch v1.2 (P1
transmission clause; endpoint goal-clarification). Battery 3 red: BARREN.
Adoptions-per-round fell 2 → 1 → 0. Paper frozen v1.2. Repeats of these points
are stale unless they bring a runnable test with a mechanism.
