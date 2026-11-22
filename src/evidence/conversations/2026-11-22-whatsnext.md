# Transcript 2026-11-22 — what's next (memory review + proposal)

user: Lets go ahead and see what is next, feel free to look at your own memory for questions, what worked, what didnt and what you have tried. Be sure to log everything. Write everything down in the transcript in evidence/conversations
assistant: Reviewed the durable layers before answering: scratch/CURRENT_TASK.md (working record, newest wins), src/CHATLOG.md tail (17 entries today), src/RESULTS_INDEX.md + src/claims.md (paper-claims layer), src/evidence/decomp verdicts + REPRODUCIBILITY.md (program layer). Step 0 done; memory + fresh-eyes relevant, no compute this turn (assessment only — no train launched).

## What worked (banked, durable)
- Tailoring STEERS where substrate is learnable-but-unlearned + non-memorizable (D/F1 ranking 6/6, p~=2e-5; F4 causal dose 9/9 monotone, Spearman +0.67). Program CLOSED.
- Label-free verifier: distill4 BLOCKS 3/3 (v11, first no-labels PASS, B0 1.00 / B3 0.46-0.52); STACKS V1 (R2 +0.10 mean) and again at round 3 (R-a +0.045/+0.14/+0.04, no half-life thru 900 steps); double dissociation (R-b COLLAPSE without pinning, R-c BLEED without cycles). Constraint + selection composes across rounds.
- Methods: prereg-per-batch + fresh-eyes-per-track + blind repro battery v1 → REPRODUCIBLE-IN-REPO; blind reviewers' unanimous FAILURE predictions vs filed STACKS certifies the surprise genuine.
- Pool live 4/5 (groq/OR/gemini/kaggle; HF 402) with routing notes (open generation -> gemini; short verifiable -> groq >=256 cap).

## What didn't (informative bounds, all filed)
- Interrogation exhausted: decomp sub1 ~chance + no re-break value; scale ladder all rungs FAIL; novel-type echo-collapse 3/3 + interference-then-parity; pin OVERWHELMED (weight irrelevant — coverage is the variable); assembly flat; focus faithful-but-useless; depth FLAT/NO-TRANSFER/SMEARED/SEARCH-TIED (expectation 1/5 scored openly). Outputs, focus, paths, rounds all bind to ~flat.
- Verifier scope: diet-fragile (H2/H3 CORRUPT — interference diet poisons everything); teaches its question only (X BOUNDED; shift systematically zero, parity chance); no stacking without constraint (F5 COLLAPSE).
- Pool: reasoning models unusable for open generation; B1 battery 20%-contaminated program-wide (relatives stand, absolutes understated).

## What was tried (complete program list)
Tailoring: 3 paths + 5 follow-ups (D/F1/F2/F3/F4/F5). Decomp: v10, scale, novel, cycle, pin v10/v11, assembly v10/v11, probe v10/v11, repeats, trace, focus, depth. Verifier: V1, H (3 arms), R (3 variants), X (3 arms) + 6 probes. Pool: 5 sources keyed + health + groq floor fix + OR default fix + decider rerun. Meta: blind repro battery (15 reviewers, 3 rounds) + log-completeness pass (81/81 files, repaired depth verdict).

## Open debts (the what's-next menu)
1. B1-undefined repair OWED (safe wrapper for new code; filed A.gen untouched). Cheap, de-risks every B1 number ever filed. Recommended first.
2. Half-life beyond round 3 unknown (round-4 run, ~30-40 min). Natural R continuation.
3. Representational moves UNSPECCED — the genuinely new direction: bottlenecked recurrence (no global attention → forced compression) or priced intermediates (supervision pricing intermediate steps). Needs a spec + countersign before compute.
4. Re-ledger queue (paper milestone-1, queued since 11-13): F2+M4+K battery, H2 spot check, multi-seed SNR. Paper-debt, not program-debt.
5. Teaching new operations (can the verifier extend to shift/parity? pooling corrupts — curriculum alternative unspecced).

## Recommendation
Do (1) first — owed, cheap, de-risks the whole B1 record — then user picks a lane: (i) round-4 half-life, (ii) representational spec, or (iii) re-ledger queue. No compute launched this turn; awaiting user pick. (No push made; this transcript + CHATLOG + record are the unpushed backlog.)
