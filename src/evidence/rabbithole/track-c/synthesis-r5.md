# Synthesis R5 — memory hardware + training loop + teaching budget (W40exec–W44exec)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Verdicts (5 waves, 5 USED-family, 0-fetch synthesis)
- W40exec GDN official impl: USED (block spec + Qwen/Olmo adoption + FLA fork).
- W41exec neg-eigval: USED strong (positive-eigval impossibility incl. DeltaNet-GH; [−1,1] fix; parity core).
- W42exec LoopThink-train: USED (fixed-R recipe + per-type logging + late checkpoints; curriculum/zero-init spawned).
- W43exec adaptive inference: USED (adaptive-metrics JSON + injection flag; ablation spawned).
- W44exec API micro-line: USED design (30K/mo $0.15, batch+cache, bursty-vs-steady rule).
- No conflicts, no precursors, no SKIPs, no covered-by-ref.

## Counts (cumulative over 49 verdict strings)
- This round: 5 USED (3 + 1 strong + 1 design). Historical tags retained (1 USED-CONFLICT resolved, 2 SKIMMED, 2 UNRESOLVED-strings since resolved, 1 SKIPPED-with-teeth, 1 covered-by-reference).
- Fetch honesty: wrong-ID + 404s recovered each wave by varied retry; attempts logged, 2-good-primaries-or-fewer banked per wave (W36 over by attempts, noted).

## SKIP-tag table (unchanged)
- dataset-distillation SKIPPED cost-mismatch; Aha SKIMMED no-fit. W44 reinforces: rent (API) + own (adapters/cache), never trajectory-matching at our budget.

## 3-of-a-kind anti-pattern check
- No triple repeat. Honest negatives remain distinct mechanisms. No Anti-Pattern note.

## Conflict ledger
- Both historical conflicts resolved, none open. This round: GDN adoption + neg-eigval limitation + LoopThink recipes + API budget all converge with the fade/teaching design; zero contradictions.

## New cross-wave convergences (4)
1. Memory wall mapped: DeltaNet-GH can't do parity (W41) → GDN official block (W40) bakes the craft that works around it (conv + gating + norms) → F-deltanet is now track-the-field, not just an experiment.
2. Train-then-adapt loop closed: fixed-R systematicity (W42) → adaptive inference with iteration stats (W43) → per-type logging everywhere (W4/W25/W31/R4) = the training/inference contract in code.
3. Injection consensus: prelude re-injection (ours) = input_injection flag (theirs) — one mechanism, two codebases; the ablation (W58) is the only open bit.
4. Teaching budget closed: adapters (W28) + API micro-line (W44) + hint-library cache (W44/W59) + local promotion (G-series) = four funding sources, one rule (spend rented calls on the frontier, own the rest).

## Spec status
- F-new fully executable (R4) + margin rule (W25) + swap-Δ (W38). F-shortcut audit fully spec'd. F-deltanet: official spec + limitation theory banked; kernel read (W54) + neg-eigval impl (W55) remain. F-singlegen/F-skillbank unchanged (source-grade). F-mech still paper-level (neg-eigval circuits point the way).

## Watchlist
- 21/21 USED-family across R2–R5. Agreeableness-check still owed — strongest adversarial candidate remains the unopened strong-to-weak refs (wall stands) or DAgger original (W50).
- Execution-vs-backlog numbering diverged (logged each wave); state.json wavesUsed authoritative (44 → this synthesis = 45).

## Queue effect
- R4 clock 5/5 RESET to 0/5 (now R5 clock 0/5). Backlog unchanged by this jump (17 items). Breadth-first resumes at head W43 Thompson controller.
