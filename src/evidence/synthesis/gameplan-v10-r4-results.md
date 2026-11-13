# Gameplan battery v10 round 4 PAIRED DEBATE — results (2026-11-13): 2 ACCEPT / 3 REJECT → v11

Premise: `src/GAMEPLAN.md` v10. Spec: `src/evidence/synthesis/gameplan-v10-battery-spec.md`.
Raw: `scratch/gameplan-v10-r4-raw.json` (10 sealed ARMED openings + 10 UNARMED rebuttals, 5 claims × RED/STEELMAN).
First run of skill format 10 (sealed openings, then 1 quoted rebuttal each, owner adjudicates).
**Output: 2 patches folded to v11. No round 5 — the ACCEPTs are additions, not breaks; next is execution, not review.**

## Rulings (owner; ruling — not who "won" — is the output)

- C1 fading decidability (RED BREAK / STEEL HOLD) → ACCEPT ADD. RED's gap is real:
  no arm reaches zero-hints non-gradually, so staged-beats-constant would not isolate
  graduality from final-state. STEEL conceded the gap and named the same settler; its
  "redundant if attn-only fails" defense fails (attn-only outcome does not test
  graduality). Patch: 1.a.iv instant-drop arm (full hints 0–1500, zero after, 8 seeds,
  ≈5 min) + numeric verdict + five-way table.
- C2 position rule (RED BREAK / STEEL HOLD) → REJECT. RED misreads the claim: the 0.95
  rule is a fail-safe decision procedure (low ρ MANDATES the swept-variant replacement),
  not a proof of generalization; RED's ±N-shift test IS the sweep; common-mode caveat
  already priced (r3 S2). No patch.
- C3 two-task sufficiency (RED BREAK / STEEL HOLD) → REJECT (repeat of r3 S3, already
  answered). Claim is bounded ("FIRST verdict", schedule level); scope is owned by 2.c
  (sorting + FST) + failure frame + gap-analysis tripwire, all already in text. Residual
  stands as priced; no patch.
- C4 gate logic (RED BREAK / STEEL HOLD) → REJECT. RED's demands are already in text:
  tutor-swap covers low- vs high-performing G1 winners (not high-only), N=10 is 2.b.0,
  G2→G5 answered by second chain + survival CI + gap analysis (2.b.i–iii). RED conceded
  gap analysis is the right falsifier. No patch.
- C5 harness credibility (RED BREAK / STEEL HOLD) → ACCEPT (wording/gate). Both sides
  concede the present-tense overclaim (harness unbuilt, 1.d pending). Patch: 2.e.iv
  explicit submit gate. No design change (fail-closed + re-ledger-or-cut already there).

## Method note (format 10 maiden run)

- Sealed-then-rebuttal worked as designed: C1 converged (both sides named the same
  settler — strong ACCEPT signal); C2/C4 rebuttals exposed attacks on already-answered
  points (strong REJECT signal). The rebuttal round earned its 3x cost here.
- Reviewer errors logged: C2 RED (claim misread — correlation as proof vs decision rule),
  C4 RED (demanded existing text — tutor-swap + N=10 + gap analysis).
- Primaries: 7/10 landed (2 no-primary: C4 RED, C5 both — adjudicated from plan text,
  which is authoritative for wording claims anyway).

## Iteration totals

4 rounds, 36 reviewers (10 + 10 + 6 + 5×2): r1 1/3/6 → 8 adoptions; r2 1/2/7 → 9;
r3 6/6 HOLDS (+3 folds); r4 2 ACCEPT / 3 REJECT. v11 = v10 + 1.a.iv + five-way table
+ 2.e.iv submit gate. Next: execute — Phase 1.a prereg (arms i/ii/iv + verdicts).
