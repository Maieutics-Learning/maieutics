# Fresh-eyes U70-F13 v1.0 barrage — results (2026-11-27)

Premise: `src/evidence/u70/premise-u70-f13-v1.0.md` (frozen v1.0). 10 sealed reviewers, one angle each, <=150 words, verdict + hardest test. Verbatims: `f13-battery/r1..r10-*.md`. Score: 8 NEEDS-PATCH / 2 STANDS (R6 scope, R10 rival-with-queued-test).

## Adjudication (owner of verdicts: agent, this session)

- R1 freshness audit (grep 20..39 incl. smoke/sweep history) — ACCEPT. Becomes T5a HALT gate (codebase + filed-ledger grep pre-smoke; any path-use hit = HALT). Filed v1.0 claimed grep-verified; v1.1 makes it executable instead of asserted.
- R2 seed-correlation (s vs s+20 PRNG periodicity) — PARTIAL. mulberry32 distinct-seed independence is a stated assumption; empirical check is the Phase-A oracle ceiling shift (generator coupling would move the oracle too). Permutation-gate rejected as scope creep (doubles compute for a generator-design question, not a brain question).
- R3+R8 bar fairness / oracle comparator (ceiling shift invalidates train-derived bars) — ACCEPT as reporting rule, NOT bar move. v1.1 adds ceiling-shift qualifier: report oracle train-vs-heldout delta; |ctx shift| > 0.05 appends `distribution-shift` qualifier to any verdict. Bars stay locked (moving bars on reviewer opinion alone = tuning-to-reviewers; the math is filed instead).
- R4 cross-engine exact-0 (V8 vs SpiderMonkey, x86 vs ARM rounding) — PARTIAL. Filed determinism is same-engine (same browser, same code path); cross-engine bit-identity explicitly out of scope in v1.1. Replication sanity stays expect-0 same-engine.
- R5 witnessed build (hashes prove identity not integrity) — PARTIAL. Hashes re-labeled PROVENANCE for future auditors, not self-proof; honesty enforced by licensed-wave discipline (frozen driver post-countersign, smoke-then-wave, no selection, no pre-trained weights). Third-party build rejected as scope creep.
- R6 scope STANDS (hash-comparison falsifier) — ACCEPT as confirmation; already covered by replication sanity + hashes. No patch needed.
- R7 verdict gaming (global bias passes; fragile probe hides as DEGRADES) — ACCEPT as gloss. Gap-bar derivation filed: cue-followers score gap ≈ 0 and FAIL gap>0, so GENERALIZES cannot be met by global bias. Probe-fail/ctx+gap-pass subclasses as behavioral per causal diagram.
- R9 halt conditions (no circuit breakers) — ACCEPT. v1.1 adds exhaustive HALT table (T5/T5a/T6/E4 → HALT; non-finite → INVALID row; retention/hash absent or replication delta ≠ 0 → BROKEN; oracle non-determinism → HALT). Training is fixed 200 epochs — no convergence loop exists.
- R10 swap-train + different-PRNG rival — STANDS, test QUEUED as future wave (not this one). Seed-coupled overfitting recorded as the priced rival.

## Patch list (v1.0 → v1.1, one pass)

1. T5a freshness-audit HALT gate. 2. Ceiling-shift qualifier rule (|shift|>0.05). 3. Exhaustive HALT table. 4. Determinism scoping gloss (same-engine). 5. Hash-provenance gloss. 6. Gap-bar derivation gloss. 7. PRNG-independence assumption + oracle-shift check. 8. Swap-PRNG queued rival. No new arms, no bar moves.

Battery: CLOSED on re-close (4/4 STANDS, `fresh-eyes-u70-f13-v1.1-results.md`). F13 STANDS v1.1 — needs FRESH countersign on exact v1.1 before any driver edit/compute. NO compute, NO PUSH this session.
