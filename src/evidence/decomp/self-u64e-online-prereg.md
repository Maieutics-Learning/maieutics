# U64e-ONLINE (E-NE0f) prereg v1.4 — modulation live, during the exam
**Changelog v1.0→v1.1 (round-1 battery: 10/10 NEEDS-PATCH, 6 adopted; details in
`reviews-u64e/fresh-eyes-self-u64e-v1-barrage-results.md`):** trigger min-condition
(all-8-elevated); firewall reads accRec+stackHash only; F-tree strict priority +
recursion cap; randBlind control arm 110 with demotion teeth (win-paths stay two,
0.041 stands); ORACLE-ONLY non-win one-liner; W0 burn-in guard (b0>50).
**Changelog v1.1→v1.2 (round-2: 10 fresh barrage + 3 staff audit, 9 adopted; details in
`reviews-u64e/fresh-eyes-self-u64e-v2-plus-audit-results.md`):** randBlind stratified
per-window (honest null in scored regions); monitoring declared passive + slot budget
(cost=K/trigger only); hit-window [b,b+20] (lead removed, lag derived); F3-first
rationale (exam-validity precedes arm-diagnosis); LINE-HALT terminal replaces steelman
(driver-enforced stop); burn-in guard dropped → logged W0 check; demotion-proof
one-liner (credited-win ⊆ surBlind-clears); verdict-field machine-readable non-wins;
blindHit role clarified (F2 adjudication).
**Changelog v1.2→v1.3 (red round: 10 claimed kills, 5 adopted; details in
`reviews-u64e/fresh-eyes-self-u64e-v3-red-results.md`):** per-window margin pattern
diagnostic (rec1≈dice predicted, gains rec2/3); hit-rate-gap diagnostic (F2 input);
floor-vestigial one-liner (NEITHER is the real safety valve); generation cap 6
W0-asserted (rotation-proof terminal); termination-lives-in-countersign sentence.
**Changelog v1.3→v1.4 (focused re-close: 3 STANDS / 3 NEEDS-PATCH, 1 adopted; details in
`reviews-u64e/fresh-eyes-self-u64e-v4-reclose-results.md`):** halt-levels gloss
(D6, no behavior change — HALT = run abort, LINE-HALT = line-terminal verdict,
countersign-decline = program halt between generations).

**Track:** U64e (user-ordered 2026-11-27: online-modulation track. Reads filed U64
trunks + U64b exam operators as ARTIFACTS; zero new trains; 20 seeds; log everything).
**Cover:** drafted 2026-11-27 under that order; battery now (pool labor);
COMPUTE (80 reads-only re-evals) UNLICENSED pending fresh countersign on this exact
version. NO PUSH.
**Lesson encoded:** U64b proved a recovery exam separates information from guessing
(E1 20/20). U64c proved training-time modulation doesn't survive freezing (detT−det
≈ 0 both endpoints; explore barely-exploratory) and the old exam is unaskable (floor
trips even for perfect info). U64d proved the combination adds nothing frozen.
Everything so far tested modulation that acts during TRAINING against exams that score
frozen MEMORY. Nothing has ever tested modulation acting LIVE, DURING BEHAVIOR —
which is what real neuromodulation is (it fires while behaving, not while consolidating).

## Design (reads-only on filed U64 trunks; E1 recovery windows ONLY; zero new trains)
- **Exam:** U64b E1 verbatim (50 slots post each filed true boundary, diet-mix verbatim,
  correctness = picked qk ∈ current true hot, fresh qkCount per pass, frozen weights)
  with ONE change: fresh disjoint draws e1Rng `G.makeRng(53500+seed*104729+55+armCode)`
  (new base — no draw overlap with U64b E1 (53100) or U64 training (42000); same
  reads-only-validity argument as U64b I2). E2 SKIPPED by design (ceiling 0.96–1.0
  all arms in U64b/U64d — no headroom; reason filed here so reds need not flag it).
  Masks 91000+seed (U64-eval construction verbatim, filed stream).
