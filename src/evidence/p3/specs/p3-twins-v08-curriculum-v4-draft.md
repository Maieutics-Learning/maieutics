# Twins v0.8 CURRICULUM v4 DRAFT (2026-11-18) — UNCOUNTERSIGNED, no compute

User order: stop separating ear and mouth. One brain per agent (trunk + mouth +
ear heads, v0.6-style dual-head), separate trunks across agents (NO joint trunk
across tutor/student — that smuggles via shared weights; single-brain means
within-agent merge only).

## What merges, what stays apart

- Tutor (9840-42): single trunk (E+attn+MLP, h48) + mouth head (19-way) + ear
  head (4-way), fresh init. Mouth trains raw next-token only (easy lag-1 500,
  hard lag-2 500, 800 steps as v3). Ear trains ONLY on tutor-originated signal:
  distill of tutor's own mouth (predict tutor's own next-token entropy bucket
  per position: low/med/high/critical → 0/1/2/3, computed from tutor's own
  forward passes, no pool-structure rules, no thermometer, no experimenter
  labels). Tutor schools its own ear with its own uncertainty. Allowed: tutor
  makes its own labels.
- Student (9850-52): same dual-head arch, fresh init, separate trunk. Mouth
  consumes tutor bundle as v3 (hard CE + KL to tutor logits, alpha=0.5).
  Ear consumes tutor ear bundle (KL to tutor ear soft targets on tutor lines).
  Every training target originates in the tutor. No pool/thermometer labels.
- Thermometers (N-9101, d1a): stay frozen, grade-only, for dialect verdicts
  (independent witnesses). Internal-ear agreement (tutor-ear vs student-ear on
  shared pool) reported descriptively, never a verdict — tutor never grades its
  own homework for the record.

## Keeps from v3 + student triple-test (user-ordered)

Lag-2 hard (9810), easy lag-1 (9770), seeds (tutors/students/blinds/class/stage/
train), 800-step recipe, bars (0.20 + dialect 0.15), quorum, W.
Bundles extend: lines + tutor next-token soft targets + tutor bucket
soft targets + certainty + focus. Provenance: student loads bundle only.
Student measured on BOTH locked tests at all three stages: S0 (fresh, before
anything), S1 (after Class 1), S2 (after Class 2). CLAIM1 = S1-easy vs S0-easy;
transfer = S1-hard vs S0-hard (descriptive); CLAIM2 = S2-hard vs S1-hard;
retention = S2-easy vs S1-easy (descriptive).

## Why not joint trunk across agents

v0.7 proved shared trunks learn fast and prove nothing (gradients smuggle the
answer through shared weights). v4 merges within brains, never between them.
Tutor trunk, student trunk, blind trunk never touch.

## Countersign approves

Dual-head per agent (h48 trunk, mouth 19 + ear 4), tutor-ear self-distill
spec above, student dual-channel from bundle, thermometers kept for verdicts.
Any content change = new version. No compute until countersigned.
