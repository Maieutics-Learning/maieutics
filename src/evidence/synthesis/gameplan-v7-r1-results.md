# Gameplan battery v7 round 1 — results + adjudication (2026-11-13)

Premise frozen: `src/GAMEPLAN.md` v7 (+ verified-numbers context). Spec:
`src/evidence/synthesis/gameplan-v7-battery-spec.md`. Raw:
`scratch/gameplan-v7-r1-raw.json` (10 sealed generateText verdicts, each with 2 OWN DDG
searches + 1 primary read; 6/10 primaries fetched, 4 no-primary).
Score: 1 HOLD / 3 BREAK / 6 PARTIAL. Not barren → patch once → v8 → round 2.

## Adjudication (owner's rulings; rejects are data)

1. **A1 HOLD** (gate 2.b on Phase 1; hardest test = 1.a.i). ACCEPT (already the design;
   gate stays explicit). Note: validity beyond flaw-fixing comes from 1.c/1.d + C.
2. **A2 PARTIAL** (exits 2.c.iii/3.a.i are vibes). ACCEPT: numeric exits — cross-family
   transmission declared at ≥5/8 same-schedule ignitions, lookup-local at ≤2/8;
   3.a.i bar = Q1/Q2 answered + ≥5/8 on one cross-family task.
3. **A3 PARTIAL** (kill rule unfalsifiable without Δ). ACCEPT: 1.a.iii numeric — attn-only
   ≥4/8 igniting rewrites fading as non-essential; constant-combined within CI of staged
   means the schedule isn't doing work.
4. **B1 BREAK** (parity too different; demands assoc baseline + zero-shot weight transfer).
   REJECT break: difference is the point (schedule-level generality, never weight-level —
   cross-task weight transfer was never claimed). ACCEPT grain: state schedule-vs-weights
   explicitly in 1.c.
5. **B2 PARTIAL** (soft-target leakage; add hard-target-only arm). REJECT arm: hard-only
   with no tutor/hints IS the H-wall (0/32, already run). ACCEPT grain: name H-wall in the
   1.a four-way table (soft-only D1 ✗ / hard-only H ✗ / attn-only NEW / staged ✓ /
   constant NEW).
6. **B3 BREAK** (cut 2.b; N=10 G1→G2 + shuffle-seed trial). PARTIAL: REJECT the CUT;
   ACCEPT shuffle-seed cross-lineage G2 + G1→G2 rate as new 2.b.0 cheap pre-gate.
7. **C1 PARTIAL** (silent source/artifact divergence). ACCEPT: post-build byte-compare gate
   (hash stamp + verify step; build fails closed on mismatch).
8. **C2 BREAK** (wall-clock: read 35s as per-step). REJECT (reviewer error — ledger rate is
   10.8ms/step, ≈35s per 3k-step seed; Phase 1 ≈ under an hour). ACCEPT grain: relabel
   unambiguously in v8.
9. **D1 PARTIAL** (fade/randomize targets too). Merged into #5 (that IS the H-wall);
   no new arm. Risk restatement of Q1 already in plan.
10. **D2 PARTIAL** (mechanism too narrow; hard step-fade vs soft fade). ACCEPT: new cheap
    arm 1.a.iv (step-function fade) — schedule-shape probe. Chain worry answered by 2.b+B3.

## Patch v7 → v8

Numeric exits (A2), numeric kill thresholds (A3), schedule-vs-weights sentence (B1),
four-way table + H-wall naming (B2/D1), 2.b.0 shuffle-seed pre-gate (B3), byte-compare
build gate (C1), wall-clock relabel (C2), step-fade arm 1.a.iv (D2). Reviewer errors
logged: C2's per-step misread (premise relabeled); B1's weight-transfer demand (never
claimed — artifact sentence added).
Adoptions: 8. Next: round 2, fresh reviewers, same ask, on v8.