- **Why E1 can move where E2/frozen-exams couldn't:** qkCount accumulates WITHIN the
  150-slot pass, so window-1 counts are stale for windows 2–3 (cross-window staleness;
  cf. U64b closeout: det s9 rec1 0.62 → rec3 0.74). A live reset at true boundaries
  clears exactly this staleness. Weights stay frozen — the mechanism under test is
  fast-weight hygiene, not learning.
- **Arms (exam-time policies on frozen trunks; armCodes filed):**
  - orReset (107, ORACLE, diagnostic bar): at each TRUE boundary (filed rule, read never
    redrawn): clear qkCount, exploit immediately (NO explore — pure reset value).
  - surBlind (108, SURPRISE CLOSED-LOOP, primary bar): NO oracle. Rolling monitor:
    per slot, m = mean surprise s over the 6 drawn candidates pre-pick (belief
    uncertainty about the OPTIONS, not the choice; s from u43ScoreRow, filed op).
    Burn-in B0 = mean of m over the pass's first 8 slots. Trigger when trailing-8
    mean(m) > 2×B0 AND trailing-8 MINIMUM(m) > B0 (v1.1 min-condition: all 8 slots
    elevated — kills single-spike false alarms without smuggling in a variance
    estimate; a-priori, enforceable) AND ≥20 steps since last trigger AND ≤6
    triggers/pass (all filed; v1.2: monitoring is PASSIVE — zero slot cost, filed
    sentence. Per-trigger cost = K=10 blind steps only; worst-case blind fraction
    60/150 at cap-6. Refractory-20 is a minimum gap, not a cost);
    derivations: trailing-8 ≈ 1/6 of a 50-slot window — sub-window reaction without
    single-slot jitter; 2× = doubling = standard spike criterion, no calibrated
    constant smuggled in; refractory 20 < min inter-boundary gap (~150) and >
    K(10)+settle; cap 6 = 2× the 3 true switches — bounds cost, false alarms logged).
    On trigger: clear qkCount + BLIND window K=10 steps (pick = uniform-random
    candidate index from dedicated blindRng `G.makeRng(53600+seed*104729+55+108)`;
    weight-blind by construction — no fallback-to-max, EVER; logged blindHit rate
    vs familiar-fraction diagnostic), then exploit.
  - orBlind (109, ORACLE + blind, LOGGED diagnostic, no bar): true-boundary trigger +
    same K=10 blind window. Quantifies live explore cost (informs F2); no verdict role.
  - randBlind (110, RANDOM-TRIGGER control, v1.1 with TEETH; v1.2 stratified): one
    trigger step per recovery window w: step b[w]+1+r.int(50) from `G.makeRng(53800+seed)`
    (filed; v1.2 fix — old 10..140 scheme withdrawn, near-zero window overlap. Same
    scored regions, random timing: the honest null) + same K=10 blind window
    (blindRng base 53600 construction +armCode). Isolates timing: reset+blind at
    RANDOM times vs detected times. TEETH (filed demotion rule): if randBlind clears
    +0.03 @quorum AND surBlind does → CLOSED-LOOP-WORKS DEMOTES to
    TRIGGER-INSENSITIVE (scoped finding: timing doesn't matter, resets do). If
    randBlind clears and surBlind doesn't → MECHANISM-SURPRISE note, verdict stands.
    randBlind CANNOT produce a win (demotion-only) → the EITHER-gate keeps exactly
    two win-paths → 0.041 bound STANDS (v1.2 proof one-liner: credited-win ⊆
    surBlind-clears — demotion only subtracts wins, so the bound is conservative).
- **Ledger per (arm,seed):** {arm, seed, accRec, rec1, rec2, rec3, triggers: [steps],
  nTriggers, hits (triggers within [b,b+20] of a true boundary — v1.2: lead removed,
  triggers fire on post-switch evidence only; lag side K+max-lag+settle derived),
  falseAlarms, detectRate (boundaries with ≥1 hit / 3), meanSurprise per window
  (diagnostic), blindHit (v1.2 role: adjudicates F2 — orBlind-vs-randBlind blindHit
  gap = is blind cost timing-dependent), blindPicks, rule,
  stackHash, examHash, driverHash, wallMs}. Full vector (user: log everything).
- **PIN:** stackHash literal on all 60 re-eval ledgers; rule-ID vs filed U64 rules.

## Bars (quorum 15/20; 20 seeds, not 3)
- **LOOP-CLOSED (primary):** surBlind.accRec ≥ dice.accRec+0.03 @quorum (dice.accRec =
  FILED U64b W1 dice ledgers — reads-only reuse, same seeds; streams differ by filed
  design, distributions identical).
- **RESET-VALUE (diagnostic bar):** orReset.accRec ≥ dice.accRec+0.03 @quorum.
  Joint chance bound (filed, U64b method): P(≥1 of two ~0.021 bars fires by chance)
  ≤ 0.041 conservative — the EITHER-gate stays stringent.
- **FLOOR:** max-arm accRec <0.40 on ≥6/20 → INCONCLUSIVE (same exam as U64b → same
  floor 0.40; sensitivity table 0.35/0.40/0.45 filed at verdict time, verdict follows
  0.40, disagreement → AMBIGUOUS-FLOOR note, verdict frozen; v1.3 vestigial note:
  floor-trip unlikely by construction — resets raise scores and U64b held 20/20 —
  floor kept for same-exam continuity, and the REAL safety valve is
  NEITHER-WITH-DIAGNOSIS; INCONCLUSIVE stays reachable via dice collapse, not via
  live arms).
- **Firewall:** verdict reads ONLY {accRec, stackHash} + filed {dice.accRec} (v1.1:
  triggers removed — trigger logs purely verdict-time diagnostics, never gate inputs).
  detectRate/falseAlarms/meanSurprise/blindHit computed + logged, consulted at verdict
  time only (stated here so reds need not flag look-ahead).

## Waves (COMPLETE-gated)
- **W0:** PIN + determinism twin (same trunk twice incl. monitor state, exact modulo
  wallMs) + trigger-logic unit check (canned surprise vector → filed expected fire
  indices; static, pre-run) + burn-in check (v1.2: LOG min-b0-margin across seeds,
  expected ≥150 — gate dropped as dead code, diagnostic kept) + crash-test +
  examHash COMPUTE-then-FILE + dry-run timing.
  n=3 thin — gate only, never a verdict.
- **W1:** 80 re-evals (4 arms × 20 seeds) + verdict `d-newai-self-u64e-verdict.json`.

## Verdicts (split — labels, never partial wins)
- **CLOSED-LOOP-WORKS** (LOOP-CLOSED @quorum, floor holds → the brain's own surprise
  drives useful modulation; no oracle, no learned sensor).
- **ORACLE-ONLY** (LOOP-CLOSED dead, RESET-VALUE @quorum → mechanism proved live,
  TRIGGER GAP: monitor failed — F4/F5 path, verdict stands. Filed one-liner: a non-win
  label (cf. U64c ADAPT-ONLY); the program's win condition is CLOSED-LOOP-WORKS alone.
  Enforcement: the ledger's `verdict` field LITERALLY reads ORACLE-ONLY (v1.2) —
  downstream citations quote the field; the string is the enforcement, the sentence
  is gloss).
- **TRIGGER-INSENSITIVE** (v1.1 demoted finding: randBlind clears +0.03 @quorum AND
  surBlind does → timing doesn't matter, resets do; scoped, never a win).
- **NEITHER-WITH-DIAGNOSIS** (both dead, floor holds → NOT a kill: file the failure
  shape F1–F5 below with the measured numbers; the shape names the follow-up).
- **INCONCLUSIVE** (floor trips) / **PIN-FAIL** / **HALT** (examHash mismatch) /
  **LINE-HALT** (v1.2 terminal: third consecutive same-shape — line stops, revival
  needs owner order + fresh battery).

## Failure shapes → follow-ups (user-ordered 2026-11-27: diagnose-and-improve, NEVER dead)
Strict priority (v1.1, decided in filed order — first match fires, no ties): F3 floor
> F1 mechanism > F2 blind-cost > F4 monitor > F5 placement. v1.2 rationale filed
(exam-validity precedes arm-diagnosis: no arm question is askable under a tripped
floor — U64c proved the floor binds while edges die; monitor questions presuppose
the mechanism matters, so F1/F2 precede F4/F5). Recursion cap (v1.1; v1.3 TOTAL cap):
each shape max 2 invocations TOTAL across all generations (rotation-proof); each
follow-up verdict carries generation g+1 and its W0 asserts g+1 ≤ 6 else HALT —
max 6 follow-up generations citing U64e shapes, then LINE-HALT (v1.2 terminal state,
driver-enforced — the line STOPS). Revival needs owner order + fresh battery.
Termination (v1.3, red-10): no automatic negative verdict exists BY OWNER ORDER
2026-11-27 (diagnose-and-improve); the program halts iff the owner declines a
follow-up countersign — NO compute without countersign IS the halt (mechanical).
LINE-HALT stops shapes; the countersign gate stops the program. The owner may order
a KILL-LINE close at any time (stated, never pre-authorized). v1.4 halt-levels
gloss (D6, no behavior change): three distinct stops at different levels — HALT =
run abort (examHash mismatch / W0 gate failure: pre-verdict, driver aborts the
run); LINE-HALT = line-terminal verdict (the shape line stops; revival needs
owner order + fresh battery); countersign-decline = program halt between
generations. Countersign-decline is the program-level halt; HALT/LINE-HALT are
run/line-level stops.
- **F1 counts-not-bottleneck** (orReset ≈ dice, margins ~0): fast-weight hygiene buys
  nothing → weight-staleness binds → follow-up U64f prereg: TRAINING-time
  surprise-gated plasticity (LR surge on trigger), new trains.
- **F2 blind-drag** (orBlind < orReset by ≥0.03 mean): live explore costs more than
  reset gains → follow-up U64g prereg: reset-only + K-sweep {3,5,15} (exam-time,
  reads-only, no new trains). v1.3 diagnostic: report the surBlind-vs-randBlind
  blindHit gap at verdict time as one F2 input (among margins, never the arbiter).
- **F3 floor trips** → exam too hard even live → re-examine E1 difficulty.
- **F4 monitor-blind** (oracle works, surprise detectRate <50% or falseAlarms
  >3/pass): monitor failed, not the mechanism → follow-up U64h prereg: monitor
  redesign on FILED surprise traces (reads-only design work).
- **F5 good-detection-no-gain** (detectRate ≥80%, no gain): trigger timing/precision
  insufficient → U64h variant (placement/unit check extension).
- Each follow-up needs its own prereg + battery + countersign. The shape is filed
  at verdict time from measured numbers; no judgment calls.

## Filed expectations (Hypothesis, not bars)
- RESET-VALUE passes: live clearing of cross-window stale counts helps windows 2–3
  (U64b det s9 rec1→rec3 slope says counts matter within-pass; orT's +0.154 adapt
  says resets matter in time). v1.3 filed pattern (diagnostic only): rec1 cannot
  benefit from resets — nothing is stale in window 1 yet — so rec1≈dice is
  predicted, with gains in rec2/3; verdict-time pattern check, never a gate.
- LOOP-CLOSED uncertain: switches SHOULD spike candidate-mean surprise (new-hot
  draws surprise stale weights), but false alarms cost blind windows. Either
  direction is informative — file it, don't tune it (thresholds are principled
  a-priori per derivations above, NOT calibrated to data).
## Falsifiers
- Stream-base changes, K/threshold/refractory/cap moves post-data, E2 added
  post-data, bar moves post-data → new version + battery + countersign.
