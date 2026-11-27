# U64b-EXAM (E-NE0c) prereg v1.3 — punish stale maps harder, same arms, reads-only
**Changelog v1.2→v1.3 (red-team closer round: 8 claimed kills + 2 BAREN; adopted 2 as
mechanical one-liners (R8 ruleDrawCount range assert; R9 examHash compute-then-file
semantics); rejected 6 kill framings with filed derivations — floor-in-null-is-its-job,
OR-gate arithmetic-free, determinism≠leakage, no-invented-verdict-paths, no-IDs-no-leak,
no-discretion-in-frozen-rule; details in
`reviews-u64b/fresh-eyes-self-u64b-v3-red-results.md`):** W0 hardening only. v1.1→v1.2 (round-2: 3 NEEDS-PATCH + 1 audit NEEDS-PATCH / 9 clean; adopted
auditor-(b) FLOOR-ANCHOR only; rejected 8 sub-points with filed derivations — union-bound
direction, tail-test arithmetic, arm-invariant novel set + P(fallback)≈0.0003/seed,
orF-is-oracle, frozen-by-design; details in
`reviews-u64b/fresh-eyes-self-u64b-v2-plus-audit-results.md`):** FLOOR-ANCHOR paragraph. v1.0→v1.1 (round-1 battery: 6 NEEDS-PATCH / 4 IMPLEMENTABLE; adopted B1-floor-deodorize, B2-joint-bound, B5-E2-exactness, B6.1-HALT, B8-ledger-gaps, B10-sensitivity; rejected B1-replacement, B2-inversion, B4-confound-direction, B6.2, B6.4, B9-rival — reasons in `reviews-u64b/fresh-eyes-self-u64b-v1-barrage-results.md`):** E2 draw wording made exact; HALT verdict added (examHash mismatch); floor kept 0.40 as labeled Hypothesis + pre-committed sensitivity diagnostic; joint chance bound filed; ledger spec completed; E1 familiar-fraction clarification filed.

**Track:** U64b (user-ordered 2026-11-27: three independent tracks — exam alone, response
alone, both together; no track gates on another's verdict; 20 seeds per verdict; log everything).
**Cover:** drafted 2026-11-27 under that order; battery now (pool labor, zero trains); COMPUTE
(reads-only re-evals) UNLICENSED pending fresh countersign on this exact version. NO PUSH.
**Lesson encoded:** U64-INCONCLUSIVE proved the stationary final-memory exam washes out
rule-switch training (all arms 0.25–0.52; cheater wins adapt 15/20 but outcomes 4/20). This track
changes ONLY the exam — same 100 filed trunks, zero new trains — so any movement is exam effect,
not arm effect (attribution discipline).

## Design (reads-only on filed U64 trunks; deterministic per seed)
- E1 RECOVERY: for each of the 3 filed true boundaries b (read from filed train-ledger `rule`,
  never redrawn): 50 slots immediately after b. Draws: diet-mix verbatim (U64 diet code) with
  e1Rng `G.makeRng(53100+seed*104729+55+armCode)`, armCodes filed U64 (det 101/dice 102/orT 103/
  orF 104/shT 105); N=150/run (3×50). Metric accRec = correct-hot-pick fraction over 150;
  log rec1/rec2/rec3 per window (log everything).
- E2 TRANSFER: novel 4th rule — hot set drawn from the 6 qk-pairs EXCLUDING the run's 4 used
  sets (2 remain), adjacent-differ vs filed hotSeq[3], redraw ≤20 tries else accept first
  remaining. Draws continue a SINGLE ruleRng instance per seed: driver constructs
  ruleRng = `G.makeRng(64000+seed)`, replays the U64 Wave-0 rule draws verbatim
  (hotSeq[4] + 3 boundaries) first, logs ruleDrawCount, and draws the novel set from that
  state (W0 determinism twin enforces exactness). "First-remaining" = the set with the
  lowest pair-index (0–5 over [{0,1},{0,2},{0,3},{1,2},{1,3},{2,3}]) among sets satisfying
  exclusion + adjacent-differ. N=200 stationary; streams e2Data `G.makeRng(53300+seed)`
  shared across arms (same exam for all arms), masks e2Masks 91400+seed. Metric accTra.
- Ledger per (arm,seed): {arm, seed, accRec, rec1, rec2, rec3, accTra, accRecScr, accRecOrc,
  accTraScr, accTraOrc (same passes, scratch/oracle heads — zero extra cost), novelHot,
  novelCandidates (sets passing exclusion, in pair-index order), ruleDrawCount, rule,
  stackHash, examHash, driverHash, wallMs}. Full vector (user: log everything).
- PIN: stackHash literal on every re-eval ledger (U64 literal); fail → PIN-FAIL.

## Bars (quorum 15/20; 20 seeds, not 3)
- EDGE-E1: orF.accRec ≥ dice.accRec+0.03 @quorum. EDGE-E2: orF.accTra ≥ dice.accTra+0.03 @quorum.
- FLOOR: max-arm accRec <0.40 on ≥6/20 seeds → INCONCLUSIVE (refloored 0.45→0.40:
  recovery windows run below stationary scores by construction — Hypothesis, battery judges).
  Joint chance bound (filed): P(≥1 of the two edge bars fires by chance) ≤ 0.041
  (independence upper bound for two ~0.021 bars; positive correlation across shared
  arms/seeds only lowers the union — the bound is conservative). 0.041 < 0.05: the
  EITHER-gate stays stringent; the two bites do not buy a fluke pass.
  Sensitivity diagnostic (no quorum, verdict-time only): re-tabulates the verdict under
  floors 0.35/0.40/0.45 and files the table. Verdict follows filed 0.40 ONLY; if the table
  disagrees, the closeout files an AMBIGUOUS-FLOOR note (verdict stands frozen —
  instability is disclosed, not re-voted).
  FLOOR-ANCHOR (Hypothesis, assumptions labeled): the floor guards EXAM validity, not arm
  quality (arm quality is the edges' job — even orF must clear the floor; if perfect
  information scores <0.40 the apparatus, not the arms, is broken). Never-adapt null sketch:
  a pick-max arm frozen on the previous quarter's hot set, on diet-mix (75% familiar/new-hot,
  12.5% OOD, 12.5% uniform), scores familiar draws iff its frozen pick lies in the new hot
  set (two distinct 2-sets overlap in {0,1} → P ∈ {0, 0.5}; assumes correct = picked qk ∈
  current hot set — driver asserts the scoring rule in W0), uniform draws w.p. 0.5, OOD
  (qk!=v mismatch) assumed miss. Stuck-null band ≈ 0.06–0.44 by overlap; 0.40 sits at its
  top, i.e. deliberately lenient: it trips only on near-total non-recovery. The filed W1
  dice arm empirically anchors the null; if dice.accRec ≫ 0.40 while others sit below, the
  closeout files the overlap-dependence explicitly rather than re-voting.
