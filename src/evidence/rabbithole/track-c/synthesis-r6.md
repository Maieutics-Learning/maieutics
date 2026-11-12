# Synthesis R6 — adaptive compute closed end to end (W46exec–W50exec)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Verdicts (5 waves, 6 USED, 0-fetch synthesis)
- W46exec Thompson controller: USED (Beta arms, +0.414 lift; priors spawned).
- W47exec hot-swap hints: USED (records + swap/rollback/quarantine; versioning spawned).
- W48exec adaptive probe: USED (uncertainty-first, 0.0 vs 0.067; stop-schedule spawned).
- W49exec MoR guide: USED (router + KV caching + Middle-Cycle; primary spawned).
- W50exec UT + ACT: USED ×2 (halting lineage roots; ponder cost spawned).
- No conflicts, no precursors, no SKIPs, no covered-by-ref.

## Counts (cumulative over 55 verdict strings)
- This round: 6 USED. Historical tags retained (1 USED-CONFLICT resolved, 2 SKIMMED, 2 UNRESOLVED-strings since resolved, 1 SKIPPED-with-teeth, 1 covered-by-reference, 1 contrast).

## SKIP-tag table (unchanged)
- dataset-distillation SKIPPED cost-mismatch; Aha SKIMMED no-fit. Adaptive compute strengthens the cost split (allocate rented + owned compute by uncertainty).

## 3-of-a-kind anti-pattern check
- No triple repeat. Toys separate cleanly (Thompson +0.414, probe 0.0/0.067, message-effect 1.0/0.0). No Anti-Pattern note.

## Conflict ledger
- Both historical conflicts resolved, none open. Adaptive lineage (ACT→UT→MoR→LoopThink→Thompson) converges with — never contradicts — the fade design.

## New cross-wave convergences (4)
1. One controller, three jobs: Thompson posterior drives hint levels (W46), probe selection (W48), and quarantine (W47) — teaching, measuring, and forgetting share a number.
2. Halting lineage closed at both ends: ACT ponder (cost) → … → MoR router (allocation) → LoopThink adaptive (inference) → Thompson gate (teaching). Every adaptive gate in the project now has a named ancestor.
3. Cache consensus: recursion-wise vs sharing (MoR) + hot-swap indices (W47) + hint library (W44) + RAG hot-swap (W30) = one pattern (keep entries consistent, swap pointers not weights).
4. Triplet consensus: prelude/core/coda = Middle-Cycle unique/tied/unique = our triplet — three independent arrivals, same shape.

## Spec status
- Adaptive stack fully executable (halting rule + metrics + controller + probe + cache). F-new complete (R4) + ponder accounting (W64 queued). F-shortcut complete. F-deltanet: official spec + limitation + adoption banked; kernel (W54) + neg-eigval impl (W55) + Sarrof (W56) + MoR primary (W63) queued. F-mech paper-level (ACT/neg-eigval point the circuits).

## Watchlist
- 27/27 USED-family across R2–R6. Agreeableness-check still owed — DAgger original (W50) + Sarrof (W56) + strong-to-weak refs (wall) are the remaining adversarial candidates.
- Execution-vs-backlog numbering diverged (logged); wavesUsed authoritative (50 → this synthesis = 51).

## Queue effect
- R5 clock 5/5 RESET to 0/5 (now R6 clock 0/5). Backlog unchanged by this jump (17 items). Breadth-first resumes at head W48 teacher-questioning probe.
