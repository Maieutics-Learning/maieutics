# External academic review R2 — adjudication (2026-11-16, transcript of student session + reconstructed review)

Source: `scratch/message-attachments/Repository_Review_Transcript.docx` (41,059 B; extraction `scratch/review-ext-r2.txt`, 10,530 chars).
Promoted 2026-11-16 to `src/evidence/reviews/` (this file's provenance section). R1 docx (49,308 B) promoted alongside.
Reviewer saw the post-38ee6c4e snapshot (tools index, three levels, R1 adjudication, F-singlegen full power).
Standing: level-1 conceptual criticism (plus code reading). Rulings below; fixes split into done-now (docs) vs queued (code/behavior/claims).

## Rulings

- F-singlegen optimizer-state charge (spec: weights+Adam; Phase 3: weights-carried/fresh-Adam; "pilots do not establish equivalence"): **PARTIAL-REJECT as framed, ACCEPT the remainder.** Facts: spec v1.0 defined THREE arms (G fresh/fresh; S weights+Adam carried; S-optfresh weights-carried/fresh-Adam) with O3 as the disambiguator. The pilot RAN S-optfresh: s201 SOPT==S both gens, s203 identical rot all arms, s202 SOPT missing on infra timeout; pilot verdict explicitly scoped Phase 3 to {G,S} with S = weights-carried/fresh-Adam and logged "true Adam-carry needs single-eval, tracked"; every phase-3 seed file repeats the justification; paper §8.6 discloses "fresh Adam per gen — pilot showed SOPT==S so optimizer-state is out". This is a disclosed scoping decision on pilot data, not an untested deviation. Fair remainder: the pilot was underpowered for O3 (2 seeds with SOPT data, 600 steps, s202 missing) and true Adam-carry never ran — so O3 keeps the narrower reading (weight-persistence-under-resets sufficient here; optimizer-irrelevance-in-general NOT established). RESULTS_INDEX row (added now) carries that scope note; true Adam-carry stays tracked, unrun.
- Runner/results in scratch → promote + index: **ACCEPTED.** Done now for the small files (runner 3,266 B; results 1,807 B; pilots ~KBs → `src/evidence/synthesis/`, same basenames). ix big blobs (5 probe nets × ~42 MB + 24 finals × ~0.6 MB ≈ 225 MB, 11% of the 2 GB quota) are NOT silently promotable — queued as an explicit quota decision with options.
- RESULTS_INDEX lacked F-singlegen: **ACCEPTED.** Row added now (CONFIRMED full-power O2, O3 scope note).
- "Compounds, not rots" overstates: **PARTIAL.** O2 already surfaced in abstract + §5 (38ee6c4e); the headline phrase itself is a claim-wording change — queued for the user with the reviewer's formulation as the proposal.
- Memory bugs: allowPaths-documented-never-enforced **CONFIRMED** (header advertises, code ignores); scratch-inclusion **CONFIRMED** (only message-attachments excluded); logger-src/ default **CONFIRMED** (default path + rabbithole pointer aim at a file that is now a pointer); RMW-not-atomic + single-writer-unenforced **CONFIRMED-but-self-documented** in-file; lexical/no-recency **CONFIRMED-but-self-documented** (lines 9–12); E2E/gold-harness claims without packaged harnesses **CONFIRMED** (5-case/6-case cited, zero test files in `src/tools/memory/`). All queued as code fixes, not started.
- Websearch bugs: fail-open when `ok:false` without `error` field **CONFIRMED** (line 11 proceeds to read a possibly-stale SAVETO); hardcoded default query **CONFIRMED** (line 5); fixed output paths **CONFIRMED** (lines 6–7, concurrent collision); regex brittleness accepted as engineering judgment; no fixtures **CONFIRMED**. Queued.
- Rabbithole unbounded: **ACCEPTED as documented behavior** (no total budget by default; tangential-by-default; the skill's own 391-wave note admits the stop was user-driven, not native). Fix = finite default cap + stopping rule + tangential opt-in. Queued — behavior change, user call.
- Blind-non-objection ≠ imported/invalid: **ACCEPTED** (adopt the stricter reading going forward; our v3-clarity use stays directional). Fleet versioning: **ACCEPTED** (v8/v9/v10 headers all read "gameplan v7 round 1") — headers corrected + historical marks, done now.
- IX scratch-dependency: **ACCEPTED, already owned** (RESULTS_INDEX caveat, 38ee6c4e). Promotion split tiny/big per above.
- R1 queued-list stale: **ACCEPTED.** Reconciled in the R1 file now (items 1–4 done in 38ee6c4e; 5–6 still user calls).
- Review sources in scratch: **ACCEPTED.** Both docx + both extractions promoted to `src/evidence/reviews/` now (sizes below).
- Tool-category labeling: **PARTIAL** (ix-diagnostics row added 38ee6c4e; fuller labeling rides the core-set decision).
- Repro + cross-family repeats: already planned (2.a / 1.c). No new design.

## Done now (docs only, this session)
1. Promoted `scratch/f-singlegen*.js*` (6 small files) → `src/evidence/synthesis/` (same basenames; seed files' `scratch/` citations now read as pre-promotion paths, noted here).
2. Promoted review sources → `src/evidence/reviews/external-academic-review-r{1,2}.*` (r1 docx 49,308 B; r2 docx 41,059 B; r1 extract 31,589 chars; r2 extract 10,530 chars).
3. RESULTS_INDEX: F-singlegen row + O3 scope note.
4. R1 file queued-list reconciled.
5. `src/CURRENT_TASK.md` (stale Track-A-era, tip 467f90f — the DIVERGED lineage) replaced with a pointer: live record is session-local scratch (never ships); durable state = root README map + RESULTS_INDEX + CHATLOG + GAMEPLAN v22. Memory-SKILL/log.js/rabbithole references to that path now resolve to correct guidance; "do not append here" noted for the logger default.
6. Fleet headers: v8/v9/v10 corrected to own version + historical marks (v7 header was already correct).

## Queued (NOT started — code, behavior, claims, quota)
A. Memory code fixes: enforce/allowPaths (or remove the option), exclude scratch/ from search (or deliberate opt-in), logger src/-enforcement + atomic appends (or documented single-writer discipline), package the 5-case/6-case harnesses as runnable files. (Code — needs testing.)
B. Websearch: fail closed on !ok regardless of error field; missing-query error instead of default query; unique output paths; fixtures. (Code.)
C. Rabbithole: finite default budget + stopping rule + tangential opt-in. (Behavior change — user call.)
D. ix big-blob quota decision: promote ~225 MB (probe nets + finals) vs regenerate-on-demand via frozen ix-pilot recipe (deterministic, bit-exact per spot-checks) vs promote finals-only (~15 MB). (User call.)
E. Paper wording: "compounds, not rots" → narrower formulation (proposal: reviewer's "maintains successful performance across five generations, but a continued-weight student performs comparably — turnover not necessary under the tested conditions", tightened). (Claim language — user call.)
F. Tool core-set + fuller category labeling (user call, with C).
G. Reply to student/reviewers: O3 disclosure pointer (§8.6 + seed files + RESULTS_INDEX row), scratch-vs-durable correction, staleness note on P2.

## Cost
0 bench compute. Adjudication + promotions + pointer/header fixes + CHATLOG entry only.