- Gate inputs enumerated (firewall): verdict reads ONLY {accRec, accTra, stackHash} +
  filed {adaptEarly}; examHash asserted match per ledger (mismatch → HALT, listed below).
  rec1/2/3, accRecScr/Orc, accTraScr/Orc, novelHot, novelCandidates, ruleDrawCount, wallMs
  computed + logged, never consulted before verdict time (stated here so reds need not
  flag look-ahead).

## Waves (COMPLETE-gated)
- W0: PIN on 3 filed trunks + exam-operator crash-test + re-eval determinism (same trunk twice,
  exact match) + ruleDrawCount range assert (Wave-0 draws < count ≤ Wave-0 draws+20 —
  bounded by construction, assert makes it checked) + examHash COMPUTE-then-FILE (W0 computes
  examHash over exam code+streams+windows (all static pre-run values — no execution required)
  into the W0 ledger; W1 asserts equality with W0's
  filed value — catches inter-wave drift; intra-driver fidelity is by construction +
  determinism twin, same as every wave in this program) + dry-run timing. n=3 thin — gate
  only, never a verdict (skill premise hygiene).
- W1: 100 re-evals (5 arms × 20 seeds, E1+E2) + verdict `d-newai-self-u64b-verdict.json`.

## Verdicts
- PROCEED (either edge @quorum + floor holds → task needs detection; licenses nothing by
  itself — U65 still needs its own countersign) / KILL-LINE (neither edge, floor holds →
  even the punishing exam shows nothing; U65–U69 CANCELLED, close honestly) /
  INCONCLUSIVE (floor trips — exam still too hard or diet too forgiving) / PIN-FAIL /
  HALT (examHash mismatch on any ledger, or determinism-twin mismatch at W0 — distinct from
  PIN-FAIL: PIN-FAIL = trunk identity broken; HALT = exam apparatus broken).
## Filed expectations (Hypothesis, not bars)
- EDGE-E1 passes: orF restricts to the true hot set in-window by construction, so its
  post-switch picks stay correct while dice guesses at the familiar fraction.
  Clarification (filed vs the familiar-fraction worry): the 75%-familiar diet AMPLIFIES the
  E1 gap rather than washing it — stuck arms MISS familiar draws (they pick old-hot while
  the draw is new-hot); adapters hit them. U64's washout mechanism (hot-pick RATE recovery
  by all arms) does not transfer to accuracy. A 0%-familiar probe would measure OOD
  robustness, not recovery — rejected by design, reason filed here.
- EDGE-E2 uncertain: frozen trunks carry stale counts into a novel rule; orF's final map is
  last-quarter-specific. Either direction is informative — file it, don't tune it.
## Falsifiers
- Hot-pair universe change, ±40 jitter change, K/threshold moves post-data → new version +
  battery + countersign (anti-tuning rule).
