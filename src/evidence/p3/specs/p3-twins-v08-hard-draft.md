# Twins v0.8 DRAFT (2026-11-18) — UNCOUNTERSIGNED, no compute
Hard-exam transmission test. v0.7 showed students copy (0.94–0.99) but exams
don't discriminate (blinds up to 0.54). This version builds exams that random
nets find hard, then tests whether taught students still match the teacher.

## Design (filed openly; anti-gaming notes inline)
- Per N arm (9601u/9602u/9603u; E excluded — halted in v0.7):
  teacher = filed joint pile (blobs p3-joint-N*-pile.json, frozen).
- TRAIN lines: joint mouth generates 100 lines (ancestral prefix-3 + T=1.0,
  rng outside loop, same generator as v0.7), seeds 97631/97632/97633.
  Teacher grades them. Student distills teacher softs on these 100 ONLY
  (same recipe as v0.5/v0.7: fresh 4-way attn, 1500 steps, softW1/hardW0,
  rMode1, batch8, lr5e-3). Student seeds 9790/9791/9792 (reused inits).
- TEST lines (held-out, student never sees): joint mouth generates 300
  candidate lines, seeds 97641/97642/97643. Teacher grades all 300.
- Hardness filter (AFLite-style, committee-held-out-blind):
  committee = 3 FRESH random 4-way nets, seeds 9651/9652/9653 (filed here,
  never used elsewhere). Each committee net grades all 300 candidates.
  Keep the 100 lines with LOWEST committee-vs-teacher agreement
  (majority-wrong first; ties broken by rng seed 9660, filed). The filed
  blinds (9610/9611/9612) NEVER participate in selection — they stay honest.
  Integrity: nUniq==100 on kept set, all cache rows finite, else ABORT arm.
- Honesty note: filtering uses random nets' grades, not the teacher's
  confidence and not the student's — the exam is hard for untaught nets in
  general, and the held-out blind verifies it. Train-on-test is REMOVED:
  claim is on held-out lines only. Train-line student scores reported
  descriptively (v0.7 replication check).

## Bars (unchanged numbers, new ground)
- Per arm: student-vs-teacher on 100 hard held-out: delta≥0.20, AND blind
  (filed seeds 9610/11/12) in 0.25±0.10 else VOID. N quorum 2/3.
- W: if ≥2 arms void with blind>0.35 again → the joint mouths' whole region
  is guessable (cf. 9601u generalization finding); kill mouth-exam line,
  pivot to pool-line transmission or close writer line. Filed as the tripwire.

## Cost / order
Forwards only for gen+filter (minutes) → 3 students ×1500 steps → grade.
Resume-safe ledgers (scratch/p3-hard-*.json). No silent extension.

## What countersign approves
Seeds above (train 97631–33, candidates 97641–43, committee 9651–53,
tiebreak 9660, students 9790–92, blinds 9610–12), 300→100 committee filter,
held-out claim with same bars, W tripwire. Any change = new version.
