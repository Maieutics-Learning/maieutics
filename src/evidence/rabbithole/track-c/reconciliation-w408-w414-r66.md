# Reconciliation — Track C end (W408–W414, R66) + handoff verification (2026-11-12)

Source-of-truth check against the handoff §7 before any paper/nursery change.
Rule: preserve provenance, do not rewrite history. RULES.md wins on procedure;
state.json + log.md + wave notes win on facts.

## 1. Handoff §7 verification — all four staleness observations CONFIRMED

1. `src/steal/papers.md` STATUS frozen at W26 (2026-11-11: "original shelf FULLY READ
   (W19); source-chasing + conservation waves running (W26 done, 26 waves, 33 verdicts)").
   Trail is at 391 waves / 66 syntheses / 359 verdicts / backlog 0 (PUSHED 524fc11).
   papers.md header itself says RULES.md wins on disagreement — so this is a stale
   shelf pointer, not a fork. Fix = status-line patch, not a rewrite.
2. Paper at v0.13 CONFIRMED (`index.html` badge "DRAFT v0.13 — incomplete", 124378 B).
   Meanwhile `src/paper/related-work.md` is draft v0.3 (2026-11-12, "RW series complete:
   +§2.5 Mamba/DeltaNet/DAgger, +TooBig distribution thesis, +AZ verifier quintet,
   +SOAR grounded/well-posedness") — written but NOT yet wired into index.html.
   So the RW work exists; the paper update is pending, nothing is lost.
3. `src/CURRENT_TASK.md` head frozen at "Track A CLOSED; tip 467f90f clean (2026-11-11)".
   It carries no Track C wind-down entry. The newer Track C wind-down note
   ("391 waves, backlog DRAINED") lives in `scratch/CURRENT_TASK.md` — the exact
   recycling-bin violation the 2026-11-11 policy forbids (resident scratch copy is
   supposed to be garbage). Do NOT delete either file retroactively; this note is
   the reconciliation pointer.
4. RULES.md §6 ("every cleared wave spawns ≥1 follow-up, no cap") vs wind-down no-spawn
   from W334 on (R64: "WIND-DOWN: no spawns — the backlog only drains from here",
   R65/R66 repeat, W414 drains 1→0, clock stops at R66 4/5 with "no R67; the wind-down
   outruns the clock, as designed"). This is a deliberate user-set deviation under
   RULES.md §1 (user stop justifies), logged openly in every wave note — not silent
   drift. RULES.md was never amended to add a wind-down clause; a one-line exception
   amendment is owed, not a backdated rule rewrite.

## 2. End-of-track reconstruction (from wave notes + grids + log, not CHATLOG)

| Wave | Backlog move | Direct result (pre-reg verdict) | Rule added |
|---|---|---|---|
| W408 (w345-notch) | 6→5 | s10@1.5 receipt bit-identical vs W328; s11 flat-healthy .997/1.0 (no notch); s7 left-dip-only (.95/.993); s10 clean plateau [1.5,1.625] (.883@1.375, 1.0@1.625); easy ceiling 10/10 | travel-needs-two (both sides filled, second seed shows same shape) |
| W409 (w346-onset) | 5→4 | restore600 .897 / restore1000 .993 double-receipt exact vs W329; restore700 erodes .873 (floor band), restore900 holds .983; edge pinned to (700,900), sharp step (nothing in .93–.97); 700<600 by .024 inside band | floor-band (floors ship band width ~.03 before ranking rungs) |
| R66 (W405–409) | clock FULL→RESET 0/5 | 5/5 USED-with-teeth, 6th straight round no strong; 5 kills: escapee-budget, dip-period, traveling-notch, graded-onset, point-floor; only clean sweep W346 4/4 | close-the-charter, self-killing rules, trespasser-log, travel-needs-two, floor-band |
| W411 (w347-dose) | 4→3 | anchor all-fields exact vs W313; l24 {.577,.647,.610,.647} — healthy-dose hunt closes 0/7 over full set; splits ≥.25 non-monotone; t1000 U min at aw8 (.8367); rescue-order holds | full-set-denominator, worst-dose-agreement |
| W412 (w348-cantor) | 3→2 | triple receipt recMax 0; ladder interleaves strictly inside W331 curve (smooth grade to +50%); tax U-shaped (min .0056/.005 at w=.02, ends +20%/+28%) — pre-reg ±15% flatness falsified at w=.01 | shape-specificity (control earns keep by shape-incompatibility, not flatness) |
| W413 (w349-dent) | 2→1 | N=2 receipt 8/8 exact vs W332; dent .053/.05/0/0 across N{2,4,8,16} (step N4→N8); flrB FA ≤.05 all N; match.15 zero dent; combo FA deepens .093→.12 while repair flat | price-repair-not-breakage (separate curves) |
| W414 (w350-cliff, LAST) | 1→0 DRAINED | 7-anchor receipt clean + phantom rerun true; s11 B=3.16 wall-touch (edge in (150,200), shoulder flat −150→−100); settleB=5; s66 B=0.45 rescued again; worst-seat s44 (3.73, settle null), not s11; path-divergence/bill-equality −150 vs −100 | shoulder-extension, equifinality-quoting |

Scripts/grids cited in notes live in `scratch/track-c/` (w345-notch.js, w346-onset.js,
w347-dose.js, w348-cantor.js, w349-dent.js, w350-cliff.js + grids). Per the 2026-11-11
recycling-bin policy these are regenerable intermediates; the durable references are the
note files + URLs/rig-lineage recorded therein (e.g. "rig 83/83 line-verified from
w328-edge.js"). Exact byte-recovery of scratch blobs is not claimed.

## 3. Relevance filter (paper central question = generational transmission of addressable lookup)

W408–W414 change NOTHING about D1 (0/9), D2 (1/2), D-rate (5/8), D-slow (1/3 rescue),
G1–G5 (35/40). They are bench-lore refinements + refutations (notch doesn't travel,
onset is sharp, floors are bands, dent decays by N8, tax is U not flat, cliff edge
(150,200), worst-seat moves with metric). Paper-relevant only as METHODS discipline:
one-seed≠general, sharp≠grade, floors-as-bands, repair-needs-pricing, travel-needs-two.
Do NOT insert notch/dimple/dent/cliff addresses or N*/tax curves as paper results.

## 4. Independent fresh-eyes check (ran 2026-11-12, pre-handoff, per src/tools/fresh-eyes/SKILL.md)

Barrage, 5 parallel stateless reviewers, shared premise (353/359 USED counts, two-phase
structure, 13 open branches, 6 straight teeth-only rounds), ≤150 words each.
Result: 5/5 PASS-WITH-RESERVATIONS. Unanimous flags: (a) USED-rate label drift —
W22+ sandbox/design USED conflated with literature USED; (b) hardest-test cluster:
sham/shuffled-hint and blind-hint controls + cross-seed validation of slow-rescue.
Ruling: ACCEPT (a) — matches §3 above; PARTIAL on (b) — D1 cold (0/9, soft-targets-only)
is already the no-hint control, F-singlegen (same fade, one continued student vs
fresh-per-generation) is specced incl. pre-registered re-scope but UNRUN, sham-hint
(random-token) never run. So the reviewers' top demands are substantially open.

## 5. Minimal v0.14 proposal (evidence-focused patch, no rewrite; NO index.html edit in this pass)

1. Wire `src/paper/related-work.md` §2.1 novelty-scoping (classroom fading → generational
   ignition-from-zero, 5 points; schedule shape borrowed from Coconut/CGAR) into §2.
2. Add 2–3 sentences to §4.3/§7: seed-dependence + floors-as-bands + sharp boundaries,
   citing W345/W346/W409 only as methods notes.
3. Add claim-to-evidence table for the 5 transmission numbers only (D1/D2/D-rate/D-slow/
   G1–G5): run IDs, seeds, exams (killA≥.60 ∧ killHd≥.55), Wilson CIs, counterexamples
   (s42/s43/s48 shapes; G5 s603/s608). Everything else stays MEASURED-as-is.
4. Keep mechanism + cross-family as open; add F-singlegen as mandatory-control footnote
   (pre-registered re-scope already in related-work.md §2.1 closing).
5. Do NOT promote any W408–W414 address/curve into results. Amend RULES.md with a
   one-line wind-down exception + patch papers.md STATUS line (no history rewrite).

## 6. Nursery mapping (challenge: connect existing components first)

Already exists: L1/L2/L3 ≈ indist/killA vs killHd/Da/Hu + transfer battery
(mid-slot/gap-12/symbol-perm, xfer-results.json) + post-severance eval (gseries.evalSuite/
ignites); failure taxonomy (collapse / memorize-lean / heuristic-lock / slow-rescuable,
§3.1/§4.3); fixed-mixed default with CUT/FAIL verdicts retained (§8.2 4/8vs3/8 CUT,
§8.3 1/8vs3/8 FAIL, §8.4 breeding dies); tutor promotion (highest-Hd→killA→lowest-seed,
§8.1) — but NOT descendant-quality or cross-seed stability; diploma probes (a/b/c,
README Phase 5) but T1–T3 single-family with rivalDesigned:false (recorded out-of-scope
for v0 — correct). Specs never bench-graded: Thompson hint controller (W46), probe
schedule (W68), versioning (W67), cache (W65) → nursery-data-spec stages
propose→shape-check→queue→outcome→version + `src/pool/nursery-data.js` + gseries
FAST_FADE/HINTED/trainFaded. Negative results are constraints — keep them.
Do NOT build a duplicate curriculum manager / diagnostic system / experiment registry;
wire the above first. Tutor-by-descendant-performance is the one genuinely new
selection rule and can be mined from existing G1–G5 ledgers with zero new runs.

## 7. Smallest next experiment (transfer-predictive teaching; pre-reg required)

3 arms first (add failure-rescue arm D only if C wins): A fixed-mixed (control),
B old competence-gated staircase (negative control, already FAIL — rerun as calibration),
C transfer-predictive staircase (held-out-combo probes that memorization cannot game).
Paired seeds 7–14 (comparability with §8.2/§8.3), identical compute (1200-step hinted
recipe), hidden evals = killHd + transfer battery (mid-slot, gap-12, symbol-perm) +
post-severance read. Primary: ignition rate + Wilson CIs. Pre-reg adoption bar:
C beats A by ≥2 ignitions/8 AND holds transfer analogues (else CUT, same rule as §8.2).
Reuses gseries.buildPool/buildExams/trainFaded + nursery-data T1–T3 rows; no new harness.
F-singlegen stays the higher-priority control and is independent of this test.
