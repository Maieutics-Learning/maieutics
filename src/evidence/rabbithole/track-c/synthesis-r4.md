# Synthesis R4 — teacher-questioning + metric stack + accumulation + message-effect (W34–W38exec)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Verdicts (5 waves, 6 strings, all USED-family, 0-fetch synthesis)
- W34 Scaffolding Networks: USED-contrast (interrogation, not fading; W21 falsification stands). Strong-to-weak half covered-by-reference (wall stands).
- W35 emlangkit topsim: USED (exact spec: normalized-edit + pdist + Spearman + pvalue).
- W36 Gerstgrasser: USED strong (accumulation avoids collapse; mechanism behind quality-filter + promotion).
- W36 scheduled sampling: USED (gold→model curriculum; fade-as-annealing precursor hardened at source).
- W37exec EGG language_analysis: USED (upstream of emlangkit; gap-MI + topsim callback + Disent doctests; message-effect absent).
- W38exec message-effect: USED own-design (swap-Δ + per-position ablation + shuffle-control; corrected toy 1.0/0.0; W23 mis-spec fixed).
- No conflicts, no precursors, no SKIPs, no covered-by-ref beyond the priced strong-to-weak half.

## Counts (cumulative over 44 verdict strings)
- This round: 6 USED-family (3 USED + 1 contrast + 1 strong + 1 own-design). Historical tags retained (1 USED-CONFLICT resolved, 2 SKIMMED, 2 UNRESOLVED-strings since resolved, 1 SKIPPED-with-teeth, 1 covered-by-reference).
- No new walled primaries (wrong-ID + 404s all recovered by varied retry).

## SKIP-tag table (unchanged)
- dataset-distillation SKIPPED cost-mismatch; Aha SKIMMED no-fit. Both stand; accumulation (W36) reinforces the cost split (keep real + best synthetic, don't replace).

## 3-of-a-kind anti-pattern check
- No triple repeat. Honest negatives remain distinct mechanisms (W23 decoder-intervention, W24 load artifact, W29 boundary form, W31 hand-roll tie, W23-fixed-here). No Anti-Pattern note.

## Conflict ledger
- Both historical conflicts resolved, none open. This round adds zero conflicts; accumulation + scheduled sampling converge with (not against) the fade design.

## New cross-wave convergences (4)
1. Question-driven teaching: Scaffolding teacher-questions + Thompson per-item controller (W29) + skill/mistake bank (W22) = tutor asks, gate answers, bank remembers.
2. Metric stack pinned end-to-end: EGG upstream (correlation, gap-MI, doctests) → emlangkit (pvalue) → F-new rule (log both) → IRT weighting (W31) → swap-Δ causal proof (W38).
3. Stability mechanism closed: quality-filter reconciliation (W3) + accumulation theory (W36) + winner-promotion (G-series) are one claim at three levels.
4. Proof-by-removal twins: W24 erase-then-write (weights) + W38 swap-drop (messages) — causality proven by taking the channel away.

## Spec status
- F-new now fully executable (topsim exact + gap-MI + entropy/MI + message-effect + IRT-weighting + adaptive next-item). F-shortcut upgraded (swap-drop + per-position ablation + margin rule). F-deltanet/F-singlegen/F-skillbank unchanged (source-grade). F-mech still paper-level.

## Watchlist
- 16/16 USED-family across R2+R3+R4 — agreeableness-check still owed. Natural adversarial candidate: strong-to-weak refs (the one primary never opened, wall stands) or DAgger original (W50, completes the OPD pair).
- Log numbering: execution numbers vs backlog-W labels diverged (queue-jumps logged each time); state.json wavesUsed is authoritative.

## Queue effect
- R3 clock 5/5 RESET to 0/5 (now R4 clock 0/5). Backlog unchanged by this jump (16 items). Breadth-first resumes at head W38 GatedDeltaNet impl.
