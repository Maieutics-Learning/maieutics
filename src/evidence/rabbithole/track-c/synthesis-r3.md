# Synthesis R3 — Group B + C2 closure (W28–W32)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Verdicts (5/5, all USED, 0-fetch synthesis)
- W28 QLoRA-cost: USED source-level. Split cheap-teaching three ways (adapters vs trajectory-matching vs black-box API); dollar-vs-calls reframe of W19 SKIP.
- W29 inference-stretching: USED source-level. Draft-verify = hint-solve w/ gate; Thompson-Beta = executable difficulty-gated fade; self-distillation = inference-time twin of generational teaching.
- W30 memory-vs-retrieval: USED source-level. Fade = RAG-to-parametric annealing (in-context → weights; severance = pure parametric test); adapters third vote.
- W31 tinyBenchmarks-eval: USED source-level (curriculum half covered-by-reference). IRT-weight items, ability-not-accuracy, adaptive next-item; honest negative on naive hand-roll.
- W32 aiwiki-guide: USED guide-level. Closes W6 UNRESOLVED can't-locate → LOCATED → CLOSED. C2 now primaries USED x2, guides USED x3 / SKIMMED x1.
- No conflicts, no precursors, no SKIPs, no covered-by-ref in this round.

## Counts (cumulative over 38 verdict strings; history retained)
- Total verdict strings: 38. This round: 5 USED (4 source-level + 1 guide-level).
- Historical tags still present in the ledger: 1 USED-CONFLICT (resolved, W10), 2 SKIMMED, 2 UNRESOLVED-strings (both since resolved: aiwiki now CLOSED; Aha remains no-fit), 1 SKIPPED-with-teeth, 1 covered-by-reference.
- No new walled primaries (v2→v1 retry succeeded W29).

## SKIP-tag table (unchanged)
- dataset-distillation: SKIPPED cost-mismatch/no-fit (W19). Stands; W28 dollar-vs-calls split reinforces it (adapters/API dominate at our budget).
- Aha guide: SKIMMED no-fit (W6). Stands.
- No new SKIPs.

## 3-of-a-kind anti-pattern check
- No triple repeat. Honest negatives (W23 message-effect mis-spec, W24 load artifact, W29 boundary-optimum artifact, W31 IRT-subset tie) are four but distinct mechanisms, not one pattern. No Anti-Pattern note.

## Conflict ledger
- Both historical conflicts remain resolved, none open: (1) W3 quality-filter reconciliation (no downgrade), (2) W10 fading-precursor re-scope to generational teaching.
- This round adds zero conflicts. aiwiki confirms paper numbers; QLoRA/LayerSkip/EESD/RAG/tinyBench all converge, none contradict.

## New cross-wave convergences (4)
1. Cost axis closure: W19 (trajectory-matching too $) → W28 ($0.005 breakeven but CALLS bind) → W30 (~1-query breakeven for stable sets). Teaching-cost question now split by budget type, not just dollars.
2. Inference-time twin: W29 draft-verify + Thompson controller + self-distillation is generational teaching compressed into one forward pass (draft = hint, verify = gate, distill = promote).
3. Annealing reframe: W30 RAG→parametric + W16 off→on-policy + W12 Coconut staged-fade + W26 exponential schedule all describe the same move (support in-context → support in-weights → sever).
4. Eval discipline: W31 ability-theta + W25 seed-discipline + W4 seed-reporting norm converge on reporting distributions, not points.

## Spec status
- 5 specs remain source-grade or better (F-skillbank, F-deltanet, F-shortcut audit, F-singlegen, F-new metrics stack). F-mech still paper-level (NMD port unbuilt).
- New executables banked (not run): Thompson per-item controller (W29), call-budgeted API micro-line (W28), IRT-weighted probe + adaptive next-item (W31, adapt-don't-hand-roll).

## Watchlist
- 10/10 USED across R2+R3 (all source/guide-level, zero conflicts). Agreeableness-check: clean, but R4 should deliberately hunt one adversarial read (strong-to-weak refs W33 is the natural candidate).
- aiwiki inner links (MoR, Coconut, UT/ACT pages) unfetched — spawned W46/W47, not debt.
- Log defect retained: W19/W20 duplicated lines; counts above use state.json strings as authoritative.

## Queue effect
- R3 clock 5/5 RESET to 0/5. Backlog unchanged by this jump (15 items). Breadth-first resumes at W33 (Scaffolding) next.
