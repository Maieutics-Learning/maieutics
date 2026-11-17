# Fresh-eyes R1: Detour D1 spelled-keys premise v1 (2026-11-17, 6x barrage)

Premise: `src/evidence/synthesis/fresh-spelled-premise-v1.md` (frozen v1).
Artifact: `src/GAMEPLAN.md` Detour D1 DRAFT 2026-11-17.
Ran: 6 sequential root.generateText calls sharing premise prefix, role-specific TASK suffix (generalist/math/implementation/rival/scope/blindspot), <=150 words each. One preview-reload kill absorbed via retry (generalist). Same-model caveat applies (checklist, not independent confirmation).

## Raw replies (verbatim)

### generalist (retry; first attempt hit preview reload, re-polled clean)
Verdict INCOMPLETE (claims D1a fails rho>=0.6 at 0.5275); confounds pooled-masking; medComp irrelevant without rho; missing random-spelled baseline; killA→killHu assumption; cheapest 50 seeds; hardest novel killHu-spelled with TERM.

### math
Verdict FAIL (cites n=14 rho 0.5275 p 0.0688); length-stratification confound; fresh-seeds≠independent-trials if weights frozen; killA→start linear-hierarchy unproven; hardest n=100 fixed-3 vs max-8 length-matched, pooled≈0.25 chance means local-window attention.

### implementation
Leakage/overfit verdict (cites rho 0.5275 FAIL, pooled 0.82 masking); SEP/TERM ambiguity collapse; tutor-gate→pass unproven; missing random-key baseline for template learning; hardest seed-cross-contamination hybrid 100 seen + 100 novel.

### rival
FAIL mirage verdict (rho/p); hash-match/segmentation shortcut via spatial indexing qn→cn; pooled-pass≠learning, lucky brains; missing position-bias probe; hardest permuted-key probe (shuffle spelled→value mapping, expect 0.25 if shortcut).

### scope
UNPROVEN (cites rho<0.6); p-hack/pool drift via correlated fresh seeds; comparability gap spelled≠atomic; pooled hides variance/luck; missing random-vs-structured baseline; hardest fixed-seed cross-arch 200/brain novel killHu-spelled.

### blindspot
Insufficient-evidence; template-matching risk; length-confound (permute val positions); segmentation gaming fixed-3→max-8 leak (test novel alphabet/TERM); query-framing anchors (shuffle/omit q); rho<0.6 fail means no generalize; cheapest 12-letter zero-shot transfer.

## Adjudication (assistant owns verdict)

Systematic reviewer error (all 6): every reply grades D1 as if atomic run-02 numbers (rho 0.5275, p 0.0688, medComp 0.8875, pooled 0.8217, n=14 seeds 5101-5114) were D1 spelled results. D1 has run ZERO brains. Those numbers are atomic-context only. No bar changes from this error; premise gets a zero-runs banner (patch 1).

- Length-stratification (math) + length-confound permute-val (blindspot): ACCEPT. Patch: D1a reports short-vs-long split even in pilot (patch 3).
- Fresh-seeds≠independent (math "weights frozen"): REJECT — reviewer error. Each brain is a fresh init + fresh 3000-step trajectory; nothing frozen across seeds.
- killA→killHu hierarchy (math/rival/generalist): PARTIAL. Gate is a feasibility start-gate, not a generality proof; sign-flip collapse is why. Patch: label it start-gate explicitly (patch 6).
- n=100 / n=50 demands (math/generalist): REJECT as screening scale. Keep 8-12 + fill bar; scale only after fill (patch 7).
- SEP/TERM ambiguity (implementation): ACCEPT. Patch: freeze exact D1a byte layout + worked example, no TERM in D1a (patch 2).
- Random-key / template-structure baseline (implementation/scope): ACCEPT. Patch: frozen eval-only controls (patch 4).
- Seed-cross-contamination hybrid (implementation): PARTIAL. Threat covered by seed exclusion + lineHash + seed log; keep the hybrid as named sensitivity, not gate.
- Spatial-index shortcut qn→cn (rival): ACCEPT as named rival with teeth. Covered by position-shuffle + permuted-key controls (patch 4).
- Position-bias / permuted-key probes (rival): ACCEPT (patch 4).
- P-hack/pool drift correlated seeds (scope): PARTIAL. Range filter + lineHash + fresh-seed log stand; Actions scale needs pinned Node + new fingerprint (already in detour).
- Comparability spelled≠atomic (scope): AGREE — that is the point. Spelled is a new test, not comparable; paper block stands.
- Pooled-hides-variance (scope/rival): AGREE — design already per-brain graded, pooled record-only. No patch.
- Fixed-seed cross-arch (scope hardest): REJECT as confirmatory — fixed-seed cross-arch is exploratory; allowed quarantined only.
- Segmentation gaming fixed-3→max-8 leak + novel alphabet/TERM (blindspot): ACCEPT in part — 12-letter zero-shot named as cheapest follow-up (patch 5); max-8 stays gated on D1a survival.
- Query-framing shuffle/omit-q (blindspot): ACCEPT as eval-only control (patch 4).
- Template-matching risk (blindspot): ACCEPT — this is what the controls test.
- 12-letter zero-shot cheapest (blindspot): ACCEPT (patch 5).
- Score: 6 reviewers, 8 accepts/partials, 6 rejects (5 misread-D1-as-run02 + 1 over-strict scale + 1 frozen-weights error + 1 fixed-seed-confirmatory), 0 stale-number errors beyond the systematic D1/run02 conflation (premise hygiene patch 1 fixes it).

## Patch list (→ v1.1, one pass)
1. Zero-runs banner: D1 has run 0 brains; run-02 numbers are atomic-context only, never D1 results.
2. Freeze D1a byte layout: exact token order, SEP id, no TERM in D1a; worked example (2 short + 1 long line with ids).
3. D1a reports short-vs-long accuracy split (length-confound visible pre-D1b).
4. Frozen eval-only controls on same pilot brains (no new training): random-key baseline + position-shuffle + permuted-key probe + omit-q.
5. Name 12-letter zero-shot alphabet transfer as cheapest follow-up after fill.
6. Tutor spelled-killA gate labeled start-gate (feasibility), not generality proof.
7. Scale rule: no n=50/100 until 8-12 fill bar passes.
